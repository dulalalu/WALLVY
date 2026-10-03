/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserProfile, Wallpaper, VideoWallpaper, LiveWallpaper, 
  Ringtone, ThemePack, EdgePreset, AODStyle, SupportedLanguage 
} from './types';
import { 
  getUserProfile, getWallpapers, getRingtones, 
  getThemes, getEdgePresets, getAODStyles, getFavorites, 
  getCollections, initDatabase 
} from './services/db';

// Navigation & Layout Components
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DesktopSidebar } from './components/DesktopSidebar';
import { OfflineIndicator } from './components/OfflineIndicator';

// Modals
import { WallpaperModal } from './components/WallpaperModal';
import { VideoWallpaperModal } from './components/VideoWallpaperModal';
import { LiveWallpaperModal } from './components/LiveWallpaperModal';
import { AndroidSetupGuideModal } from './components/AndroidSetupGuideModal';
import { AuthModal } from './components/AuthModal';
import { CoinStoreModal } from './components/CoinStoreModal';
import { NotificationEdgeModal } from './components/NotificationEdgeModal';
import { CreatorUploadModal } from './components/CreatorUploadModal';
import { CollectionModal } from './components/CollectionModal';
import { PremiumModal } from './components/PremiumModal';
import { SearchModal } from './components/SearchModal';
import { ReportModal } from './components/ReportModal';

// Views
import { HomeView } from './views/HomeView';
import { WallpapersView } from './views/WallpapersView';
import { VideoWallpapersView } from './views/VideoWallpapersView';
import { LiveWallpapersView } from './views/LiveWallpapersView';
import { EdgeLightingView } from './views/EdgeLightingView';
import { AODView } from './views/AODView';
import { RingtonesView } from './views/RingtonesView';
import { ThemesView } from './views/ThemesView';
import { AIStudioView } from './views/AIStudioView';
import { VisualizerView } from './views/VisualizerView';
import { FavoritesView } from './views/FavoritesView';
import { CollectionsView } from './views/CollectionsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { CreatorStudioView } from './views/CreatorStudioView';
import { AdminPortalPlaceholder } from './views/AdminPortalPlaceholder';

export default function App() {
  // Initialize storage seeds
  useEffect(() => {
    initDatabase();
  }, []);

  // State
  const [user, setUser] = useState<UserProfile>(() => getUserProfile());
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'home';
  });
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  // Catalogs
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(() => getWallpapers());
  const [ringtones, setRingtones] = useState<Ringtone[]>(() => getRingtones());
  const [themes, setThemes] = useState<ThemePack[]>(() => getThemes());
  const [edgePresets, setEdgePresets] = useState<EdgePreset[]>(() => getEdgePresets());
  const [aodStyles, setAodStyles] = useState<AODStyle[]>(() => getAODStyles());
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [collections, setCollections] = useState(() => getCollections());

  // Active Modals
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null);
  const [previewVideoWallpaper, setPreviewVideoWallpaper] = useState<VideoWallpaper | null>(null);
  const [previewLiveWallpaper, setPreviewLiveWallpaper] = useState<LiveWallpaper | null>(null);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCoinStoreModal, setShowCoinStoreModal] = useState(false);
  const [showNotificationDemo, setShowNotificationDemo] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [collectionModalItem, setCollectionModalItem] = useState<{ item: any; type: any } | null>(null);
  const [reportModalItem, setReportModalItem] = useState<{ id: string; title: string; type: any } | null>(null);

  // Listeners for database changes
  useEffect(() => {
    const handleUserUpdate = (e: any) => setUser(e.detail || getUserProfile());
    const handleWallpapersUpdate = () => setWallpapers(getWallpapers());
    const handleRingtonesUpdate = () => setRingtones(getRingtones());
    const handleThemesUpdate = () => setThemes(getThemes());
    const handleFavsUpdate = (e: any) => setFavorites(e.detail || getFavorites());
    const handleColsUpdate = () => setCollections(getCollections());

    window.addEventListener('wallvy_user_updated', handleUserUpdate);
    window.addEventListener('wallvy_wallpapers_updated', handleWallpapersUpdate);
    window.addEventListener('wallvy_ringtones_updated', handleRingtonesUpdate);
    window.addEventListener('wallvy_themes_updated', handleThemesUpdate);
    window.addEventListener('wallvy_favorites_updated', handleFavsUpdate);
    window.addEventListener('wallvy_collections_updated', handleColsUpdate);

    // Global keyboard shortcut: Cmd+K / Ctrl+K opens search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wallvy_user_updated', handleUserUpdate);
      window.removeEventListener('wallvy_wallpapers_updated', handleWallpapersUpdate);
      window.removeEventListener('wallvy_ringtones_updated', handleRingtonesUpdate);
      window.removeEventListener('wallvy_themes_updated', handleThemesUpdate);
      window.removeEventListener('wallvy_favorites_updated', handleFavsUpdate);
      window.removeEventListener('wallvy_collections_updated', handleColsUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (tab: string, filter?: string) => {
    setActiveTab(tab);
    setCategoryFilter(filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalFavoritesCount = 
    (favorites.wallpapers?.length || 0) + 
    (favorites.video_wallpapers?.length || 0) + 
    (favorites.live_wallpapers?.length || 0) + 
    (favorites.ringtones?.length || 0) + 
    (favorites.themes?.length || 0);

  return (
    <div className="min-h-screen bg-[#060714] text-slate-100 flex flex-col font-sans">
      
      {/* Offline Status Banner */}
      <OfflineIndicator />

      {/* Top Main Navigation Bar (Users & Creators Only) */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenUpload={() => setShowUploadModal(true)}
        onOpenPremium={() => setShowPremiumModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenCoinStore={() => setShowCoinStoreModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        currentLanguage={currentLanguage}
        onChangeLanguage={(l) => setCurrentLanguage(l)}
      />

      {/* Main Body Shell with Desktop Sidebar and Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar (Users & Creators Only, No Admin Link) */}
        <DesktopSidebar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          userRole={user.role}
          favoritesCount={totalFavoritesCount}
          collectionsCount={collections.length}
          onOpenNotificationsDemo={() => setShowNotificationDemo(true)}
        />

        {/* Dynamic Route View Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 pb-24 md:pb-12">
          {activeTab === 'home' && (
            <HomeView
              wallpapers={wallpapers}
              ringtones={ringtones}
              themes={themes}
              edgePresets={edgePresets}
              aodStyles={aodStyles}
              onNavigate={handleNavigate}
              onPreviewWallpaper={(wp) => setPreviewWallpaper(wp)}
              onPreviewVideoWallpaper={(vwp) => setPreviewVideoWallpaper(vwp)}
              onPreviewLiveWallpaper={(lwp) => setPreviewLiveWallpaper(lwp)}
              onPreviewTheme={(tp) => {
                setPreviewWallpaper(tp.wallpaper);
              }}
              onOpenNotificationsDemo={() => setShowNotificationDemo(true)}
              onOpenUpload={() => setShowUploadModal(true)}
              onRequirePremium={() => setShowPremiumModal(true)}
            />
          )}

          {(activeTab === 'wallpapers' || activeTab === 'explore') && (
            <WallpapersView
              wallpapers={wallpapers}
              initialCategory={categoryFilter}
              initialFilter="all"
              onPreview={(wp) => setPreviewWallpaper(wp)}
              onAddToCollection={(wp) => setCollectionModalItem({ item: wp, type: 'wallpaper' })}
              onRequirePremium={() => setShowPremiumModal(true)}
            />
          )}

          {activeTab === 'video-wallpapers' && (
            <VideoWallpapersView
              onPreview={(vwp) => setPreviewVideoWallpaper(vwp)}
              onOpenAndroidGuide={() => setShowAndroidGuide(true)}
              onOpenCoinStore={() => setShowCoinStoreModal(true)}
              onOpenPremium={() => setShowPremiumModal(true)}
            />
          )}

          {activeTab === 'live-wallpapers' && (
            <LiveWallpapersView
              onPreview={(lwp) => setPreviewLiveWallpaper(lwp)}
              onOpenAndroidGuide={() => setShowAndroidGuide(true)}
              onOpenCoinStore={() => setShowCoinStoreModal(true)}
              onOpenPremium={() => setShowPremiumModal(true)}
            />
          )}

          {activeTab === 'edge-lighting' && (
            <EdgeLightingView
              onRequirePremium={() => setShowPremiumModal(true)}
              onOpenNotificationsDemo={() => setShowNotificationDemo(true)}
            />
          )}

          {activeTab === 'aod' && (
            <AODView />
          )}

          {activeTab === 'ringtones' && (
            <RingtonesView
              ringtones={ringtones}
              onRequirePremium={() => setShowPremiumModal(true)}
              onShare={(rt) => {
                if (navigator.share) {
                  navigator.share({ title: rt.title, url: window.location.href }).catch(() => {});
                }
              }}
            />
          )}

          {activeTab === 'themes' && (
            <ThemesView
              themes={themes}
              onRequirePremium={() => setShowPremiumModal(true)}
              onPreviewTheme={(tp) => setPreviewWallpaper(tp.wallpaper)}
            />
          )}

          {activeTab === 'ai-studio' && (
            <AIStudioView
              onPreview={(wp) => setPreviewWallpaper(wp)}
              onRequirePremium={() => setShowPremiumModal(true)}
            />
          )}

          {activeTab === 'visualizer' && (
            <VisualizerView />
          )}

          {activeTab === 'favorites' && (
            <FavoritesView
              wallpapers={wallpapers}
              ringtones={ringtones}
              themes={themes}
              onPreviewWallpaper={(wp) => setPreviewWallpaper(wp)}
              onPreviewTheme={(tp) => setPreviewWallpaper(tp.wallpaper)}
              onNavigate={handleNavigate}
              onRequirePremium={() => setShowPremiumModal(true)}
            />
          )}

          {activeTab === 'collections' && (
            <CollectionsView
              onPreviewWallpaper={(wp) => setPreviewWallpaper(wp)}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              user={user}
              wallpapers={wallpapers}
              onOpenUpload={() => setShowUploadModal(true)}
              onOpenPremium={() => setShowPremiumModal(true)}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'creator-studio' && (
            <CreatorStudioView
              user={user}
              onOpenUpload={() => setShowUploadModal(true)}
              onPreviewWallpaper={(wp) => setPreviewWallpaper(wp)}
            />
          )}

          {activeTab === 'my-uploads' && (
            <CreatorStudioView
              user={user}
              onOpenUpload={() => setShowUploadModal(true)}
              onPreviewWallpaper={(wp) => setPreviewWallpaper(wp)}
            />
          )}

          {activeTab === 'my-submissions' && (
            <CreatorStudioView
              user={user}
              onOpenUpload={() => setShowUploadModal(true)}
              onPreviewWallpaper={(wp) => setPreviewWallpaper(wp)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentLanguage={currentLanguage}
              onChangeLanguage={(l) => setCurrentLanguage(l as any)}
              onOpenPremium={() => setShowPremiumModal(true)}
            />
          )}

          {/* Secure Admin Route Interceptor */}
          {activeTab === 'admin' && (
            <AdminPortalPlaceholder
              onBackHome={() => handleNavigate('home')}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab === 'explore' ? 'wallpapers' : activeTab}
        onNavigate={handleNavigate}
        favoritesCount={totalFavoritesCount}
      />

      {/* Full Wallpaper Device Simulator Modal */}
      {previewWallpaper && (
        <WallpaperModal
          wallpaper={previewWallpaper}
          allWallpapers={wallpapers}
          onClose={() => setPreviewWallpaper(null)}
          onOpenCollection={(wp) => setCollectionModalItem({ item: wp, type: 'wallpaper' })}
          onRequirePremium={() => setShowPremiumModal(true)}
          onSelectRelated={(wp) => setPreviewWallpaper(wp)}
        />
      )}

      {/* Video Wallpaper Player Modal */}
      {previewVideoWallpaper && (
        <VideoWallpaperModal
          wallpaper={previewVideoWallpaper}
          onClose={() => setPreviewVideoWallpaper(null)}
          onAddToCollection={(vwp) => setCollectionModalItem({ item: vwp, type: 'video_wallpaper' })}
          onOpenAndroidGuide={() => setShowAndroidGuide(true)}
          onOpenCoinStore={() => setShowCoinStoreModal(true)}
          onOpenPremium={() => setShowPremiumModal(true)}
        />
      )}

      {/* Live Interactive Wallpaper Modal */}
      {previewLiveWallpaper && (
        <LiveWallpaperModal
          wallpaper={previewLiveWallpaper}
          onClose={() => setPreviewLiveWallpaper(null)}
          onOpenAndroidGuide={() => setShowAndroidGuide(true)}
          onOpenCoinStore={() => setShowCoinStoreModal(true)}
          onOpenPremium={() => setShowPremiumModal(true)}
        />
      )}

      {/* Android Live Wallpaper Setup Guide Modal */}
      <AndroidSetupGuideModal
        isOpen={showAndroidGuide}
        onClose={() => setShowAndroidGuide(false)}
      />

      {/* Authentication Modal with Email OTP & Google */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setUser(getUserProfile())}
      />

      {/* Coin Store & In-App Economy Modal */}
      <CoinStoreModal
        isOpen={showCoinStoreModal}
        onClose={() => setShowCoinStoreModal(false)}
        onOpenPremium={() => setShowPremiumModal(true)}
      />

      {/* Interactive Notification Edge Effect Simulator Modal */}
      {showNotificationDemo && (
        <NotificationEdgeModal
          onClose={() => setShowNotificationDemo(false)}
        />
      )}

      {/* Creator Upload Modal */}
      {showUploadModal && (
        <CreatorUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => setWallpapers(getWallpapers())}
        />
      )}

      {/* Save to Collection Modal */}
      {collectionModalItem && (
        <CollectionModal
          item={collectionModalItem.item}
          itemType={collectionModalItem.type}
          onClose={() => setCollectionModalItem(null)}
        />
      )}

      {/* PRO Membership Modal */}
      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
        />
      )}

      {/* Global Search Modal */}
      {showSearchModal && (
        <SearchModal
          wallpapers={wallpapers}
          ringtones={ringtones}
          themes={themes}
          onClose={() => setShowSearchModal(false)}
          onSelectWallpaper={(wp) => setPreviewWallpaper(wp)}
          onSelectRingtone={() => handleNavigate('ringtones')}
          onSelectTheme={(tp) => setPreviewWallpaper(tp.wallpaper)}
        />
      )}

      {/* Content Moderation Report Modal */}
      {reportModalItem && (
        <ReportModal
          itemId={reportModalItem.id}
          itemTitle={reportModalItem.title}
          itemType={reportModalItem.type}
          onClose={() => setReportModalItem(null)}
        />
      )}
    </div>
  );
}
