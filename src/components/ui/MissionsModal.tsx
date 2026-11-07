import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Target, Shirt, CheckCircle2, Lock, Gift, Coins, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MissionsModalProps {
  onClose: () => void;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'missions' | 'costumes'>('missions');
  const {
    missions,
    costumes,
    equippedCostumeId,
    totalCoins,
    claimMission,
    equipCostume,
  } = useGameStore();

  const handleClaim = (missionId: string) => {
    claimMission(missionId);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-none flex items-center justify-center p-4 z-40 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              {activeTab === 'missions' ? <Target className="w-5 h-5" /> : <Shirt className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {activeTab === 'missions' ? 'Hero Missions & Rewards' : 'Action Hero Wardrobe'}
              </h2>
              <div className="text-xs text-slate-400">Total Coins: <span className="text-yellow-400 font-bold">{totalCoins}</span></div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1.5 mx-5 mt-4 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'missions'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Missions</span>
          </button>

          <button
            onClick={() => setActiveTab('costumes')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'costumes'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Costumes</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3.5">
          {/* TAB 1: MISSIONS */}
          {activeTab === 'missions' && (
            <div className="space-y-3">
              {missions.map((m) => {
                const percent = Math.min(100, Math.round((m.current / m.target) * 100));

                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      m.claimed
                        ? 'bg-slate-950/50 border-slate-800/60 opacity-60'
                        : m.completed
                        ? 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/50 shadow-lg'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-sm">{m.title}</h3>
                          {m.claimed && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold uppercase">
                              Claimed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
                      </div>

                      {/* Reward Badge */}
                      <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-1 text-xs font-black text-yellow-400">
                          <Coins className="w-3.5 h-3.5" />
                          <span>+{m.rewardCoins}</span>
                        </div>
                        {m.rewardName && (
                          <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>{m.rewardName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold tabular-nums">
                        {m.current} / {m.target} ({percent}%)
                      </span>

                      {/* Action Button */}
                      {m.completed && !m.claimed ? (
                        <button
                          onClick={() => handleClaim(m.id)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md transition-transform active:scale-95 cursor-pointer animate-pulse"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Claim Reward</span>
                        </button>
                      ) : m.claimed ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-semibold">In Progress</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: COSTUMES */}
          {activeTab === 'costumes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {costumes.map((costume) => {
                const isEquipped = costume.id === equippedCostumeId;

                return (
                  <div
                    key={costume.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                      isEquipped
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10'
                        : costume.unlocked
                        ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div>
                      {/* Costume Preview Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-amber-400">
                          {costume.badge}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                            style={{ backgroundColor: costume.shirtColor }}
                            title="Shirt Color"
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                            style={{ backgroundColor: costume.trousersColor }}
                            title="Trousers Color"
                          />
                        </div>
                      </div>

                      <h3 className="font-black text-white text-sm">{costume.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {costume.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      {isEquipped ? (
                        <button
                          disabled
                          className="w-full py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          <span>EQUIPPED</span>
                        </button>
                      ) : costume.unlocked ? (
                        <button
                          onClick={() => equipCostume(costume.id)}
                          className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md"
                        >
                          <span>EQUIP</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-400 bg-slate-900 rounded-xl border border-slate-800">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Complete Mission to Unlock</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
