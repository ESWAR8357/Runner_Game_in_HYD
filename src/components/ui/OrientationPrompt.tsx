import React, { useState, useEffect } from 'react';
import { Smartphone, X } from 'lucide-react';

export const OrientationPrompt: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 800;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait || dismissed) return null;

  return (
    <div className="absolute top-3 inset-x-4 max-w-sm mx-auto z-40 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900/95 border border-amber-500/50 rounded-2xl p-2.5 px-3.5 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5 text-amber-300">
          <Smartphone className="w-5 h-5 rotate-90 shrink-0 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">
            Rotate device to <span className="text-amber-400 font-black">Landscape</span> for wider city view!
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss orientation tip"
          className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
