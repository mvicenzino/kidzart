# Database Architecture Review & Revamp

## Executive Summary
Current data persistence relies on `localStorage` and `mockData`, which is suitable for prototyping but insufficient for a production-grade application. To support multi-device access, social features (likes/sharing), and data durability, we must transition to a relational database system.

**Decision:** Adopt **Supabase (PostgreSQL)** as the primary data store.
**Auth Provider:** **Clerk** (already implemented).
**Strategy:** "Headless" User Management (Clerk) with "Shadow" Profiles in Postgres.

---

## 1. Schema Design

### A. Profiles Table
*Purpose:* Links Clerk authentication to our internal data model.
*Notes:* We use the Clerk User ID as the Primary Key for 1:1 mapping.

```sql
create table profiles (
  id text primary key, -- Matches Clerk User ID
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### B. Children (Artists) Table
*Purpose:* Represents the "sub-profiles" managed by a parent user.
*Relationships:* Belongs to Profile (Parent).

```sql
create table children (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade not null,
  name text not null,
  birth_date date, -- Preferred over integer 'age' for longevity
  avatar_emoji text default '🎨',
  description text,
  created_at timestamptz default now()
);
```

### C. Artworks Table
*Purpose:* Stores metadata for uploaded art.
*Relationships:* Belongs to Child (Artist).

```sql
create table artworks (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade not null,
  user_id text references profiles(id) on delete cascade not null, -- Denormalized for simpler RLS
  title text not null,
  description text,
  medium text, -- Enum-like string (e.g., 'crayon', 'paint')
  theme text, -- Enum-like string
  image_path text not null, -- Path in Supabase Storage bucket 'artworks'
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### D. Likes (Appreciations)
*Purpose:* Social validation.
*Relationships:* User likes Artwork.

```sql
create table likes (
  id uuid primary key default gen_random_uuid(),
  user_id text references profiles(id) on delete cascade not null,
  artwork_id uuid references artworks(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, artwork_id) -- Prevent duplicate likes
);
```

---

## 2. Security Model (RLS - Row Level Security)

**Philosophy:** "Secure by Default".

1.  **Profiles:**
    *   Read: Authenticated users (for social features) OR Users can only read their own (tbd based on privacy requirements). *Proposal: Public Read, Owner Write.*
    *   Write: Owner only (id = auth.uid()).

2.  **Children:**
    *   Read: Public (if we want shared galleries) or Owner only. *Proposal: Owner only (initially), shared via specific shared links.*
    *   Write: Owner only.

3.  **Artworks:**
    *   Read: Public (for 'Explore' feed) or Owner only. *Proposal: Publicly readable if `is_public` is true.*
    *   Write: Owner only.

---

## 3. Storage (Buckets)

*   **Bucket Name:** `artworks`
*   **Policy:**
    *   Read: Public.
    *   Upload: Authenticated Users only.
    *   Limit: 10MB per file, Images only.

---

## 4. Development vs Production Workflow

To ensure seamless transitions:

1.  **Local Development:**
    *   Use `mockData`/`localStorage` hooks initially (Current State).
    *   **Phase 2:** Connect to a "Dev" Supabase project.
    *   **Phase 3 (Recommended):** Run Supabase locally via Docker (`npx supabase start`). This is the "Gold Standard" for Data Engineering.

2.  **Environment Variables:**
    *   Need strictly separated keys for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

3.  **Migrations:**
    *   All schema changes MUST be SQL files in `supabase/migrations`.
    *   No unconditional GUI edits in Production.

## 5. Implementation Roadmap

1.  [x] Define Schema (This Document).
2.  [ ] Create `src/lib/supabase.js` client.
3.  [ ] Push Schema to Supabase Project.
4.  [ ] Create `UseSupabase` data hooks to replace `UseLocalStorage` hooks.
5.  [ ] Migrate data (if any).
