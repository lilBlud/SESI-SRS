import React from 'react';
import { CorporatePerformanceChart } from '../../../../components/ui';
import { isMathFormula, normalizeGlossaryTerm } from '../../../../domain/glossaryModel';

export function AdminGlossaryCardList({
  isPerfStudio,
  gFilter,
  setGFilter,
  gCategoryFilter,
  setGCategoryFilter,
  availableCategories,
  filteredTerms,
  onEditTerm,
  onDuplicateTerm,
  onDeleteTerm
}) {
  return (
    <div className="space-y-4">
      {/* Filter Toolbar (Search + Horizontal Domain Pills) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {isPerfStudio ? 'Performance Metrics' : 'Glossary Entries'}
            </h3>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 tabular-nums">
              {filteredTerms.length}
            </span>
          </div>

          <div className="relative flex-1 sm:flex-initial sm:w-72">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder={`Search ${isPerfStudio ? 'metrics' : 'terms or definitions'}...`}
              value={gFilter}
              onChange={e => setGFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {gFilter && (
              <button
                type="button"
                onClick={() => setGFilter('')}
                aria-label="Clear filter"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Clickable Domain Pills */}
        {availableCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {availableCategories.map(cat => {
              const active = gCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGCategoryFilter(cat)}
                  className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 shrink-0 border ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredTerms.map(raw => {
          const t = raw.parsedChartData ? raw : normalizeGlossaryTerm(raw);
          const parsedChart = t.parsedChartData || [];
          const isPerfCard = t.isPerformanceCard;
          const yearsWithData = [...new Set(parsedChart.map(d => String(d.year)))].sort();
          const hasFormula = !isPerfCard && isMathFormula(t.formula);

          return (
            <div
              key={t.id || t.term}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        {t.term}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {t.cat}
                      </span>
                    </div>
                    {t.full && (
                      <div className="text-xs sm:text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                        {t.full}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditTerm(t)}
                      title="Edit Card"
                      aria-label={`Edit ${t.term}`}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center justify-center transition active:scale-90"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {isPerfCard && (
                      <button
                        type="button"
                        onClick={() => onDuplicateTerm(t)}
                        title="Duplicate Card"
                        aria-label={`Duplicate ${t.term}`}
                        className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center transition active:scale-90"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteTerm(t.id)}
                      title="Delete Card"
                      aria-label={`Delete ${t.term}`}
                      className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center transition active:scale-90"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {t.desc && (
                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {t.desc}
                  </p>
                )}

                {hasFormula && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 truncate">
                    {t.formula}
                  </div>
                )}

                {isPerfCard && yearsWithData.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-0.5 flex-wrap tabular-nums">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Years:</span>
                    {yearsWithData.map(y => (
                      <span
                        key={y}
                        className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800"
                      >
                        {y}
                      </span>
                    ))}
                    <span className="text-[11px] font-medium text-slate-400">
                      ({parsedChart.length} points)
                    </span>
                  </div>
                )}
              </div>

              {isPerfCard && parsedChart.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <CorporatePerformanceChart
                    chartData={t.chartData}
                    term={t.term}
                    description=""
                    yAxisFormat={t.formulaNotations}
                    formula={t.formula || 'area'}
                  />
                </div>
              )}
            </div>
          );
        })}

        {filteredTerms.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            No matching {isPerfStudio ? 'performance cards' : 'definitions'} found.
          </div>
        )}
      </div>
    </div>
  );
}
