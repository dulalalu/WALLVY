-- =========================================================================
-- WALLVY - PRODUCTION SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY
-- "Make Your Screen Yours."
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER ROLES ENUM
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'creator', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_item_type AS ENUM ('wallpaper', 'ringtone', 'theme');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'user'::user_role,
    status TEXT DEFAULT 'active',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type content_item_type NOT NULL,
    icon TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. EDGE PRESETS TABLE
CREATE TABLE IF NOT EXISTS public.edge_presets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    colors TEXT[] NOT NULL,
    animation_type TEXT NOT NULL,
    speed INT DEFAULT 6,
    brightness INT DEFAULT 90,
    thickness INT DEFAULT 6,
    glow INT DEFAULT 24,
    corner_radius INT DEFAULT 36,
    direction TEXT DEFAULT 'clockwise',
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. AOD STYLES TABLE
CREATE TABLE IF NOT EXISTS public.aod_styles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    clock_type TEXT NOT NULL,
    font TEXT DEFAULT 'system-ui',
    color TEXT DEFAULT '#00F0FF',
    background_wallpaper TEXT,
    show_date BOOLEAN DEFAULT true,
    show_seconds BOOLEAN DEFAULT true,
    show_battery BOOLEAN DEFAULT true,
    glow BOOLEAN DEFAULT true,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. WALLPAPERS TABLE
CREATE TABLE IF NOT EXISTS public.wallpapers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT,
    resolution TEXT DEFAULT '4K UHD (3840x2160)',
    orientation TEXT DEFAULT 'portrait',
    tags TEXT[] DEFAULT '{}',
    is_ai_generated BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    status moderation_status DEFAULT 'pending'::moderation_status,
    download_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. RINGTONES TABLE
CREATE TABLE IF NOT EXISTS public.ringtones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    duration INT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    status moderation_status DEFAULT 'pending'::moderation_status,
    download_count INT DEFAULT 0,
    play_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. THEMES TABLE
CREATE TABLE IF NOT EXISTS public.themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    wallpaper_id UUID REFERENCES public.wallpapers(id) ON DELETE CASCADE,
    ringtone_id UUID REFERENCES public.ringtones(id) ON DELETE SET NULL,
    edge_preset_id UUID REFERENCES public.edge_presets(id) ON DELETE SET NULL,
    aod_style_id UUID REFERENCES public.aod_styles(id) ON DELETE SET NULL,
    accent_color TEXT DEFAULT '#00F0FF',
    thumbnail_url TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    is_premium BOOLEAN DEFAULT false,
    status moderation_status DEFAULT 'pending'::moderation_status,
    download_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type content_item_type NOT NULL,
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_type, item_id)
);

-- 10. COLLECTIONS & ITEMS
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    item_type content_item_type NOT NULL,
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(collection_id, item_type, item_id)
);

-- 11. CREATOR UPLOADS (MODERATION TRACKING)
CREATE TABLE IF NOT EXISTS public.creator_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content_type content_item_type NOT NULL,
    content_id UUID,
    status moderation_status DEFAULT 'pending'::moderation_status,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. DOWNLOADS TRACKING
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    item_type content_item_type NOT NULL,
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. CONTENT REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    item_type content_item_type NOT NULL,
    item_id UUID NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. SUBSCRIPTIONS (STRIPE / RAZORPAY COMPLIANT)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    provider TEXT DEFAULT 'stripe',
    provider_customer_id TEXT,
    started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. AI GENERATIONS
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    style TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL,
    result_url TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ringtones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public can read, user can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Wallpapers: Anyone can view approved wallpapers
CREATE POLICY "Public can view approved wallpapers" ON public.wallpapers FOR SELECT USING (status = 'approved' OR public.is_admin());
CREATE POLICY "Creators can insert pending wallpapers" ON public.wallpapers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage all wallpapers" ON public.wallpapers FOR ALL USING (public.is_admin());

-- Ringtones & Themes: Similar public read on approved
CREATE POLICY "Public can view approved ringtones" ON public.ringtones FOR SELECT USING (status = 'approved' OR public.is_admin());
CREATE POLICY "Public can view approved themes" ON public.themes FOR SELECT USING (status = 'approved' OR public.is_admin());

-- Favorites & Collections: User can only read and modify their own
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own collections" ON public.collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own collections" ON public.collections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own collection items" ON public.collection_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.collections WHERE id = collection_items.collection_id AND user_id = auth.uid())
);

-- Creator uploads: Creators can view own, admins can view and update all
CREATE POLICY "Creators can view own uploads" ON public.creator_uploads FOR SELECT USING (auth.uid() = creator_id OR public.is_admin());
CREATE POLICY "Admins can moderate uploads" ON public.creator_uploads FOR ALL USING (public.is_admin());
