import React from 'react';

export function HomeAdminTrafficCard({ isAdmin, visitorStats, onOpenAdmin }) {
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-xs border border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Admin Telemetry
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenAdmin}
          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
        >
          Dashboard →
        </button>
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
        {/* Visitors Today */}
        <div className="flex items-center gap-3 pr-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 truncate">
              Today's Visits
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[18px] font-black text-slate-900 dark:text-white tabular-nums leading-none">
                {(visitorStats?.todayVisits ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 truncate">
                ({(visitorStats?.totalVisits ?? 0).toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="flex items-center gap-3 pl-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 truncate">
              Registered Users
            </div>
            <div className="text-[18px] font-black text-slate-900 dark:text-white tabular-nums leading-none mt-0.5">
              {(visitorStats?.uniqueVisitors ?? 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
