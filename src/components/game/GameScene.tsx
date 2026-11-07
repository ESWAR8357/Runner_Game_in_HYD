import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Player } from './Player';
import { World } from './World';
import { ZoneAtmosphere } from './zones/ZoneAtmosphere';
import { useGameStore } from '../../store/gameStore';
import { LANE_WIDTH } from '../../types/game';

// Camera Rig component inside Canvas
const CameraController: React.FC = () => {
  const { camera, size } = useThree();

  const targetPosRef = useRef(new THREE.Vector3());
  const lookAtTargetRef = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    // Dynamic FOV for responsive mobile aspect ratio
    const aspect = size.width / Math.max(1, size.height);
    const targetFov = aspect < 1.0 ? Math.min(80, Math.round(58 / Math.max(0.65, aspect))) : 58;
    const perspCamera = camera as THREE.PerspectiveCamera;
    if (Math.abs(perspCamera.fov - targetFov) > 0.5) {
      perspCamera.fov = targetFov;
      perspCamera.updateProjectionMatrix();
    }

    const store = useGameStore.getState();
    const gameState = store.gameState;
    const currentLane = store.currentLane;
    const isJumping = store.isJumping;
    const playerY = store.playerY;

    if (gameState === 'MENU') {
      // Cinematic hero showcase view
      const targetX = 0;
      const targetY = 1.35;
      const targetZ = 3.4;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 5, delta);

      lookAtTargetRef.current.set(0, 1.15, 0);
      camera.lookAt(lookAtTargetRef.current);
      return;
    }

    if (gameState === 'GAME_OVER') {
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 4.2, 3, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 7.5, 3, delta);
      lookAtTargetRef.current.set(currentLane * LANE_WIDTH * 0.5, 0.8, -1);
      camera.lookAt(lookAtTargetRef.current);
      return;
    }

    // Third-person action hero running perspective
    // Chase camera remains directly behind the hero in their lane (prevents drift to screen edges!)
    const playerX = currentLane * LANE_WIDTH;
    const cameraTargetX = playerX;
    const cameraTargetY = 3.25 + (isJumping ? playerY * 0.2 : 0);
    const cameraTargetZ = 6.0;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraTargetX, 12, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraTargetY, 8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTargetZ, 10, delta);

    // Look straight down the player's lane along the endless Hyderabad road
    targetPosRef.current.set(playerX * 0.65, 1.25 + (isJumping ? playerY * 0.12 : 0), -14);
    camera.lookAt(targetPosRef.current);
  });

  return null;
};

export const GameScene: React.FC = () => {
  const gameState = useGameStore((s) => s.gameState);
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      <Canvas
        shadows={graphicsQuality !== 'low'}
        dpr={graphicsQuality === 'high' ? Math.min(window.devicePixelRatio, 1.5) : graphicsQuality === 'medium' ? 1.0 : 0.85}
        gl={{
          antialias: graphicsQuality !== 'low',
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{ position: [0, 3.2, 6.2], fov: 60 }}
      >
        {/* Dynamic Atmospheric Fog & Sky */}
        <color attach="background" args={['#1c1917']} />
        <fog attach="fog" args={['#1c1917', 35, 140]} />

        {/* Dynamic Zone Lighting Engine */}
        <ZoneAtmosphere />

        {/* Cool Rim / Back Light from Hyderabad skyline */}
        <directionalLight
          position={[-15, 18, -25]}
          intensity={0.8}
          color="#60a5fa"
        />

        {/* Ambient base fill */}
        <ambientLight intensity={0.35} />

        {/* Camera Rig */}
        <CameraController />

        {/* Realistic Action Hero */}
        <Player previewOnly={gameState === 'MENU'} />

        {/* Endless World with 5 Hyderabad Zones */}
        {gameState !== 'MENU' && <World />}
      </Canvas>
    </div>
  );
};
