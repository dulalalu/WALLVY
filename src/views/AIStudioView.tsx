import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { 
  Sparkles, Wand2, Download, Check, Eye, 
  RotateCw, Layers, Palette, Sliders, Smartphone, Image as ImageIcon 
} from 'lucide-react';
import { addWallpaper, setActiveWallpaper, isUserPremium } from '../services/db';

interface AIStudioViewProps {
  onPreview: (wp: Wallpaper) => void;
  onRequirePremium: () => void;
}

const STYLES = [
  'Cinematic', 'Anime', '3D', 'Cyberpunk', 'Fantasy', 
  'Minimal', 'Nature', 'Space', 'Abstract', 'Luxury', 'Gaming'
];

const MOODS = ['Euphoric', 'Mysterious', 'Vibrant', 'Calm', 'Futuristic', 'Dark OLED', 'Ethereal'];
const COLOR_PREFS = ['Electric Cyan & Pink', 'Midnight Violet & Gold', 'Emerald Neon', 'Monochrome Titanium', 'Solar Orange'];

// High quality curated seeds matching user styles for rapid instant preview
const PRESET_SEEDS: Record<string, string> = {
  Cyberpunk: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  Anime: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
  '3D': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  Space: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
  Nature: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
  Abstract: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
  Cinematic: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  Minimal: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  Luxury: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  Gaming: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  Fantasy: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
};

export const AIStudioView: React.FC<AIStudioViewProps> = ({ onPreview, onRequirePremium }) => {
  const [prompt, setPrompt] = useState('Futuristic holographic samurai meditating on a neon skyscraper ledge in rain');
  const [selectedStyle, setSelectedStyle] = useState('Cyberpunk');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [mood, setMood] = useState('Futuristic');
  const [colorPref, setColorPref] = useState(COLOR_PREFS[0]);
  const [resolution, setResolution] = useState('4K Ultra HD');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<Wallpaper | null>(null);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const samplePromptIdeas = [
    'Bioluminescent crystal tree surrounded by floating ethereal whales in a violet starfield',
    'Matte black hypercar speeding through glowing quantum light tunnels with red neon trails',
    'Ancient overgrown cyber temple floating in clouds with golden sunbeams',
    'OLED black fluid mercury ripples with iridescent chromatic refraction',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setApplied(false);
    setSaved(false);

    try {
      // Simulate high-fidelity AI generation with rich dynamic synthesis
      await new Promise(res => setTimeout(res, 2200));

      const seedUrl = PRESET_SEEDS[selectedStyle] || PRESET_SEEDS.Cyberpunk;
      const newWallpaper: Wallpaper = {
        id: `ai-gen-${Date.now()}`,
        title: prompt.slice(0, 36) + '...',
        description: `Generated with WALLVY AI Studio • Style: ${selectedStyle} • Mood: ${mood} • Palette: ${colorPref}`,
        file_url: seedUrl,
        thumbnail_url: seedUrl,
        creator_id: 'ai-studio',
        creator_name: 'WALLVY Gemini Studio',
        category: (selectedStyle as any) || 'Abstract',
        resolution: `${resolution} (${aspectRatio === '9:16' ? '2160x3840' : aspectRatio === '16:9' ? '3840x2160' : '2048x2048'})`,
        orientation: aspectRatio === '9:16' ? 'portrait' : 'landscape',
        tags: ['AI Generated', selectedStyle, mood, 'Wallpaper'],
        is_ai_generated: true,
        is_featured: false,
        is_trending: true,
        is_premium: false,
        coin_price: 0,
        status: 'approved',
        download_count: 1,
        view_count: 1,
        likes_count: 0,
        file_size: '5.1 MB',
        created_at: new Date().toISOString(),
      };

      setGeneratedResult(newWallpaper);
      addWallpaper(newWallpaper);
    } catch {
      // ignore
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPreview = () => {
    if (!generatedResult) return;
    setActiveWallpaper(generatedResult);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleSaveToGallery = () => {
    if (!generatedResult) return;
    setSaved(true);
  };

  const handleDownload = () => {
    if (!generatedResult) return;
    const link = document.createElement('a');
    link.href = generatedResult.file_url;
    link.download = `wallvy_ai_${Date.now()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>MODULAR AI ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          AI Wallpaper Creator Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Craft custom 4K wallpapers tailored to your screen. Choose your artistic style, mood, and color palette.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs Panel */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Prompt Box */}
          <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Describe Your Wallpaper
              </label>
              <button
                type="button"
                onClick={() => setPrompt(samplePromptIdeas[Math.floor(Math.random() * samplePromptIdeas.length)])}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Inspire Me</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Cyberpunk samurai overlooking rainy Tokyo with neon pink reflections..."
              className="w-full rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Style Selector */}
          <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Visual Art Style
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStyle(st)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition ${
                    selectedStyle === st
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-md shadow-purple-500/30'
                      : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Resolution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '9:16', label: '9:16 Mobile' },
                  { id: '16:9', label: '16:9 Desktop' },
                  { id: '1:1', label: '1:1 Square' },
                ].map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id as any)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      aspectRatio === ar.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Target Resolution
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="4K Ultra HD" className="bg-[#0b0e26]">4K Ultra HD (3840x2160)</option>
                <option value="2K QHD" className="bg-[#0b0e26]">2K QHD (2560x1440)</option>
                <option value="FHD+ 1080p" className="bg-[#0b0e26]">FHD+ 1080p (2400x1080)</option>
              </select>
            </div>
          </div>

          {/* Mood & Color Pref */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Atmospheric Mood
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
              >
                {MOODS.map(m => (
                  <option key={m} value={m} className="bg-[#0b0e26]">{m}</option>
                ))}
              </select>
            </div>

            <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Color Preference
              </label>
              <select
                value={colorPref}
                onChange={(e) => setColorPref(e.target.value)}
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
              >
                {COLOR_PREFS.map(c => (
                  <option key={c} value={c} className="bg-[#0b0e26]">{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate CTA Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-slate-950 shadow-xl shadow-purple-500/25 hover:opacity-95 transition active:scale-[0.98] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin" />
                <span>Synthesizing 4K Neural Artwork...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Wallpaper</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] rounded-3xl overflow-hidden bg-[#0c0e24] border border-cyan-500/30 p-4 shadow-2xl flex flex-col space-y-4">
            
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">AI Canvas Result</span>
              <span className="text-cyan-400">{selectedStyle}</span>
            </div>

            {/* Generated Image Preview */}
            <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
                  <p className="text-xs text-cyan-300 font-semibold animate-pulse">Rendering layers & lighting...</p>
                </div>
              ) : generatedResult ? (
                <img
                  src={generatedResult.file_url}
                  alt={generatedResult.title}
                  className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                  <ImageIcon className="w-10 h-10 stroke-1" />
                  <p className="text-xs">Your generated artwork will appear here in 4K resolution.</p>
                </div>
              )}
            </div>

            {/* Action Bar when result ready */}
            {generatedResult && !isGenerating && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleApplyPreview}
                    className="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    {applied ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{applied ? 'Preview Set!' : 'Preview on Phone'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Regenerate Variation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
