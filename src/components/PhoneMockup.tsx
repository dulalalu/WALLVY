import React, { useState, useEffect } from 'react';
import { EdgePreset, AODStyle, Wallpaper } from '../types';
import { EdgeLightingCanvas } from './EdgeLightingCanvas';
import { Wifi, Battery, Bell, Sparkles } from 'lucide-react';

interface PhoneMockupProps {
  wallpaper?: Wallpaper | string;
  edgePreset?: EdgePreset;
  aodStyle?: AODStyle;
  isAodMode?: boolean;
  notificationMessage?: string | null;
  className?: string;
  children?: React.ReactNode;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  wallpaper,
  edgePreset,
  aodStyle,
  isAodMode = false,
  notificationMessage = null,
  className = '',
  children,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const wallpaperUrl = typeof wallpaper === 'string' ? wallpaper : wallpaper?.file_url;

  // Format time strings
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className={`relative mx-auto flex items-center justify-center ${className}`}>
      {/* Outer Phone Hardware Chassis (Bezel) */}
      <div className="relative w-[300px] h-[610px] sm:w-[320px] sm:h-[650px] rounded-[52px] bg-[#0c0d16] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,240,255,0.15)] border-4 border-[#282a3c] transition-all">
        
        {/* Hardware side buttons */}
        <div className="absolute -left-[7px] top-[115px] w-[3px] h-[32px] bg-[#3a3e5c] rounded-l-md" />
        <div className="absolute -left-[7px] top-[160px] w-[3px] h-[52px] bg-[#3a3e5c] rounded-l-md" />
        <div className="absolute -right-[7px] top-[140px] w-[3px] h-[56px] bg-[#3a3e5c] rounded-r-md" />

        {/* Inner Screen Display (Curved glass) */}
        <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-black flex flex-col select-none">
          
          {/* Active Edge Lighting Glow */}
          {edgePreset && (
            <EdgeLightingCanvas
              preset={edgePreset}
              isNotificationFlash={!!notificationMessage}
            />
          )}

          {/* Wallpaper Layer (If not in AOD or if AOD allows wallpaper) */}
          {(!isAodMode || aodStyle?.background_wallpaper) && (
            typeof wallpaper === 'object' && wallpaper?.video_url ? (
              <video
                src={wallpaper.video_url}
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isAodMode ? 'opacity-20 filter blur-[2px]' : 'opacity-100'
                }`}
              />
            ) : wallpaperUrl ? (
              <img
                src={wallpaperUrl}
                alt="Wallpaper"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isAodMode ? 'opacity-20 filter blur-[2px]' : 'opacity-100'
                }`}
              />
            ) : null
          )}

          {/* Screen Glare Sheen Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.04] to-transparent pointer-events-none z-10" />

          {/* Top Notch / Punch Hole Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5 border border-white/10 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111322] border border-white/20 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-cyan-400/80 animate-pulse" />
            </div>
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-white/10" />
          </div>

          {/* Status Bar */}
          <div className="relative z-30 pt-3 px-6 flex justify-between items-center text-[11px] font-medium text-white/90">
            <span>{hours}:{minutes}</span>
            <div className="flex items-center gap-1.5 text-white/80">
              <span className="text-[9px] font-bold text-cyan-400">5G</span>
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Main Interactive Screen Content */}
          <div className="relative flex-1 z-20 flex flex-col">
            {isAodMode && aodStyle ? (
              /* AOD (Always-On Display) Screen View */
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                {/* Clock Rendering */}
                {aodStyle.clock_type === 'analog' ? (
                  <div className="relative w-36 h-36 rounded-full border-2 border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,122,0.3)]">
                    {/* Hour Hand */}
                    <div
                      className="absolute w-1 h-10 bg-white rounded-full origin-bottom"
                      style={{
                        transform: `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg) translateY(-50%)`,
                      }}
                    />
                    {/* Minute Hand */}
                    <div
                      className="absolute w-0.5 h-14 bg-cyan-400 rounded-full origin-bottom"
                      style={{
                        transform: `rotate(${time.getMinutes() * 6}deg) translateY(-50%)`,
                      }}
                    />
                    {/* Center Dot */}
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 z-10" />
                  </div>
                ) : aodStyle.clock_type === 'futuristic' ? (
                  <div className="relative flex flex-col items-center">
                    <div className="w-36 h-36 rounded-full border-4 border-dashed border-purple-500/60 flex items-center justify-center animate-spin" style={{ animationDuration: '30s' }}>
                      <div className="w-28 h-28 rounded-full border border-cyan-400/40" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 font-mono tracking-wider">
                        {hours}:{minutes}
                      </span>
                      {aodStyle.show_seconds && (
                        <span className="text-xs text-purple-300 font-mono">:{seconds}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Digital & Minimal Clocks */
                  <div className="flex flex-col items-center">
                    <div
                      className="text-5xl font-black tracking-tight drop-shadow-md"
                      style={{
                        color: aodStyle.color,
                        textShadow: aodStyle.glow ? `0 0 20px ${aodStyle.color}` : 'none',
                      }}
                    >
                      {hours}:{minutes}
                    </div>
                    {aodStyle.show_seconds && (
                      <div className="text-xs font-mono opacity-70 mt-1" style={{ color: aodStyle.color }}>
                        :{seconds}
                      </div>
                    )}
                  </div>
                )}

                {/* Date Display */}
                {aodStyle.show_date && (
                  <div className="text-xs text-slate-400 mt-3 font-medium">
                    {dateStr}
                  </div>
                )}

                {/* Battery Display */}
                {aodStyle.show_battery && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400/90 mt-2">
                    <Battery className="w-3.5 h-3.5" />
                    <span>88% Charged</span>
                  </div>
                )}

                <div className="mt-8 text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  Double tap to wake
                </div>
              </div>
            ) : (
              /* Normal Home Screen / Wallpaper View */
              <div className="flex-1 flex flex-col justify-between p-4">
                {/* Notification Toast Alert if triggered */}
                {notificationMessage && (
                  <div className="animate-in slide-in-from-top-4 duration-300 mx-auto w-full max-w-[250px] p-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-cyan-500/40 text-white shadow-2xl flex items-start gap-2.5 z-40">
                    <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Bell className="w-4 h-4 animate-bounce" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-cyan-300">WALLVY Notification</p>
                      <p className="text-[10px] text-slate-200 truncate">{notificationMessage}</p>
                    </div>
                  </div>
                )}

                {/* Clock on lockscreen/home */}
                <div className="mt-8 text-center">
                  <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    {hours}:{minutes}
                  </h1>
                  <p className="text-xs font-medium text-slate-200 mt-1 drop-shadow">
                    {dateStr}
                  </p>
                </div>

                {children}

                {/* Bottom Home Indicator Bar */}
                <div className="w-28 h-1 bg-white/60 rounded-full mx-auto mb-1" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
