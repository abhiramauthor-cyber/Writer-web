-- Indexes for Core Performance & Query Optimization
-- Run this in your Supabase SQL Editor

-- 1. Index on story slug (used in story detail lookups)
CREATE INDEX IF NOT EXISTS idx_stories_slug ON public.stories(slug);

-- 2. Index on story is_published (used in catalog filtering)
CREATE INDEX IF NOT EXISTS idx_stories_is_published ON public.stories(is_published);

-- 3. Index on story catalog_no (used for sorting)
CREATE INDEX IF NOT EXISTS idx_stories_catalog_no ON public.stories(catalog_no DESC);

-- 4. Index on comments story_id and status (used for fetching approved comments)
CREATE INDEX IF NOT EXISTS idx_comments_story_status ON public.comments(story_id, status);

-- 5. Index on likes story_id and liker_id
CREATE INDEX IF NOT EXISTS idx_likes_story_liker ON public.likes(story_id, liker_id);

-- 6. Index on bookmarks user_id and story_id
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_story ON public.bookmarks(user_id, story_id);
