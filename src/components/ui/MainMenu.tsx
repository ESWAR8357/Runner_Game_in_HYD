import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import {
  Play,
  Trophy,
  Coins as CoinsIcon,
  Sliders,
  Target,
  ShoppingBag,
  Shirt,
  Flame,
  Volume2,
  VolumeX,
  ArrowLeftRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { MissionsModal } from './MissionsModal';
import { SettingsModal } from './SettingsModal';
import { ShopModal } from './ShopModal';
import { soundManager } from '../../audio/soundManager';

export const MainMenu: React.FC = () => {
  const { highScore, totalCoins, isMuted, startGame, toggleMute } = useGameStore();

  const [activeModal, setActiveModal] = useState<'missions' | 'settings' | 'shop' | 'wardrobe' | null>(
    null
  );

  const handleStart = () => {
    soundManager.playPowerup();
    startGame();
  };

  return (
    <>
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none z-10 pointer-events-none">
        {/* Top Bar with Safe-Area spacing */}
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Best Score Badge */}
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl px-4 py-2 shadow-2xl shadow-black/80">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-amber-400/80">
                Best Score
              </div>
              <div className="text-base sm:text-lg font-black text-white tabular-nums tracking-tight">
                {highScore.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Top-Right: Total Coins & Audio Quick Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-yellow-500/40 rounded-2xl px-4 py-2 shadow-2xl shadow-black/80">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 border border-yellow-200 flex items-center justify-center shadow-inner">
                <span className="text-xs font-black text-slate-950">₹</span>
              </div>
              <div>
                <div className="text-[10px] uppercase font-black tracking-widest text-yellow-400/80">
                  Total Coins
                </div>
                <div className="text-base sm:text-lg font-black text-yellow-300 tabular-nums">
                  {totalCoins.toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={toggleMute}
              aria-label="Toggle Sound"
              className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-transform active:scale-95 shadow-xl cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Center Title & Cinematic Tagline */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto my-auto pointer-events-none drop-shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-950/80 via-amber-950/80 to-red-950/80 border-2 border-amber-500/50 px-4 py-1.5 rounded-full mb-3 text-amber-300 text-xs font-black tracking-widest uppercase shadow-xl backdrop-blur-none">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Mass Action Endless 3D Runner</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_6px_24px_rgba(245,158,11,0.6)] uppercase font-serif">
            Balakrishna
          </h1>
          <div className="text-2xl sm:text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-red-600 uppercase drop-shadow-[0_4px_16px_rgba(239,68,68,0.8)] -mt-2 sm:-mt-3">
            Hyderabad Rush
          </div>

          <div className="mt-3 text-xs sm:text-sm font-semibold text-slate-300 bg-slate-950/60 px-4 py-1.5 rounded-full border border-slate-800/80">
            Rotate the 3D hero below & dash across the iconic streets of Hyderabad
          </div>
        </div>

        {/* Bottom Dock: Action Navigation & Big Play Button */}
        <div className="flex flex-col items-center gap-3.5 max-w-xl w-full mx-auto pointer-events-auto">
          {/* Navigation Bar (Character, Missions, Shop, Settings) */}
          <div className="grid grid-cols-4 gap-2 w-full">
            <button
              onClick={() => setActiveModal('wardrobe')}
              className="py-3 px-2 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-850 hover:to-slate-900 border border-slate-700/80 hover:border-amber-400/80 text-white flex flex-col items-center justify-center gap-1 shadow-xl transition-all active:scale-95 cursor-pointer group"
            >
              <Shirt className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-tight">Costumes</span>
            </button>

            <button
              onClick={() => setActiveModal('missions')}
              className="py-3 px-2 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-850 hover:to-slate-900 border border-slate-700/80 hover:border-amber-400/80 text-white flex flex-col items-center justify-center gap-1 shadow-xl transition-all active:scale-95 cursor-pointer group"
            >
              <Target className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-tight">Missions</span>
            </button>

            <button
              onClick={() => setActiveModal('shop')}
              className="py-3 px-2 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-850 hover:to-slate-900 border border-slate-700/80 hover:border-amber-400/80 text-white flex flex-col items-center justify-center gap-1 shadow-xl transition-all active:scale-95 cursor-pointer group"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-tight">Shop</span>
            </button>

            <button
              onClick={() => setActiveModal('settings')}
              className="py-3 px-2 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-850 hover:to-slate-900 border border-slate-700/80 hover:border-amber-400/80 text-white flex flex-col items-center justify-center gap-1 shadow-xl transition-all active:scale-95 cursor-pointer group"
            >
              <Sliders className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-tight">Settings</span>
            </button>
          </div>

          {/* Big Cinematic Gold & Crimson Play Button */}
          <button
            onClick={handleStart}
            className="group relative w-full py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-red-700 via-amber-600 to-yellow-500 hover:from-red-600 hover:via-amber-500 hover:to-yellow-400 text-white font-black text-xl sm:text-2xl uppercase tracking-wider shadow-[0_8px_30px_rgba(245,158,11,0.45)] border-2 border-yellow-300/60 flex items-center justify-center gap-3.5 transition-all transform active:scale-98 cursor-pointer hover:shadow-[0_8px_40px_rgba(245,158,11,0.7)]"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white group-hover:scale-115 transition-transform" />
            <span className="drop-shadow-md">PLAY (JAI BALAYYA!)</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {(activeModal === 'missions' || activeModal === 'wardrobe') && (
        <MissionsModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'settings' && <SettingsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'shop' && <ShopModal onClose={() => setActiveModal(null)} />}
    </>
  );
};
