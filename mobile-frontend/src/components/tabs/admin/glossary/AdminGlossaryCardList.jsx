import React from 'react';
import { CorporatePerformanceChart } from '../../../ui';

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
    <div className="space-y-3">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1 relative">
          <input
            placeholder={`Search ${isPerfStudio ? 'performance cards' : 'definitions'}...`}
            value={gFilter}
            onChange={e => setGFilter(e.target.value)}
            className="w-full box-border block pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          {gFilter && (
            <button
              onClick={() => setGFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={gCategoryFilter}
          onChange={e => setGCategoryFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border text-xs font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        >
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>
              Category: {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filteredTerms.map(t => {
          let parsedChart = [];
          try {
            parsedChart = t.chartData ? JSON.parse(t.chartData) : [];
          } catch {
            parsedChart = [];
          }
          const isPerfCard = t.category === 'Corporate Performance' || parsedChart.length > 0;
          const yearsWithData = [...new Set(parsedChart.map(d => String(d.year)))].sort();

          return (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black text-slate-900 dark:text-white">{t.term}</span>
                    {t.fullName && <span className="text-xs text-slate-400 font-medium">({t.fullName})</span>}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {t.category}
                    </span>
                  </div>
                  {t.description && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.description}</p>}

                  {isPerfCard && yearsWithData.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Years:</span>
                      {yearsWithData.map(y => (
                        <span
                          key={y}
                          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          {y}
                        </span>
                      ))}
                      <span className="text-[10px] font-bold text-slate-400">({parsedChart.length} data points)</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEditTerm(t)}
                    title="Edit Card"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all text-xs font-bold"
                  >
                    ✏️
                  </button>
                  {isPerfCard && (
                    <button
                      type="button"
                      onClick={() => onDuplicateTerm(t)}
                      title="Duplicate Card"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 transition-all text-xs font-bold"
                    >
                      📋
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteTerm(t.id)}
                    title="Delete Card"
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 transition-all text-xs font-bold"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Chart Preview for Performance Cards */}
              {isPerfCard && parsedChart.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <CorporatePerformanceChart
                    chartData={t.chartData}
                    term={t.term}
                    description={t.description || t.desc}
                    yAxisFormat={t.formulaNotations}
                    formula={t.formula || 'area'}
                  />
                </div>
              )}
            </div>
          );
        })}

        {filteredTerms.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            No matching {isPerfStudio ? 'performance cards' : 'definitions'} found.
          </div>
        )}
      </div>
    </div>
  );
}
