import React from 'react';

// Format month (e.g. "2026-10" to "Oct 2026")
const formatMonth = (m) => {
  if (!m) return '';
  const [y, mo] = m.split('-');
  const date = new Date(y, parseInt(mo, 10) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export function RecentQuestionsCarousel({
  loading,
  recentQuizzes,
  filterMonth,
  setFilterMonth,
  activeMonths
}) {
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">Recent Questions</h3>
            <p className="text-[12px] text-slate-500 mt-1">Your latest answered questions</p>
          </div>
        </div>

        <select
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold py-1.5 px-2 rounded-lg outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/50 transition-all"
        >
          <option value="">All Time</option>
          {activeMonths.map(m => (
            <option key={m} value={m}>{formatMonth(m)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-[6vw] md:-mx-[calc(50%-175px)] md:px-[calc(50%-175px)]">
          {recentQuizzes.length === 0 ? (
            <div className="w-full text-center py-8 text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              {filterMonth ? `No questions answered in ${formatMonth(filterMonth)}.` : "You haven't answered any questions yet."}
            </div>
          ) : (
            recentQuizzes.map((ans, idx) => {
              const date = new Date(ans.dateAnswered).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div
                  key={idx}
                  className="w-[85%] max-w-[300px] shrink-0 snap-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10 flex flex-col justify-between gap-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight pr-4 line-clamp-3">
                      {ans.questionText}
                    </div>
                    <div className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${ans.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {ans.isCorrect ? 'Correct' : 'Wrong'}
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-[11px] text-slate-500">
                      {date} • {ans.timeTakenSeconds}s taken
                    </div>
                    <div className="font-black text-emerald-600 dark:text-emerald-400 text-[14px]">
                      +{ans.pointsAwarded} pts
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
