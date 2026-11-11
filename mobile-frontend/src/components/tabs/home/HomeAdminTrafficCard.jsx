import React from 'react';

export function HomeAdminTrafficCard({ isAdmin, visitorStats, onOpenAdmin }) {
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl sm:rounded-[26px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/5 dark:ring-white/10">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs lg:text-[13px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <span>🔒</span> Admin Traffic View
        </span>
        <button
          type="button"
          onClick={onOpenAdmin}
          className="text-xs lg:text-[13px] font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          Open Admin Dashboard →
        </button>
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800 py-1">
        {/* Visitors Today */}
        <div className="px-2 sm:px-4 min-w-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-tight">
              Visitors Today
            </span>
          </div>
          <div className="flex items-baseline justify-center gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-none">
              {(visitorStats?.todayVisits ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
              ({(visitorStats?.totalVisits ?? 0).toLocaleString()} total)
            </span>
          </div>
        </div>

        {/* Users */}
        <div className="px-2 sm:px-4 min-w-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-tight">
              Users
            </span>
          </div>
          <div className="flex items-baseline justify-center gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-none">
              {(visitorStats?.uniqueVisitors ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
              total registered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
