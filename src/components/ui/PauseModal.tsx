import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Play, RotateCcw, Home, Volume2, VolumeX, Target } from 'lucide-react';
import { MissionsModal } from './MissionsModal';

export const PauseModal: React.FC = () => {
  const { resumeGame, restartGame, returnToMenu, isMuted, toggleMute, score, distance, coins } =
    useGameStore();
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);

  return (
    <>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-none flex items-center justify-center p-4 z-30 select-none">
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center flex flex-col items-center">
          {/* Title */}
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-1">
            Game Paused
          </h2>
          <p className="text-xs text-slate-400 mb-6">Take a breath, mass hero!</p>

          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-2 w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-3 mb-6">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
              <div className="text-lg font-black text-amber-400 tabular-nums">{score}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Distance</div>
              <div className="text-lg font-black text-white tabular-nums">
                {Math.floor(distance)}m
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Coins</div>
              <div className="text-lg font-black text-yellow-400 tabular-nums">{coins}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={resumeGame}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Resume</span>
            </button>

            {/* Missions & Rewards Button */}
            <button
              onClick={() => setIsMissionsOpen(true)}
              className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-transform active:scale-95 cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>View Missions & Costumes</span>
            </button>

            <button
              onClick={restartGame}
              className="w-full py-3 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Restart</span>
            </button>

            <div className="flex gap-2 w-full">
              <button
                onClick={returnToMenu}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-transform active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Main Menu</span>
              </button>

              <button
                onClick={toggleMute}
                className="py-3 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-transform active:scale-95 cursor-pointer"
                aria-label="Toggle Sound"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMissionsOpen && <MissionsModal onClose={() => setIsMissionsOpen(false)} />}
    </>
  );
};
