import React from 'react';
import { CorporatePerformanceChart } from '../../../../components/ui';
import { DEFAULT_HISTORICAL_METRICS } from '../../../../data/historicalPerformanceData';
import { CATEGORIES } from '../../../../utils/constants';
import { MonthlyDatasetEditorGrid } from './MonthlyDatasetEditorGrid';

/**
 * Form for creating and editing both Standard Glossary Terms and
 * Corporate Performance chart cards.
 */
export function AdminGlossaryForm({
  isPerfStudio,
  gEditId,
  gTerm,
  setGTerm,
  gFull,
  setGFull,
  gCat,
  setGCat,
  gDesc,
  setGDesc,
  gFormula,
  setGFormula,
  gYAxisFormat,
  setGYAxisFormat,
  gNotations: _gNotations,
  setGNotations: _setGNotations,
  gMeanings,
  setGMeanings,
  gChartData,
  setGChartData,
  cYear,
  setCYear,
  gMsg,
  onSubmit,
  onCancel,
  onLoadPreset
}) {
  const categoryOptions = [
    ...CATEGORIES.filter(c => c.key !== 'All'),
    { key: 'General', label: 'General' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-lg space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{gEditId ? 'Edit Card' : 'Create New Card'}</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {isPerfStudio ? 'Performance Card' : 'Standard Term'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isPerfStudio
              ? 'Build interactive historical graphs with 2022–2026 data points'
              : 'Define glossary definitions, formulas, and category associations'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close editor"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition active:scale-90"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Quick Presets for Performance Cards */}
      {isPerfStudio && !gEditId && (
        <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Quick Presets (Click to autofill 2022–2026 dataset):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(DEFAULT_HISTORICAL_METRICS).map(k => (
              <button
                key={k}
                type="button"
                onClick={() => onLoadPreset(k)}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-300 hover:text-emerald-700 text-[11px] font-bold rounded-lg transition-all"
              >
                + {k}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Metric / Term Name *
            </label>
            <input
              required
              placeholder="e.g. TOTAL REVENUE, EPSB REVENUE..."
              className="w-full box-border block p-3 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={gTerm}
              onChange={e => setGTerm(e.target.value)}
            />
          </div>

          {!isPerfStudio && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Full Name (Optional)
              </label>
              <input
                placeholder="e.g. Incentive-Based Regulation"
                className="w-full box-border block p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={gFull}
                onChange={e => setGFull(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category *
            </label>
            <select
              className="w-full box-border block p-3 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={gCat}
              onChange={e => setGCat(e.target.value)}
            >
              {categoryOptions.map(cat => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Description / Definition
          </label>
          <textarea
            placeholder="Enter description or business meaning..."
            rows={2}
            className="w-full box-border block p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            value={gDesc}
            onChange={e => setGDesc(e.target.value)}
          />
        </div>

        {/* Standard Term Formula & Notations */}
        {!isPerfStudio && (
          <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Formula (Optional)
              </label>
              <input
                placeholder="e.g. Base Tariff = (Operating Cost + Return on Capital) / Total Sales"
                className="w-full box-border block p-2.5 rounded-xl border text-sm font-mono dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={gFormula}
                onChange={e => setGFormula(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Formula Notations &amp; Meanings (Optional)
              </label>
              <textarea
                placeholder={'e.g. R = Rate Base\nWACC = Weighted Average Cost of Capital'}
                rows={2}
                className="w-full box-border block p-2.5 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                value={gMeanings}
                onChange={e => setGMeanings(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Performance Card Specific Controls */}
        {isPerfStudio && (
          <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Chart Type
                </label>
                <select
                  className="w-full box-border block p-2.5 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={gFormula === 'bar' ? 'bar' : 'area'}
                  onChange={e => setGFormula(e.target.value)}
                >
                  <option value="area">Area Chart (Smooth Filled)</option>
                  <option value="bar">Bar Chart</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Y-Axis Unit / Format
                </label>
                <input
                  placeholder="e.g. in RM bil, in %, in mins..."
                  className="w-full box-border block p-2.5 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={gYAxisFormat}
                  onChange={e => setGYAxisFormat(e.target.value)}
                />
              </div>
            </div>

            <MonthlyDatasetEditorGrid
              gChartData={gChartData}
              setGChartData={setGChartData}
              cYear={cYear}
              setCYear={setCYear}
            />

            {/* Live Interactive Chart Preview */}
            {gChartData.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>👁️</span>
                    <span>Live Interactive Card Preview</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Test year switcher before saving</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
                  <CorporatePerformanceChart
                    chartData={JSON.stringify(gChartData)}
                    term={gTerm || 'PREVIEW METRIC'}
                    description={gDesc || 'Interactive preview of card as seen on Corporate Performance tab'}
                    yAxisFormat={gYAxisFormat}
                    formula={gFormula || 'area'}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          {gEditId && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl active:scale-95 transition-all"
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            className="flex-[2] py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <span>{gEditId ? '💾' : '➕'}</span>
            <span>{gEditId ? `Update Card (${gTerm})` : '+ Create Performance Card'}</span>
          </button>
        </div>

        {gMsg && (
          <div
            className={`text-sm font-semibold px-3.5 py-2.5 rounded-xl text-center ${
              gMsg.startsWith('✅')
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200'
            }`}
          >
            {gMsg}
          </div>
        )}
      </form>
    </div>
  );
}
