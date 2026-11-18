import { normalizeGlossaryTerm } from '../../domain/glossaryModel';

export function mapInfographicDto(p) {
  return {
    id: p.Id ?? p.id,
    title: p.Title ?? p.title ?? '',
    description: p.Description ?? p.description ?? '',
    imageUrl: p.ImageUrl ?? p.imageUrl ?? '',
    additionalImages: p.AdditionalImages ?? p.additionalImages ?? '',
    category: p.Category ?? p.category ?? 'General',
    postedAt: p.PostedAt ?? p.postedAt ?? new Date().toISOString(),
  };
}

export function mapGlossaryTermDto(g) {
  return normalizeGlossaryTerm(g);
}

export function mapQuizQuestionDto(q) {
  const optMap = { A: 0, B: 1, C: 2, D: 3 };
  const correctOpt =
    q.CorrectOption ??
    q.correctOption ??
    (q.CorrectIndex !== undefined ? ['A', 'B', 'C', 'D'][q.CorrectIndex] : 'A');
  const correctIdx =
    q.CorrectIndex ??
    q.correctIndex ??
    optMap[String(correctOpt).toUpperCase()] ??
    0;
  const options = q.Options ??
    q.options ?? [
      q.OptionA ?? q.optionA ?? '',
      q.OptionB ?? q.optionB ?? '',
      q.OptionC ?? q.optionC ?? '',
      q.OptionD ?? q.optionD ?? '',
    ];
  const questionText = q.Question ?? q.question ?? q.QuestionText ?? q.questionText ?? '';
  const id = q.Id ?? q.id;

  return {
    id,
    Id: id,
    month: q.Month ?? q.month ?? '',
    question: questionText,
    Question: questionText,
    questionText,
    optionA: options[0] ?? '',
    optionB: options[1] ?? '',
    optionC: options[2] ?? '',
    optionD: options[3] ?? '',
    correctOption: String(correctOpt).toUpperCase(),
    options,
    Options: options,
    correctIndex: correctIdx,
    CorrectIndex: correctIdx,
  };
}

export function mapUserAnswerDto(a) {
  return {
    id: a.id ?? a.Id,
    questionId: a.questionId ?? a.QuestionId ?? a.Question_Id ?? null,
    questionText: a.questionText ?? a.QuestionText ?? '',
    isCorrect: a.isCorrect ?? a.IsCorrect ?? false,
    pointsAwarded: Number(a.pointsAwarded ?? a.PointsAwarded ?? 0),
    timeTakenSeconds: Number(a.timeTakenSeconds ?? a.TimeTakenSeconds ?? 0),
    dateAnswered: a.dateAnswered ?? a.DateAnswered ?? new Date().toISOString(),
    selectedOption: a.selectedOption ?? a.SelectedOption ?? '',
    month: a.month ?? a.Month ?? '',
  };
}

export function mapLeaderboardEntryDto(entry, idx) {
  return {
    key: entry.key || (entry.staffId ? `staff_${entry.staffId}` : entry.username || `entry_${idx}`),
    username: entry.username || entry.displayName || 'Anonymous',
    displayName: entry.displayName || entry.username || 'Anonymous',
    score: Number(entry.score || 0),
    division: entry.division || 'General',
    dateTaken: entry.dateTaken || '',
    streak: Number(entry.streak || 0),
    profilePicture: entry.profilePicture || null,
    staffId: entry.staffId ?? null,
  };
}
