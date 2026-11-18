import React, { useState, useEffect, useCallback, useRef } from 'react';
import { currentMonth } from '../../utils/constants';
import { getInfographics, getGlossary } from '../glossary/glossaryService';
import { getAdminQuizQuestions, getQuizSummary } from '../quiz/quizService';
import { getAllUsers, updateUserRole, deleteUser } from '../../services/userService';
import { getVisitorStats } from '../../services/visitorService';
import { matchesUser } from '../../utils/rbac';
import AdminTrafficSection from './components/AdminTrafficSection';
import AdminUsersSection from './components/AdminUsersSection';
import AdminQuizSection from './components/AdminQuizSection';
import AdminGlossarySection from './components/AdminGlossarySection';
import AdminInfographicsSection from './components/AdminInfographicsSection';

const defaultMonth = currentMonth < '2026-01' ? '2026-01' : currentMonth;

export default function AdminTab({ currentUser, onClose, onGlossaryChange, visitorStats, onRefreshVisitorStats }) {
  const [activeSection, setActiveSection] = useState('traffic');

  const [trafficData, setTrafficData] = useState(null);
  const [loadingTraffic, setLoadingTraffic] = useState(false);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [qCount, setQCount] = useState(0);
  const [quizMonthCounts, setQuizMonthCounts] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const hasAutoResolvedMonth = useRef(false);

  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [infographics, setInfographics] = useState([]);

  const fetchTraffic = useCallback(async () => {
    setLoadingTraffic(true);
    try {
      const data = await getVisitorStats();
      if (data) {
        setTrafficData(data);
        if (onRefreshVisitorStats) onRefreshVisitorStats();
      }
    } catch (e) {
      console.warn('Failed to fetch traffic stats in AdminTab:', e);
    } finally {
      setLoadingTraffic(false);
    }
  }, [onRefreshVisitorStats]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const list = await getAllUsers();
      if (Array.isArray(list)) setUsers(list);
    } catch (err) {
      console.warn('Fetch users error in AdminTab:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const handleUpdateRole = async (targetIdOrEmail, newRole) => {
    setUsers(prev => prev.map(u =>
      matchesUser(u, targetIdOrEmail) ? { ...u, role: newRole } : u
    ));

    try {
      await updateUserRole(targetIdOrEmail, newRole);
      await fetchUsers();
    } catch (err) {
      await fetchUsers();
      throw err;
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    setUsers(prev => prev.filter(u => !matchesUser(u, userToDelete)));
    try {
      await deleteUser(userToDelete);
      await fetchUsers();
    } catch (err) {
      await fetchUsers();
      throw err;
    }
  };

  const fetchQuestions = useCallback(async () => {
    try {
      const shouldResolve = !hasAutoResolvedMonth.current;
      hasAutoResolvedMonth.current = true;
      const [result, summary] = await Promise.all([
        getAdminQuizQuestions(selectedMonth, shouldResolve),
        getQuizSummary().catch(() => [])
      ]);

      const counts = {};
      for (const row of (summary || [])) {
        const m = row.month || row.Month;
        if (m) counts[m] = (counts[m] || 0) + 1;
      }
      setQuizMonthCounts(counts);

      if (result.month && result.month !== selectedMonth) {
        setSelectedMonth(result.month);
      }
      setQuestions(result.questions || []);
      setQCount(result.count || 0);
    } catch (err) {
      console.warn('Fetch questions error in AdminTab:', err);
    }
  }, [selectedMonth]);

  const fetchGlossary = useCallback(async () => {
    try {
      const direct = await getGlossary();
      if (Array.isArray(direct)) setGlossaryTerms(direct);
    } catch (e) {
      console.warn('Fetch glossary failed in AdminTab:', e);
    }
  }, []);

  const fetchInfographics = useCallback(async () => {
    try {
      const direct = await getInfographics();
      if (Array.isArray(direct)) setInfographics(direct);
    } catch (err) {
      console.warn('Fetch infographics failed in AdminTab:', err);
    }
  }, []);

  // Lazy-load active domain data on tab switch
  useEffect(() => {
    if (activeSection === 'traffic') fetchTraffic();
    else if (activeSection === 'users') fetchUsers();
    else if (activeSection === 'questions') fetchQuestions();
    else if (activeSection === 'glossary') fetchGlossary();
    else if (activeSection === 'infographics') fetchInfographics();
  }, [activeSection, fetchTraffic, fetchUsers, fetchQuestions, fetchGlossary, fetchInfographics]);

  // Hydrate badge counts immediately in parallel on initial mount
  useEffect(() => {
    Promise.allSettled([
      fetchUsers(),
      fetchQuestions(),
      fetchGlossary(),
      fetchInfographics()
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <span className="text-xs lg:text-[13px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
            <span>🛡️</span> Admin Workspace
          </span>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1">Control Panel</h1>
          {currentUser && (
            <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Logged in as <span className="font-semibold text-slate-600 dark:text-slate-300">{currentUser.fullName || currentUser.email}</span> (Administrator)
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs lg:text-sm font-bold transition flex items-center gap-1.5 active:scale-95 shadow-xs shrink-0"
            aria-label="Exit Admin Panel"
          >
            <span>←</span> Exit
          </button>
        )}
      </div>

      {/* Section Tabs */}
      <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`py-2.5 lg:py-3.5 px-2 rounded-xl text-center transition-all flex flex-col items-center justify-center min-h-[48px] lg:min-h-[58px] ${activeSection === s.id
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
              }`}
          >
            <div className="text-xs sm:text-sm lg:text-[15px] font-bold leading-tight truncate">{s.label}</div>
            {s.count !== undefined && (
              <div className={`text-[10px] sm:text-xs lg:text-[13px] font-semibold mt-0.5 ${activeSection === s.id ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'}`}>
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
          onDeleteUser={handleDeleteUser}
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
          quizMonthCounts={quizMonthCounts}
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
