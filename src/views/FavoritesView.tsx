import React, { useState } from 'react';
import { Wallpaper, Ringtone, ThemePack } from '../types';
import { WallpaperCard } from '../components/WallpaperCard';
import { RingtoneCard } from '../components/RingtoneCard';
import { ThemeCard } from '../components/ThemeCard';
import { Heart, Compass, Image as ImageIcon, Music, Layers } from 'lucide-react';
import { getFavorites } from '../services/db';

interface FavoritesViewProps {
  wallpapers: Wallpaper[];
  ringtones: Ringtone[];
  themes: ThemePack[];
  onPreviewWallpaper: (wp: Wallpaper) => void;
  onPreviewTheme: (tp: ThemePack) => void;
  onNavigate: (tab: string) => void;
  onRequirePremium: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  wallpapers,
  ringtones,
  themes,
  onPreviewWallpaper,
  onPreviewTheme,
  onNavigate,
  onRequirePremium,
}) => {
  const [activeTab, setActiveTab] = useState<'wallpapers' | 'ringtones' | 'themes'>('wallpapers');
  const favs = getFavorites();

  const favoriteWallpapers = wallpapers.filter(w => favs.wallpapers.includes(w.id));
  const favoriteRingtones = ringtones.filter(r => favs.ringtones.includes(r.id));
  const favoriteThemes = themes.filter(t => favs.themes.includes(t.id));

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20" />
          <span>My Favorites</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Your bookmarked wallpapers, ringtones, and full theme packs in one place.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'wallpapers', label: 'Wallpapers', count: favoriteWallpapers.length, icon: ImageIcon },
          { id: 'ringtones', label: 'Ringtones', count: favoriteRingtones.length, icon: Music },
          { id: 'themes', label: 'Themes', count: favoriteThemes.length, icon: Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === tab.id
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-70 font-mono">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Content Rendering */}
      {activeTab === 'wallpapers' && (
        favoriteWallpapers.length === 0 ? (
          <EmptyFavoritesState onExplore={() => onNavigate('wallpapers')} label="wallpapers" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {favoriteWallpapers.map((wp) => (
              <WallpaperCard
                key={wp.id}
                wallpaper={wp}
                onPreview={onPreviewWallpaper}
                onRequirePremium={onRequirePremium}
              />
            ))}
          </div>
        )
      )}

      {activeTab === 'ringtones' && (
        favoriteRingtones.length === 0 ? (
          <EmptyFavoritesState onExplore={() => onNavigate('ringtones')} label="ringtones" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteRingtones.map((rt) => (
              <RingtoneCard
                key={rt.id}
                ringtone={rt}
                onRequirePremium={onRequirePremium}
              />
            ))}
          </div>
        )
      )}

      {activeTab === 'themes' && (
        favoriteThemes.length === 0 ? (
          <EmptyFavoritesState onExplore={() => onNavigate('themes')} label="themes" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {favoriteThemes.map((tp) => (
              <ThemeCard
                key={tp.id}
                theme={tp}
                onPreview={onPreviewTheme}
                onRequirePremium={onRequirePremium}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

const EmptyFavoritesState: React.FC<{ onExplore: () => void; label: string }> = ({ onExplore, label }) => (
  <div className="py-16 text-center space-y-3 bg-white/[0.02] rounded-3xl border border-white/5">
    <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
      <Heart className="w-6 h-6 stroke-1" />
    </div>
    <h3 className="font-bold text-white text-base">No favorite {label} yet</h3>
    <p className="text-xs text-slate-400 max-w-sm mx-auto">
      Tap the heart icon on any {label.slice(0, -1)} to save it here for fast access.
    </p>
    <button
      onClick={onExplore}
      className="px-5 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition"
    >
      Explore {label}
    </button>
  </div>
);
