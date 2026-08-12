-- Anonymous-Friendly Likes Migration
-- Run this in your Supabase SQL Editor AFTER the clerk_migration.sql has been applied.
--
-- This migration:
-- 1. Renames likes.user_id → likes.liker_id (accepts both Clerk IDs and anonymous UUIDs)
-- 2. Drops the FK constraint to profiles (anonymous users have no profile row)
-- 3. Preserves the UNIQUE(story_id, liker_id) constraint
-- 4. Adds indexes for performance

-- Step 1: Drop the FK constraint (it may or may not exist depending on migration state)
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_user_id_fkey;
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_pkey;

-- Step 2: Rename user_id → liker_id
ALTER TABLE likes RENAME COLUMN user_id TO liker_id;

-- Step 3: Re-add the unique constraint
ALTER TABLE likes ADD CONSTRAINT likes_story_liker_unique UNIQUE (story_id, liker_id);

-- Step 4: Add indexes for query performance
CREATE INDEX IF NOT EXISTS idx_likes_story_id ON likes(story_id);
CREATE INDEX IF NOT EXISTS idx_likes_liker_id ON likes(liker_id);
