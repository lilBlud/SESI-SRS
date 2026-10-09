import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORIES, CAT_COLORS, API_BASE, getColor, getCatMeta } from '../../utils/constants';
import { CorporatePerformanceChart } from '../ui/UIComponents';

export function GlossaryTab({ user, glossary, onStreakUpdate, activeGlossaryCat, setActiveGlossaryCat, bookmarkActions }) {
  const { isBookmarked, toggleBookmark } = bookmarkActions || { isBookmarked: () => false, toggleBookmark: () => { } };
  const [search, setSearch] = useState('');
  // Use the global activeGlossaryCat as our filter category, defaulting to 'All'
  const cat = activeGlossaryCat || 'All';
  const setCat = (c) => {
    if (setActiveGlossaryCat) setActiveGlossaryCat(c);
  };

  const [viewMode, setViewMode] = useState('grid'); // grid, list, flashcards
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
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
    // Toggle expand
    if (expandedId === termId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(termId);

    // Record daily activity for streak
    try {
      const res = await fetch(`${API_BASE}/api/streak/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: USERNAME })
      });
      if (res.ok) {
        const data = await res.json();
        if (onStreakUpdate) onStreakUpdate(data.streak, data.recorded);
      }
    } catch (e) { /* silently fail */ }
  }, [expandedId, onStreakUpdate]);

  // Record read for flashcard flip too
  const handleFlashcardFlip = useCallback(async () => {
    setFlipped(!flipped);
    if (!flipped) {
      try {
        const res = await fetch(`${API_BASE}/api/streak/record`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: USERNAME })
        });
        if (res.ok) {
          const data = await res.json();
          if (onStreakUpdate) onStreakUpdate(data.streak, data.recorded);
        }
      } catch (e) { /* silently fail */ }
    }
  }, [flipped, onStreakUpdate]);

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
            <button key={mode} onClick={() => setViewMode(mode)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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

        {/* Category Pills — Scrollable */}
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(c => {
            const isActive = cat === c.key;
            const count = c.key === 'All' ? glossary.length : (catCounts[c.key] || 0);
            const clr = c.key !== 'All' ? getColor(c.key) : null;
            return (
              <button key={c.key} onClick={() => setCat(c.key)} className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${isActive
                ? (clr ? `${clr.pill} text-white shadow-md` : 'bg-emerald-600 text-white shadow-md')
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}>
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

      {/* Empty State */}
      {filtered.length === 0 && (
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
            return (
              <div
                key={item.id || item.term}
                onClick={() => recordRead(item.id || item.term)}
                className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 cursor-pointer transition-all active:scale-[0.99] ${isExpanded ? `ring-2 ${clr.border}` : 'dark:ring-white/10'}`}
              >
                <div className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-[15px] text-slate-900 dark:text-white">
                        {item.term}
                        {item.full && !item.term.includes(' ') && <span className="ml-2 font-semibold text-[13px] text-slate-500 dark:text-slate-400">({item.full})</span>}
                      </h3>
                    </div>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                    <div className="mt-2">
                      {item.cat === 'Corporate Performance' ? (
                        <div className="space-y-2 mt-3 mb-2">
                          <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">{item.desc}</p>
                          <CorporatePerformanceChart chartData={item.chartData} term={item.term} description="" />
                        </div>
                      ) : (
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">{item.desc}</p>
                      )}
                    </div>

                    {/* Formula Display */}
                    {item.formula && (
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
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                        <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">✓ Read</span>
                        <span>Counts toward your daily streak!</span>
                      </div>
                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end">
                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark(item, 'glossary'); }} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all active:scale-95 shrink-0 text-[11px] font-bold ${isBookmarked(item.id || item.term, 'glossary') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                          <svg className="w-3 h-3" fill={isBookmarked(item.id || item.term, 'glossary') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                          {isBookmarked(item.id || item.term, 'glossary') ? 'Saved' : 'Bookmark'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const pdfWin = window.open('', '_blank');
                            pdfWin.document.write(`<html><head><title>${item.term} - SESI Dictionary</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#1e293b}h1{font-size:28px;margin:0}h2{font-size:18px;color:#475569;font-weight:600;margin:4px 0 16px}.badge{display:inline-block;background:#ecfdf5;color:#059669;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:12px}.section-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;margin-top:16px}.desc{font-size:15px;line-height:1.7;color:#334155;margin-top:4px;white-space:pre-wrap}.formula-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-top:12px;font-family:monospace;font-size:14px;font-weight:700;color:#0f172a}.meanings{font-size:13px;color:#475569;margin-top:8px;line-height:1.6}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center}@media print{body{margin:20px} .no-print {display: none !important;}}</style></head><body>`);
                            pdfWin.document.write(`<div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-start;"><button onclick="window.close()" style="background: #0f172a; color: white; padding: 12px 20px; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">← Back to App</button></div>`);
                            pdfWin.document.write(`<div class="badge">${catMeta.emoji} ${item.cat}</div>`);
                            pdfWin.document.write(`<h1>${item.term}</h1>` + (item.full && !item.term.includes(' ') ? `<h2>${item.full}</h2>` : ''));
                            pdfWin.document.write(`<div class="section-label">Definition</div><div class="desc">${item.desc}</div>`);
                            if (item.formula) {
                              pdfWin.document.write(`<div class="formula-box">📐 ${item.formula}</div>`);
                            }
                            if (item.formulaTermMeanings) {
                              pdfWin.document.write(`<div class="section-label">Term Meanings</div><div class="meanings">${item.formulaTermMeanings.replace(/\n/g, '<br/>')}</div>`);
                            }
                            pdfWin.document.write(`<div class="footer">SESI Dictionary • Sabah Electricity Supply Industry • ${new Date().toLocaleDateString()}</div>`);
                            pdfWin.document.write('</body></html>');
                            pdfWin.document.close();
                            setTimeout(() => pdfWin.print(), 300);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-bold rounded-lg transition-all active:scale-95 shrink-0"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Save PDF
                        </button>
                      </div>
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
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">Term</th>
                <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">Definition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((item) => {
                const clr = getColor(item.cat);
                return (
                  <tr key={item.id || item.term} onClick={() => recordRead(item.id || item.term)} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 cursor-pointer transition-colors">
                    <td className="px-4 py-3 align-top">
                      <div className={`font-bold font-mono ${clr.text}`}>
                        {item.term}
                        {item.full && !item.term.includes(' ') && <div className="text-[11px] font-sans font-medium text-slate-500 mt-1">{item.full}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 align-top whitespace-pre-wrap">
                      {item.cat === 'Corporate Performance' ? (
                        <div className="space-y-1 my-2">
                          <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{item.desc}</p>
                          <div className="mt-3">
                            <CorporatePerformanceChart chartData={item.chartData} term={item.term} description="" />
                          </div>
                        </div>
                      ) : (
                        item.desc
                      )}
                      {item.formula && (
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
                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark(item, 'glossary'); }} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all active:scale-95 text-[10px] font-bold ${isBookmarked(item.id || item.term, 'glossary') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                          <svg className="w-3 h-3" fill={isBookmarked(item.id || item.term, 'glossary') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
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
      {viewMode === 'flashcards' && filtered.length > 0 && (() => {
        const safeIdx = Math.min(flashcardIdx, filtered.length - 1);
        const card = filtered[safeIdx];
        return (
          <div className="flex flex-col items-center w-full py-4">
            <div className={`w-full max-w-md h-72 flashcard cursor-pointer ${flipped ? 'flipped' : ''}`} onClick={handleFlashcardFlip}>
              <div className="flashcard-inner relative w-full h-full rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flashcard-front absolute w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl p-6">
                  <span className="text-xs text-slate-400 uppercase tracking-widest mb-4">Tap to reveal</span>
                  <h2 className={`text-4xl font-black font-mono text-center ${getColor(card.cat).text}`}>{card.term}</h2>
                  {card.full && !card.term.includes(' ') && <div className="mt-3 text-sm font-bold text-slate-500 text-center px-4">{card.full}</div>}
                </div>
                <div className={`flashcard-back absolute w-full h-full flex flex-col items-center justify-center ${getColor(card.cat).bg} rounded-2xl p-6 text-center overflow-y-auto`}>
                  {card.cat === 'Corporate Performance' ? (
                    <div className="space-y-4 mt-2 w-full">
                      <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{card.desc}</p>
                    </div>
                  ) : (
                    <p className="text-[13px] text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{card.desc}</p>
                  )}
                  {card.formula && (
                    <div className="mt-3 bg-white/60 dark:bg-slate-800/60 rounded-lg px-3 py-2 text-left w-full">
                      <div className={`text-[12px] font-black font-mono text-center mb-2 ${getColor(card.cat).text}`}>
                        📐 {card.formula}
                      </div>
                      {card.formulaNotations && (
                        <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-1">
                          <span className="font-bold">Notations:</span> <span className="font-mono">{card.formulaNotations.replace(/\n/g, ', ')}</span>
                        </div>
                      )}
                      {card.formulaTermMeanings && (
                        <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-1 line-clamp-3">
                          <span className="font-bold">Meanings:</span> <span>{card.formulaTermMeanings.replace(/\n/g, ' | ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-auto pt-3 pb-1 w-full flex flex-col items-center gap-2">
                    <div className="text-[11px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">✓ Streak counted!</div>
                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(card, 'glossary'); }} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all active:scale-95 text-[12px] font-bold ${isBookmarked(card.id || card.term, 'glossary') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-black/10 dark:bg-black/30 hover:bg-black/20 dark:hover:bg-black/40 text-slate-700 dark:text-slate-300'}`}>
                      <svg className="w-4 h-4" fill={isBookmarked(card.id || card.term, 'glossary') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      {isBookmarked(card.id || card.term, 'glossary') ? 'Saved' : 'Bookmark'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-md flex justify-between items-center mt-6">
              <button onClick={() => { setFlashcardIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={safeIdx === 0} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-xs font-bold disabled:opacity-50">← Previous</button>
              <span className="text-xs font-medium text-slate-500">{safeIdx + 1} of {filtered.length}</span>
              <button onClick={() => { setFlashcardIdx(i => Math.min(filtered.length - 1, i + 1)); setFlipped(false); }} disabled={safeIdx === filtered.length - 1} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-xs font-bold disabled:opacity-50">Next →</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

