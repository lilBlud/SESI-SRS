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
    return {
      Id: q.Id ?? q.id,
      Question: q.QuestionText ?? q.questionText ?? '',
      Options: [
        q.OptionA ?? q.optionA ?? '',
        q.OptionB ?? q.optionB ?? '',
        q.OptionC ?? q.optionC ?? '',
        q.OptionD ?? q.optionD ?? ''
      ],
      CorrectIndex: optMap[correctOpt.toUpperCase()] ?? 0
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

