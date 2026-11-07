import React from 'react';
import { ROAD_WIDTH, SIDEWALK_WIDTH } from '../RoadChunk';

interface ZoneSegmentProps {
  chunkIndex: number;
}

export const HighwaySegment: React.FC<ZoneSegmentProps> = ({ chunkIndex }) => {
  const isFlyoverChunk = chunkIndex % 3 === 0;
  const isGantryChunk = chunkIndex % 3 === 1;

  return (
    <group>
      {/* 1. Massive ORR (Outer Ring Road) Elevated Concrete Flyover Viaduct */}
      {isFlyoverChunk && (
        <group position={[0, 9.2, 0]}>
          {/* Main Flyover Viaduct Deck */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[ROAD_WIDTH + 16, 2.2, 7.5]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.7} />
          </mesh>
          {/* Flyover Parapet Barriers */}
          <mesh position={[0, 1.4, 3.6]} castShadow>
            <boxGeometry args={[ROAD_WIDTH + 16, 0.8, 0.3]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.4, -3.6]} castShadow>
            <boxGeometry args={[ROAD_WIDTH + 16, 0.8, 0.3]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
          </mesh>

          {/* Heavy Concrete Support Pillars on Sidewalks */}
          <mesh position={[-ROAD_WIDTH / 2 - 3.2, -4.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.9, 1.1, 9.2, 16]} />
            <meshStandardMaterial color="#64748b" roughness={0.8} />
          </mesh>
          <mesh position={[ROAD_WIDTH / 2 + 3.2, -4.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.9, 1.1, 9.2, 16]} />
            <meshStandardMaterial color="#64748b" roughness={0.8} />
          </mesh>

          {/* Flyover Underside Warning Chevrons */}
          <mesh position={[0, -1.15, 3.6]}>
            <boxGeometry args={[10, 0.2, 0.05]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        </group>
      )}

      {/* 2. NHAI / ORR Overhead Green Highway Gantry Signboard */}
      {isGantryChunk && (
        <group position={[0, 0, -4]}>
          {/* Steel Truss Overhead Beam */}
          <mesh position={[0, 6.8, 0]} castShadow>
            <boxGeometry args={[ROAD_WIDTH + 4.2, 0.6, 0.5]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Left & Right Support Masts */}
          <mesh position={[-ROAD_WIDTH / 2 - 1.2, 3.4, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 6.8, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[ROAD_WIDTH / 2 + 1.2, 3.4, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 6.8, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* NHAI Emerald Green Highway Board */}
          <mesh position={[0, 6.8, 0.32]}>
            <boxGeometry args={[9.5, 2.0, 0.1]} />
            <meshStandardMaterial color="#065f46" roughness={0.3} />
          </mesh>
          {/* Board White Border */}
          <mesh position={[0, 6.8, 0.38]}>
            <boxGeometry args={[9.3, 1.8, 0.02]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          {/* Destination Text Accents */}
          <mesh position={[-2.2, 7.1, 0.4]}>
            <boxGeometry args={[4.2, 0.45, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[2.2, 6.5, 0.4]}>
            <boxGeometry args={[4.2, 0.45, 0.02]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      )}

      {/* 3. Steel Crash Barriers on Road Shoulders */}
      {[-ROAD_WIDTH / 2 - 0.2, ROAD_WIDTH / 2 + 0.2].map((bx, bi) => (
        <group key={`barrier-${bi}`} position={[bx, 0.5, 0]}>
          {/* Corrugated Steel W-Beam */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.15, 0.4, 30]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Support I-posts */}
          {[-10, -5, 0, 5, 10].map((pz) => (
            <mesh key={`post-${pz}`} position={[0, -0.25, pz]}>
              <boxGeometry args={[0.12, 0.5, 0.12]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 4. Heavy Indian Transport Truck on Side Shoulder */}
      <group position={[ROAD_WIDTH / 2 + 3.4, 1.8, 6]} rotation={[0, -0.05, 0]}>
        {/* Truck Cargo Container (Indian Truck Art style) */}
        <mesh position={[0, 0.5, -0.8]} castShadow>
          <boxGeometry args={[2.6, 2.8, 6.5]} />
          <meshStandardMaterial color="#b45309" roughness={0.5} />
        </mesh>
        {/* Truck Cabin (Bright Orange/Yellow) */}
        <mesh position={[0, 0.1, 3.2]} castShadow>
          <boxGeometry args={[2.5, 2.2, 2.2]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.5, 4.32]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[2.3, 0.9, 0.05]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        {/* "HORN PLEASE" Rear Bar */}
        <mesh position={[0, -0.3, -4.06]}>
          <boxGeometry args={[2.4, 0.4, 0.05]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>
      </group>

      {/* 5. Highway Sodium-Vapor High-Mast Streetlights */}
      {[-1, 1].map((side) => {
        const posX = side * (ROAD_WIDTH / 2 + 1.2);
        return (
          <group key={`hw-pole-${side}`} position={[posX, 0, 0]}>
            <mesh position={[0, 3.8, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.18, 7.6, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[side < 0 ? 0.9 : -0.9, 7.6, 0]} rotation={[0, 0, side < 0 ? -0.4 : 0.4]}>
              <cylinderGeometry args={[0.08, 0.08, 1.9, 8]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[side < 0 ? 1.6 : -1.6, 7.4, 0]}>
              <boxGeometry args={[0.5, 0.2, 0.3]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
