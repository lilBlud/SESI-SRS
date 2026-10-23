import React from 'react';

export function BridgingCapacityView({ bridgingCapacity }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 custom-scrollbar">
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 rounded-2xl p-3.5 text-white shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
          East Coast Security of Supply
        </span>
        <h2 className="text-base font-black mt-0.5">
          Bridging Capacity & Gas Transition
        </h2>
        <p className="text-[11px] text-sky-100/90 mt-0.5 leading-relaxed">
          Interim generation extensions to overcome the East Coast reserve deficit (-23.5%) before major transmission and CCGT completions.
        </p>
      </div>

      <div className="space-y-2.5">
        {bridgingCapacity.map(plant => (
          <div
            key={plant.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  {plant.name}
                </h4>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  plant.badgeColor === 'emerald'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : plant.badgeColor === 'amber'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {plant.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {plant.type} · {plant.location}
              </p>
              <p className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-200 mt-1.5">
                {plant.status}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-1 rounded-lg">
                {plant.capacity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
