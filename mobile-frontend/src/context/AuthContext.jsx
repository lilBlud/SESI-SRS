import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '../services/userService';
import { setAuthToken } from '../services/apiConfig';

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
        const isDemo = parsed.fullName === 'Demo User' || parsed.staffId === 'DEMO-001' || parsed.email === 'demo@sesb.com.my' || Number(parsed.id) === 9999;
        if (isDemo) {
          parsed.division = 'Information & Digital';
          parsed.role = 'Staff';
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
    const { token, ...safeUser } = userData || {};
    if (token) setAuthToken(token);
    try { localStorage.setItem('sesi_user', JSON.stringify(safeUser)); } catch {}
    try { sessionStorage.removeItem('dismissedInstallPrompt'); } catch {}
    setUser(safeUser);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    try {
      localStorage.removeItem('sesi_user');
      sessionStorage.removeItem('dismissedInstallPrompt');
      localStorage.removeItem('sesi_passcode_unlocked');
    } catch {}
    setIsPasscodeUnlocked(false);
    setUser(null);
  }, []);

  // Sync latest user profile & refresh backend token on mount (skip offline demo user)
  useEffect(() => {
    const isDemo =
      !user ||
      Number(user.id) === 9999 ||
      user.staffId === 'DEMO-001' ||
      user.email === 'demo@sesb.com.my';
    if (isDemo) return;

    if (user?.email || user?.fullName || user?.staffId) {
      const u = user.email || user.fullName || user.staffId;
      getUserProfile(u)
        .then(data => {
          if (data) {
            if (data.token) setAuthToken(data.token);
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
  }, [user, user?.email, user?.fullName, user?.staffId, handleUpdateUser]);

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
