import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getColor } from '../../utils/constants';
import { recordUserActivity } from '../../services/userService';
import { normalizeGlossaryTerm } from '../../domain/glossaryModel';
import { FutureGenMapModal } from '../../components/modals';
import {
  GlossaryCategoryBar,
  GlossaryFlashcardView,
  GlossaryFutureGenCard,
  GlossaryTermDetailCard
} from './components';

export function GlossaryTab({
  user,
  glossary = [],
  onStreakUpdate,
  activeGlossaryCat,
  setActiveGlossaryCat,
  bookmarkActions,
  isDark = false
}) {
  const { isBookmarked, toggleBookmark } = bookmarkActions || { isBookmarked: () => false, toggleBookmark: () => {} };
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
  const username = user?.fullName || user?.preferredName || user?.email || '';

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return glossary.filter(item => {
      const matchSearch =
        (item.term || '').toLowerCase().includes(s) ||
        (item.full || '').toLowerCase().includes(s) ||
        (item.desc || '').toLowerCase().includes(s);
      const matchCat = cat === 'All' || item.cat === cat;
      return matchSearch && matchCat;
    });
  }, [glossary, search, cat]);

  const catCounts = useMemo(() => {
    const counts = {};
    glossary.forEach(item => {
      counts[item.cat] = (counts[item.cat] || 0) + 1;
    });
    return counts;
  }, [glossary]);

  const activeDetailItem = filtered.find(i => (i.id || i.term) === selectedTermId) || filtered[0] || null;
  const showFutureGenCard = cat === 'BDV';

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

  const triggerActivityRecord = useCallback(async () => {
    try {
      const res = await recordUserActivity(user || username);
      if (res && onStreakUpdate) onStreakUpdate(res.streak, res.recorded);
    } catch {
      // Streak updates are best-effort and non-blocking
    }
  }, [user, username, onStreakUpdate]);

  const recordRead = useCallback((termId) => {
    if (expandedId === termId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(termId);
    setSelectedTermId(termId);
    triggerActivityRecord();
  }, [expandedId, triggerActivityRecord]);

  const handleFlashcardFlip = useCallback(() => {
    setFlipped(prev => {
      if (!prev) triggerActivityRecord();
      return !prev;
    });
  }, [triggerActivityRecord]);

  const activeFlashcard = filtered[Math.min(flashcardIdx, Math.max(0, filtered.length - 1))];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 relative">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Dictionary
          </h1>
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
            Sabah Electricity regulatory terms, formulas, and performance metrics
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Dictionary view mode"
          className="tabs tabs-box flex items-center concentric-pill-group bg-slate-200/90 dark:bg-slate-800/90 surface-depth-2 border-alpha space-x-1 shrink-0 self-start sm:self-auto"
        >
          {[['grid', 'Cards'], ['list', 'List'], ['flashcards', 'Flashcards']].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={viewMode === mode}
              onClick={() => setViewMode(mode)}
              className={`px-3.5 py-1.5 concentric-pill-item text-xs font-bold transition-all ${
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

      {/* Mobile Search & Category Filter Bar */}
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

        <GlossaryCategoryBar
          cat={cat}
          setCat={setCat}
          totalCount={glossary.length}
          catCounts={catCounts}
          variant="pills"
        />
      </div>

      {showFutureGenCard && (
        <GlossaryFutureGenCard onOpenMap={() => setIsFutureGenMapOpen(true)} />
      )}

      {/* Desktop Master-Detail Split View */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 xl:col-span-4 2xl:col-span-3 sticky top-6 space-y-4">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl p-3 shadow-md ring-1 ring-black/5 dark:ring-white/10">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search terms..."
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border-alpha rounded-xl text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
                >
                  ✕
                </button>
              ) : (
                <kbd className="kbd kbd-sm absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-alpha">
                  /
                </kbd>
              )}
            </div>
          </div>

          <GlossaryCategoryBar
            cat={cat}
            setCat={setCat}
            totalCount={glossary.length}
            catCounts={catCounts}
            variant="sidebar"
          />

          <div className="bg-white/90 dark:bg-slate-900/90 surface-depth-1 border-alpha backdrop-blur-2xl rounded-2xl shadow-md overflow-hidden flex flex-col h-[calc(100dvh-340px)] min-h-[400px]">
            <div className="p-3.5 border-b border-alpha flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <span className="text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300">
                Terms in <span className="text-emerald-600 dark:text-emerald-400">{cat}</span>
              </span>
              <span className="text-xs lg:text-[13px] font-bold text-slate-400 tabular-nums">
                {filtered.length} terms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto mask-fade-y divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-1">
              {filtered.map(item => {
                const key = item.id || item.term;
                const isSelected = viewMode === 'flashcards'
                  ? activeFlashcard && (activeFlashcard.id || activeFlashcard.term) === key
                  : activeDetailItem && (activeDetailItem.id || activeDetailItem.term) === key;
                const clr = getColor(item.cat);
                const hasChart = normalizeGlossaryTerm(item).isPerformanceCard;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (viewMode === 'flashcards') {
                        const idx = filtered.findIndex(t => (t.id || t.term) === key);
                        if (idx !== -1) {
                          setFlashcardIdx(idx);
                          setFlipped(false);
                        }
                      } else {
                        recordRead(key);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-150 active:scale-[0.985] flex items-center justify-between group ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm lg:text-[15.5px] font-bold tracking-tight truncate ${isSelected ? 'text-white' : ''}`}>
                          {item.term}
                        </span>
                        {hasChart && (
                          <span className={`shrink-0 text-[10px] lg:text-[11px] font-extrabold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            CHART
                          </span>
                        )}
                      </div>
                      {(item.full && !item.term.includes(' ')) || cat === 'All' ? (
                        <div className="flex items-center gap-2 mt-1 min-w-0">
                          {cat === 'All' && (
                            <span className={`shrink-0 text-[10.5px] font-bold px-2 py-0.5 rounded-md ${
                              isSelected ? 'bg-white/20 text-white' : `${clr.bg} ${clr.text}`
                            }`}>
                              {item.cat}
                            </span>
                          )}
                          {item.full && !item.term.includes(' ') && (
                            <span className={`text-xs truncate ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                              {item.full}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8 2xl:col-span-9 space-y-6">
          {viewMode === 'flashcards' ? (
            <div className="bg-white/90 dark:bg-slate-900/90 surface-depth-1 border-alpha backdrop-blur-2xl concentric-card p-6 sm:p-8 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-alpha">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Study Deck • {cat === 'All' ? 'All Domains' : cat}
                </h2>
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
            <GlossaryTermDetailCard
              item={activeDetailItem}
              variant="desktop"
              bookmarked={isBookmarked(activeDetailItem.id || activeDetailItem.term, 'glossary')}
              onToggleBookmark={toggleBookmark}
            />
          ) : (
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-12 text-center text-slate-400">
              Select a term from the left pane to view details.
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards & Table Views */}
      <div className="lg:hidden">
        {filtered.length === 0 && !showFutureGenCard && (
          <div className="p-8 text-center text-sm font-medium text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            No terms found matching your criteria.
          </div>
        )}

        {viewMode === 'grid' && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(item => {
              const key = item.id || item.term;
              const clr = getColor(item.cat);
              const isExpanded = expandedId === key;
              const isPerfCard = normalizeGlossaryTerm(item).isPerformanceCard;

              return (
                <div
                  key={key}
                  onClick={() => recordRead(key)}
                  className={`bg-white/90 dark:bg-slate-900/90 surface-depth-1 border-alpha backdrop-blur-2xl concentric-card shadow-[0_8px_32px_rgba(0,0,0,0.08)] cursor-pointer transition-all active:scale-[0.99] ${
                    isExpanded ? `ring-2 ${clr.border}` : ''
                  }`}
                >
                  <div className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[15px] text-slate-900 dark:text-white tracking-tight">
                          {item.term}
                          {item.full && !item.term.includes(' ') && (
                            <span className="ml-2 font-medium text-[12.5px] text-slate-500 dark:text-slate-400 tracking-normal">
                              ({item.full})
                            </span>
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

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                      <GlossaryTermDetailCard
                        item={item}
                        variant="compact"
                        bookmarked={isBookmarked(key, 'glossary')}
                        onToggleBookmark={toggleBookmark}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

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
                {filtered.map(item => {
                  const key = item.id || item.term;
                  const clr = getColor(item.cat);
                  return (
                    <tr
                      key={key}
                      onClick={() => recordRead(key)}
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
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 align-top">
                        <GlossaryTermDetailCard
                          item={item}
                          variant="compact"
                          bookmarked={isBookmarked(key, 'glossary')}
                          onToggleBookmark={toggleBookmark}
                          showStreakBadge={false}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Flashcards */}
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

      <FutureGenMapModal
        isOpen={isFutureGenMapOpen}
        onClose={() => setIsFutureGenMapOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
