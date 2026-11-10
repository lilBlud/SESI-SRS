import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '../services/userService';

const AuthContext = createContext({
  user: null,
  isPasscodeUnlocked: false,
  setIsPasscodeUnlocked: () => {},
  handleUpdateUser: () => {},
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [isPasscodeUnlocked, setIsPasscodeUnlocked] = useState(() => {
    try {
      return localStorage.getItem('sesi_passcode_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sesi_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.division || parsed.division === 'General' || parsed.fullName === 'Demo User' || parsed.staffId === 'DEMO-001' || parsed.email === 'demo@sesb.com.my') {
          parsed.division = 'Information & Digital';
          if (parsed.email === 'demo@sesb.com.my' || parsed.fullName === 'Demo User') {
            parsed.role = 'Staff';
          }
          try { localStorage.setItem('sesi_user', JSON.stringify(parsed)); } catch {}
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const handleUpdateUser = useCallback((updatedData) => {
    setUser(prev => {
      if (!prev) return prev;
      let hasChange = false;
      for (const [k, v] of Object.entries(updatedData)) {
        if (prev[k] !== v) {
          hasChange = true;
          break;
        }
      }
      if (!hasChange) return prev;
      const next = { ...prev, ...updatedData };
      try { localStorage.setItem('sesi_user', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const login = useCallback((userData) => {
    try { localStorage.setItem('sesi_user', JSON.stringify(userData)); } catch {}
    try { sessionStorage.removeItem('dismissedInstallPrompt'); } catch {}
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('sesi_user');
      sessionStorage.removeItem('dismissedInstallPrompt');
      localStorage.removeItem('sesi_passcode_unlocked');
    } catch {}
    setIsPasscodeUnlocked(false);
    setUser(null);
  }, []);

  // Sync latest user profile from active data provider with shallow equality
  useEffect(() => {
    if (user?.email || user?.fullName || user?.staffId) {
      const u = user.email || user.fullName || user.staffId;
      getUserProfile(u)
        .then(data => {
          if (data) {
            handleUpdateUser({
              ...(data.profilePicture !== undefined ? { profilePicture: data.profilePicture || '' } : {}),
              ...(data.preferredName !== undefined ? { preferredName: data.preferredName || '' } : {}),
              ...(data.division ? { division: data.division } : {}),
              ...(data.role ? { role: data.role } : {})
            });
          }
        })
        .catch(err => {
          console.warn("User profile sync failed:", err);
        });
    }
  }, [user?.email, user?.fullName, user?.staffId, handleUpdateUser]);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isPasscodeUnlocked,
      setIsPasscodeUnlocked,
      handleUpdateUser,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
