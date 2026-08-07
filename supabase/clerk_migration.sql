-- Supabase Migration Script for Clerk Authentication
-- Run this in your Supabase SQL Editor

-- 1. Remove Supabase Auth triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Drop existing foreign key constraints that rely on UUIDs
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_user_id_fkey;
ALTER TABLE bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_fkey;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Drop RLS policies that rely on the uuid columns
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON likes;
DROP POLICY IF EXISTS "Users can view own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can insert own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can view own pending comments" ON comments;
DROP POLICY IF EXISTS "Users can insert own comments" ON comments;

-- Admin policies that reference profiles.id
DROP POLICY IF EXISTS "author_profile admin write" ON author_profile;
DROP POLICY IF EXISTS "book_details admin write" ON book_details;
DROP POLICY IF EXISTS "page_hero admin write" ON page_hero;
DROP POLICY IF EXISTS "buy_links admin write" ON buy_links;
DROP POLICY IF EXISTS "reviews admin write" ON reviews;
DROP POLICY IF EXISTS "journey_items admin write" ON journey_items;
DROP POLICY IF EXISTS "achievements admin write" ON achievements;
DROP POLICY IF EXISTS "Admin read contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin update contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin delete contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin read subscribers" ON subscribers;
DROP POLICY IF EXISTS "Admin delete subscribers" ON subscribers;

-- Drop storage policies that reference profiles.id
DROP POLICY IF EXISTS "public_assets admin insert" ON storage.objects;
DROP POLICY IF EXISTS "public_assets admin update" ON storage.objects;
DROP POLICY IF EXISTS "public_assets admin delete" ON storage.objects;

-- 4. Change UUID columns to TEXT to support Clerk IDs (e.g., 'user_2xyz...')
ALTER TABLE profiles ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE likes ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE bookmarks ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE comments ALTER COLUMN user_id TYPE text USING user_id::text;

-- 5. Re-add foreign key constraints to profiles table
ALTER TABLE likes ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE bookmarks ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 6. Disable RLS on tables since we are using the Service Role Key on the backend
-- Note: With Clerk, Next.js acts as the secure backend. We bypass RLS using the Service Role Key.
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE author_profile DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_hero DISABLE ROW LEVEL SECURITY;
ALTER TABLE book_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE buy_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE journey_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers DISABLE ROW LEVEL SECURITY;
