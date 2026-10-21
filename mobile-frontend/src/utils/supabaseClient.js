import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://avlypjdoahothehakchf.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__T0Lcs6Js5Iy8x3EVnMhsw_6Cj_gcxv';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch all infographics directly from Supabase.
 * Returns array of normalized infographic objects.
 */
export async function getInfographicsDirect() {
  const { data, error } = await supabase
    .from('Infographics')
    .select('*')
    .order('PostedAt', { ascending: false });

  if (error) throw error;

  return (data || []).map(p => ({
    id: p.Id ?? p.id,
    title: p.Title ?? p.title ?? '',
    description: p.Description ?? p.description ?? '',
    imageUrl: p.ImageUrl ?? p.imageUrl ?? '',
    additionalImages: p.AdditionalImages ?? p.additionalImages ?? '',
    category: p.Category ?? p.category ?? 'General',
    postedAt: p.PostedAt ?? p.postedAt ?? new Date().toISOString()
  }));
}

/**
 * Fetch all glossary terms directly from Supabase.
 * Returns array of normalized glossary term objects.
 */
export async function getGlossaryDirect() {
  const { data, error } = await supabase
    .from('GlossaryTerms')
    .select('*')
    .order('Term', { ascending: true });

  if (error) throw error;

  return (data || []).map(g => ({
    id: g.Id ?? g.id,
    term: g.Term ?? g.term ?? '',
    full: g.FullName ?? g.full ?? g.fullName ?? '',
    desc: g.Description ?? g.desc ?? g.description ?? '',
    formula: g.Formula ?? g.formula ?? '',
    formulaNotations: g.FormulaNotations ?? g.formulaNotations ?? '',
    formulaTermMeanings: g.FormulaTermMeanings ?? g.formulaTermMeanings ?? '',
    cat: g.Category ?? g.cat ?? g.category ?? 'General',
    chartData: g.ChartData ?? g.chartData ?? ''
  }));
}

/**
 * Fetch monthly quiz questions directly from Supabase.
 */
export async function getQuizQuestionsDirect(month) {
  const { data, error } = await supabase
    .from('QuizQuestions')
    .select('*')
    .eq('Month', month);

  if (error) throw error;

  return (data || []).map(q => {
    const correctOpt = q.CorrectOption ?? q.correctOption ?? 'A';
    const optMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const correctIdx = optMap[correctOpt.toUpperCase()] ?? 0;
    const options = [
      q.OptionA ?? q.optionA ?? '',
      q.OptionB ?? q.optionB ?? '',
      q.OptionC ?? q.optionC ?? '',
      q.OptionD ?? q.optionD ?? ''
    ];
    const questionText = q.QuestionText ?? q.questionText ?? '';
    const id = q.Id ?? q.id;

    return {
      id,
      Id: id,
      question: questionText,
      Question: questionText,
      options,
      Options: options,
      correctIndex: correctIdx,
      CorrectIndex: correctIdx
    };
  });
}

/**
 * Fetch monthly leaderboard directly from Supabase UserAnswers.
 */
export async function getLeaderboardDirect(month) {
  const { data, error } = await supabase
    .from('UserAnswers')
    .select('*')
    .eq('Month', month);

  if (error) throw error;

  const raw = data || [];
  const groups = {};

  for (const a of raw) {
    const key = (a.PreferredName ?? a.preferredName ?? '').trim() || (a.Username ?? a.username ?? 'Anonymous');
    if (!groups[key]) {
      groups[key] = {
        username: key,
        displayName: key,
        score: 0,
        division: a.Division ?? a.division ?? 'General',
        dateTaken: a.DateAnswered ?? a.dateAnswered ?? ''
      };
    }
    groups[key].score += Number(a.PointsAwarded ?? a.pointsAwarded ?? 0);
  }

  return Object.values(groups)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function extractUserTargets(userOrIdentifiers) {
  if (!userOrIdentifiers) return [];
  if (Array.isArray(userOrIdentifiers)) {
    return userOrIdentifiers.map(t => String(t || '').trim().toLowerCase()).filter(Boolean);
  } else if (typeof userOrIdentifiers === 'object') {
    return [
      userOrIdentifiers.fullName,
      userOrIdentifiers.preferredName,
      userOrIdentifiers.username,
      userOrIdentifiers.email
    ].map(t => String(t || '').trim().toLowerCase()).filter(Boolean);
  } else {
    return [String(userOrIdentifiers || '').trim().toLowerCase()].filter(Boolean);
  }
}

/**
 * Check if the user has already answered the quiz for the specified month.
 * Returns status including whether they have attempted, recorded score, and count.
 */
export async function getUserMonthlyQuizStatusDirect(userOrIdentifiers, month) {
  const targets = extractUserTargets(userOrIdentifiers);
  if (targets.length === 0) {
    return { hasAttempted: false, recordedScore: 0, answersCount: 0, answeredQuestionIds: [] };
  }

  const { data, error } = await supabase
    .from('UserAnswers')
    .select('*')
    .eq('Month', month);

  if (error || !data) {
    return { hasAttempted: false, recordedScore: 0, answersCount: 0, answeredQuestionIds: [] };
  }

  const userAnswers = data.filter(a => {
    const u = (a.Username ?? a.username ?? '').trim().toLowerCase();
    const p = (a.PreferredName ?? a.preferredName ?? '').trim().toLowerCase();
    return targets.includes(u) || (p && targets.includes(p));
  });

  const totalScore = userAnswers.reduce((sum, a) => sum + Number(a.PointsAwarded ?? a.pointsAwarded ?? 0), 0);
  const answeredQuestionIds = [...new Set(userAnswers.map(a => Number(a.QuestionId ?? a.questionId)).filter(Boolean))];

  return {
    hasAttempted: userAnswers.length > 0,
    recordedScore: totalScore,
    answersCount: userAnswers.length,
    answeredQuestionIds
  };
}

/**
 * Fetch user's recent answered questions directly from Supabase.
 */
export async function getUserRecentAnswersDirect(userOrIdentifiers, month) {
  const targets = extractUserTargets(userOrIdentifiers);
  if (targets.length === 0) return [];

  let query = supabase
    .from('UserAnswers')
    .select('*')
    .order('DateAnswered', { ascending: false });

  if (month) {
    query = query.eq('Month', month);
  }

  const { data, error } = await query;
  if (error) throw error;

  const filtered = (data || []).filter(a => {
    const u = (a.Username ?? a.username ?? '').trim().toLowerCase();
    const p = (a.PreferredName ?? a.preferredName ?? '').trim().toLowerCase();
    return targets.includes(u) || (p && targets.includes(p));
  });

  return filtered.slice(0, 50).map(a => ({
    id: a.Id ?? a.id,
    questionText: a.QuestionText ?? a.questionText ?? '',
    isCorrect: a.IsCorrect ?? a.isCorrect ?? false,
    pointsAwarded: Number(a.PointsAwarded ?? a.pointsAwarded ?? 0),
    timeTakenSeconds: Number(a.TimeTakenSeconds ?? a.timeTakenSeconds ?? 0),
    dateAnswered: a.DateAnswered ?? a.dateAnswered ?? new Date().toISOString(),
    selectedOption: a.SelectedOption ?? a.selectedOption ?? '',
    month: a.Month ?? a.month ?? ''
  }));
}

/**
 * Fetch distinct active months for a user directly from Supabase.
 */
export async function getUserActiveMonthsDirect(userOrIdentifiers) {
  const targets = extractUserTargets(userOrIdentifiers);
  if (targets.length === 0) return [];

  const { data, error } = await supabase
    .from('UserAnswers')
    .select('Month, Username, PreferredName');

  if (error) throw error;

  const months = new Set();
  (data || []).forEach(a => {
    const u = (a.Username ?? a.username ?? '').trim().toLowerCase();
    const p = (a.PreferredName ?? a.preferredName ?? '').trim().toLowerCase();
    if (targets.includes(u) || (p && targets.includes(p))) {
      const m = a.Month ?? a.month;
      if (m) months.add(m);
    }
  });

  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

/**
 * Calculate user total score and rank directly from Supabase UserAnswers.
 */
export async function getUserScoreAndRankDirect(userOrIdentifiers, month) {
  const targets = extractUserTargets(userOrIdentifiers);
  if (targets.length === 0) return { score: 0, rank: null };

  const { data, error } = await supabase
    .from('UserAnswers')
    .select('*')
    .eq('Month', month);

  if (error || !data) return { score: 0, rank: null };

  const groups = {};
  for (const a of data) {
    const u = (a.Username ?? a.username ?? '').trim();
    const p = (a.PreferredName ?? a.preferredName ?? '').trim();
    const key = u || p || 'Anonymous';
    if (!groups[key]) {
      groups[key] = {
        username: u,
        preferredName: p,
        score: 0
      };
    }
    if (p) groups[key].preferredName = p;
    groups[key].score += Number(a.PointsAwarded ?? a.pointsAwarded ?? 0);
  }

  const sorted = Object.values(groups).sort((a, b) => b.score - a.score);
  const userIdx = sorted.findIndex(g => {
    const u = g.username.toLowerCase();
    const p = (g.preferredName || '').toLowerCase();
    return targets.includes(u) || (p && targets.includes(p));
  });

  if (userIdx === -1) {
    return { score: 0, rank: null };
  }

  return {
    score: sorted[userIdx].score,
    rank: userIdx + 1
  };
}

/**
 * Get user profile directly from Supabase StaffUsers.
 */
export async function getUserProfileDirect(usernameOrEmail) {
  if (!usernameOrEmail) return null;
  const target = usernameOrEmail.trim().toLowerCase();
  const { data, error } = await supabase
    .from('StaffUsers')
    .select('*');

  if (error || !data) return null;

  const user = data.find(u => 
    (u.Email && u.Email.toLowerCase() === target) || 
    (u.FullName && u.FullName.toLowerCase() === target)
  );

  if (!user) return null;

  return {
    id: user.Id ?? user.id,
    fullName: user.FullName ?? user.fullName,
    preferredName: user.PreferredName ?? user.preferredName,
    email: user.Email ?? user.email,
    division: user.Division ?? user.division,
    staffId: user.StaffId ?? user.staffId,
    profilePicture: user.ProfilePicture ?? user.profilePicture
  };
}

/**
 * Update user profile picture directly in Supabase StaffUsers.
 */
export async function updateProfilePictureDirect(usernameOrEmail, profilePicture) {
  if (!usernameOrEmail) throw new Error("Username required");
  const target = usernameOrEmail.trim().toLowerCase();
  const { data: allUsers, error: fetchErr } = await supabase.from('StaffUsers').select('*');
  if (fetchErr) throw fetchErr;

  const match = (allUsers || []).find(u => 
    (u.Email && u.Email.toLowerCase() === target) || 
    (u.FullName && u.FullName.toLowerCase() === target)
  );

  if (!match) throw new Error("User not found");

  const { error } = await supabase
    .from('StaffUsers')
    .update({ ProfilePicture: profilePicture || '' })
    .eq('Id', match.Id ?? match.id);

  if (error) throw error;
  return { success: true, profilePicture };
}

/**
 * Update preferred display name directly in Supabase StaffUsers and UserAnswers.
 */
export async function updatePreferredNameDirect(usernameOrEmail, preferredName) {
  if (!usernameOrEmail) throw new Error("Username required");
  const trimmed = (preferredName || '').trim().slice(0, 10);
  const target = usernameOrEmail.trim().toLowerCase();

  const { data: allUsers } = await supabase.from('StaffUsers').select('*');
  const match = (allUsers || []).find(u => 
    (u.Email && u.Email.toLowerCase() === target) || 
    (u.FullName && u.FullName.toLowerCase() === target)
  );

  if (match) {
    await supabase
      .from('StaffUsers')
      .update({ PreferredName: trimmed })
      .eq('Id', match.Id ?? match.id);
  }

  // Update in UserAnswers
  await supabase
    .from('UserAnswers')
    .update({ PreferredName: trimmed })
    .eq('Username', usernameOrEmail);

  return { success: true, preferredName: trimmed };
}

/**
 * Direct user login with Supabase StaffUsers.
 */
export async function loginDirect(email, password) {
  if (!email || !password) throw new Error("Email and password required");
  const targetEmail = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from('StaffUsers')
    .select('*')
    .eq('Email', targetEmail)
    .single();

  if (error || !data) {
    throw new Error("Invalid email or password");
  }

  if (data.PasswordHash !== password) {
    throw new Error("Invalid email or password");
  }

  return {
    id: data.Id ?? data.id,
    fullName: data.FullName ?? data.fullName,
    preferredName: data.PreferredName ?? data.preferredName,
    email: data.Email ?? data.email,
    division: data.Division ?? data.division,
    staffId: data.StaffId ?? data.staffId,
    profilePicture: data.ProfilePicture ?? data.profilePicture
  };
}

/**
 * Direct user signup with Supabase StaffUsers.
 */
export async function signupDirect({ fullName, preferredName, email, password, division, staffId }) {
  if (!email || !password) throw new Error("Email and password required");
  const targetEmail = email.trim().toLowerCase();

  const { data: existing } = await supabase
    .from('StaffUsers')
    .select('Id')
    .eq('Email', targetEmail);

  if (existing && existing.length > 0) {
    throw new Error("Email already exists");
  }

  const prefName = (preferredName || '').trim().slice(0, 10);
  const newUser = {
    FullName: fullName || '',
    PreferredName: prefName,
    Email: targetEmail,
    PasswordHash: password,
    Division: division || '',
    StaffId: staffId || '',
    ProfilePicture: '',
    CreatedAt: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('StaffUsers')
    .insert([newUser])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.Id ?? data.id,
    fullName: data.FullName ?? data.fullName,
    preferredName: data.PreferredName ?? data.preferredName,
    email: data.Email ?? data.email,
    division: data.Division ?? data.division,
    staffId: data.StaffId ?? data.staffId,
    profilePicture: data.ProfilePicture ?? data.profilePicture
  };
}

