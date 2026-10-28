import React from 'react';
import { getColor } from '../../../utils/constants';

export function GlossaryFlashcardView({
  filtered = [],
  flashcardIdx,
  setFlashcardIdx,
  flipped,
  setFlipped,
  onFlip,
  isBookmarked,
  toggleBookmark
}) {
  if (filtered.length === 0) return null;

  const safeIdx = Math.min(flashcardIdx, filtered.length - 1);
  const card = filtered[safeIdx];
  const clr = getColor(card.cat);

  return (
    <div className="flex flex-col items-center w-full py-4">
      <div
        className={`w-full max-w-md h-72 flashcard cursor-pointer ${flipped ? 'flipped' : ''}`}
        onClick={onFlip}
      >
        <div className="flashcard-inner relative w-full h-full rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          {/* Front */}
          <div className="flashcard-front absolute w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl p-6">
            <span className="text-xs text-slate-400 uppercase tracking-widest mb-4">Tap to reveal</span>
            <h2 className={`text-4xl font-black font-mono text-center ${clr.text}`}>{card.term}</h2>
            {card.full && !card.term.includes(' ') && (
              <div className="mt-3 text-sm font-bold text-slate-500 text-center px-4">{card.full}</div>
            )}
          </div>

          {/* Back */}
          <div className={`flashcard-back absolute w-full h-full flex flex-col items-center justify-center ${clr.bg} rounded-2xl p-6 text-center overflow-hidden relative border border-slate-200/80 dark:border-slate-700/80`}>
            {/* Ambient Aurora Mesh Glow Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl" aria-hidden="true">
              <div className={`absolute -top-10 -left-10 w-44 h-44 rounded-full blur-xl opacity-65 dark:opacity-55 animate-aurora-1 ${clr.pill}`} />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-xl opacity-60 dark:opacity-50 animate-aurora-2 bg-cyan-400 dark:bg-cyan-500" />
              <div className="absolute top-1/4 left-1/3 w-36 h-36 rounded-full blur-lg opacity-50 dark:opacity-40 animate-aurora-3 bg-fuchsia-400 dark:bg-emerald-500" />
              {/* Sweeping diagonal light sheen */}
              <div className="absolute inset-y-0 -left-20 w-36 bg-gradient-to-r from-transparent via-white/35 dark:via-white/20 to-transparent animate-aurora-sheen pointer-events-none" />
            </div>

            {/* Back Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center overflow-y-auto">
              {(card.cat === 'Corporate Performance' || (card.chartData && card.chartData.length > 5 && card.chartData !== '[]')) ? (
                <div className="space-y-4 mt-2 w-full">
                  <p className="text-[13px] text-slate-700 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">{card.desc}</p>
                </div>
              ) : (
                <p className="text-[13px] text-slate-700 dark:text-slate-200 font-medium whitespace-pre-wrap">{card.desc}</p>
              )}

              {card.formula && card.formula !== 'area' && card.formula !== 'bar' && (
                <div className="mt-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs border border-white/60 dark:border-slate-700/60 rounded-xl px-3.5 py-2.5 text-left w-full">
                  <div className={`text-[12px] font-black font-mono text-center mb-2 ${clr.text}`}>
                    📐 {card.formula}
                  </div>
                  {card.formulaNotations && (
                    <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-1">
                      <span className="font-bold">Notations:</span> <span className="font-mono">{card.formulaNotations.replace(/\n/g, ', ')}</span>
                    </div>
                  )}
                  {card.formulaTermMeanings && (
                    <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-1 line-clamp-3">
                      <span className="font-bold">Meanings:</span> <span>{card.formulaTermMeanings.replace(/\n/g, ' | ')}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-auto pt-3 pb-1 w-full flex flex-col items-center gap-2">
                <div className="text-[11px] bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold shadow-xs">✓ Streak counted!</div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(card, 'glossary'); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all active:scale-95 text-[12px] font-bold ${
                    isBookmarked(card.id || card.term, 'glossary')
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <svg className="w-4 h-4" fill={isBookmarked(card.id || card.term, 'glossary') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {isBookmarked(card.id || card.term, 'glossary') ? 'Saved' : 'Bookmark'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="w-full max-w-md flex justify-between items-center mt-6">
        <button
          onClick={() => { setFlashcardIdx(i => Math.max(0, i - 1)); setFlipped(false); }}
          disabled={safeIdx === 0}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-xs font-bold disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-xs font-medium text-slate-500">{safeIdx + 1} of {filtered.length}</span>
        <button
          onClick={() => { setFlashcardIdx(i => Math.min(filtered.length - 1, i + 1)); setFlipped(false); }}
          disabled={safeIdx === filtered.length - 1}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-xs font-bold disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
