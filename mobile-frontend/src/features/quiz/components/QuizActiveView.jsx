import React from 'react';
import { formatMonthName } from '../../../utils/constants';

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

  return (
    <div className="animate-fadeIn space-y-5">
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

      {/* ─── daisyUI Progress Bar ─── */}
      <progress
        className="progress progress-primary w-full h-2"
        value={currentQ + 1}
        max={questions.length}
        aria-label="Quiz progress"
      />

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
          let styles = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
          if (answered) {
            if (idx === q.correctIndex) {
              styles = 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300';
            } else if (idx === selected) {
              styles = 'bg-red-50 border-red-500 text-red-800 dark:bg-red-950/30 dark:text-red-300';
            } else {
              styles = 'opacity-50';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectAnswer(idx)}
              disabled={answered}
              className={`w-full text-left p-4 rounded-2xl border-2 text-[14.5px] font-medium leading-snug transition-all ${styles}`}
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
            </button>
          );
        })}
      </div>

      {/* ─── Results Feedback & Next Button ─── */}
      {answered && (
        <div className="mt-6 animate-scaleIn space-y-3" role="status" aria-live="polite">
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
        </div>
      )}
    </div>
  );
}
