import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ROAD_WIDTH, SIDEWALK_WIDTH } from '../RoadChunk';

interface ZoneSegmentProps {
  chunkIndex: number;
}

export const HussainSagarSegment: React.FC<ZoneSegmentProps> = ({ chunkIndex }) => {
  const isBuddhaChunk = chunkIndex % 4 === 2;

  return (
    <group>
      {/* 1. Hussain Sagar Lake Waters (Expansive water body on the left side) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-ROAD_WIDTH / 2 - SIDEWALK_WIDTH - 24, -0.4, 0]}
        receiveShadow
      >
        <planeGeometry args={[48, 30]} />
        <meshStandardMaterial
          color="#0e3a53"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* 2. Iconic Buddha Statue on Gibraltar Rock in the lake */}
      {isBuddhaChunk && (
        <group position={[-ROAD_WIDTH / 2 - SIDEWALK_WIDTH - 18, 0, 0]}>
          {/* Gibraltar Rock Outcrop in Lake */}
          <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[4.2, 5.5, 3.2, 10]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>

          {/* Lotus Flower Pedestal Base */}
          <mesh position={[0, 3.1, 0]} castShadow>
            <cylinderGeometry args={[2.8, 3.2, 0.8, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>

          {/* Monolithic Standing White Buddha Statue */}
          {/* Body Robe */}
          <mesh position={[0, 6.2, 0]} castShadow>
            <cylinderGeometry args={[1.0, 1.3, 5.4, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Buddha Head & Usnisha */}
          <mesh position={[0, 9.4, 0]} castShadow>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </mesh>
          <mesh position={[0, 10.2, 0]}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </mesh>
          {/* Blessing Abhaya Mudra Raised Right Hand */}
          <mesh position={[1.1, 7.2, 0.4]} rotation={[0, 0, -0.4]} castShadow>
            <boxGeometry args={[0.35, 1.2, 0.35]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* 3. Tank Bund Ornamental White Balustrade Railings */}
      <group position={[-ROAD_WIDTH / 2 - 0.2, 0.45, 0]}>
        {/* Continuous Top Handrail */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.22, 0.12, 30]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Continuous Bottom Curb */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.26, 0.18, 30]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Ornamental Balusters spaced along railing */}
        {[-12, -9, -6, -3, 0, 3, 6, 9, 12].map((bz) => (
          <group key={`balustrade-${bz}`} position={[0, 0, bz]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.13, 8, 8]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. Tank Bund Heritage Boulevard Streetlights with Dual Glowing Lanterns */}
      {[-8, 8].map((lz, li) => (
        <group key={`tb-lamp-${li}`} position={[-ROAD_WIDTH / 2 + 0.6, 0, lz]}>
          {/* Ornate White Pole */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.16, 5.0, 8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Dual Cross Arms */}
          <mesh position={[0, 5.0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 1.8, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Left and Right Globe Lamps */}
          <mesh position={[-0.9, 5.0, 0]}>
            <sphereGeometry args={[0.24, 12, 12]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <mesh position={[0.9, 5.0, 0]}>
            <sphereGeometry args={[0.24, 12, 12]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      ))}

      {/* 5. Lush Lakefront Boulevard Landscaping on Right Sidewalk */}
      {/* Palm Trees & Blooming Pink Bougainvillea */}
      {[-10, 2].map((tz, ti) => (
        <group key={`tb-tree-${ti}`} position={[ROAD_WIDTH / 2 + 2.5, 0, tz]}>
          {/* Palm Trunk */}
          <mesh position={[0, 2.8, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.28, 5.6, 8]} />
            <meshStandardMaterial color="#573824" roughness={0.9} />
          </mesh>
          {/* Palm Crown */}
          <mesh position={[0, 5.8, 0]} castShadow>
            <sphereGeometry args={[1.8, 10, 10]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
          {/* Blooming Bougainvillea Bush */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshStandardMaterial color="#db2777" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 6. Distant Hyderabad City Skyline Across the Lake Waters */}
      {[-12, -4, 4, 12].map((dz, di) => (
        <mesh
          key={`distant-bldg-${di}`}
          position={[-ROAD_WIDTH / 2 - SIDEWALK_WIDTH - 42, 14 + (di % 3) * 6, dz]}
        >
          <boxGeometry args={[12, 28 + (di % 3) * 12, 7]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};
