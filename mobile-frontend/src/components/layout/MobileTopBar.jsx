import React from 'react';

/**
 * Sticky mobile application header with contextual back button,
 * streak badge, admin shortcut, blurred theme toggle, and logout action.
 */
export default function MobileTopBar({
  activeTab,
  setActiveTab,
  streak = 0,
  user,
  isDark = false,
  toggleTheme,
  onLogout
}) {
  return (
    <header className="lg:hidden sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md surface-depth-1 border-b border-alpha safe-area-top shrink-0">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2.5">
          {activeTab !== 'home' && (
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 transition-all duration-150 shrink-0 mr-0.5 border-alpha"
              aria-label="Back to home"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" vectorEffect="non-scaling-stroke" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white dark:bg-white/95 border-alpha shadow-xs shrink-0 p-1">
            <img src="/assets/logo.png" alt="S&S Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center select-none">
            <span
              className="text-[15px] sm:text-[16px] font-extrabold tracking-tight leading-none text-[#059669] dark:text-[#34d399] whitespace-nowrap"
              style={{ textRendering: 'geometricPrecision' }}
            >
              SESI INSIGHT
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5 leading-none tracking-tight whitespace-nowrap">
              Sabah Electricity Supply Industry
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-gradient-streak-oklch border-alpha text-orange-600 dark:text-orange-400 px-2.5 py-1.5 rounded-full shadow-sm shrink-0">
              <span className="text-[12px] leading-none">🔥</span>
              <span className="text-[13px] font-extrabold tabular-nums leading-none">{streak}</span>
            </div>
          )}

          <div className="flex items-center gap-0.5 bg-slate-100/90 dark:bg-slate-800/90 surface-depth-2 p-1 rounded-full border-alpha shrink-0">
            {user?.role === 'Admin' && (
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm active:scale-90 transition-all duration-150 relative"
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="7" height="9" x="3" y="3" rx="1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect width="7" height="5" x="14" y="3" rx="1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect width="7" height="9" x="14" y="12" rx="1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect width="7" height="5" x="3" y="16" rx="1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full border-[1.5px] border-slate-100 dark:border-slate-800" />
              </button>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all duration-150 hover:text-slate-900 dark:hover:text-white relative overflow-hidden active:scale-90"
              aria-label="Toggle theme"
            >
              <span className={`flex items-center justify-center icon-swap-item ${isDark ? 'icon-swap-inactive' : 'icon-swap-active'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" vectorEffect="non-scaling-stroke" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </span>
              <span className={`flex items-center justify-center icon-swap-item ${isDark ? 'icon-swap-active' : 'icon-swap-inactive'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" vectorEffect="non-scaling-stroke" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50/90 dark:bg-rose-950/40 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 border border-rose-200/70 dark:border-rose-900/50 shadow-2xs active:scale-90 transition-all duration-150 hover:text-rose-600 shrink-0"
            aria-label="Sign out"
            title="Sign out"
          >
            <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" vectorEffect="non-scaling-stroke" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
