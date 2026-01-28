import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://db.techtrendi.com';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  original_content: string | null;
  source_url: string | null;
  source_name: string | null;
  image_url: string | null;
  image_alt: string | null;
  category: string;
  tags: string[] | null;
  tmdb_movie_id: number | null;
  tmdb_tv_id: number | null;
  status: 'draft' | 'pending' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views: number;
  is_ai_generated: boolean;
}

export interface Franchise {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  tmdb_collection_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface CuratedList {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  list_type: string;
  year: number | null;
  image_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'editor';
  status: 'active' | 'inactive' | 'suspended';
  last_login: string | null;
  created_at: string;
  updated_at: string;
}
