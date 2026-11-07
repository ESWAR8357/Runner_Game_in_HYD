export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'COINS' | 'DISTANCE' | 'DODGE' | 'POWERUPS';
  target: number;
  current: number;
  rewardCoins: number;
  rewardCostumeId?: string;
  rewardName?: string;
  completed: boolean;
  claimed: boolean;
}

export interface Costume {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  shirtColor: string;
  trousersColor: string;
  shoesColor: string;
  jewelryGoldColor: string;
  sunglassesFrameColor: string;
  badge: string;
  previewGradient: string;
}

export const INITIAL_COSTUMES: Costume[] = [
  {
    id: 'default-mass',
    name: 'Classic Action White',
    description: 'Iconic crisp white formal action shirt, black tailored trousers & gold chain.',
    unlocked: true,
    shirtColor: '#ffffff',
    trousersColor: '#0f172a',
    shoesColor: '#1e140d',
    jewelryGoldColor: '#fbbf24',
    sunglassesFrameColor: '#f59e0b',
    badge: 'DEFAULT',
    previewGradient: 'from-slate-100 to-slate-300',
  },
  {
    id: 'royal-sherwani',
    name: 'Royal Nizam Sherwani',
    description: 'Regal golden embroidered formal sherwani with ivory accents.',
    unlocked: false,
    shirtColor: '#fef08a',
    trousersColor: '#1e293b',
    shoesColor: '#78350f',
    jewelryGoldColor: '#eab308',
    sunglassesFrameColor: '#f59e0b',
    badge: 'ROYAL',
    previewGradient: 'from-amber-400 to-yellow-600',
  },
  {
    id: 'midnight-tactical',
    name: 'Midnight Commando',
    description: 'Stealth charcoal tactical shirt with dark titanium shades and combat boots.',
    unlocked: false,
    shirtColor: '#18181b',
    trousersColor: '#09090b',
    shoesColor: '#18181b',
    jewelryGoldColor: '#cbd5e1',
    sunglassesFrameColor: '#71717a',
    badge: 'TACTICAL',
    previewGradient: 'from-zinc-700 to-zinc-950',
  },
  {
    id: 'simha-saffron',
    name: 'Simha Lion Rush',
    description: 'Fiery saffron silk action shirt with crimson accents and pure gold buckle.',
    unlocked: false,
    shirtColor: '#ea580c',
    trousersColor: '#1e1b4b',
    shoesColor: '#451a03',
    jewelryGoldColor: '#fbbf24',
    sunglassesFrameColor: '#f97316',
    badge: 'LEGEND',
    previewGradient: 'from-orange-500 to-red-600',
  },
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission-coins',
    title: 'Nizam Gold Collector',
    description: 'Collect 100 gold coins across Hyderabad streets',
    type: 'COINS',
    target: 100,
    current: 0,
    rewardCoins: 250,
    rewardCostumeId: 'royal-sherwani',
    rewardName: 'Royal Nizam Sherwani',
    completed: false,
    claimed: false,
  },
  {
    id: 'mission-distance',
    title: 'Hyderabad Marathon',
    description: 'Run 1,000 meters through the city',
    type: 'DISTANCE',
    target: 1000,
    current: 0,
    rewardCoins: 500,
    rewardCostumeId: 'midnight-tactical',
    rewardName: 'Midnight Commando Suit',
    completed: false,
    claimed: false,
  },
  {
    id: 'mission-dodge',
    title: 'Agile Mass Hero',
    description: 'Successfully dodge 20 road obstacles',
    type: 'DODGE',
    target: 20,
    current: 0,
    rewardCoins: 300,
    rewardCostumeId: 'simha-saffron',
    rewardName: 'Simha Lion Rush Outfit',
    completed: false,
    claimed: false,
  },
  {
    id: 'mission-powerups',
    title: 'Supercharged Rush',
    description: 'Collect 3 power-ups (Magnet, Shield, or Boost)',
    type: 'POWERUPS',
    target: 3,
    current: 0,
    rewardCoins: 400,
    rewardName: 'Bonus 400 Coins Bank',
    completed: false,
    claimed: false,
  },
];
