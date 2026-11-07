import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

export const TouchControls: React.FC = () => {
  const { gameState, controlSensitivity, moveLeft, moveRight, jump, slide } = useGameStore();

  const triggerHaptic = useCallback(() => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(12);
      }
    } catch {
      // Haptics not supported or permitted on this device
    }
  }, []);

  const handleMoveLeft = useCallback(() => {
    triggerHaptic();
    moveLeft();
  }, [triggerHaptic, moveLeft]);

  const handleMoveRight = useCallback(() => {
    triggerHaptic();
    moveRight();
  }, [triggerHaptic, moveRight]);

  const handleJump = useCallback(() => {
    triggerHaptic();
    jump();
  }, [triggerHaptic, jump]);

  const handleSlide = useCallback(() => {
    triggerHaptic();
    slide();
  }, [triggerHaptic, slide]);

  // Keyboard controls with WASD, Arrow keys, Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.repeat) return; // Prevent repeated triggers from held keys

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        handleMoveLeft();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        handleMoveRight();
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        e.preventDefault();
        handleJump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        handleSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleMoveLeft, handleMoveRight, handleJump, handleSlide]);

  // Touch Swipe gestures factoring in controlSensitivity with single-trigger lock
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let hasTriggered = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        hasTriggered = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameState !== 'PLAYING' || hasTriggered || e.touches.length === 0) return;

      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      const threshold = 32 / (controlSensitivity || 1.0);

      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < -threshold) {
            handleMoveLeft();
            hasTriggered = true;
          } else if (deltaX > threshold) {
            handleMoveRight();
            hasTriggered = true;
          }
        } else {
          if (deltaY < -threshold) {
            handleJump();
            hasTriggered = true;
          } else if (deltaY > threshold) {
            handleSlide();
            hasTriggered = true;
          }
        }
      }
    };

    const handleTouchEnd = () => {
      hasTriggered = false;
    };

    const handleTouchCancel = () => {
      hasTriggered = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [gameState, controlSensitivity, handleMoveLeft, handleMoveRight, handleJump, handleSlide]);

  if (gameState !== 'PLAYING') return null;

  return (
    <div className="absolute bottom-6 inset-x-4 sm:inset-x-8 flex justify-between items-end pointer-events-none select-none z-20">
      {/* Left side: Lane Switch Pads */}
      <div className="flex gap-4 sm:gap-6 pointer-events-auto">
        <button
          onClick={handleMoveLeft}
          aria-label="Move Left"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-950/85 active:bg-amber-500/90 hover:bg-slate-900 border-2 border-amber-500/50 active:border-amber-300 text-amber-300 active:text-slate-950 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 shadow-2xl shadow-black/80 cursor-pointer"
        >
          <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="text-[10px] font-black uppercase tracking-tight">Left</span>
        </button>

        <button
          onClick={handleMoveRight}
          aria-label="Move Right"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-950/85 active:bg-amber-500/90 hover:bg-slate-900 border-2 border-amber-500/50 active:border-amber-300 text-amber-300 active:text-slate-950 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 shadow-2xl shadow-black/80 cursor-pointer"
        >
          <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="text-[10px] font-black uppercase tracking-tight">Right</span>
        </button>
      </div>

      {/* Right side: Jump & Slide Action Buttons */}
      <div className="flex gap-4 sm:gap-6 pointer-events-auto">
        <button
          onClick={handleSlide}
          aria-label="Slide"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-950/85 active:bg-sky-500/90 hover:bg-slate-900 border-2 border-sky-500/50 active:border-sky-300 text-sky-300 active:text-slate-950 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 shadow-2xl shadow-black/80 cursor-pointer"
        >
          <ArrowDown className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="text-[10px] font-black uppercase tracking-tight">Slide</span>
        </button>

        <button
          onClick={handleJump}
          aria-label="Jump"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-950/85 active:bg-emerald-500/90 hover:bg-slate-900 border-2 border-emerald-500/50 active:border-emerald-300 text-emerald-300 active:text-slate-950 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 shadow-2xl shadow-black/80 cursor-pointer"
        >
          <ArrowUp className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="text-[10px] font-black uppercase tracking-tight">Jump</span>
        </button>
      </div>
    </div>
  );
};
