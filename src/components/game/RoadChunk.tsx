import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OldHyderabadSegment } from './zones/OldHyderabadSegment';
import { CityTrafficSegment } from './zones/CityTrafficSegment';
import { HussainSagarSegment } from './zones/HussainSagarSegment';
import { HitecCitySegment } from './zones/HitecCitySegment';
import { HighwaySegment } from './zones/HighwaySegment';
import { getZoneForDistance } from '../../types/zones';

export const CHUNK_LENGTH = 30;
export const ROAD_WIDTH = 10.4;
export const SIDEWALK_WIDTH = 4.8;

// ==========================================
// PRE-ALLOCATED STATIC GEOMETRIES & MATERIALS
// ==========================================
const geoPole = new THREE.CylinderGeometry(0.08, 0.11, 5.0, 8);
const geoLampArm = new THREE.BoxGeometry(1.2, 0.08, 0.08);
const geoLampHead = new THREE.BoxGeometry(0.48, 0.1, 0.22);
const geoLampBulb = new THREE.BoxGeometry(0.38, 0.03, 0.16);

const matPoleSteel = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.8, roughness: 0.3 });
const matLampGlow = new THREE.MeshBasicMaterial({ color: '#fef08a' });

const geoTreeTrunk = new THREE.CylinderGeometry(0.12, 0.18, 2.6, 7);
const geoTreeCanopy1 = new THREE.SphereGeometry(1.15, 6, 5);
const geoTreeCanopy2 = new THREE.SphereGeometry(0.85, 6, 5);

const matTreeTrunk = new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.9 });
const matTreeLeaves1 = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.8 });
const matTreeLeaves2 = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.8 });

interface RoadChunkProps {
  zPosition: number;
  chunkIndex: number;
}

export const RoadChunk: React.FC<RoadChunkProps> = ({ zPosition, chunkIndex }) => {
  // Approximate world distance traveled to determine zone
  const zoneConfig = useMemo(() => {
    const approximateDistance = chunkIndex * CHUNK_LENGTH;
    return getZoneForDistance(approximateDistance);
  }, [chunkIndex]);

  return (
    <group position={[0, 0, zPosition]}>
      {/* 1. Asphalt Main Road */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROAD_WIDTH, CHUNK_LENGTH]} />
        <meshStandardMaterial
          color="#1e2229"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* 2. Lane Dividers (Dashed White Lines) */}
      {[-10, -5, 0, 5, 10].map((dz, idx) => (
        <group key={`dashes-${idx}`}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-1.3, 0.012, dz]}
          >
            <planeGeometry args={[0.2, 2.5]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[1.3, 0.012, dz]}
          >
            <planeGeometry args={[0.2, 2.5]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        </group>
      ))}

      {/* 3. Road Shoulder Solid Yellow Lines */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-ROAD_WIDTH / 2 + 0.15, 0.012, 0]}
      >
        <planeGeometry args={[0.2, CHUNK_LENGTH]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[ROAD_WIDTH / 2 - 0.15, 0.012, 0]}
      >
        <planeGeometry args={[0.2, CHUNK_LENGTH]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* 4. Sidewalk Curbs (Black & Yellow Pattern) */}
      <mesh position={[-ROAD_WIDTH / 2 - 0.1, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.25, 0.2, CHUNK_LENGTH]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[ROAD_WIDTH / 2 + 0.1, 0.1, 0]} receiveShadow>
        <boxGeometry args={[0.25, 0.2, CHUNK_LENGTH]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* 5. Sidewalk Pavements */}
      <mesh
        position={[-ROAD_WIDTH / 2 - SIDEWALK_WIDTH / 2 - 0.2, 0.1, 0]}
        receiveShadow
      >
        <boxGeometry args={[SIDEWALK_WIDTH, 0.18, CHUNK_LENGTH]} />
        <meshStandardMaterial color="#475569" roughness={0.95} />
      </mesh>
      <mesh
        position={[ROAD_WIDTH / 2 + SIDEWALK_WIDTH / 2 + 0.2, 0.1, 0]}
        receiveShadow
      >
        <boxGeometry args={[SIDEWALK_WIDTH, 0.18, CHUNK_LENGTH]} />
        <meshStandardMaterial color="#475569" roughness={0.95} />
      </mesh>

      {/* 6. Hyderabad Avenue Streetlights */}
      {/* Left Streetlight */}
      <group position={[-ROAD_WIDTH / 2 - 0.45, 0, 0]}>
        <mesh position={[0, 2.5, 0]} geometry={geoPole} material={matPoleSteel} castShadow />
        <mesh position={[0.5, 4.9, 0]} geometry={geoLampArm} material={matPoleSteel} />
        <mesh position={[1.05, 4.86, 0]} geometry={geoLampHead} material={matPoleSteel} />
        <mesh position={[1.05, 4.8, 0]} geometry={geoLampBulb} material={matLampGlow} />
      </group>
      {/* Right Streetlight */}
      <group position={[ROAD_WIDTH / 2 + 0.45, 0, 0]}>
        <mesh position={[0, 2.5, 0]} geometry={geoPole} material={matPoleSteel} castShadow />
        <mesh position={[-0.5, 4.9, 0]} geometry={geoLampArm} material={matPoleSteel} />
        <mesh position={[-1.05, 4.86, 0]} geometry={geoLampHead} material={matPoleSteel} />
        <mesh position={[-1.05, 4.8, 0]} geometry={geoLampBulb} material={matLampGlow} />
      </group>

      {/* 7. Sidewalk Avenue Trees (Gulmohar / Neem) */}
      {[-9, 9].map((dz, idx) => (
        <React.Fragment key={`trees-${idx}`}>
          {/* Left Tree */}
          <group position={[-ROAD_WIDTH / 2 - 2.2, 0, dz]}>
            <mesh position={[0, 1.3, 0]} geometry={geoTreeTrunk} material={matTreeTrunk} castShadow />
            <mesh position={[0, 3.2, 0]} geometry={geoTreeCanopy1} material={matTreeLeaves1} castShadow />
            <mesh position={[0, 4.1, 0]} geometry={geoTreeCanopy2} material={matTreeLeaves2} castShadow />
          </group>
          {/* Right Tree */}
          <group position={[ROAD_WIDTH / 2 + 2.2, 0, dz]}>
            <mesh position={[0, 1.3, 0]} geometry={geoTreeTrunk} material={matTreeTrunk} castShadow />
            <mesh position={[0, 3.2, 0]} geometry={geoTreeCanopy1} material={matTreeLeaves1} castShadow />
            <mesh position={[0, 4.1, 0]} geometry={geoTreeCanopy2} material={matTreeLeaves2} castShadow />
          </group>
        </React.Fragment>
      ))}

      {/* 8. Zone-Specific Modular Architecture & Scenery */}
      {zoneConfig.id === 'OLD_HYDERABAD' && <OldHyderabadSegment chunkIndex={chunkIndex} />}
      {zoneConfig.id === 'CITY_TRAFFIC' && <CityTrafficSegment chunkIndex={chunkIndex} />}
      {zoneConfig.id === 'HUSSAIN_SAGAR' && <HussainSagarSegment chunkIndex={chunkIndex} />}
      {zoneConfig.id === 'HITEC_CITY' && <HitecCitySegment chunkIndex={chunkIndex} />}
      {zoneConfig.id === 'HYDERABAD_HIGHWAY' && <HighwaySegment chunkIndex={chunkIndex} />}
    </group>
  );
};
