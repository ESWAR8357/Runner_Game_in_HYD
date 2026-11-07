import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getZoneForDistance, ZoneConfig } from '../../types/zones';
import {
  Pause,
  Volume2,
  VolumeX,
  MapPin,
  Shield,
  Magnet,
  Zap,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { MissionsModal } from './MissionsModal';

const FpsMeter: React.FC = () => {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animId: number;
    const loop = () => {
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 450) {
        const measured = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setFps(measured);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const badgeColor =
    fps >= 55
      ? 'bg-emerald-950/85 border-emerald-500/50 text-emerald-300'
      : fps >= 30
      ? 'bg-amber-950/85 border-amber-500/50 text-amber-300'
      : 'bg-rose-950/85 border-rose-500/50 text-rose-300';

  return (
    <div className={`border rounded-xl px-2.5 py-1 text-xs font-black shadow-md flex items-center gap-1.5 ${badgeColor}`}>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FPS</span>
      <span className="tabular-nums font-black">{fps}</span>
    </div>
  );
};

export const HUD: React.FC = () => {
  const {
    score,
    distance,
    coins,
    speed,
    isMuted,
    magnetTimer,
    hasShield,
    speedBoostTimer,
    multiplierTimer,
    rewardNotification,
    showFps,
    pauseGame,
    toggleMute,
    dismissRewardNotification,
  } = useGameStore();

  const currentZone = getZoneForDistance(distance);
  const [zoneBanner, setZoneBanner] = useState<ZoneConfig | null>(null);
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);
  const prevZoneIdRef = useRef<string>(currentZone.id);

  // Detect zone transitions to show announcement banner
  useEffect(() => {
    if (currentZone.id !== prevZoneIdRef.current) {
      prevZoneIdRef.current = currentZone.id;
      setZoneBanner(currentZone);
      const timer = window.setTimeout(() => {
        setZoneBanner(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentZone]);

  // Auto-dismiss mission toast after 4s
  useEffect(() => {
    if (rewardNotification) {
      const timer = window.setTimeout(() => {
        dismissRewardNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [rewardNotification, dismissRewardNotification]);

  return (
    <>
      <div className="absolute inset-0 pointer-events-none p-4 md:p-6 flex flex-col justify-between z-20">
        {/* Top Bar */}
        <div className="flex items-start justify-between w-full">
          {/* Top-Left: Score, Distance & Zone Badge */}
          <div className="flex flex-col gap-2">
            {/* Main Score Pill */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl px-4 py-2.5 shadow-xl shadow-black/50 flex items-baseline gap-2">
              <span className="text-xs uppercase tracking-widest font-black text-amber-400">Score</span>
              <span className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tight">
                {score.toLocaleString()}
              </span>
              {multiplierTimer > 0 && (
                <span className="ml-1 text-xs font-black text-amber-400 bg-amber-500/20 border border-amber-400/50 px-1.5 py-0.5 rounded-md animate-bounce">
                  2X
                </span>
              )}
            </div>

            {/* Distance & Zone Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-900/85 border border-slate-700/60 rounded-xl px-3 py-1 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-md">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Distance</span>
                <span className="font-bold text-amber-300 tabular-nums">{Math.floor(distance)}m</span>
              </div>

              <div
                className={`bg-gradient-to-r ${currentZone.badgeColor} text-white font-bold text-xs px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentZone.name}</span>
              </div>

              {showFps && <FpsMeter />}
            </div>

            {/* Active Power-Ups Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {magnetTimer > 0 && (
                <div className="bg-red-500/90 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-red-300 animate-pulse">
                  <Magnet className="w-3.5 h-3.5" />
                  <span>MAGNET: {Math.ceil(magnetTimer)}s</span>
                </div>
              )}

              {hasShield && (
                <div className="bg-blue-600/90 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-blue-300 animate-pulse">
                  <Shield className="w-3.5 h-3.5" />
                  <span>SHIELD ACTIVE</span>
                </div>
              )}

              {speedBoostTimer > 0 && (
                <div className="bg-cyan-500/90 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-cyan-200 animate-pulse">
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>SPEED BOOST: {Math.ceil(speedBoostTimer)}s</span>
                </div>
              )}

              {multiplierTimer > 0 && (
                <div className="bg-amber-500/90 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-yellow-200 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2X MULTIPLIER: {Math.ceil(multiplierTimer)}s</span>
                </div>
              )}
            </div>
          </div>

          {/* Top-Right: Coins, Missions Button, Sound & Pause */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Coins Badge */}
            <div className="bg-slate-900/90 border border-yellow-500/40 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-xl shadow-black/50">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 border border-yellow-200 flex items-center justify-center shadow-inner">
                <span className="text-xs font-black text-slate-950">₹</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-yellow-400 tabular-nums">
                {coins}
              </span>
            </div>

            {/* Missions & Rewards Button */}
            <button
              onClick={() => setIsMissionsOpen(true)}
              aria-label="Missions & Rewards"
              className="h-11 px-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Missions</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              aria-label="Toggle Sound"
              className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-transform active:scale-95 shadow-lg cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
            </button>

            {/* Pause Button */}
            <button
              onClick={pauseGame}
              aria-label="Pause Game"
              className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-transform active:scale-95 shadow-lg cursor-pointer"
            >
              <Pause className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mission Complete Reward Notification Toast */}
        {rewardNotification && (
          <div className="self-center mb-auto mt-4 max-w-sm w-full pointer-events-auto animate-in slide-in-from-top-6 duration-300">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 shadow-2xl border-2 border-emerald-300 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles className="w-5 h-5 text-yellow-200 fill-yellow-200" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-100">
                    {rewardNotification.title}
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    {rewardNotification.subtitle}
                  </div>
                </div>
              </div>

              <button
                onClick={dismissRewardNotification}
                className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Cinematic Zone Transition Banner */}
        {zoneBanner && (
          <div className="self-center mb-auto mt-16 max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
            <div
              className={`p-4 rounded-2xl bg-gradient-to-r ${zoneBanner.badgeColor} shadow-2xl border-2 border-white/20 text-white text-center`}
            >
              <div className="text-[10px] uppercase font-black tracking-widest text-white/80 flex items-center justify-center gap-1 mb-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Entering Zone</span>
              </div>
              <div className="text-xl md:text-2xl font-black uppercase tracking-tight drop-shadow">
                {zoneBanner.name}
              </div>
              <div className="text-xs font-semibold text-white/90 mt-0.5">
                {zoneBanner.tagline}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Missions & Rewards Modal */}
      {isMissionsOpen && <MissionsModal onClose={() => setIsMissionsOpen(false)} />}
    </>
  );
};
