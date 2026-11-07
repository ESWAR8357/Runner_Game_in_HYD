import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../../store/gameStore';
import { getZoneForDistance } from '../../../types/zones';

export const ZoneAtmosphere: React.FC = () => {
  const { scene } = useThree();
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);

  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);

  // Pre-allocated Color helpers to avoid per-frame GC
  const targetFogColor = useRef(new THREE.Color());
  const currentFogColor = useRef(new THREE.Color('#1c1917'));

  const targetSunColor = useRef(new THREE.Color());
  const currentSunColor = useRef(new THREE.Color('#fef08a'));

  const targetHemiSky = useRef(new THREE.Color());
  const currentHemiSky = useRef(new THREE.Color('#fdba74'));

  const targetHemiGround = useRef(new THREE.Color());
  const currentHemiGround = useRef(new THREE.Color('#292524'));

  useFrame((_, delta) => {
    const distance = useGameStore.getState().distance;
    const zone = getZoneForDistance(distance);

    // 1. Smoothly interpolate Fog
    if (scene.fog && 'color' in scene.fog) {
      targetFogColor.current.set(zone.fogColor);
      currentFogColor.current.lerp(targetFogColor.current, delta * 1.5);
      (scene.fog as THREE.Fog).color.copy(currentFogColor.current);

      (scene.fog as THREE.Fog).near = THREE.MathUtils.damp(
        (scene.fog as THREE.Fog).near,
        zone.fogNear,
        1.5,
        delta
      );
      (scene.fog as THREE.Fog).far = THREE.MathUtils.damp(
        (scene.fog as THREE.Fog).far,
        zone.fogFar,
        1.5,
        delta
      );
    }

    // 2. Smoothly interpolate Background Sky color
    if (scene.background && 'isColor' in (scene.background as THREE.Color)) {
      (scene.background as THREE.Color).lerp(targetFogColor.current, delta * 1.5);
    }

    // 3. Smoothly interpolate Sun Light
    if (sunLightRef.current) {
      targetSunColor.current.set(zone.sunColor);
      currentSunColor.current.lerp(targetSunColor.current, delta * 1.5);
      sunLightRef.current.color.copy(currentSunColor.current);

      sunLightRef.current.intensity = THREE.MathUtils.damp(
        sunLightRef.current.intensity,
        zone.sunIntensity,
        1.5,
        delta
      );
    }

    // 4. Smoothly interpolate Hemisphere Fill Light
    if (hemiLightRef.current) {
      targetHemiSky.current.set(zone.hemiSkyColor);
      targetHemiGround.current.set(zone.hemiGroundColor);

      currentHemiSky.current.lerp(targetHemiSky.current, delta * 1.5);
      currentHemiGround.current.lerp(targetHemiGround.current, delta * 1.5);

      hemiLightRef.current.color.copy(currentHemiSky.current);
      hemiLightRef.current.groundColor.copy(currentHemiGround.current);

      hemiLightRef.current.intensity = THREE.MathUtils.damp(
        hemiLightRef.current.intensity,
        zone.hemiIntensity,
        1.5,
        delta
      );
    }
  });

  const shadowMapSize = graphicsQuality === 'high' ? 1024 : 512;

  return (
    <>
      {/* Dynamic Hemisphere Fill */}
      <hemisphereLight
        ref={hemiLightRef}
        args={['#fdba74', '#292524', 0.9]}
        position={[0, 50, 0]}
      />

      {/* Dynamic Directional Key Light with Soft Shadows */}
      <directionalLight
        ref={sunLightRef}
        position={[18, 28, 16]}
        intensity={1.8}
        castShadow={graphicsQuality !== 'low'}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.0004}
        shadow-camera-near={0.5}
        shadow-camera-far={95}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={16}
        shadow-camera-bottom={-12}
        color="#fef08a"
      />
    </>
  );
};
