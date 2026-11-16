import React, { useRef } from 'react';

// Format month (e.g. "2026-10" to "Oct 2026")
const formatMonth = (m) => {
  if (!m) return '';
  const [y, mo] = m.split('-');
  const date = new Date(y, parseInt(mo, 10) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export function RecentQuestionsCarousel({
  loading,
  recentQuizzes = [],
  filterMonth,
  setFilterMonth,
  activeMonths = []
}) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-[17px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Recent Questions
              </h3>
              {!loading && recentQuizzes.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                  {recentQuizzes.length}
                </span>
              )}
            </div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-normal">
              Your latest answered questions &amp; performance
            </p>
          </div>
        </div>

        {/* Controls: Month filter & Carousel navigation */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold py-1.5 px-2.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/40 shadow-xs transition-all"
          >
            <option value="">All Time</option>
            {activeMonths.map(m => (
              <option key={m} value={m}>{formatMonth(m)}</option>
            ))}
          </select>

          {recentQuizzes.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={scrollLeft}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-xs"
                title="Scroll Left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-xs"
                title="Scroll Right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex gap-4 overflow-hidden py-2">
          {[1, 2, 3].map(idx => (
            <div
              key={idx}
              className="w-[280px] sm:w-[300px] shrink-0 bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs animate-pulse space-y-3"
            >
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg mt-4" />
            </div>
          ))}
        </div>
      ) : recentQuizzes.length === 0 ? (
        <div className="w-full text-center py-10 px-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {filterMonth ? `No questions answered in ${formatMonth(filterMonth)}.` : "You haven't answered any questions yet."}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Take this month's quiz from the Knowledge Hub to start building your answer history.
          </p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {recentQuizzes.map((ans, idx) => {
            const date = new Date(ans.dateAnswered).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <div
                key={idx}
                className="w-[280px] sm:w-[310px] shrink-0 snap-start bg-white dark:bg-slate-800/90 rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-shadow border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between gap-3"
              >
                {/* Question Text & Status Badge */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Question #{idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                        ans.isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                      }`}
                    >
                      {ans.isCorrect ? (
                        <>
                          <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          Correct
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Wrong
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-3">
                    {ans.questionText}
                  </p>
                </div>

                {/* Footer: Date, Time & Points */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{ans.timeTakenSeconds}s</span>
                    <span>•</span>
                    <span>{date}</span>
                  </div>

                  <span
                    className={`font-black text-xs px-2 py-0.5 rounded-md ${
                      ans.isCorrect
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    +{ans.pointsAwarded || 0} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
