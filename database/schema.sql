-- Kidzart Database Schema for PostgreSQL (Supabase/Neon)
-- Run this in your Supabase SQL Editor or PostgreSQL client

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Artists table (linked to Clerk users)
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  parent_name TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL CHECK (child_age >= 1 AND child_age <= 18),
  child_avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on clerk_user_id for faster lookups
CREATE INDEX idx_artists_clerk_user_id ON artists(clerk_user_id);

-- Artworks table
CREATE TABLE artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  image_storage_path TEXT, -- For Supabase storage reference
  thumbnail_url TEXT,
  
  -- Taxonomy
  age_at_creation INTEGER NOT NULL,
  age_group TEXT NOT NULL CHECK (age_group IN ('toddler', 'preschool', 'early-elementary', 'elementary', 'tween')),
  medium TEXT NOT NULL CHECK (medium IN ('crayon', 'markers', 'watercolor', 'colored-pencils', 'digital', 'mixed-media', 'finger-paint')),
  theme TEXT NOT NULL CHECK (theme IN ('animals', 'nature', 'family', 'fantasy', 'space', 'vehicles', 'abstract', 'food', 'ocean', 'buildings')),
  style TEXT CHECK (style IN ('realistic', 'abstract', 'cartoon', 'expressionist')),
  category TEXT CHECK (category IN ('Drawings', 'Paintings', 'Crafts')),
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_highlight BOOLEAN DEFAULT FALSE,
  
  -- Monetization
  print_enabled BOOLEAN DEFAULT TRUE,
  donation_enabled BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX idx_artworks_age_group ON artworks(age_group);
CREATE INDEX idx_artworks_medium ON artworks(medium);
CREATE INDEX idx_artworks_theme ON artworks(theme);
CREATE INDEX idx_artworks_is_highlight ON artworks(is_highlight);
CREATE INDEX idx_artworks_created_at ON artworks(created_at DESC);

-- Likes table (for tracking user likes)
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(artwork_id, clerk_user_id)
);

CREATE INDEX idx_likes_artwork_id ON likes(artwork_id);
CREATE INDEX idx_likes_user_id ON likes(clerk_user_id);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  donor_clerk_user_id TEXT,
  donor_name TEXT,
  donor_email TEXT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_donations_artwork_id ON donations(artwork_id);
CREATE INDEX idx_donations_artist_id ON donations(artist_id);

-- Print orders table
CREATE TABLE print_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
  buyer_clerk_user_id TEXT,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  
  -- Print details
  size TEXT NOT NULL CHECK (size IN ('8x10', '11x14', '16x20', '24x36')),
  quantity INTEGER DEFAULT 1,
  price_cents INTEGER NOT NULL,
  
  -- Shipping
  shipping_address JSONB,
  shipping_status TEXT DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'processing', 'shipped', 'delivered')),
  tracking_number TEXT,
  
  -- Payment
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'fulfilled', 'cancelled')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_print_orders_artwork_id ON print_orders(artwork_id);

-- Function to update likes count on artwork
CREATE OR REPLACE FUNCTION update_artwork_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE artworks SET likes_count = likes_count + 1 WHERE id = NEW.artwork_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE artworks SET likes_count = likes_count - 1 WHERE id = OLD.artwork_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for likes count
CREATE TRIGGER trigger_update_likes_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION update_artwork_likes_count();

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_artists_updated_at
BEFORE UPDATE ON artists
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_artworks_updated_at
BEFORE UPDATE ON artworks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_print_orders_updated_at
BEFORE UPDATE ON print_orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies for Supabase
-- Enable RLS on all tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_orders ENABLE ROW LEVEL SECURITY;

-- Artists: Users can read all, but only update their own
CREATE POLICY "Artists are viewable by everyone" ON artists FOR SELECT USING (true);
CREATE POLICY "Users can insert their own artist profile" ON artists FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own artist profile" ON artists FOR UPDATE USING (clerk_user_id = current_setting('request.jwt.claims')::json->>'sub');

-- Artworks: Everyone can read, artists can manage their own
CREATE POLICY "Artworks are viewable by everyone" ON artworks FOR SELECT USING (true);
CREATE POLICY "Artists can insert their own artworks" ON artworks FOR INSERT WITH CHECK (true);
CREATE POLICY "Artists can update their own artworks" ON artworks FOR UPDATE 
  USING (artist_id IN (SELECT id FROM artists WHERE clerk_user_id = current_setting('request.jwt.claims')::json->>'sub'));
CREATE POLICY "Artists can delete their own artworks" ON artworks FOR DELETE 
  USING (artist_id IN (SELECT id FROM artists WHERE clerk_user_id = current_setting('request.jwt.claims')::json->>'sub'));

-- Likes: Everyone can read, users can manage their own
CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE 
  USING (clerk_user_id = current_setting('request.jwt.claims')::json->>'sub');
