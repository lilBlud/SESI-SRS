import React from 'react';

const YEARS = ['2022', '2023', '2024', '2025', '2026'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Multi-year (2022-2026) monthly dataset editor grid with year availability chips
 * for Performance Studio glossary cards.
 */
export function MonthlyDatasetEditorGrid({
  gChartData,
  setGChartData,
  cYear,
  setCYear
}) {
  const safeData = Array.isArray(gChartData) ? gChartData : [];
  const yearsWithData = [...new Set(safeData.map(d => String(d.year)))].sort();

  const handleMonthChange = (month, rawValue) => {
    setGChartData(prev => {
      const copy = Array.isArray(prev) ? [...prev] : [];
      const idx = copy.findIndex(d => d.month === month && String(d.year) === String(cYear));
      const parsed = parseFloat(rawValue);
      if (rawValue === '' || Number.isNaN(parsed)) {
        if (idx >= 0) copy.splice(idx, 1);
      } else if (idx >= 0) {
        copy[idx] = { ...copy[idx], value: parsed };
      } else {
        copy.push({ month, year: cYear, value: parsed });
      }
      return copy;
    });
  };

  return (
    <>
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>📅</span>
            <span>Monthly Dataset (Year: {cYear})</span>
          </span>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
            {YEARS.map(yr => (
              <button
                key={yr}
                type="button"
                onClick={() => setCYear(yr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  cYear === yr
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {MONTHS.map(month => {
            const existing = safeData.find(d => d.month === month && String(d.year) === String(cYear));
            const val = existing ? existing.value : '';
            return (
              <div
                key={month}
                className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-xs"
              >
                <div className="text-[10px] font-black text-slate-400 mb-1">{month}</div>
                <input
                  type="number"
                  step="any"
                  placeholder="-"
                  value={val}
                  onChange={e => handleMonthChange(month, e.target.value)}
                  className={`w-full box-border block text-right pr-2 pl-2 py-1.5 rounded-lg border text-[12px] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
                    val !== ''
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {yearsWithData.length > 0 && (
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Years Available in Dataset
          </span>
          <div className="flex flex-wrap gap-1.5">
            {yearsWithData.map(y => {
              const entries = safeData.filter(d => String(d.year) === y);
              return (
                <button
                  type="button"
                  key={y}
                  onClick={() => setCYear(y)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border flex items-center gap-1 ${
                    cYear === y
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{y}:</span>
                  <span
                    className={
                      cYear === y
                        ? 'text-emerald-200'
                        : 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                    }
                  >
                    {entries.length} mos
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
