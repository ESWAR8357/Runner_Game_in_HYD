import React from 'react';
import { ROAD_WIDTH, SIDEWALK_WIDTH } from '../RoadChunk';

interface ZoneSegmentProps {
  chunkIndex: number;
}

export const HitecCitySegment: React.FC<ZoneSegmentProps> = ({ chunkIndex }) => {
  const isCyberTowersChunk = chunkIndex % 4 === 1;

  return (
    <group>
      {/* 1. Iconic Cyber Towers Replica Landmark (Right side of road) */}
      {isCyberTowersChunk && (
        <group position={[ROAD_WIDTH / 2 + SIDEWALK_WIDTH + 14, 0, 0]}>
          {/* Central Cylindrical Core */}
          <mesh position={[0, 14, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[5.2, 5.8, 28, 24]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Cyber Towers Radial Spokes / Wings */}
          {[0, 1, 2, 3].map((spokeIdx) => {
            const angle = (spokeIdx * Math.PI) / 2;
            return (
              <group key={`spoke-${spokeIdx}`} rotation={[0, angle, 0]}>
                <mesh position={[0, 14, 6.2]} castShadow receiveShadow>
                  <boxGeometry args={[4.2, 26, 4.5]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Neon Cyan Floor Band */}
                <mesh position={[0, 22, 8.5]}>
                  <boxGeometry args={[4.4, 0.4, 0.2]} />
                  <meshBasicMaterial color="#38bdf8" />
                </mesh>
              </group>
            );
          })}

          {/* Roof Radar / Telecom Mast */}
          <mesh position={[0, 29, 0]}>
            <cylinderGeometry args={[0.2, 0.4, 6, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          <mesh position={[0, 32, 0]}>
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>

          {/* Prominent Glowing Cyber Towers Signboard */}
          <mesh position={[-6.8, 16, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[8.5, 2.2, 0.2]} />
            <meshStandardMaterial color="#0369a1" roughness={0.2} />
          </mesh>
          <mesh position={[-6.95, 16, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[7.8, 1.8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}

      {/* 2. Sleek Glass Skyscraper Towers on Left Sidewalk */}
      <group position={[-ROAD_WIDTH / 2 - SIDEWALK_WIDTH - 6.5, 16, -6]}>
        {/* Main Glass Tower */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[7.8, 32, 10]} />
          <meshStandardMaterial
            color="#082f49"
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Glowing Office Grid Windows */}
        <mesh position={[4.0, 0, 0]}>
          <boxGeometry args={[0.1, 28, 8.8]} />
          <meshBasicMaterial color="#7dd3fc" />
        </mesh>

        {/* Top Architectural Neon Crown (Magenta) */}
        <mesh position={[0, 16.2, 0]}>
          <boxGeometry args={[8.2, 0.8, 10.4]} />
          <meshBasicMaterial color="#d946ef" />
        </mesh>

        {/* Digital Billboard: "T-HUB 2.0 INNOVATION" */}
        <mesh position={[4.1, -4, 0]}>
          <boxGeometry args={[0.2, 4.2, 7.5]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.2} />
        </mesh>
        <mesh position={[4.22, -4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[7.2, 3.8]} />
          <meshBasicMaterial color="#c084fc" />
        </mesh>
      </group>

      {/* 3. Modern Tech Plaza Tower on Right Sidewalk */}
      {!isCyberTowersChunk && (
        <group position={[ROAD_WIDTH / 2 + SIDEWALK_WIDTH + 6.5, 15, 5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[7.8, 30, 9.5]} />
            <meshStandardMaterial color="#0c4a6e" roughness={0.15} metalness={0.85} />
          </mesh>
          <mesh position={[-4.0, 0, 0]}>
            <boxGeometry args={[0.1, 26, 8.2]} />
            <meshBasicMaterial color="#67e8f9" />
          </mesh>
          {/* Cyan Neon Accent Strip */}
          <mesh position={[0, 15.2, 0]}>
            <boxGeometry args={[8.2, 0.6, 9.9]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        </group>
      )}

      {/* 4. Ultra-Modern Smart LED Street Poles */}
      {[-1, 1].map((side) => {
        const posX = side * (ROAD_WIDTH / 2 + 0.6);
        return (
          <group key={`hitec-lamp-${side}`} position={[posX, 0, 0]}>
            {/* Minimalist matte black pole */}
            <mesh position={[0, 3.2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.1, 6.4, 8]} />
              <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Angled LED light blade */}
            <mesh
              position={[side < 0 ? 0.8 : -0.8, 6.4, 0]}
              rotation={[0, 0, side < 0 ? -0.35 : 0.35]}
            >
              <boxGeometry args={[1.6, 0.1, 0.25]} />
              <meshStandardMaterial color="#090d16" metalness={0.8} />
            </mesh>
            {/* Cyan LED Emissive strip */}
            <mesh
              position={[side < 0 ? 0.8 : -0.8, 6.32, 0]}
              rotation={[0, 0, side < 0 ? -0.35 : 0.35]}
            >
              <boxGeometry args={[1.4, 0.04, 0.18]} />
              <meshBasicMaterial color="#22d3ee" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
