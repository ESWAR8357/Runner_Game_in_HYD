import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PowerUpItem } from '../../types/powerups';
import { LANE_WIDTH } from '../../types/game';

interface PowerUpsProps {
  powerups: PowerUpItem[];
}

// Pre-allocated static geometries & materials to avoid GC & shader recompilation
const geoMagnetArc = new THREE.TorusGeometry(0.38, 0.1, 10, 20, Math.PI);
const geoMagnetTip = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 10);
const matMagnetRed = new THREE.MeshStandardMaterial({
  color: '#dc2626',
  emissive: '#b91c1c',
  emissiveIntensity: 0.6,
  metalness: 0.5,
  roughness: 0.2,
});
const matSilverTip = new THREE.MeshStandardMaterial({
  color: '#cbd5e1',
  metalness: 0.9,
  roughness: 0.1,
});

const geoShieldCore = new THREE.CylinderGeometry(0.42, 0.25, 0.12, 6);
const geoShieldEmblem = new THREE.CircleGeometry(0.22, 12);
const matShieldBlue = new THREE.MeshStandardMaterial({
  color: '#2563eb',
  metalness: 0.8,
  roughness: 0.2,
  emissive: '#1d4ed8',
  emissiveIntensity: 0.7,
});
const matShieldEmblem = new THREE.MeshBasicMaterial({ color: '#60a5fa' });

const geoSpeedCore = new THREE.OctahedronGeometry(0.42, 0);
const geoSpeedRing = new THREE.TorusGeometry(0.55, 0.04, 8, 20);
const matSpeedCore = new THREE.MeshStandardMaterial({
  color: '#06b6d4',
  metalness: 0.9,
  roughness: 0.1,
  emissive: '#0891b2',
  emissiveIntensity: 0.9,
});
const matSpeedRing = new THREE.MeshBasicMaterial({ color: '#67e8f9' });

const geoMultDisc = new THREE.CylinderGeometry(0.44, 0.44, 0.12, 16);
const geoMultStar = new THREE.CylinderGeometry(0.3, 0.3, 0.02, 5);
const matMultGold = new THREE.MeshStandardMaterial({
  color: '#d97706',
  metalness: 0.9,
  roughness: 0.15,
  emissive: '#b45309',
  emissiveIntensity: 0.8,
});
const matMultStar = new THREE.MeshBasicMaterial({ color: '#fef08a' });

const geoAuraRing = new THREE.RingGeometry(0.65, 0.72, 20);
const matAuraRing = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.4 });

export const PowerUps: React.FC<PowerUpsProps> = ({ powerups }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const rot = delta * 3.2;
    for (let i = 0; i < groupRef.current.children.length; i++) {
      groupRef.current.children[i].rotation.y += rot;
    }
  });

  return (
    <group ref={groupRef}>
      {powerups.map((item) => {
        if (item.collected) return null;
        const xPos = item.lane * LANE_WIDTH;

        return (
          <group key={item.id} position={[xPos, item.y, item.z]}>
            {/* 1. COIN MAGNET */}
            {item.type === 'MAGNET' && (
              <group>
                <mesh position={[0, 0, 0]} geometry={geoMagnetArc} material={matMagnetRed} />
                <mesh position={[-0.38, -0.15, 0]} geometry={geoMagnetTip} material={matSilverTip} />
                <mesh position={[0.38, -0.15, 0]} geometry={geoMagnetTip} material={matSilverTip} />
              </group>
            )}

            {/* 2. HERO SHIELD */}
            {item.type === 'SHIELD' && (
              <group>
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={geoShieldCore} material={matShieldBlue} castShadow />
                <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} geometry={geoShieldEmblem} material={matShieldEmblem} />
              </group>
            )}

            {/* 3. SPEED BOOST */}
            {item.type === 'SPEED_BOOST' && (
              <group>
                <mesh position={[0, 0, 0]} geometry={geoSpeedCore} material={matSpeedCore} castShadow />
                <mesh position={[0, 0, 0]} geometry={geoSpeedRing} material={matSpeedRing} />
              </group>
            )}

            {/* 4. SCORE MULTIPLIER (2X) */}
            {item.type === 'MULTIPLIER' && (
              <group>
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={geoMultDisc} material={matMultGold} castShadow />
                <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} geometry={geoMultStar} material={matMultStar} />
              </group>
            )}

            {/* Floating Energy Aura Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]} geometry={geoAuraRing} material={matAuraRing} />
          </group>
        );
      })}
    </group>
  );
};
