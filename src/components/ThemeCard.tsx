import React, { useState } from 'react';
import { ThemePack } from '../types';
import { Sparkles, Download, Check, Star, Crown, Layers, Zap } from 'lucide-react';
import { 
  setActiveWallpaper, setActiveEdgePreset, setActiveAODStyle, 
  downloadContent, isUserPremium 
} from '../services/db';

interface ThemeCardProps {
  theme: ThemePack;
  onRequirePremium?: () => void;
  onPreview?: (theme: ThemePack) => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  onRequirePremium,
  onPreview,
}) => {
  const [applied, setApplied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (theme.is_premium && !isUserPremium()) {
      if (onRequirePremium) onRequirePremium();
      return;
    }
    setActiveWallpaper(theme.wallpaper);
    setActiveEdgePreset(theme.edge_preset);
    setActiveAODStyle(theme.aod_style);

    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (theme.is_premium && !isUserPremium()) {
      if (onRequirePremium) onRequirePremium();
      return;
    }
    setDownloading(true);
    await downloadContent('theme', theme);
    setTimeout(() => setDownloading(false), 1500);
  };

  return (
    <div
      onClick={() => onPreview && onPreview(theme)}
      className="group relative rounded-3xl overflow-hidden bg-[#0c0e24] border border-white/[0.08] hover:border-cyan-500/40 p-4 transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer"
    >
      {/* Top Banner Image with bundled elements preview */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#060714] mb-3">
        <img
          src={theme.thumbnail_url}
          alt={theme.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient edge overlay simulating theme's edge preset */}
        <div
          className="absolute inset-0 border-2 rounded-2xl pointer-events-none"
          style={{
            borderColor: theme.accent_color,
            boxShadow: `inset 0 0 20px ${theme.accent_color}55`,
          }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {theme.is_premium ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 shadow-md">
              <Crown className="w-2.5 h-2.5 fill-current" />
              PRO SUITE
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/80 backdrop-blur-md text-slate-950">
              FREE PACK
            </span>
          )}
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-semibold text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            {theme.edge_preset.name}
          </span>
          <span className="flex items-center gap-1 text-amber-300">
            <Star className="w-3 h-3 fill-current" />
            {theme.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Meta Content */}
      <div className="space-y-1.5 mb-4">
        <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
          {theme.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2">
          {theme.description}
        </p>
      </div>

      {/* Included items chips */}
      <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-medium text-slate-300 text-center mb-4">
        <div>
          <span className="text-cyan-400 block font-bold">4K Wall</span>
          <span className="truncate">{theme.wallpaper.category}</span>
        </div>
        <div className="border-x border-white/10">
          <span className="text-purple-400 block font-bold">AOD</span>
          <span className="truncate">{theme.aod_style.clock_type}</span>
        </div>
        <div>
          <span className="text-pink-400 block font-bold">Ringtone</span>
          <span className="truncate">{theme.ringtone.category}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleApply}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition active:scale-95 ${
            applied
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20 hover:opacity-95'
          }`}
        >
          {applied ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          <span>{applied ? 'Suite Applied!' : 'Apply Full Suite'}</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
          title="Download Pack Assets"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
