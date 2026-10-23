import React from 'react';

export function ProjectBreakdownCard({
  selectedProject,
  selectedFuel,
  totalProjects,
  onPrev,
  onNext
}) {
  if (!selectedProject) return null;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-slate-900 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] px-4 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] z-20 custom-scrollbar flex flex-col justify-start">
      {/* Drawer Handle & Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black"
            style={{ backgroundColor: selectedFuel?.color || '#0F172A' }}
          >
            {selectedProject.pinNumber}
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Project Breakdown
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs active:scale-95 transition-all"
            title="Previous project"
            aria-label="Previous project"
          >
            ←
          </button>
          <span className="text-[10px] font-bold text-slate-400 px-1">
            {selectedProject.pinNumber} of {totalProjects}
          </span>
          <button
            onClick={onNext}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs active:scale-95 transition-all"
            title="Next project"
            aria-label="Next project"
          >
            →
          </button>
        </div>
      </div>

      {/* Project Card Header */}
      <div className="pt-2 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              {selectedProject.name}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300/40">
              {selectedProject.capacity}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {selectedProject.stageCategory === 'contracting' ? 'Contracting & FC' : 'Feasibility'}
            </span>
          </div>
          <p className="text-[12px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
            {selectedProject.plantType} · {selectedProject.location}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Target COD</div>
          <div className="text-[12px] font-black text-indigo-600 dark:text-indigo-400">
            {selectedProject.cod}
          </div>
        </div>
      </div>

      {/* Status and Description */}
      <div className="mt-2 text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-200/60 dark:border-slate-700/60">
        <span className="font-bold text-slate-800 dark:text-slate-200">Status & Way Forward: </span>
        {selectedProject.status}
      </div>

      {/* Watch Item Highlight Alert */}
      {selectedProject.watchItem && (
        <div className="mt-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-700/70 rounded-xl p-2.5 flex items-start gap-2">
          <span className="text-sm shrink-0">⚠️</span>
          <div className="min-w-0">
            <div className="text-[11px] font-black text-amber-900 dark:text-amber-200">
              Watch Item: {selectedProject.watchItem.title}
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-snug">
              {selectedProject.watchItem.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
