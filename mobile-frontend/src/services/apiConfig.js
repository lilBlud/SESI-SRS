import { createClient } from '@supabase/supabase-js';

const explicitProvider = import.meta.env.VITE_DATA_PROVIDER?.toLowerCase();

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

export const AUTH_TOKEN_KEY = 'sesi_auth_token';

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://avlypjdoahothehakchf.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__T0Lcs6Js5Iy8x3EVnMhsw_6Cj_gcxv';

/**
 * Local environment connects strictly to local SSMS via C# API on IIS / Intranet.
 * Cloudflare Pages connects strictly to Supabase Cloud.
 * Can also be overridden explicitly via VITE_DATA_PROVIDER ('supabase' | 'ssms').
 */
export const IS_LOCAL_SSMS = explicitProvider
  ? explicitProvider === 'ssms'
  : !isCloudflarePages;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
