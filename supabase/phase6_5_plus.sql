-- Phase 6.5+ Migration: Normalized CMS Schema

-- 1. Profiles (Add is_admin)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean default false;
UPDATE profiles SET is_admin = true WHERE id IN (SELECT id FROM auth.users WHERE email = 'abhiramssk@gmail.com');

-- 2. Site Settings (Expand existing table)
ALTER TABLE site_settings 
  ADD COLUMN IF NOT EXISTS site_name text default 'Writer Lokam',
  ADD COLUMN IF NOT EXISTS tagline text default 'A digital reading room',
  ADD COLUMN IF NOT EXISTS footer_blurb text default 'Writer Lokam is a digital library catalog of original short fiction. A reading room of stories about love, memory, hope, and longing.',
  ADD COLUMN IF NOT EXISTS meta_description text default 'Writer Lokam is a digital library catalog of original short fiction by Abhi.',
  ADD COLUMN IF NOT EXISTS og_image_url text,
  ADD COLUMN IF NOT EXISTS newsletter_heading text default 'Stay in the loop',
  ADD COLUMN IF NOT EXISTS newsletter_body text default 'Get notified when new stories are published. No spam, ever.',
  ADD COLUMN IF NOT EXISTS social_instagram_url text default 'https://instagram.com/pvtly.abhi',
  ADD COLUMN IF NOT EXISTS social_twitter_url text default 'https://twitter.com/pvtly_abhi',
  ADD COLUMN IF NOT EXISTS social_email text default 'abhiramauthor@gmail.com',
  ADD COLUMN IF NOT EXISTS stamp_est_year text default 'EST. 2024';

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 3. Author Profile
CREATE TABLE IF NOT EXISTS author_profile (
  id int primary key default 1,
  name text not null default 'Abhi',
  avatar_url text,
  bio_paragraphs text[] default array['I grew up listening to two kinds of stories — the ones told at the dinner table, and the ones I made up on the way home from school. Somewhere along the way, the second kind started to feel like the more honest version of the first.']
);
ALTER TABLE author_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "author_profile public read" ON author_profile FOR SELECT USING (true);
CREATE POLICY "author_profile admin write" ON author_profile FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
INSERT INTO author_profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 4. Book Details
CREATE TABLE IF NOT EXISTS book_details (
  id int primary key default 1,
  cover_image_url text,
  title text not null default 'Two States, One Heart',
  tagline text default 'Abhi · A Novel',
  synopsis text default 'Two families, two languages, two ways of loving — and the couple caught in between, trying to weave something that honors both. A story about the quiet negotiations that hold a family together.',
  author_teaser text,
  sample_chapter_title text default 'Chapter 1',
  sample_chapter_body text default 'The rain started just as the train left the station...',
  sample_chapter_meta text default '10 mins read'
);
ALTER TABLE book_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "book_details public read" ON book_details FOR SELECT USING (true);
CREATE POLICY "book_details admin write" ON book_details FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
INSERT INTO book_details (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 5. Page Hero
CREATE TABLE IF NOT EXISTS page_hero (
  slug text primary key,
  eyebrow text,
  heading text not null,
  subheading text,
  body text,
  cta_primary_label text,
  cta_primary_href text,
  cta_secondary_label text,
  cta_secondary_href text,
  image_url text
);
ALTER TABLE page_hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "page_hero public read" ON page_hero FOR SELECT USING (true);
CREATE POLICY "page_hero admin write" ON page_hero FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
INSERT INTO page_hero (slug, heading, eyebrow) VALUES 
('home', 'A digital reading room', 'Welcome to Writer Lokam'),
('book', 'Two States, One Heart', 'The Debut Novel'),
('about', 'Hi, I''m Abhi', 'Card No. 000 · The Author'),
('stories', 'The Catalog', 'All Stories')
ON CONFLICT (slug) DO NOTHING;

-- 6. Buy Links
CREATE TABLE IF NOT EXISTS buy_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  type text default 'primary',
  sort_order int default 0
);
ALTER TABLE buy_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "buy_links public read" ON buy_links FOR SELECT USING (true);
CREATE POLICY "buy_links admin write" ON buy_links FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- 7. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text,
  context text,
  sort_order int default 0
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews admin write" ON reviews FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- 8. Journey Items
CREATE TABLE IF NOT EXISTS journey_items (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  body text,
  sort_order int default 0
);
ALTER TABLE journey_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "journey_items public read" ON journey_items FOR SELECT USING (true);
CREATE POLICY "journey_items admin write" ON journey_items FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- 9. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  sort_order int default 0
);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements public read" ON achievements FOR SELECT USING (true);
CREATE POLICY "achievements admin write" ON achievements FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- 10. Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('public_assets', 'public_assets', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "public_assets public read" ON storage.objects FOR SELECT USING (bucket_id = 'public_assets');
CREATE POLICY "public_assets admin insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'public_assets' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "public_assets admin update" ON storage.objects FOR UPDATE USING (bucket_id = 'public_assets' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "public_assets admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'public_assets' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
