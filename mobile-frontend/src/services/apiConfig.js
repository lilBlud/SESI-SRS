import { createClient } from '@supabase/supabase-js';

const isLocalHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE = (
  import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE || 'http://localhost:5195')
    : (isLocalHost ? '' : (import.meta.env.VITE_API_BASE || 'https://reliable-rider-arrival-approx.trycloudflare.com'))
).replace(/\/$/, '');

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://avlypjdoahothehakchf.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__T0Lcs6Js5Iy8x3EVnMhsw_6Cj_gcxv';

/**
 * Local environment connects strictly to local SSMS via C# API.
 * Cloudflare Pages connects strictly to Supabase Cloud.
 */
export const IS_LOCAL_SSMS = Boolean(import.meta.env.DEV || isLocalHost);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

