import React from 'react';
import * as THREE from 'three';
import { Obstacle, LANE_WIDTH } from '../../types/game';

interface ObstaclesProps {
  obstacles: Obstacle[];
}

// ==========================================
// PRE-ALLOCATED STATIC GEOMETRIES & MATERIALS
// Reused across all obstacle instances to eliminate GC and GPU buffer allocation
// ==========================================

// 1. Barricade resources
const geoBarricadePost = new THREE.BoxGeometry(0.12, 0.9, 0.12);
const geoBarricadeFoot = new THREE.BoxGeometry(0.3, 0.1, 0.6);
const geoBarricadeBoard = new THREE.BoxGeometry(2.1, 0.45, 0.1);
const geoBarricadeStripe = new THREE.BoxGeometry(0.08, 0.5, 0.02);
const geoWarningLight = new THREE.CylinderGeometry(0.08, 0.08, 0.16, 10);

const matDarkPost = new THREE.MeshStandardMaterial({ color: '#1e293b' });
const matDarkFoot = new THREE.MeshStandardMaterial({ color: '#0f172a' });
const matCautionYellow = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.3 });
const matBlackStripe = new THREE.MeshBasicMaterial({ color: '#000000' });
const matWarningRed = new THREE.MeshBasicMaterial({ color: '#ef4444' });

// 2. Overhead Barrier resources
const geoOverheadPost = new THREE.BoxGeometry(0.16, 3.2, 0.16);
const geoOverheadGirder = new THREE.BoxGeometry(2.5, 0.8, 0.22);
const geoOverheadSign = new THREE.BoxGeometry(2.2, 0.6, 0.04);
const geoOverheadStripe = new THREE.BoxGeometry(0.09, 0.65, 0.02);

const matOverheadSteel = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.8, roughness: 0.3 });
const matOverheadRed = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4 });
const matSignboardYellow = new THREE.MeshStandardMaterial({ color: '#fbbf24', roughness: 0.2 });

// 3. Indian Vehicles resources
// A. Auto Rickshaw resources
const geoAutoBody = new THREE.BoxGeometry(1.7, 0.75, 2.4);
const geoAutoHood = new THREE.BoxGeometry(1.3, 0.65, 0.7);
const geoAutoCanopy = new THREE.BoxGeometry(1.65, 0.7, 2.2);
const geoAutoWindshield = new THREE.BoxGeometry(1.4, 0.6, 0.05);
const geoAutoHeadlight = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 12);
const geoAutoWheel = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 12);
const geoAutoTaillight = new THREE.BoxGeometry(0.2, 0.12, 0.04);

const matAutoGreen = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.4, metalness: 0.1 });
const matAutoYellow = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.3 });
const matAutoCanopy = new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.9 });
const matAutoGlass = new THREE.MeshStandardMaterial({ color: '#7dd3fc', roughness: 0.1, metalness: 0.5 });
const matHeadlightYellow = new THREE.MeshBasicMaterial({ color: '#fef08a' });
const matRubberWheel = new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.8 });

// B. Hyderabad City Taxi (Sedan style with yellow taxi roof beacon)
const geoTaxiBody = new THREE.BoxGeometry(1.8, 0.65, 3.2);
const geoTaxiCabin = new THREE.BoxGeometry(1.6, 0.6, 1.8);
const geoTaxiRoofSign = new THREE.BoxGeometry(0.6, 0.2, 0.35);
const geoTaxiBumper = new THREE.BoxGeometry(1.84, 0.2, 0.15);
const geoTaxiGlass = new THREE.BoxGeometry(1.58, 0.52, 1.7);
const geoCarWheel = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 12);
const geoCarHeadlight = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 12);

const matTaxiWhite = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.35, metalness: 0.2 });
const matTaxiRoofSign = new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.25 });
const matTaxiBumper = new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.7, roughness: 0.3 });

// C. TSRTC Hyderabad Red & Cream City Bus
const geoBusLowerBody = new THREE.BoxGeometry(1.95, 1.1, 4.4);
const geoBusUpperBody = new THREE.BoxGeometry(1.92, 0.95, 4.36);
const geoBusRoof = new THREE.BoxGeometry(1.88, 0.15, 4.3);
const geoBusWindshield = new THREE.BoxGeometry(1.82, 0.65, 0.08);
const geoBusSideGlass = new THREE.BoxGeometry(0.06, 0.5, 3.6);
const geoBusDestBoard = new THREE.BoxGeometry(1.4, 0.3, 0.08);
const geoBusWheel = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 12);

const matBusRed = new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.4 });
const matBusCream = new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.3 });
const matBusDest = new THREE.MeshBasicMaterial({ color: '#facc15' });

export const Obstacles: React.FC<ObstaclesProps> = ({ obstacles }) => {
  return (
    <group>
      {obstacles.map((obs) => {
        const xPos = obs.lane * LANE_WIDTH;

        if (obs.type === 'BARRICADE') {
          return (
            <group key={obs.id} position={[xPos, 0, obs.z]}>
              <mesh position={[-0.9, 0.45, 0]} geometry={geoBarricadePost} material={matDarkPost} castShadow />
              <mesh position={[0.9, 0.45, 0]} geometry={geoBarricadePost} material={matDarkPost} castShadow />
              <mesh position={[-0.9, 0.05, 0]} geometry={geoBarricadeFoot} material={matDarkFoot} />
              <mesh position={[0.9, 0.05, 0]} geometry={geoBarricadeFoot} material={matDarkFoot} />
              <mesh position={[0, 0.52, 0]} geometry={geoBarricadeBoard} material={matCautionYellow} castShadow receiveShadow />
              
              {/* Caution diagonal stripes */}
              {[-0.6, -0.2, 0.2, 0.6].map((dx, i) => (
                <mesh key={i} position={[dx, 0.52, 0.06]} rotation={[0, 0, 0.4]} geometry={geoBarricadeStripe} material={matBlackStripe} />
              ))}
              <mesh position={[0, 0.88, 0]} geometry={geoWarningLight} material={matWarningRed} />
            </group>
          );
        }

        if (obs.type === 'OVERHEAD') {
          return (
            <group key={obs.id} position={[xPos, 0, obs.z]}>
              <mesh position={[-1.1, 1.6, 0]} geometry={geoOverheadPost} material={matOverheadSteel} castShadow />
              <mesh position={[1.1, 1.6, 0]} geometry={geoOverheadPost} material={matOverheadSteel} castShadow />
              <mesh position={[0, 1.8, 0]} geometry={geoOverheadGirder} material={matOverheadRed} castShadow receiveShadow />
              <mesh position={[0, 1.8, 0.12]} geometry={geoOverheadSign} material={matSignboardYellow} />

              {[-0.7, -0.35, 0, 0.35, 0.7].map((dx, i) => (
                <mesh key={i} position={[dx, 1.8, 0.15]} rotation={[0, 0, -0.45]} geometry={geoOverheadStripe} material={matBlackStripe} />
              ))}
            </group>
          );
        }

        // VEHICLE: Deterministically vary vehicle types across Auto-Rickshaw, Taxi, and TSRTC City Bus
        const vehicleHash = Math.abs(
          obs.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        );
        const vehicleType = vehicleHash % 3;

        if (vehicleType === 1) {
          // 1. White Hyderabad City Taxi
          return (
            <group key={obs.id} position={[xPos, 0, obs.z]}>
              {/* Main Chassis */}
              <mesh position={[0, 0.55, 0]} geometry={geoTaxiBody} material={matTaxiWhite} castShadow receiveShadow />
              <mesh position={[0, 1.05, -0.1]} geometry={geoTaxiCabin} material={matTaxiWhite} castShadow />
              <mesh position={[0, 1.05, -0.1]} geometry={geoTaxiGlass} material={matAutoGlass} />
              {/* Taxi Roof Sign */}
              <mesh position={[0, 1.45, -0.1]} geometry={geoTaxiRoofSign} material={matTaxiRoofSign} />
              {/* Bumpers */}
              <mesh position={[0, 0.4, 1.62]} geometry={geoTaxiBumper} material={matTaxiBumper} />
              <mesh position={[0, 0.4, -1.62]} geometry={geoTaxiBumper} material={matTaxiBumper} />
              {/* Headlights */}
              <mesh position={[-0.65, 0.6, 1.62]} rotation={[Math.PI / 2, 0, 0]} geometry={geoCarHeadlight} material={matHeadlightYellow} />
              <mesh position={[0.65, 0.6, 1.62]} rotation={[Math.PI / 2, 0, 0]} geometry={geoCarHeadlight} material={matHeadlightYellow} />
              {/* Wheels */}
              <mesh position={[-0.92, 0.32, 1.0]} rotation={[0, 0, Math.PI / 2]} geometry={geoCarWheel} material={matRubberWheel} castShadow />
              <mesh position={[0.92, 0.32, 1.0]} rotation={[0, 0, Math.PI / 2]} geometry={geoCarWheel} material={matRubberWheel} castShadow />
              <mesh position={[-0.92, 0.32, -1.0]} rotation={[0, 0, Math.PI / 2]} geometry={geoCarWheel} material={matRubberWheel} castShadow />
              <mesh position={[0.92, 0.32, -1.0]} rotation={[0, 0, Math.PI / 2]} geometry={geoCarWheel} material={matRubberWheel} castShadow />
              {/* Taillights */}
              <mesh position={[-0.65, 0.6, -1.62]} geometry={geoAutoTaillight} material={matWarningRed} />
              <mesh position={[0.65, 0.6, -1.62]} geometry={geoAutoTaillight} material={matWarningRed} />
            </group>
          );
        }

        if (vehicleType === 2) {
          // 2. TSRTC Hyderabad Red & Cream City Bus
          return (
            <group key={obs.id} position={[xPos, 0, obs.z]}>
              {/* Lower Red Body */}
              <mesh position={[0, 0.75, 0]} geometry={geoBusLowerBody} material={matBusRed} castShadow receiveShadow />
              {/* Upper Cream Cabin */}
              <mesh position={[0, 1.65, 0]} geometry={geoBusUpperBody} material={matBusCream} castShadow />
              <mesh position={[0, 2.18, 0]} geometry={geoBusRoof} material={matBusRed} />
              {/* Front Windshield & Destination Board */}
              <mesh position={[0, 1.65, 2.2]} geometry={geoBusWindshield} material={matAutoGlass} />
              <mesh position={[0, 2.05, 2.22]} geometry={geoBusDestBoard} material={matBusDest} />
              {/* Side Passenger Windows */}
              <mesh position={[-0.98, 1.65, 0]} geometry={geoBusSideGlass} material={matAutoGlass} />
              <mesh position={[0.98, 1.65, 0]} geometry={geoBusSideGlass} material={matAutoGlass} />
              {/* Front Headlights */}
              <mesh position={[-0.72, 0.6, 2.22]} rotation={[Math.PI / 2, 0, 0]} geometry={geoCarHeadlight} material={matHeadlightYellow} />
              <mesh position={[0.72, 0.6, 2.22]} rotation={[Math.PI / 2, 0, 0]} geometry={geoCarHeadlight} material={matHeadlightYellow} />
              {/* Wheels */}
              <mesh position={[-1.0, 0.38, 1.4]} rotation={[0, 0, Math.PI / 2]} geometry={geoBusWheel} material={matRubberWheel} castShadow />
              <mesh position={[1.0, 0.38, 1.4]} rotation={[0, 0, Math.PI / 2]} geometry={geoBusWheel} material={matRubberWheel} castShadow />
              <mesh position={[-1.0, 0.38, -1.4]} rotation={[0, 0, Math.PI / 2]} geometry={geoBusWheel} material={matRubberWheel} castShadow />
              <mesh position={[1.0, 0.38, -1.4]} rotation={[0, 0, Math.PI / 2]} geometry={geoBusWheel} material={matRubberWheel} castShadow />
              {/* Rear Taillights */}
              <mesh position={[-0.75, 0.8, -2.22]} geometry={geoAutoTaillight} material={matWarningRed} />
              <mesh position={[0.75, 0.8, -2.22]} geometry={geoAutoTaillight} material={matWarningRed} />
            </group>
          );
        }

        // 0. Classic Hyderabad Auto Rickshaw
        return (
          <group key={obs.id} position={[xPos, 0, obs.z]}>
            <mesh position={[0, 0.65, 0]} geometry={geoAutoBody} material={matAutoGreen} castShadow receiveShadow />
            <mesh position={[0, 0.6, 1.3]} geometry={geoAutoHood} material={matAutoYellow} castShadow />
            <mesh position={[0, 1.45, -0.1]} geometry={geoAutoCanopy} material={matAutoCanopy} castShadow />
            <mesh position={[0, 1.25, 1.0]} rotation={[-0.2, 0, 0]} geometry={geoAutoWindshield} material={matAutoGlass} />
            <mesh position={[0, 0.65, 1.66]} rotation={[Math.PI / 2, 0, 0]} geometry={geoAutoHeadlight} material={matHeadlightYellow} />

            {/* Wheels */}
            <mesh position={[0, 0.28, 1.4]} rotation={[0, 0, Math.PI / 2]} geometry={geoAutoWheel} material={matRubberWheel} castShadow />
            <mesh position={[-0.85, 0.28, -0.7]} rotation={[0, 0, Math.PI / 2]} geometry={geoAutoWheel} material={matRubberWheel} castShadow />
            <mesh position={[0.85, 0.28, -0.7]} rotation={[0, 0, Math.PI / 2]} geometry={geoAutoWheel} material={matRubberWheel} castShadow />

            {/* Taillights */}
            <mesh position={[-0.65, 0.6, -1.22]} geometry={geoAutoTaillight} material={matWarningRed} />
            <mesh position={[0.65, 0.6, -1.22]} geometry={geoAutoTaillight} material={matWarningRed} />
          </group>
        );
      })}
    </group>
  );
};
