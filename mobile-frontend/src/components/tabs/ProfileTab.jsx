import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { API_BASE, currentMonth, getColor, getCatMeta } from '../../utils/constants';
import { CorporatePerformanceChart, PostImageSlider } from '../ui/UIComponents';

export function ProfileTab({ user, bookmarkActions, setActiveTab, triggerInstallPrompt }) {
  const { bookmarks, toggleBookmark } = bookmarkActions || { bookmarks: [], toggleBookmark: () => { } };
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [currentRank, setCurrentRank] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(''); // empty = All time
  const [activeMonths, setActiveMonths] = useState([]);
  const [activeBookmark, setActiveBookmark] = useState(null);
  const [imgViewerIdx, setImgViewerIdx] = useState(null);
  const USERNAME = user?.fullName || "Ahmad Azib Danish";

  // Format month (e.g. "2026-10" to "Oct 2026")
  const formatMonth = (m) => {
    const [y, mo] = m.split('-');
    const date = new Date(y, parseInt(mo) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  useEffect(() => {
    // Fetch available months for this user once
    fetch(`${API_BASE}/api/profile/${encodeURIComponent(USERNAME)}/active-months`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        // Always include current month in the filter
        if (!data.includes(currentMonth)) {
          data.unshift(currentMonth);
        }
        setActiveMonths(data);
      })
      .catch(console.error);
  }, [USERNAME]);

  useEffect(() => {
    setLoading(true);
    const qs = filterMonth ? `?month=${filterMonth}` : '';
    Promise.all([
      fetch(`${API_BASE}/api/profile/${encodeURIComponent(USERNAME)}/recent-answers${qs}`).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE}/api/leaderboard/${currentMonth}`).then(r => r.ok ? r.json() : [])
    ])
      .then(([answers, leaderboard]) => {
        setRecentQuizzes(answers);
        const userEntry = leaderboard.find(entry => entry.username === USERNAME);
        setCurrentRank(userEntry ? leaderboard.indexOf(userEntry) + 1 : null);
        setTotalScore(userEntry ? userEntry.score : 0);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [filterMonth, USERNAME]);

  return (
    <div className="space-y-6 animate-slideUp">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">User Profile</span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">My Activity</h1>
      </div>

      {/* User Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 shrink-0 text-2xl font-black shadow-inner">
            {USERNAME.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{USERNAME}</h2>
            <div className="flex flex-col mt-0.5">
              <span className="text-emerald-100 text-[12px] font-medium">{user?.division || 'Staff Member'}</span>
              <span className="text-emerald-200/80 text-[11px]">{user?.staffId || 'Employee'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Total Score & Standing */}
      {!loading && (
        <div className="flex gap-3">
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center overflow-visible">
              {/* Rich 3D Target SVG */}
              <svg className="w-9 h-9 animate-target-shake drop-shadow-md" viewBox="0 0 32 32" fill="none">
                <defs>
                  <linearGradient id="targetBg" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                  <linearGradient id="targetBullseye" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="14" fill="url(#targetBg)" />
                <circle cx="16" cy="16" r="9" fill="#ffffff" />
                <circle cx="16" cy="16" r="4.5" fill="url(#targetBullseye)" />
              </svg>

              {/* Rich 3D Realistic Arrow SVG */}
              <svg className="w-10 h-10 absolute animate-arrow-hit z-10 overflow-visible" viewBox="0 0 32 32" fill="none" style={{ filter: 'drop-shadow(-3px 5px 4px rgba(0,0,0,0.3))' }}>
                {/* Left Feather (Dark Red) */}
                <polygon points="24 8 29 3 27 1 22 6" fill="#b91c1c" />
                {/* Right Feather (Bright Red) */}
                <polygon points="24 8 29 3 31 5 26 10" fill="#ef4444" />

                {/* Wooden Shaft */}
                <line x1="18.5" y1="13.5" x2="29" y2="3" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />

                {/* Metal Arrowhead (3D split shading pointing to 16,16) */}
                {/* Left Half (Light Metal) */}
                <polygon points="16 16 16 11 18.5 13.5" fill="#e2e8f0" />
                {/* Right Half (Dark Metal) */}
                <polygon points="16 16 21 16 18.5 13.5" fill="#94a3b8" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Score</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-0.5">
                {totalScore}
              </p>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center overflow-visible">
              {/* Rich Realistic 3D Trophy SVG */}
              <svg className="w-10 h-10 animate-trophy-bounce z-10 overflow-visible" viewBox="0 0 32 32" fill="none" style={{ filter: 'drop-shadow(0px 6px 4px rgba(0,0,0,0.3))' }}>
                <defs>
                  {/* Horizontal metallic gradient for cylindrical reflection */}
                  <linearGradient id="goldGleam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ca8a04" />
                    <stop offset="20%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="80%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#854d0e" />
                  </linearGradient>
                  <linearGradient id="goldBase" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a16207" />
                    <stop offset="50%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#713f12" />
                  </linearGradient>
                </defs>

                {/* Handles (Rendered behind the cup) */}
                <path d="M7 11 C 1 9 1 18 11 16.5" fill="none" stroke="url(#goldBase)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M25 11 C 31 9 31 18 21 16.5" fill="none" stroke="url(#goldBase)" strokeWidth="2.5" strokeLinecap="round" />

                {/* Base - Chamfered top tier */}
                <path d="M10 24 h12 l2 3 h-16 z" fill="#334155" />
                {/* Base - Bottom tier */}
                <path d="M8 27 h16 v2 c0 1 -1 1 -1 1 H9 c-1 0 -1 0 -1 -1 v-2 z" fill="#0f172a" />
                {/* Gold Plaque */}
                <rect x="14" y="27.5" width="4" height="1.5" fill="#fef08a" />

                {/* Stem */}
                <path d="M14 18 h4 l1 6 h-6 z" fill="url(#goldBase)" />
                <rect x="13.5" y="17" width="5" height="1.5" fill="#fef08a" rx="0.5" />

                {/* Cup Body (Flared bowl) */}
                <path d="M7 7 C 7 16 12 18 14 18 h4 C 20 18 25 16 25 7 Z" fill="url(#goldGleam)" />

                {/* Cup Lip / Opening (3D depth) */}
                <ellipse cx="16" cy="7" rx="9" ry="2.5" fill="#fef9c3" />
                {/* Cup Inner Depth Shadow */}
                <ellipse cx="16" cy="7" rx="7.5" ry="1.5" fill="#a16207" opacity="0.8" />

                {/* Engraved Star Highlight */}
                <polygon points="16 11 16.5 12.5 18 12.5 16.8 13.5 17.2 15 16 14 14.8 15 15.2 13.5 14 12.5 15.5 12.5" fill="#fef9c3" opacity="0.9" />
              </svg>
              {/* Confetti Particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-sm animate-confetti-pop" style={{ '--tx': '-18px', '--ty': '-22px', '--rot': '-45deg' }}></div>
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-sm animate-confetti-pop" style={{ '--tx': '18px', '--ty': '-18px', '--rot': '45deg', animationDelay: '0.1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-2 bg-indigo-400 rounded-sm animate-confetti-pop" style={{ '--tx': '-14px', '--ty': '16px', '--rot': '90deg', animationDelay: '0.2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-1 bg-emerald-400 rounded-sm animate-confetti-pop" style={{ '--tx': '14px', '--ty': '12px', '--rot': '135deg', animationDelay: '0.05s' }}></div>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Standing</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-0.5">
                {currentRank ? `#${currentRank}` : '-'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Answers Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">Recent Questions</h3>
              <p className="text-[12px] text-slate-500 mt-1">Your latest answered questions</p>
            </div>
          </div>

          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold py-1.5 px-2 rounded-lg outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/50 transition-all"
          >
            <option value="">All Time</option>
            {activeMonths.map(m => (
              <option key={m} value={m}>{formatMonth(m)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-[6vw] md:-mx-[calc(50%-175px)] md:px-[calc(50%-175px)]">
            {recentQuizzes.length === 0 ? (
              <div className="w-full text-center py-8 text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                {filterMonth ? `No questions answered in ${formatMonth(filterMonth)}.` : "You haven't answered any questions yet."}
              </div>
            ) : (
              recentQuizzes.map((ans, idx) => {
                const date = new Date(ans.dateAnswered).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <div key={idx} className="w-[85%] max-w-[300px] shrink-0 snap-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10 flex flex-col justify-between gap-2">
                    <div className="flex justify-between items-start">
                      <div className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight pr-4 line-clamp-3">
                        {ans.questionText}
                      </div>
                      <div className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${ans.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {ans.isCorrect ? 'Correct' : 'Wrong'}
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <div className="text-[11px] text-slate-500">
                        {date} • {ans.timeTakenSeconds}s taken
                      </div>
                      <div className="font-black text-emerald-600 dark:text-emerald-400 text-[14px]">
                        +{ans.pointsAwarded} pts
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>


      <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 hidden">
        <button onClick={triggerInstallPrompt} className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.98] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <div className="text-left">
              <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">Install App (iOS / Android)</p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">Add SESI to your Home Screen</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Bookmarks Section */}
      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔖</span>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">Bookmarks</h3>
              <p className="text-[12px] text-slate-500 mt-1">Your saved posters and dictionary terms</p>
            </div>
          </div>
          {bookmarks.length > 0 && (
            <button
              onClick={() => {
                const pdfWin = window.open('', '_blank');
                pdfWin.document.write(`<html><head><title>SESI Reference Guide</title>
                  <style>
                    body { font-family: system-ui, -apple-system, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; color: #1e293b; background: white; }
                    .header-box { text-align: center; margin-bottom: 50px; border-bottom: 3px solid #0f172a; padding-bottom: 24px; }
                    h1.main-title { font-size: 38px; margin: 0 0 8px 0; color: #0f172a; font-weight: 900; letter-spacing: -0.03em; }
                    p.subtitle { color: #64748b; font-size: 15px; margin: 0; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
                    
                    .section-title { font-size: 24px; font-weight: 900; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin: 40px 0 24px 0; }
                    
                    /* Dictionary Grid */
                    .dict-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
                    .dict-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; break-inside: avoid; page-break-inside: avoid; }
                    .dict-cat { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #059669; margin-bottom: 8px; }
                    .dict-term { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; }
                    .dict-desc { font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
                    .dict-formula { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 16px; font-family: monospace; font-size: 13px; font-weight: 700; color: #0f172a; }
                    
                    /* Posters */
                    .poster-item { margin-bottom: 48px; break-inside: avoid; page-break-inside: avoid; }
                    .poster-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; }
                    .poster-desc { font-size: 15px; color: #475569; margin-bottom: 16px; line-height: 1.6; }
                    .poster-images { display: flex; flex-direction: row; gap: 16px; flex-wrap: wrap; }
                    .poster-images img { max-width: 100%; max-height: 380px; object-fit: contain; border-radius: 12px; border: 1px solid #e2e8f0; }
                    
                    @media print { 
                      body { padding: 20px; margin: 0; max-width: 100%; } 
                      .no-print { display: none !important; }
                      .dict-card, .poster-item { break-inside: avoid; page-break-inside: avoid; }
                      .poster-images img { max-height: 320px; }
                    }
                  </style>
                  </head><body>`);

                pdfWin.document.write(`<div class="no-print" style="margin-bottom: 24px; display: flex; justify-content: flex-start;"><button onclick="window.close()" style="background: #0f172a; color: white; padding: 16px 32px; border: none; border-radius: 16px; font-weight: 800; cursor: pointer; font-size: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">← Back to App</button></div>`);

                pdfWin.document.write(`<div class="header-box">`);
                pdfWin.document.write(`<h1 class="main-title">SESI Reference Guide</h1>`);
                pdfWin.document.write(`<p class="subtitle">Compiled Bookmarks • ${new Date().toLocaleDateString()}</p>`);
                pdfWin.document.write(`</div>`);

                const dictItems = bookmarks.filter(b => b.type === 'glossary');
                const posterItems = bookmarks.filter(b => b.type === 'poster');

                if (dictItems.length > 0) {
                  pdfWin.document.write(`<h2 class="section-title">Dictionary Reference</h2>`);
                  pdfWin.document.write(`<div class="dict-grid">`);
                  dictItems.forEach(bm => {
                    pdfWin.document.write(`<div class="dict-card">`);
                    pdfWin.document.write(`<div class="dict-cat">${bm.cat || 'Dictionary'}</div>`);
                    const titleStr = bm.term || bm.title || '';
                    pdfWin.document.write(`<h3 class="dict-term">${titleStr}${bm.full && !titleStr.includes(' ') ? ` <span style="font-size:14px;color:#64748b;font-weight:600;margin-left:8px;">(${bm.full})</span>` : ''}</h3>`);
                    pdfWin.document.write(`<div class="dict-desc">${bm.desc}</div>`);
                    if (bm.cat === 'Corporate Performance') {
                      let parsed = [];
                      try {
                        parsed = typeof bm.chartData === 'string' ? JSON.parse(bm.chartData) : bm.chartData;
                      } catch(e) {}
                      if (!Array.isArray(parsed) || parsed.length === 0) {
                        const isPct = ["SYSTEM LOSS", "ASSET CAPITALISATION", "AUDIT ISSUE", "ROI", "ROA", "ROE"].includes((titleStr||'').toUpperCase());
                        parsed = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map(m => ({
                           month: m, value: isPct ? parseFloat((Math.random() * 20 + 80).toFixed(1)) : Math.floor(Math.random() * 5000 + 1000)
                        }));
                      }
                      
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        const maxVal = Math.max(...parsed.map(d => d.value));
                        let barsHtml = `<div style="display:flex; align-items:flex-end; gap:6px; height:120px; margin-top:20px; padding-top:16px; border-top: 1px dashed #cbd5e1; page-break-inside: avoid;">`;
                        parsed.forEach(d => {
                           const heightPct = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
                           barsHtml += `
                             <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:4px; height:100%;">
                               <div style="font-size:8px; color:#64748b; font-weight:700;">${d.value}</div>
                               <div style="width:100%; max-width:24px; height:${Math.max(1, heightPct)}%; background:#10b981; border-radius:3px 3px 0 0; min-height:4px;"></div>
                               <div style="font-size:8px; font-weight:800; color:#475569;">${d.month}</div>
                             </div>
                           `;
                        });
                        barsHtml += `</div>`;
                        pdfWin.document.write(barsHtml);
                      }
                    }
                    if (bm.formula) {
                      pdfWin.document.write(`<div class="dict-formula">📐 ${bm.formula}</div>`);
                      if (bm.formulaTermMeanings) {
                        pdfWin.document.write(`<div style="font-size:11px;margin-top:8px;color:#64748b;line-height:1.4;">${bm.formulaTermMeanings.replace(/\n/g, '<br/>')}</div>`);
                      }
                    }
                    pdfWin.document.write(`</div>`);
                  });
                  pdfWin.document.write(`</div>`);
                }

                if (posterItems.length > 0) {
                  pdfWin.document.write(`<h2 class="section-title">Infographics & Posters</h2>`);
                  posterItems.forEach(bm => {
                    pdfWin.document.write(`<div class="poster-item">`);
                    pdfWin.document.write(`<h3 class="poster-title">${bm.title}</h3>`);
                    if (bm.description) pdfWin.document.write(`<div class="poster-desc">${bm.description}</div>`);

                    let allImages = [];
                    if (bm.imageUrl) allImages.push(bm.imageUrl);
                    if (bm.additionalImages) {
                      try {
                        const parsed = typeof bm.additionalImages === 'string' ? JSON.parse(bm.additionalImages) : bm.additionalImages;
                        if (Array.isArray(parsed)) allImages.push(...parsed);
                      } catch (e) { }
                    }

                    if (allImages.length > 0) {
                      pdfWin.document.write(`<div class="poster-images">`);
                      allImages.forEach(imgUrl => {
                        pdfWin.document.write(`<img src="${imgUrl}" />`);
                      });
                      pdfWin.document.write(`</div>`);
                    }
                    pdfWin.document.write(`</div>`);
                  });
                }

                pdfWin.document.write('</body></html>');
                pdfWin.document.close();
                setTimeout(() => pdfWin.print(), 1000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-bold active:scale-95 transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Save All
            </button>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-[6vw] md:-mx-[calc(50%-175px)] md:px-[calc(50%-175px)]">
          {bookmarks.length === 0 ? (
            <div className="w-full text-center py-8 text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              No bookmarks yet. Save posters and terms to see them here!
            </div>
          ) : (
            bookmarks.map((bm, idx) => {
              if (bm.type === 'poster') {
                const img = bm.imageUrl || (bm.additionalImages && bm.additionalImages.length > 0 ? bm.additionalImages[0] : null);
                return (
                  <div key={idx} onClick={() => setActiveBookmark(bm)} className="w-[180px] h-[240px] shrink-0 snap-center rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm ring-1 ring-black/5 flex flex-col cursor-pointer active:scale-95 transition-all">
                    {img ? (
                      <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative min-h-0">
                        <img src={img} alt={bm.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md z-10">Poster</div>
                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark(bm, 'poster'); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white active:scale-95 z-10 backdrop-blur-md">
                          <svg className="w-3.5 h-3.5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative min-h-0" />
                    )}
                    <div className="h-[64px] p-3 flex items-center shrink-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="font-bold text-[12px] text-slate-900 dark:text-white line-clamp-2 leading-tight w-full">{bm.title}</div>
                    </div>
                  </div>
                );
              } else if (bm.type === 'glossary') {
                const clr = bm.cat ? getColor(bm.cat) : getColor('All');
                const catMeta = bm.cat ? getCatMeta(bm.cat) : getCatMeta('All');
                const isCorp = bm.cat === 'Corporate Performance';
                return (
                  <div key={idx} onClick={() => setActiveBookmark(bm)} className="w-[180px] h-[240px] shrink-0 snap-center rounded-3xl p-4 shadow-sm ring-1 flex flex-col cursor-pointer active:scale-95 transition-all relative overflow-hidden bg-white dark:bg-slate-800 ring-black/5 dark:ring-white/10">
                    <div className="flex items-start justify-between mb-2 shrink-0 gap-2">
                      <div className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap truncate ${clr.text}`}>
                        {catMeta.emoji} {bm.cat || 'Dictionary'}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); toggleBookmark(bm, 'glossary'); }} className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center active:scale-95 ${clr.bg} ${clr.text}`}>
                        <svg className="w-3 h-3" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col min-h-0 mt-1">
                      <div className="font-black text-[15px] font-mono mb-1 shrink-0 line-clamp-2 text-slate-900 dark:text-white">
                        {bm.term}
                        {bm.full && !bm.term.includes(' ') && <span className="ml-1 font-sans text-[11px] font-bold text-slate-500">({bm.full})</span>}
                      </div>
                      <div className="text-[11px] line-clamp-5 leading-relaxed overflow-hidden text-slate-500 dark:text-slate-400">{bm.desc}</div>
                    </div>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>

      {/* App Settings removed */}

      {/* Full Card/Poster Modal */}
      {activeBookmark && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setActiveBookmark(null)}>
          <div className="bg-slate-100 dark:bg-slate-900 w-full max-w-[400px] max-h-[85vh] rounded-3xl shadow-2xl flex flex-col transform transition-all animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/50">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">{activeBookmark.type === 'poster' ? 'Poster' : 'Dictionary Card'}</h2>
              <button onClick={() => setActiveBookmark(null)} className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold active:scale-95">✕</button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {(() => {
                const isPoster = activeBookmark.type === 'poster';
                const clr = activeBookmark.cat ? getColor(activeBookmark.cat) : getColor('All');
                const catMeta = activeBookmark.cat ? getCatMeta(activeBookmark.cat) : getCatMeta('All');

                if (isPoster) {
                  return (
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-3">
                        <div className="pr-12">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${clr.text} mb-1 flex items-center gap-1.5`}>
                            <span className="text-sm">{catMeta.emoji}</span> {catMeta.label}
                          </span>
                          <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{activeBookmark.title}</h2>
                        </div>
                      </div>
                      {activeBookmark.description && <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">{activeBookmark.description}</p>}
                      {(() => {
                        const allImages = [];
                        if (activeBookmark.imageUrl) allImages.push(activeBookmark.imageUrl);
                        if (activeBookmark.additionalImages) {
                          try {
                            const parsed = typeof activeBookmark.additionalImages === 'string' ? JSON.parse(activeBookmark.additionalImages) : activeBookmark.additionalImages;
                            if (Array.isArray(parsed)) allImages.push(...parsed);
                          } catch (e) { }
                        }
                        if (allImages.length === 0) return null;
                        return (
                          <div className="space-y-2">
                            <PostImageSlider images={allImages} title={activeBookmark.title} onImageClick={(idx) => setImgViewerIdx(idx)} />
                          </div>
                        );
                      })()}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const allImages = [];
                            if (activeBookmark.imageUrl) allImages.push(activeBookmark.imageUrl);
                            if (activeBookmark.additionalImages) {
                              try {
                                const parsed = typeof activeBookmark.additionalImages === 'string' ? JSON.parse(activeBookmark.additionalImages) : activeBookmark.additionalImages;
                                if (Array.isArray(parsed)) allImages.push(...parsed);
                              } catch (e) { }
                            }
                            if (allImages.length > 0) {
                              return (
                                <button onClick={() => saveImage(allImages[0], `${activeBookmark.title.replace(/\s+/g, '_')}.png`)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl transition-all active:scale-95">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                  Save Image
                                </button>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 ring-2 ${clr.border}`}>
                      <div className="p-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-[15px] text-slate-900 dark:text-white">
                              {activeBookmark.term}
                              {activeBookmark.full && !activeBookmark.term.includes(' ') && <span className="ml-2 font-semibold text-[13px] text-slate-500 dark:text-slate-400">({activeBookmark.full})</span>}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                        <div className="mt-2">
                          {activeBookmark.cat === 'Corporate Performance' ? (
                            <div className="space-y-2 mt-3 mb-2">
                              <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-3 leading-relaxed whitespace-pre-wrap">{activeBookmark.desc}</p>
                              <CorporatePerformanceChart chartData={activeBookmark.chartData} term={activeBookmark.term || activeBookmark.title || ""} description="" />
                            </div>
                          ) : (
                            <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">{activeBookmark.desc}</p>
                          )}
                        </div>

                        {activeBookmark.formula && (
                          <div className={`mt-3 ${clr.bg} border ${clr.border} rounded-xl p-3`}>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">📐 Formula</div>
                            <div className={`text-[13px] font-black font-mono ${clr.text} leading-relaxed`}>
                              {activeBookmark.formula}
                            </div>
                            {activeBookmark.formulaTermMeanings && (
                              <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                                <ul className="text-[12px] text-slate-700 dark:text-slate-300 mt-0.5 space-y-1">
                                  {activeBookmark.formulaTermMeanings.split('\n').map((line, i) => (
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
                          <div className="flex items-center gap-2 shrink-0 self-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const pdfWin = window.open('', '_blank');
                                pdfWin.document.write(`<html><head><title>${activeBookmark.term} - SESI Dictionary</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#1e293b}h1{font-size:28px;margin:0}h2{font-size:18px;color:#475569;font-weight:600;margin:4px 0 16px}.badge{display:inline-block;background:#ecfdf5;color:#059669;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:12px}.section-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;margin-top:16px}.desc{font-size:15px;line-height:1.7;color:#334155;margin-top:4px;white-space:pre-wrap}.formula-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-top:12px;font-family:monospace;font-size:14px;font-weight:700;color:#0f172a}.meanings{font-size:13px;color:#475569;margin-top:8px;line-height:1.6}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center}@media print{body{margin:20px} .no-print {display: none !important;}}</style></head><body>`);
                                pdfWin.document.write(`<div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-start;"><button onclick="window.close()" style="background: #0f172a; color: white; padding: 12px 20px; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">← Back to App</button></div>`);
                                pdfWin.document.write(`<div class="badge">${catMeta.emoji} ${activeBookmark.cat}</div>`);
                                pdfWin.document.write(`<h1>${activeBookmark.term}</h1>` + (activeBookmark.full && !activeBookmark.term.includes(' ') ? `<h2>${activeBookmark.full}</h2>` : ''));
                                pdfWin.document.write(`<div class="section-label">Definition</div><div class="desc">${activeBookmark.desc}</div>`);
                                if (activeBookmark.formula) {
                                  pdfWin.document.write(`<div class="formula-box">📐 ${activeBookmark.formula}</div>`);
                                }
                                if (activeBookmark.formulaTermMeanings) {
                                  pdfWin.document.write(`<div class="section-label">Term Meanings</div><div class="meanings">${activeBookmark.formulaTermMeanings.replace(/\n/g, '<br/>')}</div>`);
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
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Image Viewer for Poster Modal */}
      {imgViewerIdx !== null && activeBookmark?.type === 'poster' && createPortal((() => {
        const allImages = [];
        if (activeBookmark.imageUrl) allImages.push(activeBookmark.imageUrl);
        if (activeBookmark.additionalImages) {
          try {
            const parsed = typeof activeBookmark.additionalImages === 'string' ? JSON.parse(activeBookmark.additionalImages) : activeBookmark.additionalImages;
            if (Array.isArray(parsed)) allImages.push(...parsed);
          } catch (e) { }
        }
        return (
          <div className="fixed inset-0 z-[110] flex flex-col bg-black animate-fadeIn" onClick={() => setImgViewerIdx(null)}>
            <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),16px)] pb-2 z-10">
              <button onClick={() => setImgViewerIdx(null)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform">
                <span className="text-xl leading-none font-bold">←</span>
              </button>
              <span className="text-white/70 text-[13px] font-bold">{imgViewerIdx + 1} / {allImages.length}</span>
              <div className="w-8"></div>
            </div>
            <div className="flex-1 flex items-center justify-center px-4 relative" onClick={(e) => e.stopPropagation()}>
              <img src={allImages[imgViewerIdx]} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
              {imgViewerIdx > 0 && (
                <button onClick={() => setImgViewerIdx(i => i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold active:scale-95">←</button>
              )}
              {imgViewerIdx < allImages.length - 1 && (
                <button onClick={() => setImgViewerIdx(i => i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold active:scale-95">→</button>
              )}
            </div>
          </div>
        );
      })(), document.body)}

    </div>
  );
}

// ─── Main App ───
