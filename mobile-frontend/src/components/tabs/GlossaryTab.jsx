import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CATEGORIES, API_BASE, getColor } from '../../utils/constants';
import { CorporatePerformanceChart } from '../ui';
import { recordUserActivityDirect } from '../../utils/supabaseClient';
import { FutureGenMapModal } from '../modals';
import { GlossaryFlashcardView, GlossaryFutureGenCard } from './glossary';

export function GlossaryTab({
  user,
  glossary = [],
  onStreakUpdate,
  activeGlossaryCat,
  setActiveGlossaryCat,
  bookmarkActions,
  isDark = false
}) {
  const { isBookmarked, toggleBookmark } = bookmarkActions || { isBookmarked: () => false, toggleBookmark: () => { } };
  const [search, setSearch] = useState('');
  const cat = activeGlossaryCat || 'All';
  const setCat = (c) => {
    if (setActiveGlossaryCat) setActiveGlossaryCat(c);
  };

  const [viewMode, setViewMode] = useState('grid'); // grid, list, flashcards
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [isFutureGenMapOpen, setIsFutureGenMapOpen] = useState(false);
  const searchInputRef = useRef(null);
  const USERNAME = user?.fullName || "Ahmad Azib Danish";

  // Filter logic
  const filtered = glossary.filter(item => {
    const s = search.toLowerCase();
    const matchSearch =
      (item.term || '').toLowerCase().includes(s) ||
      (item.full || '').toLowerCase().includes(s) ||
      (item.desc || '').toLowerCase().includes(s);
    const matchCat = cat === 'All' || item.cat === cat;
    return matchSearch && matchCat;
  });

  // Selected item for desktop master-detail view
  const activeDetailItem = filtered.find(i => (i.id || i.term) === selectedTermId) || filtered[0] || null;

  // Sync selected term id if current selection is not in filtered list
  useEffect(() => {
    if (filtered.length > 0 && (!selectedTermId || !filtered.some(i => (i.id || i.term) === selectedTermId))) {
      setSelectedTermId(filtered[0].id || filtered[0].term);
    }
  }, [filtered, selectedTermId]);

  // Keyboard shortcut: '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pinned Future Generation Map card visibility: ONLY when BDV category is selected
  const showFutureGenCard = cat === 'BDV';

  // Count per category
  const catCounts = {};
  glossary.forEach(item => {
    catCounts[item.cat] = (catCounts[item.cat] || 0) + 1;
  });

  const triggerActivityRecord = useCallback(async () => {
    try {
      const res = await recordUserActivityDirect(user || USERNAME);
      if (res && onStreakUpdate) onStreakUpdate(res.streak, res.recorded);
    } catch {
      fetch(`${API_BASE}/api/streak/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: USERNAME })
      })
        .then(r => r.ok && r.json())
        .then(data => {
          if (data && onStreakUpdate) onStreakUpdate(data.streak, data.recorded);
        })
        .catch(() => { });
    }
  }, [user, USERNAME, onStreakUpdate]);

  // Record reading activity when user taps a term (streak trigger)
  const recordRead = useCallback((termId) => {
    if (expandedId === termId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(termId);
    setSelectedTermId(termId);
    triggerActivityRecord();
  }, [expandedId, triggerActivityRecord]);

  // Record read for flashcard flip too
  const handleFlashcardFlip = useCallback(() => {
    setFlipped(prev => {
      if (!prev) triggerActivityRecord();
      return !prev;
    });
  }, [triggerActivityRecord]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12 relative">
      {/* ── Top Header & Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Knowledge Repository</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">Dictionary &amp; Directory</h1>
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
            Technical definitions, formulas, acronyms, and corporate performance indices across Sabah
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl space-x-1 shrink-0 self-start sm:self-auto">
          {[['grid', 'Cards'], ['list', 'List'], ['flashcards', 'Flashcards']].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === mode
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search & Filter Bar (Mobile & Compact View) ── */}
      <div className="lg:hidden bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            ref={searchInputRef}
            placeholder="Search acronym, term, or keyword... (/ to focus)"
            className="w-full pl-10 pr-20 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[13.5px] focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-700/80 px-2 py-0.5 rounded-md tabular-nums">
            {filtered.length} terms
          </span>
        </div>

        {/* Category Pills (Mobile) */}
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(c => {
            const isActive = cat === c.key;
            const count = c.key === 'All' ? glossary.length : (catCounts[c.key] || 0);
            const clr = c.key !== 'All' ? getColor(c.key) : null;
            return (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold tracking-tight transition-all flex items-center gap-1 ${
                  isActive
                    ? (clr ? `${clr.pill} text-white shadow-md` : 'bg-emerald-600 text-white shadow-md')
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <div className="w-4 flex items-center justify-center shrink-0">
                  {c.iconImage ? (
                    <img src={c.iconImage} alt={c.label} className="h-4 w-auto object-contain scale-[1.5]" />
                  ) : (
                    <span className="text-[12px]">{c.emoji}</span>
                  )}
                </div>
                {c.label}
                <span className={`text-[9px] ${isActive ? 'opacity-80' : 'opacity-50'}`}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pinned Future Generation Map Card (Only on BDV category) */}
      {showFutureGenCard && (
        <GlossaryFutureGenCard onOpenMap={() => setIsFutureGenMapOpen(true)} />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── DESKTOP MASTER-DETAIL SPLIT VIEW (Visible >= 1024px) ────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Master Pane (col-span-5 or 4, 3 on 2xl): Category List + Search + Terms List ── */}
          <div className="lg:col-span-5 xl:col-span-4 2xl:col-span-3 sticky top-6 space-y-4">
            {/* Search Box */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl p-3 shadow-md ring-1 ring-black/5 dark:ring-white/10">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search terms... (Press / to focus)"
                  className="w-full pl-9 pr-14 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
                  >
                    ✕
                  </button>
                ) : (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500">
                    /
                  </span>
                )}
              </div>
            </div>

            {/* Category Filter Chips / List */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl p-3 shadow-md ring-1 ring-black/5 dark:ring-white/10 max-h-48 overflow-y-auto space-y-1 scrollbar-hide">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Filter By Domain
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {CATEGORIES.map(c => {
                  const isActive = cat === c.key;
                  const count = c.key === 'All' ? glossary.length : (catCounts[c.key] || 0);
                  const clr = c.key !== 'All' ? getColor(c.key) : null;
                  return (
                    <button
                      key={c.key}
                      onClick={() => setCat(c.key)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11.5px] font-bold transition-all text-left truncate ${
                        isActive
                          ? (clr ? `${clr.bg} ${clr.text} ring-1 ${clr.border}` : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30')
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <span className="text-xs">{c.emoji}</span>
                        {c.label}
                      </span>
                      <span className="text-[10px] opacity-70 ml-1 tabular-nums">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Terms List */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-md ring-1 ring-black/5 dark:ring-white/10 overflow-hidden flex flex-col h-[calc(100vh-340px)] min-h-[400px]">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300">
                  Terms in <span className="text-emerald-600 dark:text-emerald-400">{cat}</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                  {filtered.length} terms
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1.5 space-y-0.5">
                {(() => {
                  const safeIdx = Math.min(flashcardIdx, Math.max(0, filtered.length - 1));
                  const activeFlashcard = filtered[safeIdx];
                  return filtered.map(item => {
                    const isSelected = viewMode === 'flashcards'
                      ? activeFlashcard && (activeFlashcard.id || activeFlashcard.term) === (item.id || item.term)
                      : activeDetailItem && (activeDetailItem.id || activeDetailItem.term) === (item.id || item.term);
                    const clr = getColor(item.cat);
                    const hasChart = item.cat === 'Corporate Performance' || (item.chartData && item.chartData.length > 5 && item.chartData !== '[]');

                    return (
                      <button
                        key={item.id || item.term}
                        onClick={() => {
                          if (viewMode === 'flashcards') {
                            const idx = filtered.findIndex(t => (t.id || t.term) === (item.id || item.term));
                            if (idx !== -1) {
                              setFlashcardIdx(idx);
                              setFlipped(false);
                            }
                          } else {
                            recordRead(item.id || item.term);
                          }
                        }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[13px] font-bold tracking-tight truncate ${isSelected ? 'text-white' : ''}`}>
                            {item.term}
                          </span>
                          {hasChart && (
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              CHART
                            </span>
                          )}
                        </div>
                        {item.full && !item.term.includes(' ') && (
                          <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {item.full}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'bg-white/20 text-white' : `${clr.bg} ${clr.text}`
                        }`}>
                          {item.cat}
                        </span>
                      </div>
                    </button>
                  );
                });
              })()}
              </div>
            </div>
          </div>

          {/* ── Right Detail Pane (col-span-7 or 8, 9 on 2xl): Expansive Term Detail or Flashcards ── */}
          <div className="lg:col-span-7 xl:col-span-8 2xl:col-span-9 space-y-6">
            {viewMode === 'flashcards' ? (
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-lg ring-1 ring-black/5 dark:ring-white/10 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Interactive Flashcards
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Study Deck • {cat === 'All' ? 'All Domains' : cat}
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {filtered.length} Cards in Deck
                  </span>
                </div>
                <GlossaryFlashcardView
                  key={`desktop-${cat}-${search}`}
                  filtered={filtered}
                  flashcardIdx={flashcardIdx}
                  setFlashcardIdx={setFlashcardIdx}
                  flipped={flipped}
                  setFlipped={setFlipped}
                  onFlip={handleFlashcardFlip}
                  isBookmarked={isBookmarked}
                  toggleBookmark={toggleBookmark}
                />
              </div>
            ) : activeDetailItem ? (
              (() => {
                const item = activeDetailItem;
                const clr = getColor(item.cat);
                const isPerfCard = item.cat === 'Corporate Performance' || (item.chartData && item.chartData.length > 5 && item.chartData !== '[]');
                const bookmarked = isBookmarked(item.id || item.term, 'glossary');

                return (
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-lg ring-1 ring-black/5 dark:ring-white/10 space-y-6 animate-fadeIn">
                    {/* Detail Card Header */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${clr.bg} ${clr.text} border ${clr.border}`}>
                            {clr.emoji} {item.cat}
                          </span>
                          {isPerfCard && (
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50 flex items-center gap-1">
                              📈 Corporate Performance Metric
                            </span>
                          )}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                          {item.term}
                        </h1>
                        {item.full && (
                          <h2 className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-1">
                            {item.full}
                          </h2>
                        )}
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(item, 'glossary')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all active:scale-95 text-xs font-bold ${
                          bookmarked
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span>{bookmarked ? 'Saved to Bookmarks' : 'Bookmark Term'}</span>
                      </button>
                    </div>

                    {/* Definition */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Formal Definition &amp; Description
                      </div>
                      <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-wrap">
                        {item.desc}
                      </p>
                    </div>

                    {/* Formula Box (if exists) */}
                    {item.formula && item.formula !== 'area' && item.formula !== 'bar' && (
                      <div className={`${clr.bg} border ${clr.border} rounded-2xl p-5 space-y-3`}>
                        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span>📐</span> Mathematical Formula
                        </div>
                        <div className={`text-base font-bold font-mono ${clr.text} p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-black/5 dark:border-white/5`}>
                          {item.formula}
                        </div>
                        {item.formulaNotations && (
                          <div className="text-xs text-slate-600 dark:text-slate-300">
                            <span className="font-bold">Notations: </span>
                            <span>{item.formulaNotations.replace(/\n/g, ', ')}</span>
                          </div>
                        )}
                        {item.formulaTermMeanings && (
                          <div className="pt-2 border-t border-black/5 dark:border-white/5">
                            <div className="text-xs font-bold text-slate-500 mb-1">Term Meanings:</div>
                            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                              {item.formulaTermMeanings.split('\n').map((line, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 font-bold">•</span>
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Corporate Performance Chart */}
                    {isPerfCard && (
                      <div className="space-y-3 pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <span>📊</span> Historical Performance Trend
                        </div>
                        <div className="bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <CorporatePerformanceChart
                            chartData={item.chartData}
                            term={item.term}
                            description=""
                            yAxisFormat={item.formulaNotations || item.yAxisFormat}
                            formula={item.formula}
                          />
                        </div>
                      </div>
                    )}

                    {/* Reading Streak Indicator */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Activity Tracked:</span>
                        <span>Reading this term counts towards your daily learning streak.</span>
                      </div>
                      <span className="text-slate-400 font-medium">SESI Standard</span>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-12 text-center text-slate-400">
                Select a term from the left pane to view details.
              </div>
            )}
          </div>
        </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE VIEW / FALLBACK (Visible on screen < 1024px) ─────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Empty State */}
        {filtered.length === 0 && !showFutureGenCard && (
          <div className="p-8 text-center text-sm font-medium text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            No terms found matching your criteria.
          </div>
        )}

        {/* GRID View — Cards that expand on tap */}
        {viewMode === 'grid' && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((item) => {
              const clr = getColor(item.cat);
              const isExpanded = expandedId === (item.id || item.term);
              const isPerfCard = item.cat === 'Corporate Performance' || (item.chartData && item.chartData.length > 5 && item.chartData !== '[]');

              return (
                <div
                  key={item.id || item.term}
                  onClick={() => recordRead(item.id || item.term)}
                  className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 cursor-pointer transition-all active:scale-[0.99] ${
                    isExpanded ? `ring-2 ${clr.border}` : 'dark:ring-white/10'
                  }`}
                >
                  <div className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[15px] text-slate-900 dark:text-white tracking-tight">
                          {item.term}
                          {item.full && !item.term.includes(' ') && (
                            <span className="ml-2 font-medium text-[12.5px] text-slate-500 dark:text-slate-400 tracking-normal">({item.full})</span>
                          )}
                        </h3>
                        {isPerfCard && (
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50 flex items-center gap-1 tracking-tight">
                            <span>📈</span>
                            <span>Performance Card</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                      <div className="mt-2">
                        {isPerfCard ? (
                          <div className="space-y-2 mt-3 mb-2">
                            <p className="text-[13.5px] text-slate-700 dark:text-slate-300 mb-3 leading-relaxed whitespace-pre-wrap font-normal">{item.desc}</p>
                            <CorporatePerformanceChart
                              chartData={item.chartData}
                              term={item.term}
                              description=""
                              yAxisFormat={item.formulaNotations || item.yAxisFormat}
                              formula={item.formula}
                            />
                          </div>
                        ) : (
                          <p className="text-[13.5px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap font-normal">{item.desc}</p>
                        )}
                      </div>

                      {item.formula && item.formula !== 'area' && item.formula !== 'bar' && (
                        <div className={`mt-3 ${clr.bg} border ${clr.border} rounded-xl p-3`}>
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">📐 Formula</div>
                          <div className={`text-[13px] font-semibold ${clr.text} leading-relaxed`}>
                            {item.formula}
                          </div>
                          {item.formulaTermMeanings && (
                            <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                              <ul className="text-[12.5px] text-slate-700 dark:text-slate-300 mt-0.5 space-y-1 leading-relaxed">
                                {item.formulaTermMeanings.split('\n').map((line, i) => (
                                  <li key={i}>- {line}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                          <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">✓ Read</span>
                          <span>Counts toward your daily streak!</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(item, 'glossary'); }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95 text-xs font-bold ${
                            isBookmarked(item.id || item.term, 'glossary')
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" fill={isBookmarked(item.id || item.term, 'glossary') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          {isBookmarked(item.id || item.term, 'glossary') ? 'Bookmarked' : 'Bookmark'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* LIST View */}
        {viewMode === 'list' && filtered.length > 0 && (
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">Term</th>
                  <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((item) => {
                  const clr = getColor(item.cat);
                  const isPerf = item.cat === 'Corporate Performance' || (item.chartData && item.chartData.length > 5 && item.chartData !== '[]');
                  return (
                    <tr
                      key={item.id || item.term}
                      onClick={() => recordRead(item.id || item.term)}
                      className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 align-top">
                        <div className={`font-bold font-mono ${clr.text}`}>
                          {item.term}
                          {item.full && !item.term.includes(' ') && (
                            <div className="text-[11px] font-sans font-medium text-slate-500 mt-1">{item.full}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 align-top whitespace-pre-wrap">
                        {isPerf ? (
                          <div className="space-y-1 my-2">
                            <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{item.desc}</p>
                            <div className="mt-3">
                              <CorporatePerformanceChart
                                chartData={item.chartData}
                                term={item.term}
                                description=""
                                yAxisFormat={item.formulaNotations || item.yAxisFormat}
                                formula={item.formula}
                              />
                            </div>
                          </div>
                        ) : (
                          item.desc
                        )}
                        {item.formula && item.formula !== 'area' && item.formula !== 'bar' && (
                          <div className={`mt-2 text-[11.5px] font-bold ${clr.text} ${clr.bg} px-2 py-1 rounded-lg`}>
                            📐 {item.formula}
                          </div>
                        )}
                        {item.formulaNotations && (
                          <div className="mt-1 text-[11px] text-slate-500">
                            <span className="font-bold">Notations:</span> <span>{item.formulaNotations.replace(/\n/g, ', ')}</span>
                          </div>
                        )}
                        {item.formulaTermMeanings && (
                          <div className="mt-1 text-[11px] text-slate-500">
                            <span className="font-bold">Meanings:</span> <span className="line-clamp-2">{item.formulaTermMeanings.replace(/\n/g, ' | ')}</span>
                          </div>
                        )}
                        <div className="mt-2 flex">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(item, 'glossary'); }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all active:scale-95 text-[10px] font-bold ${
                              isBookmarked(item.id || item.term, 'glossary')
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <svg className="w-3 h-3" fill={isBookmarked(item.id || item.term, 'glossary') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            {isBookmarked(item.id || item.term, 'glossary') ? 'Saved' : 'Bookmark'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FLASHCARDS View (Mobile Only: on desktop it renders in the right detail pane) */}
      {viewMode === 'flashcards' && (
        <div className="lg:hidden">
          <GlossaryFlashcardView
            key={`mobile-${cat}-${search}`}
            filtered={filtered}
            flashcardIdx={flashcardIdx}
            setFlashcardIdx={setFlashcardIdx}
            flipped={flipped}
            setFlipped={setFlipped}
            onFlip={handleFlashcardFlip}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
          />
        </div>
      )}

      {/* Full-Screen Interactive Future Generation Map Modal */}
      <FutureGenMapModal
        isOpen={isFutureGenMapOpen}
        onClose={() => setIsFutureGenMapOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
