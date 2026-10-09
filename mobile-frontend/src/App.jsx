import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AdminTab from './components/tabs/AdminTab';
import LoginPage from './components/pages/LoginPage';
import { mockGlossary } from './utils/mockData.js';
import { API_BASE } from './utils/constants.js';


import { HomeIcon, BookIcon, QuizIcon, ProfileIcon, FloatingParticles } from './components/ui/Icons';
import { useBookmarks } from './hooks/useBookmarks';
import { HomeTab } from './components/tabs/HomeTab';
import { GlossaryTab } from './components/tabs/GlossaryTab';
import { QuizTab } from './components/tabs/QuizTab';
import { ProfileTab } from './components/tabs/ProfileTab';

// --- MOCK API INTERCEPTOR FOR OFFLINE CLOUDFLARE DEMO ---
if (false) {
  window.__MOCK_FETCH_ADDED__ = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const [url, options] = args;
    const urlString = typeof url === 'string' ? url : (url?.url || '');
    
    if (urlString.includes('/api/glossary')) {
      return new Response(JSON.stringify(mockGlossary), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (urlString.includes('/api/leaderboard')) {
      return new Response(JSON.stringify([
        { staffId: 'DEMO-001', username: 'Demo User', division: 'CEO Office', score: 120 },
        { staffId: 'EMP-892', username: 'Ahmad Faiz', division: 'Finance', score: 95 },
        { staffId: 'EMP-301', username: 'Sarah Tan', division: 'Corporate Planning', score: 80 }
      ]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (urlString.includes('/api/quiz')) {
      return new Response(JSON.stringify([
        { id: 1, question: "What does IBR stand for?", options: ["Incentive-Based Regulation","Internal Business Rules","International Banking Rates","Integrated Baseline Review"], correctIndex: 0 },
        { id: 2, question: "Which is a component of Corporate Performance?", options: ["EBIT","SAIFI","CAIDI","BBM"], correctIndex: 0 }
      ]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (urlString.includes('/api/streak')) {
      return new Response(JSON.stringify({ streakCount: 5, lastAnsweredMonth: '2026-10' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (urlString.includes('/api/submit-answer')) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (urlString.includes('/api/admin/infographics')) {
      return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (urlString.includes('/api/profile')) {
      return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return originalFetch(...args);
  };
}
// --------------------------------------------------------



function App() {
  const [user, setUser] = useState(null);
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
      const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      };
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = ('standalone' in window.navigator) && window.navigator.standalone === true;
      const hasDismissed = sessionStorage.getItem('dismissedInstallPrompt');
      
      // Clear old localStorage to ensure it pops up for the user during testing
      localStorage.removeItem('dismissedInstallPrompt');
      
      if ((!isStandalone && !isIosStandalone && !hasDismissed) || (isIos() && !isIosStandalone && !hasDismissed)) {
        const timer = setTimeout(() => setShowInstallPrompt(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    sessionStorage.setItem('dismissedInstallPrompt', 'true');
  };

  const bookmarkActions = useBookmarks();
  const USERNAME = user?.fullName || "Ahmad Azib Danish";

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // Fetch glossary from DB
  const fetchGlossary = useCallback(() => {
    fetch(`${API_BASE}/api/glossary?t=${Date.now()}`)
      .then(r => r.json())
      .then(d => setGlossary(d))
      .catch(e => console.error(e));
  }, []);

  useEffect(() => { fetchGlossary(); }, [fetchGlossary]);

  // Fetch streak on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/streak/${encodeURIComponent(USERNAME)}`)
      .then(r => r.ok ? r.json() : { streak: 0 })
      .then(d => setStreak(d.streak || 0))
      .catch(() => { });
  }, []);

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

  // (Removed duplicated iOS prompt state)

  const tabs = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'glossary', label: 'Dictionary', Icon: BookIcon },
    { id: 'quiz', label: 'Hub', Icon: QuizIcon },
    { id: 'profile', label: 'Profile', Icon: ProfileIcon },
  ];

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`h-[100vh] overflow-hidden flex flex-col text-slate-900 transition-colors duration-200 w-full max-w-[430px] xl:max-w-none mx-auto relative shadow-2xl ${isDark ? 'dark:text-slate-100' : ''}`}>
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

      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/80 safe-area-top shadow-sm relative">
        <div className="flex items-center justify-between px-4 h-16 relative z-10">

          {/* ─── LOGO AREA + BACK BUTTON ─── */}
          <div className="flex items-center gap-2.5">
            {/* Back Button - shown when not on home */}
            {activeTab !== 'home' && (
              <button onClick={() => setActiveTab('home')} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shrink-0 mr-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-slate-200 dark:border-slate-800 shrink-0">
              <img src="/assets/logo.png" alt="S&S Logo" className="w-full h-full object-cover p-0.5" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[20px] font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                SESI
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 leading-none tracking-tight">
                Sabah Electricity Supply Industry
              </span>
            </div>
          </div>

          {/* ─── ACTIONS AREA ─── */}
          <div className="flex items-center gap-2">

            {/* Streak Badge */}
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 border border-orange-200/50 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 px-2.5 py-1.5 rounded-full shadow-sm shrink-0">
                <span className="text-[12px] leading-none">🔥</span>
                <span className="text-[13px] font-black leading-none">{streak}</span>
              </div>
            )}

            {/* Settings/Theme Pill Group */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-full p-1 border border-slate-200/50 dark:border-slate-700/50 shrink-0">

              {/* Admin Button */}
              <button onClick={() => setActiveTab('admin')} className="w-8 h-8 flex items-center justify-center rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all relative">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {/* Small indicator dot to make it pop */}
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border-[1.5px] border-slate-100 dark:border-slate-800"></div>
              </button>

              {/* Dark Mode Toggle */}
              <button onClick={() => setIsDark(!isDark)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all hover:text-slate-900 dark:hover:text-white">
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              {/* Logout Button */}
              <button onClick={() => setUser(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-rose-500/80 dark:text-rose-400/80 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:shadow-sm transition-all hover:text-rose-600 dark:hover:text-rose-300 ml-1">
                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-container px-4 pt-4 pb-20">
        {activeTab === 'home' && <HomeTab user={user} glossary={glossary} setActiveTab={setActiveTab} setActiveGlossaryCat={setActiveGlossaryCat} isDark={isDark} bookmarkActions={bookmarkActions} />}
        {activeTab === 'glossary' && <GlossaryTab user={user} glossary={glossary} onStreakUpdate={handleStreakUpdate} activeGlossaryCat={activeGlossaryCat} setActiveGlossaryCat={setActiveGlossaryCat} bookmarkActions={bookmarkActions} />}
        {activeTab === 'quiz' && <QuizTab user={user} streak={streak} setActiveTab={setActiveTab} onStreakUpdate={handleStreakUpdate} />}
        {activeTab === 'profile' && <ProfileTab user={user} bookmarkActions={bookmarkActions} setActiveTab={setActiveTab} triggerInstallPrompt={() => setShowInstallPrompt(true)} />}
        {activeTab === 'admin' && <AdminTab onGlossaryChange={fetchGlossary} />}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] xl:max-w-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-50 pb-3">
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
                  <br/><br/>
                  <span className="text-[12px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block text-left">
                    <strong>Android:</strong><br/>
                    Tap the <strong>Install App</strong> button below to add it directly to your home screen!
                  </span>
                </>
              ) : (
                <>
                  <br/><br/>
                  <span className="text-[12px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block text-left">
                    <strong>iOS / iPhone:</strong><br/>
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
                  // Intentionally NOT closing the popup here so iOS users can read it while they share!
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

