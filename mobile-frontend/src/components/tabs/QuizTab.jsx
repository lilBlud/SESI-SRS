import React, { useState, useEffect, useCallback } from 'react';
import { currentMonth } from '../../utils/constants';
import { 
  getQuizQuestionsDirect, 
  getAvailableQuizzesWithStatusDirect,
  recordUserActivityDirect, 
  recordQuizAnswerDirect,
  extractUserTargets 
} from '../../utils/supabaseClient';
import { QuizIdleView, QuizActiveView, QuizReviewView } from './quiz';

export function QuizTab({ user, streak, onStreakUpdate }) {
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'active' | 'review'
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState('All');

  // Active quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
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

  // Load all available monthly quizzes and completion status
  const loadQuizzes = useCallback(async () => {
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
  const handleStartQuiz = async (quizItem) => {
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
        alert("No questions available for this month yet.");
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

  const handleSelectAnswer = async (idx) => {
    if (answered) return;

    const timeTakenMs = Date.now() - qStartTime;
    const timeTakenSeconds = Math.floor(timeTakenMs / 1000);

    setSelected(idx);
    setAnswered(true);
    const q = questions[currentQ];
    const isCorrect = idx === q.correctIndex;

    const isFirstTime = !isPracticeMode && !quizStatus.answeredQuestionIds.includes(Number(q.id));

    let pointsAwarded = 0;
    if (isCorrect && isFirstTime) {
      pointsAwarded = Math.max(500, 1000 - (timeTakenSeconds * 10));
      setScore(s => s + pointsAwarded);
    }

    setAnswers(prev => [...prev, { questionId: q.id, selected: idx, correct: q.correctIndex, isCorrect, points: pointsAwarded, isFirstTime }]);

    if (isFirstTime) {
      recordQuizAnswerDirect({
        Username: USERNAME,
        PreferredName: user?.preferredName || "",
        Division: DIVISION,
        Month: selectedMonth,
        QuestionId: q.id || 0,
        QuestionText: q.question || "",
        SelectedOption: (q.options || [])[idx] || "",
        IsCorrect: isCorrect,
        TimeTakenSeconds: timeTakenSeconds,
        PointsAwarded: pointsAwarded,
        staff_id: user?.id || null
      });
    }

    recordUserActivityDirect(user || USERNAME)
      .then(res => {
        if (res && onStreakUpdate) onStreakUpdate(res.streak, res.recorded);
      })
      .catch(err => {
        console.warn("Direct Supabase recordUserActivityDirect failed:", err);
      });
  };

  const handleNextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setQStartTime(Date.now());
    } else {
      setState('review');
    }
  };

  const handleBackToHub = () => {
    setState('idle');
    loadQuizzes();
  };

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slideUp">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-sm">Loading quiz...</p>
      </div>
    );
  }

  if (state === 'active') {
    return (
      <QuizActiveView
        selectedMonth={selectedMonth}
        isPracticeMode={isPracticeMode}
        questions={questions}
        currentQ={currentQ}
        selected={selected}
        answered={answered}
        answers={answers}
        onSelectAnswer={handleSelectAnswer}
        onNextQuestion={handleNextQuestion}
        onExit={handleBackToHub}
      />
    );
  }

  if (state === 'review') {
    return (
      <QuizReviewView
        answers={answers}
        questions={questions}
        isPracticeMode={isPracticeMode}
        score={score}
        streak={streak}
        selectedMonth={selectedMonth}
        recordedScore={quizStatus.recordedScore}
        onBackToHub={handleBackToHub}
      />
    );
  }

  return (
    <QuizIdleView
      streak={streak}
      quizzes={quizzes}
      loadingQuizzes={loadingQuizzes}
      selectedYear={selectedYear}
      onSelectYear={setSelectedYear}
      onStartQuiz={handleStartQuiz}
      currentMonth={currentMonth}
    />
  );
}
