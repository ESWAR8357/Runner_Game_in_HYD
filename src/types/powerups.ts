import { Lane } from './game';

export type PowerUpType = 'MAGNET' | 'SHIELD' | 'SPEED_BOOST' | 'MULTIPLIER';

export interface PowerUpItem {
  id: string;
  type: PowerUpType;
  lane: Lane;
  z: number;
  y: number;
  collected: boolean;
}

export interface ActivePowerUps {
  magnetTimer: number; // 10s
  hasShield: boolean;
  speedBoostTimer: number; // 8s
  multiplierTimer: number; // 15s
  specialActionTimer: number; // 1.2s cinematic punch/roar
}
