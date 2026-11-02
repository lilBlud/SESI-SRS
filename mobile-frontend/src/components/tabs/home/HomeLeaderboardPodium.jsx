import React from 'react';
import { LeaderboardAvatar } from '../../ui';

export function HomeLeaderboardPodium({
  leaderboard = [],
  loadingLb,
  user,
  streak,
  onViewAll,
  onTakeQuiz
}) {
  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      {/* Refined Header */}
      <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
              <path d="M6 5h12v4a6 6 0 0 1-12 0V5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-[14px] font-black tracking-tight leading-none text-white">Monthly Standings</h2>
            <p className="text-slate-400 text-[10px] font-semibold mt-1 leading-none">{currentMonthName}</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="text-[11px] font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg transition-colors"
        >
          View All →
        </button>
      </div>

      <div className="p-4">
        {loadingLb ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          /* High-craft Empty State */
          <div className="py-5 px-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-[14px] font-black text-slate-900 dark:text-white">
              {currentMonthName} Season is Live
            </h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 max-w-[260px] mx-auto mt-1 leading-relaxed">
              No entries recorded yet for this month. Be the first on the podium!
            </p>
            {onTakeQuiz && (
              <button
                onClick={onTakeQuiz}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-[12px] font-black rounded-xl transition-all shadow-sm shadow-emerald-600/20 active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>Take November Quiz</span>
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Podium */}
            <div className="grid grid-cols-3 items-end gap-2 pt-3 px-1">
              {/* 2nd Place */}
              <div className="w-full">
                {leaderboard.length > 1 && (
                  <div className="flex flex-col items-center justify-end relative">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 w-full text-center px-1 mb-2 truncate">
                      {(leaderboard[1].displayName || leaderboard[1].username).split(' ')[0]}
                    </div>
                    <LeaderboardAvatar
                      entry={leaderboard[1]}
                      user={user}
                      currentStreak={streak}
                      sizeClass="w-9 h-9"
                      textClass="text-[13px] text-slate-800"
                      bgClass="bg-slate-200 dark:bg-slate-700"
                      shadowClass="shadow-sm"
                      isPodium={true}
                    />
                    <div className="w-full rounded-t-xl flex flex-col items-center justify-center pt-3 pb-2 transition-all h-20 bg-slate-100 dark:bg-slate-800/60 border-t-2 border-slate-300 dark:border-slate-600">
                      <span className="text-[10px] font-bold text-slate-400">2nd</span>
                      <div className="font-black text-[14px] text-slate-800 dark:text-white tabular-nums">{leaderboard[1].score}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 1st Place */}
              <div className="w-full">
                {leaderboard.length > 0 && (
                  <div className="flex flex-col items-center justify-end relative">
                    <div className="text-[12px] font-black text-slate-900 dark:text-white w-full text-center px-1 mb-2 truncate">
                      👑 {(leaderboard[0].displayName || leaderboard[0].username).split(' ')[0]}
                    </div>
                    <LeaderboardAvatar
                      entry={leaderboard[0]}
                      user={user}
                      currentStreak={streak}
                      sizeClass="w-11 h-11"
                      textClass="text-[15px] text-amber-900"
                      bgClass="bg-amber-300 dark:bg-amber-400"
                      shadowClass="shadow-md shadow-amber-500/20"
                      isPodium={true}
                    />
                    <div className="w-full rounded-t-xl flex flex-col items-center justify-center pt-3 pb-2 transition-all h-28 bg-amber-50 dark:bg-amber-950/30 border-t-2 border-amber-400 dark:border-amber-500">
                      <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400">1st</span>
                      <div className="font-black text-[16px] text-slate-900 dark:text-white tabular-nums">{leaderboard[0].score}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3rd Place */}
              <div className="w-full">
                {leaderboard.length > 2 && (
                  <div className="flex flex-col items-center justify-end relative">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 w-full text-center px-1 mb-2 truncate">
                      {(leaderboard[2].displayName || leaderboard[2].username).split(' ')[0]}
                    </div>
                    <LeaderboardAvatar
                      entry={leaderboard[2]}
                      user={user}
                      currentStreak={streak}
                      sizeClass="w-9 h-9"
                      textClass="text-[13px] text-orange-950"
                      bgClass="bg-orange-200 dark:bg-orange-800/80"
                      shadowClass="shadow-sm"
                      isPodium={true}
                    />
                    <div className="w-full rounded-t-xl flex flex-col items-center justify-center pt-3 pb-2 transition-all h-16 bg-orange-50/50 dark:bg-orange-950/20 border-t-2 border-orange-300 dark:border-orange-600">
                      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">3rd</span>
                      <div className="font-black text-[14px] text-slate-800 dark:text-white tabular-nums">{leaderboard[2].score}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Runners up */}
            {leaderboard.length > 3 && (
              <div className="mt-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-2 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider text-center mb-1">Division Rankings</div>
                {leaderboard.slice(3, 5).map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-xs border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[9px] font-black text-slate-600 dark:text-slate-300 shrink-0">
                        {idx + 4}
                      </div>
                      <LeaderboardAvatar
                        entry={entry}
                        user={user}
                        currentStreak={streak}
                        sizeClass="w-6 h-6"
                        textClass="text-[9px] text-slate-700 dark:text-slate-200"
                        bgClass="bg-slate-100 dark:bg-slate-700"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{entry.displayName || entry.username}</div>
                      </div>
                    </div>
                    <div className="text-[12px] font-black text-emerald-600 dark:text-emerald-400 shrink-0 tabular-nums">
                      {entry.score} <span className="text-[9px] text-slate-400 font-semibold">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
