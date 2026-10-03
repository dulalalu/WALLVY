import React, { useState } from 'react';
import { EdgePreset, EdgeAnimationType, Wallpaper } from '../types';
import { PhoneMockup } from '../components/PhoneMockup';
import { 
  Zap, Check, RotateCcw, Bookmark, Sliders, 
  Sparkles, Layers, Palette, Eye, ArrowRight 
} from 'lucide-react';
import { 
  getActiveEdgePreset, setActiveEdgePreset, 
  saveEdgePreset, getActiveWallpaper, isUserPremium 
} from '../services/db';

interface EdgeLightingViewProps {
  onRequirePremium: () => void;
  onOpenNotificationsDemo: () => void;
}

const ANIMATION_TYPES: { id: EdgeAnimationType; label: string; desc: string }[] = [
  { id: 'rainbow', label: 'Rainbow', desc: 'Full spectrum dynamic multi-chroma rotation' },
  { id: 'gradient_flow', label: 'Gradient Flow', desc: 'Smooth seamless gradient slide along edges' },
  { id: 'pulse', label: 'Pulse', desc: 'Rhythmic heartbeat luminance pulsation' },
  { id: 'wave', label: 'Wave', desc: 'Continuous traveling energy wave around screen' },
  { id: 'neon', label: 'Neon', desc: 'Ultra-crisp high-intensity laser glow' },
  { id: 'fire', label: 'Fire', desc: 'Blazing embers of molten gold & ruby' },
  { id: 'ocean', label: 'Ocean', desc: 'Calming marine sapphire and turquoise surge' },
  { id: 'aurora', label: 'Aurora', desc: 'Undulating boreal spectral green and violet' },
  { id: 'galaxy', label: 'Galaxy', desc: 'Cosmic stellar purple and interstellar white' },
  { id: 'electric', label: 'Electric', desc: 'High voltage erratic lightning sparks' },
  { id: 'breathing_glow', label: 'Breathing Glow', desc: 'Slow, deep relaxing luminosity cycles' },
  { id: 'multi_color_flow', label: 'Multi-Color Flow', desc: 'Harmonic 5-color continuous blend' },
];

const COLOR_PALETTES = [
  { name: 'WALLVY Signature', colors: ['#00F0FF', '#7000FF', '#FF007A'] },
  { name: 'Cyber Neon', colors: ['#00F0FF', '#FF0055'] },
  { name: 'Aurora Nights', colors: ['#00FF87', '#60EFFF', '#7000FF'] },
  { name: 'Solar Flare', colors: ['#FF1E00', '#FF8500', '#FFEA00'] },
  { name: 'Deep Space', colors: ['#8A2387', '#E94057', '#F27121'] },
  { name: 'Electric Ice', colors: ['#00F2FE', '#4FACFE', '#FFFFFF'] },
  { name: 'Toxic Lime', colors: ['#10B981', '#84CC16', '#FACC15'] },
  { name: 'Rose Gold', colors: ['#F43F5E', '#FB7185', '#FDA4AF'] },
];

export const EdgeLightingView: React.FC<EdgeLightingViewProps> = ({
  onRequirePremium,
  onOpenNotificationsDemo,
}) => {
  const initialPreset = getActiveEdgePreset();
  const currentWallpaper = getActiveWallpaper();

  const [name, setName] = useState(initialPreset.name);
  const [animationType, setAnimationType] = useState<EdgeAnimationType>(initialPreset.animation_type);
  const [colors, setColors] = useState<string[]>(initialPreset.colors);
  const [speed, setSpeed] = useState(initialPreset.speed);
  const [brightness, setBrightness] = useState(initialPreset.brightness);
  const [thickness, setThickness] = useState(initialPreset.thickness);
  const [glow, setGlow] = useState(initialPreset.glow);
  const [cornerRadius, setCornerRadius] = useState(initialPreset.corner_radius || 36);
  const [direction, setDirection] = useState<'clockwise' | 'counter_clockwise' | 'alternate'>(initialPreset.direction || 'clockwise');

  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Active constructed preset for live simulation
  const currentPreset: EdgePreset = {
    id: `custom-${animationType}-${Date.now()}`,
    name,
    description: `Custom ${animationType} preset`,
    colors,
    animation_type: animationType,
    speed,
    brightness,
    thickness,
    glow,
    corner_radius: cornerRadius,
    direction,
    is_premium: false,
  };

  const handleApply = () => {
    setActiveEdgePreset(currentPreset);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleSavePreset = () => {
    saveEdgePreset(currentPreset);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setAnimationType('rainbow');
    setColors(COLOR_PALETTES[0].colors);
    setSpeed(6);
    setBrightness(90);
    setThickness(6);
    setGlow(24);
    setCornerRadius(36);
    setDirection('clockwise');
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-cyan-400 fill-cyan-400/20" />
            <span>Edge Lighting Customizer</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Design fluid animated glowing edges and apply them to your mobile display simulator.
          </p>
        </div>

        <button
          onClick={onOpenNotificationsDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Test Notification Edge Alert</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Realistic Centered Phone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
          <div className="w-full flex items-center justify-between px-4 mb-3">
            <span className="text-xs font-semibold text-slate-400">Live Device Output</span>
            <span className="text-xs text-cyan-400 font-mono capitalize">{animationType} Flow</span>
          </div>

          <PhoneMockup
            wallpaper={currentWallpaper}
            edgePreset={currentPreset}
          />

          {/* Quick Apply / Save Actions directly below mockup */}
          <div className="w-full max-w-[320px] flex items-center gap-2 mt-5">
            <button
              onClick={handleApply}
              className={`flex-1 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-xl ${
                applied
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 hover:opacity-95 shadow-cyan-500/25'
              }`}
            >
              {applied ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              <span>{applied ? 'Applied to App!' : 'Apply Edge Effect'}</span>
            </button>

            <button
              onClick={handleSavePreset}
              className={`p-3.5 rounded-2xl border transition active:scale-95 ${
                saved
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
              }`}
              title="Save Preset"
            >
              {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition active:scale-95"
              title="Reset Settings"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Comprehensive Controls Panel */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Animation Style Grid */}
          <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Animation Style (12 Effects)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ANIMATION_TYPES.map((anim) => (
                <button
                  key={anim.id}
                  onClick={() => setAnimationType(anim.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    animationType === anim.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs block text-white">{anim.label}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{anim.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color Palettes */}
          <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Color Palette & Gradient
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COLOR_PALETTES.map((pal, idx) => (
                <button
                  key={idx}
                  onClick={() => setColors(pal.colors)}
                  className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition space-y-1.5"
                >
                  <div className="h-4 rounded-lg flex overflow-hidden">
                    {pal.colors.map((c, i) => (
                      <div key={i} className="flex-1 h-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 truncate block">
                    {pal.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Color Inputs */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs text-slate-400">Custom Stops:</span>
              <div className="flex items-center gap-2">
                {colors.map((col, idx) => (
                  <input
                    key={idx}
                    type="color"
                    value={col}
                    onChange={(e) => {
                      const updated = [...colors];
                      updated[idx] = e.target.value;
                      setColors(updated);
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3. Dynamics & Geometry Sliders */}
          <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Fine-Tune Sliders
            </label>

            {/* Speed */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Animation Speed</span>
                <span className="text-cyan-400 font-bold font-mono">{speed}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Thickness */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Border Thickness</span>
                <span className="text-cyan-400 font-bold font-mono">{thickness}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="18"
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Glow Intensity */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Glow Intensity</span>
                <span className="text-cyan-400 font-bold font-mono">{glow}px</span>
              </div>
              <input
                type="range"
                min="6"
                max="48"
                value={glow}
                onChange={(e) => setGlow(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Brightness */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Brightness</span>
                <span className="text-cyan-400 font-bold font-mono">{brightness}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Corner Radius */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Display Corner Radius</span>
                <span className="text-cyan-400 font-bold font-mono">{cornerRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                value={cornerRadius}
                onChange={(e) => setCornerRadius(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Direction */}
            <div className="pt-2">
              <label className="text-xs text-slate-400 block mb-1.5">Flow Direction</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'clockwise', label: 'Clockwise' },
                  { id: 'counter_clockwise', label: 'Counter' },
                  { id: 'alternate', label: 'Alternate' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDirection(d.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      direction === d.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
