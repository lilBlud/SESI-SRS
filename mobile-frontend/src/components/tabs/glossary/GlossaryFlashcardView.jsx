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
          <div className="flashcard-front absolute w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full">
              Tap to reveal
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-mono text-center tracking-tight ${clr.text}`}>{card.term}</h2>
            {card.full && !card.term.includes(' ') && (
              <div className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200 text-center px-4 leading-snug">{card.full}</div>
            )}
          </div>

          {/* Back */}
          <div className={`flashcard-back absolute w-full h-full flex flex-col items-center justify-between ${clr.bg} rounded-2xl p-4 sm:p-5 text-center overflow-hidden relative border border-slate-200 dark:border-slate-700 shadow-sm`}>
            {/* Ambient Aurora Mesh Glow Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl" aria-hidden="true">
              <div className={`absolute -top-10 -left-10 w-44 h-44 rounded-full blur-xl opacity-45 dark:opacity-35 animate-aurora-1 ${clr.pill}`} />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-xl opacity-40 dark:opacity-30 animate-aurora-2 bg-cyan-400 dark:bg-cyan-500" />
              <div className="absolute top-1/4 left-1/3 w-36 h-36 rounded-full blur-lg opacity-35 dark:opacity-25 animate-aurora-3 bg-fuchsia-400 dark:bg-emerald-500" />
              {/* Sweeping diagonal light sheen */}
              <div className="absolute inset-y-0 -left-20 w-36 bg-gradient-to-r from-transparent via-white/30 dark:via-white/15 to-transparent animate-aurora-sheen pointer-events-none" />
              {/* Protective Contrast Scrim */}
              <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/50 pointer-events-none" />
            </div>

            {/* Back Content Card (High-Contrast Glass Plate) */}
            <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center overflow-y-auto px-1 py-1">
              <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-4 shadow-xs border border-white/80 dark:border-slate-700/80 my-auto text-left">
                <p className="text-[13.5px] sm:text-[14px] text-slate-900 dark:text-slate-50 font-semibold leading-relaxed whitespace-pre-wrap text-center">
                  {card.desc}
                </p>

                {card.formula && card.formula !== 'area' && card.formula !== 'bar' && (
                  <div className="mt-3 bg-slate-50/90 dark:bg-slate-800/90 rounded-lg p-2.5 border border-slate-200/70 dark:border-slate-700/70 w-full">
                    <div className={`text-[13px] sm:text-[13.5px] font-bold text-center mb-1.5 leading-snug ${clr.text}`}>
                      📐 {card.formula}
                    </div>
                    {card.formulaNotations && (
                      <div className="text-[11px] text-slate-800 dark:text-slate-200 mt-1 leading-normal">
                        <span className="font-bold text-slate-900 dark:text-white">Notations:</span> <span>{card.formulaNotations.replace(/\n/g, ', ')}</span>
                      </div>
                    )}
                    {card.formulaTermMeanings && (
                      <div className="text-[11px] text-slate-800 dark:text-slate-200 mt-1 leading-normal line-clamp-3">
                        <span className="font-bold text-slate-900 dark:text-white">Meanings:</span> <span>{card.formulaTermMeanings.replace(/\n/g, ' | ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 pt-2 pb-0.5 w-full flex flex-col items-center gap-1.5 shrink-0">
              <div className="text-[10.5px] bg-emerald-100/95 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-full font-bold shadow-2xs border border-emerald-200/50 dark:border-emerald-800/50">
                ✓ Streak counted!
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleBookmark(card, 'glossary'); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all active:scale-95 text-[11.5px] font-bold shadow-2xs ${
                  isBookmarked(card.id || card.term, 'glossary')
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700/80'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill={isBookmarked(card.id || card.term, 'glossary') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isBookmarked(card.id || card.term, 'glossary') ? 'Saved' : 'Bookmark'}
              </button>
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
