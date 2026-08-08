-- Writer Lokam Data Seed Script
-- Populates all confirmed real data from Section 2 of the content audit.

-- 1. Site Settings
UPDATE site_settings SET
  site_name = 'Writer Lokam',
  tagline = 'A digital reading room',
  footer_blurb = 'Writer Lokam is a digital library catalog of original short fiction. A reading room of stories about love, memory, hope, and longing.',
  stamp_est_year = 'EST. 2025',
  meta_description = 'Writer Lokam is a digital library catalog of original short fiction by Abhi.',
  social_instagram_url = 'https://instagram.com/pvtly.abhi',
  social_twitter_url = 'https://twitter.com/pvtly_abhi',
  social_email = 'abhiramauthor@gmail.com',
  newsletter_heading = 'Stay in the loop',
  newsletter_body = 'Get notified when new stories are published. No spam, ever.'
WHERE id = 1;

-- 2. Author Profile
UPDATE author_profile SET
  name = 'Abhi',
  bio_paragraphs = ARRAY['I grew up listening to two kinds of stories — the ones told at the dinner table, and the ones I made up on the way home from school. Somewhere along the way, the second kind started to feel like the more honest version of the first.']
WHERE id = 1;

-- 3. Page Heroes
UPDATE page_hero SET
  eyebrow = 'Welcome to Writer Lokam',
  heading = 'A digital reading room'
WHERE slug = 'home';

UPDATE page_hero SET
  eyebrow = 'Card No. 000 · The Author',
  heading = 'Hi, I''m Abhi'
WHERE slug = 'about';

UPDATE page_hero SET
  eyebrow = 'The Debut Novel',
  heading = 'Two States, One Heart'
WHERE slug = 'book';

-- Stories hero: keep current values (not confirmed in Section 2)
-- UPDATE page_hero SET ... WHERE slug = 'stories';

-- 4. Book Details
UPDATE book_details SET
  title = 'Two States, One Heart',
  tagline = 'Abhi - A Novel',
  synopsis = 'Two families, two languages, two ways of loving — and the couple caught in between, trying to weave something that honors both. A story about the quiet negotiations that hold a family together.',
  sample_chapter_title = 'Chapter 1',
  sample_chapter_meta = '10 mins read',
  sample_chapter_body = 'The rain started just as the train left the station…'
WHERE id = 1;

-- 5. Buy Links (insert 4 rows)
INSERT INTO buy_links (label, url, type, sort_order) VALUES
  ('Amazon', 'https://www.amazon.in/dp/9372482757', 'primary', 0),
  ('Flipkart', 'https://www.flipkart.com/two-states-one-heart/p/itm9d8b46f50f122?pid=9789372482751', 'secondary', 1),
  ('Google Play Books', 'https://play.google.com/store/books/details?id=ttXAEQAAQBAJ', 'secondary', 2),
  ('Writer''s Pocket', 'https://writerspocket.com/shop/485c0845-7229-48ca-a8ca-abcdda5e126c', 'secondary', 3)
ON CONFLICT DO NOTHING;
