import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { RotateCcw, Home, Trophy, Coins, Award, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../audio/soundManager';

export const GameOverModal: React.FC = () => {
  const { score, distance, coins, highScore, restartGame, returnToMenu } = useGameStore();
  const isNewHighScore = score > 0 && score >= highScore;

  useEffect(() => {
    if (isNewHighScore) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#f59e0b', '#ef4444', '#fbbf24', '#ffffff', '#dc2626'],
        });
      } catch {
        // ignore
      }
    }
  }, [isNewHighScore]);

  const handleRetry = () => {
    soundManager.playPowerup();
    restartGame();
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-none flex items-center justify-center p-4 z-30 select-none animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-[0_10px_50px_rgba(239,68,68,0.3)] text-center flex flex-col items-center">
        {/* Animated Action Crash Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-black tracking-widest uppercase mb-2 shadow-inner">
          <Flame className="w-4 h-4 text-red-500 fill-red-500" />
          <span>Rush Ended</span>
        </div>

        {/* Dramatic Title */}
        <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-300 to-red-500 uppercase tracking-tight mb-2 drop-shadow-[0_2px_12px_rgba(239,68,68,0.8)]">
          Game Over
        </h2>

        {isNewHighScore && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider animate-bounce shadow-lg shadow-amber-500/40">
            <Award className="w-4 h-4" />
            <span>New High Score!</span>
            <Sparkles className="w-4 h-4" />
          </div>
        )}

        {/* Score & Stats Card */}
        <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col gap-3 shadow-inner">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800/80">
            <span className="text-xs uppercase font-black text-slate-400 tracking-wider">
              Final Score
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800/80">
            <span className="text-xs uppercase font-extrabold text-slate-400">Distance</span>
            <span className="text-base font-extrabold text-white tabular-nums">
              {Math.floor(distance)} meters
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800/80">
            <span className="text-xs uppercase font-extrabold text-slate-400 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>Coins Collected</span>
            </span>
            <span className="text-base font-extrabold text-yellow-400 tabular-nums">+{coins}</span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-xs uppercase font-extrabold text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Best Score</span>
            </span>
            <span className="text-base font-extrabold text-amber-300 tabular-nums">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleRetry}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-white font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-amber-600/30 border border-amber-300/40 transition-all transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={returnToMenu}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-800 transition-transform active:scale-95 cursor-pointer shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
