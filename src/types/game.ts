export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type Lane = -1 | 0 | 1;

export const LANE_WIDTH = 2.6; // distance between lanes in Three.js units

export type ObstacleType = 'BARRICADE' | 'OVERHEAD' | 'VEHICLE';

export interface Obstacle {
  id: string;
  type: ObstacleType;
  lane: Lane;
  z: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  color?: string;
  label?: string;
}

export interface CoinItem {
  id: string;
  lane: Lane;
  z: number;
  y: number;
  collected: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
}
