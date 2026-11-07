import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TELUGU_ACTION_HERO_CONFIG } from '../../config/characterConfig';
import { RealisticActionHero } from './RealisticActionHero';
import { useGameStore } from '../../store/gameStore';

interface HeroModelLoaderProps {
  isMenuPreview?: boolean;
}

// Subcomponent for loading external animated GLTF/GLB models when configured
const ExternalGLTFHero: React.FC<{ url: string; isMenuPreview?: boolean }> = ({ url, isMenuPreview }) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, group);
  const { gameState, isJumping, isSliding } = useGameStore();
  const cfg = TELUGU_ACTION_HERO_CONFIG;

  useEffect(() => {
    // Traverse scene to enable shadows
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    let targetActionName = cfg.animationMap?.run || 'Running';

    if (isMenuPreview || gameState === 'MENU') {
      targetActionName = cfg.animationMap?.idle || cfg.animationMap?.victory || 'Idle';
    } else if (gameState === 'GAME_OVER') {
      targetActionName = cfg.animationMap?.hit || 'Hit';
    } else if (isSliding) {
      targetActionName = cfg.animationMap?.slide || 'Slide';
    } else if (isJumping) {
      targetActionName = cfg.animationMap?.jump || 'Jump';
    }

    const currentAction = actions[targetActionName] || Object.values(actions)[0];
    if (currentAction) {
      currentAction.reset().fadeIn(0.2).play();
    }

    return () => {
      if (currentAction) {
        currentAction.fadeOut(0.2);
      }
    };
  }, [actions, gameState, isJumping, isSliding, isMenuPreview, cfg]);

  useFrame((_, delta) => {
    mixer?.update(delta);
  });

  return (
    <group ref={group} rotation={[0, isMenuPreview ? 0 : Math.PI, 0]}>
      <primitive object={scene} scale={[1, 1, 1]} position={[0, 0, 0]} />
    </group>
  );
};

// Master Loader that routes to GLTF if configured or Procedural Hero
export const HeroModelLoader: React.FC<HeroModelLoaderProps> = ({ isMenuPreview = false }) => {
  const gltfUrl = TELUGU_ACTION_HERO_CONFIG.gltfUrl;

  // If a valid external GLTF/GLB url is configured, load it
  if (gltfUrl && gltfUrl.trim().length > 0) {
    return (
      <React.Suspense fallback={<RealisticActionHero isMenuPreview={isMenuPreview} />}>
        <ExternalGLTFHero url={gltfUrl} isMenuPreview={isMenuPreview} />
      </React.Suspense>
    );
  }

  // Default: Highly detailed procedural Indian mass action hero
  return <RealisticActionHero isMenuPreview={isMenuPreview} />;
};
