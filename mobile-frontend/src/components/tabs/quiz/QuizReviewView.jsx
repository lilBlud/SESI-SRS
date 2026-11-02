import React from 'react';

const formatMonthName = (m) => {
  if (!m) return '';
  const [y, mo] = m.split('-');
  const date = new Date(parseInt(y, 10), parseInt(mo, 10) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * QuizReviewView: Review screen presented when user finishes a quiz run.
 * Shows performance percentage, points breakdown, streak feedback, and action to return to Hub.
 */
export function QuizReviewView({
  answers,
  questions,
  isPracticeMode,
  score,
  streak,
  selectedMonth,
  recordedScore,
  onBackToHub
}) {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '📚';

  return (
    <div className="animate-slideUp space-y-5 text-center">
      <div className="pt-6">
        <div className="text-5xl mb-4 animate-bounce-slow">{emoji}</div>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
          <span className="text-3xl font-extrabold text-white tabular-nums tracking-tight">{pct}%</span>
        </div>
        <h2 className="text-[22px] font-extrabold tracking-tight mt-4 text-slate-900 dark:text-white">
          {isPracticeMode ? 'Practice Completed!' : 'Quiz Completed!'}
        </h2>
        <div className="text-slate-500 dark:text-slate-400 text-[14px] mt-2 px-2">
          {isPracticeMode ? (
            <div className="space-y-3">
              <p>
                You answered <strong className="text-slate-900 dark:text-white font-bold">{correctCount} of {questions.length}</strong> questions correctly.
              </p>
              <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-[12px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 leading-relaxed text-left flex items-start gap-2">
                <span className="text-base shrink-0">ℹ️</span>
                <span>
                  Your official monthly leaderboard score for {formatMonthName(selectedMonth)} remains safe at <strong className="text-emerald-600 dark:text-emerald-400 font-black">{recordedScore} pts</strong>.
                </span>
              </div>
            </div>
          ) : (
            <p>
              You earned <span className="font-bold text-emerald-600">{score} pts</span> ({correctCount} / {questions.length} correct) for the Leaderboard!
            </p>
          )}
        </div>
      </div>

      {/* ─── Streak Status ─── */}
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex items-center justify-center gap-3">
        <span className="text-2xl">🔥</span>
        <div className="text-left">
          <div className="font-black text-[15px] text-slate-900 dark:text-white">{streak}-Day Streak</div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400">Keep it going tomorrow!</div>
        </div>
      </div>

      {/* ─── Return to Hub ─── */}
      <button
        type="button"
        onClick={onBackToHub}
        className="w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-2xl active:scale-[0.99] transition-all"
      >
        Back to Hub
      </button>
    </div>
  );
}

