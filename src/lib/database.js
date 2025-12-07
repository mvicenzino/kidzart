/**
 * Database client for Kidzart
 * Supports Supabase PostgreSQL
 * 
 * To use:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Run the schema.sql in the SQL Editor
 * 3. Add your credentials to .env.local:
 *    VITE_SUPABASE_URL=your_project_url
 *    VITE_SUPABASE_ANON_KEY=your_anon_key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isDbConfigured = !!supabase;

// Helper to get age group from age
export const getAgeGroup = (age) => {
    if (age <= 3) return 'toddler';
    if (age <= 5) return 'preschool';
    if (age <= 7) return 'early-elementary';
    if (age <= 9) return 'elementary';
    return 'tween';
};

// Artwork operations
export const artworkService = {
    // Get all artworks with optional filters
    async getAll(filters = {}) {
        if (!supabase) return { data: [], error: 'Database not configured' };

        let query = supabase
            .from('artworks')
            .select(`
        *,
        artist:artists(id, child_name, child_age, child_avatar_url)
      `)
            .order('created_at', { ascending: false });

        if (filters.ageGroup && filters.ageGroup !== 'all') {
            query = query.eq('age_group', filters.ageGroup);
        }
        if (filters.medium && filters.medium !== 'all') {
            query = query.eq('medium', filters.medium);
        }
        if (filters.theme && filters.theme !== 'all') {
            query = query.eq('theme', filters.theme);
        }
        if (filters.isHighlight !== undefined) {
            query = query.eq('is_highlight', filters.isHighlight);
        }

        return query;
    },

    // Get single artwork by ID
    async getById(id) {
        if (!supabase) return { data: null, error: 'Database not configured' };

        return supabase
            .from('artworks')
            .select(`
        *,
        artist:artists(id, child_name, child_age, child_avatar_url, parent_name)
      `)
            .eq('id', id)
            .single();
    },

    // Create new artwork
    async create(artwork) {
        if (!supabase) return { data: null, error: 'Database not configured' };

        return supabase
            .from('artworks')
            .insert([{
                ...artwork,
                age_group: getAgeGroup(artwork.age_at_creation)
            }])
            .select()
            .single();
    },

    // Update artwork
    async update(id, updates) {
        if (!supabase) return { data: null, error: 'Database not configured' };

        return supabase
            .from('artworks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
    },

    // Delete artwork
    async delete(id) {
        if (!supabase) return { data: null, error: 'Database not configured' };

        return supabase
            .from('artworks')
            .delete()
            .eq('id', id);
    },

    // Increment view count
    async incrementViews(id) {
        if (!supabase) return;

        return supabase.rpc('increment_views', { artwork_id: id });
    }
};

// Artist operations
export const artistService = {
    // Get or create artist profile
    async getOrCreate(clerkUserId, profileData) {
        if (!supabase) return { data: null, error: 'Database not configured' };

        // First try to get existing profile
        const { data: existing } = await supabase
            .from('artists')
            .select('*')
            .eq('clerk_user_id', clerkUserId)
            .single();

        if (existing) return { data: existing, error: null };

        // Create new profile
        return supabase
            .from('artists')
            .insert([{
                clerk_user_id: clerkUserId,
                ...profileData
            }])
            .select()
            .single();
    },

    // Get artist by Clerk user ID
    async getByClerkId(clerkUserId) {
        if (!supabase) return { data: null, error: 'Database not configured' };

        return supabase
            .from('artists')
            .select('*')
            .eq('clerk_user_id', clerkUserId)
            .single();
    },

    // Get artist's artworks
    async getArtworks(artistId) {
        if (!supabase) return { data: [], error: 'Database not configured' };

        return supabase
            .from('artworks')
            .select('*')
            .eq('artist_id', artistId)
            .order('created_at', { ascending: false });
    }
};

// Likes operations
export const likesService = {
    // Toggle like on artwork
    async toggle(artworkId, clerkUserId) {
        if (!supabase) return { liked: false, error: 'Database not configured' };

        // Check if already liked
        const { data: existing } = await supabase
            .from('likes')
            .select('id')
            .eq('artwork_id', artworkId)
            .eq('clerk_user_id', clerkUserId)
            .single();

        if (existing) {
            // Unlike
            await supabase.from('likes').delete().eq('id', existing.id);
            return { liked: false, error: null };
        } else {
            // Like
            await supabase.from('likes').insert([{
                artwork_id: artworkId,
                clerk_user_id: clerkUserId
            }]);
            return { liked: true, error: null };
        }
    },

    // Check if user liked artwork
    async isLiked(artworkId, clerkUserId) {
        if (!supabase) return false;

        const { data } = await supabase
            .from('likes')
            .select('id')
            .eq('artwork_id', artworkId)
            .eq('clerk_user_id', clerkUserId)
            .single();

        return !!data;
    }
};

// Image upload to Supabase Storage
export const storageService = {
    async uploadImage(file, artistId) {
        if (!supabase) return { url: null, error: 'Database not configured' };

        const fileExt = file.name.split('.').pop();
        const fileName = `${artistId}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('artworks')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) return { url: null, path: null, error };

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('artworks')
            .getPublicUrl(fileName);

        return {
            url: publicUrl,
            path: fileName,
            error: null
        };
    },

    async deleteImage(path) {
        if (!supabase) return { error: 'Database not configured' };

        return supabase.storage
            .from('artworks')
            .remove([path]);
    }
};
