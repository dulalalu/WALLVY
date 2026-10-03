import React from 'react';
import { Shield, Lock, ExternalLink, ArrowLeft } from 'lucide-react';
import { BRANDING } from '../config/branding';

interface AdminPortalPlaceholderProps {
  onBackHome: () => void;
}

export const AdminPortalPlaceholder: React.FC<AdminPortalPlaceholderProps> = ({ onBackHome }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0b0e24] border border-cyan-500/20 p-8 shadow-2xl text-center space-y-6 overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-cyan-400 shadow-inner">
          <Shield className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Admin Dashboard is available in the separate Admin Portal.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            To protect platform integrity and user privacy, administrative moderation, telemetry, and catalog controls are strictly separated from the public consumer app.
          </p>
        </div>

        {/* Security Info Card */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dedicated Infrastructure</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Authorized administrative staff access management services via the dedicated portal domain:
          </p>
          <div className="p-2.5 rounded-xl bg-black/40 font-mono text-[11px] text-cyan-300 border border-white/5 flex items-center justify-between">
            <span>https://admin.wallvy.app</span>
            <span className="text-[9px] text-slate-500 uppercase font-sans font-bold">Separate App</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onBackHome}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {BRANDING.name} Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
