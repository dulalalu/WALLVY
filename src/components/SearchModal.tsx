import React, { useState, useMemo } from 'react';
import { X, Search, TrendingUp, Clock, Image as ImageIcon, Music, Layers, ArrowRight } from 'lucide-react';
import { Wallpaper, Ringtone, ThemePack } from '../types';

interface SearchModalProps {
  wallpapers: Wallpaper[];
  ringtones: Ringtone[];
  themes: ThemePack[];
  onClose: () => void;
  onSelectWallpaper: (wp: Wallpaper) => void;
  onSelectRingtone: (rt: Ringtone) => void;
  onSelectTheme: (tp: ThemePack) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  wallpapers,
  ringtones,
  themes,
  onClose,
  onSelectWallpaper,
  onSelectRingtone,
  onSelectTheme,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'wallpapers' | 'ringtones' | 'themes'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wallvy_recent_searches') || '["Cyberpunk", "4K OLED", "Tokyo", "Synthwave"]');
    } catch {
      return ["Cyberpunk", "4K OLED", "Tokyo", "Synthwave"];
    }
  });

  const trendingQueries = ['Neon Rain', 'Supercars', 'Cosmic Stars', 'Lofi Midnight', 'Galaxy Clock'];

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { wallpapers: [], ringtones: [], themes: [] };

    const matchedWallpapers = wallpapers.filter(w => 
      w.title.toLowerCase().includes(q) || 
      w.category.toLowerCase().includes(q) || 
      w.creator_name.toLowerCase().includes(q) ||
      w.tags.some(t => t.toLowerCase().includes(q))
    );

    const matchedRingtones = ringtones.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.category.toLowerCase().includes(q) || 
      r.creator_name.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );

    const matchedThemes = themes.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.creator_name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );

    return {
      wallpapers: matchedWallpapers,
      ringtones: matchedRingtones,
      themes: matchedThemes,
    };
  }, [query, wallpapers, ringtones, themes]);

  const handleSelectQuery = (term: string) => {
    setQuery(term);
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('wallvy_recent_searches', JSON.stringify(updated));
  };

  const totalResultsCount = 
    filteredResults.wallpapers.length + 
    filteredResults.ringtones.length + 
    filteredResults.themes.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-start justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#090b20] border border-cyan-500/30 shadow-[0_0_80px_rgba(0,240,255,0.2)] overflow-hidden mt-6 sm:mt-12 flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 bg-[#0c0e2a] flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wallpapers, ringtones, themes, tags..."
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-base sm:text-lg focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold"
          >
            Esc
          </button>
        </div>

        {/* Content Type Filter Tabs */}
        {query && (
          <div className="px-4 py-2 border-b border-white/5 bg-[#090a1b] flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `All (${totalResultsCount})` },
              { id: 'wallpapers', label: `Wallpapers (${filteredResults.wallpapers.length})`, icon: ImageIcon },
              { id: 'ringtones', label: `Ringtones (${filteredResults.ringtones.length})`, icon: Music },
              { id: 'themes', label: `Themes (${filteredResults.themes.length})`, icon: Layers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                  activeFilter === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!query ? (
            /* Recent & Trending Searches */
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSelectQuery(s)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                      >
                        <span>{s}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
                  <span>Trending on WALLVY</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingQueries.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleSelectQuery(t)}
                      className="px-3.5 py-1.5 rounded-xl bg-pink-950/20 hover:bg-pink-900/40 border border-pink-800/40 text-xs font-semibold text-pink-300 flex items-center gap-1.5 transition"
                    >
                      <span>🔥 {t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : totalResultsCount === 0 ? (
            /* Empty Search State */
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">No results found for "{query}"</h3>
              <p className="text-xs text-slate-400">Try searching for generic terms like "Anime", "Cars", "Cyber", or "Neon".</p>
            </div>
          ) : (
            /* Results Stream */
            <div className="space-y-6">
              
              {/* Wallpapers section */}
              {(activeFilter === 'all' || activeFilter === 'wallpapers') && filteredResults.wallpapers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Wallpapers ({filteredResults.wallpapers.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {filteredResults.wallpapers.map(wp => (
                      <div
                        key={wp.id}
                        onClick={() => {
                          onSelectWallpaper(wp);
                          onClose();
                        }}
                        className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-400 transition"
                      >
                        <div className="aspect-[9/16] overflow-hidden">
                          <img src={wp.thumbnail_url} alt={wp.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        </div>
                        <div className="p-2 text-xs">
                          <div className="font-bold text-white truncate">{wp.title}</div>
                          <div className="text-[10px] text-cyan-400">{wp.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ringtones section */}
              {(activeFilter === 'all' || activeFilter === 'ringtones') && filteredResults.ringtones.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Ringtones ({filteredResults.ringtones.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredResults.ringtones.map(rt => (
                      <div
                        key={rt.id}
                        onClick={() => {
                          onSelectRingtone(rt);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                            <Music className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-white block">{rt.title}</span>
                            <span className="text-xs text-slate-400">{rt.creator_name} • {rt.category}</span>
                          </div>
                        </div>
                        <span className="text-xs text-cyan-400 font-mono">0:{rt.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Themes section */}
              {(activeFilter === 'all' || activeFilter === 'themes') && filteredResults.themes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Theme Packs ({filteredResults.themes.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredResults.themes.map(tp => (
                      <div
                        key={tp.id}
                        onClick={() => {
                          onSelectTheme(tp);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center gap-3 cursor-pointer transition"
                      >
                        <img src={tp.thumbnail_url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                          <span className="font-bold text-sm text-white block">{tp.title}</span>
                          <span className="text-xs text-slate-400 line-clamp-1">{tp.description}</span>
                          <span className="text-[10px] text-pink-400 mt-1 block">★ {tp.rating} • Full Suite</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
