import React from 'react';
import { 
  Home, Image as ImageIcon, Video, Zap, Clock, Music, 
  Layers, Sparkles, Activity, Heart, Folder, User, 
  Settings, Bell, UploadCloud, FileText 
} from 'lucide-react';
import { UserRole } from '../types';
import { BRANDING } from '../config/branding';

interface DesktopSidebarProps {
  activeTab: string;
  onNavigate: (tab: string, filter?: string) => void;
  userRole: UserRole;
  favoritesCount?: number;
  collectionsCount?: number;
  onOpenNotificationsDemo?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onNavigate,
  userRole,
  favoritesCount = 0,
  collectionsCount = 0,
  onOpenNotificationsDemo,
}) => {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallpapers', label: 'Wallpapers', icon: ImageIcon },
    { id: 'video-wallpapers', label: 'Video Wallpapers', icon: Video, badge: '60FPS' },
    { id: 'live-wallpapers', label: 'Live Wallpapers', icon: Sparkles, badge: 'LIVE' },
    { id: 'edge-lighting', label: 'Edge Lighting', icon: Zap, glow: true },
    { id: 'aod', label: 'AOD Clock', icon: Clock },
    { id: 'ringtones', label: 'Ringtones', icon: Music },
    { id: 'themes', label: 'Themes', icon: Layers },
    { id: 'ai-studio', label: 'AI Studio', icon: Sparkles },
    { id: 'visualizer', label: 'Visualizer', icon: Activity },
  ];

  const libraryItems = [
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favoritesCount },
    { id: 'collections', label: 'Collections', icon: Folder, count: collectionsCount },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const creatorItems = [
    { id: 'creator-studio', label: 'Creator Studio', icon: Sparkles },
    { id: 'my-uploads', label: 'My Uploads', icon: UploadCloud },
    { id: 'my-submissions', label: 'My Submissions', icon: FileText },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 lg:w-64 border-r border-white/[0.08] bg-[#070919] p-4 flex-shrink-0 select-none">
      
      {/* Navigation Group: Explore & Personalize */}
      <div className="space-y-1 mb-6">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Personalize
        </div>
        {mainNavItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold text-white ${
                  item.badge === 'LIVE' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Quick Notification Tester Action */}
      {onOpenNotificationsDemo && (
        <div className="mb-6">
          <button
            onClick={onOpenNotificationsDemo}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-400 text-cyan-300 text-xs font-semibold transition shadow-sm"
          >
            <Bell className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Test Edge Lighting</span>
          </button>
        </div>
      )}

      {/* Creator Hub Items (For creators) */}
      {userRole === 'creator' && (
        <div className="space-y-1 mb-6">
          <div className="px-3 pb-2 text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Creator Hub</span>
          </div>
          {creatorItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate('creator-studio')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive || (activeTab === 'creator-studio' && item.id === 'creator-studio')
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-purple-400" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Navigation Group: My Library */}
      <div className="space-y-1 flex-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          My Library
        </div>
        {libraryItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {typeof item.count === 'number' && item.count > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-300">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Version badge */}
      <div className="mt-4 px-3 text-[10px] text-slate-600 flex items-center justify-between">
        <span>WALLVY v{BRANDING.version}</span>
        <span className="text-cyan-500">● Mobile PWA</span>
      </div>
    </aside>
  );
};
