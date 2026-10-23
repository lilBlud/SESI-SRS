import React from 'react';
import { LeaderboardAvatar } from '../../ui';

export function HomeLeaderboardPodium({
  leaderboard = [],
  loadingLb,
  user,
  streak,
  onViewAll
}) {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Leaderboard Rich 3D Trophy SVG */}
          <div className="relative w-9 h-9 flex items-center justify-center overflow-visible">
            <svg className="w-8 h-8 animate-trophy-bounce z-10 overflow-visible" viewBox="0 0 32 32" fill="none" style={{ filter: 'drop-shadow(0px 4px 3px rgba(0,0,0,0.3))' }}>
              <defs>
                <linearGradient id="goldGleamLb" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ca8a04" />
                  <stop offset="20%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="80%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#854d0e" />
                </linearGradient>
                <linearGradient id="goldBaseLb" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a16207" />
                  <stop offset="50%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#713f12" />
                </linearGradient>
              </defs>

              <path d="M7 11 C 1 9 1 18 11 16.5" fill="none" stroke="url(#goldBaseLb)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M25 11 C 31 9 31 18 21 16.5" fill="none" stroke="url(#goldBaseLb)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M10 24 h12 l2 3 h-16 z" fill="#334155" />
              <path d="M8 27 h16 v2 c0 1 -1 1 -1 1 H9 c-1 0 -1 0 -1 -1 v-2 z" fill="#0f172a" />
              <rect x="14" y="27.5" width="4" height="1.5" fill="#fef08a" />
              <path d="M14 18 h4 l1 6 h-6 z" fill="url(#goldBaseLb)" />
              <rect x="13.5" y="17" width="5" height="1.5" fill="#fef08a" rx="0.5" />
              <path d="M7 7 C 7 16 12 18 14 18 h4 C 20 18 25 16 25 7 Z" fill="url(#goldGleamLb)" />
              <ellipse cx="16" cy="7" rx="9" ry="2.5" fill="#fef9c3" />
              <ellipse cx="16" cy="7" rx="7.5" ry="1.5" fill="#a16207" opacity="0.8" />
              <polygon points="16 11 16.5 12.5 18 12.5 16.8 13.5 17.2 15 16 14 14.8 15 15.2 13.5 14 12.5 15.5 12.5" fill="#fef9c3" opacity="0.9" />
            </svg>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-sm animate-confetti-pop" style={{ '--tx': '-15px', '--ty': '-18px', '--rot': '-45deg' }} />
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-sm animate-confetti-pop" style={{ '--tx': '15px', '--ty': '-15px', '--rot': '45deg', animationDelay: '0.1s' }} />
              <div className="absolute top-1/2 left-1/2 w-1 h-2 bg-indigo-400 rounded-sm animate-confetti-pop" style={{ '--tx': '-12px', '--ty': '14px', '--rot': '90deg', animationDelay: '0.2s' }} />
              <div className="absolute top-1/2 left-1/2 w-2 h-1 bg-emerald-400 rounded-sm animate-confetti-pop" style={{ '--tx': '12px', '--ty': '10px', '--rot': '135deg', animationDelay: '0.05s' }} />
            </div>
          </div>
          <div>
            <h2 className="text-[16px] font-black text-white tracking-tight">Monthly Leaderboard</h2>
            <p className="text-white/70 text-[11px] font-medium">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <button onClick={onViewAll} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold rounded-lg backdrop-blur-sm transition-all">
          View All →
        </button>
      </div>

      <div className="p-4">
        {loadingLb ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm">
            <div className="text-3xl mb-2">🎯</div>
            No entries yet — be the first to take the quiz!
          </div>
        ) : (
          <>
            {/* Podium */}
            <div className="grid grid-cols-3 items-end gap-2 pt-4 px-1">
              {/* 2nd Place */}
              <div className="w-full">
                {leaderboard.length > 1 && (
                  <div className="flex flex-col items-center justify-end relative">
                    <div className="text-[12px] font-black text-slate-800 dark:text-white w-full text-center px-1 mb-2.5 truncate">
                      {(leaderboard[1].displayName || leaderboard[1].username).split(' ')[0]}
                    </div>
                    <LeaderboardAvatar
                      entry={leaderboard[1]}
                      user={user}
                      currentStreak={streak}
                      sizeClass="w-10 h-10"
                      textClass="text-[14px] text-slate-800"
                      bgClass="bg-gradient-to-br from-slate-200 to-slate-400"
                      shadowClass="shadow-slate-400/40"
                      delayClass="[animation-delay:150ms]"
                      isPodium={true}
                    />
                    <div className="w-full rounded-t-lg flex flex-col items-center pt-7 pb-2 shadow-inner transition-all h-20 bg-gradient-to-b from-slate-200 to-slate-50 dark:from-slate-600/40 dark:to-slate-800/10 border-t-2 border-slate-300 dark:border-slate-500">
                      <div className="font-black text-[14px] text-slate-800 dark:text-white leading-none">{leaderboard[1].score}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 1st Place */}
              <div className="w-full">
                {leaderboard.length > 0 && (
                  <div className="flex flex-col items-center justify-end relative">
                    <div className="absolute -top-5 text-lg animate-bounce z-20 drop-shadow-md">👑</div>
                    <div className="text-[13px] font-black text-slate-800 dark:text-white w-full text-center px-1 mb-2.5 truncate">
                      {(leaderboard[0].displayName || leaderboard[0].username).split(' ')[0]}
                    </div>
                    <LeaderboardAvatar
                      entry={leaderboard[0]}
                      user={user}
                      currentStreak={streak}
                      sizeClass="w-12 h-12"
                      textClass="text-[16px] text-white"
                      bgClass="bg-gradient-to-br from-yellow-300 to-amber-500"
                      shadowClass="shadow-amber-500/40"
                      isPodium={true}
                    />
                    <div className="w-full rounded-t-lg flex flex-col items-center pt-7 pb-2 shadow-inner transition-all h-28 bg-gradient-to-b from-amber-200 to-amber-50 dark:from-amber-600/40 dark:to-amber-900/10 border-t-2 border-amber-300 dark:border-amber-500">
                      <div className="font-black text-[15px] text-slate-800 dark:text-white leading-none">{leaderboard[0].score}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3rd Place */}
              <div className="w-full">
                {leaderboard.length > 2 && (
                  <div className="flex flex-col items-center justify-end relative">
                    <div className="text-[12px] font-black text-slate-800 dark:text-white w-full text-center px-1 mb-2.5 truncate">
                      {(leaderboard[2].displayName || leaderboard[2].username).split(' ')[0]}
                    </div>
                    <LeaderboardAvatar
                      entry={leaderboard[2]}
                      user={user}
                      currentStreak={streak}
                      sizeClass="w-10 h-10"
                      textClass="text-[14px] text-white"
                      bgClass="bg-gradient-to-br from-orange-300 to-orange-500"
                      shadowClass="shadow-orange-500/40"
                      delayClass="[animation-delay:300ms]"
                      isPodium={true}
                    />
                    <div className="w-full rounded-t-lg flex flex-col items-center pt-7 pb-2 shadow-inner transition-all h-16 bg-gradient-to-b from-orange-200 to-orange-50 dark:from-orange-600/40 dark:to-orange-900/10 border-t-2 border-orange-300 dark:border-orange-500">
                      <div className="font-black text-[14px] text-slate-800 dark:text-white leading-none">{leaderboard[2].score}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Runners up */}
            {leaderboard.length > 3 && (
              <div className="mt-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-2.5 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1">Runners-up</div>
                {leaderboard.slice(3, 5).map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-800 px-3 py-2.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300 shadow-inner shrink-0">
                        {idx + 4}
                      </div>
                      <LeaderboardAvatar
                        entry={entry}
                        user={user}
                        currentStreak={streak}
                        sizeClass="w-7 h-7"
                        textClass="text-[10px] text-slate-700 dark:text-slate-200"
                        bgClass="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600"
                      />
                      <div className="min-w-0">
                        <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200 truncate">{entry.displayName || entry.username}</div>
                        {entry.displayName && entry.displayName !== entry.username && (
                          <div className="text-[10px] text-slate-400 truncate">{entry.username}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-[13px] font-black text-emerald-600 dark:text-emerald-400 shrink-0">{entry.score} <span className="text-[9px] text-slate-400 uppercase">pts</span></div>
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
