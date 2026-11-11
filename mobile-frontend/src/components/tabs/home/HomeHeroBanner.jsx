import React from 'react';

export function HomeHeroBanner({ greetingName, isDark, onNavigateGlossary, onNavigateQuiz }) {
  return (
    <div
      className="relative rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden mb-6 ring-1 ring-black/5 dark:ring-white/10"
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
      <div className="relative z-10 p-6 sm:p-7 pt-5 min-h-[170px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight leading-snug text-slate-900 dark:text-white">
          Welcome back, {greetingName}!
        </h1>
        <p className="text-emerald-800 dark:text-emerald-300 text-sm sm:text-base lg:text-[17px] mt-1.5 leading-normal font-semibold">
          Energy Transition & Regulatory updates.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onNavigateGlossary}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 dark:bg-white dark:hover:bg-slate-50 dark:active:bg-slate-100 text-white dark:text-emerald-700 text-xs sm:text-sm lg:text-[14.5px] font-bold rounded-full shadow-[0_4px_15px_rgba(16,185,129,0.3)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all flex items-center gap-2 tracking-tight"
          >
            📖 Dictionary
          </button>
          <button
            onClick={onNavigateQuiz}
            className="px-6 py-3 bg-slate-900/5 hover:bg-slate-900/10 active:bg-slate-900/15 dark:bg-black/20 dark:hover:bg-black/30 dark:active:bg-black/40 text-slate-800 dark:text-white text-xs sm:text-sm lg:text-[14.5px] font-bold rounded-full border border-slate-900/10 dark:border-white/30 backdrop-blur-md shadow-sm transition-all tracking-tight"
          >
            Monthly Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
