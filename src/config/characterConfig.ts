/**
 * Character Configuration
 * Easily allows swapping between the built-in procedural Telugu Action Hero
 * and an external rigged GLB/GLTF model with skeletal animations.
 */

export interface CharacterConfig {
  id: string;
  name: string;
  description: string;
  type: 'procedural' | 'gltf';
  // Optional URL to a GLTF/GLB asset with skeletal animations
  gltfUrl?: string;
  // Animation clip names mapping for external GLTF models
  animationMap?: {
    idle?: string;
    run?: string;
    jump?: string;
    slide?: string;
    land?: string;
    hit?: string;
    victory?: string;
  };
  // Visual customization parameters
  appearance: {
    skinTone: string;
    shirtColor: string;
    shirtRoughness: number;
    trousersColor: string;
    hairColor: string;
    sunglassesFrameColor: string;
    sunglassesLensColor: string;
    shoesColor: string;
    jewelryGoldColor: string;
    watchColor: string;
  };
}

export const TELUGU_ACTION_HERO_CONFIG: CharacterConfig = {
  id: 'balakrishna-hero',
  name: 'Mass Action Hero (Nandamuri Style)',
  description: 'Iconic Telugu mass hero with crisp white formal shirt, rolled sleeves, aviator sunglasses, and signature hairstyle.',
  type: 'procedural',
  // Can be set to a hosted GLB file URL if desired:
  gltfUrl: '',
  animationMap: {
    idle: 'Idle',
    run: 'Running',
    jump: 'Jump',
    slide: 'Slide',
    land: 'Land',
    hit: 'Hit',
    victory: 'Victory',
  },
  appearance: {
    skinTone: '#cf9868',
    shirtColor: '#ffffff',
    shirtRoughness: 0.35,
    trousersColor: '#0f172a',
    hairColor: '#111827',
    sunglassesFrameColor: '#f59e0b',
    sunglassesLensColor: '#050810',
    shoesColor: '#1e140d',
    jewelryGoldColor: '#fbbf24',
    watchColor: '#f59e0b',
  },
};
