import React, { useState } from 'react';
import { 
  Settings, Globe, Moon, Bell, Download, 
  Shield, Info, Check, Smartphone, Trash2 
} from 'lucide-react';
import { BRANDING } from '../config/branding';
import { LANGUAGE_OPTIONS } from '../services/i18n';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface SettingsViewProps {
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
  onOpenPremium: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLanguage,
  onChangeLanguage,
  onOpenPremium,
}) => {
  const [downloadQuality, setDownloadQuality] = useState<'ultra' | 'standard'>('ultra');
  const [pushNotifs, setPushNotifs] = useState(true);
  const [oledMode, setOledMode] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-cyan-400" />
          <span>App Settings & Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure multi-language interface, offline storage, display theme, and downloads.
        </p>
      </div>

      {/* 1. Language Architecture */}
      <div className="p-6 rounded-3xl bg-[#0c0e24] border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-bold text-sm">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Application Language (Multi-Language)</span>
        </div>
        <p className="text-xs text-slate-400">
          Changing language updates all labels and menus through the centralized i18n translation system.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {LANGUAGE_OPTIONS.map((l) => (
            <button
              key={l.code}
              onClick={() => onChangeLanguage(l.code)}
              className={`p-3 rounded-2xl border text-left transition ${
                currentLanguage === l.code
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs">{l.native}</span>
                {currentLanguage === l.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Download Preferences */}
      <div className="p-6 rounded-3xl bg-[#0c0e24] border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-bold text-sm">
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Download Quality & Storage</span>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Ultra HD 4K (Full Uncompressed)</span>
              <span className="text-[11px] text-slate-400">Largest file size, sharpest quality for flagship OLEDs</span>
            </div>
            <input
              type="radio"
              name="quality"
              checked={downloadQuality === 'ultra'}
              onChange={() => setDownloadQuality('ultra')}
              className="accent-cyan-400"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Data Saver (Compressed 1080p)</span>
              <span className="text-[11px] text-slate-400">Faster downloads on mobile networks</span>
            </div>
            <input
              type="radio"
              name="quality"
              checked={downloadQuality === 'standard'}
              onChange={() => setDownloadQuality('standard')}
              className="accent-cyan-400"
            />
          </label>
        </div>
      </div>

      {/* 3. PWA Installation */}
      <div className="p-6 rounded-3xl bg-[#0c0e24] border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5 text-white font-bold text-sm">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>Progressive Web App (PWA)</span>
        </div>
        <p className="text-xs text-slate-400">
          Install WALLVY directly to your home screen for full-screen edge-to-edge experience and offline caching.
        </p>

        <PWAInstallButton variant="full" />
      </div>

      {/* 4. Display & Notifications */}
      <div className="p-6 rounded-3xl bg-[#0c0e24] border border-white/10 space-y-3">
        <div className="flex items-center gap-2.5 text-white font-bold text-sm">
          <Moon className="w-4 h-4 text-purple-400" />
          <span>Display & Notifications</span>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
            <span className="text-xs text-slate-200">Pure OLED True Black Theme</span>
            <input
              type="checkbox"
              checked={oledMode}
              onChange={(e) => setOledMode(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer">
            <span className="text-xs text-slate-200">Push Notifications for Featured Drops</span>
            <input
              type="checkbox"
              checked={pushNotifs}
              onChange={(e) => setPushNotifs(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded"
            />
          </label>
        </div>
      </div>

      {/* 5. Clear Cache / Storage */}
      <div className="p-6 rounded-3xl bg-[#0c0e24] border border-white/10 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Offline Cache & Storage</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Clear local images and Service Worker temporary cache.</p>
        </div>

        <button
          onClick={handleClearCache}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          {cacheCleared ? <Check className="w-4 h-4 text-emerald-400" /> : <Trash2 className="w-4 h-4 text-rose-400" />}
          <span>{cacheCleared ? 'Cleared!' : 'Clear Cache'}</span>
        </button>
      </div>

      {/* 6. About WALLVY */}
      <div className="p-6 rounded-3xl bg-[#0c0e24] border border-white/10 text-center space-y-2">
        <img src={BRANDING.logoUrl} alt={BRANDING.name} className="w-12 h-12 mx-auto rounded-2xl" />
        <h3 className="font-black text-lg text-white">{BRANDING.name}</h3>
        <p className="text-xs text-slate-400">Version {BRANDING.version} • {BRANDING.tagline}</p>
        <div className="flex justify-center gap-4 text-xs text-cyan-400 pt-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Terms of Service</a>
          <span>•</span>
          <a href={`mailto:${BRANDING.supportEmail}`} className="hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
};
