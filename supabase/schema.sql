-- ==============================================================================
-- pNongki! Database Schema (PRD v2 Specification)
-- Target: PostgreSQL / Supabase
-- Description: Skema lengkap direktori kafe, gamifikasi XP & rewards, feeds komunitas,
--              sistem ulasan, bookmark, dan eskalasi peran bisnis.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('mahasiswa', 'owner', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE place_category AS ENUM ('nongkrong', 'nugas', 'olahraga', 'fasilitas_publik');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE place_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE post_type AS ENUM ('thread', 'hangout');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE reward_type AS ENUM ('voucher', 'merchandise');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE claim_status AS ENUM ('menunggu_pengambilan', 'completed', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE business_claim_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. TABLES DEFINITION
-- ==============================================================================

-- 3.1 BADGES (Gamifikasi Level & Lencana Reputasi)
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  tier_name TEXT NOT NULL,
  min_xp INTEGER NOT NULL DEFAULT 0,
  max_xp INTEGER NOT NULL DEFAULT 999999,
  icon TEXT NOT NULL,
  badge_color TEXT NOT NULL,
  description TEXT,
  perks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3.2 USERS PROFILE (Tersinkronisasi dengan auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  name TEXT,
  role user_role NOT NULL DEFAULT 'mahasiswa',
  avatar_url TEXT,
  phone_number TEXT,
  campus TEXT DEFAULT 'Institut Teknologi Bandung',
  xp_points INTEGER NOT NULL DEFAULT 0,
  points_balance INTEGER NOT NULL DEFAULT 0,
  points_expiry DATE DEFAULT '2026-12-31',
  badge_id UUID REFERENCES public.badges(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3.3 PLACES (Direktori Tempat & Kafe)
CREATE TABLE IF NOT EXISTS public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  category place_category NOT NULL DEFAULT 'nongkrong',
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Bandung',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  cover_image_url TEXT,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  review_count INTEGER NOT NULL DEFAULT 0,
  price_range TEXT DEFAULT 'Rp 15.000 - Rp 35.000',
  open_status TEXT DEFAULT 'Buka s/d 23:00',
  is_partner BOOLEAN NOT NULL DEFAULT false,
  added_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status place_status NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3.4 PLACE DETAILS (Detail operasional, fasilitas, menu & booking)
CREATE TABLE IF NOT EXISTS public.place_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL UNIQUE REFERENCES public.places(id) ON DELETE CASCADE,
  description TEXT,
  opening_hours JSONB DEFAULT '{"senin_jumat": "08:00 - 23:00", "sabtu_minggu": "08:00 - 00:00"}'::jsonb,
  facilities TEXT[] DEFAULT ARRAY['WiFi Kencang', 'Stopkontak Tiap Meja', 'Musholla Bersih'],
  recommended_menu TEXT,
  menus JSONB DEFAULT '[]'::jsonb,
  menu_images TEXT[] DEFAULT ARRAY[]::text[],
  booking_url TEXT,
  contact_phone TEXT,
  instagram TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3.5 POSTS (Feeds Komunitas & Ajak Nongkrong)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
  post_type post_type NOT NULL DEFAULT 'thread',
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  hangout_time TIMESTAMPTZ,
  slot_capacity INTEGER,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  expired_at TIMESTAMPTZ,
  contact_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3.6 POST COMMENTS (Komentar Feeds & Balasan Bersarang)
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3.7 POST LIKES (Pemberian Suka)
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (post_id, user_id)
);

-- 3.8 RATINGS & REVIEWS (Ulasan Bintang & Foto)
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  review_text TEXT NOT NULL,
  photo_urls TEXT[] DEFAULT ARRAY[]::text[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(place_id, user_id)
);

-- 3.9 FAVORITES (Bookmark Tempat Favorit)
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (user_id, place_id)
);

-- 3.10 REWARDS (Katalog Merchandise & Voucer)
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  reward_type reward_type NOT NULL,
  point_cost INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 10,
  voucher_code TEXT,
  merchant TEXT DEFAULT 'Official pNongki!',
  image_url TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3.11 REWARD CLAIMS (Tiket Penukaran Hadiah)
CREATE TABLE IF NOT EXISTS public.reward_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  claim_code TEXT NOT NULL UNIQUE,
  status claim_status NOT NULL DEFAULT 'menunggu_pengambilan',
  qr_token TEXT,
  qr_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3.12 BUSINESS CLAIMS (Pengajuan Klaim Kepemilikan Bisnis Kafe)
CREATE TABLE IF NOT EXISTS public.business_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  social_media_link TEXT,
  status business_claim_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 4. PERFORMANCE INDEXES (Supabase Best Practices)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);
CREATE INDEX IF NOT EXISTS idx_places_status ON public.places(status);
CREATE INDEX IF NOT EXISTS idx_places_added_by ON public.places(added_by);
CREATE INDEX IF NOT EXISTS idx_places_owner_id ON public.places(owner_id);
CREATE INDEX IF NOT EXISTS idx_places_city ON public.places(city);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_place_id ON public.posts(place_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON public.post_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_ratings_place_id ON public.ratings(place_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_claims_user_id ON public.reward_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_business_claims_user_id ON public.business_claims(user_id);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;

-- 5.1 BADGES POLICIES (Publik dapat membaca, hanya admin menulis)
CREATE POLICY "Badges are viewable by everyone" ON public.badges
  FOR SELECT TO anon, authenticated USING (true);

-- 5.2 USERS POLICIES
CREATE POLICY "Users profiles are viewable by everyone" ON public.users
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- 5.3 PLACES POLICIES (Approved places are viewable by all)
CREATE POLICY "Approved places are viewable by everyone" ON public.places
  FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR (select auth.uid()) = added_by OR (select auth.uid()) = owner_id);

CREATE POLICY "Authenticated users can submit new place" ON public.places
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = added_by);

CREATE POLICY "Owners and creators can update their place" ON public.places
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = owner_id OR (select auth.uid()) = added_by)
  WITH CHECK ((select auth.uid()) = owner_id OR (select auth.uid()) = added_by);

-- 5.4 PLACE DETAILS POLICIES
CREATE POLICY "Place details viewable by everyone" ON public.place_details
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can insert place details" ON public.place_details
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Place details updatable by authenticated" ON public.place_details
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 5.5 POSTS POLICIES
CREATE POLICY "Posts viewable by everyone" ON public.posts
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);

-- 5.6 POST COMMENTS POLICIES
CREATE POLICY "Comments viewable by everyone" ON public.post_comments
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can post comments" ON public.post_comments
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own comments" ON public.post_comments
  FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);

-- 5.7 POST LIKES POLICIES
CREATE POLICY "Likes viewable by everyone" ON public.post_likes
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Users can like/unlike posts" ON public.post_likes
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- 5.8 RATINGS POLICIES
CREATE POLICY "Ratings viewable by everyone" ON public.ratings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can rate places" ON public.ratings
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own ratings" ON public.ratings
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- 5.9 FAVORITES POLICIES
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can remove favorites" ON public.favorites
  FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);

-- 5.10 REWARDS POLICIES
CREATE POLICY "Active rewards viewable by everyone" ON public.rewards
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- 5.11 REWARD CLAIMS POLICIES
CREATE POLICY "Users can view their own claims" ON public.reward_claims
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can claim rewards" ON public.reward_claims
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

-- 5.12 BUSINESS CLAIMS POLICIES
CREATE POLICY "Users can view their own business claims" ON public.business_claims
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can submit business claim" ON public.business_claims
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

-- ==============================================================================
-- 6. AUTOMATION TRIGGERS & GAMIFIKASI XP FUNCTIONS
-- ==============================================================================

-- 6.1 Auto-create public.users saat user register di auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    name,
    campus,
    phone_number,
    role,
    xp_points,
    points_balance
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'campus', 'Mahasiswa Pengguna pNongki!'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    CASE
      WHEN lower(new.email) LIKE '%@admin.pnongki' THEN 'admin'::user_role
      WHEN COALESCE(new.raw_user_meta_data->>'role', '') = 'admin' THEN 'admin'::user_role
      WHEN COALESCE(new.raw_user_meta_data->>'role', '') = 'owner' THEN 'owner'::user_role
      ELSE 'mahasiswa'::user_role
    END,
    0,
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6.2 Otomatis Tambah XP & Poin saat Kontribusi (GAME-2)
-- Tambah Tempat: +50 XP, +50 Poin
-- Ulasan Tempat: +20 XP, +20 Poin
-- Postingan Feeds: +10 XP, +10 Poin
CREATE OR REPLACE FUNCTION public.award_xp_points(p_user_id UUID, p_xp INTEGER, p_points INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET xp_points = xp_points + p_xp,
      points_balance = points_balance + p_points,
      updated_at = timezone('utc', now())
  WHERE id = p_user_id;
END;
$$;

-- Trigger Tempat Baru (+50 XP)
CREATE OR REPLACE FUNCTION public.trg_award_add_place()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF new.added_by IS NOT NULL THEN
    PERFORM public.award_xp_points(new.added_by, 50, 50);
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_place_added ON public.places;
CREATE TRIGGER on_place_added
  AFTER INSERT ON public.places
  FOR EACH ROW EXECUTE PROCEDURE public.trg_award_add_place();

-- Trigger Ulasan Baru (+20 XP)
CREATE OR REPLACE FUNCTION public.trg_award_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF new.user_id IS NOT NULL THEN
    PERFORM public.award_xp_points(new.user_id, 20, 20);
    -- Update rating agregat pada tempat
    UPDATE public.places
    SET rating = (SELECT ROUND(AVG(score)::numeric, 2) FROM public.ratings WHERE place_id = new.place_id),
        review_count = (SELECT COUNT(*) FROM public.ratings WHERE place_id = new.place_id)
    WHERE id = new.place_id;
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_rating_added ON public.ratings;
CREATE TRIGGER on_rating_added
  AFTER INSERT ON public.ratings
  FOR EACH ROW EXECUTE PROCEDURE public.trg_award_rating();

-- Trigger Postingan Feeds Baru (+10 XP)
CREATE OR REPLACE FUNCTION public.trg_award_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF new.user_id IS NOT NULL THEN
    PERFORM public.award_xp_points(new.user_id, 10, 10);
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_post_added ON public.posts;
CREATE TRIGGER on_post_added
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.trg_award_post();

-- ==============================================================================
-- 7. INITIAL SEED DATA
-- ==============================================================================

-- 7.1 Seed Badges
INSERT INTO public.badges (id, name, tier_name, min_xp, max_xp, icon, badge_color, description, perks)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Warga Baru',
    'Silver Member Card',
    0,
    149,
    'eco',
    '#94A3B8',
    'Tingkatan pertama untuk pengguna baru yang mulai menjelajahi spot nongki.',
    '["Akses pencarian direktori kafe di seluruh kampus", "Menulis ulasan & rating bintang tempat", "Membaca dan berinteraksi di Feeds komunitas"]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Hobi Nugas',
    'Sapphire Blue Member Card',
    150,
    499,
    'laptop_chromebook',
    '#38BDF8',
    'Level mahasiswa rajin yang aktif eksplor spot nugas berkoneksi kencang.',
    '["Semua hak akses tingkat Warga Baru", "Lencana biru eksklusif di profil & forum Feeds", "Dapat menukarkan saldo poin dengan voucer kafe mitra", "Prioritas slot teman di sesi Ajak Nongkrong"]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Sepuh Kopi',
    'Gold Titanium Member Card',
    500,
    999,
    'military_tech',
    '#FBBF24',
    'Tingkatan senior pencinta kopi dengan reputasi tinggi di komunitas.',
    '["Semua hak akses tingkat Hobi Nugas", "Proses verifikasi tempat kontribusi diprioritaskan admin", "Akses penukaran merchandise edisi terbatas (Tumbler & Kaos)", "Lencana emas Sepuh Kopi di setiap postingan & balasan"]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Master Nongki',
    'Obsidian Emerald Card',
    1000,
    999999,
    'diamond',
    '#34D399',
    'Tingkat tertinggi keanggotaan pNongki! dengan privilege maksimal komunitas.',
    '["Kartu VIP eksklusif bertema Obsidian Black & Neon Green", "Akses instan ke seluruh rewards voucer & merchandise", "Undangan temu komunitas dan testing fitur rahasia platform", "Badge VIP Diamond hijau menyala di profil publik"]'::jsonb
  )
ON CONFLICT (name) DO NOTHING;

-- 7.2 Seed Rewards Catalog
INSERT INTO public.rewards (id, title, reward_type, point_cost, stock, voucher_code, merchant, image_url, description)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Tumbler Stainless pNongki! (500ml)',
    'merchandise',
    300,
    12,
    NULL,
    'Official Merchandise pNongki!',
    'https://images.unsplash.com/photo-1577741314755-048d8525d31e?auto=format&fit=crop&w=600&q=80',
    'Tumbler eksklusif tahan panas/dingin 12 jam, edisi terbatas komunitas mahasiswa.'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Voucer Diskon 50% Koffie & Co.',
    'voucher',
    150,
    30,
    'KOFFIE50PNONGKI',
    'Koffie & Co. Dago',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    'Potongan 50% untuk seluruh varian Espresso Based & Pastry di Koffie & Co Dago.'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Voucer Potongan Rp 25.000 Ruang Teduh',
    'voucher',
    100,
    25,
    'TEDUH25K',
    'Ruang Teduh Backyard Cafe',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    'Potongan langsung Rp 25.000 tanpa minimum transaksi di Ruang Teduh Dipatiukur.'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'T-Shirt Komunitas pNongki! Edisi Sepuh',
    'merchandise',
    450,
    8,
    NULL,
    'Official Merchandise pNongki!',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    'Kaos combed 24s premium dengan sablon lencana Sepuh Kopi pNongki!.'
  )
ON CONFLICT (id) DO NOTHING;

-- 7.3 Seed Places & Place Details
INSERT INTO public.places (id, slug, name, category, address, city, latitude, longitude, cover_image_url, rating, review_count, price_range, open_status, is_partner, status)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    'koffie-co',
    'Koffie & Co. Workspace & Roastery',
    'nugas',
    'Jl. Dago No. 112, Coblong, Kota Bandung',
    'Dago, Bandung',
    -6.8850,
    107.6140,
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    4.9,
    148,
    'Rp 20.000 - Rp 45.000',
    'Buka s/d 23:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'ruang-teduh',
    'Ruang Teduh Backyard Cafe',
    'nongkrong',
    'Jl. Dipatiukur No. 48, Lebakgede, Coblong, Kota Bandung',
    'Dipatiukur, Bandung',
    -6.8920,
    107.6185,
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    4.7,
    95,
    'Rp 18.000 - Rp 40.000',
    'Buka s/d 00:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'saraga-itb',
    'Sarana Olahraga Ganesha (Saraga ITB)',
    'olahraga',
    'Jl. Tamansari No. 73, Lebak Siliwangi, Coblong, Kota Bandung',
    'Tamansari, Bandung',
    -6.8875,
    107.6095,
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    4.8,
    210,
    'Rp 5.000 - Rp 25.000',
    'Buka s/d 20:00',
    false, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'creative-hub-bandung',
    'Bandung Creative Hub (BCH)',
    'fasilitas_publik',
    'Jl. Laswi No. 7, Kacapiring, Batununggal, Kota Bandung',
    'Laswi, Bandung',
    -6.9172,
    107.6291,
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    4.6,
    88,
    'Gratis (Fasilitas Publik)',
    'Buka s/d 21:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    'kopi-sahabat-ganesha',
    'Kopi Sahabat Kampus Ganesha',
    'nongkrong',
    'Jl. Gelap Nyawang No. 14, Tamansari, Bandung',
    'Tamansari, Bandung',
    -6.8905,
    107.6105,
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80',
    4.5,
    64,
    'Rp 12.000 - Rp 25.000',
    'Buka 24 Jam',
    false, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    'ruang-kolaborasi-malang',
    'Ruang Kolaborasi Hub & Creative Lab',
    'nugas',
    'Jl. Bunga Coklat No. 18, Lowokwaru',
    'Lowokwaru, Malang',
    -7.9420,
    112.6180,
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    4.9,
    182,
    'Rp 22.000 - Rp 50.000',
    'Buka s/d 23:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    'senja-lounge-malang',
    'Senja Lounge & Rooftop Cafe',
    'nongkrong',
    'Jl. Ijen No. 12, Klojen',
    'Ijen, Malang',
    -7.9710,
    112.6230,
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    4.7,
    120,
    'Rp 25.000 - Rp 60.000',
    'Buka s/d 00:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    'arena-sport-club-malang',
    'Arena Sport Club & Badminton Hall',
    'olahraga',
    'Jl. Veteran No. 8, Klojen',
    'Veteran, Malang',
    -7.9550,
    112.6150,
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    4.8,
    92,
    'Rp 35.000 - Rp 60.000 / Jam',
    'Buka s/d 22:00',
    false, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000009',
    'perpustakaan-literasi-hub',
    'Perpustakaan Daerah & Literasi Hub',
    'fasilitas_publik',
    'Jl. Merdeka No. 45, Sumur Bandung',
    'Merdeka, Bandung',
    -6.9140,
    107.6100,
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    4.8,
    140,
    'Gratis 100% Akses',
    'Buka s/d 18:00',
    false, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000010',
    'workathome-studio',
    'Work@Home Studio & Specialty Coffee',
    'nugas',
    'Jl. Cimanuk No. 22, Riau',
    'Riau, Bandung',
    -6.9040,
    107.6210,
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    4.8,
    115,
    'Rp 25.000 - Rp 50.000',
    'Buka s/d 23:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000011',
    'armor-kopi-garden',
    'Armor Kopi Garden Leuit Dago',
    'nongkrong',
    'Jl. Bukit Pakar Barat No. 10, Ciburial',
    'Dago Atas, Bandung',
    -6.8620,
    107.6320,
    'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=800&q=80',
    4.6,
    260,
    'Rp 20.000 - Rp 45.000',
    'Buka s/d 22:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000012',
    'el-dorado-sport-center',
    'El Dorado Sport Center & Pool',
    'olahraga',
    'Jl. Dr. Setiabudi No. 438, Isola',
    'Setiabudi, Bandung',
    -6.8450,
    107.5970,
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    4.7,
    175,
    'Rp 40.000 - Rp 80.000',
    'Buka s/d 21:00',
    false, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000013',
    'tahura-dago-pakar',
    'Taman Hutan Raya Ir. H. Djuanda',
    'fasilitas_publik',
    'Kompleks Tahura Dago Pakar',
    'Ciburial, Bandung',
    -6.8580,
    107.6310,
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    4.9,
    310,
    'Rp 15.000 (Tiket Masuk)',
    'Buka s/d 17:00',
    false, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000014',
    'kopi-toko-djawa-braga',
    'Kopi Toko Djawa Heritage Braga',
    'nongkrong',
    'Jl. Braga No. 81, Sumur Bandung',
    'Braga, Bandung',
    -6.9170,
    107.6090,
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    4.8,
    420,
    'Rp 18.000 - Rp 35.000',
    'Buka s/d 22:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000015',
    'sejiwa-coffee-progo',
    'Sejiwa Coffee Progo Workspace',
    'nugas',
    'Jl. Progo No. 15, Citarum, Bandung Wetan',
    'Progo, Bandung',
    -6.9050,
    107.6160,
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    4.7,
    340,
    'Rp 30.000 - Rp 65.000',
    'Buka s/d 23:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000016',
    'siliwangi-futsal-park',
    'Siliwangi Futsal & Mini Soccer Park',
    'olahraga',
    'Jl. Lombok No. 10, Merdeka',
    'Riau, Bandung',
    -6.9110,
    107.6180,
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    4.6,
    85,
    'Rp 150.000 - Rp 300.000 / Jam',
    'Buka s/d 23:00',
    false, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000017',
    'gasibu-park-bandung',
    'Alun-Alun & Ruang Terbuka Gasibu',
    'fasilitas_publik',
    'Jl. Diponegoro No. 1, Citarum',
    'Gedung Sate, Bandung',
    -6.9010,
    107.6190,
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
    4.7,
    290,
    'Gratis Akses Terbuka',
    'Buka 24 Jam',
    false, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000018',
    'wheels-coffee-heritage',
    'Wheels Coffee Roasters Heritage',
    'nugas',
    'Jl. LLRE Martadinata No. 65, Citarum',
    'Riau, Bandung',
    -6.9080,
    107.6150,
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    4.9,
    410,
    'Rp 30.000 - Rp 70.000',
    'Buka s/d 22:00',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000019',
    'nordic-house-sukajadi',
    'Nordic House Cafe & 24H Lounge',
    'nugas',
    'Jl. Sukajadi No. 198, Pasteur',
    'Sukajadi, Bandung',
    -6.8840,
    107.5950,
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    4.6,
    78,
    'Rp 20.000 - Rp 45.000',
    'Buka 24 Jam',
    true, 'approved'
  ),
  (
    '20000000-0000-0000-0000-000000000020',
    'kopi-titik-temu-yard',
    'Kopi Titik Temu & Community Yard',
    'nongkrong',
    'Jl. Gandapura No. 55, Merdeka',
    'Riau, Bandung',
    -6.9120,
    107.6250,
    'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80',
    4.7,
    165,
    'Rp 20.000 - Rp 45.000',
    'Buka s/d 23:00',
    true, 'approved'
  )
ON CONFLICT (id) DO NOTHING;

-- 7.4 Seed Place Details
INSERT INTO public.place_details (place_id, description, facilities, recommended_menu, booking_url, contact_phone, instagram)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    'Coworking roastery dengan suasana tenang, colokan melimpah di setiap meja dan koneksi WiFi cepat. Pilihan favorit mahasiswa ITB & UNPAD untuk nugas skripsi.',
    ARRAY['WiFi 100 Mbps', 'Stopkontak Tiap Meja', 'Kursi Ergonomis', 'Musholla Bersih', 'Ruang AC'],
    'Signature Caramel Sea Salt Latte & Croissant Almond',
    'https://wa.me/6281234567890?text=Halo%20Koffie%20Co,%20saya%20ingin%20reservasi%20meja%20nugas',
    '0812-3456-7890',
    '@koffieco.dago'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Spot nongkrong adem dekat kampus UNPAD & ITHB, konsep semi-outdoor dengan pohon rindang, cocok untuk nugas santai dan kumpul komunitas.',
    ARRAY['WiFi Kencang', 'Stopkontak', 'Outdoor Area', 'Musholla Bersih', 'Live Akustik'],
    'Kopi Susu Gula Aren & Truffle Fries',
    'https://wa.me/6289876543210?text=Halo%20Ruang%20Teduh,%20saya%20ingin%20tanya%20slot%20kumpul',
    '0898-7654-3210',
    '@ruangteduh.bdg'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Fasilitas olahraga lengkap di kawasan kampus Ganesha, meliputi jogging track, lapangan basket, kolam renang berstandar olimpiade, dan gym.',
    ARRAY['Jogging Track Karet', 'Kolam Renang', 'Lapangan Basket', 'Loker Kunci', 'Kantin Sehat'],
    'Air Mineral Dingin & Pisang Goreng Madu',
    NULL,
    '022-2500935',
    '@saragaitb'
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Gedung sentra industri kreatif milik Pemkot Bandung. Menyediakan co-working space gratis, perpustakaan desain, studio audio visual, dan ruang pameran seni.',
    ARRAY['Ruang Co-working', 'WiFi Publik Kencang', 'Ruang Hening', 'Musholla', 'Lift & Kursi Roda'],
    'Kafe Koperasi BCH: Americano & Brownies Fudgy',
    'https://wa.me/6287712345678?text=Halo%20BCH,%20ingin%20info%20ruang%20kolaborasi',
    '022-7201234',
    '@bandungcreativehub'
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    'Tempat nongkrong malam favorit mahasiswa ITB, harga ramah di kantong dan buka hingga dini hari. Menyajikan aneka racikan kopi tubruk dan Indomie rebus.',
    ARRAY['WiFi Mahasiswa', 'Stopkontak', 'Buka 24 Jam', 'Area Merokok', 'Parkir Luas'],
    'Kopi Susu Sahabat & Roti Bakar Coklat Keju',
    NULL,
    '0856-7890-1234',
    '@kopisahabat.ganesha'
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    'Creative lab dan coworking space modern di area kampus Malang. Dilengkapi private meeting room, podcast studio, dan kursi ergonomis untuk marathon tugas.',
    ARRAY['WiFi Kencang', 'Stopkontak / Colokan', 'Kursi Ergonomis', 'Musholla Bersih'],
    'Espresso Tonic & Smoked Beef Croissant',
    'https://wa.me/6281234567891?text=Halo%20Ruang%20Kolaborasi',
    '0812-3456-7891',
    '@ruangkolaborasi.mlg'
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    'Rooftop lounge dengan panorama senja dan lampu kota. Suasana santai dengan alunan musik akustik, cocok untuk kumpul dan quality time bersama teman.',
    ARRAY['WiFi Kencang', 'Stopkontak / Colokan', 'Outdoor Area', 'Parkir Luas'],
    'Sunset Mocktail & Churros Cinnamon',
    'https://wa.me/6281234567892?text=Halo%20Senja%20Lounge',
    '0812-3456-7892',
    '@senjalounge.mlg'
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    'Pusat kebugaran dan 6 lapangan bulutangkis berkarpet BWF standar internasional. Fasilitas bersih, loker aman, dan area parkir sangat lega.',
    ARRAY['Parkir Luas', 'Outdoor Area', 'Loker Kunci'],
    'Isotonic Fresh Water & Siomay Kantin',
    NULL,
    '0812-3456-7897',
    '@arenasportclub'
  ),
  (
    '20000000-0000-0000-0000-000000000009',
    'Pusat literasi publik dengan koleksi puluhan ribu buku dan ruang baca ber-AC yang sangat hening. Akses gratis untuk pelajar, mahasiswa dan umum.',
    ARRAY['WiFi Kencang', 'Stopkontak / Colokan', 'Kursi Ergonomis', 'Musholla Bersih'],
    'Air Mineral Refill Gratis & Corner Cafe',
    NULL,
    '022-4201234',
    '@perpusda.jabar'
  ),
  (
    '20000000-0000-0000-0000-000000000010',
    'Boutique workspace dan specialty coffee roasters di kawasan Riau. Menyediakan single origin filter coffee terbaik dan colokan di setiap sudut meja.',
    ARRAY['WiFi Kencang', 'Stopkontak / Colokan', 'Kursi Ergonomis', 'Outdoor Area'],
    'Single Origin Filter Coffee & Quiche Lorraine',
    'https://wa.me/6281234567893?text=Halo%20Work%40Home',
    '0812-3456-7893',
    '@workathomestudio'
  ),
  (
    '20000000-0000-0000-0000-000000000011',
    'Kafe bernuansa alam terbuka di tengah hutan pinus Dago Atas. Udara sejuk dan pemandangan danau buatan kecil yang menenangkan pikiran.',
    ARRAY['Outdoor Area', 'Parkir Luas', 'Musholla Bersih'],
    'Kopi Robusta Honey & Cireng Bumbu Rujak',
    NULL,
    '0813-4567-8901',
    '@armorkopigarden'
  ),
  (
    '20000000-0000-0000-0000-000000000012',
    'Kompleks olahraga terpadu dengan kolam renang air hangat, lapangan tenis, dan gym modern di kawasan sejuk Setiabudi Bandung.',
    ARRAY['Parkir Luas', 'Outdoor Area', 'Loker Kunci'],
    'Fresh Orange Juice & Roti Bakar Cokelat',
    NULL,
    '022-2001234',
    '@eldoradosport'
  ),
  (
    '20000000-0000-0000-0000-000000000013',
    'Kawasan konservasi alam dan hutan lindung terluas di Bandung. Tempat ideal untuk jogging, jalan santai, atau healing di tengah pepohonan rindang.',
    ARRAY['Outdoor Area', 'Parkir Luas', 'Musholla Bersih'],
    'Kopi Jahe Hangat & Jagung Bakar Pedas Manis',
    NULL,
    '022-2507890',
    '@tahuradjuanda'
  ),
  (
    '20000000-0000-0000-0000-000000000014',
    'Kedai kopi legendaris di jantung Jalan Braga bernuansa retro klasik. Populer dengan Es Kopi Awan dan pastry kayu manis yang freshly baked.',
    ARRAY['WiFi Kencang', 'Stopkontak / Colokan'],
    'Es Kopi Awan & Cinnamon Roll',
    NULL,
    '0812-9876-5432',
    '@kopitokodjawa'
  ),
  (
    '20000000-0000-0000-0000-000000000015',
    'Glass house cafe ikonik di Jl. Progo dengan pencahayaan alami yang cerah. Menjadi magnet mahasiswa untuk nugas skripsi dan content creation.',
    ARRAY['WiFi Kencang', 'Stopkontak / Colokan', 'Kursi Ergonomis', 'Musholla Bersih'],
    'Flat White Oat Milk & Truffle Mushroom Toast',
    'https://wa.me/6281234567894?text=Halo%20Sejiwa%20Coffee',
    '0812-3456-7894',
    '@sejiwacoffee'
  ),
  (
    '20000000-0000-0000-0000-000000000016',
    'Fasilitas mini soccer berumput sintetis standar internasional dengan penerangan lampu malam berkualitas. Dilengkapi kantin dan loker pemain.',
    ARRAY['Parkir Luas', 'Outdoor Area', 'Loker Kunci'],
    'Minuman Isotonik & Nasi Rames Atlet',
    NULL,
    '0811-2345-6789',
    '@siliwangisoccer'
  ),
  (
    '20000000-0000-0000-0000-000000000017',
    'Ruang publik hijau ikonik di depan Gedung Sate dengan jogging track berkarpet biru sintetis. Buka 24 jam dengan suasana aman dan semarak.',
    ARRAY['Outdoor Area', 'Parkir Luas', 'Buka 24 Jam'],
    'Bandrek Susu Hangat & Cuanki Serayu Gasibu',
    NULL,
    NULL,
    '@gasibupark'
  ),
  (
    '20000000-0000-0000-0000-000000000018',
    'Restoran dan roastery berkelas di kawasan heritage Riau dengan menu western premium dan varian kopi specialty kelas dunia yang memikat.',
    ARRAY['WiFi Kencang', 'Stopkontak / Colokan', 'Kursi Ergonomis', 'Musholla Bersih', 'Parkir Luas'],
    'French Toast Classic & Manual Brew Geisha',
    'https://wa.me/6281234567895?text=Halo%20Wheels%20Coffee',
    '0812-3456-7895',
    '@wheelscoffee'
  ),
  (
    '20000000-0000-0000-0000-000000000019',
    'Kafe minimalis bergaya Scandinavian yang beroperasi nonstop 24 jam. Sangat cocok bagi night owl dan mahasiswa yang butuh fokus di malam hari.',
    ARRAY['WiFi Kencang', 'Stopkontak / Colokan', 'Kursi Ergonomis', 'Buka 24 Jam'],
    'Iced Vanilla Latte & Bagel Cream Cheese',
    NULL,
    '0813-9876-5432',
    '@nordichousecafe'
  ),
  (
    '20000000-0000-0000-0000-000000000020',
    'Kedai kopi dengan halaman rumput luas dan atmosfer santai di Gandapura. Ramah hewan peliharaan (pet friendly) dan kerap menggelar pasar komunitas.',
    ARRAY['WiFi Kencang', 'Stopkontak / Colokan', 'Outdoor Area', 'Parkir Luas'],
    'Aren Cold Brew & Bitterballen Belanda',
    'https://wa.me/6281234567896?text=Halo%20Titik%20Temu',
    '0812-3456-7896',
    '@titiktemu.yard'
  )
ON CONFLICT (place_id) DO NOTHING;

