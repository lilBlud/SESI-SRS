import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, m } from 'motion/react';
import LoginPage from './features/auth/LoginPage';
import { EASE_OUT_EXPO } from './utils/motionConfig';
import PasscodeGate from './features/auth/PasscodeGate';
import { getGlossary } from './features/glossary/glossaryService';
import { getUserStreak } from './services/userService';
import {
  DesktopSidebar,
  DesktopHeader,
  TopographicBackground,
  MobileTopBar,
  MobileBottomNav,
  InstallAppModal
} from './components/layout';
import { useBookmarks } from './hooks/useBookmarks';
import { useVisitorTracking } from './hooks/useVisitorTracking';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { useAuth, useTheme } from './context';

const HomeTab = lazy(() => import('./features/home/HomeTab').then(m => ({ default: m.HomeTab })));
const GlossaryTab = lazy(() => import('./features/glossary/GlossaryTab').then(m => ({ default: m.GlossaryTab })));
const QuizTab = lazy(() => import('./features/quiz/QuizTab').then(m => ({ default: m.QuizTab })));
const ProfileTab = lazy(() => import('./features/profile/ProfileTab').then(m => ({ default: m.ProfileTab })));
const AdminTab = lazy(() => import('./features/admin/AdminTab'));

function App() {
  const { user, isPasscodeUnlocked, setIsPasscodeUnlocked, handleUpdateUser, login, logout } = useAuth();
  const { isDark, toggleTheme: handleToggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [activeGlossaryCat, setActiveGlossaryCat] = useState('All');
  const [glossary, setGlossary] = useState(() => {
    try {
      const cached = localStorage.getItem('sesi_glossary_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [streak, setStreak] = useState(0);
  const [streakToast, setStreakToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasShownAlreadySaved, setHasShownAlreadySaved] = useState(false);

  const bookmarkActions = useBookmarks();
  const { visitorStats, refreshVisitorStats } = useVisitorTracking(user);

  const fetchGlossary = useCallback(() => {
    return getGlossary()
      .then(data => {
        if (data && data.length > 0) {
          setGlossary(data);
          try {
            localStorage.setItem('sesi_glossary_cache', JSON.stringify(data));
          } catch {
            // Ignore quota errors on cached glossary
          }
        }
        return data;
      })
      .catch(err => {
        console.warn('Glossary fetch failed:', err);
      });
  }, []);

  useEffect(() => {
    fetchGlossary();
  }, [fetchGlossary]);

  const fetchStreak = useCallback(() => {
    if (!user) return Promise.resolve();
    return getUserStreak(user)
      .then(res => {
        if (res && typeof res.streak === 'number') {
          setStreak(res.streak);
        }
        return res;
      })
      .catch(err => {
        console.warn('Streak fetch failed:', err);
      });
  }, [user]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const {
    showInstallPrompt,
    setShowInstallPrompt,
    deferredPrompt,
    dismissInstallPrompt,
    triggerInstallPrompt,
    installApp
  } = useInstallPrompt(user);

  const handleGlobalRefresh = useCallback(async () => {
    await Promise.allSettled([
      fetchGlossary(),
      fetchStreak(),
      refreshVisitorStats ? refreshVisitorStats() : Promise.resolve()
    ]);
    setRefreshKey(k => k + 1);
  }, [fetchGlossary, fetchStreak, refreshVisitorStats]);

  const {
    pullDistance,
    isPulling,
    isRefreshing: isGlobalRefreshing,
    scrollContainerRef,
    touchHandlers
  } = usePullToRefresh(handleGlobalRefresh);

  const handleStreakUpdate = (newStreak, newlyRecorded = false) => {
    setStreak(newStreak);
    if (newlyRecorded) {
      setStreakToast(`🔥 Daily streak recorded! Day ${newStreak}`);
      setTimeout(() => setStreakToast(null), 3000);
    } else if (!hasShownAlreadySaved) {
      setStreakToast(`🔥 Streak already saved for today! Day ${newStreak}`);
      setHasShownAlreadySaved(true);
      setTimeout(() => setStreakToast(null), 3000);
    }
  };

  const handleLogin = (userData) => {
    login(userData);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIosStandalone = ('standalone' in window.navigator) && window.navigator.standalone === true;
    if (!isStandalone && !isIosStandalone) {
      setTimeout(() => setShowInstallPrompt(true), 700);
    }
  };

  const handleLogout = () => {
    logout();
    setStreak(0);
  };

  if (!isPasscodeUnlocked) {
    return (
      <PasscodeGate
        isDark={isDark}
        onUnlock={() => {
          setIsPasscodeUnlocked(true);
          try {
            localStorage.setItem('sesi_passcode_unlocked', 'true');
          } catch {
            // Ignore storage errors in restricted contexts
          }
        }}
      />
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`h-[100dvh] overflow-hidden flex flex-col lg:flex-row text-slate-900 transition-colors duration-200 app-shell-frame relative shadow-2xl ${isDark ? 'dark:text-slate-100' : ''}`}>
      <TopographicBackground isDark={isDark} />

      <DesktopSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        streak={streak}
        isDark={isDark}
        toggleTheme={handleToggleTheme}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative">
        <AnimatePresence>
          {streakToast && (
            <m.div
              key="streak-toast"
              initial={{ opacity: 0, y: -18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
              className="toast toast-top toast-center z-[100] pointer-events-none"
              role="status"
              aria-live="polite"
            >
              <div className="alert alert-warning bg-orange-500 text-white border-none shadow-xl shadow-orange-500/30 rounded-2xl px-5 py-3 text-[13px] font-bold whitespace-nowrap">
                <span>{streakToast}</span>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <DesktopHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          streak={streak}
        />

        <MobileTopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          streak={streak}
          user={user}
          isDark={isDark}
          toggleTheme={handleToggleTheme}
          onLogout={handleLogout}
        />

        <main
          ref={scrollContainerRef}
          {...touchHandlers}
          className="flex-1 overflow-y-auto scroll-container px-4 sm:px-6 lg:px-8 py-4 lg:py-8 pb-24 lg:pb-12 w-full"
        >
          <div className="w-full max-w-[2400px] mx-auto">
            {(pullDistance > 0 || isGlobalRefreshing) && (
              <div
                style={{
                  height: isGlobalRefreshing ? 44 : pullDistance,
                  opacity: isGlobalRefreshing ? 1 : Math.min(1, pullDistance / 35),
                  transition: isPulling ? 'none' : 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="overflow-hidden flex items-center justify-center pointer-events-none select-none text-slate-500 dark:text-slate-400 -mt-2 mb-2"
                aria-hidden="true"
              >
                <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-200/80 dark:border-slate-700/80">
                  {isGlobalRefreshing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] tracking-tight">
                        Refreshing feed...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${pullDistance >= 45 ? 'rotate-180 text-emerald-500' : 'text-slate-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <span className="text-[11px] font-medium tracking-tight">
                        {pullDistance >= 45 ? 'Release to refresh' : 'Pull to refresh'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center min-h-[50dvh] space-y-3 text-slate-400">
                  <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold">Loading view...</span>
                </div>
              }
            >
              {activeTab === 'home' && (
                <HomeTab
                  key={`home-${refreshKey}`}
                  user={user}
                  streak={streak}
                  setActiveTab={setActiveTab}
                  isDark={isDark}
                  bookmarkActions={bookmarkActions}
                  onUpdateUser={handleUpdateUser}
                  visitorStats={visitorStats}
                  triggerInstallPrompt={triggerInstallPrompt}
                />
              )}
              {activeTab === 'glossary' && (
                <GlossaryTab
                  key={`glossary-${refreshKey}`}
                  user={user}
                  glossary={glossary}
                  onStreakUpdate={handleStreakUpdate}
                  activeGlossaryCat={activeGlossaryCat}
                  setActiveGlossaryCat={setActiveGlossaryCat}
                  bookmarkActions={bookmarkActions}
                  isDark={isDark}
                />
              )}
              {activeTab === 'quiz' && (
                <QuizTab
                  key={`quiz-${refreshKey}`}
                  user={user}
                  streak={streak}
                  setActiveTab={setActiveTab}
                  onStreakUpdate={handleStreakUpdate}
                />
              )}
              {activeTab === 'profile' && (
                <ProfileTab
                  key={`profile-${refreshKey}`}
                  user={user}
                  bookmarkActions={bookmarkActions}
                  onUpdateUser={handleUpdateUser}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'admin' && (
                user?.role === 'Admin' ? (
                  <AdminTab
                    currentUser={user}
                    onClose={() => setActiveTab('home')}
                    onGlossaryChange={fetchGlossary}
                    visitorStats={visitorStats}
                    onRefreshVisitorStats={refreshVisitorStats}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[60dvh] text-center px-4 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center text-3xl shadow-sm">
                      🛡️
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">Admin Privileges Required</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Your account does not currently have administrator access. Please contact an existing administrator to grant access.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('home')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 active:scale-95"
                    >
                      Return to Home
                    </button>
                  </div>
                )
              )}
            </Suspense>
          </div>
        </main>

        <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <InstallAppModal
        isOpen={showInstallPrompt}
        deferredPrompt={deferredPrompt}
        onDismiss={dismissInstallPrompt}
        onInstall={installApp}
      />
    </div>
  );
}

export default App;
