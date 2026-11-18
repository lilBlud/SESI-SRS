import React from 'react';

export function HomeHeroBanner({ greetingName, isDark, onNavigateGlossary, onNavigateQuiz, className = '' }) {
  return (
    <div
      className={`relative concentric-card surface-depth-1 border-alpha shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden h-full flex flex-col justify-between ${className}`}
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
      {/* Animated Glowing Overlay (#10 Multiply in light mode, Color-Dodge in dark mode) */}
      <div className="absolute inset-0 bg-emerald-500/18 dark:bg-emerald-400/60 blend-surface-overlay animate-pulse-slow pointer-events-none" />

      {/* Scanning Light Beam (Hardware Accelerated + Blend Mode) */}
      <div
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none animate-scanline opacity-45 dark:opacity-70 blend-surface-overlay"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, transparent 40%, rgba(16,185,129,0.75) 50%, transparent 60%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-7 pt-6 min-h-[175px] flex flex-col justify-between flex-1">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight leading-snug text-slate-900 dark:text-white">
            Welcome back, {greetingName}!
          </h1>
          <p className="text-emerald-800 dark:text-emerald-300 text-sm sm:text-base lg:text-[17px] mt-1.5 leading-normal font-semibold">
            Energy Transition &amp; Regulatory updates.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={onNavigateGlossary}
            className="min-h-[44px] px-6 py-2.5 bg-gradient-brand-oklch hover:brightness-110 active:scale-[0.97] active:brightness-95 dark:bg-none dark:bg-white dark:hover:bg-slate-50 dark:active:bg-slate-100 text-white dark:text-emerald-700 text-xs sm:text-sm lg:text-[14.5px] font-bold rounded-full shadow-[0_4px_15px_rgba(16,185,129,0.3)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-150 flex items-center gap-2 tracking-tight"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" vectorEffect="non-scaling-stroke" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Dictionary</span>
          </button>
          <button
            onClick={onNavigateQuiz}
            className="min-h-[44px] px-6 py-2.5 bg-slate-900/5 hover:bg-slate-900/10 active:scale-[0.97] active:bg-slate-900/15 dark:bg-black/25 dark:hover:bg-black/35 dark:active:bg-black/45 text-slate-800 dark:text-white text-xs sm:text-sm lg:text-[14.5px] font-bold rounded-full border-alpha backdrop-blur-md shadow-sm transition-all duration-150 flex items-center gap-2 tracking-tight"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" vectorEffect="non-scaling-stroke" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Monthly Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}
