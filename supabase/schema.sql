-- Run this in your Supabase SQL Editor

-- authors (single row for now)
create table if not exists authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  avatar_url text,
  social_links jsonb
);

-- stories
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  catalog_no int unique not null,
  title text not null,
  excerpt text,
  body_mdx text not null,
  category text not null,
  series text,
  read_time_minutes int,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- users (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

-- Automatically create a profile when a user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- likes
create table if not exists likes (
  user_id uuid references profiles(id) on delete cascade,
  story_id uuid references stories(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, story_id)
);

-- bookmarks
create table if not exists bookmarks (
  user_id uuid references profiles(id) on delete cascade,
  story_id uuid references stories(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, story_id)
);

-- comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references stories(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  body text not null,
  status text default 'pending', -- pending | approved | rejected
  created_at timestamptz default now()
);

-- RLS POLICIES

-- Enable RLS
alter table authors enable row level security;
alter table stories enable row level security;
alter table profiles enable row level security;
alter table likes enable row level security;
alter table bookmarks enable row level security;
alter table comments enable row level security;

-- Stories: anyone can read
create policy "Stories are viewable by everyone" on stories for select using (true);

-- Profiles: users can read all, but only update their own
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Likes: anyone can read, users can insert/delete their own
create policy "Likes are viewable by everyone" on likes for select using (true);
create policy "Users can insert own likes" on likes for insert with check (auth.uid() = user_id);
create policy "Users can delete own likes" on likes for delete using (auth.uid() = user_id);

-- Bookmarks: only the user can see their own bookmarks
create policy "Users can view own bookmarks" on bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert own bookmarks" on bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can delete own bookmarks" on bookmarks for delete using (auth.uid() = user_id);

-- Comments: anyone can read APPROVED comments, users can read their own pending, users can insert
create policy "Approved comments are viewable by everyone" on comments for select using (status = 'approved');
create policy "Users can view own pending comments" on comments for select using (auth.uid() = user_id);
create policy "Users can insert own comments" on comments for insert with check (auth.uid() = user_id);

-- Disable service role bypass so you don't accidentally expose things (optional, standard Supabase relies on auth.uid())

-- newsletter subscribers
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text default 'active', -- active | unsubscribed
  subscribed_at timestamptz default now()
);

-- Subscribers RLS
alter table subscribers enable row level security;
-- Anyone can insert a new subscriber (we will use a service key or anon key depending on how we submit, but usually anon can insert)
create policy "Anyone can insert a subscriber" on subscribers for insert with check (true);
-- Nobody can read subscribers via the public API
create policy "No public read access to subscribers" on subscribers for select using (false);
