import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:5195';

// ─── SVG Icons ───
const HomeIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BookIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const QuizIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CheatIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// ─── Home Tab ───
function HomeTab({ setActiveTab }) {
  const [rab, setRab] = useState(45000);
  const [wacc, setWacc] = useState(7.3);
  const [opex, setOpex] = useState(6800);
  const [dep, setDep] = useState(5200);
  const tax = 1038;

  const fmt = (n) => `$${n.toLocaleString('en-US')} M`;
  const returnOnRab = rab * (wacc / 100);
  const totalRev = opex + dep + returnOnRab + tax;

  return (
    <div className="space-y-5 animate-slideUp">
      {/* Hero Card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 text-white rounded-2xl p-6 shadow-xl overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-3 border border-emerald-500/30">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            IBR Literacy Hub
          </span>
          <h1 className="text-[22px] font-black tracking-tight leading-tight">
            Incentive-Based Regulation (IBR)
          </h1>
          <p className="text-emerald-200/80 text-[13px] mt-2 leading-relaxed font-light">
            Self-learning resource to understand IBR, the Building Block Model, ICPT, and energy transition concepts.
          </p>
          <div className="flex gap-2.5 mt-5">
            <a href="#simulator" className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 text-[13px] font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center">
              Simulator ↓
            </a>
            <button onClick={() => setActiveTab('glossary')} className="px-4 py-2.5 bg-white/10 active:bg-white/25 text-white text-[13px] font-bold rounded-xl border border-white/20 backdrop-blur-sm transition-all">
              Browse Terms
            </button>
          </div>
        </div>
      </div>

      {/* Simulator */}
      <div id="simulator" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Interactive Simulator</span>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Building Block Model</h2>
        <div className="mt-2 font-mono text-[11px] bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 font-bold border border-slate-200 dark:border-slate-700 inline-block">
          Revenue = OPEX + Dep + (RAB × WACC) + Tax
        </div>

        {/* Sliders */}
        <div className="mt-5 space-y-5">
          <div>
            <div className="flex justify-between text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>RAB:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{fmt(rab)}</span>
            </div>
            <input type="range" min="10000" max="80000" step="1000" value={rab} onChange={e => setRab(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>WACC:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{wacc.toFixed(1)}%</span>
            </div>
            <input type="range" min="4.0" max="10.0" step="0.1" value={wacc} onChange={e => setWacc(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>OPEX:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{fmt(opex)}</span>
            </div>
            <input type="range" min="2000" max="15000" step="200" value={opex} onChange={e => setOpex(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>Depreciation:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{fmt(dep)}</span>
            </div>
            <input type="range" min="1000" max="10000" step="100" value={dep} onChange={e => setDep(+e.target.value)} className="w-full" />
          </div>
        </div>

        {/* Result */}
        <div className="mt-6 bg-emerald-50/60 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Allowed Annual Revenue</span>
          <div className="text-[28px] font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
            {fmt(Math.round(totalRev))}
          </div>

          <div className="mt-4 w-full h-4 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
            <div style={{ width: `${(returnOnRab / totalRev) * 100}%` }} className="bg-emerald-600 h-full transition-all duration-300" title="Return"></div>
            <div style={{ width: `${(opex / totalRev) * 100}%` }} className="bg-teal-500 h-full transition-all duration-300" title="OPEX"></div>
            <div style={{ width: `${(dep / totalRev) * 100}%` }} className="bg-indigo-500 h-full transition-all duration-300" title="Depreciation"></div>
            <div style={{ width: `${(tax / totalRev) * 100}%` }} className="bg-amber-500 h-full transition-all duration-300" title="Taxes"></div>
          </div>

          <div className="mt-4 space-y-2">
            {[
              { label: 'Return on RAB', val: fmt(Math.round(returnOnRab)), color: 'bg-emerald-600' },
              { label: 'OPEX', val: fmt(opex), color: 'bg-teal-500' },
              { label: 'Depreciation', val: fmt(dep), color: 'bg-indigo-500' },
              { label: 'Taxes', val: fmt(tax), color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[13px]">
                <span className="flex items-center font-medium">
                  <span className={`w-3 h-3 rounded-full ${item.color} mr-2`}></span>
                  {item.label}
                </span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{item.val}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3">* Taxes modeled at static $1,038 M</p>
        </div>
      </div>
    </div>
  );
}

// ─── Glossary Tab ───
function GlossaryTab({ glossary }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = glossary.filter(item => {
    const matchSearch = item.term.toLowerCase().includes(search.toLowerCase()) || item.full.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === 'All' || item.cat === cat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4 animate-slideUp">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Knowledge Repository</span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">Dictionary</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search terms..."
          className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {['All', 'IBR', 'ESG'].map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all active:scale-95 ${cat === c ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            {c === 'All' ? 'All' : c === 'IBR' ? 'IBR & Regulatory' : 'Sustainability & ESG'}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">No terms found.</div>
        ) : (
          filtered.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-sm active:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="text-[17px] font-black text-emerald-600 dark:text-emerald-400">{item.term}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-md">{item.cat}</span>
              </div>
              <h4 className="text-[14px] font-semibold text-slate-900 dark:text-white mt-0.5">{item.full}</h4>
              <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Quiz Tab (Sleek Category Design) ───
function QuizTab() {
  const [state, setState] = useState('idle'); // idle | loading | active | review
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const pickCategory = async (cat) => {
    setCategory(cat);
    setState('loading');
    try {
      const res = await fetch(`${API_BASE}/api/quiz/${cat}`);
      const data = await res.json();
      setQuestions(data);
      setState('active');
      setCurrentQ(0);
      setSelected(null);
      setAnswered(false);
      setAnswers([]);
      setScore(0);
    } catch (e) {
      console.error('Quiz fetch error:', e);
      setState('idle');
    }
  };

  const selectAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const q = questions[currentQ];
    const isCorrect = idx === q.correctIndex;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, { questionId: q.id, selected: idx, correct: q.correctIndex, isCorrect }]);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setState('review');
    }
  };

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slideUp">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-sm">Loading quiz questions...</p>
      </div>
    );
  }

  // ─ Idle Screen ─
  if (state === 'idle') {
    return (
      <div className="animate-slideUp space-y-6">
        <div className="text-center pt-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-5">Knowledge Quiz</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[14px] mt-2 max-w-xs mx-auto">Choose a category to test your knowledge.</p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => pickCategory('ibr')}
            className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm text-left active:scale-[0.98] transition-all hover:border-emerald-500/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[16px] font-bold text-slate-900 dark:text-white">IBR & Regulatory</span>
                <p className="text-[13px] text-slate-500 mt-1">10 Questions • Incentive-Based Regulation</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl shrink-0">📊</div>
            </div>
          </button>
          
          <button
            onClick={() => pickCategory('esg')}
            className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm text-left active:scale-[0.98] transition-all hover:border-emerald-500/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[16px] font-bold text-slate-900 dark:text-white">Sustainability & ESG</span>
                <p className="text-[13px] text-slate-500 mt-1">10 Questions • Environment, Social, Gov</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl shrink-0">🌱</div>
            </div>
          </button>
        </div>
      </div>
    );
  }



  // ─ Active Quiz ─
  if (state === 'active') {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <div className="animate-fadeIn space-y-5">
        {/* Header with Back Button */}
        <div className="flex items-center">
          <button
            onClick={() => setState('idle')}
            className="flex items-center text-sm font-bold text-slate-400 hover:text-emerald-500 transition-colors active:scale-95"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </button>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-[12px] font-bold text-slate-500 mb-2">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white leading-snug">{q.question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let styles = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white';
            if (answered) {
              if (idx === q.correctIndex) {
                styles = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300';
              } else if (idx === selected && idx !== q.correctIndex) {
                styles = 'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-800 dark:text-red-300';
              } else {
                styles = 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-2xl border-2 text-[15px] font-medium transition-all active:scale-[0.98] ${styles}`}
              >
                <div className="flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold mr-3 shrink-0 ${
                    answered && idx === q.correctIndex ? 'bg-emerald-500 text-white' :
                    answered && idx === selected ? 'bg-red-500 text-white' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {answered && idx === q.correctIndex ? '✓' : answered && idx === selected ? '✗' : String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 animate-scaleIn">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Explanation</p>
            <p className="text-[13px] text-emerald-800 dark:text-emerald-300 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* Next Button */}
        {answered && (
          <button
            onClick={nextQuestion}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[15px] font-bold rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-transform animate-scaleIn"
          >
            {currentQ < questions.length - 1 ? 'Next Question →' : 'View Results'}
          </button>
        )}
      </div>
    );
  }

  // ─ Review Screen ─
  if (state === 'review') {
    const pct = Math.round((score / questions.length) * 100);
    const grade = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Job!' : pct >= 40 ? 'Keep Learning!' : 'Study More!';
    const gradeColor = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-teal-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600';

    return (
      <div className="animate-slideUp space-y-5">
        <div className="text-center pt-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
            <span className="text-3xl font-black text-white">{pct}%</span>
          </div>
          <h2 className={`text-2xl font-black mt-4 ${gradeColor}`}>{grade}</h2>
          <p className="text-slate-500 text-[14px] mt-1">You scored {score} out of {questions.length}</p>
        </div>

        {/* Score Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div className="flex justify-between text-[13px] mb-2">
            <span className="text-slate-500">Score</span>
            <span className="font-bold text-slate-900 dark:text-white">{score}/{questions.length}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
          </div>
        </div>

        {/* Answer Summary */}
        <div className="space-y-2">
          {answers.map((a, i) => (
            <div key={i} className={`flex items-center p-3.5 rounded-xl border text-[13px] font-medium ${a.isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold mr-3 shrink-0 ${a.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {a.isCorrect ? '✓' : '✗'}
              </span>
              <span className="truncate">Q{i + 1}: {questions[i].question}</span>
            </div>
          ))}
        </div>

        {/* Retry */}
        <button
          onClick={() => setState('idle')}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[15px] font-bold rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-transform"
        >
          Back to Categories
        </button>
      </div>
    );
  }
}

// ─── Cheat Sheet Tab ───
function CheatSheetTab() {
  const acronyms = [
    ['IBR', 'Incentive-Based Regulation'],
    ['RAB', 'Regulated Asset Base'],
    ['WACC', 'Weighted Average Cost of Capital'],
    ['ICPT', 'Imbalance Cost Pass-Through'],
    ['OPEX', 'Operating Expenditure'],
    ['CAPEX', 'Capital Expenditure'],
    ['SAIDI', 'System Avg Interruption Duration'],
    ['SAIFI', 'System Avg Interruption Frequency'],
    ['RP', 'Regulatory Period'],
    ['BBM', 'Building Block Model'],
    ['ESG', 'Environmental, Social, Governance'],
    ['RE', 'Renewable Energy'],
    ['GHG', 'Greenhouse Gas'],
    ['SDG', 'Sustainable Development Goals'],
    ['TCFD', 'Task Force on Climate-related Financial Disclosures'],
    ['Net Zero', 'Net Zero Carbon Emissions'],
  ];

  const keyFormulas = [
    { label: 'Revenue Requirement', formula: 'OPEX + Depreciation + (RAB × WACC) + Taxes' },
    { label: 'Return on Capital', formula: 'RAB × WACC' },
    { label: 'Depreciation', formula: 'Asset Value ÷ Asset Life' },
  ];

  return (
    <div className="space-y-5 animate-slideUp">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Reference</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">Cheat Sheet</h1>
        </div>
      </div>

      {/* Key Formulas */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
        <h2 className="text-[15px] font-bold mb-3 uppercase tracking-wider opacity-80">Key Formulas</h2>
        <div className="space-y-3">
          {keyFormulas.map((f, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20">
              <p className="text-[12px] font-medium text-emerald-200 mb-0.5">{f.label}</p>
              <p className="text-[14px] font-bold font-mono">{f.formula}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Acronyms Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Core Acronyms</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {acronyms.map(([acr, full], i) => (
            <div key={i} className="flex items-center px-5 py-3.5">
              <span className="text-[15px] font-mono font-bold text-emerald-600 dark:text-emerald-400 w-16 shrink-0">{acr}</span>
              <span className="text-[14px] text-slate-700 dark:text-slate-300">{full}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const [glossary, setGlossary] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    fetch(`${API_BASE}/api/glossary`)
      .then(r => r.json())
      .then(d => setGlossary(d))
      .catch(e => console.error('Glossary fetch error:', e));
  }, []);

  const tabs = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'glossary', label: 'Dictionary', Icon: BookIcon },
    { id: 'quiz', label: 'Quiz', Icon: QuizIcon },
    { id: 'cheatsheet', label: 'Reference', Icon: CheatIcon },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200 w-full max-w-[430px] mx-auto relative shadow-2xl">
      
      {/* Top Status Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 safe-area-top">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">SE</div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">IBR Literacy</span>
                <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Hub</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition-all"
          >
            {isDark ? (
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
            )}
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto scroll-container px-4 pt-4 pb-28">
        {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} />}
        {activeTab === 'glossary' && <GlossaryTab glossary={glossary} />}
        {activeTab === 'quiz' && <QuizTab />}
        {activeTab === 'cheatsheet' && <CheatSheetTab />}
      </main>

      {/* Bottom Tab Bar (Native-style) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-[68px] px-2">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1.5 space-y-0.5 rounded-xl transition-all active:scale-90 ${activeTab === id ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'opacity-50'}`}
            >
              <Icon active={activeTab === id} />
              <span className={`text-[10px] font-bold ${activeTab === id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
