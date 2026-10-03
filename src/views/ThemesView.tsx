import React from 'react';
import { ThemePack } from '../types';
import { ThemeCard } from '../components/ThemeCard';
import { Layers, Sparkles, Crown } from 'lucide-react';

interface ThemesViewProps {
  themes: ThemePack[];
  onRequirePremium: () => void;
  onPreviewTheme: (tp: ThemePack) => void;
}

export const ThemesView: React.FC<ThemesViewProps> = ({
  themes,
  onRequirePremium,
  onPreviewTheme,
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-pink-400" />
          <span>Curated Theme Suites</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete holistic personalization packages syncing matching 4K wallpapers, edge lighting, AOD clock, and alert audio.
        </p>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            onRequirePremium={onRequirePremium}
            onPreview={onPreviewTheme}
          />
        ))}
      </div>
    </div>
  );
};
