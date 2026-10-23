import React, { useState, useEffect, useCallback } from 'react';
import { AdminTab, HomeTab, GlossaryTab, QuizTab, ProfileTab } from './components/tabs';
import LoginPage from './components/pages/LoginPage';
import PasscodeGate from './components/pages/PasscodeGate';
import { API_BASE } from './utils/constants.js';
import { getGlossaryDirect, getUserProfileDirect, getUserStreakDirect } from './utils/supabaseClient.js';
import { HomeIcon, BookIcon, QuizIcon, ProfileIcon } from './components/ui';
import { useBookmarks } from './hooks/useBookmarks';
import { useVisitorTracking } from './hooks/useVisitorTracking';

function App() {
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
          parsed.division = 'IDD';
          try { localStorage.setItem('sesi_user', JSON.stringify(parsed)); } catch { }
        }
        return parsed;
      }
      return null;
    } catch { return null; }
  });
  const [activeTab, setActiveTab] = useState('home');
  const [activeGlossaryCat, setActiveGlossaryCat] = useState('All');
  const [isDark, setIsDark] = useState(false);
  const [glossary, setGlossary] = useState([]);
  const [streak, setStreak] = useState(0);
  const [streakToast, setStreakToast] = useState(null); // toast notification at root level
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (user) {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = ('standalone' in window.navigator) && window.navigator.standalone === true;
      const hasDismissed = sessionStorage.getItem('dismissedInstallPrompt');

      // Clear any old suppression so beta testers always get prompted
      localStorage.removeItem('dismissedInstallPrompt');

      if (!isStandalone && !isIosStandalone && !hasDismissed) {
        const timer = setTimeout(() => setShowInstallPrompt(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    try { sessionStorage.setItem('dismissedInstallPrompt', 'true'); } catch { }
  };

  const bookmarkActions = useBookmarks();

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // Fetch glossary from DB
  const fetchGlossary = useCallback(() => {
    getGlossaryDirect()
      .then(d => {
        if (d && d.length > 0) {
          setGlossary(d);
        }
      })
      .catch(err => {
        console.warn("Direct Supabase glossary fetch failed:", err);
      });
  }, []);

  useEffect(() => { fetchGlossary(); }, [fetchGlossary]);

  // Fetch streak on mount and whenever user logs in
  useEffect(() => {
    if (user) {
      getUserStreakDirect(user)
        .then(res => {
          if (res && typeof res.streak === 'number') {
            setStreak(res.streak);
          }
        })
        .catch(err => {
          console.warn("Direct streak fetch failed:", err);
        });
    } else {
      setStreak(0);
    }
  }, [user]);

  // Sync latest user profile (including avatar, preferredName, and division if updated)
  useEffect(() => {
    if (user?.email || user?.fullName || user?.staffId) {
      const u = user.email || user.fullName || user.staffId;
      getUserProfileDirect(u)
        .then(data => {
          if (data) {
            const updates = {};
            if (data.profilePicture !== undefined && data.profilePicture !== user.profilePicture) {
              updates.profilePicture = data.profilePicture;
            }
            if (data.preferredName !== undefined && data.preferredName !== user.preferredName) {
              updates.preferredName = data.preferredName;
            }
            if (data.division && data.division !== user.division) {
              updates.division = data.division;
            }
            if (Object.keys(updates).length > 0) {
              handleUpdateUser(updates);
            }
          }
        })
        .catch(err => {
          console.warn("Direct profile sync failed:", err);
        });
    }
  }, [user?.email, user?.fullName, user?.staffId, user?.division, user?.profilePicture, user?.preferredName]);

  // Visitor Tracking
  const { visitorStats, refreshVisitorStats } = useVisitorTracking(user);

  const [hasShownAlreadySaved, setHasShownAlreadySaved] = useState(false);

  // Handle streak updates from child components
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

  const tabs = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'glossary', label: 'Dictionary', Icon: BookIcon },
    { id: 'quiz', label: 'Hub', Icon: QuizIcon },
    { id: 'profile', label: 'Profile', Icon: ProfileIcon },
  ];

  const handleLogin = (userData) => {
    try { localStorage.setItem('sesi_user', JSON.stringify(userData)); } catch { }
    try { sessionStorage.removeItem('dismissedInstallPrompt'); } catch { }
    setUser(userData);
    
    // Trigger install popup 700ms after login if on browser (not installed app)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIosStandalone = ('standalone' in window.navigator) && window.navigator.standalone === true;
    if (!isStandalone && !isIosStandalone) {
      setTimeout(() => setShowInstallPrompt(true), 700);
    }
  };

  const handleLogout = () => {
    try { localStorage.removeItem('sesi_user'); } catch { }
    try { sessionStorage.removeItem('dismissedInstallPrompt'); } catch { }
    try { localStorage.removeItem('sesi_passcode_unlocked'); } catch { }
    setIsPasscodeUnlocked(false);
    setUser(null);
  };

  const handleUpdateUser = (updatedData) => {
    setUser(prev => {
      const next = { ...prev, ...updatedData };
      try { localStorage.setItem('sesi_user', JSON.stringify(next)); } catch { }
      return next;
    });
  };

  useEffect(() => {
    if (user && (user.fullName === 'Demo User' || user.staffId === 'DEMO-001') && user.division !== 'IDD') {
      handleUpdateUser({ division: 'IDD' });
    }
  }, [user]);

  if (!isPasscodeUnlocked) {
    return (
      <PasscodeGate
        isDark={isDark}
        onUnlock={() => {
          setIsPasscodeUnlocked(true);
          try { localStorage.setItem('sesi_passcode_unlocked', 'true'); } catch { }
        }}
      />
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`h-[100vh] overflow-hidden flex flex-col text-slate-900 transition-colors duration-200 w-full max-w-[430px] mx-auto relative shadow-2xl ${isDark ? 'dark:text-slate-100' : ''}`}>
      {/* Hardware Accelerated HD Background Image */}
      <img
        src={isDark ? '/assets/hd_dark_topo.jpg' : '/assets/hd_light_topo.jpg'}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center -z-20 pointer-events-none"
      />
      {/* Dark Mode Text Contrast Overlay */}
      {isDark && <div className="absolute inset-0 bg-slate-950/50 -z-10 pointer-events-none"></div>}

      {/* Root level Toast Notification */}
      {streakToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-orange-500 text-white px-5 py-3 rounded-2xl shadow-xl shadow-orange-500/30 text-[13px] font-bold animate-scaleIn whitespace-nowrap">
          {streakToast}
        </div>
      )}

      {/* ─── CRISP, SOLID TOP BAR ─── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 safe-area-top shrink-0">
        <div className="flex items-center justify-between px-4 h-16">

          {/* ─── LOGO AREA + BACK BUTTON ─── */}
          <div className="flex items-center gap-2.5">
            {/* Back Button - shown when not on home */}
            {activeTab !== 'home' && (
              <button
                onClick={() => setActiveTab('home')}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shrink-0 mr-0.5 border border-slate-200/60 dark:border-slate-700/60"
                aria-label="Back to home"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs p-0.5">
              <img
                src="/assets/logo.png"
                alt="S&S Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center select-none">
              <span className="text-[20px] font-black tracking-tight leading-none text-[#059669] dark:text-[#34d399]" style={{ textRendering: 'geometricPrecision' }}>
                SESI
              </span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-0.5 leading-none tracking-tight">
                Sabah Electricity Supply Industry
              </span>
            </div>
          </div>

          {/* ─── ACTIONS AREA ─── */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Streak Badge */}
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 border border-orange-200/50 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 px-2.5 py-1.5 rounded-full shadow-sm shrink-0">
                <span className="text-[12px] leading-none">🔥</span>
                <span className="text-[13px] font-black leading-none">{streak}</span>
              </div>
            )}

            {/* Settings/Theme Pill Group */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 shrink-0">

              {/* Admin Button */}
              <button
                onClick={() => setActiveTab('admin')}
                className="w-8 h-8 flex items-center justify-center rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all relative"
                aria-label="Admin settings"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {/* Small indicator dot to make it pop */}
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border-[1.5px] border-slate-100 dark:border-slate-800"></div>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all hover:text-slate-900 dark:hover:text-white"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-8 h-8 flex items-center justify-center rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:shadow-sm transition-all hover:text-rose-600"
                aria-label="Sign out"
              >
                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-container px-4 pt-4 pb-20">
        {activeTab === 'home' && <HomeTab user={user} streak={streak} glossary={glossary} setActiveTab={setActiveTab} setActiveGlossaryCat={setActiveGlossaryCat} isDark={isDark} bookmarkActions={bookmarkActions} onUpdateUser={handleUpdateUser} visitorStats={visitorStats} triggerInstallPrompt={() => setShowInstallPrompt(true)} />}
        {activeTab === 'glossary' && <GlossaryTab user={user} glossary={glossary} onStreakUpdate={handleStreakUpdate} activeGlossaryCat={activeGlossaryCat} setActiveGlossaryCat={setActiveGlossaryCat} bookmarkActions={bookmarkActions} isDark={isDark} />}
        {activeTab === 'quiz' && <QuizTab user={user} streak={streak} setActiveTab={setActiveTab} onStreakUpdate={handleStreakUpdate} />}
        {activeTab === 'profile' && <ProfileTab user={user} bookmarkActions={bookmarkActions} setActiveTab={setActiveTab} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'admin' && (
          <AdminTab
            onGlossaryChange={fetchGlossary}
            visitorStats={visitorStats}
            onRefreshVisitorStats={refreshVisitorStats}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-50 pb-3">
        <div className="flex items-center justify-around h-[68px] px-2">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex flex-col items-center justify-center w-[68px] h-[60px] mx-1 rounded-2xl transition-all ${activeTab === id ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'opacity-60'}`}>
              <div className={`flex flex-col items-center justify-center gap-1.5 ${activeTab === id ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Icon active={activeTab === id} />
                <span className="text-[11px] font-bold leading-none">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Install App Popup */}
      {showInstallPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-fadeIn text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>

            <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2">Install SESI App</h3>

            <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              For the best experience, install this app on your device!
              {deferredPrompt ? (
                <>
                  <br /><br />
                  <span className="text-[12px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block text-left">
                    <strong>Android:</strong><br />
                    Tap the <strong>Install App</strong> button below to add it directly to your home screen!
                  </span>
                </>
              ) : (
                <>
                  <br /><br />
                  <span className="text-[12px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block text-left">
                    <strong>iOS / iPhone:</strong><br />
                    Tap <strong className="text-slate-700 dark:text-slate-200">Share</strong> <svg className="inline w-4 h-4 text-slate-700 dark:text-slate-200 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> then <strong className="text-slate-700 dark:text-slate-200">Add to Home Screen</strong> <svg className="inline w-4 h-4 text-slate-700 dark:text-slate-200 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </span>
                </>
              )}
            </p>

            <div className="flex gap-2">
              <button onClick={dismissInstallPrompt} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all active:scale-95">
                Not Now
              </button>
              <button onClick={() => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then(({ outcome }) => {
                    if (outcome === 'accepted') {
                      setDeferredPrompt(null);
                      setShowInstallPrompt(false);
                    }
                  });
                } else {
                  alert("To install on iOS: Tap the 'Share' icon in Safari (at the bottom), then select 'Add to Home Screen'.");
                }
              }} className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/30">
                Install App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
