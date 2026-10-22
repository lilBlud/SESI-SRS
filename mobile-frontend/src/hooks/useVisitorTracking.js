import { useState, useEffect, useCallback } from 'react';
import { recordVisitorDirect, getVisitorStatsDirect } from '../utils/supabaseClient';

const STATS_STORAGE_KEY = 'sesi_cached_visitor_stats';
const VISITOR_ID_KEY = 'sesi_visitor_id';

const DEFAULT_STATS = { totalVisits: 0, todayVisits: 0, uniqueVisitors: 0 };

/**
 * Custom hook to manage platform visitor tracking and analytics state.
 * Handles automatic device ID generation, 15-minute throttling via Supabase,
 * and seamless localStorage caching to avoid 0-flash UX delays.
 */
export function useVisitorTracking(user) {
  const [visitorStats, setVisitorStats] = useState(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const saveStats = useCallback((stats) => {
    if (!stats) return;
    setVisitorStats(stats);
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify({
        totalVisits: stats.totalVisits ?? 0,
        todayVisits: stats.todayVisits ?? 0,
        uniqueVisitors: stats.uniqueVisitors ?? 0
      }));
    } catch {}
  }, []);

  // Record visit on mount or when user profile info updates
  useEffect(() => {
    let visitorId = null;
    try {
      visitorId = localStorage.getItem(VISITOR_ID_KEY);
    } catch {}

    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      try {
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
      } catch {}
    }

    const payload = {
      visitorId,
      username: user?.fullName || user?.preferredName || '',
      division: user?.division || (user?.fullName ? 'IDD' : ''),
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      staffId: user?.id || null
    };

    recordVisitorDirect(payload)
      .then(stats => {
        if (stats) saveStats(stats);
      })
      .catch(err => {
        console.warn("Visitor tracking record error:", err);
      });
  }, [user?.fullName, user?.preferredName, user?.division, user?.id, saveStats]);

  // Expose manual refresh function for Admin dashboard and counter views
  const refreshVisitorStats = useCallback(async () => {
    try {
      const stats = await getVisitorStatsDirect();
      if (stats) saveStats(stats);
      return stats;
    } catch (err) {
      console.warn("Visitor stats refresh error:", err);
      return null;
    }
  }, [saveStats]);

  return { visitorStats, refreshVisitorStats };
}
