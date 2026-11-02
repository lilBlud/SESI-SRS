import React, { useState, useEffect, useCallback } from 'react';
import { currentMonth } from '../../utils/constants';
import { 
  getQuizQuestionsDirect, 
  getAvailableQuizzesWithStatusDirect,
  recordUserActivityDirect, 
  extractUserTargets, 
  supabase 
} from '../../utils/supabaseClient';

const formatMonthName = (m) => {
  if (!m) return '';
  const [y, mo] = m.split('-');
  const date = new Date(parseInt(y, 10), parseInt(mo, 10) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export function QuizTab({ user, streak, setActiveTab: _setActiveTab, onStreakUpdate }) {
  const [state, setState] = useState('idle'); // idle | loading | active | review
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0); // Current run points
  const [qStartTime, setQStartTime] = useState(0);
  const [quizStatus, setQuizStatus] = useState({
    hasAttempted: false,
    recordedScore: 0,
    answersCount: 0,
    answeredQuestionIds: []
  });
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const USERNAME = user?.preferredName || user?.fullName || user?.username || user?.email || "User";
  const DIVISION = user?.division || "IDD";
  const userIdentifiers = extractUserTargets(user || USERNAME);

  // Load all available monthly quizzes and completion status
  const loadQuizzes = useCallback(async () => {
    setLoadingQuizzes(true);
    try {
      const identifiers = extractUserTargets(user || USERNAME);
      const data = await getAvailableQuizzesWithStatusDirect(identifiers);
      setQuizzes(data || []);
    } catch (err) {
      console.warn("Could not load monthly quizzes:", err);
    } finally {
      setLoadingQuizzes(false);
    }
  }, [user, USERNAME]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  // Start selected monthly quiz
  const startQuiz = async (quizItem) => {
    setState('loading');
    const targetMonth = quizItem?.month || currentMonth;
    setSelectedMonth(targetMonth);

    try {
      const isAlreadyDone = Boolean(quizItem?.hasAttempted);
      setQuizStatus({
        hasAttempted: isAlreadyDone,
        recordedScore: quizItem?.score || 0,
        answersCount: quizItem?.answeredCount || 0,
        answeredQuestionIds: quizItem?.answeredQuestionIds || []
      });
      setIsPracticeMode(isAlreadyDone);

      const data = await getQuizQuestionsDirect(targetMonth).catch(() => null);
      if (!data || data.length === 0) {
        alert(`No questions available for ${formatMonthName(targetMonth)} yet.`);
        setState('idle');
        return;
      }

      const normalized = data.map(q => ({
        id: q.id ?? q.Id,
        question: q.question ?? q.Question ?? q.QuestionText ?? '',
        options: q.options ?? q.Options ?? [q.OptionA, q.OptionB, q.OptionC, q.OptionD].filter(Boolean),
        correctIndex: q.correctIndex ?? q.CorrectIndex ?? 0
      }));

      setQuestions(normalized.sort(() => Math.random() - 0.5));
      setState('active');
      setCurrentQ(0);
      setSelected(null);
      setAnswered(false);
      setAnswers([]);
      setScore(0);
      setQStartTime(Date.now());
    } catch (e) {
      console.error(e);
      alert("Network Error: " + e.message + ". Make sure database is accessible.");
      setState('idle');
    }
  };

  const selectAnswer = async (idx) => {
    if (answered) return;

    const timeTakenMs = Date.now() - qStartTime;
    const timeTakenSeconds = Math.floor(timeTakenMs / 1000);

    setSelected(idx);
    setAnswered(true);
    const q = questions[currentQ];
    const isCorrect = idx === q.correctIndex;

    // First attempt only check: User must not be in practice mode and question not previously answered
    const isFirstTime = !isPracticeMode && !quizStatus.answeredQuestionIds.includes(Number(q.id));

    let pointsAwarded = 0;
    if (isCorrect && isFirstTime) {
      pointsAwarded = Math.max(500, 1000 - (timeTakenSeconds * 10)); // max 1000, min 500
      setScore(s => s + pointsAwarded);
    }

    setAnswers(prev => [...prev, { questionId: q.id, selected: idx, correct: q.correctIndex, isCorrect, points: pointsAwarded, isFirstTime }]);

    // Only record to leaderboard database on first attempt
    if (isFirstTime) {
      const payload = {
        Username: USERNAME,
        PreferredName: user?.preferredName || "",
        Division: DIVISION,
        Month: selectedMonth,
        QuestionId: q.id || q.Id || 0,
        QuestionText: q.question || q.Question || "",
        SelectedOption: (q.options || q.Options || [])[idx] || "",
        IsCorrect: isCorrect,
        TimeTakenSeconds: timeTakenSeconds,
        PointsAwarded: pointsAwarded,
        staff_id: user?.id || null
      };

      try {
        await supabase.from('UserAnswers').insert([{
          ...payload,
          DateAnswered: new Date().toISOString()
        }]);
      } catch (dbErr) {
        console.warn("Direct Supabase insert failed:", dbErr);
      }
    }

    // Record streak directly to Supabase
    recordUserActivityDirect(user || USERNAME)
      .then(res => {
        if (res && onStreakUpdate) onStreakUpdate(res.streak, res.recorded);
      })
      .catch(err => {
        console.warn("Direct Supabase recordUserActivityDirect failed:", err);
      });
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setQStartTime(Date.now());
    } else {
      setState('review');
    }
  };

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slideUp">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-sm">Loading quiz...</p>
      </div>
    );
  }

  // ─ Idle Screen ─
  if (state === 'idle') {
    return (
      <div className="animate-slideUp space-y-5">
        <div className="text-center pt-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-[22px] sm:text-[24px] font-extrabold tracking-tight text-slate-900 dark:text-white mt-4">Monthly Knowledge Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium mt-1">
            Sharpen your energy regulatory knowledge
          </p>
        </div>

        {/* Streak Banner */}
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
          {streak >= 7 && <div className="ml-auto text-[11px] bg-orange-500 text-white px-2 py-1 rounded-full font-bold">🏆 Week!</div>}
        </div>

        {/* Quizzes List (Current + Previous Months) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎯</span> Monthly Quizzes
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {quizzes.length} available
            </span>
          </div>

          {loadingQuizzes ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              No quizzes published yet. Check back soon!
            </div>
          ) : (
            quizzes.map((quiz) => {
              const isCurrent = quiz.month === currentMonth;
              const hasQuestions = quiz.questionCount > 0;

              return (
                <div
                  key={quiz.month}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-4.5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-200/80 dark:border-slate-800 transition-all hover:border-emerald-500/40"
                >
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

                    {/* Answered Status Badge */}
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

                  {/* Context note */}
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
                        onClick={() => startQuiz(quiz)}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 active:scale-[0.99] text-slate-800 dark:text-slate-200 rounded-xl text-[12.5px] font-bold tracking-tight transition-all flex items-center justify-between"
                      >
                        <span>Review & Practice</span>
                        <span>→</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => startQuiz(quiz)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white rounded-xl text-[13px] font-bold tracking-tight shadow-md shadow-emerald-500/20 transition-all flex items-center justify-between"
                      >
                        <span>Start Quiz</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800/60 text-slate-400 rounded-xl text-[12px] font-semibold cursor-not-allowed text-center"
                    >
                      Questions In Preparation
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ─ Active Quiz ─
  if (state === 'active') {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;
    const lastAns = answers[answers.length - 1];

    return (
      <div className="animate-fadeIn space-y-5">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => { setState('idle'); loadQuizzes(); }} className="flex items-center text-[12px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg> Back
          </button>
          <div className="flex items-center gap-2">
            {isPracticeMode && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md">
                Practice Mode
              </span>
            )}
            <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">Question {currentQ + 1} / {questions.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
            {formatMonthName(selectedMonth)}
          </div>
          <h3 className="text-[16.5px] sm:text-[17px] font-bold tracking-tight leading-snug text-slate-900 dark:text-white">{q.question}</h3>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let styles = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
            if (answered) {
              if (idx === q.correctIndex) styles = 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300';
              else if (idx === selected) styles = 'bg-red-50 border-red-500 text-red-800 dark:bg-red-950/30 dark:text-red-300';
              else styles = 'opacity-50';
            }

            return (
              <button key={idx} onClick={() => selectAnswer(idx)} disabled={answered} className={`w-full text-left p-4 rounded-2xl border-2 text-[14.5px] font-medium leading-snug transition-all ${styles}`}>
                <div className="flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold mr-3 shrink-0 ${answered && idx === q.correctIndex ? 'bg-emerald-500 text-white' : answered && idx === selected ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {answered && idx === q.correctIndex ? '✓' : answered && idx === selected ? '✗' : String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

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
            <button onClick={nextQuestion} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl shadow-lg">
              {currentQ < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─ Review Screen ─
  if (state === 'review') {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const pct = Math.round((correctCount / questions.length) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '📚';
    return (
      <div className="animate-slideUp space-y-5 text-center">
        <div className="pt-6">
          <div className="text-5xl mb-4 animate-bounce-slow">{emoji}</div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
            <span className="text-3xl font-extrabold text-white tabular-nums tracking-tight">{pct}%</span>
          </div>
          <h2 className="text-[22px] font-extrabold tracking-tight mt-4">
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
                    Your official monthly leaderboard score for {formatMonthName(selectedMonth)} remains safe at <strong className="text-emerald-600 dark:text-emerald-400 font-black">{quizStatus.recordedScore} pts</strong>.
                  </span>
                </div>
              </div>
            ) : (
              <p>You earned <span className="font-bold text-emerald-600">{score} pts</span> ({correctCount} / {questions.length} correct) for the Leaderboard!</p>
            )}
          </div>
        </div>

        {/* Streak update */}
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex items-center justify-center gap-3">
          <span className="text-2xl">🔥</span>
          <div className="text-left">
            <div className="font-black text-[15px]">{streak}-Day Streak</div>
            <div className="text-[12px] text-slate-500">Keep it going tomorrow!</div>
          </div>
        </div>

        <button onClick={() => {
          setState('idle');
          loadQuizzes();
        }} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl">
          Back to Hub
        </button>
      </div>
    );
  }
}
