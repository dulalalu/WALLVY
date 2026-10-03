import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Image as ImageIcon, Music, Layers, Sparkles } from 'lucide-react';
import { submitCreatorUpload, getUserProfile } from '../services/db';
import { ContentCategory, RingtoneCategory } from '../types';

interface CreatorUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatorUploadModal: React.FC<CreatorUploadModalProps> = ({ onClose, onSuccess }) => {
  const user = getUserProfile();
  const [contentType, setContentType] = useState<'wallpaper' | 'ringtone' | 'theme'>('wallpaper');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Anime');
  const [tagsInput, setTagsInput] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sample curated wallpaper presets for rapid testing if user doesn't paste a URL
  const samplePresets = [
    { title: 'Cyberpunk Neon Alley', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', cat: 'Cyberpunk' },
    { title: 'Supercar at Sunset', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', cat: 'Cars' },
    { title: 'Cosmic Nebula Core', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80', cat: 'Space' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    submitCreatorUpload({
      creator_id: user.id,
      creator_name: user.display_name || user.username,
      content_type: contentType,
      title: title.trim(),
      description: description.trim() || 'Custom creator submission for WALLVY community.',
      category: category,
      tags: tags.length ? tags : ['Wallpaper', category],
      file_url: fileUrl.trim() || samplePresets[0].url,
      thumbnail_url: fileUrl.trim() || samplePresets[0].url,
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0b0d24] border border-cyan-500/30 p-6 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Creator Studio Upload</h3>
              <p className="text-xs text-slate-400">Share your art with millions of WALLVY users</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Upload Submitted Successfully!</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Your upload has entered the <strong>Pending Moderation</strong> queue. Once approved by an admin, it will be published to the public gallery.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            
            {/* Content Type Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Content Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'wallpaper', label: 'Wallpaper', icon: ImageIcon },
                  { type: 'ringtone', label: 'Ringtone', icon: Music },
                  { type: 'theme', label: 'Theme Pack', icon: Layers },
                ].map(item => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setContentType(item.type as any)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${
                      contentType === item.type
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Midnight Tokyo Drift"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your creation, inspiration, or technique..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 resize-none"
              />
            </div>

            {/* Category & Tags Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-[#10132e] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  {['Anime', 'Cars', 'Nature', 'Gaming', 'Love', 'Space', 'Abstract', 'Cyberpunk', 'Minimal', 'Dark'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="Neon, 4K, Retro"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Media URL / Source */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">File Image/Audio URL</label>
                <span className="text-[10px] text-cyan-400">Quick Pick Sample</span>
              </div>
              <input
                type="url"
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                placeholder="https://... (Direct image or audio link)"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />

              <div className="flex gap-2 mt-2">
                {samplePresets.map((samp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTitle(samp.title);
                      setFileUrl(samp.url);
                      setCategory(samp.cat);
                    }}
                    className="text-[10px] px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 truncate max-w-[150px]"
                  >
                    Sample: {samp.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Moderation Disclaimer */}
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-[11px] text-purple-200">
              🛡️ All creator uploads undergo community guidelines check before going live.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 font-bold text-white shadow-lg shadow-cyan-500/25 hover:opacity-95 transition active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit for Verification</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
