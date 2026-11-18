import React from 'react';

const WATCH_TONE_STYLES = {
  rose: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/70 text-rose-800 dark:text-rose-200',
  amber: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/70 text-amber-800 dark:text-amber-200',
  sky: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/70 text-sky-800 dark:text-sky-200',
};

const WATCH_BADGE_STYLES = {
  rose: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200',
  amber: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200',
  sky: 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-200',
};

/**
 * Pipeline stage overview and project breakdown grid inside the Future Generation modal.
 */
export function PipelineStagesView({
  pipelineStages = [],
  projects = [],
  fuelConfig = {},
  onSelectProject
}) {
  const mengarisSolar = projects.find(p => p.id === 'mengaris');

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Summary Banner with Proportional Stage Capacity Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-xl">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight">
              6 Projects (1,189 MW)
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/85 mt-1 leading-relaxed">
              3 projects in contracting &amp; financial close stage and 3 in feasibility stage, supplemented by Mengaris Solar (15 MW).
            </p>
          </div>

          <div className="lg:w-80 xl:w-96 shrink-0 bg-white/10 border border-white/15 rounded-xl p-3.5 space-y-2.5 tabular-nums">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-300">Contracting &amp; FC · 382 MW (32%)</span>
              <span className="text-amber-300">Feasibility · 807 MW (68%)</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
              <div className="h-full bg-emerald-400" style={{ width: '32.1%' }} />
              <div className="h-full bg-amber-400" style={{ width: '67.9%' }} />
            </div>
          </div>
        </div>

        {/* Pipeline Stages */}
        {pipelineStages.map(stage => {
          const stageProjects = projects.filter(p => stage.projectIds.includes(p.id));
          return (
            <section key={stage.id} className="space-y-3">
              <div className="flex items-center justify-between gap-2 px-0.5">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {stage.title}
                </h3>
                <span className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200/70 dark:border-rose-800/60 px-2.5 py-0.5 rounded-lg tabular-nums shrink-0">
                  {stage.totalMW}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                {stageProjects.map(proj => {
                  const fuel = fuelConfig[proj.fuelType] || fuelConfig.gas || {};
                  const tone = proj.watchItem?.tone || 'amber';
                  const watchStyle = WATCH_TONE_STYLES[tone] || WATCH_TONE_STYLES.amber;
                  const watchBadgeStyle = WATCH_BADGE_STYLES[tone] || WATCH_BADGE_STYLES.amber;

                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => onSelectProject && onSelectProject(proj.id)}
                      className="text-left bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700/70 transition-all duration-150 active:scale-[0.99] flex flex-col justify-between gap-3.5 group"
                    >
                      <div className="space-y-3">
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span
                              className="w-6 h-6 rounded-full text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 tabular-nums"
                              style={{ backgroundColor: fuel.color || '#0F172A' }}
                            >
                              {proj.pinNumber}
                            </span>
                            <div className="min-w-0">
                              <h4 className="font-black text-base text-slate-900 dark:text-white leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                {proj.name}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">
                                {proj.plantType} · {proj.location}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0 tabular-nums">
                            <span className="inline-block text-xs sm:text-[13px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full">
                              {proj.capacity}
                            </span>
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                              COD {proj.cod}
                            </div>
                          </div>
                        </div>

                        {/* Way Forward */}
                        <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 leading-relaxed">
                          <span className="font-bold text-slate-900 dark:text-white">Way Forward: </span>
                          {proj.status}
                        </div>

                        {/* Semantic Watch Item Alert */}
                        {proj.watchItem && (
                          <div className={`border rounded-xl p-3 text-xs leading-relaxed ${watchStyle}`}>
                            <div className="flex items-center gap-1.5 font-extrabold mb-1">
                              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                              </svg>
                              <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-black ${watchBadgeStyle}`}>
                                {proj.watchItem.badge || 'Watch Item'}
                              </span>
                            </div>
                            <p>{proj.watchItem.text}</p>
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 truncate">
                          {proj.equity || 'SE Lead'} · {proj.region}
                        </span>
                        <span className="font-bold text-rose-600 dark:text-rose-400 inline-flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
                          <span>Inspect on Map</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Mengaris Solar RE Addition */}
        {mengarisSolar && (
          <button
            type="button"
            onClick={() => onSelectProject && onSelectProject(mengarisSolar.id)}
            className="w-full text-left bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/70 hover:border-amber-400 dark:hover:border-amber-600 rounded-2xl p-4 flex items-center justify-between gap-3 transition-all duration-150 active:scale-[0.995] group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shrink-0 tabular-nums">
                {mengarisSolar.pinNumber}
              </span>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                  {mengarisSolar.name} ({mengarisSolar.capacity})
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Renewable energy addition · {mengarisSolar.location} · COD {mengarisSolar.cod}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 tabular-nums">
              <span className="text-xs sm:text-sm font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-1 rounded-lg">
                {mengarisSolar.capacity}
              </span>
              <svg className="w-4 h-4 text-amber-700 dark:text-amber-300 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
