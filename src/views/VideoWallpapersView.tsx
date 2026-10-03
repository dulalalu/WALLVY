import React, { useState, useEffect } from 'react';
import { 
  Video, Play, Sparkles, Filter, Crown, 
  Smartphone, Search, Heart, Coins, Check, Download 
} from 'lucide-react';
import { VideoWallpaper, ContentCategory } from '../types';
import { 
  getVideoWallpapers, isFavorite, toggleFavorite, 
  isUserPremium, hasPurchased 
} from '../services/db';

interface VideoWallpapersViewProps {
  onPreview: (wallpaper: VideoWallpaper) => void;
  onOpenAndroidGuide: () => void;
  onOpenCoinStore?: () => void;
  onOpenPremium?: () => void;
}

const CATEGORIES: ('All' | ContentCategory)[] = [
  'All', 'Neon', 'Space', 'Technology', 'Abstract', 'Cars', 
  'Gaming', 'Nature', 'Anime', 'Fantasy', 'Cinematic'
];

export const VideoWallpapersView: React.FC<VideoWallpapersViewProps> = ({
  onPreview,
  onOpenAndroidGuide,
  onOpenCoinStore,
  onOpenPremium
}) => {
  const [videoList, setVideoList] = useState<VideoWallpaper[]>(() => getVideoWallpapers());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium' | '4k'>('all');
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => setVideoList(getVideoWallpapers());
    window.addEventListener('wallvy_video_wallpapers_updated', handleUpdate);
    return () => window.removeEventListener('wallvy_video_wallpapers_updated', handleUpdate);
  }, []);

  const filteredVideos = videoList.filter(v => {
    const matchCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchQuery = 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.creator_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchCat || !matchQuery) return false;

    if (filterType === 'free') return v.coin_price === 0 && !v.is_premium;
    if (filterType === 'premium') return v.is_premium || v.coin_price > 0;
    if (filterType === '4k') return v.resolution.includes('4K');
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Banner / Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-950 via-[#0d102f] to-purple-950 border border-cyan-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 flex items-center gap-1 shadow-md">
              <Video className="w-3 h-3 fill-current" />
              60 FPS HD / 4K
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-cyan-300 border border-white/10">
              Seamless Loops
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            High Definition Video Wallpapers
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ultra-smooth cinematic video backgrounds optimized for OLED mobile displays. Experience vivid colors, looping animations, and fluid motion.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAndroidGuide}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>Android Setup Guide</span>
            </button>
            
            <button
              onClick={onOpenPremium}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-amber-500/40 text-amber-300 font-bold text-xs transition flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>Unlock All PRO Videos</span>
            </button>
          </div>
        </div>

        {/* Subtle Decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search video wallpapers, tags, 60fps..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 text-xs outline-none transition"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['all', '4k', 'free', 'premium'] as const).map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition flex-shrink-0 ${
                filterType === ft
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {ft === 'all' ? 'All Videos' : ft === '4k' ? '4K UHD' : ft}
            </button>
          ))}
        </div>

      </div>

      {/* Category Horizontal Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400 text-cyan-300 shadow-sm font-bold'
                : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="py-16 text-center text-slate-500 space-y-3">
          <Video className="w-12 h-12 mx-auto text-slate-600" />
          <p className="text-sm font-semibold">No video wallpapers found matching your filter.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setFilterType('all'); }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-bold transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredVideos.map((vwp) => {
            const isFav = isFavorite('video_wallpaper', vwp.id);
            const isHovered = hoveredVideoId === vwp.id;
            const isUnlocked = vwp.coin_price === 0 || isUserPremium() || hasPurchased('video_wallpaper', vwp.id);

            return (
              <div
                key={vwp.id}
                onMouseEnter={() => setHoveredVideoId(vwp.id)}
                onMouseLeave={() => setHoveredVideoId(null)}
                className="group relative rounded-3xl overflow-hidden bg-[#0c0e22] border border-white/10 hover:border-cyan-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer"
                onClick={() => onPreview(vwp)}
              >
                {/* Media Container */}
                <div className="relative aspect-[9/16] bg-black overflow-hidden">
                  
                  {/* Poster Image */}
                  <img
                    src={vwp.thumbnail_url}
                    alt={vwp.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      isHovered ? 'opacity-0' : 'opacity-100'
                    }`}
                    loading="lazy"
                  />

                  {/* Looping video preview on hover */}
                  {isHovered && (
                    <video
                      src={vwp.video_url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-300 border border-white/15">
                      {vwp.resolution}
                    </span>

                    {vwp.is_premium ? (
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 flex items-center gap-1 shadow-md">
                        <Crown className="w-2.5 h-2.5 fill-current" />
                        PRO
                      </span>
                    ) : vwp.coin_price > 0 ? (
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30 flex items-center gap-1">
                        <Coins className="w-2.5 h-2.5 fill-amber-300" />
                        {vwp.coin_price}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Center Play Button indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50 transform scale-90 group-hover:scale-100 transition">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Bottom Info on media */}
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-300">
                      <span className="text-cyan-400 font-semibold">{vwp.category}</span>
                      <span className="font-mono bg-black/50 px-1.5 py-0.5 rounded">{vwp.duration}s</span>
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition">
                      {vwp.title}
                    </h3>
                  </div>

                </div>

                {/* Footer Controls Bar */}
                <div className="p-3 bg-[#0c0e22] border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                    By {vwp.creator_name}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('video_wallpaper', vwp.id);
                        setVideoList([...getVideoWallpapers()]);
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
                        onPreview(vwp);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-[10px] border border-cyan-500/30 transition flex items-center gap-1"
                    >
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
