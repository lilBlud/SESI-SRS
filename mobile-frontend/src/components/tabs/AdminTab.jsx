import React, { useState, useEffect } from 'react';
import { CorporatePerformanceChart, getYAxisUnit } from '../ui';
import { DEFAULT_HISTORICAL_METRICS } from '../../data/historicalPerformanceData';

const API_BASE = import.meta.env.VITE_API_BASE || "";
const currentMonth = new Date().toISOString().slice(0, 7);
const defaultMonth = currentMonth < '2026-01' ? '2026-01' : currentMonth;

export default function AdminTab({ onGlossaryChange, visitorStats, onRefreshVisitorStats }) {
  const [token, setToken] = useState(sessionStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState('traffic'); // traffic | questions | glossary | infographics
  const [dictSubTab, setDictSubTab] = useState('corporate'); // 'corporate' | 'dictionary'

  // ─── Traffic & Visitor State ───
  const [trafficData, setTrafficData] = useState(null);
  const [loadingTraffic, setLoadingTraffic] = useState(false);

  // ─── Quiz State ───
  const [questions, setQuestions] = useState([]);
  const [qCount, setQCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [qText, setQText] = useState(''); const [optA, setOptA] = useState(''); const [optB, setOptB] = useState(''); const [optC, setOptC] = useState(''); const [optD, setOptD] = useState(''); const [correct, setCorrect] = useState('A');
  const [qMsg, setQMsg] = useState('');

  // ─── Glossary / Corporate Performance State ───
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [gTerm, setGTerm] = useState(''); const [gFull, setGFull] = useState(''); const [gDesc, setGDesc] = useState(''); const [gFormula, setGFormula] = useState('area'); const [gNotations, setGNotations] = useState(''); const [gMeanings, setGMeanings] = useState(''); const [gCat, setGCat] = useState('Corporate Performance');
  const [gChartData, setGChartData] = useState([]); // Array of {month, year, value}
  const [gYAxisFormat, setGYAxisFormat] = useState('in %');
  const [cYear, setCYear] = useState('2026');
  const [gMsg, setGMsg] = useState('');
  const [gEditId, setGEditId] = useState(null);
  const [gFilter, setGFilter] = useState('');
  const [gCategoryFilter, setGCategoryFilter] = useState('All');
  const [syncingData, setSyncingData] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // ─── Infographics State ───
  const [infographics, setInfographics] = useState([]);
  const [iTitle, setITitle] = useState(''); const [iDesc, setIDesc] = useState(''); const [iImages, setIImages] = useState([]); const [iCat, setICat] = useState('General');
  const [iMsg, setIMsg] = useState('');
  const [iEditId, setIEditId] = useState(null);
  const [iPosting, setIPosting] = useState(false);

  useEffect(() => { if (token) loadAll(); }, [token, selectedMonth]);

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (res.ok) { const d = await res.json(); sessionStorage.setItem('adminToken', d.token); setToken(d.token); }
    else alert('Invalid password');
  };

  const loadAll = () => { fetchQuestions(); fetchGlossary(); fetchInfographics(); fetchTraffic(); };

  const fetchTraffic = async () => {
    setLoadingTraffic(true);
    try {
      const res = await fetch(`${API_BASE}/api/visitors/stats?t=${Date.now()}`);
      if (res.ok) {
        const d = await res.json();
        setTrafficData(d);
        if (onRefreshVisitorStats) onRefreshVisitorStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTraffic(false);
    }
  };

  const fetchQuestions = async () => {
    const res = await fetch(`${API_BASE}/api/admin/questions/${selectedMonth}`);
    if (res.ok) { const d = await res.json(); setQuestions(d.questions); setQCount(d.count); }
  };

  const fetchGlossary = async () => {
    const res = await fetch(`${API_BASE}/api/admin/glossary?t=${Date.now()}`);
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

  // ─── Glossary & Corporate Card Actions ───

  const addGlossaryTerm = async (e) => {
    e.preventDefault();
    
    const finalChartData = [...gChartData];
    const isPerfStudio = dictSubTab === 'corporate';

    const payload = { 
      term: gTerm.trim(), 
      fullName: isPerfStudio ? '' : (gFull || ''), 
      description: gDesc, 
      formula: isPerfStudio ? (gFormula || 'area') : (gFormula || ''), 
      formulaNotations: isPerfStudio ? (gYAxisFormat || 'in %') : (gNotations || ''), 
      formulaTermMeanings: isPerfStudio ? '' : (gMeanings || ''), 
      category: gCat || (isPerfStudio ? 'Corporate Performance' : 'IBR Framework'), 
      chartData: isPerfStudio && finalChartData.length > 0 ? JSON.stringify(finalChartData) : '' 
    };
    let res;
    if (gEditId) {
      res = await fetch(`${API_BASE}/api/admin/glossary/${gEditId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      res = await fetch(`${API_BASE}/api/admin/glossary`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }

    if (res.ok) { 
      setGMsg(gEditId ? '✅ Card updated successfully!' : '✅ New card created successfully!'); 
      fetchGlossary(); 
      if (onGlossaryChange) onGlossaryChange(); 
      cancelEditGlossaryTerm();
    }
    else setGMsg(gEditId ? '❌ Failed to update card' : '❌ Failed to add card');
    setTimeout(() => setGMsg(''), 3500);
  };

  const editGlossaryTerm = (t) => {
    setGEditId(t.id);
    setGTerm(t.term); setGFull(t.fullName || ''); setGDesc(t.description || ''); setGFormula(t.formula || 'area'); setGNotations(t.formulaNotations || ''); setGMeanings(t.formulaTermMeanings || ''); setGCat(t.category || 'Corporate Performance');
    setGYAxisFormat(t.formulaNotations || getYAxisUnit(t.term));
    let chart = [];
    try { chart = t.chartData ? JSON.parse(t.chartData) : []; } catch(e) { chart = []; }
    setGChartData(chart);
    if (chart.length > 0) {
      const years = [...new Set(chart.map(d => String(d.year)))].sort();
      setCYear(years[years.length - 1] || '2026');
    }
    const isPerfCard = t.category === 'Corporate Performance' || (chart && chart.length > 0);
    if (isPerfCard) {
      setDictSubTab('corporate');
      setGCategoryFilter('All');
    } else {
      setDictSubTab('dictionary');
    }
    setShowForm(true);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const duplicateGlossaryTerm = (t) => {
    setGEditId(null); // Create new
    setGTerm(`Copy of ${t.term}`);
    setGFull(t.fullName || '');
    setGDesc(t.description || '');
    setGFormula(t.formula || 'area');
    setGNotations(t.formulaNotations || '');
    setGMeanings(t.formulaTermMeanings || '');
    setGCat(t.category || 'Corporate Performance');
    setGYAxisFormat(t.formulaNotations || 'in %');
    let chart = [];
    try { chart = t.chartData ? JSON.parse(t.chartData) : []; } catch(e) { chart = []; }
    setGChartData(chart);
    if (chart.length > 0) {
      const years = [...new Set(chart.map(d => String(d.year)))].sort();
      setCYear(years[years.length - 1] || '2026');
    }
    setGMsg(`✅ Duplicating "${t.term}" in category "${t.category || 'Corporate Performance'}"!`);
    setTimeout(() => setGMsg(''), 4000);
    setShowForm(true);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const loadPreset = (key) => {
    const tmpl = DEFAULT_HISTORICAL_METRICS[key];
    if (!tmpl) return;
    setGTerm(tmpl.term);
    setGDesc(tmpl.description);
    setGYAxisFormat(tmpl.yAxisFormat);
    setGFormula(tmpl.formula || 'area');
    setGCat(tmpl.category || (key.includes('EPSB') ? 'EPSB' : 'Corporate Performance'));
    setGChartData([...tmpl.chartData]);
    setCYear('2026');
    
    // Check if term already exists in DB to link for update
    const existing = glossaryTerms.find(t => (t.term || '').trim().toUpperCase() === key.toUpperCase());
    if (existing) {
      setGEditId(existing.id);
      if (existing.category) setGCat(existing.category);
      setGMsg(`✅ Loaded preset "${tmpl.term}" (editing card ID #${existing.id})`);
    } else {
      setGEditId(null);
      setGMsg(`✅ Loaded preset "${tmpl.term}" with 2022–2026 historical data!`);
    }
    setTimeout(() => setGMsg(''), 4000);
    setShowForm(true);
  };

  const syncDefaultHistoricalData = async () => {
    if (!confirm('This will synchronize and update all Performance cards with rich historical data from 2022 to 2026 (including EPSB Revenue, Financial Performance, and Technical Performance). Continue?')) return;
    setSyncingData(true);
    try {
      const keys = Object.keys(DEFAULT_HISTORICAL_METRICS);
      let updatedCount = 0;
      let addedCount = 0;

      for (const key of keys) {
        const tmpl = DEFAULT_HISTORICAL_METRICS[key];
        const existing = glossaryTerms.find(t => (t.term || '').trim().toUpperCase() === key.toUpperCase());

        const targetCat = tmpl.category || (key.includes('EPSB') ? 'EPSB' : 'Corporate Performance');
        const payload = {
          term: tmpl.term,
          fullName: '',
          description: tmpl.description,
          formula: tmpl.formula || 'area',
          formulaNotations: tmpl.yAxisFormat,
          formulaTermMeanings: '',
          category: targetCat,
          chartData: JSON.stringify(tmpl.chartData)
        };

        if (existing) {
          await fetch(`${API_BASE}/api/admin/glossary/${existing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          updatedCount++;
        } else {
          await fetch(`${API_BASE}/api/admin/glossary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          addedCount++;
        }
      }

      await fetchGlossary();
      if (onGlossaryChange) onGlossaryChange();
      setGMsg(`✅ Synced! ${updatedCount} cards updated with 2022–2026 data, ${addedCount} new cards added.`);
    } catch (e) {
      console.error(e);
      setGMsg('❌ Error syncing historical data');
    } finally {
      setSyncingData(false);
      setTimeout(() => setGMsg(''), 5000);
    }
  };

  const cancelEditGlossaryTerm = () => {
    setGEditId(null);
    setGTerm(''); setGFull(''); setGDesc(''); setGFormula('area'); setGNotations(''); setGMeanings('');
    if (dictSubTab === 'corporate') {
      setGCat('Corporate Performance');
      setCYear('2026');
    } else {
      setGCat('IBR Framework');
    }
    setGChartData([]); setGYAxisFormat('in %');
    setShowForm(false);
  };

  const deleteGlossaryTerm = async (id) => {
    if (!confirm('Delete this card / term?')) return;
    await fetch(`${API_BASE}/api/admin/glossary/${id}`, { method: 'DELETE' });
    fetchGlossary();
    if (onGlossaryChange) onGlossaryChange();
  };

  // ─── Infographic Actions ───
  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (!file || !file.type || !file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1600;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const ensureCompressed = (dataUrl) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return Promise.resolve(dataUrl);
    }
    // If it's already compact (< 450KB), skip recompression
    if (dataUrl.length < 450000) return Promise.resolve(dataUrl);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1600;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (iImages.length + files.length > 10) {
      alert(`You can upload a maximum of 10 images. You already have ${iImages.length}.`);
      return;
    }
    setIMsg('⏳ Processing images...');
    const compressed = await Promise.all(files.map(compressImage));
    const valid = compressed.filter(Boolean);
    setIImages(prev => [...prev, ...valid].slice(0, 10));
    setIMsg('');
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setIImages(prev => prev.filter((_, i) => i !== idx));
  };

  const addInfographic = async (e) => {
    e.preventDefault();
    if (!iTitle.trim()) {
      setIMsg('❌ Title is required');
      return;
    }
    if (iImages.length === 0) {
      setIMsg('❌ Please upload at least one image/poster');
      return;
    }

    setIPosting(true);
    setIMsg('⏳ Optimizing & uploading poster...');

    try {
      // Ensure all images are compressed before sending
      const compressedImages = await Promise.all(iImages.map(ensureCompressed));
      const primaryImage = compressedImages[0] || '';
      const additional = compressedImages.length > 1 ? JSON.stringify(compressedImages.slice(1)) : '';
      
      const payload = {
        title: iTitle.trim(),
        description: (iDesc || '').trim(),
        imageUrl: primaryImage,
        additionalImages: additional,
        category: iCat || 'General'
      };

      const url = iEditId 
        ? `${API_BASE}/api/admin/infographics/${iEditId}` 
        : `${API_BASE}/api/admin/infographics`;
      const method = iEditId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) { 
        setIMsg(iEditId ? '✅ Updated!' : '✅ Posted!'); 
        await fetchInfographics(); 
        cancelEditInfographic();
      } else {
        const errorText = await res.text();
        console.error('Post failed:', res.status, errorText);
        setIMsg(`❌ Server error: ${errorText.slice(0, 100) || 'Failed to post'}`);
      }
    } catch (err) {
      console.error('Post error:', err);
      setIMsg(`❌ Network error: ${err.message || 'Could not connect to server'}`);
    } finally {
      setIPosting(false);
      setTimeout(() => setIMsg(''), 4000);
    }
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
    { id: 'traffic', label: 'Visitors' },
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
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        {sections.map(s => (
          <button 
            key={s.id} 
            onClick={() => {
              setActiveSection(s.id);
              setShowForm(false);
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
        <div className="space-y-4">
          {/* Main 3 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Visits */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Visits</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-black">👥</span>
              </div>
              <div className="text-[26px] font-black text-slate-900 dark:text-white leading-none tracking-tight">
                {(trafficData?.totalVisits ?? visitorStats?.totalVisits ?? 0).toLocaleString()}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-1.5 flex items-center gap-1">
                <span>Cumulative across all platforms</span>
              </div>
            </div>

            {/* Today Visits */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Visitors Today</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-black">📈</span>
              </div>
              <div className="text-[26px] font-black text-emerald-600 dark:text-emerald-400 leading-none tracking-tight">
                {(trafficData?.todayVisits ?? visitorStats?.todayVisits ?? 0).toLocaleString()}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-1.5">
                Activity in the last 24 hours
              </div>
            </div>

            {/* Users */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Users</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-black">👤</span>
              </div>
              <div className="text-[26px] font-black text-slate-900 dark:text-white leading-none tracking-tight">
                {(trafficData?.uniqueVisitors ?? visitorStats?.uniqueVisitors ?? 0).toLocaleString()}
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-1.5">
                Distinct devices & staff accounts
              </div>
            </div>
          </div>

          {/* Division Traffic Breakdown */}
          {trafficData?.divisionBreakdown && trafficData.divisionBreakdown.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-black text-slate-900 dark:text-white">🏢 Traffic by Division</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Distribution of visits across organizational departments</p>
                </div>
                <button
                  type="button"
                  onClick={fetchTraffic}
                  disabled={loadingTraffic}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {loadingTraffic ? 'Refreshing...' : '🔄 Refresh'}
                </button>
              </div>

              <div className="space-y-2 pt-1">
                {trafficData.divisionBreakdown.map(item => {
                  const maxCount = Math.max(...trafficData.divisionBreakdown.map(d => d.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.division} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-700 dark:text-slate-300">{item.division}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{item.count} visits</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Visitor Activity Log */}
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-black text-slate-900 dark:text-white">🕒 Recent Visitor Logs</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Real-time log of latest platform visits</p>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Latest {trafficData?.recentVisits?.length || 0}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-80 overflow-y-auto">
              {trafficData?.recentVisits?.map(v => (
                <div key={v.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs shrink-0 font-bold text-slate-600 dark:text-slate-300">
                      👤
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{v.username}</div>
                      <div className="text-[10px] text-slate-400 truncate">{v.division}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-medium text-slate-400 shrink-0">
                    {new Date(v.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              ))}
              {(!trafficData?.recentVisits || trafficData.recentVisits.length === 0) && (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No visits recorded yet today.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════ QUIZ QUESTIONS ════════ */}
      {activeSection === 'questions' && (
        <div className="space-y-4">
          {/* Month picker */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm">
            <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Managing Month
            </label>
            <div className="w-full">
              <input 
                type="month" 
                min="2026-01" 
                value={selectedMonth} 
                onChange={e => {
                  const val = e.target.value;
                  if (val && val < '2026-01') {
                    setSelectedMonth('2026-01');
                    return;
                  }
                  setSelectedMonth(val);
                }} 
                className="w-full box-border block px-3.5 py-2.5 rounded-xl border text-sm font-mono dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" 
              />
            </div>
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

      {/* ════════ GLOSSARY / CORPORATE PERFORMANCE ════════ */}
      {activeSection === 'glossary' && (
        <div className="space-y-5">
          {/* Sub-Tab Navigation: Performance Card Studio vs Terminology Dictionary */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setDictSubTab('corporate');
                setGCategoryFilter('All');
                if (!gEditId) {
                  setGTerm('');
                  setGDesc('');
                  setGFormula('area');
                  setGYAxisFormat('in %');
                  setGCat('Corporate Performance');
                  setGChartData([]);
                }
              }}
              className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
                dictSubTab === 'corporate'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>📈</span>
              <span className="truncate">Performance Cards</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                dictSubTab === 'corporate' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {glossaryTerms.filter(t => {
                  let c = [];
                  try { c = t.chartData ? JSON.parse(t.chartData) : []; } catch(e) {}
                  return t.category === 'Corporate Performance' || c.length > 0;
                }).length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDictSubTab('dictionary');
                if (gCat === 'Corporate Performance') setGCat('IBR Framework');
                if (gCategoryFilter === 'Corporate Performance') setGCategoryFilter('All');
                if (!gEditId) {
                  setGTerm('');
                  setGDesc('');
                  setGFull('');
                  setGFormula('');
                  setGNotations('');
                  setGMeanings('');
                  setGChartData([]);
                }
              }}
              className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
                dictSubTab === 'dictionary'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>📚</span>
              <span className="truncate">Dictionary Terms</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                dictSubTab === 'dictionary' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {glossaryTerms.filter(t => {
                  let c = [];
                  try { c = t.chartData ? JSON.parse(t.chartData) : []; } catch(e) {}
                  return t.category !== 'Corporate Performance' && c.length === 0;
                }).length}
              </span>
            </button>
          </div>

          {/* ──── SUB-TAB HEADER & PRIMARY ACTIONS TOOLBAR ──── */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-black text-slate-900 dark:text-white">
                  {dictSubTab === 'corporate' ? 'Performance KPI Cards' : 'Dictionary Terminology'}
                </h2>
                <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                  {dictSubTab === 'corporate'
                    ? glossaryTerms.filter(t => {
                        let c = [];
                        try { c = t.chartData ? JSON.parse(t.chartData) : []; } catch(e) {}
                        return t.category === 'Corporate Performance' || c.length > 0;
                      }).length
                    : glossaryTerms.filter(t => {
                        let c = [];
                        try { c = t.chartData ? JSON.parse(t.chartData) : []; } catch(e) {}
                        return t.category !== 'Corporate Performance' && c.length === 0;
                      }).length} items
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {dictSubTab === 'corporate'
                  ? 'Manage executive KPI cards with multi-year historical trend charts'
                  : 'Manage definitions, formulas, and acronyms across energy frameworks'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (showForm) {
                    cancelEditGlossaryTerm();
                  } else {
                    setGEditId(null);
                    setGTerm('');
                    setGDesc('');
                    setGFull('');
                    setGFormula(dictSubTab === 'corporate' ? 'area' : '');
                    setGYAxisFormat('in %');
                    setGCat(dictSubTab === 'corporate' ? 'Corporate Performance' : 'IBR Framework');
                    setGChartData([]);
                    setShowForm(true);
                  }
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                  showForm
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                <span>{showForm ? '✕ Close Form' : (dictSubTab === 'corporate' ? '+ Create New Card' : '+ Add New Term')}</span>
              </button>
            </div>
          </div>

          {/* ──── CONDITIONAL FORM (ONLY VISIBLE ON ADD OR EDIT) ──── */}
          {showForm && (
            dictSubTab === 'corporate' ? (
              <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/20 shadow-md space-y-4 animate-slideDown">
                {/* Form Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {gEditId ? `Editing Card #${gEditId}` : 'New Card Creator'}
                    </span>
                    <h3 className="text-[16px] font-black text-slate-900 dark:text-white">
                      {gEditId ? `Edit: ${gTerm || 'Card'}` : 'Create Performance Card'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={cancelEditGlossaryTerm}
                    className="py-1 px-2.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold"
                  >
                    ✕ Close
                  </button>
                </div>

              {/* Fast Presets Selector */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Quick Metric Templates / Presets</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Click any chip below to load complete 2022–2026 historical data</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.keys(DEFAULT_HISTORICAL_METRICS).map(k => {
                    const isSelected = (gTerm || '').trim().toUpperCase() === k.toUpperCase();
                    return (
                      <button
                        type="button"
                        key={k}
                        onClick={() => loadPreset(k)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-600'
                        }`}
                      >
                        {k}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Form */}
              <form onSubmit={addGlossaryTerm} className="space-y-3.5">
                {/* Card Name & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                      Card Name <span className="text-emerald-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. EPSB REVENUE, EBIT, FINANCIAL PERFORMANCE"
                      className="w-full p-3 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={gTerm}
                      onChange={e => setGTerm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                      Category <span className="text-emerald-500">*</span>
                    </label>
                    <select
                      value={gCat}
                      onChange={e => setGCat(e.target.value)}
                      className="w-full p-3 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Corporate Performance">Corporate Performance</option>
                      <option value="EPSB">EPSB</option>
                      <option value="BDV">BDV</option>
                      <option value="ESG">ESG</option>
                      <option value="IBR Framework">IBR Framework</option>
                      <option value="Strategy and Sustainability">Strategy & Sustainability</option>
                      <option value="Energy Market and Industry">Energy Market & Industry</option>
                      <option value="Governance">Governance</option>
                      <option value="ISO Management">ISO Management</option>
                      <option value="SE Risk">Sabah Electricity Risk</option>
                      <option value="ReSET2030">ReSET2030</option>
                    </select>
                  </div>
                </div>

                {/* Y-Axis Unit & Chart Type Row (2 Equal Columns) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                      Chart Type
                    </label>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setGFormula('area')}
                        className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
                          (gFormula || 'area') === 'area'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        📈 Area
                      </button>
                      <button
                        type="button"
                        onClick={() => setGFormula('bar')}
                        className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
                          gFormula === 'bar'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        📊 Bar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                      Unit / Format
                    </label>
                    <select 
                      value={['in %', 'in RM', 'in RM mil', 'in RM bil', 'in mins', 'in LTIFR', 'in GWh'].includes(gYAxisFormat) ? gYAxisFormat : 'custom'} 
                      onChange={e => {
                        if (e.target.value !== 'custom') setGYAxisFormat(e.target.value);
                        else setGYAxisFormat('');
                      }}
                      className="w-full p-2.5 rounded-xl border text-sm font-semibold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="in %">in % (Percentage)</option>
                      <option value="in RM">in RM (Ringgit)</option>
                      <option value="in RM mil">in RM mil (Million)</option>
                      <option value="in RM bil">in RM bil (Billion)</option>
                      <option value="in mins">in mins (Minutes)</option>
                      <option value="in LTIFR">in LTIFR (Safety)</option>
                      <option value="in GWh">in GWh (Energy)</option>
                      <option value="custom">Custom Format...</option>
                    </select>
                  </div>
                </div>

                {/* Custom unit input if selected */}
                {!['in %', 'in RM', 'in RM mil', 'in RM bil', 'in mins', 'in LTIFR', 'in GWh'].includes(gYAxisFormat) && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-700 dark:text-slate-300">Custom Unit Text</label>
                    <input 
                      type="text" 
                      placeholder="e.g. in count, in MW, in hours" 
                      value={gYAxisFormat} 
                      onChange={e => setGYAxisFormat(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600" 
                    />
                  </div>
                )}

                {/* Subtitle / Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-700 dark:text-slate-300">Card Subtitle / Context *</label>
                  <textarea
                    required
                    placeholder="Short description or formula context (e.g. Total Revenue contribution from Sabah electricity operations...)"
                    rows={2}
                    className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium"
                    value={gDesc}
                    onChange={e => setGDesc(e.target.value)}
                  />
                </div>

                {/* ──── Multi-Year Historical Data Editor ──── */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[13px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span>📅</span>
                      <span>Multi-Year Historical Trend Data (from 2022)</span>
                    </h3>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {gChartData.length} total monthly values
                    </span>
                  </div>

                  {/* Year Tabs */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['2022','2023','2024','2025','2026','2027','2028','2029','2030'].map(y => {
                      const count = gChartData.filter(d => String(d.year) === y).length;
                      const hasData = count > 0;
                      return (
                        <button
                          type="button"
                          key={y}
                          onClick={() => setCYear(y)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border flex items-center gap-1.5 ${
                            cYear === y 
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30 font-black' 
                              : hasData 
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100' 
                                : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{y}</span>
                          {hasData && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                              cYear === y ? 'bg-emerald-700 text-white' : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {count}m
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Month Grid & Quick Tools for Selected Year */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="bg-slate-100 dark:bg-slate-700/60 px-3 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-black text-slate-800 dark:text-slate-100">
                          {cYear} Monthly Values
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          ({gChartData.filter(d => String(d.year) === String(cYear)).length}/12 populated)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const text = prompt(`Paste 12 comma-separated numbers for ${cYear} Jan–Dec:\n(e.g. 10.5, 11.2, 12.0, 11.8, 13.5, 14.2, 14.8, 15.0, 15.6, 16.2, 16.5, 17.0)`);
                            if (!text) return;
                            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            const vals = text.split(/[,;\t\n]+/).map(v => v.trim()).filter(v => v !== '');
                            setGChartData(prev => {
                              const copy = prev.filter(d => String(d.year) !== String(cYear));
                              vals.forEach((v, i) => {
                                if (i < 12 && !isNaN(parseFloat(v))) {
                                  copy.push({ month: months[i], year: cYear, value: parseFloat(v) });
                                }
                              });
                              return copy;
                            });
                          }}
                          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                        >
                          📋 Paste 12
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const val = prompt(`Fill all 12 months of ${cYear} with a constant value:`);
                            if (val === null || val.trim() === '' || isNaN(parseFloat(val))) return;
                            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            setGChartData(prev => {
                              const copy = prev.filter(d => String(d.year) !== String(cYear));
                              months.forEach(m => copy.push({ month: m, year: cYear, value: parseFloat(val) }));
                              return copy;
                            });
                          }}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
                        >
                          ⚡ Fill All
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const startStr = prompt(`Generate linear trend for ${cYear}.\nEnter Jan start value:`);
                            if (startStr === null || isNaN(parseFloat(startStr))) return;
                            const endStr = prompt(`Enter Dec end value:`);
                            if (endStr === null || isNaN(parseFloat(endStr))) return;
                            const start = parseFloat(startStr);
                            const end = parseFloat(endStr);
                            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            setGChartData(prev => {
                              const copy = prev.filter(d => String(d.year) !== String(cYear));
                              months.forEach((m, idx) => {
                                const interpolated = start + ((end - start) / 11) * idx;
                                copy.push({ month: m, year: cYear, value: Math.round(interpolated * 100) / 100 });
                              });
                              return copy;
                            });
                          }}
                          className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 px-2 py-1 rounded-lg transition-colors border border-purple-200 dark:border-purple-800"
                        >
                          📈 Trend
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const nextY = String(Number(cYear) + 1);
                            const currentVals = gChartData.filter(d => String(d.year) === String(cYear));
                            if (currentVals.length === 0) {
                              alert(`No data in ${cYear} to copy.`);
                              return;
                            }
                            if (!confirm(`Copy all ${currentVals.length} months from ${cYear} to ${nextY}?`)) return;
                            setGChartData(prev => {
                              const copy = prev.filter(d => String(d.year) !== nextY);
                              currentVals.forEach(d => {
                                copy.push({ month: d.month, year: nextY, value: d.value });
                              });
                              return copy;
                            });
                            setCYear(nextY);
                          }}
                          className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors border border-amber-200 dark:border-amber-800"
                        >
                          ⏩ Copy to Next Year
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (gChartData.filter(d => String(d.year) === String(cYear)).length === 0) return;
                            if (!confirm(`Clear all data points for ${cYear}?`)) return;
                            setGChartData(prev => prev.filter(d => String(d.year) !== String(cYear)));
                          }}
                          className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                        >
                          🗑 Clear
                        </button>
                      </div>
                    </div>

                    {/* Unit Context & Guidance Banner */}
                    <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                          Active Unit:
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-extrabold text-[11px]">
                          {gYAxisFormat || 'in %'}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                        {gYAxisFormat?.toLowerCase().includes('%')
                          ? 'Values represent percentages (e.g. 85.5 = 85.5%)'
                          : gYAxisFormat?.toLowerCase().includes('mil')
                            ? 'Values represent Millions (e.g. 240.5 = RM 240.5 Mil)'
                            : gYAxisFormat?.toLowerCase().includes('bil')
                              ? 'Values represent Billions (e.g. 1.25 = RM 1.25 Bil)'
                              : `Values are formatted as ${gYAxisFormat || 'numeric units'}`}
                      </span>
                    </div>

                    {/* 12 Month Grid - 3 cols on mobile, 4 on tablet, 6 on desktop */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
                      {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => {
                        const existing = gChartData.find(d => d.month === m && String(d.year) === String(cYear));
                        const val = existing !== undefined && existing.value !== undefined ? String(existing.value) : '';
                        
                        // Compute clean unit suffix
                        let unitBadge = '';
                        const fmt = (gYAxisFormat || '').toLowerCase();
                        if (fmt.includes('%')) unitBadge = '%';
                        else if (fmt.includes('mil')) unitBadge = 'M';
                        else if (fmt.includes('bil')) unitBadge = 'B';
                        else if (fmt.includes('rm')) unitBadge = 'RM';
                        else if (fmt.includes('min')) unitBadge = 'm';
                        else if (fmt.includes('mw')) unitBadge = 'MW';
                        else if (fmt.includes('gwh')) unitBadge = 'GWh';
                        else if (fmt.includes('ltifr')) unitBadge = 'LTIFR';

                        return (
                          <div key={m} className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1.5 shadow-sm focus-within:border-emerald-500 transition-all">
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-black uppercase tracking-wider ${val ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                {m}
                              </span>
                              {unitBadge && (
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                                  {unitBadge}
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                placeholder="0.00"
                                value={val}
                                onChange={e => {
                                  const v = e.target.value;
                                  setGChartData(prev => {
                                    const copy = [...prev];
                                    const idx = copy.findIndex(d => d.month === m && String(d.year) === String(cYear));
                                    if (v === '' || isNaN(parseFloat(v))) {
                                      if (idx >= 0) copy.splice(idx, 1);
                                    } else {
                                      if (idx >= 0) {
                                        copy[idx] = { ...copy[idx], value: parseFloat(v) };
                                      } else {
                                        copy.push({ month: m, year: cYear, value: parseFloat(v) });
                                      }
                                    }
                                    return copy;
                                  });
                                }}
                                className={`w-full box-border block text-right pr-2 pl-2 py-1.5 rounded-lg border text-[12px] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
                                  val 
                                    ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200' 
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Multi-Year Data Coverage Chips */}
                  {(() => {
                    const yearsWithData = [...new Set(gChartData.map(d => String(d.year)))].sort();
                    if (yearsWithData.length === 0) return null;
                    return (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Years Available in Dataset</span>
                        <div className="flex flex-wrap gap-1.5">
                          {yearsWithData.map(y => {
                            const entries = gChartData.filter(d => String(d.year) === y);
                            return (
                              <button
                                type="button"
                                key={y}
                                onClick={() => setCYear(y)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border flex items-center gap-1 ${
                                  cYear === y 
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                }`}
                              >
                                <span>{y}:</span>
                                <span className={cYear === y ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400 font-extrabold'}>{entries.length} mos</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Live Interactive Chart Preview */}
                  {gChartData.length > 0 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <span>👁️</span>
                          <span>Live Interactive Card Preview</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Test year switcher before saving</span>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
                        <CorporatePerformanceChart 
                          chartData={JSON.stringify(gChartData)} 
                          term={gTerm || 'PREVIEW METRIC'} 
                          description={gDesc || 'Interactive preview of card as seen on Corporate Performance tab'} 
                          yAxisFormat={gYAxisFormat}
                          formula={gFormula || 'area'}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Action Buttons */}
                <div className="flex gap-2.5 pt-2">
                  {gEditId && (
                    <button 
                      type="button" 
                      onClick={cancelEditGlossaryTerm} 
                      className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl active:scale-95 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="flex-[2] py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                  >
                    <span>{gEditId ? '💾' : '➕'}</span>
                    <span>{gEditId ? `Update Card (${gTerm})` : '+ Create Performance Card'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ──── TAB 2: TERMINOLOGY DICTIONARY ──── */
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/20 shadow-md space-y-4 animate-slideDown">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {gEditId ? `Editing Term #${gEditId}` : 'New Term Creator'}
                  </span>
                  <h3 className="text-[16px] font-black text-slate-900 dark:text-white">
                    {gEditId ? `Edit: ${gTerm || 'Term'}` : 'Add New Dictionary Term'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={cancelEditGlossaryTerm}
                  className="py-1 px-2.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>
              <form onSubmit={addGlossaryTerm} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    required 
                    placeholder="Acronym / Term (e.g. IBR, OPEX, WACC)" 
                    className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold" 
                    value={gTerm} 
                    onChange={e => setGTerm(e.target.value)} 
                  />
                  <select 
                    value={gCat} 
                    onChange={e => setGCat(e.target.value)} 
                    className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="IBR Framework">IBR Framework</option>
                    <option value="Strategy and Sustainability">Strategy & Sustainability</option>
                    <option value="Energy Market and Industry">Energy Market & Industry</option>
                    <option value="ESG">ESG</option>
                    <option value="EPSB">EPSB</option>
                    <option value="BDV">BDV</option>
                    <option value="Governance">Governance</option>
                    <option value="ISO Management">ISO Management</option>
                    <option value="SE Risk">Sabah Electricity Risk</option>
                    <option value="ReSET2030">ReSET2030</option>
                  </select>
                </div>
                <input 
                  required 
                  placeholder="Full name (e.g. Incentive-Based Regulation)" 
                  className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  value={gFull} 
                  onChange={e => setGFull(e.target.value)} 
                />
                <textarea 
                  required 
                  placeholder="Comprehensive description / explanation..." 
                  rows={3} 
                  className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                  value={gDesc} 
                  onChange={e => setGDesc(e.target.value)} 
                />
                <input 
                  placeholder="Formula (e.g. ROI = Net Profit / Cost)" 
                  className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono" 
                  value={gFormula} 
                  onChange={e => setGFormula(e.target.value)} 
                />
                <input 
                  placeholder="Formula Notations (e.g. AAT, REQT)" 
                  className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono" 
                  value={gNotations} 
                  onChange={e => setGNotations(e.target.value)} 
                />
                <textarea 
                  placeholder="Meaning of terms (e.g. AAT: Actual Tariff...)" 
                  rows={3} 
                  className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                  value={gMeanings} 
                  onChange={e => setGMeanings(e.target.value)} 
                />

                <div className="flex gap-2 pt-2">
                  {gEditId && (
                    <button 
                      type="button" 
                      onClick={cancelEditGlossaryTerm} 
                      className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="flex-[2] py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {gEditId ? 'Update Term' : '+ Add Term'}
                  </button>
                </div>
              </form>
            </div>
          ))}

          {/* Floating Toast Notification */}
          {gMsg && (
            <div 
              className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] px-4 py-2.5 rounded-2xl shadow-2xl font-bold text-[12px] sm:text-[13px] flex items-center justify-center gap-2 border text-center transition-all animate-fadeIn ${
                gMsg.includes('❌') || gMsg.toLowerCase().includes('fail') || gMsg.toLowerCase().includes('error')
                  ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/40'
                  : 'bg-slate-900/95 dark:bg-emerald-950/95 text-white border-emerald-500/50 shadow-xl backdrop-blur-md'
              }`}
            >
              <span>{gMsg}</span>
            </div>
          )}

          {/* ──── CARDS & TERMS REPOSITORY LIST ──── */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder={dictSubTab === 'corporate' ? "Search corporate cards..." : "Search glossary terms..."}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  value={gFilter} 
                  onChange={e => setGFilter(e.target.value)} 
                />
              </div>
              <select 
                className="p-2.5 rounded-xl border text-sm font-semibold dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" 
                value={gCategoryFilter} 
                onChange={e => setGCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Corporate Performance">Corporate Performance</option>
                <option value="IBR Framework">IBR Framework</option>
                <option value="Strategy and Sustainability">Strategy & Sustainability</option>
                <option value="Energy Market and Industry">Energy Market & Industry</option>
                <option value="ESG">ESG</option>
                <option value="EPSB">EPSB</option>
                <option value="BDV">BDV</option>
                <option value="Governance">Governance</option>
                <option value="ISO Management">ISO Management</option>
                <option value="SE Risk">Sabah Electricity Risk</option>
                <option value="ReSET2030">ReSET2030</option>
              </select>
            </div>
            
            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
              {(() => {
                const filtered = glossaryTerms.filter(t => {
                  let parsedChart = [];
                  try { parsedChart = t.chartData ? JSON.parse(t.chartData) : []; } catch(e) { parsedChart = []; }
                  const isPerfCard = t.category === 'Corporate Performance' || (parsedChart && parsedChart.length > 0);
                  
                  if (dictSubTab === 'corporate' && !isPerfCard) return false;
                  if (dictSubTab === 'dictionary' && isPerfCard) return false;

                  const matchSearch = (t.term || '').toLowerCase().includes(gFilter.toLowerCase()) || ((t.fullName || '') && t.fullName.toLowerCase().includes(gFilter.toLowerCase()));
                  const matchCategory = gCategoryFilter === 'All' ? true : t.category === gCategoryFilter;
                  return matchSearch && matchCategory;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      No matching {dictSubTab === 'corporate' ? 'performance cards' : 'terms'} found.
                    </div>
                  );
                }

                return filtered.map(t => {
                  let parsedChart = [];
                  try { parsedChart = t.chartData ? JSON.parse(t.chartData) : []; } catch(e) { parsedChart = []; }
                  const yearsWithData = [...new Set(parsedChart.map(d => String(d.year)))].sort();
                  const isPerfCard = t.category === 'Corporate Performance' || (parsedChart && parsedChart.length > 0);

                  return (
                    <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-3 shadow-sm hover:border-emerald-500/50 transition-all">
                      <div className="flex gap-3 items-start">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-[13px] font-mono shrink-0 shadow-sm ${
                          isPerfCard 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
                            : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {t.term.length > 5 ? t.term.slice(0, 3) : t.term}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="font-extrabold text-[15px] text-slate-900 dark:text-white">{t.term}</p>
                            <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold uppercase">
                              {t.category}
                            </span>
                            {isPerfCard && (
                              <span className="text-[9px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full font-bold">
                                {t.formula === 'bar' ? '📊 Bar' : '📈 Area'}
                              </span>
                            )}
                            {t.formulaNotations && (
                              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                {t.formulaNotations}
                              </span>
                            )}
                          </div>
                          {t.fullName && <p className="text-[12px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">{t.fullName}</p>}
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{t.description}</p>
                          
                          {/* Historical years badge */}
                          {isPerfCard && yearsWithData.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-[10px] text-slate-400 font-bold">Years:</span>
                              <div className="flex flex-wrap gap-1">
                                {yearsWithData.map(y => (
                                  <span key={y} className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {y}
                                  </span>
                                ))}
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                  {parsedChart.length} pts
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-1 shrink-0">
                          <button 
                            onClick={() => editGlossaryTerm(t)} 
                            title="Edit Card" 
                            className="text-blue-600 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 p-2 rounded-xl transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          {isPerfCard && (
                            <button 
                              onClick={() => duplicateGlossaryTerm(t)} 
                              title="Duplicate Card" 
                              className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 p-2 rounded-xl transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                            </button>
                          )}
                          <button 
                            onClick={() => deleteGlossaryTerm(t.id)} 
                            title="Delete Card" 
                            className="text-red-500 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 p-2 rounded-xl transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>

                      {/* Interactive chart display for performance cards */}
                      {isPerfCard && parsedChart.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                          <CorporatePerformanceChart 
                            chartData={t.chartData} 
                            term={t.term} 
                            description={t.description || t.desc} 
                            yAxisFormat={t.formulaNotations} 
                            formula={t.formula || 'area'}
                          />
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
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

              {iMsg && (
                <div className={`text-sm font-semibold px-3 py-2 rounded-xl transition-all ${
                  iMsg.startsWith('✅') 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                    : iMsg.startsWith('⏳')
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                }`}>
                  {iMsg}
                </div>
              )}
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={iPosting} 
                  className={`flex-1 py-3 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 ${
                    iPosting 
                      ? 'bg-emerald-400 cursor-not-allowed opacity-75' 
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600'
                  }`}
                >
                  {iPosting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <span>{iEditId ? 'Update Poster' : 'Post Poster'}</span>
                  )}
                </button>
                {iEditId && (
                  <button type="button" onClick={cancelEditInfographic} disabled={iPosting} className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl active:scale-95 transition-all shadow-sm">
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
