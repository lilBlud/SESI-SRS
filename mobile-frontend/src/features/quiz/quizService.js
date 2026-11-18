import { dataProvider } from '../../services/dataProvider';
import { currentMonth } from '../../utils/constants';
import { extractUserTargets } from '../../utils/rbac';

export async function getQuizQuestions(month) {
  return await dataProvider.getQuizQuestions(month);
}

export async function getAdminQuizQuestions(month, resolveLatest = false) {
  return await dataProvider.getAdminQuizQuestions(month, resolveLatest);
}

export async function addQuizQuestion(payload) {
  return await dataProvider.addQuizQuestion(payload);
}

export async function updateQuizQuestion(id, payload) {
  return await dataProvider.updateQuizQuestion(id, payload);
}

export async function deleteQuizQuestion(id) {
  return await dataProvider.deleteQuizQuestion(id);
}

export async function getQuizSummary() {
  return await dataProvider.getQuizSummary();
}

export async function getLeaderboard(month) {
  return await dataProvider.getLeaderboard(month);
}

export async function recordQuizAnswer(payload) {
  return await dataProvider.submitQuizAnswer(payload);
}

export async function getUserRecentAnswers(userOrIdentifiers, month) {
  if (!userOrIdentifiers) return [];
  const results = await dataProvider.getUserRecentAnswers(userOrIdentifiers, month).catch(() => []);
  return Array.isArray(results) ? results : [];
}

export async function getUserActiveMonths(userOrIdentifiers) {
  if (!userOrIdentifiers) return [];
  const results = await dataProvider.getUserActiveMonths(userOrIdentifiers).catch(() => []);
  return Array.isArray(results) ? results : [];
}

export async function getUserMonthlyQuizStatus(userOrIdentifiers, month) {
  const answers = await getUserRecentAnswers(userOrIdentifiers, month);
  const totalScore = answers.reduce((sum, a) => sum + Number(a.pointsAwarded || 0), 0);
  const answeredQuestionIds = [...new Set(answers.map(a => Number(a.questionId ?? a.QuestionId ?? a.id)).filter(Boolean))];

  return {
    hasAttempted: answers.length > 0,
    recordedScore: totalScore,
    answersCount: answers.length,
    answeredQuestionIds,
  };
}

export async function getAvailableQuizzesWithStatus(userOrIdentifiers) {
  let rawAnswers = [];
  try {
    rawAnswers = await getUserRecentAnswers(userOrIdentifiers);
  } catch (err) {
    console.warn('Could not load user answers for quizzes:', err);
  }

  let questions = [];
  try {
    questions = (await dataProvider.getQuizSummary().catch(() => [])) || [];
  } catch (err) {
    console.warn('Could not load quiz summary:', err);
  }

  const monthMap = {};
  for (const q of (questions || [])) {
    const m = q.month || q.Month;
    if (!m) continue;
    if (!monthMap[m]) monthMap[m] = { month: m, questionCount: 0 };
    monthMap[m].questionCount++;
  }

  const userMonthStats = {};
  for (const a of (rawAnswers || [])) {
    const m = a.month || a.Month;
    if (!m) continue;
    if (!userMonthStats[m]) {
      userMonthStats[m] = { score: 0, count: 0, questionIds: new Set() };
    }
    userMonthStats[m].score += Number(a.pointsAwarded ?? a.PointsAwarded ?? 0);
    userMonthStats[m].count++;
    const qid = a.questionId ?? a.QuestionId ?? a.id;
    if (qid) userMonthStats[m].questionIds.add(Number(qid));
  }

  for (const m of Object.keys(userMonthStats)) {
    if (!monthMap[m]) {
      monthMap[m] = { month: m, questionCount: userMonthStats[m].count || 10 };
    }
  }

  if (!monthMap[currentMonth]) {
    monthMap[currentMonth] = { month: currentMonth, questionCount: 0 };
  }

  return Object.values(monthMap)
    .sort((a, b) => b.month.localeCompare(a.month))
    .map(m => {
      const stats = userMonthStats[m.month];
      const qCount = m.questionCount;
      const answeredCount = stats ? stats.count : 0;
      const isCompleted = qCount > 0 ? answeredCount >= qCount : answeredCount > 0;
      return {
        month: m.month,
        questionCount: qCount,
        hasAttempted: isCompleted,
        score: stats ? stats.score : 0,
        answeredCount,
        answeredQuestionIds: stats ? Array.from(stats.questionIds) : [],
      };
    });
}

export async function getUserScoreAndRank(userOrIdentifiers, month) {
  const targets = extractUserTargets(userOrIdentifiers);
  const leaderboard = await dataProvider.getLeaderboard(month);

  const userEntryIndex = leaderboard.findIndex(entry => {
    const u = (entry.username || '').toLowerCase();
    const d = (entry.displayName || '').toLowerCase();
    return targets.includes(u) || targets.includes(d);
  });

  if (userEntryIndex !== -1) {
    const entry = leaderboard[userEntryIndex];
    return {
      score: entry.score,
      rank: userEntryIndex + 1,
      totalParticipants: leaderboard.length,
    };
  }

  // Fallback for users ranked below top-10 so profile score still displays accurately
  const recent = await getUserRecentAnswers(userOrIdentifiers, month);
  const fallbackScore = recent.reduce((sum, a) => sum + Number(a.pointsAwarded || 0), 0);
  return { score: fallbackScore, rank: null, totalParticipants: leaderboard.length };
}
