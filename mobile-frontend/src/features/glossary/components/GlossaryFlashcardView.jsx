import React from 'react';
import { getColor } from '../../../utils/constants';
import { isMathFormula } from '../../../domain/glossaryModel';

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
  // Keyboard navigation for desktop: Space to flip, Arrows to navigate
  React.useEffect(() => {
    if (filtered.length === 0) return undefined;
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        onFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setFlashcardIdx(i => Math.min(filtered.length - 1, i + 1));
        setFlipped(false);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setFlashcardIdx(i => Math.max(0, i - 1));
        setFlipped(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered.length, onFlip, setFlashcardIdx, setFlipped]);

  if (filtered.length === 0) return null;

  const safeIdx = Math.min(flashcardIdx, Math.max(0, filtered.length - 1));
  const card = filtered[safeIdx];
  const clr = getColor(card.cat);
  const deckProgress = filtered.length > 0 ? Math.round(((safeIdx + 1) / filtered.length) * 100) : 0;

  return (
    <div className="flex flex-col items-center w-full py-3">
      {/* Subtle Deck Progress Bar (Staging & Pose-to-Pose orientation) */}
      <div className="w-full max-w-md lg:max-w-2xl xl:max-w-3xl mb-4">
        <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-300 ease-out"
            style={{ width: `${deckProgress}%` }}
          />
        </div>
      </div>

      <div
        className={`w-full max-w-md lg:max-w-2xl xl:max-w-3xl h-72 lg:h-[380px] xl:h-[420px] flashcard cursor-pointer transition-transform duration-150 active:scale-[0.99] ${flipped ? 'flipped' : ''}`}
        onClick={onFlip}
      >
        <div className="flashcard-inner relative w-full h-full rounded-3xl shadow-lg border border-slate-200/80 dark:border-slate-700/80">
          {/* Front */}
          <div className={`flashcard-front absolute w-full h-full flex flex-col items-center justify-center ${clr.bg} rounded-3xl p-6 lg:p-10 shadow-sm border border-slate-200 dark:border-slate-700`}>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full">
              <span>Tap or press</span>
              <kbd className="kbd kbd-xs font-mono">Space</kbd>
              <span>to reveal</span>
            </span>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center tracking-tight ${clr.text}`}>{card.term}</h2>
            {card.full && !card.term.includes(' ') && (
              <div className="mt-4 text-sm lg:text-base font-bold text-slate-700 dark:text-slate-200 text-center px-4 leading-snug max-w-lg">{card.full}</div>
            )}
          </div>

          {/* Back */}
          <div className={`flashcard-back absolute w-full h-full flex flex-col items-center justify-between ${clr.bg} rounded-3xl p-5 lg:p-8 text-center overflow-hidden relative border border-slate-200 dark:border-slate-700 shadow-sm`}>
            {/* Ambient Aurora Mesh Glow Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl" aria-hidden="true">
              <div className={`absolute -top-10 -left-10 w-44 h-44 rounded-full blur-xl opacity-45 dark:opacity-35 animate-aurora-1 ${clr.pill}`} />
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-xl opacity-40 dark:opacity-30 animate-aurora-2 bg-cyan-400 dark:bg-cyan-500" />
              <div className="absolute top-1/4 left-1/3 w-36 h-36 rounded-full blur-lg opacity-35 dark:opacity-25 animate-aurora-3 bg-fuchsia-400 dark:bg-emerald-500" />
              {/* Sweeping diagonal light sheen */}
              <div className="absolute inset-y-0 -left-20 w-36 bg-gradient-to-r from-transparent via-white/30 dark:via-white/15 to-transparent animate-aurora-sheen pointer-events-none" />
            </div>

            {/* Back Content Container */}
            <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center overflow-y-auto px-3 py-1 text-center">
              <div className="w-full my-auto flex flex-col items-center justify-center text-center space-y-3">
                <p className="text-[14px] sm:text-[14.5px] lg:text-[16px] text-slate-900 dark:text-slate-50 font-semibold leading-relaxed whitespace-pre-wrap text-center max-w-sm lg:max-w-xl">
                  {card.desc}
                </p>

                {isMathFormula(card.formula) && (
                  <div className="w-full flex flex-col items-center justify-center text-center pt-2.5 border-t border-slate-300/40 dark:border-slate-700/40">
                    <div className={`inline-flex items-center gap-1.5 text-[13px] sm:text-[13.5px] lg:text-[15px] font-bold text-center mb-1.5 leading-snug ${clr.text}`}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d="M4 7h16M4 17h16M7 4v16M17 4v16" />
                      </svg>
                      <span>{card.formula}</span>
                    </div>
                    {card.formulaNotations && (
                      <div className="text-[11.5px] lg:text-xs text-slate-800 dark:text-slate-200 mt-1 leading-normal text-center max-w-md">
                        <span className="font-bold text-slate-900 dark:text-white">Notations:</span> <span>{card.formulaNotations.replace(/\n/g, ', ')}</span>
                      </div>
                    )}
                    {card.formulaTermMeanings && (
                      <div className="text-[11px] sm:text-[11.5px] lg:text-xs text-slate-800 dark:text-slate-200 mt-1 leading-normal text-center max-w-md">
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
      <div className="w-full max-w-md lg:max-w-2xl xl:max-w-3xl flex justify-between items-center mt-5 gap-2">
        <button
          onClick={() => { setFlashcardIdx(i => Math.max(0, i - 1)); setFlipped(false); }}
          disabled={safeIdx === 0}
          className="min-h-[44px] px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-150 active:scale-[0.97] disabled:opacity-45 disabled:active:scale-100 inline-flex items-center gap-1.5"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 tabular-nums">
            {safeIdx + 1} of {filtered.length}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
            <kbd className="kbd kbd-xs">Space</kbd> to flip • <kbd className="kbd kbd-xs">←</kbd> <kbd className="kbd kbd-xs">→</kbd> navigate
          </span>
        </div>
        <button
          onClick={() => { setFlashcardIdx(i => Math.min(filtered.length - 1, i + 1)); setFlipped(false); }}
          disabled={safeIdx === filtered.length - 1}
          className="min-h-[44px] px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-150 active:scale-[0.97] disabled:opacity-45 disabled:active:scale-100 inline-flex items-center gap-1.5"
        >
          <span>Next</span>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
