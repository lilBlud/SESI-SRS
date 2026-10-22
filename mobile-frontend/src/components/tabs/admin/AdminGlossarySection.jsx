import React, { useState } from 'react';
import { CorporatePerformanceChart, getYAxisUnit } from '../../ui';
import { DEFAULT_HISTORICAL_METRICS } from '../../../data/historicalPerformanceData';
import { supabase } from '../../../utils/supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function AdminGlossarySection({
  glossaryTerms,
  onRefreshGlossary,
  onGlossaryChange
}) {
  const [dictSubTab, setDictSubTab] = useState('corporate'); // 'corporate' | 'dictionary'
  const [gTerm, setGTerm] = useState('');
  const [gFull, setGFull] = useState('');
  const [gDesc, setGDesc] = useState('');
  const [gFormula, setGFormula] = useState('area');
  const [gNotations, setGNotations] = useState('');
  const [gMeanings, setGMeanings] = useState('');
  const [gCat, setGCat] = useState('Corporate Performance');
  const [gChartData, setGChartData] = useState([]); // Array of {month, year, value}
  const [gYAxisFormat, setGYAxisFormat] = useState('in %');
  const [cYear, setCYear] = useState('2026');
  const [gMsg, setGMsg] = useState('');
  const [gEditId, setGEditId] = useState(null);
  const [gFilter, setGFilter] = useState('');
  const [gCategoryFilter, setGCategoryFilter] = useState('All');
  const [syncingData, setSyncingData] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isPerfStudio = dictSubTab === 'corporate';

  const addGlossaryTerm = async (e) => {
    e.preventDefault();
    const finalChartData = [...gChartData];

    const supabasePayload = {
      Term: gTerm.trim(),
      FullName: isPerfStudio ? '' : (gFull || ''),
      Description: gDesc || '',
      Formula: isPerfStudio ? (gFormula || 'area') : (gFormula || ''),
      FormulaNotations: isPerfStudio ? (gYAxisFormat || 'in %') : (gNotations || ''),
      FormulaTermMeanings: isPerfStudio ? '' : (gMeanings || ''),
      Category: gCat || (isPerfStudio ? 'Corporate Performance' : 'IBR Framework'),
      ChartData: isPerfStudio && finalChartData.length > 0 ? JSON.stringify(finalChartData) : '',
      CreatedAt: new Date().toISOString()
    };

    let directSuccess = false;
    try {
      if (gEditId) {
        const { error } = await supabase
          .from('GlossaryTerms')
          .update(supabasePayload)
          .eq('Id', gEditId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('GlossaryTerms')
          .insert([supabasePayload]);
        if (error) throw error;
      }
      directSuccess = true;
    } catch (sbErr) {
      console.warn("Direct Supabase glossary post error, trying API fallback:", sbErr);
    }

    if (directSuccess) {
      setGMsg(gEditId ? '✅ Card updated successfully!' : '✅ New card created successfully!');
      onRefreshGlossary();
      if (onGlossaryChange) onGlossaryChange();
      cancelEditGlossaryTerm();
    } else if (API_BASE) {
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
      try {
        let res;
        if (gEditId) {
          res = await fetch(`${API_BASE}/api/admin/glossary/${gEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          res = await fetch(`${API_BASE}/api/admin/glossary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        if (res && res.ok) {
          setGMsg(gEditId ? '✅ Card updated successfully!' : '✅ New card created successfully!');
          onRefreshGlossary();
          if (onGlossaryChange) onGlossaryChange();
          cancelEditGlossaryTerm();
        } else {
          setGMsg(gEditId ? '❌ Failed to update card' : '❌ Failed to add card');
        }
      } catch {
        setGMsg(gEditId ? '❌ Failed to update card' : '❌ Failed to add card');
      }
    } else {
      setGMsg(gEditId ? '❌ Failed to update card' : '❌ Failed to add card');
    }

    setTimeout(() => setGMsg(''), 3500);
  };

  const editGlossaryTerm = (t) => {
    setGEditId(t.id);
    setGTerm(t.term);
    setGFull(t.fullName || '');
    setGDesc(t.description || '');
    setGFormula(t.formula || 'area');
    setGNotations(t.formulaNotations || '');
    setGMeanings(t.formulaTermMeanings || '');
    setGCat(t.category || 'Corporate Performance');
    setGYAxisFormat(t.formulaNotations || getYAxisUnit(t.term));

    let chart = [];
    try {
      chart = t.chartData ? JSON.parse(t.chartData) : [];
    } catch {
      chart = [];
    }
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
    setGEditId(null);
    setGTerm(`Copy of ${t.term}`);
    setGFull(t.fullName || '');
    setGDesc(t.description || '');
    setGFormula(t.formula || 'area');
    setGNotations(t.formulaNotations || '');
    setGMeanings(t.formulaTermMeanings || '');
    setGCat(t.category || 'Corporate Performance');
    setGYAxisFormat(t.formulaNotations || 'in %');

    let chart = [];
    try {
      chart = t.chartData ? JSON.parse(t.chartData) : [];
    } catch {
      chart = [];
    }
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
    if (
      !confirm(
        'This will synchronize and update all Performance cards with rich historical data from 2022 to 2026 (including EPSB Revenue, Financial Performance, and Technical Performance). Continue?'
      )
    )
      return;
    setSyncingData(true);
    try {
      const keys = Object.keys(DEFAULT_HISTORICAL_METRICS);
      let updatedCount = 0;
      let addedCount = 0;

      for (const key of keys) {
        const tmpl = DEFAULT_HISTORICAL_METRICS[key];
        const existing = glossaryTerms.find(t => (t.term || '').trim().toUpperCase() === key.toUpperCase());
        const targetCat = tmpl.category || (key.includes('EPSB') ? 'EPSB' : 'Corporate Performance');

        const supabasePayload = {
          Term: tmpl.term,
          FullName: '',
          Description: tmpl.description,
          Formula: tmpl.formula || 'area',
          FormulaNotations: tmpl.yAxisFormat,
          FormulaTermMeanings: '',
          Category: targetCat,
          ChartData: JSON.stringify(tmpl.chartData)
        };

        let directSuccess = false;
        try {
          if (existing) {
            const { error } = await supabase
              .from('GlossaryTerms')
              .update(supabasePayload)
              .eq('Id', existing.id);
            if (!error) {
              directSuccess = true;
              updatedCount++;
            }
          } else {
            const { error } = await supabase
              .from('GlossaryTerms')
              .insert([supabasePayload]);
            if (!error) {
              directSuccess = true;
              addedCount++;
            }
          }
        } catch {
          // fallback below
        }

        if (!directSuccess && API_BASE) {
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
            }).catch(() => null);
            updatedCount++;
          } else {
            await fetch(`${API_BASE}/api/admin/glossary`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }).catch(() => null);
            addedCount++;
          }
        }
      }

      onRefreshGlossary();
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
    setGTerm('');
    setGFull('');
    setGDesc('');
    setGFormula('area');
    setGNotations('');
    setGMeanings('');
    if (dictSubTab === 'corporate') {
      setGCat('Corporate Performance');
      setCYear('2026');
    } else {
      setGCat('IBR Framework');
    }
    setGChartData([]);
    setGYAxisFormat('in %');
    setShowForm(false);
  };

  const deleteGlossaryTerm = async (id) => {
    if (!confirm('Delete this card / term?')) return;
    try {
      const { error } = await supabase.from('GlossaryTerms').delete().eq('Id', id);
      if (error) throw error;
    } catch (err) {
      console.warn("Direct Supabase delete glossary failed, trying API:", err);
      if (API_BASE) {
        await fetch(`${API_BASE}/api/admin/glossary/${id}`, { method: 'DELETE' }).catch(() => null);
      }
    }
    onRefreshGlossary();
    if (onGlossaryChange) onGlossaryChange();
  };

  // Filtered lists
  const filteredTerms = glossaryTerms.filter(t => {
    let c = [];
    try {
      c = t.chartData ? JSON.parse(t.chartData) : [];
    } catch {
      c = [];
    }
    const isPerf = t.category === 'Corporate Performance' || c.length > 0;
    if (dictSubTab === 'corporate' && !isPerf) return false;
    if (dictSubTab === 'dictionary' && isPerf) return false;

    if (gCategoryFilter !== 'All' && t.category !== gCategoryFilter) return false;

    if (gFilter) {
      const q = gFilter.toLowerCase();
      const termMatch = (t.term || '').toLowerCase().includes(q);
      const fullMatch = (t.fullName || '').toLowerCase().includes(q);
      const descMatch = (t.description || '').toLowerCase().includes(q);
      return termMatch || fullMatch || descMatch;
    }
    return true;
  });

  const availableCategories = [
    'All',
    ...new Set(
      glossaryTerms
        .filter(t => {
          let c = [];
          try {
            c = t.chartData ? JSON.parse(t.chartData) : [];
          } catch {
            c = [];
          }
          const isPerf = t.category === 'Corporate Performance' || c.length > 0;
          return dictSubTab === 'corporate' ? isPerf : !isPerf;
        })
        .map(t => t.category)
        .filter(Boolean)
    )
  ];

  return (
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
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
              dictSubTab === 'corporate'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {
              glossaryTerms.filter(t => {
                let c = [];
                try {
                  c = t.chartData ? JSON.parse(t.chartData) : [];
                } catch {
                  c = [];
                }
                return t.category === 'Corporate Performance' || c.length > 0;
              }).length
            }
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setDictSubTab('dictionary');
            setGCategoryFilter('All');
            if (!gEditId) {
              setGTerm('');
              setGFull('');
              setGDesc('');
              setGFormula('');
              setGNotations('');
              setGMeanings('');
              setGCat('IBR Framework');
              setGChartData([]);
            }
          }}
          className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
            dictSubTab === 'dictionary'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>📖</span>
          <span className="truncate">Standard Dictionary</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
              dictSubTab === 'dictionary'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {
              glossaryTerms.filter(t => {
                let c = [];
                try {
                  c = t.chartData ? JSON.parse(t.chartData) : [];
                } catch {
                  c = [];
                }
                return t.category !== 'Corporate Performance' && c.length === 0;
              }).length
            }
          </span>
        </button>
      </div>

      {/* Top Banner Actions & One-Click Sync */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => {
            if (showForm && !gEditId) {
              setShowForm(false);
            } else {
              cancelEditGlossaryTerm();
              setShowForm(true);
            }
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs sm:text-sm rounded-xl active:scale-95 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <span>{showForm ? '✕ Close Form' : '+ Add New Card / Term'}</span>
        </button>

        {isPerfStudio && (
          <button
            type="button"
            onClick={syncDefaultHistoricalData}
            disabled={syncingData}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{syncingData ? '⏳ Syncing Data...' : '⚡ Seed 2022–2026 Performance Data'}</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal / Card */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{gEditId ? '✏️ Edit Card' : '✨ Create New Card'}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {isPerfStudio ? 'Performance Card' : 'Standard Term'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isPerfStudio
                  ? 'Build interactive historical graphs with 2022-2026 data points'
                  : 'Define glossary definitions, formulas, and category associations'}
              </p>
            </div>
            <button
              type="button"
              onClick={cancelEditGlossaryTerm}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold hover:bg-slate-200"
            >
              ✕
            </button>
          </div>

          {/* Quick Presets for Performance Cards */}
          {isPerfStudio && !gEditId && (
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                ⚡ Quick Presets (Click to autofill 2022–2026 dataset):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(DEFAULT_HISTORICAL_METRICS).map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => loadPreset(k)}
                    className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-300 hover:text-emerald-700 text-[11px] font-bold rounded-lg transition-all"
                  >
                    + {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={addGlossaryTerm} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Metric / Term Name *
                </label>
                <input
                  required
                  placeholder="e.g. TOTAL REVENUE, EPSB REVENUE..."
                  className="w-full box-border block p-3 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={gTerm}
                  onChange={e => setGTerm(e.target.value)}
                />
              </div>

              {!isPerfStudio && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name (Optional)
                  </label>
                  <input
                    placeholder="e.g. Incentive-Based Regulation"
                    className="w-full box-border block p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={gFull}
                    onChange={e => setGFull(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Category *
                </label>
                <select
                  className="w-full box-border block p-3 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={gCat}
                  onChange={e => setGCat(e.target.value)}
                >
                  <option value="Corporate Performance">Corporate Performance</option>
                  <option value="IBR Framework">IBR Framework</option>
                  <option value="Strategy and Sustainability">Strategy & Sustainability</option>
                  <option value="Energy Market and Industry">Energy Market & Industry</option>
                  <option value="General">General</option>
                  <option value="EPSB">EPSB</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description / Definition
              </label>
              <textarea
                placeholder="Enter description or business meaning..."
                rows={2}
                className="w-full box-border block p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                value={gDesc}
                onChange={e => setGDesc(e.target.value)}
              />
            </div>

            {/* Performance Card Specific Controls */}
            {isPerfStudio && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Chart Type
                    </label>
                    <select
                      className="w-full box-border block p-2.5 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={gFormula}
                      onChange={e => setGFormula(e.target.value)}
                    >
                      <option value="area">Area Chart (Smooth Filled)</option>
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart (Connected Dots)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Y-Axis Unit / Format
                    </label>
                    <input
                      placeholder="e.g. in RM bil, in %, in mins..."
                      className="w-full box-border block p-2.5 rounded-xl border text-sm font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={gYAxisFormat}
                      onChange={e => setGYAxisFormat(e.target.value)}
                    />
                  </div>
                </div>

                {/* Multi-Year Data Grid (2022 to 2026) */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span>📅</span>
                      <span>Monthly Dataset (Year: {cYear})</span>
                    </span>

                    {/* Year Selector Tabs */}
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
                      {['2022', '2023', '2024', '2025', '2026'].map(yr => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setCYear(yr)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                            cYear === yr
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 12 Months Input Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => {
                      const existing = gChartData.find(d => d.month === m && String(d.year) === String(cYear));
                      const val = existing ? existing.value : '';
                      return (
                        <div
                          key={m}
                          className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-xs"
                        >
                          <div className="text-[10px] font-black text-slate-400 mb-1">{m}</div>
                          <input
                            type="number"
                            step="any"
                            placeholder="-"
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
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Years Available in Dataset
                      </span>
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
                              <span
                                className={
                                  cYear === y
                                    ? 'text-emerald-200'
                                    : 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                                }
                              >
                                {entries.length} mos
                              </span>
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
            )}

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

            {gMsg && (
              <div
                className={`text-sm font-semibold px-3.5 py-2.5 rounded-xl text-center ${
                  gMsg.startsWith('✅')
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200'
                }`}
              >
                {gMsg}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1 relative">
          <input
            placeholder={`Search ${isPerfStudio ? 'performance cards' : 'definitions'}...`}
            value={gFilter}
            onChange={e => setGFilter(e.target.value)}
            className="w-full box-border block pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          {gFilter && (
            <button
              onClick={() => setGFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={gCategoryFilter}
          onChange={e => setGCategoryFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border text-xs font-bold dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        >
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>
              Category: {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filteredTerms.map(t => {
          let parsedChart = [];
          try {
            parsedChart = t.chartData ? JSON.parse(t.chartData) : [];
          } catch {
            parsedChart = [];
          }
          const isPerfCard = t.category === 'Corporate Performance' || parsedChart.length > 0;
          const yearsWithData = [...new Set(parsedChart.map(d => String(d.year)))].sort();

          return (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black text-slate-900 dark:text-white">{t.term}</span>
                    {t.fullName && <span className="text-xs text-slate-400 font-medium">({t.fullName})</span>}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {t.category}
                    </span>
                  </div>
                  {t.description && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.description}</p>}

                  {isPerfCard && yearsWithData.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Years:</span>
                      {yearsWithData.map(y => (
                        <span
                          key={y}
                          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          {y}
                        </span>
                      ))}
                      <span className="text-[10px] font-bold text-slate-400">({parsedChart.length} data points)</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => editGlossaryTerm(t)}
                    title="Edit Card"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all text-xs font-bold"
                  >
                    ✏️
                  </button>
                  {isPerfCard && (
                    <button
                      type="button"
                      onClick={() => duplicateGlossaryTerm(t)}
                      title="Duplicate Card"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 transition-all text-xs font-bold"
                    >
                      📋
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteGlossaryTerm(t.id)}
                    title="Delete Card"
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 transition-all text-xs font-bold"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Chart Preview for Performance Cards */}
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
        })}

        {filteredTerms.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            No matching {isPerfStudio ? 'performance cards' : 'definitions'} found.
          </div>
        )}
      </div>
    </div>
  );
}
