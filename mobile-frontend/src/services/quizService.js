import { dataProvider } from './dataProvider';
import { extractUserTargets } from '../utils/rbac';

export async function getQuizQuestions(month) {
  return await dataProvider.getQuizQuestions(month);
}

export async function getLeaderboard(month) {
  return await dataProvider.getLeaderboard(month);
}

export async function recordQuizAnswer(payload) {
  return await dataProvider.submitQuizAnswer(payload);
}

export async function getUserRecentAnswers(userOrIdentifiers, month) {
  const targets = extractUserTargets(userOrIdentifiers);
  const primary = targets[0] || '';
  if (!primary) return [];
  return await dataProvider.getUserRecentAnswers(primary, month);
}

export async function getUserActiveMonths(userOrIdentifiers) {
  const targets = extractUserTargets(userOrIdentifiers);
  const primary = targets[0] || '';
  if (!primary) return [];
  return await dataProvider.getUserActiveMonths(primary);
}

export async function getUserMonthlyQuizStatus(userOrIdentifiers, month) {
  const targets = extractUserTargets(userOrIdentifiers);
  const primary = targets[0] || '';
  if (!primary) {
    return { hasAttempted: false, recordedScore: 0, answersCount: 0, answeredQuestionIds: [] };
  }

  const answers = await dataProvider.getUserRecentAnswers(primary, month);
  const totalScore = answers.reduce((sum, a) => sum + Number(a.pointsAwarded || 0), 0);
  const answeredQuestionIds = [...new Set(answers.map(a => Number(a.id || a.questionId)).filter(Boolean))];

  return {
    hasAttempted: answers.length > 0,
    recordedScore: totalScore,
    answersCount: answers.length,
    answeredQuestionIds
  };
}

export async function getAvailableQuizzesWithStatus(userOrIdentifiers) {
  const targets = extractUserTargets(userOrIdentifiers);
  const primaryUser = targets[0] || '';

  const [questions, rawAnswers] = await Promise.all([
    dataProvider.getQuizSummary(),
    primaryUser ? dataProvider.getUserRecentAnswers(primaryUser) : Promise.resolve([])
  ]);

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

  const currentM = new Date().toISOString().slice(0, 7);
  if (!monthMap[currentM]) {
    monthMap[currentM] = { month: currentM, questionCount: 0 };
  }

  return Object.values(monthMap)
    .sort((a, b) => b.month.localeCompare(a.month))
    .map(m => {
      const stats = userMonthStats[m.month];
      return {
        month: m.month,
        questionCount: m.questionCount,
        hasAttempted: Boolean(stats && stats.count > 0),
        score: stats ? stats.score : 0,
        answeredCount: stats ? stats.count : 0,
        answeredQuestionIds: stats ? Array.from(stats.questionIds) : []
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
      totalParticipants: leaderboard.length
    };
  }

  return { score: 0, rank: null, totalParticipants: leaderboard.length };
}

