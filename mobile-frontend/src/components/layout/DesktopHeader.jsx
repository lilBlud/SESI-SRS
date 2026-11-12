import React from 'react';

export default function DesktopHeader({
  activeTab,
  setActiveTab,
  streak
}) {
  const titles = {
    home: { title: 'Executive Dashboard', subtitle: 'Energy Transition & Regulatory Updates' },
    glossary: { title: 'Regulatory & IBR Dictionary', subtitle: 'Formulas, Notations & Corporate Metrics' },
    dictionary: { title: 'Regulatory & IBR Dictionary', subtitle: 'Formulas, Notations & Corporate Metrics' },
    quiz: { title: 'Knowledge Hub', subtitle: 'Test your knowledge & climb the leaderboard' },
    profile: { title: 'My Staff Profile', subtitle: 'Badges, bookmarks & quiz performance' },
    admin: { title: 'Admin Control Center', subtitle: 'Manage users, quizzes, dictionary & traffic analytics' }
  };

  const current = titles[activeTab] || titles.home;

  return (
    <header className="hidden lg:flex items-center justify-between px-6 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 transition-colors select-none">
      {/* ─── Breadcrumb & Title ─── */}
      <div className="flex items-center gap-3">
        {activeTab !== 'home' && (
          <button
            onClick={() => setActiveTab('home')}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition active:scale-95 border border-slate-200/80 dark:border-slate-700 shrink-0"
            title="Return to Home Dashboard"
            aria-label="Back to home"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            <span>SESI</span>
            <span>/</span>
            <span className="capitalize text-emerald-600 dark:text-emerald-400 font-bold">
              {activeTab === 'glossary' ? 'Dictionary' : activeTab}
            </span>
            <span>/</span>
          </div>
          <h1 className="text-sm xl:text-[15px] font-bold text-slate-900 dark:text-white tracking-tight">
            {current.title}
          </h1>
        </div>
      </div>

      {/* ─── Right Controls (Streak) ─── */}
      <div className="flex items-center gap-3">
        {/* Streak Pill */}
        {streak > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 border border-orange-200/70 dark:border-orange-800/60 shadow-2xs">
            <span className="text-xs">🔥</span>
            <span className="text-[11.5px] font-extrabold text-orange-600 dark:text-orange-400 tabular-nums">
              {streak}d Streak
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
