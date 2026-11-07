import React from 'react';
import { ROAD_WIDTH, SIDEWALK_WIDTH } from '../RoadChunk';

interface ZoneSegmentProps {
  chunkIndex: number;
}

export const CityTrafficSegment: React.FC<ZoneSegmentProps> = ({ chunkIndex }) => {
  const hasCrossing = chunkIndex % 2 === 0;
  const isBusChunk = chunkIndex % 3 === 1;

  return (
    <group>
      {/* 1. Road Intersection Zebra Crosswalk */}
      {hasCrossing && (
        <group position={[0, 0.015, -4]}>
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((dx) => (
            <mesh key={`zebra-${dx}`} position={[dx * 0.9, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.55, 3.2]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
          {/* Intersection stop line */}
          <mesh position={[0, 0, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[ROAD_WIDTH - 0.4, 0.4]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}

      {/* 2. Overhead Traffic Light Gantry */}
      {hasCrossing && (
        <group position={[0, 0, -5]}>
          {/* Left Vertical Pillar */}
          <mesh position={[-ROAD_WIDTH / 2 - 0.8, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 6.4, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Right Vertical Pillar */}
          <mesh position={[ROAD_WIDTH / 2 + 0.8, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 6.4, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Overhead Cantilever Truss */}
          <mesh position={[0, 6.2, 0]} castShadow>
            <boxGeometry args={[ROAD_WIDTH + 2.2, 0.4, 0.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Traffic Signal Lights (One per lane) */}
          {[-2.6, 0, 2.6].map((lx, idx) => (
            <group key={`signal-${idx}`} position={[lx, 5.5, 0]}>
              {/* Signal Box */}
              <mesh castShadow>
                <boxGeometry args={[0.5, 1.2, 0.35]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} />
              </mesh>
              {/* Red Light */}
              <mesh position={[0, 0.35, 0.18]}>
                <circleGeometry args={[0.12, 16]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
              {/* Amber Light */}
              <mesh position={[0, 0, 0.18]}>
                <circleGeometry args={[0.12, 16]} />
                <meshBasicMaterial color="#eab308" />
              </mesh>
              {/* Green Light */}
              <mesh position={[0, -0.35, 0.18]}>
                <circleGeometry args={[0.12, 16]} />
                <meshBasicMaterial color="#22c55e" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 3. TSRTC Indian City Bus (Parked along left shoulder / bus bay) */}
      {isBusChunk && (
        <group position={[-ROAD_WIDTH / 2 - 2.8, 1.6, 4]} rotation={[0, 0.05, 0]}>
          {/* Main Bus Body (TSRTC Red Lower, Silver/Cream Top) */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 2.8, 7.8]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.1} />
          </mesh>
          {/* Cream Upper Roof Band */}
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[2.52, 0.6, 7.82]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.4} />
          </mesh>

          {/* Destination Board ("KOTI - SECUNDERABAD") */}
          <mesh position={[0, 1.15, 3.92]}>
            <boxGeometry args={[2.1, 0.35, 0.05]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>

          {/* Front Windshield */}
          <mesh position={[0, 0.5, 3.92]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[2.3, 1.1, 0.05]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.1} />
          </mesh>

          {/* Side Windows Row */}
          <mesh position={[1.27, 0.6, 0]}>
            <boxGeometry args={[0.05, 0.9, 6.8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.1} />
          </mesh>
          <mesh position={[-1.27, 0.6, 0]}>
            <boxGeometry args={[0.05, 0.9, 6.8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.1} />
          </mesh>

          {/* Front Grille & Dual Headlamps */}
          <mesh position={[0, -0.6, 3.92]}>
            <boxGeometry args={[1.6, 0.5, 0.05]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-0.9, -0.6, 3.93]}>
            <circleGeometry args={[0.18, 16]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <mesh position={[0.9, -0.6, 3.93]}>
            <circleGeometry args={[0.18, 16]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>

          {/* Bus Wheels */}
          {[-2.2, 2.2].map((wz, wi) => (
            <group key={`bus-wheel-${wi}`}>
              <mesh position={[-1.25, -1.2, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.45, 0.45, 0.3, 16]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
              <mesh position={[1.25, -1.2, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.45, 0.45, 0.3, 16]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 4. City Cars parked along right sidewalk */}
      <group position={[ROAD_WIDTH / 2 + 2.5, 0.75, -6]}>
        {/* White Sedan Car Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.0, 0.75, 4.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Cabin Glass */}
        <mesh position={[0, 0.55, -0.2]}>
          <boxGeometry args={[1.7, 0.6, 2.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.7} />
        </mesh>
        {/* Headlights */}
        <mesh position={[-0.7, 0, 2.12]}>
          <circleGeometry args={[0.14, 16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0.7, 0, 2.12]}>
          <circleGeometry args={[0.14, 16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        {/* Wheels */}
        {[-1.3, 1.3].map((cz, ci) => (
          <group key={`car-wheel-${ci}`}>
            <mesh position={[-1.02, -0.35, cz]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.18, 16]} />
              <meshStandardMaterial color="#18181b" />
            </mesh>
            <mesh position={[1.02, -0.35, cz]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.18, 16]} />
              <meshStandardMaterial color="#18181b" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Modern Commercial High-Rise Buildings on Outer Perimeters */}
      {[-1, 1].map((side) => {
        const posX = side * (ROAD_WIDTH / 2 + SIDEWALK_WIDTH + 4.5);
        return (
          <group key={`comm-bldg-${side}`} position={[posX, 7.5, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[7.5, 15, 12]} />
              <meshStandardMaterial color={side < 0 ? '#1e293b' : '#334155'} roughness={0.6} />
            </mesh>
            {/* Window bands */}
            <mesh position={[-side * 3.8, 0, 0]}>
              <boxGeometry args={[0.1, 12, 10]} />
              <meshBasicMaterial color={side < 0 ? '#bae6fd' : '#fef08a'} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
