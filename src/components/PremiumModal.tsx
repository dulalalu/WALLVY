import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Zap, Shield, Flame } from 'lucide-react';
import { isUserPremium, setPremiumStatus } from '../services/db';

interface PremiumModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onSuccess }) => {
  const [currentIsPremium, setCurrentIsPremium] = useState(() => isUserPremium());
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleToggleUpgrade = () => {
    const nextState = !currentIsPremium;
    setPremiumStatus(nextState);
    setCurrentIsPremium(nextState);
    if (nextState && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090b22] border border-amber-500/40 p-6 sm:p-8 shadow-[0_0_100px_rgba(245,158,11,0.2)] overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/20 to-purple-600/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-md mx-auto space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30">
            <Crown className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            WALLVY <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">PRO PASS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Unlock master 4K UHD galleries, exclusive animated Edge Lighting presets, and high-speed AI Wallpaper generation.
          </p>
        </div>

        {/* Billing cycle pill */}
        <div className="flex justify-center mt-5">
          <div className="p-1 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-4 py-2 rounded-xl transition ${
                selectedPlan === 'monthly' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly ($2.99/mo)
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                selectedPlan === 'yearly'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual ($19.99/yr)</span>
              <span className="text-[10px] bg-black/40 text-amber-200 px-1.5 py-0.5 rounded-full font-bold">SAVE 45%</span>
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { title: 'Ultra 4K & OLED Wallpapers', desc: 'Direct downloads at uncompressed native resolutions' },
            { title: 'Exclusive Edge Presets', desc: 'Access Inferno Fire, Aurora, and Lightning Arc effects' },
            { title: 'Unlimited AI Studio Creation', desc: 'High-speed Gemini AI creation without queue' },
            { title: 'Commercial Creator License', desc: 'Use wallpapers and sounds in your videos & streams' },
            { title: 'No Watermarks & Zero Ads', desc: 'Completely distraction-free personalization experience' },
            { title: 'Cloud Sync & Multi-Device', desc: 'Sync your collections and presets across phone and PC' },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/5">
              <div className="p-1 rounded-full bg-amber-400/20 text-amber-400 flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-white block">{f.title}</strong>
                <span className="text-slate-400 text-[11px]">{f.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col items-center">
          <button
            onClick={handleToggleUpgrade}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${
              currentIsPremium
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 shadow-amber-500/30 hover:opacity-95'
            }`}
          >
            <Crown className="w-5 h-5 fill-current" />
            <span>{currentIsPremium ? 'Cancel PRO Subscription (Downgrade to Free)' : 'Activate WALLVY PRO Now (Instant Demo Unlock)'}</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            {currentIsPremium ? 'You currently have PRO active on this device.' : 'Instant demo activation unlocked. No credit card required in sandbox preview.'}
          </p>
        </div>
      </div>
    </div>
  );
};
