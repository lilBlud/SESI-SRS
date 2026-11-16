import { useState, useEffect, useCallback, useRef } from 'react';
import { recordVisitorDirect, getVisitorStatsDirect } from '../utils/supabaseClient';

const STATS_STORAGE_KEY = 'sesi_cached_visitor_stats';

const DEFAULT_STATS = { totalVisits: 0, todayVisits: 0, uniqueVisitors: 0 };

/**
 * Custom hook to manage platform visitor tracking and analytics state.
 * Tracks only authenticated staff visits (ignoring pre-login anonymous sessions and Demo User).
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

  const lastRecordedKeyRef = useRef('');

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

  useEffect(() => {
    const cleanUsername = (user?.fullName || user?.preferredName || user?.email || '').trim();
    const isDemoOrAnon =
      !user ||
      !cleanUsername ||
      user?.id === 9999 ||
      cleanUsername.toLowerCase() === 'demo user' ||
      (user?.email || '').toLowerCase() === 'demo@sesb.com.my';

    if (isDemoOrAnon) {
      getVisitorStatsDirect()
        .then(stats => {
          if (stats) saveStats(stats);
        })
        .catch(() => {});
      return;
    }

    const visitorId = `staff_${user?.id || user?.staffId || user?.email || cleanUsername.toLowerCase().replace(/\s+/g, '_')}`;
    const cleanDivision = user?.division || 'Information & Digital';
    const currentKey = `${visitorId}:${cleanUsername}:${cleanDivision}`;

    if (lastRecordedKeyRef.current === currentKey) {
      return;
    }
    lastRecordedKeyRef.current = currentKey;

    const payload = {
      visitorId,
      username: cleanUsername,
      division: cleanDivision,
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      staffId: user?.id || null
    };

    recordVisitorDirect(payload)
      .then(stats => {
        if (stats) saveStats(stats);
      })
      .catch(err => {
        console.warn('Visitor tracking record error:', err);
      });
  }, [user, saveStats]);

  const refreshVisitorStats = useCallback(async () => {
    try {
      const stats = await getVisitorStatsDirect();
      if (stats) saveStats(stats);
      return stats;
    } catch (err) {
      console.warn('Visitor stats refresh error:', err);
      return null;
    }
  }, [saveStats]);

  return { visitorStats, refreshVisitorStats };
}
