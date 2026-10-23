import React from 'react';

export function HomeHeroBanner({ greetingName, isDark, onNavigateGlossary, onNavigateQuiz }) {
  return (
    <div
      className="relative rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden mb-6 bg-cover bg-center ring-1 ring-black/5 dark:ring-white/10"
      style={{ backgroundImage: `url('/assets/${isDark ? 'pattern_dark.png' : 'pattern_light.png'}')` }}
    >
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
      <div className="relative z-10 p-6 pt-5 min-h-[170px]">
        <h1 className="text-[24px] font-black tracking-tight leading-tight text-slate-900 dark:text-white dark:[text-shadow:_0_2px_15px_rgb(0_0_0_/_1),_0_1px_2px_rgb(0_0_0_/_1)]">
          Welcome back, {greetingName}!
        </h1>
        <p className="text-emerald-700 dark:text-[#a0e8c5] text-[13px] mt-1.5 leading-relaxed font-bold dark:[text-shadow:_0_1px_4px_rgb(0_0_0_/_1)]">
          Energy Transition & Regulatory updates.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onNavigateGlossary}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 dark:bg-white dark:hover:bg-slate-50 dark:active:bg-slate-100 text-white dark:text-emerald-700 text-[13px] font-black rounded-full shadow-[0_4px_15px_rgba(16,185,129,0.3)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all flex items-center gap-1.5"
          >
            📖 Dictionary
          </button>
          <button
            onClick={onNavigateQuiz}
            className="px-5 py-2.5 bg-slate-900/5 hover:bg-slate-900/10 active:bg-slate-900/15 dark:bg-black/20 dark:hover:bg-black/30 dark:active:bg-black/40 text-slate-800 dark:text-white text-[13px] font-bold rounded-full border border-slate-900/10 dark:border-white/30 backdrop-blur-md shadow-sm transition-all"
          >
            Monthly Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
