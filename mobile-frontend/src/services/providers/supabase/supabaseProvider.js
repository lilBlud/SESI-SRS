import { supabase } from '../../../services/apiConfig';
import {
  extractUserTargets,
  resolveUserRole,
  normalizeUser,
  isExcludedLeaderboardAccount,
  buildStaffIndex,
  calculateStreakFromDates,
} from '../../../utils/rbac';
import {
  mapGlossaryTermDto,
  mapInfographicDto,
  mapQuizQuestionDto,
  mapUserAnswerDto,
} from '../dtoMappers';

const SAFE_STAFF_COLUMNS =
  'Id, FullName, PreferredName, Email, Division, StaffId, ProfilePicture, CreatedAt';

function buildSafeUserFilterClauses(targets) {
  const clauses = [];
  for (const t of targets) {
    if (/^\d+$/.test(t)) {
      clauses.push(`staff_id.eq.${t}`);
    } else {
      const safe = t.replace(/[,()"\\]/g, '').trim();
      if (safe) {
        clauses.push(`Username.ilike.${safe}`, `PreferredName.ilike.${safe}`);
      }
    }
  }
  return clauses.join(',');
}

function buildActivityFilterClauses(targets) {
  const clauses = [];
  for (const t of targets) {
    if (/^\d+$/.test(t)) {
      clauses.push(`staff_id.eq.${t}`);
    } else {
      const safe = t.replace(/[,()"\\]/g, '').trim();
      if (safe) {
        clauses.push(`Username.ilike.${safe}`);
      }
    }
  }
  return clauses.join(',');
}

function isDeletedStaffRow(u) {
  const div = String(u?.Division ?? u?.division ?? '').trim().toUpperCase();
  const email = String(u?.Email ?? u?.email ?? '').trim().toLowerCase();
  const full = String(u?.FullName ?? u?.fullName ?? '').trim().toLowerCase();
  return div === 'DELETED' || email.startsWith('deleted_') || full.startsWith('[deleted user]');
}

async function findStaffByTarget(target) {
  const safe = String(target || '').replace(/[,()"\\]/g, '').trim();
  if (!safe) return null;
  const { data, error } = await supabase
    .from('StaffUsers')
    .select(SAFE_STAFF_COLUMNS)
    .or(`Email.ilike.${safe},FullName.ilike.${safe},StaffId.ilike.${safe},PreferredName.ilike.${safe}`)
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data;
}

export { calculateStreakFromDates };

export const supabaseProvider = {
  name: 'Supabase Cloud (Production)',

  async checkHealth() {
    try {
      const { error } = await supabase.from('GlossaryTerms').select('Id').limit(1);
      return !error;
    } catch {
      return false;
    }
  },

  // ─── Glossary & Posters ───
  async getInfographics() {
    const { data, error } = await supabase
      .from('Infographics')
      .select('*')
      .order('PostedAt', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapInfographicDto);
  },

  async saveInfographic(payload, editId = null) {
    const row = {
      Title: payload.title,
      Description: payload.description || '',
      ImageUrl: payload.imageUrl || '',
      AdditionalImages: payload.additionalImages || '',
      Category: payload.category || 'General',
      PostedAt: payload.postedAt || new Date().toISOString(),
    };
    const q = editId
      ? supabase.from('Infographics').update(row).eq('Id', editId)
      : supabase.from('Infographics').insert([row]);
    const { error } = await q;
    if (error) throw error;
    return { success: true };
  },

  async deleteInfographic(id) {
    const { error } = await supabase.from('Infographics').delete().eq('Id', id);
    if (error) throw error;
    return { success: true };
  },

  async getGlossary() {
    const { data, error } = await supabase
      .from('GlossaryTerms')
      .select('*')
      .order('Term', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapGlossaryTermDto);
  },

  async saveGlossaryTerm(payload, editId = null) {
    const row = {
      Term: payload.term,
      FullName: payload.fullName || '',
      Description: payload.description || '',
      Formula: payload.formula || '',
      FormulaNotations: payload.formulaNotations || '',
      FormulaTermMeanings: payload.formulaTermMeanings || '',
      Category: payload.category || 'General',
      ChartData: payload.chartData || '',
      ...(editId ? {} : { CreatedAt: new Date().toISOString() }),
    };
    const q = editId
      ? supabase.from('GlossaryTerms').update(row).eq('Id', editId)
      : supabase.from('GlossaryTerms').insert([row]);
    const { error } = await q;
    if (error) throw error;
    return { success: true };
  },

  async deleteGlossaryTerm(id) {
    const { error } = await supabase.from('GlossaryTerms').delete().eq('Id', id);
    if (error) throw error;
    return { success: true };
  },

  // ─── Quiz & Leaderboard ───
  async getQuizQuestions(month) {
    const { data, error } = await supabase
      .from('QuizQuestions')
      .select('*')
      .eq('Month', month);

    if (error) throw error;
    return (data || []).map(mapQuizQuestionDto);
  },

  async getAdminQuizQuestions(month, resolveLatest = false) {
    let resolvedMonth = month;
    let { data, error } = await supabase
      .from('QuizQuestions')
      .select('*')
      .eq('Month', resolvedMonth);
    if (error) throw error;

    if ((!data || data.length === 0) && resolveLatest) {
      const { data: latest } = await supabase
        .from('QuizQuestions')
        .select('Month')
        .order('Month', { ascending: false })
        .limit(1);
      const latestMonth = latest?.[0]?.Month ?? latest?.[0]?.month;
      if (latestMonth && latestMonth !== resolvedMonth) {
        resolvedMonth = latestMonth;
        const { data: fallbackData, error: fallbackErr } = await supabase
          .from('QuizQuestions')
          .select('*')
          .eq('Month', latestMonth);
        if (!fallbackErr && fallbackData) data = fallbackData;
      }
    }

    const formatted = (data || []).map(mapQuizQuestionDto);
    return { month: resolvedMonth, questions: formatted, count: formatted.length };
  },

  async addQuizQuestion(payload) {
    const { error } = await supabase.from('QuizQuestions').insert([
      {
        Month: payload.month,
        QuestionText: payload.questionText,
        OptionA: payload.optionA,
        OptionB: payload.optionB,
        OptionC: payload.optionC,
        OptionD: payload.optionD,
        CorrectOption: payload.correctOption,
      },
    ]);
    if (error) throw error;
    return { success: true };
  },

  async updateQuizQuestion(id, payload) {
    const { error } = await supabase
      .from('QuizQuestions')
      .update({
        Month: payload.month,
        QuestionText: payload.questionText,
        OptionA: payload.optionA,
        OptionB: payload.optionB,
        OptionC: payload.optionC,
        OptionD: payload.optionD,
        CorrectOption: payload.correctOption,
      })
      .eq('Id', id);
    if (error) throw error;
    return { success: true };
  },

  async deleteQuizQuestion(id) {
    const { error } = await supabase.from('QuizQuestions').delete().eq('Id', id);
    if (error) throw error;
    return { success: true };
  },

  async getQuizSummary() {
    const { data, error } = await supabase
      .from('QuizQuestions')
      .select('Id, Month');
    if (error) throw error;
    return (data || []).map(q => ({ id: q.Id, month: q.Month }));
  },

  async getLeaderboard(month) {
    const [ansRes, staffRes] = await Promise.all([
      supabase.from('UserAnswers').select('*').eq('Month', month),
      supabase.from('StaffUsers').select('Id, FullName, PreferredName, Email, StaffId, Division, ProfilePicture'),
    ]);

    if (ansRes.error) throw ansRes.error;

    const raw = ansRes.data || [];
    const staffData = staffRes.data || [];

    const staffIndex = buildStaffIndex(staffData);
    const groups = {};

    for (const a of raw) {
      const u = (a.Username ?? a.username ?? '').trim();
      const p = (a.PreferredName ?? a.preferredName ?? '').trim();
      const sid = a.staff_id ?? a.Staff_Id;

      const staff = staffIndex.find(u, sid) || staffIndex.find(p);
      if (isExcludedLeaderboardAccount(u, p, staff, sid)) continue;

      const key = staff ? `staff_${staff.Id ?? staff.id}` : (u || p || 'Anonymous');
      const currentDisplayName =
        staff?.PreferredName?.trim() ||
        staff?.preferredName?.trim() ||
        p ||
        staff?.FullName?.trim() ||
        staff?.fullName?.trim() ||
        u ||
        'Anonymous';
      const realFullName = staff?.FullName?.trim() || staff?.fullName?.trim() || u || currentDisplayName;

      if (!groups[key]) {
        groups[key] = {
          key,
          username: realFullName,
          displayName: currentDisplayName,
          score: 0,
          division: staff?.Division?.trim() || (a.Division ?? a.division ?? 'General'),
          dateTaken: a.DateAnswered ?? a.dateAnswered ?? '',
          streak: 0,
          profilePicture: staff?.ProfilePicture || null,
          staffId: staff?.Id ?? staff?.id ?? sid ?? null,
        };
      }
      groups[key].score += Number(a.PointsAwarded ?? a.pointsAwarded ?? 0);
    }

    return Object.values(groups)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  },

  async submitQuizAnswer(payload) {
    const { data, error } = await supabase.from('UserAnswers').insert([
      {
        ...payload,
        DateAnswered: new Date().toISOString(),
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getUserQuizStatus(month, usernameOrTargets) {
    const targets = extractUserTargets(usernameOrTargets);
    if (!targets.length) return [];

    let q = supabase.from('UserAnswers').select('*').eq('Month', month);
    const clauses = buildSafeUserFilterClauses(targets);
    if (clauses) q = q.or(clauses);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },

  async getUserRecentAnswers(userOrTarget, month) {
    const targets = extractUserTargets(userOrTarget);
    if (!targets.length) return [];

    let q = supabase
      .from('UserAnswers')
      .select('*')
      .order('DateAnswered', { ascending: false });

    const clauses = buildSafeUserFilterClauses(targets);
    if (clauses) q = q.or(clauses);
    if (month) q = q.eq('Month', month);

    const { data, error } = await q.limit(200);
    if (error) throw error;
    return (data || []).map(mapUserAnswerDto);
  },

  async getUserActiveMonths(userOrTarget) {
    const targets = extractUserTargets(userOrTarget);
    if (!targets.length) return [];

    let q = supabase.from('UserAnswers').select('Month');
    const clauses = buildSafeUserFilterClauses(targets);
    if (clauses) q = q.or(clauses);

    const { data, error } = await q.limit(500);
    if (error) throw error;
    const months = new Set((data || []).map(d => d.Month).filter(Boolean));
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  },

  // ─── Streaks & Activities ───
  async getUserStreak(userOrUsername) {
    const targets = extractUserTargets(userOrUsername);
    if (targets.length === 0) return { streak: 0, dates: [] };

    let query = supabase
      .from('UserActivities')
      .select('Username, ActivityDate, staff_id')
      .order('ActivityDate', { ascending: false });

    const clauses = buildActivityFilterClauses(targets);
    if (clauses) {
      query = query.or(clauses);
    }

    const { data, error } = await query.limit(500);
    if (error || !data) return { streak: 0, dates: [] };

    const matched = data.filter(a => {
      const u = String(a.Username ?? a.username ?? '').trim().toLowerCase();
      const sid = a.staff_id != null ? String(a.staff_id).trim() : '';
      return targets.includes(u) || (sid && targets.includes(sid));
    });

    const dates = matched.map(m => m.ActivityDate ?? m.activityDate);
    const streak = calculateStreakFromDates(dates);
    return { streak, dates };
  },

  async recordUserActivity(userOrUsername) {
    const primaryName =
      typeof userOrUsername === 'object'
        ? (userOrUsername?.fullName || userOrUsername?.preferredName || userOrUsername?.username || 'User')
        : String(userOrUsername || 'User');

    const now = new Date();
    const nowMy = new Date(now.getTime() + 8 * 3600 * 1000);
    const todayDateOnly = nowMy.toISOString().slice(0, 10);
    const todayTimestamp = todayDateOnly + 'T00:00:00+00:00';

    const { data: existing } = await supabase
      .from('UserActivities')
      .select('Id, Username, ActivityDate, staff_id')
      .gte('ActivityDate', todayDateOnly + 'T00:00:00')
      .lte('ActivityDate', todayDateOnly + 'T23:59:59');

    const targets = extractUserTargets(userOrUsername);
    const alreadyDone = (existing || []).some(a => {
      const u = String(a.Username || '').trim().toLowerCase();
      const sid = a.staff_id != null ? String(a.staff_id).trim() : '';
      return targets.includes(u) || (sid && targets.includes(sid));
    });

    let newlyRecorded = false;
    if (!alreadyDone) {
      const staffId = typeof userOrUsername === 'object' && userOrUsername?.id ? userOrUsername.id : null;
      const { error: insErr } = await supabase
        .from('UserActivities')
        .insert([{ Username: primaryName, ActivityDate: todayTimestamp, staff_id: staffId }]);
      if (!insErr) newlyRecorded = true;
    }

    const { streak } = await this.getUserStreak(userOrUsername);
    return { streak, recorded: newlyRecorded };
  },

  // ─── User Profile & Admin ───
  async getAllUsers() {
    const { data, error } = await supabase
      .from('StaffUsers')
      .select(SAFE_STAFF_COLUMNS)
      .order('FullName', { ascending: true });
    if (error) throw error;
    return (data || [])
      .filter(u => !isDeletedStaffRow(u))
      .map(u => normalizeUser(u, resolveUserRole(u)));
  },

  async getUserProfile(usernameOrEmail) {
    const match = await findStaffByTarget(usernameOrEmail);
    return match ? normalizeUser(match, resolveUserRole(match)) : null;
  },

  async updateProfilePicture(usernameOrEmail, profilePicture) {
    const match = await findStaffByTarget(usernameOrEmail);
    if (!match) throw new Error('User not found');
    const { error: upErr } = await supabase
      .from('StaffUsers')
      .update({ ProfilePicture: profilePicture || '' })
      .eq('Id', match.Id ?? match.id);
    if (upErr) throw upErr;
    return { success: true, profilePicture };
  },

  async updatePreferredName(usernameOrEmail, preferredName) {
    const trimmed = (preferredName || '').trim().slice(0, 10);
    const match = await findStaffByTarget(usernameOrEmail);
    if (match) {
      await supabase.from('StaffUsers').update({ PreferredName: trimmed }).eq('Id', match.Id ?? match.id);
    }
    return { success: true, preferredName: trimmed };
  },

  async updateUserRole(userId, newRole) {
    const { data, error } = await supabase
      .from('StaffUsers')
      .update({ Role: newRole })
      .eq('Id', userId)
      .select(SAFE_STAFF_COLUMNS)
      .single();
    if (error) {
      if (error.code === '42703' || String(error.message || '').includes('Role')) {
        throw new Error('Cannot update role: Supabase StaffUsers table does not have a Role column yet.');
      }
      throw error;
    }
    return normalizeUser(data, newRole || resolveUserRole(data));
  },

  async deleteUser(userId) {
    const { error } = await supabase
      .from('StaffUsers')
      .update({
        FullName: '[deleted user]',
        PreferredName: null,
        Email: `deleted_${userId}@deleted.local`,
        Division: 'DELETED',
      })
      .eq('Id', userId);
    if (error) throw error;
    return { success: true };
  },

  // ─── Auth ───
  async login(identifier, password) {
    const clean = String(identifier || '').trim();
    const safe = clean.replace(/[,()"\\]/g, '');
    if (!safe) {
      throw new Error('Invalid Staff ID/Email or password');
    }

    const { data, error } = await supabase
      .from('StaffUsers')
      .select(`${SAFE_STAFF_COLUMNS}, PasswordHash`)
      .or(`Email.ilike.${safe},StaffId.ilike.${safe},PreferredName.ilike.${safe}`)
      .limit(1)
      .maybeSingle();

    if (error || !data || data.PasswordHash === '__AD_AUTH__' || data.PasswordHash !== password) {
      throw new Error('Invalid Staff ID/Email or password');
    }

    const { PasswordHash: _discarded, ...safeRow } = data;
    return normalizeUser(safeRow, resolveUserRole(safeRow));
  },

  async signup(payload) {
    const targetEmail = payload.email.trim().toLowerCase();
    const prefName = (payload.preferredName || '').trim().slice(0, 10);
    const newUser = {
      FullName: payload.fullName || '',
      PreferredName: prefName,
      Email: targetEmail,
      PasswordHash: payload.password,
      Division: payload.division || '',
      StaffId: payload.staffId || '',
      ProfilePicture: '',
      CreatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('StaffUsers')
      .insert([newUser])
      .select(SAFE_STAFF_COLUMNS)
      .single();

    if (error) throw error;
    return normalizeUser(data, 'Staff');
  },

  // ─── Visitor Stats ───
  async getVisitorStats() {
    const [logsRes, staffRes] = await Promise.all([
      supabase.from('VisitorLogs').select('Id, VisitorId, Username, Division, VisitedAt').order('VisitedAt', { ascending: false }).limit(5000),
      supabase.from('StaffUsers').select('Id'),
    ]);

    const excludedUsers = new Set([
      '',
      'anonymous visitor',
      'demo user',
      'test user',
      'test_admin_user',
      'test_role_probe',
      'cameron',
    ]);

    const validLogs = (logsRes.data || []).filter(v => {
      const uname = (v.Username || '').trim().toLowerCase();
      const vid = (v.VisitorId || '').trim();
      return !excludedUsers.has(uname) && !vid.startsWith('v_seed_');
    });

    const mytOffsetMs = 8 * 60 * 60 * 1000;
    const todayStartMs = Math.floor((Date.now() + mytOffsetMs) / 86400000) * 86400000 - mytOffsetMs;

    const totalVisits = validLogs.length;
    const todayVisitorsSet = new Set();
    const divCounts = {};

    for (const v of validLogs) {
      const uname = (v.Username || '').trim();
      const visitedMs = v.VisitedAt ? new Date(v.VisitedAt).getTime() : 0;
      if (visitedMs >= todayStartMs && uname) {
        todayVisitorsSet.add(uname.toLowerCase());
      }
      const div = (v.Division || '').trim();
      if (div && div !== 'General' && div.toUpperCase() !== 'IDD') {
        divCounts[div] = (divCounts[div] || 0) + 1;
      }
    }

    const staffCount = (staffRes.data || []).length;
    const distinctLoggedStaff = new Set(validLogs.map(l => (l.Username || '').trim().toLowerCase()).filter(Boolean)).size;
    const uniqueVisitors = staffCount || distinctLoggedStaff;

    const divisionBreakdown = Object.entries(divCounts)
      .map(([division, count]) => ({ division, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      totalVisits,
      todayVisits: todayVisitorsSet.size,
      uniqueVisitors,
      divisionBreakdown,
      recentVisits: validLogs.slice(0, 25).map(v => ({
        id: v.Id ?? v.id,
        visitorId: v.VisitorId ?? '',
        username: v.Username,
        division: v.Division || 'General',
        visitedAt: v.VisitedAt || new Date().toISOString(),
      })),
    };
  },

  async recordVisitor(payload) {
    const cleanUsername = (payload?.username || '').trim();
    const lowerName = cleanUsername.toLowerCase();
    if (
      cleanUsername &&
      lowerName !== 'anonymous visitor' &&
      lowerName !== 'demo user'
    ) {
      const fifteenMinAgoIso = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: recent } = await supabase
        .from('VisitorLogs')
        .select('Id')
        .eq('Username', cleanUsername)
        .gte('VisitedAt', fifteenMinAgoIso)
        .limit(1);

      if (!recent || recent.length === 0) {
        await supabase.from('VisitorLogs').insert([
          {
            VisitorId: payload.visitorId,
            Username: cleanUsername,
            Division: payload.division || '',
            Path: payload.path || '/',
            VisitedAt: new Date().toISOString(),
          },
        ]);
      }
    }
    return await this.getVisitorStats();
  },
};
