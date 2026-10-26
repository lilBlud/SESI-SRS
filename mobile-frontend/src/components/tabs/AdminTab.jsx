import React, { useState, useEffect, useCallback } from 'react';
import { 
  getInfographicsDirect, 
  getGlossaryDirect, 
  getVisitorStatsDirect, 
  getAllUsersDirect, 
  updateUserRoleDirect, 
  supabase 
} from '../../utils/supabaseClient';
import AdminTrafficSection from './admin/AdminTrafficSection';
import AdminUsersSection from './admin/AdminUsersSection';
import AdminQuizSection from './admin/AdminQuizSection';
import AdminGlossarySection from './admin/AdminGlossarySection';
import AdminInfographicsSection from './admin/AdminInfographicsSection';

const API_BASE = import.meta.env.VITE_API_BASE || '';
const currentMonth = new Date().toISOString().slice(0, 7);
const defaultMonth = currentMonth < '2026-01' ? '2026-01' : currentMonth;

export default function AdminTab({ currentUser, onClose, onGlossaryChange, visitorStats, onRefreshVisitorStats }) {
  const [activeSection, setActiveSection] = useState('traffic'); // 'traffic' | 'users' | 'questions' | 'glossary' | 'infographics'

  // ─── Domain States ───
  const [trafficData, setTrafficData] = useState(null);
  const [loadingTraffic, setLoadingTraffic] = useState(false);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [qCount, setQCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [infographics, setInfographics] = useState([]);

  // ─── Fetch Handlers ───
  const fetchTraffic = useCallback(async () => {
    setLoadingTraffic(true);
    try {
      let data = null;
      try {
        data = await getVisitorStatsDirect();
      } catch (e) {
        console.warn('Direct fetch traffic failed in AdminTab:', e);
      }

      if (!data) {
        try {
          const res = await fetch(`${API_BASE}/api/visitors/stats?t=${Date.now()}`);
          if (res.ok) {
            data = await res.json();
          }
        } catch (e) {
          console.error('Failed to fetch traffic stats fallback:', e);
        }
      }

      if (data) {
        setTrafficData(data);
        if (onRefreshVisitorStats) onRefreshVisitorStats();
      }
    } finally {
      setLoadingTraffic(false);
    }
  }, [onRefreshVisitorStats]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      let list = null;
      try {
        list = await getAllUsersDirect();
      } catch (err) {
        console.warn("Direct fetch users error in AdminTab:", err);
      }

      if (!list) {
        try {
          const res = await fetch(`${API_BASE}/api/admin/users`);
          if (res && res.ok) {
            list = await res.json();
          }
        } catch (apiErr) {
          console.warn("API fetch users error in AdminTab:", apiErr);
        }
      }

      if (list && Array.isArray(list)) {
        setUsers(list);
      }
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const handleUpdateRole = async (targetIdOrEmail, newRole) => {
    try {
      await updateUserRoleDirect(targetIdOrEmail, newRole);
      await fetchUsers();
    } catch (err) {
      // Fallback to API if available
      try {
        const targetId = typeof targetIdOrEmail === 'number'
          ? targetIdOrEmail
          : users.find(u => u.email === targetIdOrEmail)?.id;

        if (targetId) {
          const res = await fetch(`${API_BASE}/api/admin/users/${targetId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Failed to update user role');
          }
          await fetchUsers();
          return;
        }
      } catch (apiErr) {
        throw new Error(apiErr.message || err.message || 'Failed to update user role');
      }
      throw err;
    }
  };

  const fetchQuestions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('QuizQuestions')
        .select('*')
        .eq('Month', selectedMonth);
      if (!error && data) {
        const formatted = data.map(q => ({
          id: q.Id ?? q.id,
          month: q.Month ?? q.month,
          questionText: q.QuestionText ?? q.questionText,
          optionA: q.OptionA ?? q.optionA,
          optionB: q.OptionB ?? q.optionB,
          optionC: q.OptionC ?? q.optionC,
          optionD: q.OptionD ?? q.optionD,
          correctOption: q.CorrectOption ?? q.correctOption ?? 'A'
        }));
        setQuestions(formatted);
        setQCount(formatted.length);
        return;
      }
    } catch (sbErr) {
      console.warn('Direct fetch questions error in AdminTab:', sbErr);
    }

    const res = await fetch(`${API_BASE}/api/admin/questions/${selectedMonth}`).catch(() => null);
    if (res && res.ok) {
      const d = await res.json();
      setQuestions(d.questions || []);
      setQCount(d.count || 0);
    }
  }, [selectedMonth]);

  const fetchGlossary = useCallback(async () => {
    try {
      const direct = await getGlossaryDirect();
      if (direct && direct.length >= 0) {
        setGlossaryTerms(direct);
        return;
      }
    } catch (e) {
      console.warn('Direct fetch glossary failed in AdminTab:', e);
    }
    const res = await fetch(`${API_BASE}/api/admin/glossary?t=${Date.now()}`).catch(() => null);
    if (res && res.ok) {
      setGlossaryTerms(await res.json());
    }
  }, []);

  const fetchInfographics = useCallback(async () => {
    try {
      const direct = await getInfographicsDirect();
      if (direct && direct.length >= 0) {
        setInfographics(direct);
        return;
      }
    } catch (err) {
      console.warn('Direct Supabase fetch failed in AdminTab:', err);
    }
    const res = await fetch(`${API_BASE}/api/admin/infographics`).catch(() => null);
    if (res && res.ok) {
      setInfographics(await res.json());
    }
  }, []);

  const loadAll = useCallback(() => {
    fetchUsers();
    fetchQuestions();
    fetchGlossary();
    fetchInfographics();
    fetchTraffic();
  }, [fetchUsers, fetchQuestions, fetchGlossary, fetchInfographics, fetchTraffic]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const sections = [
    { id: 'traffic', label: 'Visitors' },
    { id: 'users', label: 'Users', count: users.length },
    { id: 'questions', label: 'Quiz', count: qCount },
    { id: 'glossary', label: 'Dictionary', count: glossaryTerms.length },
    { id: 'infographics', label: 'Posts', count: infographics.length }
  ];

  return (
    <div className="space-y-4 animate-slideUp pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
            <span>🛡️</span> Admin Workspace
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">Control Panel</h1>
          {currentUser && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              Logged in as <span className="font-semibold text-slate-600 dark:text-slate-300">{currentUser.fullName || currentUser.email}</span> (Administrator)
            </p>
          )}
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1 active:scale-95"
          >
            <span>✕</span>
            <span>Exit</span>
          </button>
        )}
      </div>

      {/* Section Tabs */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        {sections.map(s => (
          <button 
            key={s.id} 
            onClick={() => {
              setActiveSection(s.id);
              if (s.id === 'traffic') fetchTraffic();
              if (s.id === 'users') fetchUsers();
            }} 
            className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center min-h-[46px] ${
              activeSection === s.id 
                ? 'bg-emerald-600 text-white shadow-md font-black' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
            }`}
          >
            <div className="text-[11px] sm:text-[12px] leading-tight truncate">{s.label}</div>
            {s.count !== undefined && (
              <div className={`text-[9px] sm:text-[10px] mt-0.5 ${activeSection === s.id ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'}`}>
                ({s.count})
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ════════ TRAFFIC & VISITORS ════════ */}
      {activeSection === 'traffic' && (
        <AdminTrafficSection
          trafficData={trafficData}
          visitorStats={visitorStats}
          loadingTraffic={loadingTraffic}
          onRefreshTraffic={fetchTraffic}
        />
      )}

      {/* ════════ USER ROLES & RBAC ════════ */}
      {activeSection === 'users' && (
        <AdminUsersSection
          users={users}
          currentUser={currentUser}
          loading={loadingUsers}
          onUpdateRole={handleUpdateRole}
          onRefreshUsers={fetchUsers}
        />
      )}

      {/* ════════ QUIZ QUESTIONS ════════ */}
      {activeSection === 'questions' && (
        <AdminQuizSection
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          questions={questions}
          qCount={qCount}
          onRefreshQuestions={fetchQuestions}
        />
      )}

      {/* ════════ DICTIONARY & PERFORMANCE STUDIO ════════ */}
      {activeSection === 'glossary' && (
        <AdminGlossarySection
          glossaryTerms={glossaryTerms}
          onRefreshGlossary={fetchGlossary}
          onGlossaryChange={onGlossaryChange}
        />
      )}

      {/* ════════ INFOGRAPHICS / POSTERS ════════ */}
      {activeSection === 'infographics' && (
        <AdminInfographicsSection
          infographics={infographics}
          onRefreshInfographics={fetchInfographics}
        />
      )}
    </div>
  );
}
