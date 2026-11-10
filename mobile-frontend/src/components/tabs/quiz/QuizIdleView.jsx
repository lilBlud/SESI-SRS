import React, { useMemo } from 'react';
import { QuizCard } from './QuizCard';

/**
 * QuizIdleView: Landing view for Knowledge Hub.
 * Contains the Hub hero banner, user streak card, year filter, and list of monthly quizzes.
 */
export function QuizIdleView({
  streak,
  quizzes,
  loadingQuizzes,
  selectedYear,
  onSelectYear,
  onStartQuiz,
  currentMonth
}) {
  const availableYears = useMemo(
    () => ['All', ...Array.from(new Set(quizzes.map(q => q.month?.split('-')[0]).filter(Boolean)))],
    [quizzes]
  );

  const filteredQuizzes = useMemo(
    () => (selectedYear === 'All' ? quizzes : quizzes.filter(q => q.month?.startsWith(selectedYear))),
    [quizzes, selectedYear]
  );

  return (
    <div className="animate-slideUp space-y-5">
      {/* ─── Hero Header ─── */}
      <div className="text-center pt-4">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 animate-float">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-[22px] sm:text-[24px] font-extrabold tracking-tight text-slate-900 dark:text-white mt-4">
          Monthly Knowledge Hub
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium mt-1">
          Sharpen your energy regulatory knowledge
        </p>
      </div>

      {/* ─── Streak Banner ─── */}
      <div className={`rounded-2xl p-4 flex items-center gap-3 ${streak > 0 ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
        <div className="text-3xl">{streak > 0 ? '🔥' : '💤'}</div>
        <div>
          <div className="font-bold text-[15px] tracking-tight text-slate-900 dark:text-white">
            {streak > 0 ? `${streak}-Day Streak!` : 'No Streak Yet'}
          </div>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
            {streak > 0 ? 'Keep reading daily to maintain your streak!' : 'Tap terms in the Dictionary to start your streak.'}
          </p>
        </div>
        {streak >= 7 && (
          <div className="ml-auto text-[11px] bg-orange-500 text-white px-2 py-1 rounded-full font-bold">
            🏆 Week!
          </div>
        )}
      </div>

      {/* ─── Monthly Quizzes Section ─── */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎯</span> Monthly Quizzes
          </h3>
          <div className="flex items-center gap-2">
            {availableYears.length > 1 && (
              <select
                aria-label="Filter quizzes by year"
                value={selectedYear}
                onChange={(e) => onSelectYear(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold py-1 px-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/40 transition-all"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>
                ))}
              </select>
            )}
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md tabular-nums">
              {filteredQuizzes.length}
            </span>
          </div>
        </div>

        {loadingQuizzes ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            {selectedYear === 'All' ? 'No quizzes published yet. Check back soon!' : `No quizzes found for ${selectedYear}.`}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.month}
                quiz={quiz}
                isCurrent={quiz.month === currentMonth}
                onStart={onStartQuiz}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
