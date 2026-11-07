import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { TELUGU_ACTION_HERO_CONFIG } from '../../config/characterConfig';
import { createShirtTexture, createTrousersTexture, createLeatherTexture } from './characterTextures';

interface RealisticActionHeroProps {
  isMenuPreview?: boolean;
}

export const RealisticActionHero: React.FC<RealisticActionHeroProps> = ({ isMenuPreview = false }) => {
  const gameState = useGameStore((s) => s.gameState);
  const costumes = useGameStore((s) => s.costumes);
  const equippedCostumeId = useGameStore((s) => s.equippedCostumeId);

  const cfg = TELUGU_ACTION_HERO_CONFIG;

  // Active equipped costume styling
  const activeCostume = useMemo(() => {
    return costumes.find((c) => c.id === equippedCostumeId) || costumes[0];
  }, [costumes, equippedCostumeId]);

  // Primary Rigs & Joint References
  const rootGroupRef = useRef<THREE.Group>(null);
  const hipsRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);
  const neckRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Limbs
  const leftShoulderRef = useRef<THREE.Group>(null);
  const leftElbowRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const rightElbowRef = useRef<THREE.Group>(null);

  const leftHipRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightHipRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);

  // Power-Up Meshes
  const shieldMeshRef = useRef<THREE.Mesh>(null);
  const speedStreakGroupRef = useRef<THREE.Group>(null);
  const dustGroupRef = useRef<THREE.Group>(null);
  const shadowMeshRef = useRef<THREE.Mesh>(null);

  // Procedural Textures
  const shirtTexture = useMemo(() => createShirtTexture(), []);
  const trousersTexture = useMemo(() => createTrousersTexture(), []);
  const leatherTexture = useMemo(() => createLeatherTexture(), []);

  const animTimeRef = useRef(0);
  const prevYRef = useRef(0);
  const landingTimerRef = useRef(0);
  const collisionTimerRef = useRef(0);

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return;

    const store = useGameStore.getState();
    const speed = store.speed;
    const playerY = store.playerY;
    const isJumping = store.isJumping;
    const isSliding = store.isSliding;
    const hasShield = store.hasShield;
    const magnetTimer = store.magnetTimer;
    const speedBoostTimer = store.speedBoostTimer;
    const multiplierTimer = store.multiplierTimer;
    const specialActionTimer = store.specialActionTimer;

    // Detect landing impact
    if (prevYRef.current > 0.1 && playerY <= 0.01) {
      landingTimerRef.current = 0.18;
    }
    prevYRef.current = playerY;

    if (landingTimerRef.current > 0) {
      landingTimerRef.current -= delta;
    }

    // Power-up visual visibility & rotations
    if (shieldMeshRef.current) {
      shieldMeshRef.current.visible = hasShield;
      if (hasShield) {
        shieldMeshRef.current.rotation.y += delta * 2.5;
        shieldMeshRef.current.rotation.z += delta * 1.5;
      }
    }

    if (speedStreakGroupRef.current) {
      speedStreakGroupRef.current.visible = speedBoostTimer > 0;
      if (speedBoostTimer > 0) {
        speedStreakGroupRef.current.children.forEach((streak, i) => {
          streak.position.z -= delta * 28;
          if (streak.position.z < -2.2) {
            streak.position.z = 1.0 + (i * 0.35);
          }
        });
      }
    }


    if (shadowMeshRef.current) {
      (shadowMeshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.08, 0.48 - playerY * 0.18);
    }

    // ==========================================
    // 1. COLLISION REACTION (GAME OVER)
    // ==========================================
    if (gameState === 'GAME_OVER') {
      collisionTimerRef.current += delta;
      const ct = collisionTimerRef.current;

      // Keep facing along road away from camera
      rootGroupRef.current.rotation.y = Math.PI;

      // Recoil backward upon impact
      rootGroupRef.current.position.y = Math.max(-0.25, -ct * 0.45);
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(rootGroupRef.current.rotation.x, 0.65, 8, delta);
      rootGroupRef.current.rotation.z = THREE.MathUtils.damp(rootGroupRef.current.rotation.z, 0.35, 6, delta);

      if (spineRef.current) spineRef.current.rotation.x = 0.25;
      if (headRef.current) headRef.current.rotation.x = 0.4;
      if (leftShoulderRef.current) {
        leftShoulderRef.current.rotation.x = 1.0;
        leftShoulderRef.current.rotation.z = -0.8;
      }
      if (rightShoulderRef.current) {
        rightShoulderRef.current.rotation.x = 1.0;
        rightShoulderRef.current.rotation.z = 0.8;
      }
      if (leftHipRef.current) leftHipRef.current.rotation.x = -0.6;
      if (rightHipRef.current) rightHipRef.current.rotation.x = 0.7;
      return;
    } else {
      collisionTimerRef.current = 0;
    }

    // ==========================================
    // 2. MAIN MENU MODE (360 HERO SHOWCASE)
    // ==========================================
    if (isMenuPreview || gameState === 'MENU') {
      animTimeRef.current += delta * 1.5;
      const t = animTimeRef.current;

      // Smooth 360 turntable spin to inspect hero from all angles
      rootGroupRef.current.position.set(0, 0, 0);
      rootGroupRef.current.rotation.set(0, t * 0.6, 0);

      if (hipsRef.current) hipsRef.current.position.y = 0.95 + Math.sin(t * 1.8) * 0.012;
      if (chestRef.current) chestRef.current.rotation.x = Math.sin(t * 1.8) * 0.02; // breathing
      if (headRef.current) headRef.current.rotation.x = 0.05 + Math.sin(t * 1.2) * 0.02;

      // Right arm adjusts sunglasses swagger
      if (rightShoulderRef.current && rightElbowRef.current) {
        const gesture = Math.sin(t * 0.7);
        rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(-1.1, -1.35, (gesture + 1) / 2);
        rightShoulderRef.current.rotation.z = THREE.MathUtils.lerp(0.3, 0.5, (gesture + 1) / 2);
        rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(-1.4, -1.7, (gesture + 1) / 2);
      }
      // Left arm resting firmly on hip
      if (leftShoulderRef.current && leftElbowRef.current) {
        leftShoulderRef.current.rotation.x = -0.2;
        leftShoulderRef.current.rotation.z = -0.45;
        leftElbowRef.current.rotation.x = -0.8;
      }
      if (leftHipRef.current) {
        leftHipRef.current.rotation.x = 0.05;
        leftHipRef.current.rotation.z = -0.08;
      }
      if (rightHipRef.current) {
        rightHipRef.current.rotation.x = -0.05;
        rightHipRef.current.rotation.z = 0.08;
      }
      return;
    }

    // ==========================================
    // CRITICAL: GAMEPLAY ORIENTATION (FORWARD = -Z)
    // The player MUST face down the road (World -Z)
    // away from the chase camera (World +Z).
    // In local space, the model's front is +Z.
    // Therefore, rotation.y MUST be Math.PI (180°)!
    // ==========================================
    rootGroupRef.current.rotation.y = Math.PI;
    rootGroupRef.current.position.x = 0; // Handled by Player.tsx lane controller

    // ==========================================
    // 3. CINEMATIC SPECIAL ACTION (POWER-UP PUNCH)
    // ==========================================
    if (specialActionTimer > 0 && gameState === 'PLAYING') {
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(rootGroupRef.current.rotation.x, -0.08, 15, delta);
      if (hipsRef.current) hipsRef.current.position.y = 1.05;
      if (chestRef.current) chestRef.current.rotation.x = 0.15; // puffed chest
      if (headRef.current) headRef.current.rotation.x = 0.2; // head looking up

      // Skyward power punch
      if (rightShoulderRef.current && rightElbowRef.current) {
        rightShoulderRef.current.rotation.x = 2.6; // punched straight up
        rightShoulderRef.current.rotation.z = 0.2;
        rightElbowRef.current.rotation.x = -0.1;
      }
      if (leftShoulderRef.current && leftElbowRef.current) {
        leftShoulderRef.current.rotation.x = -0.6;
        leftShoulderRef.current.rotation.z = -0.5;
        leftElbowRef.current.rotation.x = -1.6;
      }
      return;
    }

    // ==========================================
    // 4. SLIDING ANIMATION
    // ==========================================
    if (isSliding) {
      // Lean backward in slide
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(rootGroupRef.current.rotation.x, 0.7, 16, delta);
      if (hipsRef.current) hipsRef.current.position.y = 0.42;
      if (spineRef.current) spineRef.current.rotation.x = 0.2;

      // Right leg extended forward on heel
      if (rightHipRef.current && rightKneeRef.current) {
        rightHipRef.current.rotation.x = -1.35;
        rightHipRef.current.rotation.z = 0.1;
        rightKneeRef.current.rotation.x = 0.12;
      }
      // Left leg tucked under knee
      if (leftHipRef.current && leftKneeRef.current) {
        leftHipRef.current.rotation.x = 0.45;
        leftHipRef.current.rotation.z = -0.3;
        leftKneeRef.current.rotation.x = 1.5;
      }
      // Hands low for balance
      if (leftShoulderRef.current && leftElbowRef.current) {
        leftShoulderRef.current.rotation.x = 0.6;
        leftShoulderRef.current.rotation.z = -0.5;
        leftElbowRef.current.rotation.x = -0.4;
      }
      if (rightShoulderRef.current && rightElbowRef.current) {
        rightShoulderRef.current.rotation.x = 0.7;
        rightShoulderRef.current.rotation.z = 0.4;
        rightElbowRef.current.rotation.x = -0.2;
      }

      // Trailing dust particles behind the hero (toward local -Z)
      if (dustGroupRef.current) {
        dustGroupRef.current.visible = true;
        dustGroupRef.current.children.forEach((child, i) => {
          child.position.z -= delta * 16;
          child.position.x = (i % 2 === 0 ? 0.3 : -0.3) + Math.sin(animTimeRef.current * 10 + i) * 0.12;
          if (child.position.z < -2.2) {
            child.position.z = -0.3 - Math.random() * 0.3;
          }
        });
      }
      return;
    } else {
      if (dustGroupRef.current) dustGroupRef.current.visible = false;
    }

    // ==========================================
    // 5. JUMPING ANIMATION
    // ==========================================
    if (isJumping) {
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(rootGroupRef.current.rotation.x, -0.06, 12, delta);
      if (hipsRef.current) hipsRef.current.position.y = 0.98;
      if (spineRef.current) spineRef.current.rotation.x = -0.1;

      // Dynamic airborne posture
      if (leftHipRef.current && leftKneeRef.current) {
        leftHipRef.current.rotation.x = 0.55;
        leftKneeRef.current.rotation.x = 1.1;
      }
      if (rightHipRef.current && rightKneeRef.current) {
        rightHipRef.current.rotation.x = -0.7;
        rightKneeRef.current.rotation.x = 0.35;
      }
      if (leftShoulderRef.current && leftElbowRef.current) {
        leftShoulderRef.current.rotation.x = 0.7;
        leftShoulderRef.current.rotation.z = -0.4;
        leftElbowRef.current.rotation.x = -0.6;
      }
      if (rightShoulderRef.current && rightElbowRef.current) {
        rightShoulderRef.current.rotation.x = -0.8;
        rightShoulderRef.current.rotation.z = 0.3;
        rightElbowRef.current.rotation.x = -1.2;
      }
      return;
    }

    // ==========================================
    // 6. LANDING SHOCK ABSORPTION
    // ==========================================
    if (landingTimerRef.current > 0) {
      const comp = landingTimerRef.current / 0.18;
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(rootGroupRef.current.rotation.x, -0.15, 20, delta);
      if (hipsRef.current) hipsRef.current.position.y = 0.95 - comp * 0.2;

      if (leftHipRef.current && leftKneeRef.current) {
        leftHipRef.current.rotation.x = -comp * 0.4;
        leftKneeRef.current.rotation.x = comp * 0.85;
      }
      if (rightHipRef.current && rightKneeRef.current) {
        rightHipRef.current.rotation.x = -comp * 0.4;
        rightKneeRef.current.rotation.x = comp * 0.85;
      }
      if (leftShoulderRef.current) leftShoulderRef.current.rotation.z = -0.3 - comp * 0.3;
      if (rightShoulderRef.current) rightShoulderRef.current.rotation.z = 0.3 + comp * 0.3;
      return;
    }

    // ==========================================
    // 7. CONTINUOUS RUNNING SKELETAL ANIMATION
    // Natural athletic human running gait:
    // - Forward pitch: -0.09 rad (torso pitched toward local +Z)
    // - Alternating hips and knees
    // - Counter-swinging arms with dynamic elbow flex
    // - Torso counter-rotation and pelvic bob
    // ==========================================
    const runCycleRate = (speed / 18) * 16.5;
    animTimeRef.current += delta * runCycleRate;
    const t = animTimeRef.current;

    // Upright body with confident forward running lean
    rootGroupRef.current.rotation.x = THREE.MathUtils.damp(rootGroupRef.current.rotation.x, -0.09, 15, delta);

    // Vertical pelvic bounce (double bounce per full stride)
    const bob = Math.abs(Math.sin(t)) * 0.055;
    if (hipsRef.current) {
      hipsRef.current.position.y = 0.95 + bob;
      hipsRef.current.rotation.y = Math.cos(t) * 0.08; // subtle hip sway
    }

    // Spine counter-rotates against hips for athletic realism
    if (spineRef.current) {
      spineRef.current.rotation.y = -Math.cos(t) * 0.12;
      spineRef.current.rotation.z = Math.sin(t) * 0.03;
    }

    // Head stabilizes facing forward down the road
    if (headRef.current) {
      headRef.current.rotation.y = Math.cos(t) * 0.03;
      headRef.current.rotation.x = -0.04;
    }

    // Stride value: oscillates smoothly between -1 and +1
    const stride = Math.sin(t);

    // ==========================================
    // LEGS KINEMATICS:
    // Negative X rotation = thigh swings FORWARD (toward local +Z)
    // Positive X rotation = thigh swings BACKWARD (toward local -Z)
    // Positive knee rotation = knee bends BACKWARD
    // ==========================================
    if (leftHipRef.current && leftKneeRef.current) {
      // Left leg: stride < 0 is forward swing, stride > 0 is backward push
      leftHipRef.current.rotation.x = stride * 0.72;
      // When leg is pushing backward (stride > 0), knee bends deeply (+1.25 rad)
      // When leg is driving forward (stride < 0), knee extends (0.15 rad)
      leftKneeRef.current.rotation.x = stride > 0 ? 0.2 + stride * 1.15 : 0.15;
    }

    if (rightHipRef.current && rightKneeRef.current) {
      // Right leg: opposite phase (-stride)
      rightHipRef.current.rotation.x = -stride * 0.72;
      rightKneeRef.current.rotation.x = -stride > 0 ? 0.2 + (-stride) * 1.15 : 0.15;
    }

    // ==========================================
    // ARMS KINEMATICS:
    // Swing in strict OPPOSITION to corresponding leg
    // Left arm swings forward when left leg is backward (stride > 0)
    // Forward swing = negative X rotation
    // ==========================================
    if (leftShoulderRef.current && leftElbowRef.current) {
      leftShoulderRef.current.rotation.x = -stride * 0.7;
      leftShoulderRef.current.rotation.z = -0.15;
      // Elbow flexes more sharply on forward drive (-1.35 rad)
      leftElbowRef.current.rotation.x = stride > 0 ? -1.35 : -0.55;
    }

    if (rightShoulderRef.current && rightElbowRef.current) {
      rightShoulderRef.current.rotation.x = stride * 0.7;
      rightShoulderRef.current.rotation.z = 0.15;
      rightElbowRef.current.rotation.x = -stride > 0 ? -1.35 : -0.55;
    }
  });

  return (
    <group ref={rootGroupRef} rotation={[0, isMenuPreview ? 0 : Math.PI, 0]}>
      {/* 1. HERO SHIELD ENERGY BUBBLE */}
      <mesh ref={shieldMeshRef} position={[0, 1.0, 0]} visible={false}>
        <sphereGeometry args={[1.25, 16, 16]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.6}
          transparent
          opacity={0.35}
          wireframe
        />
      </mesh>

      {/* 2. SPEED BOOST WARP STREAKS (Rushing past hero toward local -Z) */}
      <group ref={speedStreakGroupRef} visible={false}>
        {[-0.6, -0.2, 0.2, 0.6].map((sx, i) => (
          <mesh key={`warp-${i}`} position={[sx, 0.9, 0.6 - i * 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.6, 6]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Slide Dust Particles (Trailing toward local -Z behind the runner) */}
      <group ref={dustGroupRef} visible={false}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[(i % 2 === 0 ? 0.3 : -0.3), 0.08, -0.4 - i * 0.3]}>
            <sphereGeometry args={[0.09 + (i % 3) * 0.04, 8, 8]} />
            <meshBasicMaterial color="#e2e8f0" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Main Hips Root (Pivoted at pelvic center ~0.95m from ground) */}
      <group ref={hipsRef} position={[0, 0.95, 0]}>
        
        {/* Pelvis & Waistband */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.16, 0.28]} />
          <meshStandardMaterial
            map={trousersTexture}
            color={activeCostume.trousersColor}
            roughness={0.8}
          />
        </mesh>

        {/* Polished Leather Belt with Golden Buckle */}
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.43, 0.06, 0.29]} />
          <meshStandardMaterial
            map={leatherTexture}
            color="#271c19"
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.09, 0.15]}>
          <boxGeometry args={[0.13, 0.07, 0.02]} />
          <meshStandardMaterial
            color={activeCostume.jewelryGoldColor}
            metalness={0.92}
            roughness={0.15}
          />
        </mesh>

        {/* Spine Root */}
        <group ref={spineRef} position={[0, 0.12, 0]}>
          {/* Lower Torso / Shirt Waist */}
          <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.2, 0.28, 16]} />
            <meshStandardMaterial
              map={shirtTexture}
              color={activeCostume.shirtColor}
              roughness={cfg.appearance.shirtRoughness}
            />
          </mesh>

          {/* Chest & Broad Athletic Shoulders */}
          <group ref={chestRef} position={[0, 0.28, 0]}>
            <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.28, 0.23, 0.32, 16]} />
              <meshStandardMaterial
                map={shirtTexture}
                color={activeCostume.shirtColor}
                roughness={cfg.appearance.shirtRoughness}
              />
            </mesh>

            {/* Formal Folded Shirt Collar */}
            <mesh position={[0, 0.32, 0.05]} rotation={[0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.3, 0.08, 0.22]} />
              <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.3} />
            </mesh>
            <mesh position={[-0.09, 0.29, 0.15]} rotation={[0.1, 0.3, -0.2]}>
              <boxGeometry args={[0.08, 0.12, 0.03]} />
              <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.3} />
            </mesh>
            <mesh position={[0.09, 0.29, 0.15]} rotation={[0.1, -0.3, 0.2]}>
              <boxGeometry args={[0.08, 0.12, 0.03]} />
              <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.3} />
            </mesh>

            {/* Left Breast Pocket with Gold Pen Clip */}
            <mesh position={[-0.12, 0.16, 0.17]} rotation={[0, 0.22, 0]}>
              <boxGeometry args={[0.08, 0.09, 0.015]} />
              <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.3} />
            </mesh>
            <mesh position={[-0.14, 0.19, 0.185]}>
              <boxGeometry args={[0.012, 0.045, 0.01]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
            </mesh>

            {/* Exposed Neck / Chest */}
            <mesh position={[0, 0.27, 0.12]}>
              <boxGeometry args={[0.12, 0.09, 0.05]} />
              <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.6} />
            </mesh>

            {/* Golden Mass Hero Chain & Lion Medallion */}
            <mesh position={[0, 0.25, 0.15]} rotation={[0.2, 0, 0]}>
              <torusGeometry args={[0.085, 0.015, 8, 20, Math.PI]} />
              <meshStandardMaterial
                color={activeCostume.jewelryGoldColor}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            <mesh position={[0, 0.16, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.038, 0.038, 0.012, 16]} />
              <meshStandardMaterial
                color={activeCostume.jewelryGoldColor}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>

            {/* Neck */}
            <group ref={neckRef} position={[0, 0.32, 0]}>
              <mesh position={[0, 0.06, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.11, 0.14, 12]} />
                <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.6} />
              </mesh>

              {/* Head & Facial Sculpt (Facing local +Z) */}
              <group ref={headRef} position={[0, 0.17, 0]}>
                <mesh position={[0, 0.09, 0]} castShadow>
                  <sphereGeometry args={[0.18, 20, 20]} />
                  <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.65} />
                </mesh>
                <mesh position={[0, 0.03, 0.05]} castShadow>
                  <boxGeometry args={[0.24, 0.16, 0.2]} />
                  <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.65} />
                </mesh>
                <mesh position={[0, 0.09, 0.19]}>
                  <boxGeometry args={[0.045, 0.07, 0.05]} />
                  <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.6} />
                </mesh>
                <mesh position={[-0.19, 0.08, -0.01]}>
                  <boxGeometry args={[0.03, 0.08, 0.05]} />
                  <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.7} />
                </mesh>
                <mesh position={[0.19, 0.08, -0.01]}>
                  <boxGeometry args={[0.03, 0.08, 0.05]} />
                  <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.7} />
                </mesh>

                {/* Curved Balayya Mustache */}
                <mesh position={[0, 0.025, 0.195]}>
                  <boxGeometry args={[0.19, 0.045, 0.04]} />
                  <meshStandardMaterial color={cfg.appearance.hairColor} roughness={0.9} />
                </mesh>
                <mesh position={[-0.095, 0.015, 0.19]} rotation={[0, 0, 0.35]}>
                  <boxGeometry args={[0.06, 0.035, 0.03]} />
                  <meshStandardMaterial color={cfg.appearance.hairColor} roughness={0.9} />
                </mesh>
                <mesh position={[0.095, 0.015, 0.19]} rotation={[0, 0, -0.35]}>
                  <boxGeometry args={[0.06, 0.035, 0.03]} />
                  <meshStandardMaterial color={cfg.appearance.hairColor} roughness={0.9} />
                </mesh>

                {/* Aviator Sunglasses with Gold Frame & Glossy Tint */}
                <group position={[0, 0.11, 0.19]}>
                  <mesh position={[-0.075, 0, 0]}>
                    <sphereGeometry args={[0.062, 16, 12]} />
                    <meshStandardMaterial
                      color="#050810"
                      roughness={0.04}
                      metalness={0.95}
                    />
                  </mesh>
                  <mesh position={[0.075, 0, 0]}>
                    <sphereGeometry args={[0.062, 16, 12]} />
                    <meshStandardMaterial
                      color="#050810"
                      roughness={0.04}
                      metalness={0.95}
                    />
                  </mesh>
                  {/* Gold Brow Bar */}
                  <mesh position={[0, 0.048, 0.02]}>
                    <boxGeometry args={[0.24, 0.016, 0.02]} />
                    <meshStandardMaterial
                      color="#f59e0b"
                      metalness={0.98}
                      roughness={0.12}
                    />
                  </mesh>
                  {/* Bridge */}
                  <mesh position={[0, 0.01, 0.02]}>
                    <boxGeometry args={[0.035, 0.015, 0.02]} />
                    <meshStandardMaterial
                      color="#f59e0b"
                      metalness={0.98}
                      roughness={0.12}
                    />
                  </mesh>
                  {/* Temples */}
                  <mesh position={[-0.125, 0.02, -0.09]} rotation={[0, -0.15, 0]}>
                    <boxGeometry args={[0.012, 0.012, 0.18]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.12} />
                  </mesh>
                  <mesh position={[0.125, 0.02, -0.09]} rotation={[0, 0.15, 0]}>
                    <boxGeometry args={[0.012, 0.012, 0.18]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.12} />
                  </mesh>
                </group>

                {/* Iconic Balayya Hairstyle - Voluminous Swept-Back Pompadour */}
                <group position={[0, 0.19, -0.01]}>
                  {/* Main Crown Volume */}
                  <mesh position={[0, 0.06, 0.01]} castShadow>
                    <sphereGeometry args={[0.2, 18, 18]} />
                    <meshStandardMaterial color={cfg.appearance.hairColor} roughness={0.85} />
                  </mesh>
                  {/* Swept-Back Front Wave */}
                  <mesh position={[0.02, 0.09, 0.11]} rotation={[-0.25, 0.1, -0.05]} castShadow>
                    <boxGeometry args={[0.26, 0.12, 0.14]} />
                    <meshStandardMaterial color={cfg.appearance.hairColor} roughness={0.85} />
                  </mesh>
                  {/* Side Parting Ridge */}
                  <mesh position={[-0.1, 0.12, 0.08]} rotation={[-0.15, 0, 0.1]}>
                    <boxGeometry args={[0.06, 0.08, 0.16]} />
                    <meshStandardMaterial color={cfg.appearance.hairColor} roughness={0.9} />
                  </mesh>
                  {/* Back & Nape */}
                  <mesh position={[0, -0.06, -0.1]} castShadow>
                    <boxGeometry args={[0.28, 0.24, 0.14]} />
                    <meshStandardMaterial color={cfg.appearance.hairColor} roughness={0.9} />
                  </mesh>
                  {/* Sideburns */}
                  <mesh position={[-0.18, -0.07, 0.04]}>
                    <boxGeometry args={[0.035, 0.12, 0.06]} />
                    <meshStandardMaterial color={cfg.appearance.hairColor} roughness={0.9} />
                  </mesh>
                  <mesh position={[0.18, -0.07, 0.04]}>
                    <boxGeometry args={[0.035, 0.12, 0.06]} />
                    <meshStandardMaterial color={cfg.appearance.hairColor} roughness={0.9} />
                  </mesh>
                </group>
              </group>
            </group>

            {/* Left Arm Rig (Local X = -0.33) */}
            <group ref={leftShoulderRef} position={[-0.33, 0.24, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <sphereGeometry args={[0.11, 16, 16]} />
                <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.4} />
              </mesh>
              <mesh position={[-0.03, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.08, 0.26, 16]} />
                <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.4} />
              </mesh>
              <mesh position={[-0.03, -0.28, 0]} castShadow>
                <cylinderGeometry args={[0.105, 0.105, 0.07, 16]} />
                <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.3} />
              </mesh>

              <group ref={leftElbowRef} position={[-0.03, -0.32, 0]}>
                <mesh position={[0, -0.14, 0]} castShadow>
                  <cylinderGeometry args={[0.075, 0.06, 0.26, 14]} />
                  <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.6} />
                </mesh>
                <mesh position={[0, -0.25, 0]}>
                  <cylinderGeometry args={[0.07, 0.07, 0.045, 16]} />
                  <meshStandardMaterial
                    color={cfg.appearance.watchColor}
                    metalness={0.95}
                    roughness={0.15}
                  />
                </mesh>
                <mesh position={[0, -0.33, 0]} castShadow>
                  <boxGeometry args={[0.09, 0.1, 0.07]} />
                  <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.6} />
                </mesh>
              </group>
            </group>

            {/* Right Arm Rig (Local X = 0.33) */}
            <group ref={rightShoulderRef} position={[0.33, 0.24, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <sphereGeometry args={[0.11, 16, 16]} />
                <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.4} />
              </mesh>
              <mesh position={[0.03, -0.16, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.08, 0.26, 16]} />
                <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.4} />
              </mesh>
              <mesh position={[0.03, -0.28, 0]} castShadow>
                <cylinderGeometry args={[0.105, 0.105, 0.07, 16]} />
                <meshStandardMaterial color={activeCostume.shirtColor} roughness={0.3} />
              </mesh>

              <group ref={rightElbowRef} position={[0.03, -0.32, 0]}>
                <mesh position={[0, -0.14, 0]} castShadow>
                  <cylinderGeometry args={[0.075, 0.06, 0.26, 14]} />
                  <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.6} />
                </mesh>
                <mesh position={[0.03, -0.32, 0.03]}>
                  <boxGeometry args={[0.025, 0.02, 0.025]} />
                  <meshStandardMaterial
                    color={activeCostume.jewelryGoldColor}
                    metalness={0.95}
                    roughness={0.15}
                  />
                </mesh>
                <mesh position={[0, -0.33, 0]} castShadow>
                  <boxGeometry args={[0.09, 0.1, 0.07]} />
                  <meshStandardMaterial color={cfg.appearance.skinTone} roughness={0.6} />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* Left Leg Rig (Local X = -0.14) */}
        <group ref={leftHipRef} position={[-0.14, -0.06, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.1, 0.44, 16]} />
            <meshStandardMaterial
              map={trousersTexture}
              color={activeCostume.trousersColor}
              roughness={0.85}
            />
          </mesh>

          <group ref={leftKneeRef} position={[0, -0.44, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.095, 0.08, 0.4, 16]} />
              <meshStandardMaterial
                map={trousersTexture}
                color={activeCostume.trousersColor}
                roughness={0.85}
              />
            </mesh>
            <mesh position={[0, -0.38, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
              <meshStandardMaterial color="#090d16" roughness={0.9} />
            </mesh>

            {/* Left Foot / Boot (Facing local +Z) */}
            <group position={[0, -0.42, 0.04]}>
              <mesh position={[0, 0.03, 0.04]} castShadow>
                <boxGeometry args={[0.13, 0.09, 0.28]} />
                <meshStandardMaterial
                  map={leatherTexture}
                  color={activeCostume.shoesColor}
                  roughness={0.25}
                  metalness={0.2}
                />
              </mesh>
              <mesh position={[0, -0.02, -0.07]}>
                <boxGeometry args={[0.13, 0.03, 0.09]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Right Leg Rig (Local X = 0.14) */}
        <group ref={rightHipRef} position={[0.14, -0.06, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.1, 0.44, 16]} />
            <meshStandardMaterial
              map={trousersTexture}
              color={activeCostume.trousersColor}
              roughness={0.85}
            />
          </mesh>

          <group ref={rightKneeRef} position={[0, -0.44, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.095, 0.08, 0.4, 16]} />
              <meshStandardMaterial
                map={trousersTexture}
                color={activeCostume.trousersColor}
                roughness={0.85}
              />
            </mesh>
            <mesh position={[0, -0.38, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
              <meshStandardMaterial color="#090d16" roughness={0.9} />
            </mesh>

            {/* Right Foot / Boot (Facing local +Z) */}
            <group position={[0, -0.42, 0.04]}>
              <mesh position={[0, 0.03, 0.04]} castShadow>
                <boxGeometry args={[0.13, 0.09, 0.28]} />
                <meshStandardMaterial
                  map={leatherTexture}
                  color={activeCostume.shoesColor}
                  roughness={0.25}
                  metalness={0.2}
                />
              </mesh>
              <mesh position={[0, -0.02, -0.07]}>
                <boxGeometry args={[0.13, 0.03, 0.09]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Menu Mode Golden Hero Pedestal */}
      {(isMenuPreview || gameState === 'MENU') && (
        <group position={[0, -0.05, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.4, 1.6, 0.12, 32]} />
            <meshStandardMaterial color="#78350f" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.15, 1.35, 32]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>
      )}

      {/* Ground Contact Shadow Grounding */}
      <mesh ref={shadowMeshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.48}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
