import React, { useState } from 'react';
import { Wallpaper, EdgePreset } from '../types';
import { PhoneMockup } from './PhoneMockup';
import { 
  X, Download, Heart, Share2, FolderPlus, Sparkles, 
  Crown, Check, AlertCircle, Layers, Sliders, ExternalLink 
} from 'lucide-react';
import { 
  isFavorite, toggleFavorite, downloadContent, 
  setActiveWallpaper, isUserPremium, getActiveEdgePreset 
} from '../services/db';

interface WallpaperModalProps {
  wallpaper: Wallpaper;
  onClose: () => void;
  onOpenCollection: (wp: Wallpaper) => void;
  onRequirePremium: () => void;
  onSelectRelated: (wp: Wallpaper) => void;
  allWallpapers: Wallpaper[];
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  wallpaper,
  onClose,
  onOpenCollection,
  onRequirePremium,
  onSelectRelated,
  allWallpapers,
}) => {
  const [favorite, setFavorite] = useState(() => isFavorite('wallpaper', wallpaper.id));
  const [applied, setApplied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showEdgeLighting, setShowEdgeLighting] = useState(true);
  const activeEdge = getActiveEdgePreset();

  const handleFavorite = () => {
    const updated = toggleFavorite('wallpaper', wallpaper.id);
    setFavorite(updated);
  };

  const handleDownload = async () => {
    if (wallpaper.is_premium && !isUserPremium()) {
      onRequirePremium();
      return;
    }
    setDownloading(true);
    await downloadContent('wallpaper', wallpaper);
    setTimeout(() => setDownloading(false), 1200);
  };

  const handleApplySimulator = () => {
    setActiveWallpaper(wallpaper);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: wallpaper.title,
        text: `Check out ${wallpaper.title} on WALLVY!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const related = allWallpapers
    .filter(w => w.id !== wallpaper.id && (w.category === wallpaper.category || w.tags.some(t => wallpaper.tags.includes(t))))
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#090b1e] border border-cyan-500/30 shadow-[0_0_80px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-white/10 bg-[#0c0e26]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Wallpaper Details
            </span>
            {wallpaper.is_premium && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-black">
                <Crown className="w-3 h-3 fill-current" />
                PREMIUM
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Simulated Phone Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs text-slate-400 font-medium">Device Simulator</span>
              <button
                onClick={() => setShowEdgeLighting(!showEdgeLighting)}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition ${
                  showEdgeLighting 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <Sliders className="w-3 h-3" />
                Edge Lighting: {showEdgeLighting ? 'ON' : 'OFF'}
              </button>
            </div>

            <PhoneMockup
              wallpaper={wallpaper}
              edgePreset={showEdgeLighting ? activeEdge : undefined}
            />

            <p className="text-[11px] text-slate-500 text-center mt-3">
              Simulated 4K Mobile Lockscreen View
            </p>
          </div>

          {/* Right Column: Metadata, Specs, Controls, and Related */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{wallpaper.title}</h2>
              <p className="text-sm text-slate-400 mt-1">{wallpaper.description}</p>
            </div>

            {/* Creator & Category Card */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                  {wallpaper.creator_name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{wallpaper.creator_name}</div>
                  <div className="text-xs text-cyan-400">{wallpaper.category} Artist</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Total Downloads</div>
                <div className="text-sm font-extrabold text-white">
                  {(wallpaper.download_count || 1200).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Resolution</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">{wallpaper.resolution}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Size</div>
                <div className="text-xs font-bold text-purple-300 mt-0.5">{wallpaper.file_size || '4.5 MB'}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Format</div>
                <div className="text-xs font-bold text-pink-300 mt-0.5">JPEG (High-Q)</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Aspect</div>
                <div className="text-xs font-bold text-emerald-300 mt-0.5">9:16 Portrait</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {wallpaper.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 p-3.5 font-bold text-white shadow-lg shadow-cyan-500/25 hover:opacity-95 transition active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>{downloading ? 'Downloading Ultra HD...' : 'Download 4K Wallpaper'}</span>
              </button>

              <button
                onClick={handleApplySimulator}
                className="flex items-center justify-center gap-2 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 px-5 py-3.5 font-bold text-purple-200 transition active:scale-[0.98]"
              >
                {applied ? <Check className="w-5 h-5 text-emerald-400" /> : <Sparkles className="w-5 h-5 text-purple-400" />}
                <span>{applied ? 'Set in Simulator!' : 'Set in App'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleFavorite}
                  className={`p-3.5 rounded-2xl border transition active:scale-95 ${
                    favorite
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Favorite"
                >
                  <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => onOpenCollection(wallpaper)}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition active:scale-95"
                  title="Add to Collection"
                >
                  <FolderPlus className="w-5 h-5" />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition active:scale-95"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Web Limitation Notice */}
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200/90 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Installation Note:</strong> Download saves the full-resolution 4K file directly to your photos. On Android/iOS, open the downloaded image and tap <em>"Use as Wallpaper"</em>.
              </span>
            </div>

            {/* Related Wallpapers */}
            {related.length > 0 && (
              <div className="pt-2">
                <h4 className="text-sm font-bold text-white mb-3">Related Wallpapers</h4>
                <div className="grid grid-cols-4 gap-2.5">
                  {related.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="cursor-pointer group relative aspect-[9/16] rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400 transition"
                    >
                      <img src={rel.thumbnail_url} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white px-1 text-center truncate">{rel.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
