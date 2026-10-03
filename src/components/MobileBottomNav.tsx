import React from 'react';
import { Home, Compass, Sparkles, Heart, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  favoritesCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigate,
  favoritesCount = 0,
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'ai-studio', label: 'Create', icon: Sparkles, highlight: true },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoritesCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060714]/90 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="relative -top-3 flex flex-col items-center group active:scale-95 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-purple-500/40">
                  <div className="w-full h-full rounded-2xl bg-[#090b20] flex items-center justify-center text-cyan-300 group-hover:bg-transparent group-hover:text-white transition">
                    <Icon className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-cyan-300 mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 py-1.5 flex flex-col items-center justify-center relative active:scale-90 transition-all ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-black leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-3.5 h-0.5 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_8px_#00F0FF]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
