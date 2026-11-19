import React from 'react';
import { AnimatePresence, m } from 'motion/react';
import { formatMonthName } from '../../../utils/constants';
import { EASE_OUT_EXPO } from '../../../utils/motionConfig';

/**
 * QuizActiveView: View for taking an active monthly quiz.
 * Manages question progress, timer-based points, answer selection styling, and immediate feedback.
 */
export function QuizActiveView({
  selectedMonth,
  isPracticeMode,
  questions,
  currentQ,
  selected,
  answered,
  answers,
  onSelectAnswer,
  onNextQuestion,
  onExit
}) {
  const q = questions[currentQ];
  const lastAns = answers[answers.length - 1];
  const progressPct = questions.length > 0 ? Math.round(((currentQ + 1) / questions.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* ─── Top Bar Controls ─── */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center text-[12px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
        >
          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2">
          {isPracticeMode && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md">
              Practice Mode
            </span>
          )}
          <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
            Question {currentQ + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* ─── Smooth Progress Bar ─── */}
      <div
        className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden"
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuenow={currentQ + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
      >
        <m.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
        />
      </div>

      {/* ─── Question Card & Options (Keyed Directional Transition) ─── */}
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={q?.id ?? currentQ}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
          className="space-y-5"
        >
          {/* ─── Question Card ─── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              {formatMonthName(selectedMonth)}
            </div>
            <h3 className="text-[16.5px] sm:text-[17px] font-bold tracking-tight leading-snug text-slate-900 dark:text-white">
              {q.question}
            </h3>
          </div>

          {/* ─── Options List ─── */}
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let styles = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400/70 dark:hover:border-emerald-500/60';
              const isCorrectOption = answered && idx === q.correctIndex;
              const isWrongSelected = answered && idx === selected && idx !== q.correctIndex;

              if (answered) {
                if (isCorrectOption) {
                  styles = 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300';
                } else if (isWrongSelected) {
                  styles = 'bg-red-50 border-red-500 text-red-800 dark:bg-red-950/30 dark:text-red-300';
                } else {
                  styles = 'opacity-50';
                }
              }

              const feedbackAnim = isCorrectOption
                ? { scale: [1, 1.02, 1] }
                : isWrongSelected
                  ? { x: [0, -6, 6, -4, 4, 0] }
                  : { scale: 1, x: 0 };

              return (
                <m.button
                  key={idx}
                  type="button"
                  onClick={() => onSelectAnswer(idx)}
                  disabled={answered}
                  whileTap={answered ? undefined : { scale: 0.985 }}
                  animate={feedbackAnim}
                  transition={{ duration: isWrongSelected ? 0.28 : 0.22, ease: EASE_OUT_EXPO }}
                  className={`w-full text-left p-4 rounded-2xl border-2 text-[14.5px] font-medium leading-snug transition-colors ${styles}`}
                >
                  <div className="flex items-center">
                    {answered ? (
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold mr-3 shrink-0 ${idx === q.correctIndex
                          ? 'bg-emerald-500 text-white'
                          : idx === selected
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                      >
                        {idx === q.correctIndex ? '✓' : idx === selected ? '✗' : String.fromCharCode(65 + idx)}
                      </span>
                    ) : (
                      <kbd className="kbd kbd-sm w-8 h-8 rounded-lg mr-3 shrink-0 font-bold text-slate-600 dark:text-slate-300 border-alpha">
                        {String.fromCharCode(65 + idx)}
                      </kbd>
                    )}
                    <span>{opt}</span>
                  </div>
                </m.button>
              );
            })}
          </div>
        </m.div>
      </AnimatePresence>

      {/* ─── Results Feedback & Next Button ─── */}
      <AnimatePresence>
        {answered && (
          <m.div
            key={`feedback-${currentQ}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
            className="mt-6 space-y-3"
            role="status"
            aria-live="polite"
          >
            <div
              className={`alert justify-center rounded-2xl border-alpha py-3 ${lastAns?.isCorrect
                ? 'alert-success bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'alert-error bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200'
                }`}
            >
              {isPracticeMode ? (
                <div className="flex flex-col items-center justify-center gap-0.5 text-center">
                  <span className="font-black text-lg">
                    {lastAns?.isCorrect ? '✓ Correct Answer' : '✗ Incorrect Answer'}
                  </span>
                  <span className="text-xs font-semibold opacity-80">
                    Practice Mode • 0 pts awarded
                  </span>
                </div>
              ) : (
                <span className="font-extrabold text-lg tabular-nums tracking-tight">
                  {lastAns?.isCorrect ? `✓ +${lastAns?.points || 0} Points` : '✗ 0 Points'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onNextQuestion}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl shadow-lg active:scale-[0.99] transition-transform"
            >
              {currentQ < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
