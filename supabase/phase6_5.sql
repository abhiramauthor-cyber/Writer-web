-- Phase 6.5 Migration

-- 1. Add social_links to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Seed social links
UPDATE site_settings 
SET social_links = '{"instagram": {"url": "https://instagram.com/pvtly.abhi", "handle": "@pvtly.abhi"}, "twitter": {"url": "https://twitter.com/pvtly_abhi", "handle": "pvtly_abhi"}, "email": "abhiramauthor@gmail.com"}'::jsonb 
WHERE id = 1;

-- 2. Seed Book content into page_content
INSERT INTO page_content (slug, title, content) 
VALUES (
  'book', 
  'Book Details', 
  '{
    "title": "Two States, One Heart",
    "subtitle": "Abhi · A Novel",
    "synopsis": "Two families, two languages, two ways of loving — and the couple caught in between, trying to weave something that honors both. A story about the quiet negotiations that hold a family together.",
    "buy_link": "/book",
    "sample_link": "/book#sample"
  }'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- 3. Ensure about page has a default journey array if it doesn't already
UPDATE page_content 
SET content = jsonb_set(
  content, 
  '{journey}', 
  '[
    {"year": "2022", "title": "First story, written for no one", "body": "Started writing short fiction in Telugu and English, mostly about the families around me.", "sort_order": 1},
    {"year": "2024", "title": "Two States, One Heart begins", "body": "What started as a single scene overheard at a wedding grew into a full manuscript.", "sort_order": 2},
    {"year": "2025", "title": "The reading room opens", "body": "Writer Lokam started as a place to publish short stories alongside the novel.", "sort_order": 3},
    {"year": "2026", "title": "Two States, One Heart is published", "body": "The novel finds its way into readers'' hands, in print and as an ebook.", "sort_order": 4}
  ]'::jsonb
)
WHERE slug = 'about' AND content->'journey' IS NULL;
