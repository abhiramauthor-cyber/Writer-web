-- Phase 6 Migration Script

-- 1. Add `is_published` to stories
ALTER TABLE stories ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- 2. Create `site_settings` table
CREATE TABLE IF NOT EXISTS site_settings (
  id integer primary key default 1,
  is_maintenance_mode boolean default false,
  updated_at timestamptz default now()
);

-- Seed site_settings
INSERT INTO site_settings (id, is_maintenance_mode) VALUES (1, false) ON CONFLICT (id) DO NOTHING;

-- 3. Create `page_content` table
CREATE TABLE IF NOT EXISTS page_content (
  slug text primary key,
  title text not null,
  content jsonb not null,
  updated_at timestamptz default now()
);

-- Seed page_content
INSERT INTO page_content (slug, title, content) VALUES
('home', 'Home Page', '{"hero_title": "Writer Lokam", "hero_subtitle": "A reading room of original fiction about love, memory, hope, and longing — catalogued, kept, and added to every month."}'::jsonb),
('about', 'About Page', '{"bio": "Two States, One Heart is available in print and as an ebook. However you like to read, there''s a copy for you.", "achievements": [{"title": "Published Book", "year": "2023"}]}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- RLS Policies for settings & content
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings/content
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (true);
