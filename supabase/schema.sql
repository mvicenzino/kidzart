-- KidzArt Database Schema
-- Version: 1.0.0
-- Author: Data Engineering

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Managed via Clerk hook or Client creation)
create table if not exists public.profiles (
  id text primary key, -- Explicitly text to match Clerk user_id
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. CHILDREN (The Artists)
create table if not exists public.children (
  id uuid primary key default uuid_generate_v4(),
  user_id text references public.profiles(id) on delete cascade not null,
  name text not null,
  birth_date date,
  avatar_emoji text default '🎨',
  description text,
  created_at timestamptz default now()
);

-- 3. ARTWORKS
create table if not exists public.artworks (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references public.children(id) on delete cascade not null,
  user_id text references public.profiles(id) on delete cascade not null, -- Denormalized for RLS efficiency
  title text not null,
  description text,
  medium text,
  theme text,
  image_path text not null, -- Storage path
  image_url text, -- Full public URL for convenience
  is_public boolean default true,
  likes_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. LIKES
create table if not exists public.likes (
  id uuid primary key default uuid_generate_v4(),
  user_id text references public.profiles(id) on delete cascade not null,
  artwork_id uuid references public.artworks(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, artwork_id)
);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.artworks enable row level security;
alter table public.likes enable row level security;

-- Policies

-- Profiles: Readable by everyone (for feeds), Writable only by owner
create policy "Public profiles are viewable by everyone" 
  on profiles for select using (true);

create policy "Users can insert their own profile" 
  on profiles for insert with check (auth.uid()::text = id);

create policy "Users can update own profile" 
  on profiles for update using (auth.uid()::text = id);

-- Children: Readable by owner (and potentially public if we want shared profiles)
-- For now, let's make them viewable by everyone to enable "Gallery" view
create policy "Children profiles are viewable by everyone" 
  on children for select using (true);

create policy "Users can insert their own children" 
  on children for insert with check (auth.uid()::text = user_id);

create policy "Users can update own children" 
  on children for update using (auth.uid()::text = user_id);

create policy "Users can delete own children" 
  on children for delete using (auth.uid()::text = user_id);

-- Artworks: Viewable by everyone, Writable by owner
create policy "Artworks are viewable by everyone" 
  on artworks for select using (true);

create policy "Users can insert their own artworks" 
  on artworks for insert with check (auth.uid()::text = user_id);

create policy "Users can update own artworks" 
  on artworks for update using (auth.uid()::text = user_id);

create policy "Users can delete own artworks" 
  on artworks for delete using (auth.uid()::text = user_id);

-- Likes: Viewable by everyone, Insertable by authenticated users
create policy "Likes are viewable by everyone" 
  on likes for select using (true);

create policy "Authenticated users can insert likes" 
  on likes for insert with check (auth.uid()::text = user_id);

create policy "Users can delete own likes" 
  on likes for delete using (auth.uid()::text = user_id);

-- FUNCTIONS (for computed columns or triggers)

-- Function to handle likes count (optional but good for performance)
create or replace function handle_new_like()
returns trigger as $$
begin
  update public.artworks
  set likes_count = likes_count + 1
  where id = new.artwork_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_like_created
  after insert on public.likes
  for each row execute procedure handle_new_like();

create or replace function handle_unlike()
returns trigger as $$
begin
  update public.artworks
  set likes_count = likes_count - 1
  where id = old.artwork_id;
  return old;
end;
$$ language plpgsql security definer;

create trigger on_like_deleted
  after delete on public.likes
  for each row execute procedure handle_unlike();
