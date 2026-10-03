import React, { useState } from 'react';
import { UserProfile, Wallpaper, Ringtone, ThemePack } from '../types';
import { 
  User, Sparkles, Heart, Folder, Upload, Download, 
  Crown, Shield, CheckCircle2, Settings as SettingsIcon 
} from 'lucide-react';
import { isUserPremium, getCreatorUploads } from '../services/db';

interface ProfileViewProps {
  user: UserProfile;
  wallpapers: Wallpaper[];
  onNavigate: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenPremium: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  wallpapers,
  onNavigate,
  onOpenUpload,
  onOpenPremium,
}) => {
  const isPremium = isUserPremium();
  const uploads = getCreatorUploads().filter(u => u.creator_id === user.id);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d102e] via-[#120f38] to-[#0d102e] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-cyan-400 p-1 bg-black/60 shadow-lg shadow-cyan-500/20">
              <img src={user.avatar_url || '/logo.png'} alt={user.display_name} className="w-full h-full object-cover rounded-2xl" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.display_name}</h1>
                {user.is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">@{user.username}</p>
              
              <div className="flex items-center gap-2 pt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'creator'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {user.role === 'creator' ? 'Verified Creator' : 'Member'}
                </span>

                {user.role === 'creator' && (
                  <button
                    onClick={() => onNavigate('creator-studio')}
                    className="text-[10px] text-purple-300 hover:text-purple-200 font-bold bg-purple-500/10 hover:bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30 transition"
                  >
                    Open Creator Studio →
                  </button>
                )}

                {isPremium ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950">
                    <Crown className="w-2.5 h-2.5 fill-current" />
                    PRO MEMBER
                  </span>
                ) : (
                  <button
                    onClick={onOpenPremium}
                    className="text-[10px] text-amber-400 hover:underline font-bold"
                  >
                    Upgrade to PRO
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Art</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition active:scale-95"
              title="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-4 text-xs text-slate-300 max-w-xl">
            {user.bio}
          </p>
        )}
      </div>

      {/* Numerical Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Favorites', value: user.favorites_count || 18, icon: Heart, color: 'text-rose-400', tab: 'favorites' },
          { label: 'Collections', value: user.downloads_count ? 4 : 2, icon: Folder, color: 'text-cyan-400', tab: 'collections' },
          { label: 'Uploads', value: uploads.length || 3, icon: Upload, color: 'text-purple-400', tab: 'wallpapers' },
          { label: 'Downloads', value: user.downloads_count || 42, icon: Download, color: 'text-emerald-400', tab: 'wallpapers' },
        ].map((s, i) => (
          <div
            key={i}
            onClick={() => onNavigate(s.tab)}
            className="cursor-pointer p-4 rounded-3xl bg-[#0c0e24] border border-white/5 hover:border-cyan-400/40 p-4 transition text-center space-y-1 shadow-lg"
          >
            <s.icon className={`w-5 h-5 mx-auto ${s.color}`} />
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-[11px] text-slate-400 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Creator Uploads Status Section */}
      <div className="p-6 rounded-3xl bg-[#0c0e24] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>My Creator Submissions</span>
          </h3>
          <button
            onClick={onOpenUpload}
            className="text-xs font-semibold text-cyan-400 hover:underline"
          >
            + New Submission
          </button>
        </div>

        {uploads.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No uploads submitted yet. Tap "+ New Submission" to submit artwork for moderation.</p>
        ) : (
          <div className="space-y-2">
            {uploads.map((up) => (
              <div
                key={up.id}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                    <img src={up.thumbnail_url || up.file_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{up.title}</h4>
                    <span className="text-[10px] text-slate-400 capitalize">{up.content_type} • {up.category}</span>
                  </div>
                </div>

                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    up.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : up.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {up.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
