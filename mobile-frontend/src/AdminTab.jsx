import React, { useState, useEffect } from 'react';

const API_BASE = `http://${window.location.hostname}:5195`;
const currentMonth = new Date().toISOString().slice(0, 7);

export default function AdminTab({ onGlossaryChange }) {
  const [token, setToken] = useState(sessionStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState('questions'); // questions | glossary | infographics

  // ─── Quiz State ───
  const [questions, setQuestions] = useState([]);
  const [qCount, setQCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [qText, setQText] = useState(''); const [optA, setOptA] = useState(''); const [optB, setOptB] = useState(''); const [optC, setOptC] = useState(''); const [optD, setOptD] = useState(''); const [correct, setCorrect] = useState('A');
  const [qMsg, setQMsg] = useState('');

  // ─── Glossary State ───
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [gTerm, setGTerm] = useState(''); const [gFull, setGFull] = useState(''); const [gDesc, setGDesc] = useState(''); const [gFormula, setGFormula] = useState(''); const [gNotations, setGNotations] = useState(''); const [gMeanings, setGMeanings] = useState(''); const [gCat, setGCat] = useState('IBR Framework');
  const [gMsg, setGMsg] = useState('');

  // ─── Infographics State ───
  const [infographics, setInfographics] = useState([]);
  const [iTitle, setITitle] = useState(''); const [iDesc, setIDesc] = useState(''); const [iImages, setIImages] = useState([]); const [iCat, setICat] = useState('General');
  const [iMsg, setIMsg] = useState('');
  const [iEditId, setIEditId] = useState(null);

  useEffect(() => { if (token) loadAll(); }, [token, selectedMonth]);

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (res.ok) { const d = await res.json(); sessionStorage.setItem('adminToken', d.token); setToken(d.token); }
    else alert('Invalid password');
  };

  const loadAll = () => { fetchQuestions(); fetchGlossary(); fetchInfographics(); };

  const fetchQuestions = async () => {
    const res = await fetch(`${API_BASE}/api/admin/questions/${selectedMonth}`);
    if (res.ok) { const d = await res.json(); setQuestions(d.questions); setQCount(d.count); }
  };

  const fetchGlossary = async () => {
    const res = await fetch(`${API_BASE}/api/admin/glossary`);
    if (res.ok) setGlossaryTerms(await res.json());
  };

  const fetchInfographics = async () => {
    const res = await fetch(`${API_BASE}/api/admin/infographics`);
    if (res.ok) setInfographics(await res.json());
  };

  // ─── Quiz Actions ───
  const addQuestion = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/admin/questions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ month: selectedMonth, questionText: qText, optionA: optA, optionB: optB, optionC: optC, optionD: optD, correctOption: correct }) });
    if (res.ok) { setQMsg('✅ Question added!'); fetchQuestions(); setQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setCorrect('A'); }
    else { const err = await res.json(); setQMsg(`❌ ${err.error}`); }
    setTimeout(() => setQMsg(''), 3000);
  };

  const deleteQuestion = async (id) => {
    if (!confirm('Delete this question?')) return;
    await fetch(`${API_BASE}/api/admin/questions/${id}`, { method: 'DELETE' });
    fetchQuestions();
  };

  // ─── Glossary Actions ───
  const addGlossaryTerm = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/admin/glossary`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ term: gTerm, fullName: gFull, description: gDesc, formula: gFormula, formulaNotations: gNotations, formulaTermMeanings: gMeanings, category: gCat }) });
    if (res.ok) { setGMsg('✅ Term added!'); fetchGlossary(); if (onGlossaryChange) onGlossaryChange(); setGTerm(''); setGFull(''); setGDesc(''); setGFormula(''); setGNotations(''); setGMeanings(''); setGCat('IBR Framework'); }
    else setGMsg('❌ Failed to add term');
    setTimeout(() => setGMsg(''), 3000);
  };

  const deleteGlossaryTerm = async (id) => {
    if (!confirm('Delete this term?')) return;
    await fetch(`${API_BASE}/api/admin/glossary/${id}`, { method: 'DELETE' });
    fetchGlossary();
    if (onGlossaryChange) onGlossaryChange();
  };

  // ─── Infographic Actions ───
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (iImages.length + files.length > 10) {
      alert(`You can upload a maximum of 10 images. You already have ${iImages.length}.`);
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setIImages(prev => [...prev, reader.result].slice(0, 10));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setIImages(prev => prev.filter((_, i) => i !== idx));
  };

  const addInfographic = async (e) => {
    e.preventDefault();
    const primaryImage = iImages[0] || '';
    const additional = iImages.length > 1 ? JSON.stringify(iImages.slice(1)) : '';
    
    let res;
    if (iEditId) {
      res = await fetch(`${API_BASE}/api/admin/infographics/${iEditId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: iTitle, description: iDesc, imageUrl: primaryImage, additionalImages: additional, category: iCat }) });
    } else {
      res = await fetch(`${API_BASE}/api/admin/infographics`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: iTitle, description: iDesc, imageUrl: primaryImage, additionalImages: additional, category: iCat }) });
    }

    if (res.ok) { 
      setIMsg(iEditId ? '✅ Updated!' : '✅ Posted!'); 
      fetchInfographics(); 
      cancelEditInfographic();
    }
    else setIMsg(iEditId ? '❌ Failed to update' : '❌ Failed to post');
    setTimeout(() => setIMsg(''), 3000);
  };

  const cancelEditInfographic = () => {
    setIEditId(null);
    setITitle(''); setIDesc(''); setIImages([]); setICat('General');
  };

  const editInfographic = (item) => {
    setIEditId(item.id);
    setITitle(item.title);
    setIDesc(item.description || '');
    setICat(item.category || 'General');
    
    const allImages = [];
    if (item.imageUrl) allImages.push(item.imageUrl);
    if (item.additionalImages) {
      try {
        const parsed = typeof item.additionalImages === 'string' ? JSON.parse(item.additionalImages) : item.additionalImages;
        if (Array.isArray(parsed)) allImages.push(...parsed);
      } catch(e) {}
    }
    setIImages(allImages);
  };

  const deleteInfographic = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`${API_BASE}/api/admin/infographics/${id}`, { method: 'DELETE' });
    fetchInfographics();
  };

  const logout = () => { sessionStorage.removeItem('adminToken'); setToken(null); };

  // ─── Login Screen ───
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 animate-slideUp">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-700">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-xl font-black mb-1 text-center">Admin Portal</h2>
          <p className="text-slate-500 text-sm text-center mb-5">SRS Admin access only</p>
          <form onSubmit={login} className="space-y-4">
            <input type="password" placeholder="Enter admin password" className="w-full p-3.5 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/25">Login</button>
          </form>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'questions', label: 'Quiz', count: qCount },
    { id: 'glossary', label: 'Dictionary', count: glossaryTerms.length },
    { id: 'infographics', label: 'Posts', count: infographics.length },
  ];

  return (
    <div className="space-y-4 animate-slideUp pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Admin Dashboard</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">Manage Content</h1>
        </div>
        <button onClick={logout} className="px-3 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-500 text-xs font-bold rounded-xl">Logout</button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={`px-4 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all ${activeSection === s.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            {s.label} <span className="ml-1 text-[11px] opacity-70">({s.count})</span>
          </button>
        ))}
      </div>

      {/* ════════ QUIZ QUESTIONS ════════ */}
      {activeSection === 'questions' && (
        <div className="space-y-4">
          {/* Month picker */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Managing Month</label>
            <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full mt-2 p-2.5 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono" />
          </div>

          {/* Counter */}
          <div className="rounded-2xl p-4 flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl bg-emerald-500 text-white">{qCount}</div>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-emerald-700">
                Questions for {selectedMonth}
              </div>
            </div>
            <div className="text-[13px] font-black text-slate-400">{qCount} Total</div>
          </div>

          {/* Add question form */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h2 className="text-[16px] font-bold mb-4">Add New Question</h2>
              <form onSubmit={addQuestion} className="space-y-3">
                <textarea required placeholder="Question text..." rows={2} className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" value={qText} onChange={e => setQText(e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  {[['A', optA, setOptA], ['B', optB, setOptB], ['C', optC, setOptC], ['D', optD, setOptD]].map(([l, v, s]) => (
                    <div key={l} className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-black text-emerald-600">{l}</span>
                      <input required placeholder={`Option ${l}`} className="w-full pl-7 pr-2.5 py-2.5 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={v} onChange={e => s(e.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-600">Correct:</span>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map(o => (
                      <button key={o} type="button" onClick={() => setCorrect(o)} className={`w-9 h-9 rounded-xl text-sm font-black transition-all ${correct === o ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>{o}</button>
                    ))}
                  </div>
                </div>
                {qMsg && <div className={`text-sm font-semibold px-3 py-2 rounded-xl ${qMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{qMsg}</div>}
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20">+ Add Question</button>
              </form>
            </div>

          {/* Questions list */}
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={q.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-3 items-start">
                <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13px] leading-snug">{q.questionText}</p>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {[['A', q.optionA], ['B', q.optionB], ['C', q.optionC], ['D', q.optionD]].map(([l, t]) => (
                      <div key={l} className={`text-[11px] px-2 py-1 rounded-lg flex gap-1 ${q.correctOption === l ? 'bg-emerald-100 text-emerald-700 font-bold' : 'text-slate-500'}`}>
                        <span className="font-black">{l}.</span> {t}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => deleteQuestion(q.id)} className="text-red-400 bg-red-50 p-2 rounded-xl shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
            {questions.length === 0 && <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200">No questions for this month yet.</div>}
          </div>
        </div>
      )}

      {/* ════════ GLOSSARY / DICTIONARY ════════ */}
      {activeSection === 'glossary' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-[16px] font-bold mb-4">Add New Dictionary Term</h2>
            <form onSubmit={addGlossaryTerm} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Acronym (e.g. IBR)" className="p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={gTerm} onChange={e => setGTerm(e.target.value)} />
                <select value={gCat} onChange={e => setGCat(e.target.value)} className="p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="IBR Framework">IBR Framework</option>
                  <option value="Strategy and Sustainability">Strategy & Sustainability</option>
                  <option value="Energy Market and Industry">Energy Market & Industry</option>
                  <option value="ESG">ESG</option>
                  <option value="EPSB">EPSB</option>
                  <option value="BDV">BDV</option>
                  <option value="Governance">Governance</option>
                  <option value="Corporate Performance">Corporate Performance</option>
                  <option value="ISO Management">ISO Management</option>
                  <option value="SE Risk">Sabah Electricity Risk</option>
                  <option value="ReSET2030">ReSET2030</option>
                </select>
              </div>
              <input required placeholder="Full name (e.g. Incentive-Based Regulation)" className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={gFull} onChange={e => setGFull(e.target.value)} />
              <textarea required placeholder="Description / explanation..." rows={3} className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" value={gDesc} onChange={e => setGDesc(e.target.value)} />
              <input placeholder="Formula (optional, e.g. ROI = Net Profit / Cost × 100%)" className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono" value={gFormula} onChange={e => setGFormula(e.target.value)} />
              <input placeholder="Formula Notations (e.g. AAT, REQT, BASE)" className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono" value={gNotations} onChange={e => setGNotations(e.target.value)} />
              <textarea placeholder="Meaning of terms (e.g. AAT: Actual Average Tariff...)" rows={3} className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" value={gMeanings} onChange={e => setGMeanings(e.target.value)} />
              {gMsg && <div className={`text-sm font-semibold px-3 py-2 rounded-xl ${gMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{gMsg}</div>}
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20">+ Add Term</button>
            </form>
          </div>

          {/* Terms list */}
          <div className="space-y-2">
            {glossaryTerms.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200">No terms yet.</div>
            ) : (
              glossaryTerms.map(t => (
                <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-3 items-start">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center font-black text-[13px] font-mono shrink-0">
                    {t.term.length > 4 ? t.term.slice(0,3) : t.term}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[14px]">{t.term}</p>
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{t.category}</span>
                    </div>
                    <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-0.5">{t.fullName}</p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                  </div>
                  <button onClick={() => deleteGlossaryTerm(t.id)} className="text-red-400 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ════════ INFOGRAPHICS / POSTERS ════════ */}
      {activeSection === 'infographics' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-[16px] font-bold mb-4">Post Infographic / Poster</h2>
            <form onSubmit={addInfographic} className="space-y-3">
              <input required placeholder="Title (e.g. IBR Overview 2026)" className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={iTitle} onChange={e => setITitle(e.target.value)} />
              <div className="flex gap-3">
                <select className="flex-1 p-3 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={iCat} onChange={e => setICat(e.target.value)}>
                  <option value="General">General</option>
                  <option value="IBR Framework">IBR Framework</option>
                  <option value="Strategy and Sustainability">Strategy & Sustainability</option>
                  <option value="Energy Market and Industry">Energy Market & Industry</option>
                  <option value="ESG">ESG</option>
                  <option value="EPSB">EPSB</option>
                  <option value="BDV">BDV</option>
                  <option value="Governance">Governance</option>
                  <option value="Corporate Performance">Corporate Performance</option>
                  <option value="ISO Management">ISO Management</option>
                  <option value="SE Risk">Sabah Electricity Risk</option>
                  <option value="ReSET2030">ReSET2030</option>
                </select>
              </div>
              <textarea placeholder="Description (optional)" rows={2} className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" value={iDesc} onChange={e => setIDesc(e.target.value)} />
              
              {/* Multi-image upload zone */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center">
                <input type="file" id="image-upload" accept="image/*,video/*" multiple onChange={handleImageUpload} className="hidden" />
                <label htmlFor="image-upload" className="cursor-pointer text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  📸 Click to upload images (max 10)
                </label>
                <p className="text-[11px] text-slate-400 mt-1">{iImages.length}/10 images selected</p>
                {iImages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 justify-center">
                    {iImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} className="h-20 w-20 object-cover rounded-lg shadow-sm bg-slate-100" alt={`Upload ${idx+1}`} />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg">✕</button>
                        {idx === 0 && <span className="absolute bottom-0.5 left-0.5 bg-emerald-500 text-white text-[8px] font-bold px-1 rounded">Main</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {iMsg && <div className={`text-sm font-semibold px-3 py-2 rounded-xl ${iMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{iMsg}</div>}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                  {iEditId ? 'Update Poster' : 'Post Poster'}
                </button>
                {iEditId && (
                  <button type="button" onClick={cancelEditInfographic} className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl active:scale-95 transition-all shadow-sm">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Infographics list */}
          <div className="space-y-3">
            {infographics.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200">No infographics posted yet.</div>
            ) : (
              infographics.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" onError={e => e.target.style.display='none'} />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[15px]">{item.title}</h3>
                        {item.description && <p className="text-[12px] text-slate-500 mt-1">{item.description}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">{item.category}</span>
                          <span className="text-[10px] text-slate-400">{new Date(item.postedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editInfographic(item)} className="text-blue-500 bg-blue-50 dark:bg-blue-950/20 p-2 rounded-xl shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => deleteInfographic(item.id)} className="text-red-400 bg-red-50 dark:bg-red-950/20 p-2 rounded-xl shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
