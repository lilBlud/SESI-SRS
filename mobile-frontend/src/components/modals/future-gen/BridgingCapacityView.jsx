import React from 'react';

const BADGE_STYLES = {
  emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

/**
 * East Coast bridging generation capacity & gas transition grid.
 */
export function BridgingCapacityView({ bridgingCapacity = [], eastCoastStats }) {
  const peak = eastCoastStats?.peakDemand || '421 MW';
  const dependable = eastCoastStats?.dependableCapacity || '322 MW';
  const reserveMargin = eastCoastStats?.reserveMargin || '-23.5%';

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Summary Banner with East Coast Supply Balance */}
        <div className="bg-gradient-to-r from-sky-900 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-xl">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight">
              Bridging Capacity &amp; Gas Transition
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/85 mt-1 leading-relaxed">
              Interim generation extensions overcoming the East Coast reserve deficit before major transmission and CCGT completions.
            </p>
          </div>

          <div className="lg:shrink-0 grid grid-cols-3 gap-2 sm:gap-3 bg-white/10 border border-white/15 rounded-xl p-3.5 tabular-nums text-center">
            <div className="px-2">
              <div className="text-sm sm:text-base font-black text-white">{peak}</div>
              <div className="text-[11px] font-semibold text-sky-200 mt-0.5">EC Peak</div>
            </div>
            <div className="px-2 border-l border-white/15">
              <div className="text-sm sm:text-base font-black text-sky-300">{dependable}</div>
              <div className="text-[11px] font-semibold text-sky-200 mt-0.5">Dependable</div>
            </div>
            <div className="px-2 border-l border-white/15">
              <div className="text-sm sm:text-base font-black text-rose-300">{reserveMargin}</div>
              <div className="text-[11px] font-semibold text-sky-200 mt-0.5">EC Deficit</div>
            </div>
          </div>
        </div>

        {/* Plant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
          {bridgingCapacity.map(plant => {
            const badgeStyle = BADGE_STYLES[plant.badgeColor] || BADGE_STYLES.slate;
            return (
              <div
                key={plant.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between gap-3.5"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                        {plant.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {plant.type}
                      </p>
                    </div>
                    <span className="text-xs sm:text-[13px] font-black text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2.5 py-1 rounded-lg tabular-nums shrink-0">
                      {plant.capacity}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {plant.status}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium truncate">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{plant.location}</span>
                  </span>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${badgeStyle}`}>
                    {plant.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
