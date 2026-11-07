import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { LANE_WIDTH } from '../../types/game';
import { HeroModelLoader } from './HeroModelLoader';

interface PlayerProps {
  previewOnly?: boolean;
}

export const Player: React.FC<PlayerProps> = ({ previewOnly = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const gameState = useGameStore((s) => s.gameState);

  const GRAVITY = 32; // m/s^2 natural action jump arc

  const currentXRef = useRef<number>(0);
  const targetXRef = useRef<number>(0);

  // Reset lane position and alignment on game start or restart
  useEffect(() => {
    if (gameState === 'PLAYING' || gameState === 'MENU') {
      currentXRef.current = 0;
      targetXRef.current = 0;
      if (groupRef.current) {
        groupRef.current.position.set(0, 0, 0);
        groupRef.current.rotation.set(0, 0, 0);
      }
    }
  }, [gameState]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (previewOnly) {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      return;
    }

    const store = useGameStore.getState();
    const stState = store.gameState;
    if (stState !== 'PLAYING' && stState !== 'GAME_OVER') {
      return;
    }

    const currentLane = store.currentLane;
    const isJumping = store.isJumping;
    const playerY = store.playerY;

    // 1. Smooth Lane Movement
    targetXRef.current = currentLane * LANE_WIDTH;
    currentXRef.current = THREE.MathUtils.damp(
      currentXRef.current,
      targetXRef.current,
      18,
      delta
    );
    groupRef.current.position.x = currentXRef.current;

    // 2. Jump Physics (Active during gameplay)
    if (stState === 'PLAYING') {
      let currentY = playerY;
      if (isJumping) {
        const currentVel = store.jumpVelocity;
        const newY = currentY + currentVel * delta;
        const newVel = currentVel - GRAVITY * delta;

        if (newY <= 0) {
          currentY = 0;
          store.setPlayerY(0);
          store.setJumping(false);
          useGameStore.setState({ jumpVelocity: 0 });
        } else {
          currentY = newY;
          store.setPlayerY(newY);
          useGameStore.setState({ jumpVelocity: newVel });
        }
      } else {
        currentY = 0;
        store.setPlayerY(0);
      }
      groupRef.current.position.y = currentY;
    }

    // 3. Subtle bank/lean during lane switch (clamped to prevent over-rotation)
    const laneDelta = targetXRef.current - currentXRef.current;
    const targetLean = THREE.MathUtils.clamp(-laneDelta * 0.08, -0.12, 0.12);
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetLean,
      12,
      delta
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* High Quality Realistic Action Hero Model & Skeletal Rig */}
      <HeroModelLoader isMenuPreview={previewOnly} />
    </group>
  );
};
