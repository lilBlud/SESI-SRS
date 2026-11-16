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
    <div className="animate-slideUp space-y-6">
      {/* ─── Unified Hero & Streak Card ─── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        {/* Left: Knowledge Hub Icon + Title & Subtitle */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0 animate-float">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Monthly Knowledge Hub
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-[13px] font-medium mt-1">
              Sharpen your energy regulatory knowledge
            </p>
          </div>
        </div>

        {/* Right: Compact Streak Card */}
        <div className={`rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shrink-0 md:min-w-[280px] md:max-w-xs ${streak > 0 ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-800/80' : 'bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80'}`}>
          <div className="text-2xl sm:text-3xl shrink-0">{streak > 0 ? '🔥' : '💤'}</div>
          <div className="min-w-0">
            <div className="font-extrabold text-[13.5px] sm:text-[14.5px] tracking-tight text-slate-900 dark:text-white truncate">
              {streak > 0 ? `${streak}-Day Streak!` : 'No Streak Yet'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
              {streak > 0 ? 'Keep reading daily to maintain streak!' : 'Tap terms in Dictionary to start streak.'}
            </p>
          </div>
          {streak >= 7 && (
            <div className="ml-auto text-[10.5px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold shrink-0">
              🏆 Week!
            </div>
          )}
        </div>
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
