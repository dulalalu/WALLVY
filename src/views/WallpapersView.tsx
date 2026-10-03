import React, { useState, useMemo } from 'react';
import { Wallpaper, ContentCategory } from '../types';
import { WallpaperCard } from '../components/WallpaperCard';
import { CATEGORIES_LIST } from '../data/seedData';
import { Filter, Sparkles, Flame, Clock, Crown, Compass, Eye, Image as ImageIcon, Video } from 'lucide-react';

interface WallpapersViewProps {
  wallpapers: Wallpaper[];
  initialCategory?: string;
  initialFilter?: string;
  onPreview: (wp: Wallpaper) => void;
  onAddToCollection: (wp: Wallpaper) => void;
  onRequirePremium: () => void;
}

export const WallpapersView: React.FC<WallpapersViewProps> = ({
  wallpapers,
  initialCategory,
  initialFilter = 'all',
  onPreview,
  onAddToCollection,
  onRequirePremium,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<'trending' | 'popular' | 'new'>('trending');

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: '4k', label: '4K Ultra' },
    { id: 'hd', label: 'HD' },
    { id: 'portrait', label: 'Portrait' },
    { id: 'landscape', label: 'Landscape' },
    { id: 'ai', label: 'AI Wallpapers', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'free', label: 'Free' },
    { id: 'premium', label: 'PRO', icon: Crown },
  ];

  const filteredWallpapers = useMemo(() => {
    return wallpapers
      .filter((wp) => {
        // Category filter
        if (selectedCategory !== 'all' && wp.category !== selectedCategory) {
          return false;
        }

        // Sub filter
        if (selectedFilter === '4k' && !wp.resolution.includes('4K')) return false;
        if (selectedFilter === 'hd' && !wp.resolution.includes('HD') && !wp.resolution.includes('1080')) return false;
        if (selectedFilter === 'ai' && !wp.is_ai_generated) return false;
        if (selectedFilter === 'portrait' && wp.orientation !== 'portrait') return false;
        if (selectedFilter === 'landscape' && wp.orientation !== 'landscape') return false;
        if (selectedFilter === 'trending' && !wp.is_trending) return false;
        if (selectedFilter === 'free' && (wp.coin_price > 0 || wp.is_premium)) return false;
        if (selectedFilter === 'premium' && !wp.is_premium && wp.coin_price === 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.download_count || 0) - (a.download_count || 0);
        if (sortBy === 'new') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return (b.likes_count || 0) - (a.likes_count || 0);
      });
  }, [wallpapers, selectedCategory, selectedFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title & Sort Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-cyan-400" />
            <span>Wallpapers Gallery</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Handcrafted 4K Ultra HD & AI-generated backgrounds tailored for mobile displays.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort:</span>
          <div className="p-1 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1 text-xs">
            <button
              onClick={() => setSortBy('trending')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                sortBy === 'trending' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                sortBy === 'popular' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('new')}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                sortBy === 'new' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Newest
            </button>
          </div>
        </div>
      </div>

      {/* Main Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
              selectedFilter === tab.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Categories Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white font-bold'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          All Categories
        </button>
        {CATEGORIES_LIST.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === cat.name
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Wallpaper Grid */}
      {filteredWallpapers.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white/[0.02] rounded-3xl border border-white/5">
          <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">No Wallpapers Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your category or filter selection to explore more options.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredWallpapers.map((wp) => (
            <WallpaperCard
              key={wp.id}
              wallpaper={wp}
              onPreview={onPreview}
              onAddToCollection={onAddToCollection}
              onRequirePremium={onRequirePremium}
            />
          ))}
        </div>
      )}
    </div>
  );
};
