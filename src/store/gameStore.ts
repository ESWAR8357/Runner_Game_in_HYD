import { create } from 'zustand';
import { GameState, Lane } from '../types/game';
import { PowerUpType } from '../types/powerups';
import { Mission, Costume, INITIAL_MISSIONS, INITIAL_COSTUMES } from '../types/missions';
import { soundManager } from '../audio/soundManager';

interface GameStore {
  gameState: GameState;
  score: number;
  distance: number;
  coins: number;
  highScore: number;
  totalCoins: number;
  speed: number;
  baseSpeed: number;
  maxSpeed: number;
  isMuted: boolean;

  // Player state
  currentLane: Lane;
  isJumping: boolean;
  isSliding: boolean;
  jumpVelocity: number;
  playerY: number;
  slideTimer: number;

  // Power-Ups state
  magnetTimer: number;
  hasShield: boolean;
  speedBoostTimer: number;
  multiplierTimer: number;
  specialActionTimer: number; // For cinematic hero animation
  isLionRush: boolean;
  lionRushTimer: number;

  // Missions & Customization
  missions: Mission[];
  costumes: Costume[];
  equippedCostumeId: string;
  obstaclesDodged: number;
  powerupsCollectedRun: number;
  rewardNotification: { title: string; subtitle: string } | null;

  // Settings
  musicVolume: number;
  sfxVolume: number;
  graphicsQuality: 'high' | 'medium' | 'low';
  controlSensitivity: number;
  isFullscreen: boolean;
  showFps: boolean;

  // Hero Preview Rotation
  previewHeroRotation: number;
  setPreviewHeroRotation: (val: number) => void;

  // Settings Actions
  setMusicVolume: (val: number) => void;
  setSfxVolume: (val: number) => void;
  setGraphicsQuality: (val: 'high' | 'medium' | 'low') => void;
  setControlSensitivity: (val: number) => void;
  toggleFullscreen: () => void;
  toggleShowFps: () => void;
  purchaseShopItem: (id: string, cost: number) => boolean;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  restartGame: () => void;
  returnToMenu: () => void;
  toggleMute: () => void;

  // Controls
  moveLeft: () => void;
  moveRight: () => void;
  jump: () => void;
  slide: () => void;
  collectCoin: () => void;
  collectPowerUp: (type: PowerUpType) => void;
  breakShield: () => void;
  recordObstacleDodge: () => void;
  claimMission: (missionId: string) => void;
  equipCostume: (costumeId: string) => void;
  dismissRewardNotification: () => void;

  // Tick updates
  updateTick: (delta: number) => void;
  setPlayerY: (y: number) => void;
  setJumping: (val: boolean) => void;
  setSliding: (val: boolean) => void;
}

const LOCAL_STORAGE_HIGH_SCORE = 'bk_runner_high_score';
const LOCAL_STORAGE_TOTAL_COINS = 'bk_runner_total_coins';
const LOCAL_STORAGE_MUTED = 'bk_runner_muted';
const LOCAL_STORAGE_MISSIONS = 'bk_runner_missions';
const LOCAL_STORAGE_COSTUMES = 'bk_runner_costumes';
const LOCAL_STORAGE_EQUIPPED_COSTUME = 'bk_runner_equipped_costume';

const getInitialHighScore = (): number => {
  try {
    return parseInt(localStorage.getItem(LOCAL_STORAGE_HIGH_SCORE) || '0', 10);
  } catch {
    return 0;
  }
};

const getInitialTotalCoins = (): number => {
  try {
    return parseInt(localStorage.getItem(LOCAL_STORAGE_TOTAL_COINS) || '0', 10);
  } catch {
    return 0;
  }
};

const getInitialMuted = (): boolean => {
  try {
    return localStorage.getItem(LOCAL_STORAGE_MUTED) === 'true';
  } catch {
    return false;
  }
};

const getInitialMissions = (): Mission[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_MISSIONS);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_MISSIONS;
};

const getInitialCostumes = (): Costume[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_COSTUMES);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_COSTUMES;
};

const getInitialEquippedCostume = (): string => {
  try {
    return localStorage.getItem(LOCAL_STORAGE_EQUIPPED_COSTUME) || 'default-mass';
  } catch {
    return 'default-mass';
  }
};

let lastUiFlushTimestamp = 0;

export const useGameStore = create<GameStore>((set, get) => {
  const initialMuted = getInitialMuted();
  soundManager.setMuted(initialMuted);

  return {
    gameState: 'MENU',
    score: 0,
    distance: 0,
    coins: 0,
    highScore: getInitialHighScore(),
    totalCoins: getInitialTotalCoins(),
    speed: 16,
    baseSpeed: 16,
    maxSpeed: 24.5,
    isMuted: initialMuted,

    currentLane: 0,
    isJumping: false,
    isSliding: false,
    jumpVelocity: 0,
    playerY: 0,
    slideTimer: 0,

    magnetTimer: 0,
    hasShield: false,
    speedBoostTimer: 0,
    multiplierTimer: 0,
    specialActionTimer: 0,
    isLionRush: false,
    lionRushTimer: 0,

    missions: getInitialMissions(),
    costumes: getInitialCostumes(),
    equippedCostumeId: getInitialEquippedCostume(),
    obstaclesDodged: 0,
    powerupsCollectedRun: 0,
    rewardNotification: null,

    musicVolume: 80,
    sfxVolume: 90,
    graphicsQuality: 'high',
    controlSensitivity: 1.0,
    isFullscreen: false,
    showFps: true,
    previewHeroRotation: 0,

    setPreviewHeroRotation: (val: number) => set({ previewHeroRotation: val }),

    setMusicVolume: (val: number) => {
      soundManager.setMusicVolume(val / 100);
      set({ musicVolume: val });
    },

    setSfxVolume: (val: number) => {
      soundManager.setSfxVolume(val / 100);
      set({ sfxVolume: val });
    },

    setGraphicsQuality: (val: 'high' | 'medium' | 'low') => {
      set({ graphicsQuality: val });
    },

    setControlSensitivity: (val: number) => {
      set({ controlSensitivity: val });
    },

    toggleShowFps: () => {
      set((s) => ({ showFps: !s.showFps }));
    },

    toggleFullscreen: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        set({ isFullscreen: true });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        set({ isFullscreen: false });
      }
    },

    purchaseShopItem: (id: string, cost: number) => {
      const state = get();
      if (state.totalCoins >= cost) {
        const newTotal = state.totalCoins - cost;
        set({
          totalCoins: newTotal,
          rewardNotification: {
            title: 'Upgrade Purchased!',
            subtitle: `Unlocked ${id} (-${cost} Coins)`,
          },
        });
        try {
          localStorage.setItem(LOCAL_STORAGE_TOTAL_COINS, newTotal.toString());
        } catch {
          // ignore
        }
        return true;
      }
      return false;
    },

    startGame: () => {
      set({
        gameState: 'PLAYING',
        score: 0,
        distance: 0,
        coins: 0,
        speed: 16,
        currentLane: 0,
        isJumping: false,
        isSliding: false,
        jumpVelocity: 0,
        playerY: 0,
        slideTimer: 0,
        magnetTimer: 0,
        hasShield: false,
        speedBoostTimer: 0,
        multiplierTimer: 0,
        specialActionTimer: 0,
        isLionRush: false,
        lionRushTimer: 0,
        obstaclesDodged: 0,
        powerupsCollectedRun: 0,
      });
      soundManager.startBGM();
    },

    pauseGame: () => {
      if (get().gameState === 'PLAYING') {
        set({ gameState: 'PAUSED' });
        soundManager.stopBGM();
      }
    },

    resumeGame: () => {
      if (get().gameState === 'PAUSED') {
        set({ gameState: 'PLAYING' });
        soundManager.startBGM();
      }
    },

    gameOver: () => {
      const state = get();
      soundManager.playCrash();
      soundManager.stopBGM();

      const newHighScore = Math.max(state.highScore, state.score);
      const newTotalCoins = state.totalCoins + state.coins;

      try {
        localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE, newHighScore.toString());
        localStorage.setItem(LOCAL_STORAGE_TOTAL_COINS, newTotalCoins.toString());
      } catch {
        // Ignore
      }

      set({
        gameState: 'GAME_OVER',
        highScore: newHighScore,
        totalCoins: newTotalCoins,
      });
    },

    restartGame: () => {
      get().startGame();
    },

    returnToMenu: () => {
      soundManager.stopBGM();
      set({
        gameState: 'MENU',
        score: 0,
        distance: 0,
        coins: 0,
        currentLane: 0,
        isJumping: false,
        isSliding: false,
        playerY: 0,
        magnetTimer: 0,
        hasShield: false,
        speedBoostTimer: 0,
        multiplierTimer: 0,
        isLionRush: false,
      });
    },

    toggleMute: () => {
      const newMuted = !get().isMuted;
      soundManager.setMuted(newMuted);
      try {
        localStorage.setItem(LOCAL_STORAGE_MUTED, newMuted.toString());
      } catch {
        // ignore
      }
      set({ isMuted: newMuted });
      if (!newMuted && get().gameState === 'PLAYING') {
        soundManager.startBGM();
      }
    },

    moveLeft: () => {
      const { gameState, currentLane } = get();
      if (gameState !== 'PLAYING') return;
      if (currentLane > -1) {
        soundManager.playLaneSwitch();
        set({ currentLane: (currentLane - 1) as Lane });
      }
    },

    moveRight: () => {
      const { gameState, currentLane } = get();
      if (gameState !== 'PLAYING') return;
      if (currentLane < 1) {
        soundManager.playLaneSwitch();
        set({ currentLane: (currentLane + 1) as Lane });
      }
    },

    jump: () => {
      const { gameState, isJumping } = get();
      if (gameState !== 'PLAYING') return;
      if (!isJumping) {
        soundManager.playJump();
        set({
          isJumping: true,
          jumpVelocity: 12.8,
          isSliding: false,
          slideTimer: 0,
        });
      }
    },

    slide: () => {
      const { gameState, isSliding, isJumping } = get();
      if (gameState !== 'PLAYING') return;
      if (!isSliding) {
        soundManager.playSlide();
        set((state) => ({
          isSliding: true,
          slideTimer: 0.75,
          jumpVelocity: isJumping ? -18 : state.jumpVelocity,
        }));
      } else {
        set({ slideTimer: 0.75 });
      }
    },

    collectCoin: () => {
      soundManager.playCoin();
      const state = get();
      const mult = state.multiplierTimer > 0 ? 2 : 1;
      const coinScoreBonus = 50 * mult;

      // Update coins and score
      set((s) => ({
        coins: s.coins + 1,
        score: s.score + coinScoreBonus,
      }));

      // Update mission progress for coins
      const updatedMissions = state.missions.map((m) => {
        if (m.type === 'COINS' && !m.completed) {
          const newCurrent = m.current + 1;
          const isDone = newCurrent >= m.target;
          if (isDone) {
            set({
              rewardNotification: {
                title: 'Mission Complete!',
                subtitle: `${m.title} (+${m.rewardCoins} Coins)`,
              },
            });
          }
          return { ...m, current: newCurrent, completed: isDone };
        }
        return m;
      });

      set({ missions: updatedMissions });
      try {
        localStorage.setItem(LOCAL_STORAGE_MISSIONS, JSON.stringify(updatedMissions));
      } catch {
        // ignore
      }
    },

    collectPowerUp: (type: PowerUpType) => {
      soundManager.playSpecialAction();
      const state = get();

      // Trigger cinematic hero action roar/punch animation for 1.2s
      set({ specialActionTimer: 1.2 });

      if (type === 'MAGNET') {
        set({ magnetTimer: 10 });
      } else if (type === 'SHIELD') {
        set({ hasShield: true });
      } else if (type === 'SPEED_BOOST') {
        set({ speedBoostTimer: 8 });
      } else if (type === 'MULTIPLIER') {
        set({ multiplierTimer: 15 });
      }

      // Mission progress for powerups
      const newCount = state.powerupsCollectedRun + 1;
      const updatedMissions = state.missions.map((m) => {
        if (m.type === 'POWERUPS' && !m.completed) {
          const newCur = m.current + 1;
          const isDone = newCur >= m.target;
          if (isDone) {
            set({
              rewardNotification: {
                title: 'Mission Complete!',
                subtitle: `${m.title} (+${m.rewardCoins} Coins)`,
              },
            });
          }
          return { ...m, current: newCur, completed: isDone };
        }
        return m;
      });

      set({
        powerupsCollectedRun: newCount,
        missions: updatedMissions,
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_MISSIONS, JSON.stringify(updatedMissions));
      } catch {
        // ignore
      }
    },

    breakShield: () => {
      soundManager.playShieldBreak();
      set({ hasShield: false });
    },

    recordObstacleDodge: () => {
      const state = get();
      const newDodge = state.obstaclesDodged + 1;
      const updatedMissions = state.missions.map((m) => {
        if (m.type === 'DODGE' && !m.completed) {
          const newCur = m.current + 1;
          const isDone = newCur >= m.target;
          if (isDone) {
            set({
              rewardNotification: {
                title: 'Mission Complete!',
                subtitle: `${m.title} (+${m.rewardCoins} Coins)`,
              },
            });
          }
          return { ...m, current: newCur, completed: isDone };
        }
        return m;
      });

      set({
        obstaclesDodged: newDodge,
        missions: updatedMissions,
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_MISSIONS, JSON.stringify(updatedMissions));
      } catch {
        // ignore
      }
    },

    claimMission: (missionId: string) => {
      const state = get();
      let bonusCoins = 0;
      let unlockedCostumeId: string | undefined;

      const updatedMissions = state.missions.map((m) => {
        if (m.id === missionId && m.completed && !m.claimed) {
          bonusCoins += m.rewardCoins;
          if (m.rewardCostumeId) {
            unlockedCostumeId = m.rewardCostumeId;
          }
          return { ...m, claimed: true };
        }
        return m;
      });

      let updatedCostumes = state.costumes;
      if (unlockedCostumeId) {
        updatedCostumes = state.costumes.map((c) =>
          c.id === unlockedCostumeId ? { ...c, unlocked: true } : c
        );
      }

      const newTotal = state.totalCoins + bonusCoins;

      set({
        missions: updatedMissions,
        costumes: updatedCostumes,
        totalCoins: newTotal,
      });

      try {
        localStorage.setItem(LOCAL_STORAGE_MISSIONS, JSON.stringify(updatedMissions));
        localStorage.setItem(LOCAL_STORAGE_COSTUMES, JSON.stringify(updatedCostumes));
        localStorage.setItem(LOCAL_STORAGE_TOTAL_COINS, newTotal.toString());
      } catch {
        // ignore
      }
    },

    equipCostume: (costumeId: string) => {
      set({ equippedCostumeId: costumeId });
      try {
        localStorage.setItem(LOCAL_STORAGE_EQUIPPED_COSTUME, costumeId);
      } catch {
        // ignore
      }
    },

    dismissRewardNotification: () => {
      set({ rewardNotification: null });
    },

    setPlayerY: (y: number) => {
      const s = get() as any;
      s.playerY = y;
      // Only notify React listeners at key physics milestones (ground landing or takeoff)
      if (y === 0 || (s.playerY > 0 && Math.abs(y - 0.1) < 0.05)) {
        set({ playerY: y });
      }
    },
    setJumping: (val: boolean) => set({ isJumping: val }),
    setSliding: (val: boolean) => set({ isSliding: val }),

    updateTick: (delta: number) => {
      const state = get();
      if (state.gameState !== 'PLAYING') return;

      // 1. Difficulty progression: comfortable 16 m/s, accelerating gradually to 24.5 m/s over 1800m
      const progress = Math.min(1.0, state.distance / 1800);
      const normalSpeed = state.baseSpeed + progress * (state.maxSpeed - state.baseSpeed);

      // Speed boost adds a controllable +4.0 m/s (hard-capped at 28.0 m/s without runaway multiplication)
      const boostAmount = state.speedBoostTimer > 0 ? 4.0 : 0;
      const effectiveSpeed = Math.min(28.0, normalSpeed + boostAmount);
      const deltaDist = effectiveSpeed * delta;
      const newDistance = state.distance + deltaDist;

      // Score multiplier: double score when active
      const mult = state.multiplierTimer > 0 ? 2 : 1;
      const newScore = state.score + Math.floor(deltaDist * mult);

      // Power-up timers countdown
      const newMagnet = Math.max(0, state.magnetTimer - delta);
      const newSpeedBoost = Math.max(0, state.speedBoostTimer - delta);
      const newMultiplier = Math.max(0, state.multiplierTimer - delta);
      const newSpecialAction = Math.max(0, state.specialActionTimer - delta);

      // Slide countdown
      let newSliding = state.isSliding;
      let newSlideTimer = state.slideTimer;
      if (newSliding) {
        newSlideTimer -= delta;
        if (newSlideTimer <= 0) {
          newSliding = false;
          newSlideTimer = 0;
        }
      }

      // Keep mutable reference updated for instantaneous 60fps reads in Three.js useFrame
      const mutableState = state as any;
      mutableState.distance = newDistance;
      mutableState.score = newScore;
      mutableState.speed = effectiveSpeed;
      mutableState.isSliding = newSliding;
      mutableState.slideTimer = newSlideTimer;
      mutableState.magnetTimer = newMagnet;
      mutableState.speedBoostTimer = newSpeedBoost;
      mutableState.multiplierTimer = newMultiplier;
      mutableState.specialActionTimer = newSpecialAction;

      // Check distance missions (only on whole meter boundaries to avoid unnecessary allocations)
      let missionsChanged = false;
      let newRewardNotification = state.rewardNotification;
      let updatedMissions = state.missions;

      if (Math.floor(newDistance) > Math.floor(state.distance)) {
        for (let i = 0; i < state.missions.length; i++) {
          const m = state.missions[i];
          if (m.type === 'DISTANCE' && !m.completed && newDistance >= m.target) {
            missionsChanged = true;
            newRewardNotification = {
              title: 'Mission Complete!',
              subtitle: `${m.title} (+${m.rewardCoins} Coins)`,
            };
            break;
          }
        }
        if (missionsChanged) {
          updatedMissions = state.missions.map((m) => {
            if (m.type === 'DISTANCE' && !m.completed) {
              const isDone = newDistance >= m.target;
              return { ...m, current: Math.floor(newDistance), completed: isDone };
            }
            return m;
          });
        }
      }

      const now = performance.now();
      const shouldFlushUi =
        now - lastUiFlushTimestamp > 80 || // ~12 fps HUD update rate
        newSliding !== state.isSliding ||
        missionsChanged ||
        (state.magnetTimer > 0 && newMagnet === 0) ||
        (state.speedBoostTimer > 0 && newSpeedBoost === 0) ||
        (state.multiplierTimer > 0 && newMultiplier === 0);

      if (shouldFlushUi) {
        lastUiFlushTimestamp = now;
        set({
          distance: newDistance,
          score: newScore,
          speed: effectiveSpeed,
          isSliding: newSliding,
          slideTimer: newSlideTimer,
          magnetTimer: newMagnet,
          speedBoostTimer: newSpeedBoost,
          multiplierTimer: newMultiplier,
          specialActionTimer: newSpecialAction,
          ...(missionsChanged ? { missions: updatedMissions, rewardNotification: newRewardNotification } : {}),
        });
      }
    },
  };
});
