export type EnvironmentZone =
  | 'OLD_HYDERABAD'
  | 'CITY_TRAFFIC'
  | 'HUSSAIN_SAGAR'
  | 'HITEC_CITY'
  | 'HYDERABAD_HIGHWAY';

export interface ZoneConfig {
  id: EnvironmentZone;
  name: string;
  tagline: string;
  distanceStart: number;
  distanceEnd: number;
  skyColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  sunColor: string;
  sunIntensity: number;
  hemiSkyColor: string;
  hemiGroundColor: string;
  hemiIntensity: number;
  badgeColor: string;
}

export const ENVIRONMENT_ZONES: Record<EnvironmentZone, ZoneConfig> = {
  OLD_HYDERABAD: {
    id: 'OLD_HYDERABAD',
    name: 'Old Hyderabad',
    tagline: 'Charminar & Historic Bazaars',
    distanceStart: 0,
    distanceEnd: 320,
    skyColor: '#1c1917',
    fogColor: '#1c1917',
    fogNear: 35,
    fogFar: 140,
    sunColor: '#fef08a', // warm golden morning sun
    sunIntensity: 1.8,
    hemiSkyColor: '#fdba74',
    hemiGroundColor: '#292524',
    hemiIntensity: 0.9,
    badgeColor: 'from-amber-600 to-yellow-500',
  },
  CITY_TRAFFIC: {
    id: 'CITY_TRAFFIC',
    name: 'City Traffic',
    tagline: 'RTC Buses, Crossings & Signals',
    distanceStart: 320,
    distanceEnd: 680,
    skyColor: '#0f172a',
    fogColor: '#0f172a',
    fogNear: 40,
    fogFar: 145,
    sunColor: '#ffffff', // bright midday sun
    sunIntensity: 1.9,
    hemiSkyColor: '#60a5fa',
    hemiGroundColor: '#1e293b',
    hemiIntensity: 0.85,
    badgeColor: 'from-red-600 to-amber-500',
  },
  HUSSAIN_SAGAR: {
    id: 'HUSSAIN_SAGAR',
    name: 'Hussain Sagar',
    tagline: 'Tank Bund Lake & Buddha Silhouette',
    distanceStart: 680,
    distanceEnd: 1100,
    skyColor: '#0c1b33', // twilight blue
    fogColor: '#0c1b33',
    fogNear: 45,
    fogFar: 155,
    sunColor: '#fdba74', // golden sunset on water
    sunIntensity: 1.5,
    hemiSkyColor: '#38bdf8',
    hemiGroundColor: '#064e3b',
    hemiIntensity: 0.95,
    badgeColor: 'from-cyan-600 to-blue-500',
  },
  HITEC_CITY: {
    id: 'HITEC_CITY',
    name: 'HITEC City',
    tagline: 'Cyber Towers & Neon Towers',
    distanceStart: 1100,
    distanceEnd: 1550,
    skyColor: '#070913', // deep cyber night
    fogColor: '#070913',
    fogNear: 35,
    fogFar: 135,
    sunColor: '#67e8f9', // cyan neon key
    sunIntensity: 1.4,
    hemiSkyColor: '#d946ef', // magenta neon rim
    hemiGroundColor: '#020617',
    hemiIntensity: 0.8,
    badgeColor: 'from-purple-600 to-cyan-500',
  },
  HYDERABAD_HIGHWAY: {
    id: 'HYDERABAD_HIGHWAY',
    name: 'Hyderabad Highway',
    tagline: 'ORR Outer Ring Road & Flyovers',
    distanceStart: 1550,
    distanceEnd: 2050,
    skyColor: '#171221', // vibrant sunset highway
    fogColor: '#171221',
    fogNear: 45,
    fogFar: 160,
    sunColor: '#f97316', // orange highway dusk
    sunIntensity: 1.7,
    hemiSkyColor: '#f43f5e',
    hemiGroundColor: '#1c1917',
    hemiIntensity: 0.85,
    badgeColor: 'from-emerald-600 to-teal-500',
  },
};

export const getZoneForDistance = (distance: number): ZoneConfig => {
  // Loop zones continuously after 2050m
  const cycleDistance = distance % 2050;

  if (cycleDistance < 320) return ENVIRONMENT_ZONES.OLD_HYDERABAD;
  if (cycleDistance < 680) return ENVIRONMENT_ZONES.CITY_TRAFFIC;
  if (cycleDistance < 1100) return ENVIRONMENT_ZONES.HUSSAIN_SAGAR;
  if (cycleDistance < 1550) return ENVIRONMENT_ZONES.HITEC_CITY;
  return ENVIRONMENT_ZONES.HYDERABAD_HIGHWAY;
};
