import React from 'react';

export function PipelineStagesView({ pipelineStages, projects, watchItems }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar">
      {/* Header intro */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-3.5 text-white shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
          Generation Pipeline
        </span>
        <h2 className="text-base font-black mt-0.5">
          6 Projects (1,189 MW)
        </h2>
        <p className="text-[11px] text-slate-300 mt-0.5">
          3 projects in contracting & financial close stage, 3 in feasibility stage.
        </p>
      </div>

      {/* Stages */}
      {pipelineStages.map(stage => {
        const stageProjects = projects.filter(p => stage.projectIds.includes(p.id));
        return (
          <div key={stage.id} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {stage.title}
              </h3>
              <span className="text-[11px] font-black text-rose-600 dark:text-rose-400">
                {stage.totalMW}
              </span>
            </div>

            <div className="space-y-2.5">
              {stageProjects.map(proj => (
                <div
                  key={proj.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                        {proj.pinNumber}
                      </span>
                      <div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {proj.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {proj.plantType} · {proj.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                        {proj.capacity}
                      </span>
                      <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                        COD: {proj.cod}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11.5px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 leading-relaxed">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Way Forward: </span>
                    {proj.status}
                  </div>

                  {proj.watchItem && (
                    <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-2.5 text-[11px] text-rose-800 dark:text-rose-300">
                      <span className="font-black">⚠️ Watch Item: </span>
                      {proj.watchItem.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Mengaris Solar Additional Mention */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
            1
          </span>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">Mengaris Solar (15 MW)</h4>
            <p className="text-[10px] text-slate-500">Renewable energy addition · COD 2027</p>
          </div>
        </div>
        <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">15 MW</span>
      </div>

      {/* Watch Items Central Box */}
      <div className="space-y-2 pt-2">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 px-1">
          Active Watch Items & Risks
        </h3>
        <div className="space-y-2">
          {watchItems.map(watch => (
            <div
              key={watch.id}
              className={`rounded-2xl p-3 border ${
                watch.tone === 'rose'
                  ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  : watch.tone === 'amber'
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  : 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200'
              }`}
            >
              <div className="font-black text-xs">{watch.title}</div>
              <div className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                {watch.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
