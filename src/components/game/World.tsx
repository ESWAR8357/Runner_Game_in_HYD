import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoadChunk, CHUNK_LENGTH } from './RoadChunk';
import { Obstacles } from './Obstacles';
import { Coins } from './Coins';
import { PowerUps } from './PowerUps';
import { useGameStore } from '../../store/gameStore';
import { Obstacle, CoinItem, Lane, LANE_WIDTH, ObstacleType } from '../../types/game';
import { PowerUpItem, PowerUpType } from '../../types/powerups';
import { soundManager } from '../../audio/soundManager';

const NUM_CHUNKS = 8;

interface ChunkData {
  id: number;
  z: number;
  index: number;
}

interface LastRowInfo {
  lanes: Lane[];
  types: ObstacleType[];
  openLanes: Lane[];
  z: number;
}

export const World: React.FC = () => {
  const gameState = useGameStore((s) => s.gameState);

  // Chunks state
  const [chunks, setChunks] = useState<ChunkData[]>(() =>
    Array.from({ length: NUM_CHUNKS }, (_, i) => ({
      id: i,
      z: -i * CHUNK_LENGTH + 15,
      index: i,
    }))
  );

  // Group refs for chunks to move them at 60fps without React state reconciliations
  const chunksGroupRef = useRef<THREE.Group>(null);
  const chunksDataRef = useRef<ChunkData[]>([]);

  // Keep data in sync with state
  useEffect(() => {
    chunksDataRef.current = chunks;
  }, [chunks]);

  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsRef = useRef<CoinItem[]>([]);
  const powerupsRef = useRef<PowerUpItem[]>([]);
  const lastRowRef = useRef<LastRowInfo | null>(null);

  // UI sync trigger for spawning/removing items only when lists change
  const [, setEntityTrigger] = useState(0);
  const triggerEntityUpdate = () => setEntityTrigger((t) => (t + 1) % 1000);

  const nextChunkIndexRef = useRef<number>(NUM_CHUNKS);
  const lastStateRef = useRef<string>(gameState);

  // Initialize and reset world on game start
  useEffect(() => {
    if (gameState === 'PLAYING' && lastStateRef.current !== 'PLAYING') {
      obstaclesRef.current = [];
      coinsRef.current = [];
      powerupsRef.current = [];
      lastRowRef.current = null;
      nextChunkIndexRef.current = NUM_CHUNKS;

      const initialChunks = Array.from({ length: NUM_CHUNKS }, (_, i) => ({
        id: i,
        z: -i * CHUNK_LENGTH + 15,
        index: i,
      }));

      chunksDataRef.current = initialChunks;
      setChunks(initialChunks);

      spawnInitialPattern();
      triggerEntityUpdate();
    }
    lastStateRef.current = gameState;
  }, [gameState]);

  const isLaneBlockedAt = (lane: Lane, z: number, margin = 4.0): boolean => {
    return obstaclesRef.current.some(
      (obs) => obs.lane === lane && Math.abs(obs.z - z) < (obs.type === 'VEHICLE' ? margin + 2.0 : margin)
    );
  };

  const spawnInitialPattern = () => {
    // Start with 48–56 world units visibility distance and ~24 units between groups
    let currentZ = -50;
    for (let i = 0; i < 2; i++) {
      spawnObstacleRow(currentZ);
      currentZ -= 24;
    }

    // Guide coins strictly in confirmed open lanes
    let coinZ = -16;
    for (let i = 0; i < 3; i++) {
      spawnCoinLine(coinZ);
      coinZ -= 16;
    }

    // First power-up placed at -72m
    spawnPowerUp(-72);
  };

  const spawnGuideCoins = (lane: Lane, centerZ: number) => {
    if (isLaneBlockedAt(lane, centerZ, 4.0)) return;

    [-3.0, 0, 3.0].forEach((dz, i) => {
      coinsRef.current.push({
        id: `coin-guide-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        lane,
        z: centerZ + dz,
        y: 0.85,
        collected: false,
      });
    });
  };

  const spawnObstacleRow = (z: number) => {
    const allLanes: Lane[] = [-1, 0, 1];
    const types: ObstacleType[] = ['BARRICADE', 'OVERHEAD', 'VEHICLE'];
    const dist = useGameStore.getState().distance;

    // Difficulty Progression:
    // Beginner (< 250m): strictly single obstacles only (0% double)
    // Intermediate (250m - 750m): 18% double obstacle chance
    // Advanced (750m+): 28% double obstacle chance (strictly capped at 28%, never 3)
    let doubleChance = 0;
    if (dist > 750) {
      doubleChance = 0.28;
    } else if (dist > 250) {
      doubleChance = 0.18;
    }

    const isDouble = Math.random() < doubleChance;

    // Guaranteed safe open lane continuity:
    // Ensure the safe lane is reachable without impossible rapid multi-lane hops
    const lastRow = lastRowRef.current;
    let safeLane: Lane;
    if (lastRow && lastRow.openLanes.length > 0) {
      const prevSafe = lastRow.openLanes[Math.floor(Math.random() * lastRow.openLanes.length)];
      // Choose same or adjacent lane for safe path continuity
      const reachableLanes = allLanes.filter((l) => Math.abs(l - prevSafe) <= 1);
      safeLane = reachableLanes[Math.floor(Math.random() * reachableLanes.length)];
    } else {
      safeLane = allLanes[Math.floor(Math.random() * allLanes.length)];
    }

    // Available obstacle lanes (excluding the guaranteed safe lane)
    const obstacleLanes = allLanes.filter((l) => l !== safeLane);
    const primaryLane = obstacleLanes[Math.floor(Math.random() * obstacleLanes.length)];

    // Type selection with fairness checks
    let primaryType: ObstacleType;
    if (dist < 200) {
      // Beginner: Warm-up with simple barricades and overheads only
      primaryType = Math.random() < 0.65 ? 'BARRICADE' : 'OVERHEAD';
    } else if (dist < 600) {
      const r = Math.random();
      primaryType = r < 0.45 ? 'BARRICADE' : r < 0.8 ? 'OVERHEAD' : 'VEHICLE';
    } else {
      primaryType = types[Math.floor(Math.random() * types.length)];
    }

    // Anti-Trap Rule: If last obstacle in this lane was OVERHEAD, do NOT place VEHICLE in the same lane
    if (lastRow) {
      const prevIdx = lastRow.lanes.indexOf(primaryLane);
      if (prevIdx !== -1 && lastRow.types[prevIdx] === 'OVERHEAD' && primaryType === 'VEHICLE') {
        primaryType = 'BARRICADE';
      }
    }

    const newObstacles: Obstacle[] = [];
    newObstacles.push({
      id: `obs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: primaryType,
      lane: primaryLane,
      z,
      y: primaryType === 'OVERHEAD' ? 1.8 : primaryType === 'BARRICADE' ? 0.45 : 0.65,
      width: 2.0,
      height: primaryType === 'OVERHEAD' ? 0.8 : primaryType === 'BARRICADE' ? 0.9 : 1.8,
      depth: primaryType === 'VEHICLE' ? 2.4 : 0.3,
    });

    const spawnedLanes = [primaryLane];
    const spawnedTypes = [primaryType];

    // Double obstacle (never blocking all 3 lanes, always leaving safeLane open)
    if (isDouble && obstacleLanes.length > 1) {
      const secondaryLane = obstacleLanes.find((l) => l !== primaryLane)!;
      let secondaryType: ObstacleType = 'BARRICADE';

      if (primaryType === 'VEHICLE') {
        secondaryType = Math.random() < 0.6 ? 'BARRICADE' : 'OVERHEAD';
      } else if (primaryType === 'OVERHEAD') {
        secondaryType = 'BARRICADE';
      } else {
        secondaryType = Math.random() < 0.5 ? 'BARRICADE' : 'OVERHEAD';
      }

      newObstacles.push({
        id: `obs-sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: secondaryType,
        lane: secondaryLane,
        z,
        y: secondaryType === 'OVERHEAD' ? 1.8 : 0.45,
        width: 2.0,
        height: secondaryType === 'OVERHEAD' ? 0.8 : 0.9,
        depth: 0.3,
      });

      spawnedLanes.push(secondaryLane);
      spawnedTypes.push(secondaryType);
    }

    const openLanes = allLanes.filter((l) => !spawnedLanes.includes(l));

    lastRowRef.current = {
      lanes: spawnedLanes,
      types: spawnedTypes,
      openLanes,
      z,
    };

    obstaclesRef.current.push(...newObstacles);
    triggerEntityUpdate();

    // Spawn guide coins strictly in the safe lane
    if (Math.random() < 0.6) {
      spawnGuideCoins(safeLane, z);
    }
  };

  const spawnCoinLine = (startZ: number) => {
    const allLanes: Lane[] = [-1, 0, 1];
    const count = 3;
    const spacing = 3.0;

    // Filter to lanes that are 100% free of obstacles throughout the coin segment
    const clearLanes = allLanes.filter((lane) => {
      for (let i = 0; i < count; i++) {
        if (isLaneBlockedAt(lane, startZ - i * spacing, 4.0)) return false;
      }
      return true;
    });

    if (clearLanes.length === 0) return; // Zero coins spawned inside obstacles!

    const lane = clearLanes[Math.floor(Math.random() * clearLanes.length)];

    for (let i = 0; i < count; i++) {
      coinsRef.current.push({
        id: `coin-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        lane,
        z: startZ - i * spacing,
        y: 0.85,
        collected: false,
      });
    }
    triggerEntityUpdate();
  };

  const spawnPowerUp = (z: number) => {
    const allLanes: Lane[] = [-1, 0, 1];
    const clearLanes = allLanes.filter((l) => !isLaneBlockedAt(l, z, 5.0));
    if (clearLanes.length === 0) return;

    const lane = clearLanes[Math.floor(Math.random() * clearLanes.length)];
    const types: PowerUpType[] = ['MAGNET', 'SHIELD', 'SPEED_BOOST', 'MULTIPLIER'];
    const type = types[Math.floor(Math.random() * types.length)];

    powerupsRef.current.push({
      id: `pwr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      lane,
      z,
      y: 0.9,
      collected: false,
    });
    triggerEntityUpdate();
  };

  // High-performance game loop (Zero GC & Zero unnecessary React reconciliations)
  useFrame((_, delta) => {
    const store = useGameStore.getState();
    if (store.gameState !== 'PLAYING') return;

    store.updateTick(delta);
    const speed = store.speed;
    const distance = store.distance;
    const currentLane = store.currentLane;
    const playerY = store.playerY;
    const isSliding = store.isSliding;
    const hasShield = store.hasShield;
    const magnetTimer = store.magnetTimer;
    const speedBoostTimer = store.speedBoostTimer;

    const moveDistance = speed * delta;
    const playerX = currentLane * LANE_WIDTH;

    // 1. Move Road Chunks directly in 3D scene
    const chunkData = chunksDataRef.current;
    let wrappedIndex = -1;
    let minZ = 0;

    for (let i = 0; i < chunkData.length; i++) {
      const c = chunkData[i];
      c.z += moveDistance;
      if (c.z < minZ) minZ = c.z;
      if (c.z > 25) {
        wrappedIndex = i;
      }
    }

    // Only update React state when a chunk actually wraps back to the start!
    if (wrappedIndex !== -1) {
      const updatedChunks = chunkData.map((c, idx) => {
        if (idx === wrappedIndex) {
          const wrappedZ = minZ - CHUNK_LENGTH;
          const nextIndex = nextChunkIndexRef.current++;
          return { id: c.id, z: wrappedZ, index: nextIndex };
        }
        return { ...c };
      });
      chunksDataRef.current = updatedChunks;
      setChunks(updatedChunks);
    }

    // 2. Obstacles Movement & Collision
    const obstacles = obstaclesRef.current;
    let obstacleCollided = false;
    let obstaclesChanged = false;
    let minObsZ = 0;

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      const prevZ = obs.z;
      obs.z += moveDistance;

      if (obs.z < minObsZ) {
        minObsZ = obs.z;
      }

      if (prevZ <= 0 && obs.z > 0) {
        store.recordObstacleDodge();
      }

      const isVehicleZ = obs.type === 'VEHICLE' && obs.z > -1.4 && obs.z < 1.4;
      const isNormalZ = Math.abs(obs.z) < 1.05;

      if (isVehicleZ || isNormalZ) {
        if (obs.lane === currentLane) {
          let hit = false;

          if (obs.type === 'BARRICADE') {
            if (playerY < 0.65) hit = true;
          } else if (obs.type === 'OVERHEAD') {
            if (!isSliding || playerY > 0.45) hit = true;
          } else if (obs.type === 'VEHICLE') {
            hit = true;
          }

          if (hit) {
            if (hasShield) {
              store.breakShield();
              obstacles.splice(i, 1);
              obstaclesChanged = true;
              continue;
            } else if (speedBoostTimer > 0 && obs.type === 'BARRICADE') {
              soundManager.playPowerup();
              obstacles.splice(i, 1);
              obstaclesChanged = true;
              continue;
            } else {
              obstacleCollided = true;
              break;
            }
          }
        }
      }

      if (obs.z > 20) {
        obstacles.splice(i, 1);
        obstaclesChanged = true;
      }
    }

    if (obstacleCollided) {
      store.gameOver();
      return;
    }

    // Spawn new obstacles dynamically based on distance, speed, and minObsZ
    // Visibility distance: 48–60 world units (one main obstacle group ahead at a time)
    // Spacing between obstacle groups: 20–25 world units
    const spawnHorizonZ = -Math.min(60, Math.max(48, speed * 2.6));

    if (minObsZ > spawnHorizonZ || obstacles.length < 2) {
      let baseSpacing = 24;
      if (distance > 750) {
        baseSpacing = 20 + Math.random() * 3;
      } else if (distance > 250) {
        baseSpacing = 22 + Math.random() * 3;
      } else {
        baseSpacing = 24 + Math.random() * 3;
      }
      const nextRowZ = Math.min(spawnHorizonZ, minObsZ - baseSpacing);
      spawnObstacleRow(nextRowZ);
      obstaclesChanged = true;
    }

    // 3. Coins Movement & Magnet Pull
    const coins = coinsRef.current;
    const isMagnetActive = magnetTimer > 0;
    let coinsChanged = false;
    let minCoinZ = 0;

    for (let i = coins.length - 1; i >= 0; i--) {
      const coin = coins[i];
      coin.z += moveDistance;

      if (coin.z < minCoinZ) {
        minCoinZ = coin.z;
      }

      if (!coin.collected) {
        if (isMagnetActive && coin.z > -30 && coin.z < 2) {
          const coinX = coin.lane * LANE_WIDTH;
          const targetX = playerX;
          if (Math.abs(coinX - targetX) > 0.2) {
            coin.lane = (coinX < targetX ? coin.lane + 1 : coin.lane - 1) as Lane;
          }
        }

        if (Math.abs(coin.z) < 1.3 && coin.lane === currentLane) {
          const heightDiff = Math.abs(playerY + 0.6 - coin.y);
          if (heightDiff < 1.4) {
            coin.collected = true;
            store.collectCoin();
            coinsChanged = true;
          }
        }
      }

      if (coin.z > 15) {
        coins.splice(i, 1);
        coinsChanged = true;
      }
    }

    // Spawn new coins when horizon recedes, keeping max ~18 coins in the scene
    if ((minCoinZ > -55 || coins.length < 4) && coins.length < 18) {
      const coinSpacing = 18 + Math.random() * 6;
      spawnCoinLine(Math.min(-50, minCoinZ - coinSpacing));
      coinsChanged = true;
    }

    // 4. Power-Ups Movement & Collect
    const powerups = powerupsRef.current;
    let powerupsChanged = false;
    let minPowerUpZ = 0;

    for (let i = powerups.length - 1; i >= 0; i--) {
      const pwr = powerups[i];
      pwr.z += moveDistance;

      if (pwr.z < minPowerUpZ) {
        minPowerUpZ = pwr.z;
      }

      if (!pwr.collected) {
        if (Math.abs(pwr.z) < 1.4 && pwr.lane === currentLane) {
          pwr.collected = true;
          store.collectPowerUp(pwr.type);
          powerupsChanged = true;
        }
      }

      if (pwr.z > 15) {
        powerups.splice(i, 1);
        powerupsChanged = true;
      }
    }

    // Spawn new power-ups periodically (at most 1 active in world at a time)
    if (powerups.length === 0 && minPowerUpZ > -70) {
      spawnPowerUp(-72);
      powerupsChanged = true;
    }

    if (obstaclesChanged || coinsChanged || powerupsChanged) {
      triggerEntityUpdate();
    }
  });

  return (
    <group ref={chunksGroupRef}>
      {chunks.map((chunk) => (
        <RoadChunk
          key={chunk.id}
          zPosition={chunk.z}
          chunkIndex={chunk.index}
        />
      ))}

      <Obstacles obstacles={obstaclesRef.current} />
      <Coins coins={coinsRef.current} />
      <PowerUps powerups={powerupsRef.current} />
    </group>
  );
};
