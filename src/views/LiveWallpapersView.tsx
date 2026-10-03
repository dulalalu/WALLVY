import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Play, Sliders, Smartphone, Crown, 
  Coins, Heart, Download 
} from 'lucide-react';
import { LiveWallpaper } from '../types';
import { 
  getLiveWallpapers, isFavorite, toggleFavorite, 
  isUserPremium, hasPurchased 
} from '../services/db';
import { LiveWallpaperCanvas } from '../components/LiveWallpaperCanvas';

interface LiveWallpapersViewProps {
  onPreview: (wallpaper: LiveWallpaper) => void;
  onOpenAndroidGuide: () => void;
  onOpenCoinStore?: () => void;
  onOpenPremium?: () => void;
}

export const LiveWallpapersView: React.FC<LiveWallpapersViewProps> = ({
  onPreview,
  onOpenAndroidGuide,
  onOpenCoinStore,
  onOpenPremium
}) => {
  const [liveList, setLiveList] = useState<LiveWallpaper[]>(() => getLiveWallpapers());

  useEffect(() => {
    const handleUpdate = () => setLiveList(getLiveWallpapers());
    window.addEventListener('wallvy_live_wallpapers_updated', handleUpdate);
    return () => window.removeEventListener('wallvy_live_wallpapers_updated', handleUpdate);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#0e0e33] to-cyan-950 border border-purple-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500 text-white flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-current" />
              Interactive Canvas Engine
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-purple-300 border border-white/10">
              Touch-Reactive
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Interactive Live Wallpapers
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dynamic starlight fields, auroras, raindrops, and audio-reactive neon waves. Touch or drag to manipulate the particle gravity and visual effects in real-time.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAndroidGuide}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>Android Guide</span>
            </button>
            <button
              onClick={onOpenPremium}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-amber-500/40 text-amber-300 font-bold text-xs transition flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>Unlock All PRO Wallpapers</span>
            </button>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      {/* Grid of Live Wallpapers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {liveList.map((lwp) => {
          const isFav = isFavorite('live_wallpaper', lwp.id);
          const isUnlocked = lwp.coin_price === 0 || isUserPremium() || hasPurchased('live_wallpaper', lwp.id);

          return (
            <div
              key={lwp.id}
              className="group relative rounded-3xl overflow-hidden bg-[#0c0e22] border border-white/10 hover:border-purple-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer"
              onClick={() => onPreview(lwp)}
            >
              {/* Interactive Preview Canvas */}
              <div className="relative aspect-[9/16] bg-black overflow-hidden">
                <LiveWallpaperCanvas
                  animationType={lwp.animation_type}
                  speed={lwp.speed}
                  brightness={lwp.brightness}
                  intensity={lwp.intensity}
                  className="w-full h-full pointer-events-none"
                  interactive={false}
                />

                {/* Shading overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-300 border border-white/15">
                    {lwp.animation_type.replace('_', ' ')}
                  </span>

                  {lwp.is_premium ? (
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 flex items-center gap-1 shadow-md">
                      <Crown className="w-2.5 h-2.5 fill-current" />
                      PRO
                    </span>
                  ) : lwp.coin_price > 0 ? (
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30 flex items-center gap-1">
                      <Coins className="w-2.5 h-2.5 fill-amber-300" />
                      {lwp.coin_price}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      FREE
                    </span>
                  )}
                </div>

                {/* Hover Interactive Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-purple-500/90 text-white flex items-center justify-center shadow-lg shadow-purple-500/50 transform scale-90 group-hover:scale-100 transition">
                    <Sliders className="w-5 h-5" />
                  </div>
                </div>

                {/* Bottom title on card */}
                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                    Interactive Simulation
                  </span>
                  <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition">
                    {lwp.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 bg-[#0c0e22] border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                  By {lwp.creator_name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite('live_wallpaper', lwp.id);
                      setLiveList([...getLiveWallpapers()]);
                    }}
                    className={`p-1.5 rounded-xl border transition ${
                      isFav 
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title={isFav ? 'Favorited' : 'Favorite'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(lwp);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white font-bold text-[10px] border border-purple-500/30 transition flex items-center gap-1"
                  >
                    <span>Tune</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
