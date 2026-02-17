import { createClient } from '@supabase/supabase-js';

// Use localhost:8090 (Kong direct) for server-side calls to avoid nginx SSL issues
// External clients still use https://db.techtrendi.com
const isServer = typeof window === 'undefined';
const supabaseUrl = isServer
  ? 'http://localhost:8090'
  : (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://db.techtrendi.com');

// Default anon key for build time - will be overridden by env at runtime
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.lbPqMemEL_VFnCma2zeuJ1MfFLNQ7_VXRgaacXeeReQ';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Configure Supabase client to use 'public' schema for news articles
// The db.techtrendi.com PostgREST exposes both 'siteops' and 'public' schemas
// Default is 'siteops', so we need to specify 'public' for news_articles table
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'public' },
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
    },
  },
});

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: 'public' },
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });
        },
      },
    })
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
