export type UserRole = 'user' | 'creator' | 'admin';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string;
  bio?: string;
  role: UserRole;
  status: 'active' | 'suspended';
  is_verified: boolean;
  coins: number;
  downloads_count?: number;
  favorites_count?: number;
  uploads_count?: number;
  created_at: string;
  updated_at?: string;
}

export type ContentCategory =
  | 'Anime'
  | 'Cars'
  | 'Gaming'
  | 'Nature'
  | 'Space'
  | 'Love'
  | 'Animals'
  | 'Abstract'
  | 'Technology'
  | 'Luxury'
  | 'Minimal'
  | 'Dark'
  | 'Festival'
  | 'Neon'
  | 'Fantasy'
  | 'Cinematic';

export interface Wallpaper {
  id: string;
  title: string;
  description: string;
  file_url: string;
  thumbnail_url: string;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string;
  category: ContentCategory;
  resolution: string; // e.g., '4K Ultra HD (3840x2160)'
  orientation: 'portrait' | 'landscape';
  tags: string[];
  is_ai_generated: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_premium: boolean;
  coin_price: number; // e.g. 0 (free) or 5 coins
  is_live?: boolean;
  video_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  download_count: number;
  view_count: number;
  likes_count: number;
  file_size?: string;
  created_at: string;
}

export interface VideoWallpaper {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  creator_id: string;
  creator_name: string;
  category: ContentCategory;
  duration: number; // in seconds
  resolution: string; // e.g. '4K UHD 60FPS'
  file_size: string; // e.g. '12.4 MB'
  orientation: 'portrait' | 'landscape';
  coin_price: number; // 0 or 10
  is_premium: boolean;
  tags: string[];
  download_count: number;
  likes_count: number;
  created_at: string;
}

export type LiveAnimationType =
  | 'particles'
  | 'aurora'
  | 'galaxy'
  | 'rain'
  | 'snow'
  | 'fire'
  | 'water'
  | 'neon_waves'
  | 'gradient_mesh';

export interface LiveWallpaper {
  id: string;
  title: string;
  description: string;
  animation_type: LiveAnimationType;
  thumbnail_url: string;
  creator_name: string;
  speed: number; // 1-10
  brightness: number; // 30-100
  intensity: number; // 1-10
  sound_enabled: boolean;
  sound_synth?: string;
  coin_price: number;
  is_premium: boolean;
  tags: string[];
  likes_count: number;
  download_count: number;
  created_at: string;
}

export type RingtoneCategory =
  | 'Trending'
  | 'New'
  | 'Popular'
  | 'Love'
  | 'Romantic'
  | 'Gaming'
  | 'Funny'
  | 'Nature'
  | 'Cinematic'
  | 'Electronic'
  | 'Lo-fi'
  | 'Bass'
  | 'Neon'
  | 'Notification'
  | 'Alarm'
  | 'Short Sounds';

export interface Ringtone {
  id: string;
  title: string;
  description: string;
  file_url: string;
  preview_synth_type: string;
  creator_id: string;
  creator_name: string;
  category: RingtoneCategory;
  duration: number; // in seconds
  tags: string[];
  is_featured: boolean;
  is_trending: boolean;
  is_premium: boolean;
  coin_price: number;
  status: 'pending' | 'approved' | 'rejected';
  download_count: number;
  play_count: number;
  likes_count: number;
  created_at: string;
}

export type EdgeAnimationType =
  | 'rainbow'
  | 'gradient_flow'
  | 'pulse'
  | 'wave'
  | 'neon'
  | 'fire'
  | 'ocean'
  | 'aurora'
  | 'galaxy'
  | 'electric'
  | 'breathing_glow'
  | 'multi_color_flow';

export interface EdgePreset {
  id: string;
  name: string;
  description: string;
  colors: string[];
  animation_type: EdgeAnimationType;
  speed: number;
  brightness: number;
  thickness: number;
  glow: number;
  corner_radius: number;
  direction?: 'clockwise' | 'counter_clockwise' | 'alternate';
  is_premium: boolean;
  coin_price?: number;
  created_at?: string;
}

export type ClockType =
  | 'digital'
  | 'analog'
  | 'neon'
  | 'minimal'
  | 'futuristic'
  | 'cyber'
  | 'galaxy'
  | 'luxury'
  | 'classic'
  | 'gradient'
  | '3d'
  | 'matrix'
  | 'glowing';

export interface ClockDesign {
  id: string;
  name: string;
  clock_type: ClockType;
  font: string;
  font_size: number;
  font_weight: string;
  color: string;
  gradient?: string[];
  glow: boolean;
  position: 'center' | 'top' | 'bottom';
  alignment: 'center' | 'left' | 'right';
  show_date: boolean;
  show_seconds: boolean;
  show_battery: boolean;
  is_24h: boolean;
  background_wallpaper?: string;
  coin_price: number;
  is_premium: boolean;
  created_at?: string;
}

// Keep alias for compatibility
export type AODStyle = ClockDesign;

export type FontStylePreset =
  | 'modern'
  | 'bold'
  | 'elegant'
  | 'neon'
  | 'handwritten'
  | 'futuristic'
  | 'gaming'
  | 'luxury'
  | 'minimal'
  | '3d'
  | 'outline'
  | 'glow';

export interface FontDesign {
  id: string;
  title: string;
  text: string;
  font: string;
  style_preset: FontStylePreset;
  font_size: number;
  font_weight: string;
  letter_spacing: number;
  line_spacing: number;
  text_color: string;
  gradient?: string[];
  shadow: boolean;
  glow: boolean;
  outline: boolean;
  alignment: 'center' | 'left' | 'right';
  rotation: number;
  background_wallpaper?: string;
  coin_price: number;
  is_premium: boolean;
  created_at?: string;
}

export interface ThemePack {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  creator_name: string;
  wallpaper: Wallpaper;
  ringtone: Ringtone;
  edge_preset: EdgePreset;
  aod_style: ClockDesign;
  accent_color: string;
  thumbnail_url: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  download_count: number;
  coin_price: number; // e.g. 10
  is_premium: boolean;
  created_at: string;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  item_type: 'wallpaper' | 'video_wallpaper' | 'live_wallpaper' | 'ringtone' | 'theme' | 'clock' | 'font';
  item_id: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string;
  cover_url?: string;
  items: CollectionItem[];
  created_at: string;
}

export interface CreatorUpload {
  id: string;
  creator_id: string;
  creator_name: string;
  content_type: 'wallpaper' | 'video_wallpaper' | 'live_wallpaper' | 'ringtone' | 'theme' | 'clock' | 'font';
  title: string;
  description: string;
  category: string;
  tags: string[];
  file_url: string;
  thumbnail_url?: string;
  coin_price?: number;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  item_type: 'wallpaper' | 'video_wallpaper' | 'live_wallpaper' | 'ringtone' | 'theme' | 'clock' | 'font';
  item_id: string;
  item_title: string;
  reason: 'copyright' | 'inappropriate' | 'spam' | 'misleading' | 'other';
  notes?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

// Coin & Wallet Types
export interface CoinWallet {
  balance: number;
  total_earned: number;
  total_spent: number;
  updated_at: string;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  type: 'credit' | 'debit';
  amount: number;
  balance_after: number;
  reference_type: 'welcome_bonus' | 'purchase' | 'ai_generation' | 'coin_package';
  reference_id?: string;
  description: string;
  status: 'completed' | 'pending';
  created_at: string;
}

export interface PurchaseRecord {
  id: string;
  user_id: string;
  item_type: 'wallpaper' | 'video_wallpaper' | 'live_wallpaper' | 'theme' | 'ringtone' | 'clock' | 'font' | 'ai_creation';
  item_id: string;
  item_title: string;
  thumbnail_url: string;
  coins_spent: number;
  created_at: string;
}

export interface CoinPackage {
  id: string;
  coins: number;
  price: string;
  popular?: boolean;
  bonus?: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'as' | 'es' | 'fr' | 'de' | 'ar';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'edge_demo';
  timestamp: string;
  read: boolean;
}
