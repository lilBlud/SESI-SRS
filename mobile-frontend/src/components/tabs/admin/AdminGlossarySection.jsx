import React, { useState } from 'react';
import { getYAxisUnit } from '../../ui';
import { DEFAULT_HISTORICAL_METRICS } from '../../../data/historicalPerformanceData';
import { supabase } from '../../../utils/supabaseClient';
import { AdminGlossaryForm, AdminGlossaryCardList } from './glossary';

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
    if (!confirm('Are you sure you want to delete this card / term?')) return;
    let deleted = false;
    try {
      const { error } = await supabase.from('GlossaryTerms').delete().eq('Id', id);
      if (error) throw error;
      deleted = true;
    } catch (err) {
      console.warn("Direct Supabase delete glossary failed, trying API:", err);
      if (API_BASE) {
        try {
          const res = await fetch(`${API_BASE}/api/admin/glossary/${id}`, { method: 'DELETE' });
          if (res.ok) deleted = true;
        } catch {}
      }
    }
    if (deleted) {
      setGMsg('🗑️ Card deleted successfully!');
    } else {
      setGMsg('❌ Failed to delete card');
    }
    setTimeout(() => setGMsg(''), 3500);
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
      const descMatch = (t.description || t.desc || '').toLowerCase().includes(q);
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
    <div className="space-y-4">
      {/* Subtab Segmented Switcher */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
        <button
          type="button"
          onClick={() => {
            setDictSubTab('corporate');
            cancelEditGlossaryTerm();
            setGCat('Corporate Performance');
            setGCategoryFilter('All');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            dictSubTab === 'corporate'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>📊</span>
          <span>Corporate Studio</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
              dictSubTab === 'corporate'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
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
            cancelEditGlossaryTerm();
            setGCat('IBR Framework');
            setGCategoryFilter('All');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            dictSubTab === 'dictionary'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>📖</span>
          <span>Dictionary Terms</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
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

      {/* Action Toast Feedback Banner */}
      {gMsg && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-lg flex items-center justify-between animate-fadeIn sticky top-2 z-40">
          <span>{gMsg}</span>
          <button type="button" onClick={() => setGMsg('')} className="text-white/80 hover:text-white font-bold ml-2 text-sm leading-none">✕</button>
        </div>
      )}

      {/* Add / Edit Form Modal Dialog */}
      {showForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelEditGlossaryTerm();
          }}
        >
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl custom-scrollbar my-auto" onClick={e => e.stopPropagation()}>
            <AdminGlossaryForm
              isPerfStudio={isPerfStudio}
              gEditId={gEditId}
              gTerm={gTerm}
              setGTerm={setGTerm}
              gFull={gFull}
              setGFull={setGFull}
              gCat={gCat}
              setGCat={setGCat}
              gDesc={gDesc}
              setGDesc={setGDesc}
              gFormula={gFormula}
              setGFormula={setGFormula}
              gYAxisFormat={gYAxisFormat}
              setGYAxisFormat={setGYAxisFormat}
              gNotations={gNotations}
              setGNotations={setGNotations}
              gMeanings={gMeanings}
              setGMeanings={setGMeanings}
              gChartData={gChartData}
              setGChartData={setGChartData}
              cYear={cYear}
              setCYear={setCYear}
              gMsg={gMsg}
              onSubmit={addGlossaryTerm}
              onCancel={cancelEditGlossaryTerm}
              onLoadPreset={loadPreset}
            />
          </div>
        </div>
      )}

      {/* Card List with Search & Category Filtering */}
      <AdminGlossaryCardList
        isPerfStudio={isPerfStudio}
        gFilter={gFilter}
        setGFilter={setGFilter}
        gCategoryFilter={gCategoryFilter}
        setGCategoryFilter={setGCategoryFilter}
        availableCategories={availableCategories}
        filteredTerms={filteredTerms}
        onEditTerm={editGlossaryTerm}
        onDuplicateTerm={duplicateGlossaryTerm}
        onDeleteTerm={deleteGlossaryTerm}
      />
    </div>
  );
}
