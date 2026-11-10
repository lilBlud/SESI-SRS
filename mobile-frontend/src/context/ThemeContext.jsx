import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('sesi_theme');
      if (saved) return saved === 'dark';
      return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {
      return false;
    }
  });

  const toggleTheme = useCallback(() => {
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        setIsDark(prev => !prev);
      });
    } else {
      document.documentElement.classList.add('theme-transitioning');
      setIsDark(prev => !prev);
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 350);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('sesi_theme', 'dark'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('sesi_theme', 'light'); } catch {}
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

