import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage PWA installation prompt lifecycle and banner visibility.
 * Detects standalone browser mode, handles the beforeinstallprompt event,
 * and maintains dismissal state in sessionStorage.
 *
 * @param {object|null} user - Current user object
 */
export function useInstallPrompt(user) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Capture PWA install event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Check standalone mode and show prompt if user is logged in
  useEffect(() => {
    if (user) {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = ('standalone' in window.navigator) && window.navigator.standalone === true;
      const hasDismissed = sessionStorage.getItem('dismissedInstallPrompt');

      // Clear any legacy localStorage suppression
      try { localStorage.removeItem('dismissedInstallPrompt'); } catch {}

      if (!isStandalone && !isIosStandalone && !hasDismissed) {
        const timer = setTimeout(() => setShowInstallPrompt(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const dismissInstallPrompt = useCallback(() => {
    setShowInstallPrompt(false);
    try { sessionStorage.setItem('dismissedInstallPrompt', 'true'); } catch {}
  }, []);

  const triggerInstallPrompt = useCallback(() => {
    setShowInstallPrompt(true);
  }, []);

  return {
    showInstallPrompt,
    setShowInstallPrompt,
    deferredPrompt,
    dismissInstallPrompt,
    triggerInstallPrompt
  };
}

