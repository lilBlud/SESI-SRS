import React from 'react';
import { formatMonthName } from '../../../utils/constants';

/**
 * QuizCard: Individual monthly quiz card component.
 * Displays quiz status (Answered vs Available vs Coming Soon), question count, and action button.
 */
export function QuizCard({ quiz, isCurrent, onStart }) {
  const hasQuestions = quiz.questionCount > 0;

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-4.5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-200/80 dark:border-slate-800 transition-all hover:border-emerald-500/40">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[16px] font-extrabold tracking-tight text-slate-900 dark:text-white">
              {formatMonthName(quiz.month)} Quiz
            </span>
            {isCurrent ? (
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                Current
              </span>
            ) : (
              <span className="text-[9.5px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">
                Past Month
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
            {hasQuestions ? `${quiz.questionCount} Questions` : 'Questions in preparation'}
          </p>
        </div>

        {/* Status Badge */}
        {quiz.hasAttempted ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full text-[11px] font-bold shadow-xs shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="tabular-nums">Answered • {quiz.score.toLocaleString()} pts</span>
          </div>
        ) : hasQuestions ? (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 rounded-full text-[11px] font-bold shrink-0">
            <span>⚡</span>
            <span>Available</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full text-[10.5px] font-medium shrink-0">
            <span>⏳ Coming Soon</span>
          </div>
        )}
      </div>

      {/* Description note */}
      <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
        {quiz.hasAttempted
          ? "Official monthly score recorded. You can retake anytime in Practice Mode."
          : hasQuestions
          ? "Earn points toward the monthly Leaderboard and boost your standing."
          : "Questions for this month will be posted soon."}
      </p>

      {/* Action Button */}
      {hasQuestions ? (
        quiz.hasAttempted ? (
          <button
            type="button"
            onClick={() => onStart(quiz)}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 active:scale-[0.99] text-slate-800 dark:text-slate-200 rounded-xl text-[12.5px] font-bold tracking-tight transition-all flex items-center justify-between"
          >
            <span>Review & Practice</span>
            <span>→</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onStart(quiz)}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white rounded-xl text-[13px] font-bold tracking-tight shadow-md shadow-emerald-500/20 transition-all flex items-center justify-between"
          >
            <span>Start Quiz</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )
      ) : (
        <button
          type="button"
          disabled
          className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800/60 text-slate-400 rounded-xl text-[12px] font-semibold cursor-not-allowed text-center"
        >
          Questions In Preparation
        </button>
      )}
    </div>
  );
}
