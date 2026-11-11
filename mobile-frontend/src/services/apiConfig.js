import { createClient } from '@supabase/supabase-js';

const isCloudflarePages = typeof window !== 'undefined' && (
  window.location.hostname.endsWith('.pages.dev') ||
  window.location.hostname.endsWith('.workers.dev')
);

const isLocalHost = typeof window !== 'undefined' && !isCloudflarePages;

export const API_BASE = (
  import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE || '')
    : (isLocalHost ? '' : (import.meta.env.VITE_API_BASE || ''))
).replace(/\/$/, '');

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://avlypjdoahothehakchf.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__T0Lcs6Js5Iy8x3EVnMhsw_6Cj_gcxv';

/**
 * Local environment connects strictly to local SSMS via C# API on IIS / Intranet.
 * Cloudflare Pages connects strictly to Supabase Cloud.
 */
export const IS_LOCAL_SSMS = !isCloudflarePages;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

