import React from 'react';
import { X, Smartphone, Download, Settings, Play, CheckCircle2, ExternalLink } from 'lucide-react';

interface AndroidSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType?: 'video' | 'live' | 'image' | 'edge';
}

export const AndroidSetupGuideModal: React.FC<AndroidSetupGuideModalProps> = ({
  isOpen,
  onClose,
  contentType = 'video'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c0e24] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Android System Guide</h3>
              <p className="text-xs text-slate-400">How to set video & live wallpapers on your device</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Transparency note */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-cyan-200">Web Browser & Security Note</p>
              <p className="text-slate-300 leading-relaxed">
                Standard web browsers and PWAs cannot directly replace Android system files without your permission. Follow these 3 easy steps to activate it natively:
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  Download the HD / 4K File
                </h4>
                <p className="text-xs text-slate-400">
                  Tap the <strong className="text-white">Download</strong> button in WALLVY to save the high-bitrate video (MP4) or ultra-HD wallpaper into your device's Downloads folder.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-cyan-400" />
                  Open in your Android Gallery
                </h4>
                <p className="text-xs text-slate-400">
                  Open your phone's built-in <strong className="text-white">Gallery / Photos</strong> app (Samsung Gallery, Google Photos, Xiaomi Gallery, etc.) and tap on the downloaded video.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  Set as Lock Screen / Home Wallpaper
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tap the <strong className="text-white">Three Dots (⋮)</strong> or <strong className="text-white">More</strong> &gt; select <strong className="text-cyan-300 font-bold">"Set as Wallpaper"</strong> &gt; choose <strong className="text-white">Lock Screen</strong> or <strong className="text-white">Home Screen</strong>. Your phone will loop the video smoothly!
                </p>
              </div>
            </div>

          </div>

          {/* Device specific tips */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
            <h5 className="font-bold text-white">Device Quick Shortcuts:</h5>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li><strong className="text-slate-200">Samsung One UI:</strong> Gallery &gt; Video &gt; More &gt; Set as wallpaper &gt; Lock screen (supports up to 15s video natively).</li>
              <li><strong className="text-slate-200">Xiaomi MIUI / HyperOS:</strong> Themes &gt; My Profile &gt; Live Wallpapers &gt; Plus (+) icon &gt; Select video.</li>
              <li><strong className="text-slate-200">Google Pixel / Motorola / OnePlus:</strong> Use free companion helper "Video Live Wallpaper" from Google Play Store if standard Photos app doesn't show video lock screen option.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#070919] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
};
