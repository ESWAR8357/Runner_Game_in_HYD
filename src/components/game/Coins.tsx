import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CoinItem, LANE_WIDTH } from '../../types/game';

interface CoinsProps {
  coins: CoinItem[];
}

const MAX_COINS = 80;
const _dummy = new THREE.Object3D();

export const Coins: React.FC<CoinsProps> = ({ coins }) => {
  const discMeshRef = useRef<THREE.InstancedMesh>(null);
  const starMeshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-allocate shared geometries and materials once
  const { discGeo, starGeo, discMat, starMat } = useMemo(() => {
    const dGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 14);
    const sGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.09, 6);
    const dMat = new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      metalness: 0.92,
      roughness: 0.15,
      emissive: '#d97706',
      emissiveIntensity: 0.35,
    });
    const sMat = new THREE.MeshStandardMaterial({
      color: '#fef08a',
      metalness: 0.95,
      roughness: 0.1,
      emissive: '#fde047',
      emissiveIntensity: 0.5,
    });
    return { discGeo: dGeo, starGeo: sGeo, discMat: dMat, starMat: sMat };
  }, []);

  useEffect(() => {
    return () => {
      discGeo.dispose();
      starGeo.dispose();
      discMat.dispose();
      starMat.dispose();
    };
  }, [discGeo, starGeo, discMat, starMat]);

  // Update instance matrices directly on the GPU without React reconciliation
  useFrame(({ clock }) => {
    const discMesh = discMeshRef.current;
    const starMesh = starMeshRef.current;
    if (!discMesh || !starMesh) return;

    const rotAngle = (clock.getElapsedTime() * 3.6) % (Math.PI * 2);
    const count = Math.min(coins.length, MAX_COINS);

    for (let i = 0; i < MAX_COINS; i++) {
      if (i < count && !coins[i].collected) {
        const coin = coins[i];
        const xPos = coin.lane * LANE_WIDTH;

        _dummy.position.set(xPos, coin.y, coin.z);
        _dummy.rotation.set(Math.PI / 2, 0, rotAngle);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();

        discMesh.setMatrixAt(i, _dummy.matrix);
        starMesh.setMatrixAt(i, _dummy.matrix);
      } else {
        _dummy.position.set(0, -999, 0);
        _dummy.scale.set(0, 0, 0);
        _dummy.updateMatrix();

        discMesh.setMatrixAt(i, _dummy.matrix);
        starMesh.setMatrixAt(i, _dummy.matrix);
      }
    }

    discMesh.instanceMatrix.needsUpdate = true;
    starMesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={discMeshRef}
        args={[discGeo, discMat, MAX_COINS]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={starMeshRef}
        args={[starGeo, starMat, MAX_COINS]}
        frustumCulled={false}
      />
    </group>
  );
};
