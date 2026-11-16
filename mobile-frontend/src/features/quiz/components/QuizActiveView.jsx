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
  const progress = ((currentQ + 1) / questions.length) * 100;
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

      {/* ─── Animated Progress Bar ─── */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

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
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold mr-3 shrink-0 ${
                    answered && idx === q.correctIndex
                      ? 'bg-emerald-500 text-white'
                      : answered && idx === selected
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {answered && idx === q.correctIndex
                    ? '✓'
                    : answered && idx === selected
                    ? '✗'
                    : String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Results Feedback & Next Button ─── */}
      {answered && (
        <div className="mt-6 animate-scaleIn space-y-3">
          <div className="text-center">
            {isPracticeMode ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <span className={`font-black text-xl ${lastAns?.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                  {lastAns?.isCorrect ? '✓ Correct Answer' : '✗ Incorrect Answer'}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Practice Mode • 0 pts awarded
                </span>
              </div>
            ) : (
              <div className={`font-extrabold text-xl tabular-nums tracking-tight ${lastAns?.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                +{lastAns?.points || 0} Points
              </div>
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
