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

  const installApp = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          setDeferredPrompt(null);
          setShowInstallPrompt(false);
        }
      } catch {
        setShowInstallPrompt(false);
      }
    } else {
      alert("To install on iOS: Tap the 'Share' icon in Safari (at the bottom), then select 'Add to Home Screen'.");
    }
  }, [deferredPrompt]);

  return {
    showInstallPrompt,
    setShowInstallPrompt,
    deferredPrompt,
    dismissInstallPrompt,
    triggerInstallPrompt,
    installApp
  };
}
