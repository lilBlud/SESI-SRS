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
      setGMsg(gEditId ? 'Card updated successfully.' : 'New card created successfully.');
      onRefreshGlossary();
      if (onGlossaryChange) onGlossaryChange();
      cancelEditGlossaryTerm();
    } catch {
      setGMsg(gEditId ? 'Failed to update card.' : 'Failed to add card.');
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
      setGMsg(`Duplicating "${t.term}" in category "${t.cat || 'Corporate Performance'}".`);
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
      setGMsg(`Loaded preset "${tmpl.term}" (editing card #${existing.id}).`);
    } else {
      setGEditId(null);
      setGMsg(`Loaded preset "${tmpl.term}" with 2022–2026 historical data.`);
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
      setGMsg(`Synced ${updatedCount} updated and ${addedCount} new 2022–2026 performance cards.`);
    } catch (e) {
      console.error(e);
      setGMsg('Error syncing historical data.');
    } finally {
      setSyncingData(false);
      setTimeout(() => setGMsg(''), 5000);
    }
  };

  const deleteGlossaryTerm = async (id) => {
    if (!confirm('Are you sure you want to delete this card / term?')) return;
    try {
      await deleteGlossaryTermService(id);
      setGMsg('Card deleted.');
    } catch {
      setGMsg('Failed to delete card.');
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
    <div className="space-y-4 animate-fadeIn">
      {/* Studio Mode Switcher & Primary Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex-1 sm:flex-initial">
            <button
              type="button"
              onClick={() => {
                setDictSubTab('corporate');
                cancelEditGlossaryTerm();
                setGCat('Corporate Performance');
                setGCategoryFilter('All');
              }}
              className={`min-h-[38px] flex-1 sm:flex-initial px-4 py-1.5 rounded-lg font-bold text-xs sm:text-[13px] transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2 ${
                dictSubTab === 'corporate'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <span>Corporate Studio</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 tabular-nums font-extrabold">
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
              className={`min-h-[38px] flex-1 sm:flex-initial px-4 py-1.5 rounded-lg font-bold text-xs sm:text-[13px] transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2 ${
                dictSubTab === 'dictionary'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Dictionary Terms</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 tabular-nums font-extrabold">
                {dictionaryCount}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {isPerfStudio && (
              <button
                type="button"
                onClick={syncDefaultHistoricalData}
                disabled={syncingData}
                className="min-h-[40px] px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-xs rounded-xl active:scale-95 transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg className={`w-4 h-4 shrink-0 ${syncingData ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{syncingData ? 'Syncing Data...' : 'Sync 2022–2026 Presets'}</span>
              </button>
            )}

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
              className="min-h-[40px] flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white font-bold text-xs sm:text-[13px] rounded-xl active:scale-95 transition-all inline-flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
              </svg>
              <span>{showForm ? 'Close Editor' : isPerfStudio ? 'Add Performance Card' : 'Add Dictionary Term'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Toast Feedback Banner */}
      {gMsg && (
        <div className="px-4 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-lg flex items-center justify-between animate-fadeIn sticky top-2 z-40">
          <span>{gMsg}</span>
          <button
            type="button"
            onClick={() => setGMsg('')}
            aria-label="Dismiss notification"
            className="text-white/80 hover:text-white p-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
