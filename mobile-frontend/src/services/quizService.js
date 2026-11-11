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
  if (!targets.length) return [];
  const results = await Promise.all(
    targets.map(t => dataProvider.getUserRecentAnswers(t, month).catch(() => []))
  );
  const seen = new Set();
  const merged = [];
  for (const list of results) {
    for (const a of (list || [])) {
      const k = a.id ?? a.Id ?? `${a.month}-${a.questionId}`;
      if (!seen.has(k)) {
        seen.add(k);
        merged.push(a);
      }
    }
  }
  return merged;
}

export async function getUserActiveMonths(userOrIdentifiers) {
  const targets = extractUserTargets(userOrIdentifiers);
  if (!targets.length) return [];
  const results = await Promise.all(
    targets.map(t => dataProvider.getUserActiveMonths(t).catch(() => []))
  );
  const months = new Set(results.flat().filter(Boolean));
  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

export async function getUserMonthlyQuizStatus(userOrIdentifiers, month) {
  const answers = await getUserRecentAnswers(userOrIdentifiers, month);
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

  let rawAnswers = [];
  try {
    const answerPromises = (targets.length > 0 ? targets : ['']).map(t =>
      t ? dataProvider.getUserRecentAnswers(t).catch(() => []) : Promise.resolve([])
    );
    const answersNested = await Promise.all(answerPromises);
    const seenIds = new Set();
    for (const arr of answersNested) {
      for (const ans of (arr || [])) {
        const idKey = ans.id ?? ans.Id ?? `${ans.month}-${ans.questionId}`;
        if (!seenIds.has(idKey)) {
          seenIds.add(idKey);
          rawAnswers.push(ans);
        }
      }
    }
  } catch (err) {
    console.warn("Could not load user answers for quizzes:", err);
  }

  let questions = [];
  try {
    questions = (await dataProvider.getQuizSummary().catch(() => [])) || [];
  } catch (err) {
    console.warn("Could not load quiz summary:", err);
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

  // Ensure any month the user answered is included in monthMap
  for (const m of Object.keys(userMonthStats)) {
    if (!monthMap[m]) {
      monthMap[m] = { month: m, questionCount: userMonthStats[m].count || 10 };
    }
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

