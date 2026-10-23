import React from 'react';

export function ProfileStatsBadges({ loading, totalScore, currentRank }) {
  if (loading) return null;

  return (
    <div className="flex gap-3">
      {/* Total Score with 3D Target */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center overflow-visible">
          {/* Rich 3D Target SVG */}
          <svg className="w-9 h-9 animate-target-shake drop-shadow-md" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="targetBg" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
              <linearGradient id="targetBullseye" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="14" fill="url(#targetBg)" />
            <circle cx="16" cy="16" r="9" fill="#ffffff" />
            <circle cx="16" cy="16" r="4.5" fill="url(#targetBullseye)" />
          </svg>

          {/* Rich 3D Realistic Arrow SVG */}
          <svg className="w-10 h-10 absolute animate-arrow-hit z-10 overflow-visible" viewBox="0 0 32 32" fill="none" style={{ filter: 'drop-shadow(-3px 5px 4px rgba(0,0,0,0.3))' }}>
            <polygon points="24 8 29 3 27 1 22 6" fill="#b91c1c" />
            <polygon points="24 8 29 3 31 5 26 10" fill="#ef4444" />
            <line x1="18.5" y1="13.5" x2="29" y2="3" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="16 16 16 11 18.5 13.5" fill="#e2e8f0" />
            <polygon points="16 16 21 16 18.5 13.5" fill="#94a3b8" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Score</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-0.5">
            {totalScore}
          </p>
        </div>
      </div>

      {/* Standing Rank with 3D Trophy */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center overflow-visible">
          {/* Rich Realistic 3D Trophy SVG */}
          <svg className="w-10 h-10 animate-trophy-bounce z-10 overflow-visible" viewBox="0 0 32 32" fill="none" style={{ filter: 'drop-shadow(0px 6px 4px rgba(0,0,0,0.3))' }}>
            <defs>
              <linearGradient id="goldGleam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ca8a04" />
                <stop offset="20%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="80%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
              <linearGradient id="goldBase" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a16207" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>
            </defs>

            <path d="M7 11 C 1 9 1 18 11 16.5" fill="none" stroke="url(#goldBase)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M25 11 C 31 9 31 18 21 16.5" fill="none" stroke="url(#goldBase)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M10 24 h12 l2 3 h-16 z" fill="#334155" />
            <path d="M8 27 h16 v2 c0 1 -1 1 -1 1 H9 c-1 0 -1 0 -1 -1 v-2 z" fill="#0f172a" />
            <rect x="14" y="27.5" width="4" height="1.5" fill="#fef08a" />
            <path d="M14 18 h4 l1 6 h-6 z" fill="url(#goldBase)" />
            <rect x="13.5" y="17" width="5" height="1.5" fill="#fef08a" rx="0.5" />
            <path d="M7 7 C 7 16 12 18 14 18 h4 C 20 18 25 16 25 7 Z" fill="url(#goldGleam)" />
            <ellipse cx="16" cy="7" rx="9" ry="2.5" fill="#fef9c3" />
            <ellipse cx="16" cy="7" rx="7.5" ry="1.5" fill="#a16207" opacity="0.8" />
            <polygon points="16 11 16.5 12.5 18 12.5 16.8 13.5 17.2 15 16 14 14.8 15 15.2 13.5 14 12.5 15.5 12.5" fill="#fef9c3" opacity="0.9" />
          </svg>

          {/* Confetti Particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-sm animate-confetti-pop" style={{ '--tx': '-18px', '--ty': '-22px', '--rot': '-45deg' }} />
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-sm animate-confetti-pop" style={{ '--tx': '18px', '--ty': '-18px', '--rot': '45deg', animationDelay: '0.1s' }} />
            <div className="absolute top-1/2 left-1/2 w-1 h-2 bg-indigo-400 rounded-sm animate-confetti-pop" style={{ '--tx': '-14px', '--ty': '16px', '--rot': '90deg', animationDelay: '0.2s' }} />
            <div className="absolute top-1/2 left-1/2 w-2 h-1 bg-emerald-400 rounded-sm animate-confetti-pop" style={{ '--tx': '14px', '--ty': '12px', '--rot': '135deg', animationDelay: '0.05s' }} />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Standing</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-0.5">
            {currentRank ? `#${currentRank}` : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
