import React from 'react';
import { 
  Wallpaper, VideoWallpaper, LiveWallpaper, Ringtone, 
  ThemePack, EdgePreset, AODStyle, ContentCategory 
} from '../types';
import { WallpaperCard } from '../components/WallpaperCard';
import { RingtoneCard } from '../components/RingtoneCard';
import { ThemeCard } from '../components/ThemeCard';
import { CATEGORIES_LIST } from '../data/seedData';
import { getVideoWallpapers, getLiveWallpapers } from '../services/db';
import { 
  Sparkles, ArrowRight, Zap, Clock, Compass, 
  Crown, Flame, Download, Eye, Layers, Bell, Activity, 
  Video, Play 
} from 'lucide-react';

interface HomeViewProps {
  wallpapers: Wallpaper[];
  ringtones: Ringtone[];
  themes: ThemePack[];
  edgePresets: EdgePreset[];
  aodStyles: AODStyle[];
  onNavigate: (tab: string, filter?: string) => void;
  onPreviewWallpaper: (wp: Wallpaper) => void;
  onPreviewVideoWallpaper?: (vwp: VideoWallpaper) => void;
  onPreviewLiveWallpaper?: (lwp: LiveWallpaper) => void;
  onPreviewTheme: (tp: ThemePack) => void;
  onOpenNotificationsDemo: () => void;
  onOpenUpload: () => void;
  onRequirePremium: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  wallpapers,
  ringtones,
  themes,
  edgePresets,
  aodStyles,
  onNavigate,
  onPreviewWallpaper,
  onPreviewVideoWallpaper,
  onPreviewLiveWallpaper,
  onPreviewTheme,
  onOpenNotificationsDemo,
  onOpenUpload,
  onRequirePremium,
}) => {
  const heroWallpaper = wallpapers.find(w => w.is_featured) || wallpapers[0];
  const trendingWallpapers = wallpapers.filter(w => w.is_trending).slice(0, 6);
  const videoWallpapers = getVideoWallpapers().slice(0, 4);
  const liveWallpapers = getLiveWallpapers().slice(0, 4);
  const popularRingtones = ringtones.slice(0, 4);
  const featuredThemes = themes.slice(0, 3);
  const newUploads = wallpapers.slice(2, 6);

  return (
    <div className="space-y-10 sm:space-y-14 pb-12 animate-in fade-in duration-300">
      
      {/* 1. Large Hero Featured Wallpaper / Theme Card */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0c0e2a] to-[#060714] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>FEATURED OF THE DAY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {heroWallpaper.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
              {heroWallpaper.description} Ultra-clear 4K UHD crafted by <strong className="text-cyan-300">{heroWallpaper.creator_name}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onPreviewWallpaper(heroWallpaper)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/30 transition active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>Simulate Preview</span>
              </button>

              <button
                onClick={() => onNavigate('wallpapers')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition active:scale-95"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Gallery</span>
              </button>

              <button
                onClick={() => onNavigate('video-wallpapers')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-sm transition active:scale-95"
              >
                <Video className="w-4 h-4 text-cyan-400" />
                <span>Video Wallpapers</span>
              </button>

              <button
                onClick={() => onNavigate('ai-studio')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/40 text-purple-200 font-bold text-sm transition active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Create with AI</span>
              </button>
            </div>
          </div>

          {/* Hero Right Visual Showcase */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[320px] overflow-hidden">
            <img
              src={heroWallpaper.file_url}
              alt={heroWallpaper.title}
              className="w-full h-full object-cover transform scale-105 hover:scale-110 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0c0e2a] via-transparent to-transparent opacity-80" />
          </div>

        </div>
      </section>

      {/* 2. Categories Horizontal Gallery (All 16 Categories) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Popular Categories</h2>
          </div>
          <button
            onClick={() => onNavigate('wallpapers')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>All 16 Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onNavigate('wallpapers', cat.name)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition duration-200"
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">({cat.count})</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Trending Wallpapers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-extrabold text-white">Trending Wallpapers</h2>
          </div>
          <button
            onClick={() => onNavigate('wallpapers')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {trendingWallpapers.map((wp) => (
            <WallpaperCard
              key={wp.id}
              wallpaper={wp}
              onPreview={onPreviewWallpaper}
              onRequirePremium={onRequirePremium}
            />
          ))}
        </div>
      </section>

      {/* 4. Dedicated Video Wallpapers (60 FPS Loops) Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-xl font-extrabold text-white">Video Wallpapers</h2>
              <p className="text-[11px] text-slate-400">60 FPS Ultra-HD looping video backgrounds</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('video-wallpapers')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>All Videos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {videoWallpapers.map((vwp) => (
            <div
              key={vwp.id}
              onClick={() => onPreviewVideoWallpaper ? onPreviewVideoWallpaper(vwp) : onNavigate('video-wallpapers')}
              className="group relative rounded-3xl overflow-hidden bg-[#0c0e22] border border-white/10 hover:border-cyan-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer aspect-[9/16]"
            >
              <img
                src={vwp.thumbnail_url}
                alt={vwp.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

              <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-black/60 text-cyan-300 border border-white/15">
                  {vwp.resolution}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-black/60 text-amber-300 border border-white/15">
                  {vwp.duration}s
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                <span className="text-[10px] text-cyan-400 font-semibold">{vwp.category}</span>
                <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition">
                  {vwp.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive Live Wallpapers Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-xl font-extrabold text-white">Interactive Live Wallpapers</h2>
              <p className="text-[11px] text-slate-400">Touch-reactive particles, waves, and fluid physics</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('live-wallpapers')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {liveWallpapers.map((lwp) => (
            <div
              key={lwp.id}
              onClick={() => onPreviewLiveWallpaper ? onPreviewLiveWallpaper(lwp) : onNavigate('live-wallpapers')}
              className="group relative rounded-3xl overflow-hidden bg-[#0c0e22] border border-white/10 hover:border-purple-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer aspect-[9/16]"
            >
              <img
                src={lwp.thumbnail_url}
                alt={lwp.title}
                className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-purple-500/80 text-white">
                  Live Canvas
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                <span className="text-[10px] text-purple-300 font-semibold">{lwp.animation_type}</span>
                <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-300 transition">
                  {lwp.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Edge Lighting Animated Interactive Showcase */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-[#0a0d24] to-purple-950/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>DYNAMIC AMBIENT ILLUMINATION</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Animated Edge Lighting & Effects
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              12 customizable animated borders with fluid color gradients, pulsating tempos, and corner radius control for your screen.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => onNavigate('edge-lighting')}
                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition active:scale-95"
              >
                Customize Edge Lighting
              </button>
              <button
                onClick={onOpenNotificationsDemo}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition active:scale-95 flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Notification Alert</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-40 h-64 rounded-[32px] bg-black p-2 border-2 border-[#2b2d42] shadow-[0_0_40px_rgba(0,240,255,0.3)] overflow-hidden">
              <div
                className="absolute inset-0 rounded-[32px] p-1 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, #00F0FF, #9B00FF, #FF007A, #00F0FF)',
                  animation: 'spin 4s linear infinite',
                  filter: 'blur(4px)',
                }}
              />
              <div className="relative w-full h-full rounded-[24px] bg-[#0c0d1e] overflow-hidden flex flex-col items-center justify-center p-2 text-center">
                <span className="text-xs font-mono font-bold text-cyan-300">WALLVY</span>
                <span className="text-[10px] text-slate-400 mt-1">Live Edge Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AOD Styles Previews */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-extrabold text-white">Always-On Display Clocks</h2>
          </div>
          <button
            onClick={() => onNavigate('aod')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Customizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {aodStyles.slice(0, 4).map((style) => (
            <div
              key={style.id}
              onClick={() => onNavigate('aod')}
              className="cursor-pointer group p-4 rounded-3xl bg-[#090b20] border border-white/5 hover:border-purple-500/40 transition-all flex flex-col items-center justify-center text-center space-y-2 shadow-lg hover:shadow-purple-500/10"
            >
              <div
                className="text-2xl font-black font-mono tracking-tight"
                style={{ color: style.color, textShadow: style.glow ? `0 0 12px ${style.color}` : 'none' }}
              >
                12:45
              </div>
              <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition">
                {style.name}
              </div>
              <span className="text-[10px] text-slate-500 capitalize">{style.clock_type} Style</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Popular Ringtones */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Popular Ringtones & Alerts</h2>
          </div>
          <button
            onClick={() => onNavigate('ringtones')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>All Audio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {popularRingtones.map((rt) => (
            <RingtoneCard
              key={rt.id}
              ringtone={rt}
              onRequirePremium={onRequirePremium}
            />
          ))}
        </div>
      </section>

      {/* 9. Complete Theme Suites */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-pink-400" />
            <h2 className="text-xl font-extrabold text-white">Complete Theme Suites</h2>
          </div>
          <button
            onClick={() => onNavigate('themes')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>All Suites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredThemes.map((tp) => (
            <ThemeCard
              key={tp.id}
              theme={tp}
              onPreview={onPreviewTheme}
              onRequirePremium={onRequirePremium}
            />
          ))}
        </div>
      </section>

      {/* 10. AI Wallpapers Callout */}
      <section className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-pink-900/40 border border-purple-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>GEMINI POWERED STUDIO</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Generate Your Dream Wallpaper with AI
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Turn your imagination into stunning 4K mobile masterpieces with custom artistic styles, color palettes, and resolutions.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-studio')}
          className="flex-shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-purple-500/30 hover:opacity-95 transition active:scale-95"
        >
          Create with AI
        </button>
      </section>

      {/* 11. Latest Content */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">New Uploads</h2>
          <button
            onClick={() => onNavigate('wallpapers')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {newUploads.map((wp) => (
            <WallpaperCard
              key={wp.id}
              wallpaper={wp}
              onPreview={onPreviewWallpaper}
              onRequirePremium={onRequirePremium}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
