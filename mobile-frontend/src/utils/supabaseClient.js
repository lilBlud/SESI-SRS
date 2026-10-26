import { createClient } from '@supabase/supabase-js';
import { 
  DEFAULT_ADMIN_EMAILS, 
  resolveUserRole, 
  normalizeUser, 
  matchesUser 
} from './rbac';

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
 * Calculate consecutive day streak from an array of activity date timestamps.
 * Standardized to Malaysia UTC+8 timezone.
 */
export function calculateStreakFromDates(dates) {
  if (!dates || dates.length === 0) return 0;
  const uniqueDates = [...new Set(dates.map(d => {
    const dt = new Date(d);
    const myTime = new Date(dt.getTime() + (8 * 3600 * 1000));
    return myTime.toISOString().slice(0, 10);
  }))].sort().reverse();

  if (uniqueDates.length === 0) return 0;

  const now = new Date();
  const nowMy = new Date(now.getTime() + (8 * 3600 * 1000));
  const todayStr = nowMy.toISOString().slice(0, 10);

  const yesterday = new Date(nowMy.getTime() - (24 * 3600 * 1000));
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // If latest activity date is older than yesterday, streak is broken
  if (uniqueDates[0] < yesterdayStr) return 0;

  let streak = 0;
  let curr = new Date(uniqueDates[0] + 'T00:00:00Z');

  for (const dateStr of uniqueDates) {
    const expectedStr = curr.toISOString().slice(0, 10);
    if (dateStr === expectedStr) {
      streak++;
      curr = new Date(curr.getTime() - (24 * 3600 * 1000));
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Fetch monthly leaderboard directly from Supabase UserAnswers,
 * enriched with user streaks from UserActivities.
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
        username: a.Username ?? key,
        displayName: key,
        score: 0,
        division: a.Division ?? a.division ?? 'General',
        dateTaken: a.DateAnswered ?? a.dateAnswered ?? '',
        streak: 0
      };
    }
    groups[key].score += Number(a.PointsAwarded ?? a.pointsAwarded ?? 0);
  }

  // Enrich with user streaks from UserActivities
  try {
    const [actRes, staffRes] = await Promise.all([
      supabase.from('UserActivities').select('Username, ActivityDate'),
      supabase.from('StaffUsers').select('FullName, PreferredName, Email')
    ]);

    const actData = actRes.data || [];
    const staffData = staffRes.data || [];

    const userDates = {};
    for (const act of actData) {
      const u = (act.Username || '').trim().toLowerCase();
      if (!u) continue;
      if (!userDates[u]) userDates[u] = [];
      userDates[u].push(act.ActivityDate);
    }

    for (const entry of Object.values(groups)) {
      const uName = (entry.username || '').trim().toLowerCase();
      const dName = (entry.displayName || '').trim().toLowerCase();

      const matchedStaff = staffData.find(s => 
        (s.FullName && s.FullName.trim().toLowerCase() === uName) ||
        (s.PreferredName && s.PreferredName.trim().toLowerCase() === dName) ||
        (s.PreferredName && s.PreferredName.trim().toLowerCase() === uName) ||
        (s.FullName && s.FullName.trim().toLowerCase() === dName)
      );

      const aliases = [uName, dName];
      if (matchedStaff) {
        if (matchedStaff.FullName) aliases.push(matchedStaff.FullName.trim().toLowerCase());
        if (matchedStaff.PreferredName) aliases.push(matchedStaff.PreferredName.trim().toLowerCase());
        if (matchedStaff.Email) aliases.push(matchedStaff.Email.trim().toLowerCase());
      }

      const allDates = [];
      for (const alias of new Set(aliases)) {
        if (userDates[alias]) {
          allDates.push(...userDates[alias]);
        }
      }

      entry.streak = calculateStreakFromDates(allDates);
    }
  } catch (err) {
    console.warn("Could not calculate streaks for leaderboard entries:", err);
  }

  return Object.values(groups)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function extractUserTargets(userOrIdentifiers) {
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
 * Fetch a specific user's consecutive day streak directly from Supabase.
 */
export async function getUserStreakDirect(userOrIdentifiers) {
  const targets = extractUserTargets(userOrIdentifiers);
  if (targets.length === 0) return { streak: 0, dates: [] };

  try {
    const { data, error } = await supabase
      .from('UserActivities')
      .select('Username, ActivityDate')
      .order('ActivityDate', { ascending: false });

    if (error || !data) return { streak: 0, dates: [] };

    const matched = data.filter(a => {
      const u = String(a.Username ?? a.username ?? '').trim().toLowerCase();
      return targets.includes(u);
    });

    const dates = matched.map(m => m.ActivityDate ?? m.activityDate);
    const streak = calculateStreakFromDates(dates);
    return { streak, dates };
  } catch (e) {
    console.warn("getUserStreakDirect error:", e);
    return { streak: 0, dates: [] };
  }
}

/**
 * Record a user daily reading activity directly to Supabase.
 */
export async function recordUserActivityDirect(userOrUsername) {
  const targets = extractUserTargets(userOrUsername);
  const primaryName = typeof userOrUsername === 'object'
    ? (userOrUsername?.fullName || userOrUsername?.preferredName || userOrUsername?.username || 'User')
    : String(userOrUsername || 'User');

  if (!primaryName) return { streak: 0, recorded: false };

  const now = new Date();
  const nowMy = new Date(now.getTime() + (8 * 3600 * 1000));
  const todayDateOnly = nowMy.toISOString().slice(0, 10);
  const todayTimestamp = todayDateOnly + 'T00:00:00+00:00';

  try {
    // Check if user already recorded today
    const { data: existing } = await supabase
      .from('UserActivities')
      .select('Id, Username, ActivityDate')
      .gte('ActivityDate', todayDateOnly + 'T00:00:00')
      .lte('ActivityDate', todayDateOnly + 'T23:59:59');

    const alreadyDone = (existing || []).some(a => {
      const u = String(a.Username || '').trim().toLowerCase();
      return targets.includes(u) || u === primaryName.trim().toLowerCase();
    });

    let newlyRecorded = false;
    if (!alreadyDone) {
      const staffId = (typeof userOrUsername === 'object' && userOrUsername?.id) ? userOrUsername.id : null;
      const { error: insErr } = await supabase
        .from('UserActivities')
        .insert([{
          Username: primaryName,
          ActivityDate: todayTimestamp,
          staff_id: staffId
        }]);
      if (!insErr) newlyRecorded = true;
    }

    const { streak } = await getUserStreakDirect(userOrUsername);
    return { streak, recorded: newlyRecorded };
  } catch (err) {
    console.warn("recordUserActivityDirect error:", err);
    return { streak: 0, recorded: false };
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
 * Fetch administrator and revoked-staff sets
 * from EmployeeAwards with AwardTitle in ('ROLE_ADMIN', 'ROLE_STAFF').
 */
export async function getAdminRoleOverridesDirect() {
  const adminSet = new Set(DEFAULT_ADMIN_EMAILS.map(e => e.toLowerCase()));
  const staffSet = new Set();
  try {
    const { data, error } = await supabase
      .from('EmployeeAwards')
      .select('Username, AwardTitle')
      .in('AwardTitle', ['ROLE_ADMIN', 'ROLE_STAFF']);
    if (!error && data) {
      data.forEach(r => {
        const u = (r.Username || '').trim().toLowerCase();
        if (r.AwardTitle === 'ROLE_ADMIN') {
          adminSet.add(u);
          staffSet.delete(u);
        } else if (r.AwardTitle === 'ROLE_STAFF') {
          staffSet.add(u);
          adminSet.delete(u);
        }
      });
    }
  } catch (err) {
    console.warn("Could not query EmployeeAwards for admin roles:", err);
  }
  return { adminSet, staffSet };
}

/**
 * Backward compatibility alias
 */
export async function getAdminIdentifiersDirect() {
  const { adminSet } = await getAdminRoleOverridesDirect();
  return adminSet;
}

/**
 * Fetch all registered staff users and determine their role ('Admin' | 'Staff').
 */
export async function getAllUsersDirect() {
  const [usersRes, overrides] = await Promise.all([
    supabase.from('StaffUsers').select('*').order('FullName', { ascending: true }),
    getAdminRoleOverridesDirect()
  ]);

  if (usersRes.error) throw usersRes.error;

  return (usersRes.data || []).map(u => 
    normalizeUser(u, resolveUserRole(u, overrides))
  );
}

/**
 * Update user role ('Admin' | 'Staff').
 * Prevents demoting the last remaining administrator.
 */
export async function updateUserRoleDirect(targetUserOrId, newRole) {
  if (!['Admin', 'Staff'].includes(newRole)) {
    throw new Error("Invalid role. Role must be 'Admin' or 'Staff'.");
  }

  const allUsers = await getAllUsersDirect();
  const target = allUsers.find(u => matchesUser(u, targetUserOrId));

  if (!target) {
    throw new Error("User not found.");
  }

  if (target.role === 'Admin' && newRole === 'Staff') {
    const adminCount = allUsers.filter(u => u.role === 'Admin').length;
    if (adminCount <= 1) {
      throw new Error("Cannot demote the last remaining Administrator. At least one admin must exist.");
    }
  }

  const targetEmail = target.email.trim().toLowerCase();
  const userAliases = [targetEmail, target.fullName.toLowerCase(), target.staffId.toLowerCase()].filter(Boolean);

  // 1. Try updating Role in StaffUsers if column exists
  try {
    await supabase
      .from('StaffUsers')
      .update({ Role: newRole })
      .eq('Id', target.id);
  } catch {}

  // 2. Persist role in EmployeeAwards system records
  if (newRole === 'Admin') {
    await supabase
      .from('EmployeeAwards')
      .delete()
      .eq('AwardTitle', 'ROLE_STAFF')
      .in('Username', userAliases);

    const { data: existing } = await supabase
      .from('EmployeeAwards')
      .select('Id')
      .eq('AwardTitle', 'ROLE_ADMIN')
      .eq('Username', targetEmail);

    if (!existing || existing.length === 0) {
      const { error: insErr } = await supabase
        .from('EmployeeAwards')
        .insert([{
          Month: 'SYSTEM',
          Username: targetEmail,
          AwardTitle: 'ROLE_ADMIN',
          Message: `Admin granted to ${target.fullName}`
        }]);
      if (insErr) throw insErr;
    }
  } else {
    await supabase
      .from('EmployeeAwards')
      .delete()
      .eq('AwardTitle', 'ROLE_ADMIN')
      .in('Username', userAliases);

    const { data: existingStaff } = await supabase
      .from('EmployeeAwards')
      .select('Id')
      .eq('AwardTitle', 'ROLE_STAFF')
      .eq('Username', targetEmail);

    if (!existingStaff || existingStaff.length === 0) {
      await supabase
        .from('EmployeeAwards')
        .insert([{
          Month: 'SYSTEM',
          Username: targetEmail,
          AwardTitle: 'ROLE_STAFF',
          Message: `Admin revoked for ${target.fullName}`
        }]);
    }
  }

  return {
    id: target.id,
    fullName: target.fullName,
    role: newRole
  };
}

/**
 * Fetch a specific user's profile info directly from Supabase StaffUsers.
 */
export async function getUserProfileDirect(usernameOrEmail) {
  if (!usernameOrEmail) return null;

  const [usersRes, overrides] = await Promise.all([
    supabase.from('StaffUsers').select('*'),
    getAdminRoleOverridesDirect()
  ]);

  if (usersRes.error || !usersRes.data) return null;

  const user = usersRes.data.find(u => matchesUser(u, usernameOrEmail));
  if (!user) return null;

  return normalizeUser(user, resolveUserRole(user, overrides));
}

/**
 * Update user profile picture directly in Supabase StaffUsers.
 */
export async function updateProfilePictureDirect(usernameOrEmail, profilePicture) {
  if (!usernameOrEmail) throw new Error("Username required");
  const target = usernameOrEmail.trim().toLowerCase();
  const { data: allUsers, error: fetchErr } = await supabase
    .from('StaffUsers')
    .select('Id, FullName, PreferredName, Email, Division, StaffId, ProfilePicture');
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
 * Update user profile information (preferred name and/or division) directly in Supabase StaffUsers, UserAnswers, and VisitorLogs.
 */
export async function updateUserProfileInfoDirect(userOrUsernameOrEmail, { preferredName, division } = {}) {
  if (!userOrUsernameOrEmail) throw new Error("User required");

  let target = '';
  let targetId = null;
  if (typeof userOrUsernameOrEmail === 'object' && userOrUsernameOrEmail !== null) {
    targetId = userOrUsernameOrEmail.id ?? userOrUsernameOrEmail.Id ?? null;
    target = (userOrUsernameOrEmail.email || userOrUsernameOrEmail.Email || userOrUsernameOrEmail.fullName || userOrUsernameOrEmail.FullName || userOrUsernameOrEmail.staffId || userOrUsernameOrEmail.StaffId || '').trim().toLowerCase();
  } else {
    target = String(userOrUsernameOrEmail).trim().toLowerCase();
  }

  const { data: allUsers } = await supabase
    .from('StaffUsers')
    .select('Id, FullName, PreferredName, Email, Division, StaffId, ProfilePicture');

  const match = (allUsers || []).find(u => 
    (targetId && (u.Id === targetId || u.id === targetId)) ||
    (u.Email && u.Email.toLowerCase() === target) || 
    (u.FullName && u.FullName.toLowerCase() === target) ||
    (u.StaffId && u.StaffId.toLowerCase() === target) ||
    (String(u.Id) === target)
  );

  const updates = {};
  if (preferredName !== undefined) {
    updates.PreferredName = (preferredName || '').trim().slice(0, 10);
  }
  if (division !== undefined) {
    updates.Division = (division || '').trim();
  }

  if (match && Object.keys(updates).length > 0) {
    await supabase
      .from('StaffUsers')
      .update(updates)
      .eq('Id', match.Id ?? match.id);
  }

  // Update in UserAnswers across all aliases
  const targetUsernames = [
    target,
    match?.FullName,
    match?.Email,
    match?.StaffId,
    typeof userOrUsernameOrEmail === 'object' ? userOrUsernameOrEmail?.fullName : null,
    typeof userOrUsernameOrEmail === 'object' ? userOrUsernameOrEmail?.preferredName : null
  ].filter(Boolean);

  for (const tu of new Set(targetUsernames)) {
    const ansUpdates = {};
    if (updates.PreferredName !== undefined) ansUpdates.PreferredName = updates.PreferredName;
    if (updates.Division !== undefined) ansUpdates.Division = updates.Division;
    if (Object.keys(ansUpdates).length > 0) {
      await supabase
        .from('UserAnswers')
        .update(ansUpdates)
        .eq('Username', tu);
    }
  }

  // Sync VisitorLogs for this user
  if (updates.Division) {
    for (const tu of new Set(targetUsernames)) {
      await supabase
        .from('VisitorLogs')
        .update({ Division: updates.Division })
        .eq('Username', tu);
    }
  }

  return { success: true, ...updates };
}

/**
 * Update preferred display name directly in Supabase StaffUsers and UserAnswers.
 */
export async function updatePreferredNameDirect(userOrUsernameOrEmail, preferredName) {
  return updateUserProfileInfoDirect(userOrUsernameOrEmail, { preferredName });
}

/**
 * Direct user login with Supabase StaffUsers.
 */
export async function loginDirect(email, password) {
  if (!email || !password) throw new Error("Email and password required");
  const targetEmail = email.trim().toLowerCase();
  const [loginRes, overrides] = await Promise.all([
    supabase.from('StaffUsers').select('*').eq('Email', targetEmail).single(),
    getAdminRoleOverridesDirect()
  ]);

  const { data, error } = loginRes;

  if (error || !data) {
    throw new Error("Invalid email or password");
  }

  if (data.PasswordHash !== password) {
    throw new Error("Invalid email or password");
  }

  return normalizeUser(data, resolveUserRole(data, overrides));
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

  return normalizeUser(data, 'Staff');
}

/**
 * Fetch visitor traffic stats and recent logs directly from Supabase VisitorLogs.
 * Uses Malaysia (UTC+8) timezone to determine today's date boundary.
 */
export async function getVisitorStatsDirect() {
  try {
    const now = new Date();
    const nowMy = new Date(now.getTime() + (8 * 3600 * 1000));
    const todayStr = nowMy.toISOString().slice(0, 10);
    const todayStartUtc = new Date(new Date(todayStr + 'T00:00:00Z').getTime() - (8 * 3600 * 1000)).toISOString();

    const [totalRes, todayRes, recentRes, breakdownRes] = await Promise.all([
      supabase.from('VisitorLogs').select('*', { count: 'exact', head: true }),
      supabase.from('VisitorLogs').select('*', { count: 'exact', head: true }).gte('VisitedAt', todayStartUtc),
      supabase.from('VisitorLogs').select('*').order('VisitedAt', { ascending: false }).limit(20),
      supabase.from('VisitorLogs').select('VisitorId, Division').limit(10000)
    ]);

    const totalVisits = totalRes.count ?? 0;
    const todayVisits = todayRes.count ?? 0;

    let uniqueVisitors = 0;
    let divisionBreakdown = [];

    if (breakdownRes.data) {
      const uniqueIds = new Set(breakdownRes.data.map(l => l.VisitorId).filter(Boolean));
      uniqueVisitors = uniqueIds.size;

      const divCounts = {};
      for (const log of breakdownRes.data) {
        const d = (log.Division || '').trim();
        if (!d) continue;
        divCounts[d] = (divCounts[d] || 0) + 1;
      }
      divisionBreakdown = Object.entries(divCounts)
        .map(([division, count]) => ({ division, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
    }

    const recentVisits = (recentRes.data || []).map(v => ({
      id: v.Id ?? v.id,
      visitorId: v.VisitorId ?? v.visitorId ?? '',
      username: (v.Username ?? v.username ?? '').trim() || 'Anonymous Visitor',
      division: (v.Division ?? v.division ?? '').trim() || 'General',
      visitedAt: v.VisitedAt ?? v.visitedAt ?? new Date().toISOString()
    }));

    return {
      totalVisits,
      todayVisits,
      uniqueVisitors: uniqueVisitors || totalVisits,
      divisionBreakdown,
      recentVisits
    };
  } catch (err) {
    console.warn("getVisitorStatsDirect error:", err);
    return {
      totalVisits: 0,
      todayVisits: 0,
      uniqueVisitors: 0,
      divisionBreakdown: [],
      recentVisits: []
    };
  }
}

// In-memory mutex and short-term throttle to prevent concurrent double-mount race conditions
let activeRecordPromise = null;
let lastRecordedSession = { visitorId: '', username: '', timestamp: 0 };

/**
 * Record a platform visit directly into Supabase VisitorLogs.
 * Throttled to 1 visit per visitorId per 15 minutes unless updating an anonymous visit with user info.
 */
export async function recordVisitorDirect({ visitorId, username, division, path, userAgent, staffId } = {}) {
  if (!visitorId) return await getVisitorStatsDirect();

  // If a recording operation is currently in-flight, await it to prevent race conditions
  if (activeRecordPromise) {
    try {
      await activeRecordPromise;
    } catch {}
  }

  // De-duplicate if the exact same visitor was recorded within the last 60 seconds
  const now = Date.now();
  const cleanUsername = (username || '').trim();
  if (
    lastRecordedSession.visitorId === visitorId &&
    lastRecordedSession.username === cleanUsername &&
    (now - lastRecordedSession.timestamp) < 60000
  ) {
    return await getVisitorStatsDirect();
  }

  activeRecordPromise = (async () => {
    try {
      const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      let cleanDivision = (division || '').trim();
      if ((!cleanDivision || cleanDivision.toLowerCase() === 'general') && cleanUsername) {
        cleanDivision = 'IDD';
      }

      const { data: recent, error: selErr } = await supabase
        .from('VisitorLogs')
        .select('Id, Username, Division')
        .eq('VisitorId', visitorId)
        .gte('VisitedAt', cutoff)
        .order('VisitedAt', { ascending: false })
        .limit(1);

      if (selErr) {
        console.warn("Visitor check error:", selErr);
      }

      const hasRecent = recent && recent.length > 0;

      if (hasRecent) {
        const existing = recent[0];
        const needsUpdate = cleanUsername && (
          !existing.Username || 
          existing.Username === 'Anonymous Visitor' || 
          (cleanDivision && existing.Division !== cleanDivision)
        );

        if (needsUpdate) {
          await supabase
            .from('VisitorLogs')
            .update({
              Username: cleanUsername,
              Division: cleanDivision || existing.Division || 'IDD',
              staff_id: staffId || null
            })
            .eq('Id', existing.Id);
        }
      } else {
        await supabase
          .from('VisitorLogs')
          .insert([{
            VisitorId: visitorId,
            Username: cleanUsername,
            Division: cleanDivision || (cleanUsername ? 'IDD' : 'General'),
            Path: path || '/',
            UserAgent: userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
            VisitedAt: new Date().toISOString(),
            staff_id: staffId || null
          }]);
      }

      lastRecordedSession = {
        visitorId,
        username: cleanUsername,
        timestamp: Date.now()
      };
    } catch (err) {
      console.warn("recordVisitorDirect error:", err);
    } finally {
      activeRecordPromise = null;
    }

    return await getVisitorStatsDirect();
  })();

  return await activeRecordPromise;
}

