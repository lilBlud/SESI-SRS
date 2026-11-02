import React from 'react';

export function HomeAdminTrafficCard({ isAdmin, visitorStats, onOpenAdmin }) {
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl sm:rounded-[26px] p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/5 dark:ring-white/10">
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md flex items-center gap-1">
          <span>🔒</span> Admin Traffic View
        </span>
        <button
          type="button"
          onClick={onOpenAdmin}
          className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          Open Admin Dashboard →
        </button>
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
        {/* Visitors Today */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 pr-3 sm:pr-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 truncate">
              Visitors Today
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-[20px] sm:text-[22px] font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {(visitorStats?.todayVisits ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 truncate">
                ({(visitorStats?.totalVisits ?? 0).toLocaleString()} total)
              </span>
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 pl-3 sm:pl-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 truncate">
              Users
            </div>
            <div className="text-[20px] sm:text-[22px] font-black text-slate-900 dark:text-white tracking-tight leading-none mt-0.5">
              {(visitorStats?.uniqueVisitors ?? 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
