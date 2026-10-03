import { 
  Wallpaper, VideoWallpaper, LiveWallpaper, Ringtone, ThemePack, 
  EdgePreset, ClockDesign, FontDesign, AODStyle,
  UserProfile, Collection, CreatorUpload, ContentReport, AppNotification,
  CoinWallet, CoinTransaction, PurchaseRecord, CoinPackage 
} from '../types';
import { 
  SEED_WALLPAPERS, SEED_VIDEO_WALLPAPERS, SEED_LIVE_WALLPAPERS, 
  SEED_RINGTONES, SEED_THEMES, SEED_EDGE_PRESETS, 
  SEED_AOD_STYLES, SEED_CLOCK_DESIGNS, SEED_FONT_DESIGNS, 
  SEED_COIN_PACKAGES 
} from '../data/seedData';
import { generateWavFileBlob } from './audioEngine';

const STORAGE_KEYS = {
  USER: 'wallvy_user',
  FAVORITES: 'wallvy_favorites',
  COLLECTIONS: 'wallvy_collections',
  WALLPAPERS: 'wallvy_wallpapers',
  VIDEO_WALLPAPERS: 'wallvy_video_wallpapers',
  LIVE_WALLPAPERS: 'wallvy_live_wallpapers',
  CLOCK_DESIGNS: 'wallvy_clock_designs',
  FONT_DESIGNS: 'wallvy_font_designs',
  RINGTONES: 'wallvy_ringtones',
  THEMES: 'wallvy_themes',
  EDGE_PRESETS: 'wallvy_edge_presets',
  AOD_STYLES: 'wallvy_aod_styles',
  ACTIVE_EDGE: 'wallvy_active_edge',
  ACTIVE_AOD: 'wallvy_active_aod',
  ACTIVE_WALLPAPER: 'wallvy_active_wallpaper',
  ACTIVE_VIDEO_WALLPAPER: 'wallvy_active_video_wallpaper',
  ACTIVE_LIVE_WALLPAPER: 'wallvy_active_live_wallpaper',
  UPLOADS: 'wallvy_uploads',
  REPORTS: 'wallvy_reports',
  USERS: 'wallvy_all_users',
  NOTIFICATIONS: 'wallvy_notifications',
  IS_PREMIUM: 'wallvy_is_premium',
  LANGUAGE: 'wallvy_language',
  WALLET: 'wallvy_coin_wallet',
  TRANSACTIONS: 'wallvy_transactions',
  PURCHASES: 'wallvy_purchases',
};

// Seed initial state if empty
export function initDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.WALLPAPERS)) {
    localStorage.setItem(STORAGE_KEYS.WALLPAPERS, JSON.stringify(SEED_WALLPAPERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VIDEO_WALLPAPERS)) {
    localStorage.setItem(STORAGE_KEYS.VIDEO_WALLPAPERS, JSON.stringify(SEED_VIDEO_WALLPAPERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LIVE_WALLPAPERS)) {
    localStorage.setItem(STORAGE_KEYS.LIVE_WALLPAPERS, JSON.stringify(SEED_LIVE_WALLPAPERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLOCK_DESIGNS)) {
    localStorage.setItem(STORAGE_KEYS.CLOCK_DESIGNS, JSON.stringify(SEED_CLOCK_DESIGNS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FONT_DESIGNS)) {
    localStorage.setItem(STORAGE_KEYS.FONT_DESIGNS, JSON.stringify(SEED_FONT_DESIGNS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RINGTONES)) {
    localStorage.setItem(STORAGE_KEYS.RINGTONES, JSON.stringify(SEED_RINGTONES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.THEMES)) {
    localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(SEED_THEMES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EDGE_PRESETS)) {
    localStorage.setItem(STORAGE_KEYS.EDGE_PRESETS, JSON.stringify(SEED_EDGE_PRESETS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AOD_STYLES)) {
    localStorage.setItem(STORAGE_KEYS.AOD_STYLES, JSON.stringify(SEED_AOD_STYLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_EDGE)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_EDGE, JSON.stringify(SEED_EDGE_PRESETS[1])); // Neon cyber
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_AOD)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_AOD, JSON.stringify(SEED_AOD_STYLES[0])); // Cyber digital
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_WALLPAPER)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WALLPAPER, JSON.stringify(SEED_WALLPAPERS[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WALLET)) {
    const defaultWallet: CoinWallet = {
      balance: 100, // 100 Free starter coins!
      total_earned: 100,
      total_spent: 0,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(defaultWallet));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    const welcomeTx: CoinTransaction = {
      id: 'tx-welcome',
      user_id: 'usr-1',
      type: 'credit',
      amount: 100,
      balance_after: 100,
      reference_type: 'welcome_bonus',
      description: 'Welcome Bonus for joining WALLVY!',
      status: 'completed',
      created_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([welcomeTx]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PURCHASES)) {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    const defaultUser: UserProfile = {
      id: 'usr-1',
      user_id: 'usr-1',
      username: 'neon_dreamer',
      display_name: 'Alex Rivera',
      email: 'alex@wallvy.app',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Screen customization enthusiast & cyberpunk lover.',
      role: 'user',
      status: 'active',
      is_verified: true,
      coins: 100,
      downloads_count: 42,
      favorites_count: 18,
      uploads_count: 3,
      created_at: '2026-08-15T00:00:00Z',
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COLLECTIONS)) {
    const defaultCollections: Collection[] = [
      {
        id: 'col-1',
        user_id: 'usr-1',
        name: 'Cyberpunk Vibes',
        description: 'Vibrant neon cityscapes and pulsating synth tones.',
        cover_url: SEED_WALLPAPERS[0].thumbnail_url,
        created_at: '2026-09-01T00:00:00Z',
        items: [
          {
            id: 'ci-1',
            collection_id: 'col-1',
            item_type: 'wallpaper',
            item_id: SEED_WALLPAPERS[0].id,
            title: SEED_WALLPAPERS[0].title,
            thumbnail_url: SEED_WALLPAPERS[0].thumbnail_url,
            created_at: '2026-09-01T00:00:00Z',
          },
          {
            id: 'ci-2',
            collection_id: 'col-1',
            item_type: 'ringtone',
            item_id: SEED_RINGTONES[0].id,
            title: SEED_RINGTONES[0].title,
            thumbnail_url: '/logo.png',
            created_at: '2026-09-01T00:00:00Z',
          }
        ]
      }
    ];
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(defaultCollections));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify({
      wallpapers: [SEED_WALLPAPERS[0].id, SEED_WALLPAPERS[1].id],
      video_wallpapers: [SEED_VIDEO_WALLPAPERS[0].id],
      live_wallpapers: [SEED_LIVE_WALLPAPERS[0].id],
      ringtones: [SEED_RINGTONES[0].id],
      themes: [SEED_THEMES[0].id],
      clocks: [],
      fonts: []
    }));
  }
  if (!localStorage.getItem(STORAGE_KEYS.UPLOADS)) {
    const seedUploads: CreatorUpload[] = [
      {
        id: 'up-1',
        creator_id: 'usr-1',
        creator_name: 'Alex Rivera',
        content_type: 'wallpaper',
        title: 'Solar Flare Horizon',
        description: 'Atmospheric sunset over neon mountain ridges.',
        category: 'Nature',
        tags: ['Sunset', 'Neon', 'Mountains'],
        file_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        status: 'pending',
        created_at: '2026-10-01T08:30:00Z',
      }
    ];
    localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify(seedUploads));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    const seedReports: ContentReport[] = [
      {
        id: 'rep-1',
        reporter_id: 'usr-anon',
        reporter_name: 'User 8821',
        item_type: 'wallpaper',
        item_id: SEED_WALLPAPERS[2].id,
        item_title: SEED_WALLPAPERS[2].title,
        reason: 'copyright',
        notes: 'Check vehicle logo licensing.',
        status: 'pending',
        created_at: '2026-10-01T14:20:00Z',
      }
    ];
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(seedReports));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const initialUsers: UserProfile[] = [
      {
        id: 'usr-1',
        user_id: 'usr-1',
        username: 'neon_dreamer',
        display_name: 'Alex Rivera',
        email: 'alex@wallvy.app',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        bio: 'Screen customization enthusiast & cyberpunk lover.',
        role: 'user',
        status: 'active',
        is_verified: true,
        coins: 100,
        downloads_count: 42,
        favorites_count: 18,
        uploads_count: 3,
        created_at: '2026-08-15T00:00:00Z',
      },
      {
        id: 'usr-kai',
        user_id: 'usr-kai',
        username: 'kai_tokyo',
        display_name: 'Kai Takahashi',
        email: 'kai@wallvy.app',
        avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
        bio: '3D Artist & Motion Designer in Tokyo.',
        role: 'creator',
        status: 'active',
        is_verified: true,
        coins: 450,
        downloads_count: 120,
        favorites_count: 45,
        uploads_count: 24,
        created_at: '2026-07-10T00:00:00Z',
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
}

// User Profile
export function getUserProfile(): UserProfile {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  const profile: UserProfile = raw ? JSON.parse(raw) : {
    id: 'usr-1',
    user_id: 'usr-1',
    username: 'neon_dreamer',
    display_name: 'Alex Rivera',
    email: 'alex@wallvy.app',
    avatar_url: '/logo.png',
    role: 'creator',
    status: 'active',
    is_verified: true,
    coins: 100,
    created_at: new Date().toISOString(),
  };

  // Main user app never operates with admin privileges
  if (profile.role === 'admin') {
    profile.role = 'creator';
  }

  // Sync wallet balance
  const wallet = getWallet();
  profile.coins = wallet.balance;

  return profile;
}

export function updateUserProfile(updates: Partial<Omit<UserProfile, 'role'>>) {
  const current = getUserProfile();
  const { role, ...allowedUpdates } = updates as any;
  const user = { ...current, ...allowedUpdates };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('wallvy_user_updated', { detail: user }));
  return user;
}

// Premium Subscription State
export function isUserPremium(): boolean {
  return localStorage.getItem(STORAGE_KEYS.IS_PREMIUM) === 'true';
}

export function setPremiumStatus(isPremium: boolean) {
  localStorage.setItem(STORAGE_KEYS.IS_PREMIUM, isPremium ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('wallvy_premium_updated', { detail: isPremium }));
}

// Coins & Wallet In-App Economy
export function getWallet(): CoinWallet {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.WALLET);
  return raw ? JSON.parse(raw) : { balance: 100, total_earned: 100, total_spent: 0, updated_at: new Date().toISOString() };
}

export function addCoins(amount: number, description: string, referenceType: CoinTransaction['reference_type'] = 'coin_package', referenceId?: string): CoinWallet {
  const wallet = getWallet();
  wallet.balance += amount;
  wallet.total_earned += amount;
  wallet.updated_at = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));

  const tx: CoinTransaction = {
    id: `tx-${Date.now()}`,
    user_id: getUserProfile().id,
    type: 'credit',
    amount,
    balance_after: wallet.balance,
    reference_type: referenceType,
    reference_id: referenceId,
    description,
    status: 'completed',
    created_at: new Date().toISOString()
  };

  const txs = getTransactions();
  txs.unshift(tx);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));

  window.dispatchEvent(new CustomEvent('wallvy_wallet_updated', { detail: wallet }));
  window.dispatchEvent(new CustomEvent('wallvy_user_updated', { detail: getUserProfile() }));
  return wallet;
}

export function spendCoins(amount: number, description: string, referenceType: CoinTransaction['reference_type'] = 'purchase', referenceId?: string): boolean {
  const wallet = getWallet();
  if (wallet.balance < amount) return false;

  wallet.balance -= amount;
  wallet.total_spent += amount;
  wallet.updated_at = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));

  const tx: CoinTransaction = {
    id: `tx-${Date.now()}`,
    user_id: getUserProfile().id,
    type: 'debit',
    amount,
    balance_after: wallet.balance,
    reference_type: referenceType,
    reference_id: referenceId,
    description,
    status: 'completed',
    created_at: new Date().toISOString()
  };

  const txs = getTransactions();
  txs.unshift(tx);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));

  window.dispatchEvent(new CustomEvent('wallvy_wallet_updated', { detail: wallet }));
  window.dispatchEvent(new CustomEvent('wallvy_user_updated', { detail: getUserProfile() }));
  return true;
}

export function getTransactions(): CoinTransaction[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return raw ? JSON.parse(raw) : [];
}

export function getPurchases(): PurchaseRecord[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
  return raw ? JSON.parse(raw) : [];
}

export function hasPurchased(itemType: string, itemId: string): boolean {
  if (isUserPremium()) return true;
  const purchases = getPurchases();
  return purchases.some(p => p.item_id === itemId);
}

export function purchaseItem(
  itemType: PurchaseRecord['item_type'], 
  itemId: string, 
  itemTitle: string, 
  thumbnailUrl: string, 
  coinsPrice: number
): { success: boolean; message: string } {
  if (hasPurchased(itemType, itemId)) {
    return { success: true, message: 'You already own this item!' };
  }

  if (coinsPrice === 0 || isUserPremium()) {
    recordPurchase(itemType, itemId, itemTitle, thumbnailUrl, 0);
    return { success: true, message: 'Unlocked successfully!' };
  }

  const success = spendCoins(coinsPrice, `Purchased ${itemTitle}`, 'purchase', itemId);
  if (!success) {
    return { success: false, message: `Insufficient coins. You need ${coinsPrice} coins.` };
  }

  recordPurchase(itemType, itemId, itemTitle, thumbnailUrl, coinsPrice);
  return { success: true, message: `Unlocked ${itemTitle} for ${coinsPrice} coins!` };
}

function recordPurchase(itemType: PurchaseRecord['item_type'], itemId: string, itemTitle: string, thumbnailUrl: string, coinsSpent: number) {
  const purchases = getPurchases();
  const newRecord: PurchaseRecord = {
    id: `pch-${Date.now()}`,
    user_id: getUserProfile().id,
    item_type: itemType,
    item_id: itemId,
    item_title: itemTitle,
    thumbnail_url: thumbnailUrl,
    coins_spent: coinsSpent,
    created_at: new Date().toISOString()
  };
  purchases.unshift(newRecord);
  localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  window.dispatchEvent(new CustomEvent('wallvy_purchases_updated', { detail: purchases }));
}

// Active Customization State
export function getActiveEdgePreset(): EdgePreset {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_EDGE);
  return raw ? JSON.parse(raw) : SEED_EDGE_PRESETS[1];
}

export function setActiveEdgePreset(preset: EdgePreset) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_EDGE, JSON.stringify(preset));
  window.dispatchEvent(new CustomEvent('wallvy_edge_changed', { detail: preset }));
}

export function getActiveAODStyle(): AODStyle {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_AOD);
  return raw ? JSON.parse(raw) : SEED_AOD_STYLES[0];
}

export function setActiveAODStyle(style: AODStyle) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_AOD, JSON.stringify(style));
  window.dispatchEvent(new CustomEvent('wallvy_aod_changed', { detail: style }));
}

export function getActiveWallpaper(): Wallpaper {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_WALLPAPER);
  return raw ? JSON.parse(raw) : SEED_WALLPAPERS[0];
}

export function setActiveWallpaper(wp: Wallpaper) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_WALLPAPER, JSON.stringify(wp));
  window.dispatchEvent(new CustomEvent('wallvy_wallpaper_changed', { detail: wp }));
}

// Wallpapers
export function getWallpapers(): Wallpaper[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.WALLPAPERS);
  return raw ? JSON.parse(raw) : SEED_WALLPAPERS;
}

export function getWallpaperById(id: string): Wallpaper | undefined {
  return getWallpapers().find(w => w.id === id);
}

export function addWallpaper(wp: Wallpaper) {
  const list = [wp, ...getWallpapers()];
  localStorage.setItem(STORAGE_KEYS.WALLPAPERS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_wallpapers_updated'));
}

export function updateWallpaper(id: string, updates: Partial<Wallpaper>) {
  const list = getWallpapers().map(w => w.id === id ? { ...w, ...updates } : w);
  localStorage.setItem(STORAGE_KEYS.WALLPAPERS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_wallpapers_updated'));
}

export function deleteWallpaper(id: string) {
  const list = getWallpapers().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WALLPAPERS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_wallpapers_updated'));
}

// Video Wallpapers
export function getVideoWallpapers(): VideoWallpaper[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.VIDEO_WALLPAPERS);
  return raw ? JSON.parse(raw) : SEED_VIDEO_WALLPAPERS;
}

export function getVideoWallpaperById(id: string): VideoWallpaper | undefined {
  return getVideoWallpapers().find(v => v.id === id);
}

export function addVideoWallpaper(vwp: VideoWallpaper) {
  const list = [vwp, ...getVideoWallpapers()];
  localStorage.setItem(STORAGE_KEYS.VIDEO_WALLPAPERS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_video_wallpapers_updated'));
}

// Live Wallpapers
export function getLiveWallpapers(): LiveWallpaper[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.LIVE_WALLPAPERS);
  return raw ? JSON.parse(raw) : SEED_LIVE_WALLPAPERS;
}

export function getLiveWallpaperById(id: string): LiveWallpaper | undefined {
  return getLiveWallpapers().find(l => l.id === id);
}

export function updateLiveWallpaper(id: string, updates: Partial<LiveWallpaper>) {
  const list = getLiveWallpapers().map(l => l.id === id ? { ...l, ...updates } : l);
  localStorage.setItem(STORAGE_KEYS.LIVE_WALLPAPERS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_live_wallpapers_updated'));
}

// Clock Designs
export function getClockDesigns(): ClockDesign[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.CLOCK_DESIGNS);
  return raw ? JSON.parse(raw) : SEED_CLOCK_DESIGNS;
}

export function saveClockDesign(clock: ClockDesign) {
  const list = getClockDesigns();
  const idx = list.findIndex(c => c.id === clock.id);
  if (idx >= 0) {
    list[idx] = clock;
  } else {
    list.unshift(clock);
  }
  localStorage.setItem(STORAGE_KEYS.CLOCK_DESIGNS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_clocks_updated'));
}

// Font Designs
export function getFontDesigns(): FontDesign[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.FONT_DESIGNS);
  return raw ? JSON.parse(raw) : SEED_FONT_DESIGNS;
}

export function saveFontDesign(font: FontDesign) {
  const list = getFontDesigns();
  const idx = list.findIndex(f => f.id === font.id);
  if (idx >= 0) {
    list[idx] = font;
  } else {
    list.unshift(font);
  }
  localStorage.setItem(STORAGE_KEYS.FONT_DESIGNS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_fonts_updated'));
}

// Ringtones
export function getRingtones(): Ringtone[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.RINGTONES);
  return raw ? JSON.parse(raw) : SEED_RINGTONES;
}

export function getRingtoneById(id: string): Ringtone | undefined {
  return getRingtones().find(r => r.id === id);
}

export function addRingtone(rt: Ringtone) {
  const list = [rt, ...getRingtones()];
  localStorage.setItem(STORAGE_KEYS.RINGTONES, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_ringtones_updated'));
}

export function updateRingtone(id: string, updates: Partial<Ringtone>) {
  const list = getRingtones().map(r => r.id === id ? { ...r, ...updates } : r);
  localStorage.setItem(STORAGE_KEYS.RINGTONES, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_ringtones_updated'));
}

export function deleteRingtone(id: string) {
  const list = getRingtones().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RINGTONES, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_ringtones_updated'));
}

// Themes
export function getThemes(): ThemePack[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.THEMES);
  return raw ? JSON.parse(raw) : SEED_THEMES;
}

export function getThemeById(id: string): ThemePack | undefined {
  return getThemes().find(t => t.id === id);
}

export function addTheme(tp: ThemePack) {
  const list = [tp, ...getThemes()];
  localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_themes_updated'));
}

// Edge Presets
export function getEdgePresets(): EdgePreset[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.EDGE_PRESETS);
  return raw ? JSON.parse(raw) : SEED_EDGE_PRESETS;
}

export function saveEdgePreset(preset: EdgePreset) {
  const list = getEdgePresets();
  const existingIdx = list.findIndex(p => p.id === preset.id);
  if (existingIdx >= 0) {
    list[existingIdx] = preset;
  } else {
    list.unshift(preset);
  }
  localStorage.setItem(STORAGE_KEYS.EDGE_PRESETS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_presets_updated'));
}

// AOD Styles
export function getAODStyles(): AODStyle[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.AOD_STYLES);
  return raw ? JSON.parse(raw) : SEED_AOD_STYLES;
}

export function saveAODStyle(style: AODStyle) {
  const list = getAODStyles();
  const existingIdx = list.findIndex(s => s.id === style.id);
  if (existingIdx >= 0) {
    list[existingIdx] = style;
  } else {
    list.unshift(style);
  }
  localStorage.setItem(STORAGE_KEYS.AOD_STYLES, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wallvy_aod_styles_updated'));
}

// Favorites Store
export interface FavoritesStore {
  wallpapers: string[];
  video_wallpapers?: string[];
  live_wallpapers?: string[];
  ringtones: string[];
  themes: string[];
  clocks?: string[];
  fonts?: string[];
}

export function getFavorites(): FavoritesStore {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return raw ? JSON.parse(raw) : { wallpapers: [], video_wallpapers: [], live_wallpapers: [], ringtones: [], themes: [], clocks: [], fonts: [] };
}

export function toggleFavorite(type: 'wallpaper' | 'video_wallpaper' | 'live_wallpaper' | 'ringtone' | 'theme' | 'clock' | 'font', id: string): boolean {
  const favs = getFavorites();
  const keyMap: Record<string, keyof FavoritesStore> = {
    wallpaper: 'wallpapers',
    video_wallpaper: 'video_wallpapers',
    live_wallpaper: 'live_wallpapers',
    ringtone: 'ringtones',
    theme: 'themes',
    clock: 'clocks',
    font: 'fonts'
  };
  const key = keyMap[type] || 'wallpapers';
  if (!favs[key]) {
    (favs as any)[key] = [];
  }
  const list = (favs as any)[key] as string[];
  const exists = list.includes(id);

  if (exists) {
    (favs as any)[key] = list.filter(item => item !== id);
  } else {
    list.push(id);
  }

  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
  window.dispatchEvent(new CustomEvent('wallvy_favorites_updated', { detail: favs }));
  return !exists;
}

export function isFavorite(type: 'wallpaper' | 'video_wallpaper' | 'live_wallpaper' | 'ringtone' | 'theme' | 'clock' | 'font', id: string): boolean {
  const favs = getFavorites();
  const keyMap: Record<string, keyof FavoritesStore> = {
    wallpaper: 'wallpapers',
    video_wallpaper: 'video_wallpapers',
    live_wallpaper: 'live_wallpapers',
    ringtone: 'ringtones',
    theme: 'themes',
    clock: 'clocks',
    font: 'fonts'
  };
  const key = keyMap[type] || 'wallpapers';
  return (favs as any)[key]?.includes(id) ?? false;
}

// Collections
export function getCollections(): Collection[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
  return raw ? JSON.parse(raw) : [];
}

export function createCollection(name: string, description: string, cover_url?: string): Collection {
  const collections = getCollections();
  const newCol: Collection = {
    id: `col-${Date.now()}`,
    user_id: getUserProfile().id,
    name,
    description,
    cover_url: cover_url || '/logo.png',
    items: [],
    created_at: new Date().toISOString(),
  };
  collections.unshift(newCol);
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  window.dispatchEvent(new CustomEvent('wallvy_collections_updated'));
  return newCol;
}

export function renameCollection(id: string, name: string, description: string) {
  const collections = getCollections().map(c => c.id === id ? { ...c, name, description } : c);
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  window.dispatchEvent(new CustomEvent('wallvy_collections_updated'));
}

export function deleteCollection(id: string) {
  const collections = getCollections().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  window.dispatchEvent(new CustomEvent('wallvy_collections_updated'));
}

export function addItemToCollection(collectionId: string, itemType: any, itemId: string, title: string, thumbnailUrl: string) {
  const collections = getCollections();
  const col = collections.find(c => c.id === collectionId);
  if (!col) return false;

  const exists = col.items.some(i => i.item_id === itemId);
  if (!exists) {
    col.items.push({
      id: `ci-${Date.now()}`,
      collection_id: collectionId,
      item_type: itemType,
      item_id: itemId,
      title,
      thumbnail_url: thumbnailUrl,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    window.dispatchEvent(new CustomEvent('wallvy_collections_updated'));
  }
  return true;
}

export function removeItemFromCollection(collectionId: string, itemId: string) {
  const collections = getCollections();
  const col = collections.find(c => c.id === collectionId);
  if (col) {
    col.items = col.items.filter(i => i.item_id !== itemId);
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    window.dispatchEvent(new CustomEvent('wallvy_collections_updated'));
  }
}

// Creator Uploads & Moderation
export function getCreatorUploads(): CreatorUpload[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.UPLOADS);
  return raw ? JSON.parse(raw) : [];
}

export function submitCreatorUpload(upload: Omit<CreatorUpload, 'id' | 'status' | 'created_at'>): CreatorUpload {
  const uploads = getCreatorUploads();
  const newUpload: CreatorUpload = {
    ...upload,
    id: `up-${Date.now()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  uploads.unshift(newUpload);
  localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify(uploads));
  window.dispatchEvent(new CustomEvent('wallvy_uploads_updated'));
  return newUpload;
}

// Content Reports
export function getReports(): ContentReport[] {
  initDatabase();
  const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
  return raw ? JSON.parse(raw) : [];
}

export function submitReport(report: Omit<ContentReport, 'id' | 'status' | 'created_at'>): ContentReport {
  const reports = getReports();
  const newReport: ContentReport = {
    ...report,
    id: `rep-${Date.now()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  reports.unshift(newReport);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  window.dispatchEvent(new CustomEvent('wallvy_reports_updated'));
  return newReport;
}

// Download Handler
export async function downloadContent(type: 'wallpaper' | 'video_wallpaper' | 'live_wallpaper' | 'ringtone' | 'theme', item: any) {
  if (type === 'wallpaper') {
    updateWallpaper(item.id, { download_count: (item.download_count || 0) + 1 });
    const link = document.createElement('a');
    link.href = item.file_url;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, '_')}_4k.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (type === 'video_wallpaper') {
    const list = getVideoWallpapers().map(v => v.id === item.id ? { ...v, download_count: (v.download_count || 0) + 1 } : v);
    localStorage.setItem(STORAGE_KEYS.VIDEO_WALLPAPERS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('wallvy_video_wallpapers_updated'));
    const link = document.createElement('a');
    link.href = item.video_url;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, '_')}_4k.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (type === 'live_wallpaper') {
    const list = getLiveWallpapers().map(l => l.id === item.id ? { ...l, download_count: (l.download_count || 0) + 1 } : l);
    localStorage.setItem(STORAGE_KEYS.LIVE_WALLPAPERS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('wallvy_live_wallpapers_updated'));
    // Generate JSON config and preset export
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, '_')}_live_preset.wallvy`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } else if (type === 'ringtone') {
    updateRingtone(item.id, { download_count: (item.download_count || 0) + 1 });
    const blob = generateWavFileBlob(item.preview_synth_type || 'cyberpunk', 12);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.toLowerCase().replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } else if (type === 'theme') {
    if (item.wallpaper) downloadContent('wallpaper', item.wallpaper);
    if (item.ringtone) setTimeout(() => downloadContent('ringtone', item.ringtone), 500);
  }

  // Update user profile download count
  const user = getUserProfile();
  user.downloads_count = (user.downloads_count || 0) + 1;
  updateUserProfile(user);
}
