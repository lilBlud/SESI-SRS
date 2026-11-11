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
    <div className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-slate-900 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] lg:shadow-none px-4 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] z-20 custom-scrollbar flex flex-col justify-start">
      {/* Drawer Handle & Navigation */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className="w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center text-white text-[10px] lg:text-xs font-black"
            style={{ backgroundColor: selectedFuel?.color || '#0F172A' }}
          >
            {selectedProject.pinNumber}
          </span>
          <span className="text-xs lg:text-[13px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Project Breakdown
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrev}
            className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs lg:text-sm active:scale-95 transition-all"
            title="Previous project"
            aria-label="Previous project"
          >
            ←
          </button>
          <span className="text-xs lg:text-[13px] font-bold text-slate-400 px-1">
            {selectedProject.pinNumber} of {totalProjects}
          </span>
          <button
            onClick={onNext}
            className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs lg:text-sm active:scale-95 transition-all"
            title="Next project"
            aria-label="Next project"
          >
            →
          </button>
        </div>
      </div>

      {/* Project Card Header */}
      <div className="pt-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg lg:text-2xl font-black text-slate-900 dark:text-white">
              {selectedProject.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs lg:text-[13px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300/40">
              {selectedProject.capacity}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs lg:text-[12px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {selectedProject.stageCategory === 'contracting' ? 'Contracting & FC' : 'Feasibility'}
            </span>
          </div>
          <p className="text-xs sm:text-sm lg:text-[14.5px] font-semibold text-slate-600 dark:text-slate-300 mt-1">
            {selectedProject.plantType} · {selectedProject.location}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[11px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Target COD</div>
          <div className="text-sm lg:text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            {selectedProject.cod}
          </div>
        </div>
      </div>

      {/* Key Project Parameters Grid (4-Column Metric Grid on Desktop) */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <div className="text-[11px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Capacity</div>
          <div className="text-base lg:text-xl font-black text-rose-600 dark:text-rose-400 mt-1">{selectedProject.capacity}</div>
          <div className="text-xs lg:text-[12.5px] text-slate-500 dark:text-slate-400 truncate mt-1">{selectedProject.plantType}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <div className="text-[11px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Target COD</div>
          <div className="text-base lg:text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{selectedProject.cod}</div>
          <div className="text-xs lg:text-[12.5px] text-slate-500 dark:text-slate-400 truncate mt-1">{selectedProject.stage || 'Pipeline'}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <div className="text-[11px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Region & Location</div>
          <div className="text-sm lg:text-[16px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">{selectedProject.location}</div>
          <div className="text-xs lg:text-[12.5px] text-slate-500 dark:text-slate-400 truncate mt-1">{selectedProject.region}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <div className="text-[11px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Equity / Ownership</div>
          <div className="text-sm lg:text-[16px] font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">{selectedProject.equity || 'SE 100%'}</div>
          <div className="text-xs lg:text-[12.5px] text-slate-500 dark:text-slate-400 truncate mt-1">SESB Stake</div>
        </div>
      </div>

      {/* Status and Description */}
      <div className="mt-3.5 text-xs sm:text-sm lg:text-[14.5px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/70 dark:border-slate-700/60">
        <span className="font-extrabold text-slate-800 dark:text-slate-100">Status & Way Forward: </span>
        {selectedProject.status}
      </div>

      {/* Watch Item Highlight Alert or Milestone Status */}
      {selectedProject.watchItem ? (
        <div className="mt-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-700/70 rounded-xl p-3.5 flex items-start gap-3">
          <span className="text-lg shrink-0">⚠️</span>
          <div className="min-w-0">
            <div className="text-sm lg:text-[15px] font-black text-amber-900 dark:text-amber-200">
              Watch Item: {selectedProject.watchItem.title}
            </div>
            <p className="text-xs lg:text-[13.5px] text-amber-800 dark:text-amber-300 mt-1 leading-snug">
              {selectedProject.watchItem.text}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs sm:text-sm lg:text-[14px] font-bold text-emerald-800 dark:text-emerald-300">
              Pipeline Status: On track for {selectedProject.cod} delivery
            </span>
          </div>
          <span className="text-xs lg:text-[12.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-md">
            No Critical Blockers
          </span>
        </div>
      )}
    </div>
  );
}
