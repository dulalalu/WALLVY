import React, { useState } from 'react';
import { UserProfile, CreatorUpload, Wallpaper } from '../types';
import { 
  Sparkles, Upload, Clock, CheckCircle2, XCircle, 
  Eye, Image as ImageIcon, Music, Layers, ArrowUpRight 
} from 'lucide-react';
import { getCreatorUploads } from '../services/db';

interface CreatorStudioViewProps {
  user: UserProfile;
  onOpenUpload: () => void;
  onPreviewWallpaper: (wp: Wallpaper) => void;
}

export const CreatorStudioView: React.FC<CreatorStudioViewProps> = ({
  user,
  onOpenUpload,
  onPreviewWallpaper,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const uploads = getCreatorUploads().filter(u => u.creator_id === user.id);

  const filteredUploads = uploads.filter(u => {
    if (activeFilter === 'all') return true;
    return u.status === activeFilter;
  });

  const pendingCount = uploads.filter(u => u.status === 'pending').length;
  const approvedCount = uploads.filter(u => u.status === 'approved').length;
  const rejectedCount = uploads.filter(u => u.status === 'rejected').length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Creator Studio Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0c0e2a] to-cyan-950/40 border border-purple-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>CREATOR WORKSPACE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Creator Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Manage your submissions, upload high-resolution 4K and video wallpapers, and track review status.
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/20 hover:opacity-95 transition active:scale-95 self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Artwork</span>
          </button>
        </div>
      </div>

      {/* Submission Status Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveFilter('pending')}
          className={`p-5 rounded-3xl bg-[#0c0e24] border transition cursor-pointer ${
            activeFilter === 'pending' ? 'border-amber-400/60 shadow-lg shadow-amber-500/10' : 'border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{pendingCount}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">In moderation queue</span>
        </div>

        <div 
          onClick={() => setActiveFilter('approved')}
          className={`p-5 rounded-3xl bg-[#0c0e24] border transition cursor-pointer ${
            activeFilter === 'approved' ? 'border-emerald-400/60 shadow-lg shadow-emerald-500/10' : 'border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Approved & Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{approvedCount}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Visible in public gallery</span>
        </div>

        <div 
          onClick={() => setActiveFilter('rejected')}
          className={`p-5 rounded-3xl bg-[#0c0e24] border transition cursor-pointer ${
            activeFilter === 'rejected' ? 'border-rose-400/60 shadow-lg shadow-rose-500/10' : 'border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Changes Requested</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{rejectedCount}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Review guidelines</span>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">My Submissions & History</h2>

          {/* Filter Pills */}
          <div className="flex gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-xl capitalize font-medium transition ${
                  activeFilter === f
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredUploads.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white/[0.02] rounded-3xl border border-white/5">
            <Upload className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-bold text-white text-base">No submissions in this filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Upload wallpapers, ringtones, or theme packs to share with the community.
            </p>
            <button
              onClick={onOpenUpload}
              className="px-5 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition"
            >
              Upload Artwork
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUploads.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-[#0c0e24] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/5">
                    <img src={item.thumbnail_url || item.file_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="capitalize">{item.content_type}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {item.rejection_reason && (
                    <span className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
                      Reason: {item.rejection_reason}
                    </span>
                  )}
                  {item.status === 'approved' && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Live in App
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
