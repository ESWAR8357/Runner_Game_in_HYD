import React from 'react';
import { ROAD_WIDTH, SIDEWALK_WIDTH } from '../RoadChunk';

interface ZoneSegmentProps {
  chunkIndex: number;
}

export const OldHyderabadSegment: React.FC<ZoneSegmentProps> = ({ chunkIndex }) => {
  const isCharminarChunk = chunkIndex % 5 === 0;

  // Traditional Bazaar Shops
  const shops = [
    {
      name: 'NIMRAH CAFE',
      tagline: 'IRANI CHAI & OSMANIA',
      color: '#991b1b',
      side: 'left',
      z: -7,
      height: 9,
    },
    {
      name: 'SHADAB HOTEL',
      tagline: 'HYDERABAD DUM BIRYANI',
      color: '#166534',
      side: 'left',
      z: 7,
      height: 10,
    },
    {
      name: 'LAAD BAZAAR',
      tagline: 'PEARLS & STONE BANGLES',
      color: '#854d0e',
      side: 'right',
      z: -6,
      height: 8.5,
    },
    {
      name: 'MADINA BAKERY',
      tagline: 'FAMOUS NIZAM SWEETS',
      color: '#1e3a8a',
      side: 'right',
      z: 8,
      height: 9.5,
    },
  ];

  return (
    <group>
      {/* 1. Grand Charminar Arch Landmark (Every 5th chunk) */}
      {isCharminarChunk && (
        <group position={[0, 0, 0]}>
          {/* Main Monument Spanning Overhead */}
          {/* Left Base Pylon */}
          <mesh position={[-ROAD_WIDTH / 2 - 2.2, 5.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 11, 3.2]} />
            <meshStandardMaterial color="#d4b996" roughness={0.7} />
          </mesh>
          {/* Right Base Pylon */}
          <mesh position={[ROAD_WIDTH / 2 + 2.2, 5.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 11, 3.2]} />
            <meshStandardMaterial color="#d4b996" roughness={0.7} />
          </mesh>

          {/* Spanning Monument Upper Hall */}
          <mesh position={[0, 9.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[ROAD_WIDTH + 7.6, 3.2, 3.4]} />
            <meshStandardMaterial color="#d4b996" roughness={0.7} />
          </mesh>

          {/* Central Mughal Pointed Archway Keystones */}
          <mesh position={[0, 8.1, 1.72]}>
            <boxGeometry args={[ROAD_WIDTH + 0.8, 0.4, 0.2]} />
            <meshStandardMaterial color="#b45309" roughness={0.5} />
          </mesh>
          <mesh position={[0, 8.1, -1.72]}>
            <boxGeometry args={[ROAD_WIDTH + 0.8, 0.4, 0.2]} />
            <meshStandardMaterial color="#b45309" roughness={0.5} />
          </mesh>

          {/* 4 Iconic Corner Minarets */}
          {[-1, 1].map((sideX) =>
            [-1, 1].map((sideZ) => {
              const posX = sideX * (ROAD_WIDTH / 2 + 3.2);
              const posZ = sideZ * 1.6;
              return (
                <group key={`minaret-${sideX}-${sideZ}`} position={[posX, 11, posZ]}>
                  {/* Minaret Column */}
                  <mesh castShadow>
                    <cylinderGeometry args={[0.5, 0.65, 8.5, 12]} />
                    <meshStandardMaterial color="#e5d0b5" roughness={0.6} />
                  </mesh>
                  {/* Minaret Balcony 1 */}
                  <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.85, 0.65, 0.4, 12]} />
                    <meshStandardMaterial color="#b45309" roughness={0.6} />
                  </mesh>
                  {/* Minaret Balcony 2 */}
                  <mesh position={[0, 3.2, 0]}>
                    <cylinderGeometry args={[0.75, 0.55, 0.35, 12]} />
                    <meshStandardMaterial color="#b45309" roughness={0.6} />
                  </mesh>
                  {/* Dome Finial */}
                  <mesh position={[0, 4.6, 0]} castShadow>
                    <sphereGeometry args={[0.65, 12, 12]} />
                    <meshStandardMaterial color="#fef08a" metalness={0.7} roughness={0.2} />
                  </mesh>
                  <mesh position={[0, 5.4, 0]}>
                    <cylinderGeometry args={[0.04, 0.08, 0.9, 8]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
                  </mesh>
                </group>
              );
            })
          )}

          {/* Charminar Sign Plaque */}
          <mesh position={[0, 10.4, 1.76]}>
            <boxGeometry args={[7.2, 1.1, 0.08]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* 2. Traditional Bazaar Buildings & Historic Shopfronts */}
      {shops.map((shop, idx) => {
        const isLeft = shop.side === 'left';
        const posX = isLeft
          ? -ROAD_WIDTH / 2 - SIDEWALK_WIDTH - 3.2
          : ROAD_WIDTH / 2 + SIDEWALK_WIDTH + 3.2;

        return (
          <group key={`shop-${idx}`} position={[posX, shop.height / 2, shop.z]}>
            {/* Heritage Stone Facade */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[6.5, shop.height, 8.5]} />
              <meshStandardMaterial color="#cbb593" roughness={0.8} />
            </mesh>

            {/* Arched Jharokha Balcony Window */}
            <mesh position={[isLeft ? 3.3 : -3.3, 1.2, 0]}>
              <boxGeometry args={[0.4, 2.2, 3.6]} />
              <meshStandardMaterial color="#78350f" roughness={0.6} />
            </mesh>
            <mesh position={[isLeft ? 3.4 : -3.4, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.2, 1.2, 0.3, 12]} />
              <meshStandardMaterial color="#78350f" roughness={0.6} />
            </mesh>

            {/* Shop Signboard facing road */}
            <mesh position={[isLeft ? 3.32 : -3.32, -shop.height / 2 + 3.2, 0]}>
              <boxGeometry args={[0.15, 1.3, 5.5]} />
              <meshStandardMaterial color={shop.color} roughness={0.3} />
            </mesh>

            {/* Striped Bazaar Canvas Awning */}
            <mesh
              position={[isLeft ? 3.8 : -3.8, -shop.height / 2 + 2.3, 0]}
              rotation={[0, 0, isLeft ? -0.4 : 0.4]}
              castShadow
            >
              <boxGeometry args={[1.5, 0.08, 5.8]} />
              <meshStandardMaterial color={isLeft ? '#dc2626' : '#15803d'} roughness={0.7} />
            </mesh>

            {/* Ornate Roof Battlements / Merlons */}
            <mesh position={[0, shop.height / 2 + 0.3, 0]}>
              <boxGeometry args={[6.8, 0.5, 8.8]} />
              <meshStandardMaterial color="#92400e" roughness={0.7} />
            </mesh>
          </group>
        );
      })}

      {/* 3. Heritage Streetlamps on Sidewalks */}
      {[-1, 1].map((side) => {
        const xPos = side * (ROAD_WIDTH / 2 + 0.6);
        return (
          <group key={`lamp-${side}`} position={[xPos, 0, 0]}>
            {/* Cast Iron Base & Fluted Pole */}
            <mesh position={[0, 2.2, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.16, 4.4, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Ornate Lantern Housing */}
            <mesh position={[0, 4.4, 0]}>
              <cylinderGeometry args={[0.3, 0.2, 0.6, 6]} />
              <meshStandardMaterial color="#b45309" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Warm Lantern Glow */}
            <mesh position={[0, 4.4, 0]}>
              <sphereGeometry args={[0.2, 10, 10]} />
              <meshBasicMaterial color="#fde047" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
