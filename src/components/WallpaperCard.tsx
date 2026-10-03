import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { Heart, Download, Eye, Sparkles, Crown, FolderPlus, Share2 } from 'lucide-react';
import { isFavorite, toggleFavorite, downloadContent, isUserPremium } from '../services/db';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onPreview: (wp: Wallpaper) => void;
  onAddToCollection?: (wp: Wallpaper) => void;
  onShare?: (wp: Wallpaper) => void;
  onRequirePremium?: () => void;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  onPreview,
  onAddToCollection,
  onShare,
  onRequirePremium,
}) => {
  const [favorite, setFavorite] = useState(() => isFavorite('wallpaper', wallpaper.id));
  const [downloading, setDownloading] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavorite('wallpaper', wallpaper.id);
    setFavorite(updated);
  };

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wallpaper.is_premium && !isUserPremium()) {
      if (onRequirePremium) onRequirePremium();
      return;
    }
    setDownloading(true);
    await downloadContent('wallpaper', wallpaper);
    setTimeout(() => setDownloading(false), 1200);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: wallpaper.title,
        text: `Check out this 4K wallpaper "${wallpaper.title}" on WALLVY!`,
        url: window.location.href,
      }).catch(() => {});
    } else if (onShare) {
      onShare(wallpaper);
    }
  };

  return (
    <div
      onClick={() => onPreview(wallpaper)}
      className="group relative rounded-2xl overflow-hidden bg-[#0c0e22] border border-white/[0.08] shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Media Aspect Ratio Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#060714]">
        <img
          src={wallpaper.thumbnail_url}
          alt={wallpaper.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges on Top */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            {wallpaper.is_premium ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md">
                <Crown className="w-2.5 h-2.5 fill-current" />
                PRO
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                4K
              </span>
            )}
            {wallpaper.is_live && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500 text-slate-950 shadow-md">
                LIVE
              </span>
            )}
            {wallpaper.is_ai_generated && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/80 backdrop-blur-md text-purple-200 border border-purple-500/40">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </span>
            )}
          </div>

          <button
            onClick={handleFavoriteClick}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
              favorite
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                : 'bg-black/50 text-white/80 hover:bg-black/70 hover:text-rose-400'
            }`}
            title="Favorite"
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover / Touch Quick Action Bar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-10">
          <div className="flex items-center justify-between gap-1.5">
            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? 'Saving...' : 'Download'}
            </button>

            {onAddToCollection && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection(wallpaper);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                title="Add to Collection"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleShareClick}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Meta Footer */}
      <div className="p-3 bg-[#0d1028] flex flex-col">
        <h3 className="font-semibold text-sm text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
          {wallpaper.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span className="truncate">{wallpaper.creator_name}</span>
          <span className="text-slate-500">{wallpaper.category}</span>
        </div>
      </div>
    </div>
  );
};
