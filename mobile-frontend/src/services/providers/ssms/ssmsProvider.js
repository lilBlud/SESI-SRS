import { API_BASE, getAuthHeaders } from '../../apiConfig';
import {
  mapGlossaryTermDto,
  mapInfographicDto,
  mapLeaderboardEntryDto,
  mapQuizQuestionDto,
  mapUserAnswerDto,
} from '../dtoMappers';

/**
 * Dedicated local SSMS driver communicating via mobile-backend ASP.NET Core API on port 5195.
 */

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`SSMS API Error [${res.status}] ${res.statusText}: ${errorBody}`);
  }
  return res.json();
}

function resolveUsername(userOrUsername) {
  if (Array.isArray(userOrUsername)) {
    const firstNonNumeric = userOrUsername.find(t => t && !/^\d+$/.test(String(t).trim()));
    return String(firstNonNumeric || userOrUsername[0] || '').trim();
  }
  if (typeof userOrUsername === 'object' && userOrUsername !== null) {
    return userOrUsername.fullName || userOrUsername.preferredName || userOrUsername.username || userOrUsername.email || '';
  }
  return String(userOrUsername || '').trim();
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
    return (data || []).map(mapInfographicDto);
  },

  async saveInfographic(payload, editId = null) {
    const path = editId ? `/api/admin/infographics/${editId}` : '/api/admin/infographics';
    return await request(path, {
      method: editId ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteInfographic(id) {
    return await request(`/api/admin/infographics/${id}`, { method: 'DELETE' });
  },

  async getGlossary() {
    const data = await request('/api/glossary');
    return (data || []).map(mapGlossaryTermDto);
  },

  async saveGlossaryTerm(payload, editId = null) {
    const path = editId ? `/api/admin/glossary/${editId}` : '/api/admin/glossary';
    return await request(path, {
      method: editId ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteGlossaryTerm(id) {
    return await request(`/api/admin/glossary/${id}`, { method: 'DELETE' });
  },

  // ─── Quiz & Leaderboard ───
  async getQuizQuestions(month) {
    const data = await request(`/api/quiz/${encodeURIComponent(month)}`);
    return (data || []).map(mapQuizQuestionDto);
  },

  async getAdminQuizQuestions(month) {
    const d = await request(`/api/admin/questions/${encodeURIComponent(month)}`);
    const mapped = (d.questions || []).map(mapQuizQuestionDto);
    return { month, questions: mapped, count: d.count ?? mapped.length };
  },

  async addQuizQuestion(payload) {
    return await request('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteQuizQuestion(id) {
    return await request(`/api/admin/questions/${id}`, { method: 'DELETE' });
  },

  async getQuizSummary() {
    return await request('/api/quiz-summary');
  },

  async getLeaderboard(month) {
    const data = await request(`/api/leaderboard/${encodeURIComponent(month)}`);
    return (data || []).map(mapLeaderboardEntryDto);
  },

  async submitQuizAnswer(payload) {
    return await request('/api/submit-answer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getUserQuizStatus(month, userOrUsername) {
    const username = resolveUsername(userOrUsername);
    return await request(`/api/quiz-status/${encodeURIComponent(month)}/${encodeURIComponent(username)}`);
  },

  async getUserRecentAnswers(userOrUsername, month) {
    const username = resolveUsername(userOrUsername);
    const path = month
      ? `/api/profile/${encodeURIComponent(username)}/recent-answers?month=${encodeURIComponent(month)}`
      : `/api/profile/${encodeURIComponent(username)}/recent-answers`;
    const data = await request(path);
    return (data || []).map(mapUserAnswerDto);
  },

  async getUserActiveMonths(userOrUsername) {
    const username = resolveUsername(userOrUsername);
    const data = await request(`/api/profile/${encodeURIComponent(username)}/active-months`);
    return Array.isArray(data) ? data.sort((a, b) => b.localeCompare(a)) : [];
  },

  // ─── Streaks & Activities ───
  async getUserStreak(userOrUsername) {
    const username = resolveUsername(userOrUsername);
    const json = await request(`/api/streak/${encodeURIComponent(username)}`);
    return { streak: Number(json.streak || 0), dates: json.dates || [] };
  },

  async recordUserActivity(userOrUsername) {
    const username = resolveUsername(userOrUsername);
    const json = await request('/api/streak/record', {
      method: 'POST',
      body: JSON.stringify({ username }),
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
      body: JSON.stringify({ username, profilePicture }),
    });
  },

  async updatePreferredName(username, preferredName) {
    return await request('/api/user/preferred-name', {
      method: 'POST',
      body: JSON.stringify({ username, preferredName }),
    });
  },

  async updateUserRole(userId, newRole) {
    return await request(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
    });
  },

  async deleteUser(userId) {
    return await request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // ─── Auth ───
  async login(email, password) {
    return await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(payload) {
    return await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ─── Visitor Stats ───
  async getVisitorStats() {
    return await request(`/api/visitors/stats?t=${Date.now()}`);
  },

  async recordVisitor(payload) {
    return await request('/api/visitors/record', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
