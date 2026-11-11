import { 
  resolveUserRole, 
  normalizeUser, 
  matchesUser, 
  buildStaffIndex, 
  isExcludedLeaderboardAccount,
  calculateStreakFromDates,
  extractUserTargets
} from '../../../utils/rbac';

export { calculateStreakFromDates, extractUserTargets };

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

    return (data || []).map(p => ({
      id: p.Id ?? p.id,
      title: p.Title ?? p.title ?? '',
      description: p.Description ?? p.description ?? '',
      imageUrl: p.ImageUrl ?? p.imageUrl ?? '',
      additionalImages: p.AdditionalImages ?? p.additionalImages ?? '',
      category: p.Category ?? p.category ?? 'General',
      postedAt: p.PostedAt ?? p.postedAt ?? new Date().toISOString()
    }));
  },

  async getGlossary() {
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
  },

  // ─── Quiz & Leaderboard ───
  async getQuizQuestions(month) {
    const { data, error } = await supabase
      .from('QuizQuestions')
      .select('*')
      .eq('Month', month);

    if (error) throw error;

    return (data || []).map(q => {
      const correctOpt = q.CorrectOption ?? q.correctOption ?? 'A';
      const optMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      const correctIdx = optMap[String(correctOpt).toUpperCase()] ?? 0;
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
  },

  async getQuizSummary() {
    const { data, error } = await supabase
      .from('QuizQuestions')
      .select('Id, Month');
    if (error) throw error;
    return (data || []).map(q => ({ id: q.Id, month: q.Month }));
  },

  async getLeaderboard(month) {
    const [ansRes, actRes, staffRes] = await Promise.all([
      supabase.from('UserAnswers').select('*').eq('Month', month),
      supabase.from('UserActivities').select('Username, ActivityDate, staff_id'),
      supabase.from('StaffUsers').select('Id, FullName, PreferredName, Email, StaffId, Division, ProfilePicture')
    ]);

    if (ansRes.error) throw ansRes.error;

    const raw = ansRes.data || [];
    const staffData = staffRes.data || [];
    const actData = actRes.data || [];

    const staffIndex = buildStaffIndex(staffData);
    const groups = {};

    for (const a of raw) {
      const u = (a.Username ?? a.username ?? '').trim();
      const p = (a.PreferredName ?? a.preferredName ?? '').trim();
      const sid = a.staff_id ?? a.Staff_Id;

      const staff = staffIndex.find(u, sid) || staffIndex.find(p);
      if (isExcludedLeaderboardAccount(u, p, staff, sid)) continue;

      const key = staff ? `staff_${staff.Id ?? staff.id}` : (u || p || 'Anonymous');
      const currentDisplayName = staff?.PreferredName?.trim() || staff?.preferredName?.trim() || p || staff?.FullName?.trim() || staff?.fullName?.trim() || u || 'Anonymous';
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
          staffId: staff?.Id ?? staff?.id ?? sid ?? null
        };
      }
      groups[key].score += Number(a.PointsAwarded ?? a.pointsAwarded ?? 0);
    }

    return Object.values(groups)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  },

  async submitQuizAnswer(payload) {
    const { data, error } = await supabase.from('UserAnswers').insert([{
      ...payload,
      DateAnswered: new Date().toISOString()
    }]);
    if (error) throw error;
    return data;
  },

  async getUserQuizStatus(month, username) {
    const { data, error } = await supabase
      .from('UserAnswers')
      .select('*')
      .eq('Month', month)
      .ilike('Username', username);
    if (error) throw error;
    return data || [];
  },

  async getUserRecentAnswers(username, month) {
    let q = supabase
      .from('UserAnswers')
      .select('*')
      .ilike('Username', username)
      .order('DateAnswered', { ascending: false });
    if (month) q = q.eq('Month', month);
    const { data, error } = await q.limit(50);
    if (error) throw error;
    return (data || []).map(a => ({
      id: a.Id ?? a.id,
      questionId: a.QuestionId ?? a.questionId ?? a.Question_Id ?? null,
      questionText: a.QuestionText ?? a.questionText ?? '',
      isCorrect: a.IsCorrect ?? a.isCorrect ?? false,
      pointsAwarded: Number(a.PointsAwarded ?? a.pointsAwarded ?? 0),
      timeTakenSeconds: Number(a.TimeTakenSeconds ?? a.timeTakenSeconds ?? 0),
      dateAnswered: a.DateAnswered ?? a.dateAnswered ?? new Date().toISOString(),
      selectedOption: a.SelectedOption ?? a.selectedOption ?? '',
      month: a.Month ?? a.month ?? ''
    }));
  },

  async getUserActiveMonths(username) {
    const { data, error } = await supabase
      .from('UserAnswers')
      .select('Month')
      .ilike('Username', username)
      .limit(500);
    if (error) throw error;
    const months = new Set((data || []).map(d => d.Month).filter(Boolean));
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  },

  // ─── Streaks & Activities ───
  async getUserStreak(userOrUsername) {
    const targets = extractUserTargets(userOrUsername);
    if (targets.length === 0) return { streak: 0, dates: [] };

    const { data, error } = await supabase
      .from('UserActivities')
      .select('Username, ActivityDate, staff_id')
      .order('ActivityDate', { ascending: false })
      .limit(500);

    if (error || !data) return { streak: 0, dates: [] };

    const matched = data.filter(a => {
      const u = String(a.Username ?? a.username ?? '').trim().toLowerCase();
      const sid = a.staff_id != null ? String(a.staff_id) : '';
      return targets.includes(u) || (sid && targets.includes(sid));
    });

    const dates = matched.map(m => m.ActivityDate ?? m.activityDate);
    const streak = calculateStreakFromDates(dates);
    return { streak, dates };
  },

  async recordUserActivity(userOrUsername) {
    const primaryName = typeof userOrUsername === 'object'
      ? (userOrUsername?.fullName || userOrUsername?.preferredName || userOrUsername?.username || 'User')
      : String(userOrUsername || 'User');

    const now = new Date();
    const nowMy = new Date(now.getTime() + (8 * 3600 * 1000));
    const todayDateOnly = nowMy.toISOString().slice(0, 10);
    const todayTimestamp = todayDateOnly + 'T00:00:00+00:00';

    const { data: existing } = await supabase
      .from('UserActivities')
      .select('Id, Username, ActivityDate')
      .gte('ActivityDate', todayDateOnly + 'T00:00:00')
      .lte('ActivityDate', todayDateOnly + 'T23:59:59');

    const alreadyDone = (existing || []).some(a => {
      const u = String(a.Username || '').trim().toLowerCase();
      return u === primaryName.trim().toLowerCase();
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

    const { streak } = await this.getUserStreak(userOrUsername);
    return { streak, recorded: newlyRecorded };
  },

  // ─── User Profile & Admin ───
  async getAllUsers() {
    const { data, error } = await supabase
      .from('StaffUsers')
      .select('Id, FullName, PreferredName, Email, Division, StaffId, ProfilePicture, CreatedAt')
      .order('FullName', { ascending: true });
    if (error) throw error;
    return (data || []).map(u => normalizeUser(u, resolveUserRole(u)));
  },

  async getUserProfile(usernameOrEmail) {
    const target = String(usernameOrEmail || '').trim().toLowerCase();
    const { data, error } = await supabase
      .from('StaffUsers')
      .select('*');
    if (error || !data) return null;
    const match = data.find(u => matchesUser(u, target));
    return match ? normalizeUser(match, resolveUserRole(match)) : null;
  },

  async updateProfilePicture(usernameOrEmail, profilePicture) {
    const target = String(usernameOrEmail || '').trim().toLowerCase();
    const { data, error } = await supabase
      .from('StaffUsers')
      .select('Id, Email, FullName');
    if (error) throw error;
    const match = (data || []).find(u => 
      (u.Email && u.Email.toLowerCase() === target) ||
      (u.FullName && u.FullName.toLowerCase() === target)
    );
    if (!match) throw new Error("User not found");
    const { error: upErr } = await supabase
      .from('StaffUsers')
      .update({ ProfilePicture: profilePicture || '' })
      .eq('Id', match.Id ?? match.id);
    if (upErr) throw upErr;
    return { success: true, profilePicture };
  },

  async updatePreferredName(usernameOrEmail, preferredName) {
    const target = String(usernameOrEmail || '').trim().toLowerCase();
    const trimmed = (preferredName || '').trim().slice(0, 10);
    const { data, error } = await supabase.from('StaffUsers').select('Id, Email, FullName');
    if (error) throw error;
    const match = (data || []).find(u => 
      (u.Email && u.Email.toLowerCase() === target) ||
      (u.FullName && u.FullName.toLowerCase() === target)
    );
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
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ─── Auth ───
  async login(email, password) {
    const targetEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('StaffUsers')
      .select('*')
      .eq('Email', targetEmail)
      .single();

    if (error || !data || data.PasswordHash !== password) {
      throw new Error("Invalid email or password");
    }

    return normalizeUser(data, data.Role || 'Staff');
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
      Role: 'Staff',
      CreatedAt: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('StaffUsers')
      .insert([newUser])
      .select()
      .single();

    if (error) throw error;
    return normalizeUser(data, 'Staff');
  },

  // ─── Visitor Stats ───
  async getVisitorStats() {
    const [totalRes, recentRes, breakdownRes] = await Promise.all([
      supabase.from('VisitorLogs').select('*', { count: 'exact', head: true }),
      supabase.from('VisitorLogs').select('*').order('VisitedAt', { ascending: false }).limit(20),
      supabase.from('VisitorLogs').select('VisitorId, Division').limit(5000)
    ]);

    const totalVisits = totalRes.count ?? 0;
    const uniqueVisitors = new Set((breakdownRes.data || []).map(l => l.VisitorId).filter(Boolean)).size;

    return {
      totalVisits,
      todayVisits: totalVisits,
      uniqueVisitors: uniqueVisitors || totalVisits,
      divisionBreakdown: [],
      recentVisits: (recentRes.data || []).map(v => ({
        id: v.Id ?? v.id,
        visitorId: v.VisitorId ?? '',
        username: v.Username || 'Anonymous Visitor',
        division: v.Division || 'General',
        visitedAt: v.VisitedAt || new Date().toISOString()
      }))
    };
  },

  async recordVisitor(payload) {
    await supabase.from('VisitorLogs').insert([{
      VisitorId: payload.visitorId,
      Username: payload.username || '',
      Division: payload.division || '',
      Path: payload.path || '/',
      VisitedAt: new Date().toISOString()
    }]);
    return await this.getVisitorStats();
  }
};

