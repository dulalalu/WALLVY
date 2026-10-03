import React, { useState } from 'react';
import { AODStyle, ClockType } from '../types';
import { PhoneMockup } from '../components/PhoneMockup';
import { 
  Clock, Check, RotateCcw, Bookmark, Sparkles, 
  Info, Sliders, Battery, Calendar, Eye 
} from 'lucide-react';
import { 
  getActiveAODStyle, setActiveAODStyle, saveAODStyle, 
  getActiveWallpaper, getActiveEdgePreset 
} from '../services/db';

const CLOCK_TYPES: { id: ClockType; label: string; desc: string }[] = [
  { id: 'digital', label: 'Digital', desc: 'Bold modern 24/12h digital typography' },
  { id: 'analog', label: 'Analog', desc: 'Precision rotating mechanical watch hands' },
  { id: 'futuristic', label: 'Futuristic', desc: 'Orbital holographic rings & telemetry' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean distraction-free typography' },
  { id: 'neon', label: 'Neon', desc: 'High-contrast vibrant gas tube glow' },
  { id: 'galaxy', label: 'Galaxy', desc: 'Starlight nebulas around time marks' },
  { id: 'cyber', label: 'Cyber', desc: 'Matrix monospace HUD coordinates' },
  { id: 'classic', label: 'Classic', desc: 'Traditional timeless roman numerals' },
  { id: 'gradient', label: 'Gradient', desc: 'Multi-hue chromatic flow through digits' },
];

export const AODView: React.FC = () => {
  const initialStyle = getActiveAODStyle();
  const currentWallpaper = getActiveWallpaper();
  const currentEdge = getActiveEdgePreset();

  const [clockType, setClockType] = useState<ClockType>(initialStyle.clock_type);
  const [color, setColor] = useState(initialStyle.color);
  const [showDate, setShowDate] = useState(initialStyle.show_date);
  const [showSeconds, setShowSeconds] = useState(initialStyle.show_seconds);
  const [showBattery, setShowBattery] = useState(initialStyle.show_battery);
  const [showWallpaper, setShowWallpaper] = useState(Boolean(initialStyle.background_wallpaper));
  const [glow, setGlow] = useState(initialStyle.glow);

  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentAODStyle: AODStyle = {
    id: `aod-${clockType}-${Date.now()}`,
    name: `${clockType.toUpperCase()} Style`,
    clock_type: clockType,
    font: 'system-ui',
    font_size: 56,
    font_weight: '700',
    position: 'center',
    alignment: 'center',
    is_24h: false,
    coin_price: 0,
    color,
    background_wallpaper: showWallpaper ? currentWallpaper.file_url : undefined,
    show_date: showDate,
    show_seconds: showSeconds,
    show_battery: showBattery,
    glow,
    is_premium: false,
  };

  const handleApply = () => {
    setActiveAODStyle(currentAODStyle);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleSave = () => {
    saveAODStyle(currentAODStyle);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Clock className="w-7 h-7 text-purple-400" />
          <span>AOD Clock Simulator</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Simulate Always-On Display clock typography, ambient layouts, and battery widgets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Device Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
          <div className="w-full flex items-center justify-between px-4 mb-3">
            <span className="text-xs font-semibold text-slate-400">AOD Standby Mode</span>
            <span className="text-xs text-purple-400 font-mono capitalize">{clockType} Clock</span>
          </div>

          <PhoneMockup
            wallpaper={showWallpaper ? currentWallpaper : undefined}
            aodStyle={currentAODStyle}
            isAodMode={true}
            edgePreset={currentEdge}
          />

          {/* Quick Apply / Save */}
          <div className="w-full max-w-[320px] flex items-center gap-2 mt-5">
            <button
              onClick={handleApply}
              className={`flex-1 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-xl ${
                applied
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-95 shadow-purple-500/25'
              }`}
            >
              {applied ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              <span>{applied ? 'Applied in Simulator!' : 'Apply AOD Style'}</span>
            </button>

            <button
              onClick={handleSave}
              className={`p-3.5 rounded-2xl border transition active:scale-95 ${
                saved
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
              }`}
              title="Save Style"
            >
              {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Important Browser Architecture Note */}
          <div className="p-4 rounded-3xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white block font-bold">Web PWA Architecture Notice:</strong>
              <p className="text-slate-300">
                This is a high-fidelity browser/PWA Always-On Display simulator. Standard web browsers cannot take over native Android/iOS system hardware lockscreens when the phone display is turned off. Use this screen to test styles, customize themes, and export setups.
              </p>
            </div>
          </div>

          {/* 1. Clock Styles Grid */}
          <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Clock Typo (9 Variations)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CLOCK_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setClockType(type.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    clockType === type.id
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md shadow-purple-500/20'
                      : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs block text-white">{type.label}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color Selection */}
          <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Clock Luminescence Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['#00F0FF', '#FF007A', '#9B00FF', '#00FF87', '#FFEA00', '#FFFFFF', '#FF8500', '#F43F5E'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition border ${
                    color === c ? 'border-white scale-110 shadow-md' : 'border-transparent'
                  }`}
                  style={{ background: c }}
                >
                  {color === c && <Check className="w-4 h-4 text-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Toggles & Widgets */}
          <div className="p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Telemetry & Widgets
            </label>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition">
                <span className="text-xs font-semibold text-slate-200">Show Date & Day of Week</span>
                <input
                  type="checkbox"
                  checked={showDate}
                  onChange={(e) => setShowDate(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition">
                <span className="text-xs font-semibold text-slate-200">Show Running Seconds Counter</span>
                <input
                  type="checkbox"
                  checked={showSeconds}
                  onChange={(e) => setShowSeconds(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition">
                <span className="text-xs font-semibold text-slate-200">Show Battery Widget</span>
                <input
                  type="checkbox"
                  checked={showBattery}
                  onChange={(e) => setShowBattery(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition">
                <span className="text-xs font-semibold text-slate-200">Neon Halation Glow</span>
                <input
                  type="checkbox"
                  checked={glow}
                  onChange={(e) => setGlow(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition">
                <span className="text-xs font-semibold text-slate-200">Dimmed Wallpaper Background</span>
                <input
                  type="checkbox"
                  checked={showWallpaper}
                  onChange={(e) => setShowWallpaper(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
