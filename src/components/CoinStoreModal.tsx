import React, { useState } from 'react';
import { 
  X, Coins, Sparkles, Check, ArrowUpRight, 
  ArrowDownLeft, History, Crown, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getWallet, addCoins, getTransactions, 
  getPurchases, isUserPremium 
} from '../services/db';
import { SEED_COIN_PACKAGES } from '../data/seedData';
import { CoinPackage } from '../types';

interface CoinStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPremium?: () => void;
}

export const CoinStoreModal: React.FC<CoinStoreModalProps> = ({
  isOpen,
  onClose,
  onOpenPremium
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'history' | 'unlocked'>('packages');
  const [wallet, setWallet] = useState(() => getWallet());
  const [purchasedPkgId, setPurchasedPkgId] = useState<string | null>(null);

  if (!isOpen) return null;

  const transactions = getTransactions();
  const purchases = getPurchases();
  const isPremium = isUserPremium();

  const handleBuyPackage = (pkg: CoinPackage) => {
    const updated = addCoins(pkg.coins, `Purchased ${pkg.coins} Coins Package`, 'coin_package', pkg.id);
    setWallet(updated);
    setPurchasedPkgId(pkg.id);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 }
    });

    setTimeout(() => {
      setPurchasedPkgId(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c0e24] border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
              <Coins className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">WALLVY Coin Store</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  WALLET
                </span>
              </div>
              <p className="text-xs text-slate-400">Unlock premium 4K wallpapers, video wallpapers & ringtones</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Card */}
        <div className="p-6 bg-gradient-to-b from-[#101332] to-[#0c0e24] border-b border-white/5">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your Balance</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Coins className="w-6 h-6 text-amber-400 fill-amber-400" />
                <span className="text-2xl font-black text-white font-mono tracking-tight">
                  {wallet.balance.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-amber-400">Coins</span>
              </div>
            </div>

            {isPremium ? (
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Unlimited Pass</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenPremium?.();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition flex items-center gap-1.5 shadow-md shadow-amber-500/25"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Go PRO (All Free)</span>
              </button>
            )}
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'packages'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              Coin Packs
            </button>
            <button
              onClick={() => setActiveTab('unlocked')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'unlocked'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              Unlocked ({purchases.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'history'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-96 space-y-3">
          
          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SEED_COIN_PACKAGES.map((pkg) => {
                const isJustBought = purchasedPkgId === pkg.id;

                return (
                  <div
                    key={pkg.id}
                    className={`relative p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      pkg.popular
                        ? 'bg-gradient-to-b from-amber-500/15 to-transparent border-amber-500/40 shadow-lg shadow-amber-500/10'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md">
                        Best Value
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="text-xl font-black text-white font-mono">{pkg.coins}</span>
                        <span className="text-xs text-slate-400">Coins</span>
                      </div>

                      {pkg.bonus && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          {pkg.bonus}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-white">{pkg.price}</span>
                      <button
                        onClick={() => handleBuyPackage(pkg)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1.5 ${
                          isJustBought
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20'
                        }`}
                      >
                        {isJustBought ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>Get Pack</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'unlocked' && (
            <div className="space-y-2">
              {purchases.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs font-semibold">No unlocked content yet.</p>
                  <p className="text-[11px] text-slate-600">Items unlocked with coins will appear here for lifetime access.</p>
                </div>
              ) : (
                purchases.map((pch) => (
                  <div
                    key={pch.id}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={pch.thumbnail_url || '/logo.png'} 
                        alt={pch.item_title} 
                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{pch.item_title}</h4>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{pch.item_type}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {pch.coins_spent === 0 ? 'Free' : `-${pch.coins_spent} Coins`}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No transaction history yet.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        tx.type === 'credit'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-[11px] line-clamp-1">{tx.description}</p>
                        <span className="text-[10px] text-slate-500">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold ${
                        tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {tx.type === 'credit' ? `+${tx.amount}` : `-${tx.amount}`}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
