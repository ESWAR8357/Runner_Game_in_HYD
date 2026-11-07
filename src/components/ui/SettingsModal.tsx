import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { X, Volume2, Music, Sliders, Maximize2, Monitor, Sparkles, Activity } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const {
    musicVolume,
    sfxVolume,
    graphicsQuality,
    controlSensitivity,
    isFullscreen,
    showFps,
    setMusicVolume,
    setSfxVolume,
    setGraphicsQuality,
    setControlSensitivity,
    toggleFullscreen,
    toggleShowFps,
  } = useGameStore();

  const handleTestSfx = () => {
    soundManager.playCoin();
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-none flex items-center justify-center p-4 z-40 select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl max-w-md w-full shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                Game Settings
              </h2>
              <div className="text-[11px] text-slate-400">Audio, Visual & Control Options</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings List */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Music Volume */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-200">
                <Music className="w-4 h-4 text-amber-400" />
                <span>Cinematic Music Volume</span>
              </div>
              <span className="text-xs font-black text-amber-400 tabular-nums">{musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* SFX Volume */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-200">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Sound Effects (SFX)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestSfx}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 uppercase cursor-pointer"
                >
                  Test
                </button>
                <span className="text-xs font-black text-emerald-400 tabular-nums">{sfxVolume}%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Graphics Quality */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-200 mb-3">
              <Monitor className="w-4 h-4 text-sky-400" />
              <span>Graphics Quality</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setGraphicsQuality(q)}
                  className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                    graphicsQuality === q
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Control Sensitivity */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-200">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Swipe / Key Sensitivity</span>
              </div>
              <span className="text-xs font-black text-purple-400 tabular-nums">
                {controlSensitivity.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={controlSensitivity}
              onChange={(e) => setControlSensitivity(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Fullscreen Toggle */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Maximize2 className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-extrabold text-white">Fullscreen Mode</div>
                <div className="text-xs text-slate-400">Expand for immersive cinematic view</div>
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                isFullscreen
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </button>
          </div>

          {/* Real-time FPS Display Toggle */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-sm font-extrabold text-white">Real-Time FPS Monitor</div>
                <div className="text-xs text-slate-400">Show performance counter in HUD</div>
              </div>
            </div>

            <button
              onClick={toggleShowFps}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                showFps
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {showFps ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
