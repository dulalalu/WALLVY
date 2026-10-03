import React, { useState, useEffect } from 'react';
import { 
  X, Maximize2, Sliders, Volume2, VolumeX, 
  Download, Heart, Share2, Smartphone, Crown, 
  Coins, Sparkles, Check, Play 
} from 'lucide-react';
import { LiveWallpaper } from '../types';
import { LiveWallpaperCanvas } from './LiveWallpaperCanvas';
import { 
  isFavorite, toggleFavorite, downloadContent, 
  isUserPremium, hasPurchased, purchaseItem, updateLiveWallpaper 
} from '../services/db';
import { playSynthesizedRingtone, stopAudio } from '../services/audioEngine';

interface LiveWallpaperModalProps {
  wallpaper: LiveWallpaper | null;
  onClose: () => void;
  onOpenAndroidGuide?: () => void;
  onOpenCoinStore?: () => void;
  onOpenPremium?: () => void;
}

export const LiveWallpaperModal: React.FC<LiveWallpaperModalProps> = ({
  wallpaper,
  onClose,
  onOpenAndroidGuide,
  onOpenCoinStore,
  onOpenPremium
}) => {
  const [speed, setSpeed] = useState(5);
  const [brightness, setBrightness] = useState(85);
  const [intensity, setIntensity] = useState(7);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (wallpaper) {
      setSpeed(wallpaper.speed || 5);
      setBrightness(wallpaper.brightness || 85);
      setIntensity(wallpaper.intensity || 7);
      setSoundEnabled(wallpaper.sound_enabled || false);
      setIsFav(isFavorite('live_wallpaper', wallpaper.id));
      setIsUnlocked(wallpaper.coin_price === 0 || isUserPremium() || hasPurchased('live_wallpaper', wallpaper.id));
      setIsFullscreen(false);
      setFeedback(null);
    }
  }, [wallpaper]);

  useEffect(() => {
    if (soundEnabled && wallpaper?.sound_synth) {
      playSynthesizedRingtone(wallpaper.id, wallpaper.sound_synth, 30);
    } else {
      stopAudio();
    }
    return () => {
      stopAudio();
    };
  }, [soundEnabled, wallpaper]);

  if (!wallpaper) return null;

  const handleToggleFav = () => {
    const next = toggleFavorite('live_wallpaper', wallpaper.id);
    setIsFav(next);
  };

  const handleUnlock = () => {
    const res = purchaseItem(
      'live_wallpaper',
      wallpaper.id,
      wallpaper.title,
      wallpaper.thumbnail_url,
      wallpaper.coin_price
    );
    if (res.success) {
      setIsUnlocked(true);
      setFeedback(res.message);
    } else {
      setFeedback(res.message);
    }
  };

  const handleSaveSettings = () => {
    updateLiveWallpaper(wallpaper.id, {
      speed,
      brightness,
      intensity,
      sound_enabled: soundEnabled,
    });
    setFeedback('Settings saved!');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleDownload = () => {
    if (!isUnlocked) {
      handleUnlock();
      return;
    }
    downloadContent('live_wallpaper', {
      ...wallpaper,
      speed,
      brightness,
      intensity,
      sound_enabled: soundEnabled
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Fullscreen Interactive Canvas Mode */}
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none">
          <LiveWallpaperCanvas
            animationType={wallpaper.animation_type}
            speed={speed}
            brightness={brightness}
            intensity={intensity}
            className="w-full h-full"
            interactive={true}
          />

          {/* Fullscreen HUD */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition"
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-6 px-6 py-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Interactive Mode: Touch or drag anywhere to manipulate particles and waves!</span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="ml-2 px-3 py-1 rounded-xl bg-cyan-500 text-slate-950 font-bold text-[11px]"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        /* Regular Modal Container */
        <div className="relative w-full max-w-4xl rounded-3xl bg-[#0c0e24] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Live Interactive Canvas Stage */}
          <div className="relative md:w-1/2 bg-black flex items-center justify-center overflow-hidden min-h-[340px] md:min-h-[500px]">
            <LiveWallpaperCanvas
              animationType={wallpaper.animation_type}
              speed={speed}
              brightness={brightness}
              intensity={intensity}
              className="w-full h-full cursor-crosshair"
              interactive={true}
            />

            {/* Stage HUD Banner */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 shadow-md">
                Interactive Canvas
              </span>
              {wallpaper.is_premium && (
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 flex items-center gap-1 shadow-md">
                  <Crown className="w-3 h-3 fill-current" />
                  PRO
                </span>
              )}
            </div>

            {/* Bottom Controls on Stage */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl transition ${
                    soundEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-white/10 text-slate-400'
                  }`}
                  title="Toggle Sound Effects"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <span className="text-[11px] text-slate-300">Touch/Drag to Interact</span>
              </div>

              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>

          </div>

          {/* Controls & Configuration Panel */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
            
            <div className="space-y-5">
              
              {/* Header */}
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Live Wallpaper Studio
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {wallpaper.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {wallpaper.description}
                </p>
              </div>

              {/* Realtime Tuner Sliders */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Live Parameters
                  </span>
                  <button
                    onClick={handleSaveSettings}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Save Preset
                  </button>
                </div>

                {/* Speed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Animation Speed</span>
                    <span className="text-cyan-400 font-mono">{speed}x</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Intensity */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Particle / Wave Density</span>
                    <span className="text-cyan-400 font-mono">{intensity}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Brightness */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Neon Glow Brightness</span>
                    <span className="text-cyan-400 font-mono">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={100}
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Feedback toast */}
              {feedback && (
                <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              
              {isUnlocked ? (
                <button
                  onClick={handleDownload}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Live Preset (.wallvy)</span>
                </button>
              ) : (
                <button
                  onClick={handleUnlock}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Coins className="w-4 h-4 fill-current" />
                  <span>Unlock for {wallpaper.coin_price} Coins</span>
                </button>
              )}

              {/* Android helper */}
              <button
                onClick={onOpenAndroidGuide}
                className="w-full py-2.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>How to use on Android</span>
              </button>

              {/* Favorite & Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFav}
                  className={`flex-1 py-2.5 rounded-2xl border text-xs font-semibold transition flex items-center justify-center gap-2 ${
                    isFav
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{isFav ? 'Favorited' : 'Favorite'}</span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: wallpaper.title, url: window.location.href }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
