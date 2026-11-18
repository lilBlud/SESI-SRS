import React from 'react';

const WATCH_TONE_CLASSES = {
  rose: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/70 text-rose-900 dark:text-rose-200',
  amber: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/70 text-amber-900 dark:text-amber-200',
  sky: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/70 text-sky-900 dark:text-sky-200',
};

/**
 * Detailed card for the selected Sabah generation pin, showing deduplicated
 * metrics, status/way forward, and semantic watch item alerts.
 */
export function ProjectBreakdownCard({
  selectedProject,
  selectedFuel,
  totalProjects,
  onPrev,
  onNext
}) {
  if (!selectedProject) return null;

  const watchTone = selectedProject.watchItem?.tone || 'amber';
  const watchClass = WATCH_TONE_CLASSES[watchTone] || WATCH_TONE_CLASSES.amber;
  const stageLabel = selectedProject.stageCategory === 'contracting'
    ? 'Contracting & FC'
    : selectedProject.stageCategory === 'feasibility'
    ? 'Feasibility'
    : (selectedProject.stage || 'Pipeline');

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-slate-900 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] lg:shadow-none px-4 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] z-20 custom-scrollbar flex flex-col justify-start">
      {/* Drawer Handle & Pin Stepper */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-black tabular-nums"
            style={{ backgroundColor: selectedFuel?.color || '#0F172A' }}
          >
            {selectedProject.pinNumber}
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Project Breakdown
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrev}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 active:scale-90 transition-all duration-150"
            title="Previous project"
            aria-label="Previous project"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1.5 tabular-nums">
            {selectedProject.pinNumber} of {totalProjects}
          </span>
          <button
            type="button"
            onClick={onNext}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 active:scale-90 transition-all duration-150"
            title="Next project"
            aria-label="Next project"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Project Title Header (No duplicate right-side COD/MW) */}
      <div className="pt-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedProject.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {stageLabel}
            </span>
          </div>
          <p className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedProject.plantType}
          </p>
        </div>
      </div>

      {/* Key Project Parameters Grid (4 Distinct Facts — Zero Duplication) */}
      <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs tabular-nums">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Capacity</div>
          <div className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">{selectedProject.capacity}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Target COD</div>
          <div className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{selectedProject.cod}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Location</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate" title={`${selectedProject.location} (${selectedProject.region})`}>
            {selectedProject.location}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Equity</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{selectedProject.equity || 'SE 100%'}</div>
        </div>
      </div>

      {/* Status and Way Forward */}
      <div className="mt-3 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/70 dark:border-slate-700/60">
        <span className="font-extrabold text-slate-900 dark:text-white">Status &amp; Way Forward: </span>
        {selectedProject.status}
      </div>

      {/* Watch Item Highlight Alert or On-Track Indicator */}
      {selectedProject.watchItem ? (
        <div className={`mt-3 border rounded-xl p-3.5 flex items-start gap-2.5 ${watchClass}`}>
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div className="min-w-0">
            <div className="text-xs sm:text-[13px] font-black">
              {selectedProject.watchItem.badge ? `${selectedProject.watchItem.badge}: ` : ''}{selectedProject.watchItem.title}
            </div>
            <p className="text-xs mt-0.5 opacity-90 leading-snug">
              {selectedProject.watchItem.text}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 rounded-xl p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              On track for {selectedProject.cod} delivery
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md shrink-0">
            No Critical Blockers
          </span>
        </div>
      )}
    </div>
  );
}
