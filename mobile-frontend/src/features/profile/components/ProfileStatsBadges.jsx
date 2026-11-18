import React from 'react';

export function ProfileStatsBadges({
  loading,
  totalScore = 0,
  currentRank = null,
  answeredCount = 0
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" aria-label="Loading profile stats">
        {[1, 2, 3].map(idx => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800/80 surface-depth-1 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xs"
          >
            <div className="space-y-2">
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-7 w-16 rounded" />
              <div className="skeleton h-2.5 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-white/95 dark:bg-slate-800/90 surface-depth-1 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Total Score
        </p>
        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-tight mt-1">
          {Number(totalScore || 0).toLocaleString()}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Official monthly quiz points
        </p>
      </div>

      <div className="bg-white/95 dark:bg-slate-800/90 surface-depth-1 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 dark:border-emerald-800/50 shadow-xs">
        <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Standing
        </p>
        <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums tracking-tight leading-tight mt-1">
          {currentRank ? `#${currentRank}` : '—'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {currentRank ? 'Current leaderboard rank' : 'Complete this month’s quiz to rank'}
        </p>
      </div>

      <div className="bg-white/95 dark:bg-slate-800/90 surface-depth-1 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Questions Answered
        </p>
        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-tight mt-1">
          {Number(answeredCount || 0).toLocaleString()}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Logged in selected period
        </p>
      </div>
    </div>
  );
}
