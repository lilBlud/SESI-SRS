import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORIES, API_BASE, getColor, getCatMeta } from '../../utils/constants';
import { CorporatePerformanceChart } from '../ui';
import { recordUserActivityDirect } from '../../utils/supabaseClient';
import { FutureGenMapModal } from '../modals';
import { GlossaryFlashcardView, GlossaryFutureGenCard } from './glossary';

export function GlossaryTab({
  user,
  glossary,
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
  const [isFutureGenMapOpen, setIsFutureGenMapOpen] = useState(false);
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

  // Pinned Future Generation Map card visibility: ONLY when BDV category is selected
  const showFutureGenCard = cat === 'BDV';

  // Count per category
  const catCounts = {};
  glossary.forEach(item => {
    catCounts[item.cat] = (catCounts[item.cat] || 0) + 1;
  });

  // Reset flashcards on filter change
  useEffect(() => {
    setFlashcardIdx(0);
    setFlipped(false);
  }, [search, cat, viewMode]);

  // Record reading activity when user taps a term (streak trigger)
  const recordRead = useCallback(async (termId) => {
    if (expandedId === termId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(termId);

    try {
      const res = await recordUserActivityDirect(user || USERNAME);
      if (res && onStreakUpdate) {
        onStreakUpdate(res.streak, res.recorded);
      }
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
  }, [expandedId, onStreakUpdate, user, USERNAME]);

  // Record read for flashcard flip too
  const handleFlashcardFlip = useCallback(async () => {
    setFlipped(!flipped);
    if (!flipped) {
      try {
        const res = await recordUserActivityDirect(user || USERNAME);
        if (res && onStreakUpdate) {
          onStreakUpdate(res.streak, res.recorded);
        }
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
    }
  }, [flipped, onStreakUpdate, user, USERNAME]);

  return (
    <div className="space-y-5 animate-fadeIn pb-10 relative">
      {/* Top Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Knowledge Repository</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">Dictionary & Directory</h1>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
            Definitions, formulas & acronyms across all divisions
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl space-x-1 shrink-0">
          {[['grid', 'Cards'], ['list', 'List'], ['flashcards', 'Flashcards']].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === mode
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by acronym, term, or keyword..."
            className="w-full pl-10 pr-20 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
            {filtered.length} terms
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(c => {
            const isActive = cat === c.key;
            const count = c.key === 'All' ? glossary.length : (catCounts[c.key] || 0);
            const clr = c.key !== 'All' ? getColor(c.key) : null;
            return (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
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
            const catMeta = getCatMeta(item.cat);
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
                      <h3 className="font-black text-[15px] text-slate-900 dark:text-white">
                        {item.term}
                        {item.full && !item.term.includes(' ') && (
                          <span className="ml-2 font-semibold text-[13px] text-slate-500 dark:text-slate-400">({item.full})</span>
                        )}
                      </h3>
                      {isPerfCard && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50 flex items-center gap-1">
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
                          <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-3 leading-relaxed whitespace-pre-wrap">{item.desc}</p>
                          <CorporatePerformanceChart
                            chartData={item.chartData}
                            term={item.term}
                            description=""
                            yAxisFormat={item.formulaNotations || item.yAxisFormat}
                            formula={item.formula}
                          />
                        </div>
                      ) : (
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">{item.desc}</p>
                      )}
                    </div>

                    {item.formula && item.formula !== 'area' && item.formula !== 'bar' && (
                      <div className={`mt-3 ${clr.bg} border ${clr.border} rounded-xl p-3`}>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">📐 Formula</div>
                        <div className={`text-[13px] font-black font-mono ${clr.text} leading-relaxed`}>
                          {item.formula}
                        </div>
                        {item.formulaTermMeanings && (
                          <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                            <ul className="text-[12px] text-slate-700 dark:text-slate-300 mt-0.5 space-y-1">
                              {item.formulaTermMeanings.split('\n').map((line, i) => (
                                <li key={i}>- {line}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
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
                        <div className={`mt-2 font-mono text-[11px] font-bold ${clr.text} ${clr.bg} px-2 py-1 rounded-lg`}>
                          📐 {item.formula}
                        </div>
                      )}
                      {item.formulaNotations && (
                        <div className="mt-1 text-[11px] text-slate-500">
                          <span className="font-bold">Notations:</span> <span className="font-mono">{item.formulaNotations.replace(/\n/g, ', ')}</span>
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

      {/* FLASHCARDS View */}
      {viewMode === 'flashcards' && (
        <GlossaryFlashcardView
          filtered={filtered}
          flashcardIdx={flashcardIdx}
          setFlashcardIdx={setFlashcardIdx}
          flipped={flipped}
          setFlipped={setFlipped}
          onFlip={handleFlashcardFlip}
          isBookmarked={isBookmarked}
          toggleBookmark={toggleBookmark}
        />
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
