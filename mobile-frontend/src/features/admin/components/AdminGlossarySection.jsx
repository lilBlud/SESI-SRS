import React, { useState, useCallback, useMemo } from 'react';
import { getYAxisUnit } from '../../../components/ui';
import { DEFAULT_HISTORICAL_METRICS } from '../../../data/historicalPerformanceData';
import { normalizeGlossaryTerm } from '../../../domain/glossaryModel';
import { saveGlossaryTerm as saveGlossaryTermService, deleteGlossaryTerm as deleteGlossaryTermService } from '../../glossary/glossaryService';
import { AdminGlossaryForm, AdminGlossaryCardList } from './glossary';

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
  const [gChartData, setGChartData] = useState([]);
  const [gYAxisFormat, setGYAxisFormat] = useState('in %');
  const [cYear, setCYear] = useState('2026');
  const [gMsg, setGMsg] = useState('');
  const [gEditId, setGEditId] = useState(null);
  const [gFilter, setGFilter] = useState('');
  const [gCategoryFilter, setGCategoryFilter] = useState('All');
  const [syncingData, setSyncingData] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isPerfStudio = dictSubTab === 'corporate';

  const normalizedTerms = useMemo(
    () => (Array.isArray(glossaryTerms) ? glossaryTerms : []).map(normalizeGlossaryTerm),
    [glossaryTerms],
  );

  const cancelEditGlossaryTerm = useCallback(() => {
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
  }, [dictSubTab]);

  const addGlossaryTerm = useCallback(async (e) => {
    e.preventDefault();
    const finalChartData = [...gChartData];

    const payload = {
      term: gTerm.trim(),
      fullName: isPerfStudio ? '' : (gFull || ''),
      description: gDesc || '',
      formula: isPerfStudio ? (gFormula || 'area') : (gFormula || ''),
      formulaNotations: isPerfStudio ? (gYAxisFormat || 'in %') : (gNotations || ''),
      formulaTermMeanings: isPerfStudio ? '' : (gMeanings || ''),
      category: gCat || (isPerfStudio ? 'Corporate Performance' : 'IBR Framework'),
      chartData: isPerfStudio && finalChartData.length > 0 ? JSON.stringify(finalChartData) : '',
    };

    try {
      await saveGlossaryTermService(payload, gEditId);
      setGMsg(gEditId ? '✅ Card updated successfully!' : '✅ New card created successfully!');
      onRefreshGlossary();
      if (onGlossaryChange) onGlossaryChange();
      cancelEditGlossaryTerm();
    } catch {
      setGMsg(gEditId ? '❌ Failed to update card' : '❌ Failed to add card');
    }

    setTimeout(() => setGMsg(''), 3500);
  }, [gTerm, isPerfStudio, gFull, gDesc, gFormula, gYAxisFormat, gNotations, gMeanings, gCat, gChartData, gEditId, onRefreshGlossary, onGlossaryChange, cancelEditGlossaryTerm]);

  const populateFormFromTerm = (raw, { asCopy = false } = {}) => {
    const t = raw.parsedChartData ? raw : normalizeGlossaryTerm(raw);
    const chart = t.parsedChartData || [];

    setGEditId(asCopy ? null : t.id);
    setGTerm(asCopy ? `Copy of ${t.term}` : t.term);
    setGFull(t.full || '');
    setGDesc(t.desc || '');
    setGFormula(t.formula || 'area');
    setGNotations(t.formulaNotations || '');
    setGMeanings(t.formulaTermMeanings || '');
    setGCat(t.cat || 'Corporate Performance');
    setGYAxisFormat(t.formulaNotations || (asCopy ? 'in %' : getYAxisUnit(t.term)));
    setGChartData(chart);

    if (chart.length > 0) {
      const years = [...new Set(chart.map(d => String(d.year)))].sort();
      setCYear(years[years.length - 1] || '2026');
    }

    if (asCopy) {
      setGMsg(`✅ Duplicating "${t.term}" in category "${t.cat || 'Corporate Performance'}"!`);
      setTimeout(() => setGMsg(''), 4000);
    } else if (t.isPerformanceCard) {
      setDictSubTab('corporate');
      setGCategoryFilter('All');
    } else {
      setDictSubTab('dictionary');
    }

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

    const existing = normalizedTerms.find(t => (t.term || '').trim().toUpperCase() === key.toUpperCase());
    if (existing) {
      setGEditId(existing.id);
      if (existing.cat) setGCat(existing.cat);
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
    ) {
      return;
    }

    setSyncingData(true);
    try {
      const keys = Object.keys(DEFAULT_HISTORICAL_METRICS);
      let updatedCount = 0;
      let addedCount = 0;

      for (const key of keys) {
        const tmpl = DEFAULT_HISTORICAL_METRICS[key];
        const existing = normalizedTerms.find(t => (t.term || '').trim().toUpperCase() === key.toUpperCase());
        const targetCat = tmpl.category || (key.includes('EPSB') ? 'EPSB' : 'Corporate Performance');

        await saveGlossaryTermService(
          {
            term: tmpl.term,
            fullName: '',
            description: tmpl.description,
            formula: tmpl.formula || 'area',
            formulaNotations: tmpl.yAxisFormat,
            formulaTermMeanings: '',
            category: targetCat,
            chartData: JSON.stringify(tmpl.chartData),
          },
          existing?.id ?? null,
        );

        if (existing) updatedCount++;
        else addedCount++;
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

  const deleteGlossaryTerm = async (id) => {
    if (!confirm('Are you sure you want to delete this card / term?')) return;
    try {
      await deleteGlossaryTermService(id);
      setGMsg('🗑️ Card deleted successfully!');
    } catch {
      setGMsg('❌ Failed to delete card');
    }
    setTimeout(() => setGMsg(''), 3500);
    onRefreshGlossary();
    if (onGlossaryChange) onGlossaryChange();
  };

  const corporateCount = useMemo(
    () => normalizedTerms.filter(t => t.isPerformanceCard).length,
    [normalizedTerms],
  );
  const dictionaryCount = normalizedTerms.length - corporateCount;

  const filteredTerms = useMemo(() => {
    const q = gFilter.toLowerCase();
    return normalizedTerms.filter(t => {
      if (dictSubTab === 'corporate' && !t.isPerformanceCard) return false;
      if (dictSubTab === 'dictionary' && t.isPerformanceCard) return false;
      if (gCategoryFilter !== 'All' && t.cat !== gCategoryFilter) return false;
      if (!q) return true;
      return (
        (t.term || '').toLowerCase().includes(q) ||
        (t.full || '').toLowerCase().includes(q) ||
        (t.desc || '').toLowerCase().includes(q)
      );
    });
  }, [normalizedTerms, dictSubTab, gCategoryFilter, gFilter]);

  const availableCategories = useMemo(
    () => [
      'All',
      ...new Set(
        normalizedTerms
          .filter(t => (dictSubTab === 'corporate' ? t.isPerformanceCard : !t.isPerformanceCard))
          .map(t => t.cat)
          .filter(Boolean),
      ),
    ],
    [normalizedTerms, dictSubTab],
  );

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
          className={`flex-1 py-3 lg:py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm lg:text-[15px] transition-all flex items-center justify-center gap-2 ${
            dictSubTab === 'corporate'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>📊</span>
          <span>Corporate Studio</span>
          <span
            className={`text-xs lg:text-[13px] px-2 py-0.5 rounded-full font-bold ml-1 ${
              dictSubTab === 'corporate'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {corporateCount}
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
          className={`flex-1 py-3 lg:py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm lg:text-[15px] transition-all flex items-center justify-center gap-2 ${
            dictSubTab === 'dictionary'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>📖</span>
          <span>Dictionary Terms</span>
          <span
            className={`text-xs lg:text-[13px] px-2 py-0.5 rounded-full font-bold ml-1 ${
              dictSubTab === 'dictionary'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {dictionaryCount}
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
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs sm:text-sm lg:text-base rounded-xl active:scale-95 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <span>{showForm ? '✕ Close Form' : '+ Add New Card / Term'}</span>
        </button>

        {isPerfStudio && (
          <button
            type="button"
            onClick={syncDefaultHistoricalData}
            disabled={syncingData}
            className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm lg:text-[14px] rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="w-full max-w-lg max-h-[92dvh] overflow-y-auto concentric-card surface-depth-3 border-alpha shadow-2xl custom-scrollbar my-auto" onClick={e => e.stopPropagation()}>
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
        onEditTerm={(t) => populateFormFromTerm(t, { asCopy: false })}
        onDuplicateTerm={(t) => populateFormFromTerm(t, { asCopy: true })}
        onDeleteTerm={deleteGlossaryTerm}
      />
    </div>
  );
}
