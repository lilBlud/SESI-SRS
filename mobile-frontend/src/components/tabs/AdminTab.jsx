import React, { useState, useEffect, useCallback } from 'react';
import { getInfographicsDirect, getGlossaryDirect, getVisitorStatsDirect, supabase } from '../../utils/supabaseClient';
import AdminLoginView from './admin/AdminLoginView';
import AdminTrafficSection from './admin/AdminTrafficSection';
import AdminQuizSection from './admin/AdminQuizSection';
import AdminGlossarySection from './admin/AdminGlossarySection';
import AdminInfographicsSection from './admin/AdminInfographicsSection';

const API_BASE = import.meta.env.VITE_API_BASE || '';
const currentMonth = new Date().toISOString().slice(0, 7);
const defaultMonth = currentMonth < '2026-01' ? '2026-01' : currentMonth;

export default function AdminTab({ onGlossaryChange, visitorStats, onRefreshVisitorStats }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken'));
  const [activeSection, setActiveSection] = useState('traffic'); // 'traffic' | 'questions' | 'glossary' | 'infographics'

  // ─── Domain States ───
  const [trafficData, setTrafficData] = useState(null);
  const [loadingTraffic, setLoadingTraffic] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [qCount, setQCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [infographics, setInfographics] = useState([]);

  // ─── Fetch Handlers ───
  const fetchTraffic = useCallback(async () => {
    setLoadingTraffic(true);
    try {
      const directStats = await getVisitorStatsDirect();
      if (directStats) {
        setTrafficData(directStats);
        if (onRefreshVisitorStats) onRefreshVisitorStats();
        return;
      }
    } catch (e) {
      console.warn('Direct fetch traffic failed in AdminTab:', e);
    }

    try {
      const res = await fetch(`${API_BASE}/api/visitors/stats?t=${Date.now()}`);
      if (res.ok) {
        const d = await res.json();
        setTrafficData(d);
        if (onRefreshVisitorStats) onRefreshVisitorStats();
      }
    } catch (e) {
      console.error('Failed to fetch traffic stats fallback:', e);
    } finally {
      setLoadingTraffic(false);
    }
  }, [onRefreshVisitorStats]);

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
    fetchQuestions();
    fetchGlossary();
    fetchInfographics();
    fetchTraffic();
  }, [fetchQuestions, fetchGlossary, fetchInfographics, fetchTraffic]);

  useEffect(() => {
    if (token) {
      loadAll();
    }
  }, [token, loadAll]);

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    setToken(null);
  };

  // ─── Login Screen ───
  if (!token) {
    return <AdminLoginView onLoginSuccess={(newToken) => setToken(newToken)} />;
  }

  const sections = [
    { id: 'traffic', label: 'Visitors' },
    { id: 'questions', label: 'Quiz', count: qCount },
    { id: 'glossary', label: 'Dictionary', count: glossaryTerms.length },
    { id: 'infographics', label: 'Posts', count: infographics.length }
  ];

  return (
    <div className="space-y-4 animate-slideUp pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Admin Dashboard</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">Manage Content</h1>
        </div>
        <button 
          onClick={logout} 
          className="px-3 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-500 text-xs font-bold rounded-xl hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>

      {/* Section Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        {sections.map(s => (
          <button 
            key={s.id} 
            onClick={() => {
              setActiveSection(s.id);
              if (s.id === 'traffic') fetchTraffic();
            }} 
            className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center min-h-[46px] ${
              activeSection === s.id 
                ? 'bg-emerald-600 text-white shadow-md font-black' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
            }`}
          >
            <div className="text-[12px] sm:text-[13px] leading-tight truncate">{s.label}</div>
            {s.count !== undefined && (
              <div className={`text-[10px] mt-0.5 ${activeSection === s.id ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'}`}>
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
