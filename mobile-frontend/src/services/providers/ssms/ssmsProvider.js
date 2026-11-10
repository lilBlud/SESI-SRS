import { API_BASE } from '../../apiConfig';

/**
 * Dedicated local SSMS driver communicating via mobile-backend ASP.NET Core API on port 5195.
 */

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`SSMS API Error [${res.status}] ${res.statusText}: ${errorBody}`);
  }
  return res.json();
}

export const ssmsProvider = {
  name: 'SSMS (Local SQL Server)',

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/health`, { method: 'GET', signal: AbortSignal.timeout(4000) });
      if (res.ok) return true;
    } catch {
      // Fallback if health endpoint is still reloading
    }

    try {
      const res = await fetch(`${API_BASE}/api/visitors/stats`, { method: 'GET', signal: AbortSignal.timeout(6000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // ─── Glossary & Posters ───
  async getInfographics() {
    const data = await request('/api/infographics');
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
    const data = await request('/api/glossary');
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
    const data = await request(`/api/quiz/${encodeURIComponent(month)}`);
    return (data || []).map(q => {
      const correctOpt = q.CorrectOption ?? q.correctOption ?? (q.CorrectIndex !== undefined ? ['A', 'B', 'C', 'D'][q.CorrectIndex] : 'A');
      const optMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      const correctIdx = q.CorrectIndex ?? q.correctIndex ?? optMap[String(correctOpt).toUpperCase()] ?? 0;
      const options = q.Options ?? q.options ?? [
        q.OptionA ?? q.optionA ?? '',
        q.OptionB ?? q.optionB ?? '',
        q.OptionC ?? q.optionC ?? '',
        q.OptionD ?? q.optionD ?? ''
      ];
      const questionText = q.Question ?? q.question ?? q.QuestionText ?? q.questionText ?? '';
      const id = q.Id ?? q.id;

      return {
        id,
        question: questionText,
        options,
        correctIndex: correctIdx
      };
    });
  },

  async getQuizSummary() {
    return await request('/api/quiz-summary');
  },

  async getLeaderboard(month) {
    const data = await request(`/api/leaderboard/${encodeURIComponent(month)}`);
    return (data || []).map((entry, idx) => ({
      key: entry.key || (entry.staffId ? `staff_${entry.staffId}` : (entry.username || `entry_${idx}`)),
      username: entry.username || entry.displayName || 'Anonymous',
      displayName: entry.displayName || entry.username || 'Anonymous',
      score: Number(entry.score || 0),
      division: entry.division || 'General',
      dateTaken: entry.dateTaken || '',
      streak: Number(entry.streak || 0),
      profilePicture: entry.profilePicture || null,
      staffId: entry.staffId ?? null
    }));
  },

  async submitQuizAnswer(payload) {
    return await request('/api/submit-answer', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getUserQuizStatus(month, username) {
    return await request(`/api/quiz-status/${encodeURIComponent(month)}/${encodeURIComponent(username)}`);
  },

  async getUserRecentAnswers(username, month) {
    const path = month
      ? `/api/profile/${encodeURIComponent(username)}/recent-answers?month=${encodeURIComponent(month)}`
      : `/api/profile/${encodeURIComponent(username)}/recent-answers`;
    const data = await request(path);
    return (data || []).map(a => ({
      id: a.id ?? a.Id,
      questionId: a.questionId ?? a.QuestionId ?? a.Question_Id ?? null,
      questionText: a.questionText ?? a.QuestionText ?? '',
      isCorrect: a.isCorrect ?? a.IsCorrect ?? false,
      pointsAwarded: Number(a.pointsAwarded ?? a.PointsAwarded ?? 0),
      timeTakenSeconds: Number(a.timeTakenSeconds ?? a.TimeTakenSeconds ?? 0),
      dateAnswered: a.dateAnswered ?? a.DateAnswered ?? new Date().toISOString(),
      selectedOption: a.selectedOption ?? a.SelectedOption ?? '',
      month: a.month ?? a.Month ?? ''
    }));
  },

  async getUserActiveMonths(username) {
    const data = await request(`/api/profile/${encodeURIComponent(username)}/active-months`);
    return Array.isArray(data) ? data.sort((a, b) => b.localeCompare(a)) : [];
  },

  // ─── Streaks & Activities ───
  async getUserStreak(username) {
    const json = await request(`/api/streak/${encodeURIComponent(username)}`);
    return { streak: Number(json.streak || 0), dates: json.dates || [] };
  },

  async recordUserActivity(username) {
    const json = await request('/api/streak/record', {
      method: 'POST',
      body: JSON.stringify({ username })
    });
    return { streak: Number(json.streak || 0), recorded: Boolean(json.recorded) };
  },

  // ─── User Profile & Admin ───
  async getAllUsers() {
    return await request('/api/admin/users');
  },

  async getUserProfile(username) {
    return await request(`/api/user/profile/${encodeURIComponent(username)}`);
  },

  async updateProfilePicture(username, profilePicture) {
    return await request('/api/user/profile-picture', {
      method: 'POST',
      body: JSON.stringify({ username, profilePicture })
    });
  },

  async updatePreferredName(username, preferredName) {
    return await request('/api/user/preferred-name', {
      method: 'POST',
      body: JSON.stringify({ username, preferredName })
    });
  },

  async updateUserRole(userId, newRole) {
    return await request(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole })
    });
  },

  async deleteUser(userId) {
    return await request(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    });
  },

  // ─── Auth ───
  async login(email, password) {
    return await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async signup(payload) {
    return await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // ─── Visitor Stats ───
  async getVisitorStats() {
    return await request(`/api/visitors/stats?t=${Date.now()}`);
  },

  async recordVisitor(payload) {
    return await request('/api/visitors/record', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

