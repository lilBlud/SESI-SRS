import React from 'react';

export default function DesktopHeader({
  activeTab,
  setActiveTab,
  user,
  streak,
  isDark,
  toggleTheme,
  onLogout
}) {
  const titles = {
    home: { title: 'Executive Dashboard', subtitle: 'Energy Transition & Regulatory Updates' },
    glossary: { title: 'Regulatory & IBR Dictionary', subtitle: 'Formulas, Notations & Corporate Metrics' },
    dictionary: { title: 'Regulatory & IBR Dictionary', subtitle: 'Formulas, Notations & Corporate Metrics' },
    quiz: { title: 'Knowledge Hub & Monthly Quiz', subtitle: 'Test your knowledge & climb the leaderboard' },
    profile: { title: 'My Staff Profile', subtitle: 'Badges, bookmarks & quiz performance' },
    admin: { title: 'Admin Control Center', subtitle: 'Manage users, quizzes, dictionary & traffic analytics' }
  };

  const current = titles[activeTab] || titles.home;
  const preferredName = (user?.preferredName || '').trim();
  const realFullName = (user?.fullName || user?.username || user?.email || 'User').trim();
  const displayName = preferredName || realFullName;

  return (
    <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 transition-colors select-none">
      {/* ─── Breadcrumb & Title ─── */}
      <div className="flex items-center gap-4">
        {activeTab !== 'home' && (
          <button
            onClick={() => setActiveTab('home')}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition active:scale-95 border border-slate-200/80 dark:border-slate-700"
            title="Return to Home Dashboard"
            aria-label="Back to home"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <span>SESI Platform</span>
            <span>/</span>
            <span className="capitalize text-emerald-600 dark:text-emerald-400 font-bold">
              {activeTab === 'glossary' ? 'Dictionary' : activeTab}
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            {current.title}
          </h1>
        </div>
      </div>

      {/* ─── Right Controls (Streak + Theme + Avatar) ─── */}
      <div className="flex items-center gap-4">
        {/* Streak Pill */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 border border-orange-200/70 dark:border-orange-800/60 shadow-xs">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-black text-orange-600 dark:text-orange-400 tabular-nums">
              {streak} Days Streak
            </span>
          </div>
        )}

        {/* Dark Mode Quick Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition active:scale-95 border border-slate-200/80 dark:border-slate-700/80"
          title="Toggle Theme"
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={displayName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
              {displayName}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 leading-none">
              {user?.role || 'Staff'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
