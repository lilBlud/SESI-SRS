import React from 'react';
import { HomeIcon, BookIcon, QuizIcon, ProfileIcon } from '../ui';

export default function DesktopSidebar({
  activeTab,
  setActiveTab,
  user,
  streak,
  isDark,
  toggleTheme,
  onLogout
}) {
  const tabs = [
    { id: 'home', label: 'Home Dashboard', Icon: HomeIcon },
    { id: 'glossary', label: 'Dictionary & IBR', Icon: BookIcon },
    { id: 'quiz', label: 'Knowledge Hub', Icon: QuizIcon },
    { id: 'profile', label: 'My Profile', Icon: ProfileIcon },
  ];

  const preferredName = (user?.preferredName || '').trim();
  const realFullName = (user?.fullName || user?.username || user?.email || 'User').trim();
  const displayName = preferredName || realFullName;
  const userRole = user?.role || 'Staff';
  const division = user?.division || 'Information & Digital';

  return (
    <aside className="hidden lg:flex flex-col justify-between w-72 xl:w-80 shrink-0 h-screen sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800 transition-colors select-none">
      {/* ─── Top Brand & Logo ─── */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-slate-200 dark:border-slate-700 shadow-sm p-1 shrink-0">
            <img
              src="/assets/logo.png"
              alt="SESB Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg lg:text-xl font-black tracking-tight leading-none text-emerald-600 dark:text-emerald-400">
              SESI INSIGHT
            </span>
            <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Sabah Electricity Supply Industry
            </span>
          </div>
        </div>

        {/* ─── Streak Banner on Desktop ─── */}
        {streak > 0 && (
          <div className="mt-5 p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/60 dark:border-orange-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔥</span>
              <div>
                <div className="text-xs font-bold text-orange-900 dark:text-orange-200 leading-none">Learning Streak</div>
                <div className="text-[11px] text-orange-700 dark:text-orange-400 mt-0.5">{streak} Days Active</div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-black bg-orange-500 text-white rounded-full">
              {streak}d
            </span>
          </div>
        )}

        {/* ─── Navigation Links ─── */}
        <nav className="mt-6 space-y-1.5" aria-label="Desktop navigation">
          {tabs.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm lg:text-[14px] font-bold transition-all duration-200 text-left group ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'}`}>
                  <Icon active={isActive} />
                </div>
                <span className="whitespace-nowrap">{label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}

          {/* Admin Control Panel Tab (Admins Only) */}
          {user?.role === 'Admin' && (
            <div className="pt-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3.5 mb-2">
                Administration
              </div>
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm lg:text-[14px] font-bold transition-all duration-200 text-left group ${
                  activeTab === 'admin'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${activeTab === 'admin' ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="7" height="9" x="3" y="3" rx="1.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect width="7" height="5" x="14" y="3" rx="1.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect width="7" height="9" x="14" y="12" rx="1.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect width="7" height="5" x="3" y="16" rx="1.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="whitespace-nowrap font-bold">Admin Control Panel</span>
                <span className="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 tracking-wider shrink-0">
                  PRO
                </span>
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* ─── Bottom User Card & Theme Switcher ─── */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
        {/* User Profile Summary */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm lg:text-[15px] font-extrabold text-slate-800 dark:text-slate-100 truncate leading-tight">
              {displayName}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {division}
            </span>
          </div>
        </div>

        {/* Action Controls (Theme + Logout) */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-xs lg:text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
            aria-label="Toggle dark mode"
          >
            <span className="text-base">{isDark ? '☀️' : '🌙'}</span>
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs lg:text-[13px] font-bold text-rose-500 hover:text-rose-600 transition active:scale-95 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
            aria-label="Sign out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
