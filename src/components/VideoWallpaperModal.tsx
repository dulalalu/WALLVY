import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize2, 
  Download, Heart, Share2, FolderPlus, Smartphone, 
  Crown, Coins, Check, AlertCircle, Sparkles 
} from 'lucide-react';
import { VideoWallpaper } from '../types';
import { 
  isFavorite, toggleFavorite, downloadContent, 
  isUserPremium, hasPurchased, purchaseItem 
} from '../services/db';

interface VideoWallpaperModalProps {
  wallpaper: VideoWallpaper | null;
  onClose: () => void;
  onAddToCollection?: (vwp: VideoWallpaper) => void;
  onOpenAndroidGuide?: () => void;
  onOpenCoinStore?: () => void;
  onOpenPremium?: () => void;
}

export const VideoWallpaperModal: React.FC<VideoWallpaperModalProps> = ({
  wallpaper,
  onClose,
  onAddToCollection,
  onOpenAndroidGuide,
  onOpenCoinStore,
  onOpenPremium
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);

  useEffect(() => {
    if (wallpaper) {
      setIsFav(isFavorite('video_wallpaper', wallpaper.id));
      setIsUnlocked(wallpaper.coin_price === 0 || isUserPremium() || hasPurchased('video_wallpaper', wallpaper.id));
      setIsPlaying(true);
      setIsMuted(true);
      setIsFullscreen(false);
      setUnlockMessage(null);
    }
  }, [wallpaper]);

  if (!wallpaper) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleToggleFavorite = () => {
    const nextState = toggleFavorite('video_wallpaper', wallpaper.id);
    setIsFav(nextState);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${wallpaper.title} - Video Wallpaper on WALLVY`,
        text: `Check out this 4K Video Wallpaper: ${wallpaper.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleUnlock = () => {
    const res = purchaseItem(
      'video_wallpaper',
      wallpaper.id,
      wallpaper.title,
      wallpaper.thumbnail_url,
      wallpaper.coin_price
    );
    if (res.success) {
      setIsUnlocked(true);
      setUnlockMessage(res.message);
    } else {
      setUnlockMessage(res.message);
    }
  };

  const handleDownload = () => {
    if (!isUnlocked) {
      handleUnlock();
      return;
    }
    downloadContent('video_wallpaper', wallpaper);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Fullscreen Video Wallpaper Preview Mode */}
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            src={wallpaper.video_url}
            poster={wallpaper.thumbnail_url}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Fullscreen HUD controls */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-8 px-6 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs flex items-center gap-3">
            <span className="font-bold">{wallpaper.title}</span>
            <span className="text-slate-400">•</span>
            <span className="text-cyan-400 font-mono">{wallpaper.resolution}</span>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="ml-2 px-3 py-1 rounded-xl bg-cyan-500 text-slate-950 font-bold text-[11px]"
            >
              Exit Fullscreen
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

          {/* Video Preview Panel */}
          <div className="relative md:w-1/2 bg-black flex items-center justify-center overflow-hidden min-h-[340px] md:min-h-[500px]">
            <video
              ref={videoRef}
              src={wallpaper.video_url}
              poster={wallpaper.thumbnail_url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Video Play/Pause Overlay indicator */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/40 transform hover:scale-110 transition">
                  <Play className="w-8 h-8 ml-1 fill-current" />
                </div>
              </div>
            )}

            {/* Quick Player Action Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-xl hover:bg-white/10 transition text-slate-300 hover:text-white"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl hover:bg-white/10 transition text-slate-300 hover:text-white"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[11px] font-mono text-slate-300 px-2 py-0.5 rounded-md bg-white/10">
                  {wallpaper.duration}s Loop
                </span>
              </div>

              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
                title="Fullscreen Preview"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 shadow-md">
                {wallpaper.resolution}
              </span>
              {wallpaper.is_premium && (
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 flex items-center gap-1 shadow-md">
                  <Crown className="w-3 h-3 fill-current" />
                  Premium
                </span>
              )}
            </div>
          </div>

          {/* Details & Actions Panel */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
            
            <div className="space-y-4">
              
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  {wallpaper.category}
                </span>
                <span className="text-xs text-slate-400">
                  By <strong className="text-white">{wallpaper.creator_name}</strong>
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {wallpaper.title}
                </h2>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {wallpaper.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Resolution</span>
                  <p className="text-xs font-bold text-white mt-0.5">{wallpaper.resolution}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Duration</span>
                  <p className="text-xs font-bold text-white mt-0.5">{wallpaper.duration}s</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">File Size</span>
                  <p className="text-xs font-bold text-white mt-0.5">{wallpaper.file_size}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/5 text-[11px] text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Feedback Alert */}
              {unlockMessage && (
                <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{unlockMessage}</span>
                </div>
              )}

            </div>

            {/* Bottom Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              
              {/* Primary Download / Unlock Button */}
              {isUnlocked ? (
                <button
                  onClick={handleDownload}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 4K Video MP4</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleUnlock}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Coins className="w-4 h-4 fill-current" />
                    <span>Unlock for {wallpaper.coin_price} Coins</span>
                  </button>

                  <button
                    onClick={onOpenPremium}
                    className="w-full py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-amber-500/30 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Unlock All with WALLVY PRO</span>
                  </button>
                </div>
              )}

              {/* Android Native Setup Helper CTA */}
              <button
                onClick={onOpenAndroidGuide}
                className="w-full py-2.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>How to set as Android Live Wallpaper</span>
              </button>

              {/* Secondary Actions: Favorite, Add to Collection, Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex-1 py-2.5 rounded-2xl border text-xs font-semibold transition flex items-center justify-center gap-2 ${
                    isFav
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{isFav ? 'Favorited' : 'Favorite'}</span>
                </button>

                {onAddToCollection && (
                  <button
                    onClick={() => onAddToCollection(wallpaper)}
                    className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition"
                    title="Add to Collection"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition"
                  title="Share Video Wallpaper"
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
