import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ShoppingBag, Coins, X, Shield, Magnet, Zap, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShopModalProps {
  onClose: () => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  category: 'POWERUP' | 'PERK';
  badge: string;
}

export const ShopModal: React.FC<ShopModalProps> = ({ onClose }) => {
  const { totalCoins, purchaseShopItem } = useGameStore();
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const shopItems: ShopItem[] = [
    {
      id: 'magnet_upgrade',
      name: 'Super Magnetizer',
      description: 'Extends Coin Magnet attraction duration by +3 seconds.',
      cost: 200,
      icon: <Magnet className="w-5 h-5 text-red-400" />,
      category: 'POWERUP',
      badge: 'POPULAR',
    },
    {
      id: 'shield_fortification',
      name: 'Aegis Armor Core',
      description: 'Enhances Hero Shield resilience with instant energy recharge.',
      cost: 350,
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      category: 'POWERUP',
      badge: 'HEROIC',
    },
    {
      id: 'speed_overdrive',
      name: 'Turbo Speed Overdrive',
      description: 'Extends Speed Boost duration by +2s and increases acceleration.',
      cost: 250,
      icon: <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" />,
      category: 'POWERUP',
      badge: 'TURBO',
    },
    {
      id: 'multiplier_extension',
      name: 'Royal Gold 2X Multiplier',
      description: 'Extends 2X Score Multiplier duration to 20 seconds.',
      cost: 300,
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      category: 'POWERUP',
      badge: 'HIGH VALUE',
    },
  ];

  const handleBuy = (item: ShopItem) => {
    setErrorMsg(null);
    if (totalCoins < item.cost) {
      setErrorMsg(`Not enough coins! You need ${item.cost - totalCoins} more coins.`);
      return;
    }

    const success = purchaseShopItem(item.name, item.cost);
    if (success) {
      setPurchasedIds((prev) => [...prev, item.id]);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-none flex items-center justify-center p-4 z-40 select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl max-w-lg w-full shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                Nizam Bazaar Power Shop
              </h2>
              <div className="text-[11px] text-slate-400">Upgrade Power-ups with in-game coins</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-yellow-500/40 px-3 py-1.5 rounded-xl shadow-inner">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-black text-yellow-300 tabular-nums">{totalCoins}</span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error notification if not enough coins */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Shop Items List */}
        <div className="p-5 space-y-3.5 overflow-y-auto max-h-[70vh]">
          {shopItems.map((item) => {
            const isOwned = purchasedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm text-white">{item.name}</h3>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1 text-xs font-black text-yellow-400">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{item.cost}</span>
                  </div>

                  {isOwned ? (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95 cursor-pointer"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
