import React, { useState, useEffect } from 'react';
import { BRANDING } from '../config/branding';
import { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Search, Upload, Crown, Check, Globe, Sparkles, 
  Coins, LogIn, UserCheck 
} from 'lucide-react';
import { isUserPremium, getWallet } from '../services/db';
import { getCurrentSession } from '../services/supabaseAuth';
import { LANGUAGE_OPTIONS } from '../services/i18n';

interface NavbarProps {
  user: UserProfile;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenPremium: () => void;
  onOpenSearch: () => void;
  onOpenCoinStore: () => void;
  onOpenAuth: () => void;
  currentLanguage: string;
  onChangeLanguage: (lang: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onNavigate,
  onOpenUpload,
  onOpenPremium,
  onOpenSearch,
  onOpenCoinStore,
  onOpenAuth,
  currentLanguage,
  onChangeLanguage,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [wallet, setWallet] = useState(() => getWallet());
  const [session, setSession] = useState(() => getCurrentSession());
  const isPremium = isUserPremium();

  useEffect(() => {
    const handleWalletUpdate = () => setWallet(getWallet());
    const handleAuthUpdate = (e: any) => setSession(e.detail || getCurrentSession());

    window.addEventListener('wallvy_wallet_updated', handleWalletUpdate);
    window.addEventListener('wallvy_auth_state_changed', handleAuthUpdate);

    return () => {
      window.removeEventListener('wallvy_wallet_updated', handleWalletUpdate);
      window.removeEventListener('wallvy_auth_state_changed', handleAuthUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#060714]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <img 
              src={BRANDING.logoUrl} 
              alt={BRANDING.name}
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" 
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 drop-shadow-sm font-sans">
                {BRANDING.name}
              </span>
              {isPremium && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5 fill-current" />
                  PRO
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight hidden sm:inline -mt-0.5">
              {BRANDING.tagline}
            </span>
          </div>
        </div>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex-1 max-w-md hidden md:flex items-center justify-between gap-3 px-4 py-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-slate-400 text-xs transition duration-200"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="truncate">Search wallpapers, videos, ringtones, themes...</span>
          </div>
          <kbd className="hidden lg:inline px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Search Icon */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Coin Wallet Balance Pill */}
          <button
            onClick={onOpenCoinStore}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 transition active:scale-95 shadow-sm"
            title="Open Coin Wallet"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-mono font-black text-xs">{wallet.balance.toLocaleString()}</span>
            <span className="hidden sm:inline text-[10px] font-bold text-amber-400/80">Coins</span>
          </button>

          {/* PWA In-App Install Button */}
          <PWAInstallButton />

          {/* Upgrade to PRO CTA (if not premium) */}
          {!isPremium && (
            <button
              onClick={onOpenPremium}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Get PRO</span>
            </button>
          )}

          {/* Creator Studio & Upload Action for Creator Users */}
          {user.role === 'creator' ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigate('creator-studio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  activeTab === 'creator-studio'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                    : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Creator Studio</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition active:scale-95 shadow-md shadow-cyan-500/20"
                title="Upload Content"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 transition"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0d0f26] border border-white/10 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                <div className="space-y-1 mt-1">
                  {LANGUAGE_OPTIONS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onChangeLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition ${
                        currentLanguage === l.code
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{l.native}</span>
                      {currentLanguage === l.code && <Check className="w-3 h-3 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Auth Action or User Profile Avatar */}
          {session ? (
            <button
              onClick={() => onNavigate('profile')}
              className="w-9 h-9 rounded-xl overflow-hidden border border-cyan-500/40 hover:border-cyan-400 transition hover:scale-105 active:scale-95 shadow-sm"
              title={`${session.user.full_name} (${session.user.email})`}
            >
              <img src={user.avatar_url || '/logo.png'} alt={user.display_name} className="w-full h-full object-cover" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
