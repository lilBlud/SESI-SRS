import React from 'react';
import { CATEGORIES, getColor } from '../../../utils/constants';

/**
 * Shared domain category filter bar rendered either as compact mobile pills
 * or as a full desktop sidebar list.
 */
export function GlossaryCategoryBar({
  cat,
  setCat,
  totalCount = 0,
  catCounts = {},
  variant = 'pills'
}) {
  if (variant === 'sidebar') {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 surface-depth-1 border-alpha backdrop-blur-2xl rounded-2xl p-3 shadow-md max-h-56 overflow-y-auto mask-fade-y space-y-1 scrollbar-thin">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Filter By Domain
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            {CATEGORIES.slice(1).length} domains
          </span>
        </div>
        <div className="space-y-1">
          {CATEGORIES.map(c => {
            const isActive = cat === c.key;
            const count = c.key === 'All' ? totalCount : (catCounts[c.key] || 0);
            const clr = c.key !== 'All' ? getColor(c.key) : null;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCat(c.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs lg:text-[13px] font-bold transition-all text-left group ${
                  isActive
                    ? (clr ? `${clr.bg} ${clr.text} ring-1 ${clr.border} shadow-xs` : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30 shadow-xs')
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0 pr-2">
                  {c.iconImage ? (
                    <img src={c.iconImage} alt={c.label} className="w-4 h-4 object-contain shrink-0" />
                  ) : (
                    <span className="text-sm shrink-0">{c.emoji}</span>
                  )}
                  <span className="whitespace-normal leading-snug">{c.label}</span>
                </span>
                <span className={`text-[11px] font-semibold tabular-nums shrink-0 px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/80 dark:bg-slate-900/60 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto mask-fade-y pb-2 pt-1 scrollbar-hide">
      {CATEGORIES.map(c => {
        const isActive = cat === c.key;
        const count = c.key === 'All' ? totalCount : (catCounts[c.key] || 0);
        const clr = c.key !== 'All' ? getColor(c.key) : null;
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => setCat(c.key)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold tracking-tight transition-all flex items-center gap-1 ${
              isActive
                ? (clr ? `${clr.pill} text-white shadow-md` : 'bg-emerald-600 text-white shadow-md')
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <div className="w-4 flex items-center justify-center shrink-0">
              {c.iconImage ? (
                <img src={c.iconImage} alt={c.label} className="h-4 w-auto object-contain scale-[1.5]" />
              ) : (
                <span className="text-[12px]">{c.emoji}</span>
              )}
            </div>
            {c.label}
            <span className={`text-[9px] ${isActive ? 'opacity-80' : 'opacity-50'}`}>({count})</span>
          </button>
        );
      })}
    </div>
  );
}
