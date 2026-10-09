import React, { useState, useEffect } from 'react';
import { API_BASE, currentMonth } from '../../utils/constants';

export function QuizTab({ user, streak, setActiveTab, onStreakUpdate }) {
  const [state, setState] = useState('idle'); // idle | loading | active | review | leaderboard
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0); // This is now total points
  const [qStartTime, setQStartTime] = useState(0);

  const USERNAME = user?.fullName || "Ahmad Azib Danish"; // Simulated logged-in user
  const DIVISION = user?.division || "Strategic Planning Division"; // Simulated division

  // Fetch Monthly questions
  const startQuiz = async () => {
    setState('loading');
    try {
      const res = await fetch(`${API_BASE}/api/quiz/${currentMonth}`);
      const data = await res.json();
      if (!data || data.length === 0) {
        alert("No questions available for this month yet. Check back later!");
        setState('idle');
        return;
      }
      setQuestions(data.sort(() => Math.random() - 0.5));
      setState('active');
      setCurrentQ(0);
      setSelected(null);
      setAnswered(false);
      setAnswers([]);
      setScore(0);
      setQStartTime(Date.now());
    } catch (e) {
      console.error(e);
      alert("Network Error: " + e.message + ". Make sure backend is running and accessible.");
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

    let pointsAwarded = 0;
    if (isCorrect) {
      pointsAwarded = Math.max(500, 1000 - (timeTakenSeconds * 10)); // max 1000, min 500
      setScore(s => s + pointsAwarded);
    }

    setAnswers(prev => [...prev, { questionId: q.id, selected: idx, correct: q.correctIndex, isCorrect, points: pointsAwarded }]);

    fetch(`${API_BASE}/api/submit-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Username: USERNAME,
        Division: DIVISION,
        Month: currentMonth,
        QuestionId: q.id,
        QuestionText: q.question,
        SelectedOption: q.options[idx],
        IsCorrect: isCorrect,
        TimeTakenSeconds: timeTakenSeconds,
        PointsAwarded: pointsAwarded
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          alert("Failed to save answer: " + res.status + " " + text);
        } else {
          fetch(`${API_BASE}/api/streak/record`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: USERNAME })
          }).then(r => r.ok && r.json()).then(data => {
            if (data && onStreakUpdate) onStreakUpdate(data.streak, data.recorded);
          }).catch(() => { });
        }
      })
      .catch(e => alert("Network error saving answer: " + e.message));
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
        <p className="mt-4 text-slate-500 text-sm">Loading...</p>
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
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-4">Monthly Knowledge Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-1.5">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Quiz</p>
        </div>

        {/* Streak Banner */}
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${streak > 0 ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
          <div className="text-3xl">{streak > 0 ? '🔥' : '💤'}</div>
          <div>
            <div className="font-black text-[15px] text-slate-900 dark:text-white">
              {streak > 0 ? `${streak}-Day Streak!` : 'No Streak Yet'}
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {streak > 0 ? 'Keep reading daily to maintain your streak!' : 'Tap terms in the Dictionary to start your streak.'}
            </p>
          </div>
          {streak >= 7 && <div className="ml-auto text-[11px] bg-orange-500 text-white px-2 py-1 rounded-full font-bold">🏆 Week!</div>}
        </div>

        <div className="space-y-3">
          <button
            onClick={startQuiz}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-5 shadow-lg shadow-emerald-500/25 text-left active:scale-[0.98] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[16px] font-bold">Start Monthly Quiz</span>
              <p className="text-[13px] text-emerald-100 mt-1">Test your knowledge for this month</p>
            </div>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
          </button>


        </div>
      </div>
    );
  }



  // ─ Active Quiz ─
  if (state === 'active') {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <div className="animate-fadeIn space-y-5">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setState('idle')} className="flex items-center text-[12px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg> Back
          </button>
          <span className="text-[12px] font-bold text-slate-500">Question {currentQ + 1}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-[17px] font-bold leading-snug">{q.question}</h3>
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
              <button key={idx} onClick={() => selectAnswer(idx)} disabled={answered} className={`w-full text-left p-4 rounded-2xl border-2 text-[15px] font-medium transition-all ${styles}`}>
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
            <div className={`text-center font-black text-xl ${answers[answers.length - 1]?.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
              +{answers[answers.length - 1]?.points || 0} Points
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
            <span className="text-3xl font-black text-white">{pct}%</span>
          </div>
          <h2 className="text-2xl font-black mt-4">Quiz Completed!</h2>
          <p className="text-slate-500 text-[14px] mt-1">You earned <span className="font-bold text-emerald-600">{score} pts</span> ({correctCount} / {questions.length} correct)</p>
        </div>

        {/* Streak update */}
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex items-center justify-center gap-3">
          <span className="text-2xl">🔥</span>
          <div className="text-left">
            <div className="font-black text-[15px]">{streak}-Day Streak</div>
            <div className="text-[12px] text-slate-500">Keep it going tomorrow!</div>
          </div>
        </div>


        <button onClick={() => setState('idle')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl">
          Back to Hub
        </button>
      </div>
    );
  }
}

