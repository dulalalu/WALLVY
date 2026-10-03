import React, { useState, useEffect } from 'react';
import { Ringtone } from '../types';
import { Play, Pause, Download, Heart, Crown, Share2, Volume2 } from 'lucide-react';
import { playSynthesizedRingtone, stopAudio, isAudioPlaying } from '../services/audioEngine';
import { isFavorite, toggleFavorite, downloadContent, isUserPremium } from '../services/db';

interface RingtoneCardProps {
  ringtone: Ringtone;
  onRequirePremium?: () => void;
  onShare?: (rt: Ringtone) => void;
}

export const RingtoneCard: React.FC<RingtoneCardProps> = ({
  ringtone,
  onRequirePremium,
  onShare,
}) => {
  const [playing, setPlaying] = useState(false);
  const [favorite, setFavorite] = useState(() => isFavorite('ringtone', ringtone.id));
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const checkPlaying = () => {
      setPlaying(isAudioPlaying(ringtone.id));
    };
    const interval = setInterval(checkPlaying, 200);
    return () => clearInterval(interval);
  }, [ringtone.id]);

  const handlePlayToggle = () => {
    if (playing) {
      stopAudio();
      setPlaying(false);
    } else {
      playSynthesizedRingtone(
        ringtone.id,
        ringtone.preview_synth_type || 'cyberpunk',
        ringtone.duration || 10,
        () => setPlaying(false)
      );
      setPlaying(true);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavorite('ringtone', ringtone.id);
    setFavorite(updated);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ringtone.is_premium && !isUserPremium()) {
      if (onRequirePremium) onRequirePremium();
      return;
    }
    setDownloading(true);
    await downloadContent('ringtone', ringtone);
    setTimeout(() => setDownloading(false), 1200);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: ringtone.title,
        text: `Listen to "${ringtone.title}" ringtone on WALLVY!`,
        url: window.location.href,
      }).catch(() => {});
    } else if (onShare) {
      onShare(ringtone);
    }
  };

  return (
    <div className="relative rounded-2xl bg-[#0c0e24] border border-white/[0.08] hover:border-cyan-500/40 p-4 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between group">
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayToggle}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
              playing
                ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/40 scale-105'
                : 'bg-white/10 text-white hover:bg-cyan-500 hover:text-slate-950 active:scale-95'
            }`}
          >
            {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                {ringtone.title}
              </h4>
              {ringtone.is_premium && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-slate-950">
                  <Crown className="w-2.5 h-2.5 fill-current" />
                  PRO
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {ringtone.creator_name} • <span className="text-cyan-400">{ringtone.category}</span>
            </p>
          </div>
        </div>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-xl border transition ${
            favorite
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
          title="Favorite"
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Dynamic Animated Waveform Preview */}
      <div className="my-4 h-10 px-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between gap-1 overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => {
          const defaultHeight = Math.sin(i * 0.4) * 14 + 16;
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                playing
                  ? 'bg-gradient-to-t from-cyan-500 to-purple-500'
                  : 'bg-white/20'
              }`}
              style={{
                height: playing ? `${Math.max(6, Math.random() * 32 + 4)}px` : `${defaultHeight}px`,
              }}
            />
          );
        })}
      </div>

      {/* Footer Info & Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>0:{ringtone.duration.toString().padStart(2, '0')}</span>
          <span className="text-slate-600">•</span>
          <span>{(ringtone.download_count || 450).toLocaleString()} dl</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Exporting...' : 'Get Ringtone'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
