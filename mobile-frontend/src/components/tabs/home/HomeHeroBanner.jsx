import React from 'react';

export function HomeHeroBanner({ greetingName, isDark, onNavigateGlossary, onNavigateQuiz }) {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/30 shadow-md text-white">
      {/* Subtle organic light accent */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-36 h-36 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-5 pt-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-300/90">
            Sabah Grid Intelligence
          </span>
        </div>

        <h1 className="text-[20px] sm:text-[22px] font-black tracking-tight leading-tight text-white">
          Welcome back, {greetingName}
        </h1>
        <p className="text-slate-300 text-[12px] mt-1 leading-normal font-medium">
          Unified standards, allowable revenue, and generation metrics.
        </p>

        <div className="flex items-center gap-2.5 mt-4 pt-1">
          <button
            onClick={onNavigateGlossary}
            className="flex-1 py-2 px-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 text-[12px] font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Dictionary</span>
          </button>
          <button
            onClick={onNavigateQuiz}
            className="flex-1 py-2 px-3.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white text-[12px] font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <svg className="w-3.5 h-3.5 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Monthly Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}
