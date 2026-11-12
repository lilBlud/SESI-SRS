import React from 'react';

export function HomeHeroBanner({ greetingName, isDark, onNavigateGlossary, onNavigateQuiz, className = '' }) {
  return (
    <div
      className={`relative rounded-2xl sm:rounded-[26px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden ring-1 ring-black/5 dark:ring-white/10 h-full flex flex-col justify-between ${className}`}
    >
      {/* Background patterns with smooth cross-fade */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-350 ease-in-out pointer-events-none ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: "url('/assets/pattern_light.png')" }}
      />
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-350 ease-in-out pointer-events-none ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: "url('/assets/pattern_dark.png')" }}
      />
      {/* Animated Glowing Overlay */}
      <div className="absolute inset-0 bg-emerald-500/20 mix-blend-normal dark:bg-emerald-400/60 dark:mix-blend-color-dodge animate-pulse-slow pointer-events-none" />

      {/* Scanning Light Beam (Hardware Accelerated) */}
      <div
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none animate-scanline opacity-60 mix-blend-normal dark:mix-blend-color-dodge dark:opacity-70"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, transparent 40%, rgba(16,185,129,0.8) 50%, transparent 60%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-5 lg:p-4 min-h-[135px] flex flex-col justify-between flex-1">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-[22px] font-black tracking-tight leading-snug text-slate-900 dark:text-white">
            Welcome back, {greetingName}!
          </h1>
          <p className="text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm lg:text-[13px] mt-1 leading-normal font-semibold">
            Energy Transition & Regulatory updates.
          </p>
        </div>
        <div className="flex gap-2.5 mt-3.5">
          <button
            onClick={onNavigateGlossary}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 dark:bg-white dark:hover:bg-slate-50 dark:active:bg-slate-100 text-white dark:text-emerald-700 text-xs sm:text-sm lg:text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 tracking-tight active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Dictionary</span>
          </button>
          <button
            onClick={onNavigateQuiz}
            className="px-4 py-2 bg-slate-900/5 hover:bg-slate-900/10 active:bg-slate-900/15 dark:bg-black/20 dark:hover:bg-black/30 dark:active:bg-black/40 text-slate-800 dark:text-white text-xs sm:text-sm lg:text-xs font-bold rounded-xl border border-slate-900/10 dark:border-white/30 backdrop-blur-md shadow-xs transition-all tracking-tight active:scale-95"
          >
            Monthly Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
