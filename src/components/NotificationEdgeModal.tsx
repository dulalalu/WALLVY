import React, { useState } from 'react';
import { PhoneMockup } from './PhoneMockup';
import { EdgePreset } from '../types';
import { X, Bell, Play, Sparkles, Sliders, Info } from 'lucide-react';
import { playNotificationChime } from '../services/audioEngine';

interface NotificationEdgeModalProps {
  onClose: () => void;
}

const NOTIFICATION_PRESETS = [
  { id: 'soft', name: 'Soft Glow', colors: ['#00F0FF', '#3B82F6'], anim: 'breathing_glow', chime: 'soft' },
  { id: 'rainbow', name: 'Rainbow Swirl', colors: ['#FF0055', '#FFEA00', '#00FF66', '#00F0FF', '#7F00FF'], anim: 'rainbow', chime: 'rainbow' },
  { id: 'pulse', name: 'Pulse Alert', colors: ['#FF007A', '#9B00FF'], anim: 'pulse', chime: 'galaxy' },
  { id: 'flash', name: 'Strobe Flash', colors: ['#FFFFFF', '#00F0FF'], anim: 'electric', chime: 'neon' },
  { id: 'wave', name: 'Ocean Wave', colors: ['#00C9FF', '#92FE9D'], anim: 'wave', chime: 'wave' },
  { id: 'neon', name: 'Cyber Neon', colors: ['#00F0FF', '#FF007A'], anim: 'neon', chime: 'neon' },
  { id: 'galaxy', name: 'Stellar Galaxy', colors: ['#8A2387', '#E94057', '#F27121'], anim: 'galaxy', chime: 'galaxy' },
];

export const NotificationEdgeModal: React.FC<NotificationEdgeModalProps> = ({ onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState(NOTIFICATION_PRESETS[0]);
  const [color, setColor] = useState('#00F0FF');
  const [speed, setSpeed] = useState(8);
  const [thickness, setThickness] = useState(8);
  const [brightness, setBrightness] = useState(95);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const triggerTestNotification = () => {
    // Play chime
    playNotificationChime(selectedPreset.chime);
    // Show notification toast and trigger high-brightness edge flash
    setActiveMessage('New message from WALLVY: Edge effect triggered!');
    setTimeout(() => {
      setActiveMessage(null);
    }, 4500);
  };

  const currentEdgePreset: EdgePreset = {
    id: `notif-${selectedPreset.id}`,
    name: selectedPreset.name,
    description: 'Notification simulation preset',
    colors: [color, ...selectedPreset.colors.slice(1)],
    animation_type: selectedPreset.anim as any,
    speed,
    brightness,
    thickness,
    glow: 32,
    corner_radius: 36,
    is_premium: false,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#090b20] border border-cyan-500/30 shadow-[0_0_80px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-white/10 bg-[#0c0e2a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Notification Edge Effects</h2>
              <p className="text-xs text-slate-400">Simulate ambient screen edge lighting on incoming alerts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left Preview */}
          <div className="md:col-span-6 flex flex-col items-center">
            <PhoneMockup
              edgePreset={currentEdgePreset}
              notificationMessage={activeMessage}
            />

            <button
              onClick={triggerTestNotification}
              className="mt-5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 px-6 py-3.5 font-extrabold text-white shadow-lg shadow-cyan-500/30 hover:opacity-95 active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Test Notification</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Notification Style Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {NOTIFICATION_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPreset(p);
                      setColor(p.colors[0]);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                      selectedPreset.id === p.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/30'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: p.colors[0] }}
                    />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Edge Controls */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Primary Accent Color</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Edge Speed</span>
                  <span className="text-cyan-400 font-bold">{speed}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Border Thickness</span>
                  <span className="text-cyan-400 font-bold">{thickness}px</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="16"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Glow Brightness</span>
                  <span className="text-cyan-400 font-bold">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Browser Capability Note */}
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Browser Note:</strong> In-browser Progressive Web Apps can trigger edge animations for in-app events & Web Push notifications with user permission.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
