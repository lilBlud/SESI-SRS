import React from 'react';
import { getCatMeta, getColor } from '../../../utils/constants';
import { CorporatePerformanceChart } from '../../../components/ui';
import { isMathFormula, normalizeGlossaryTerm } from '../../../domain/glossaryModel';

function FormulaBlock({ item, clr, compact = false }) {
  if (!isMathFormula(item.formula)) return null;

  if (compact) {
    return (
      <div className={`mt-3 ${clr.bg} border-alpha concentric-inner p-3`}>
        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          📐 Formula
        </div>
        <div className={`text-[13px] font-semibold ${clr.text} leading-relaxed font-mono`}>
          {item.formula}
        </div>
        {item.formulaNotations && (
          <div className="mt-1.5 text-[11.5px] text-slate-600 dark:text-slate-300">
            <span className="font-bold">Notations: </span>
            <span>{item.formulaNotations.replace(/\n/g, ', ')}</span>
          </div>
        )}
        {item.formulaTermMeanings && (
          <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <ul className="text-[12.5px] text-slate-700 dark:text-slate-300 mt-0.5 space-y-1 leading-relaxed">
              {item.formulaTermMeanings.split('\n').map((line, i) => (
                <li key={i}>- {line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${clr.bg} border-alpha concentric-inner p-5 space-y-3`}>
      <div className="text-xs lg:text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <span>📐</span> Mathematical Formula
      </div>
      <div className={`text-base lg:text-lg font-bold font-mono ${clr.text} p-3.5 bg-white/70 dark:bg-slate-900/60 surface-depth-2 rounded-xl border-alpha`}>
        {item.formula}
      </div>
      {item.formulaNotations && (
        <div className="text-xs lg:text-[14px] text-slate-600 dark:text-slate-300">
          <span className="font-bold">Notations: </span>
          <span>{item.formulaNotations.replace(/\n/g, ', ')}</span>
        </div>
      )}
      {item.formulaTermMeanings && (
        <div className="pt-2 border-t border-black/5 dark:border-white/5">
          <div className="text-xs lg:text-[13px] font-bold text-slate-500 mb-1">Term Meanings:</div>
          <ul className="text-xs lg:text-[14px] text-slate-700 dark:text-slate-300 space-y-1.5">
            {item.formulaTermMeanings.split('\n').map((line, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Shared detail view for a glossary term or performance card.
 * Used across Glossary desktop detail pane, mobile expanded cards,
 * mobile table cells, and saved bookmark modals.
 */
export function GlossaryTermDetailCard({
  item,
  variant = 'desktop',
  bookmarked = false,
  onToggleBookmark,
  onExportPdf,
  showStreakBadge = true
}) {
  if (!item) return null;

  const norm = normalizeGlossaryTerm(item);
  const clr = getColor(norm.cat);
  const catMeta = getCatMeta(norm.cat);
  const isPerfCard = norm.isPerformanceCard;
  const chartTitle = norm.term || item.title || '';

  if (variant === 'desktop') {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 surface-depth-1 border-alpha backdrop-blur-2xl concentric-card p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
        {/* Detail Card Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs lg:text-[13px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${clr.bg} ${clr.text} border ${clr.border}`}>
                {catMeta.emoji} {norm.cat}
              </span>
              {isPerfCard && (
                <span className="text-xs lg:text-[13px] font-bold px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50 flex items-center gap-1.5">
                  📈 Corporate Performance Metric
                </span>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {norm.term}
            </h1>
            {norm.full && (
              <h2 className="text-base lg:text-lg font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {norm.full}
              </h2>
            )}
          </div>

          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(item, 'glossary')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all active:scale-95 text-xs lg:text-sm font-bold ${
                bookmarked
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>{bookmarked ? 'Saved to Bookmarks' : 'Bookmark Term'}</span>
            </button>
          )}
        </div>

        {/* Definition */}
        <p className="text-[15px] lg:text-[17px] text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
          {norm.desc}
        </p>

        <FormulaBlock item={norm} clr={clr} />

        {/* Interactive Corporate Performance Chart */}
        {isPerfCard && (
          <CorporatePerformanceChart
            chartData={norm.chartData}
            term={chartTitle}
            description=""
            yAxisFormat={norm.yAxisFormat}
            formula={norm.formula}
          />
        )}

        {/* Reading Streak Indicator */}
        {showStreakBadge && (
          <div className="pt-4 border-t border-alpha flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Counts toward your daily learning streak</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mt-2">
        {isPerfCard ? (
          <div className="space-y-2 mt-3 mb-2">
            <p className="text-[13.5px] text-slate-700 dark:text-slate-300 mb-3 leading-relaxed whitespace-pre-wrap font-normal">
              {norm.desc}
            </p>
            <CorporatePerformanceChart
              chartData={norm.chartData}
              term={chartTitle}
              description=""
              yAxisFormat={norm.yAxisFormat}
              formula={norm.formula}
            />
          </div>
        ) : (
          <p className="text-[13.5px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap font-normal">
            {norm.desc}
          </p>
        )}
      </div>

      <FormulaBlock item={norm} clr={clr} compact />

      {(showStreakBadge || onToggleBookmark || onExportPdf) && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
          {showStreakBadge ? (
            <div className="flex items-center gap-2 text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                ✓ Read
              </span>
              <span>Counts toward your daily streak!</span>
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2 shrink-0">
            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(item, 'glossary');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95 text-xs font-bold ${
                  bookmarked
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            )}

            {onExportPdf && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExportPdf(item, catMeta);
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-bold rounded-lg transition-all active:scale-95 shrink-0"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Save PDF
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
