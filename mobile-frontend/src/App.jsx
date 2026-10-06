import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import AdminTab from './AdminTab';

const API_BASE = `http://${window.location.hostname}:5195`;
const currentMonth = new Date().toISOString().slice(0, 7);

// ─── Category Config (colours, emoji, labels) ───
const CATEGORIES = [
  { key: 'All', label: 'All Categories', emoji: '📚', color: 'slate' },
  { key: 'IBR Framework', label: 'IBR Framework', emoji: '⚡', color: 'blue' },
  { key: 'Strategy and Sustainability', label: 'Strategy & Sustainability', emoji: '🎯', color: 'violet' },
  { key: 'Energy Market and Industry', label: 'Energy Market & Industry', emoji: '🔋', color: 'amber' },
  { key: 'ESG', label: 'ESG', emoji: '🌱', color: 'green' },
  { key: 'EPSB', label: 'EPSB', emoji: '🔌', color: 'cyan' },
  { key: 'BDV', label: 'BDV', emoji: '🔬', color: 'rose' },
  { key: 'Governance', label: 'Governance', emoji: '🏛️', color: 'indigo' },
  { key: 'Corporate Performance', label: 'Corporate Performance', emoji: '📊', color: 'orange' },
  { key: 'ISO Management', label: 'ISO Management', emoji: '🏅', color: 'teal' },
  { key: 'SE Risk', label: 'Sabah Electricity Risks', emoji: '⚠️', color: 'red' },
  { key: 'ReSET2030', label: 'ReSET2030', emoji: '🔄', iconImage: '/@fs/C:/Users/User/.gemini/antigravity-ide/brain/64e02f0e-9a34-4ae4-a35c-a08ed77461c3/.user_uploaded/media_1791251781865.png', color: 'sky' },
];

const getCatMeta = (catKey) => CATEGORIES.find(c => c.key === catKey) || CATEGORIES[0];

const CAT_COLORS = {
  'IBR Framework': { bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', pill: 'bg-blue-500', gradient: 'from-blue-500 to-blue-700' },
  'Strategy and Sustainability': { bg: 'bg-violet-100 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800', pill: 'bg-violet-500', gradient: 'from-violet-500 to-violet-700' },
  'Energy Market and Industry': { bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', pill: 'bg-amber-500', gradient: 'from-amber-500 to-amber-700' },
  'ESG': { bg: 'bg-green-100 dark:bg-green-950/40', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800', pill: 'bg-green-500', gradient: 'from-green-500 to-green-700' },
  'EPSB': { bg: 'bg-cyan-100 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', pill: 'bg-cyan-500', gradient: 'from-cyan-500 to-cyan-700' },
  'BDV': { bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', pill: 'bg-rose-500', gradient: 'from-rose-500 to-rose-700' },
  'Governance': { bg: 'bg-indigo-100 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', pill: 'bg-indigo-500', gradient: 'from-indigo-500 to-indigo-700' },
  'Corporate Performance': { bg: 'bg-orange-100 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', pill: 'bg-orange-500', gradient: 'from-orange-500 to-orange-700' },
  'ISO Management': { bg: 'bg-teal-100 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', pill: 'bg-teal-500', gradient: 'from-teal-500 to-teal-700' },
  'SE Risk': { bg: 'bg-red-100 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', pill: 'bg-red-500', gradient: 'from-red-500 to-red-700' },
  'ReSET2030': { bg: 'bg-sky-100 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', pill: 'bg-sky-500', gradient: 'from-sky-500 to-sky-700' },
};
const getColor = (cat) => CAT_COLORS[cat] || { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700', pill: 'bg-slate-500', gradient: 'from-slate-500 to-slate-700' };

// ─── SVG Icons ───
const HomeIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BookIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const QuizIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ProfileIcon = ({ active }) => (
  <svg className={`w-6 h-6 ${active ? 'text-emerald-500' : 'text-slate-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// ─── Animated Background Particles ───
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="floating-particle" style={{
          left: `${10 + i * 16}%`,
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${4 + i * 0.5}s`,
        }}>
          <div className={`w-${2 + (i % 3)} h-${2 + (i % 3)} rounded-full bg-emerald-400/20`}></div>
        </div>
      ))}
    </div>
  );
}

// ─── Home Tab ───
function HomeTab({ setActiveTab, setActiveGlossaryCat, isDark }) {
  const [posts, setPosts] = useState([]);
  const [postCat, setPostCat] = useState('All');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLb, setLoadingLb] = useState(true);
  const [showFullLb, setShowFullLb] = useState(false);
  const USERNAME = "Ahmad Azib Danish";

  const postCatCounts = posts.reduce((acc, p) => {
    const c = p.category || 'General';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const filteredPosts = postCat === 'All' ? posts : posts.filter(p => (p.category || 'General') === postCat);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/infographics`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(console.error);

    fetch(`${API_BASE}/api/leaderboard/${currentMonth}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => { 
        // Inject mock Kahoot podium data if the DB doesn't have enough entries
        if (data.length < 3) {
          data = [
            { username: "Cameron", score: 4201, division: "Sales Division" },
            { username: "Ka", score: 3912, division: "HR Division" },
            { username: "Evelien", score: 2926, division: "IT Division" },
            { username: "QuizWiz", score: 2800, division: "Marketing" },
            { username: "CoolCat", score: 2500, division: "Finance" },
            { username: "Ahmad", score: 1920, division: "Strategic Planning" },
            { username: "Sarah", score: 1850, division: "Operations" },
            { username: "John", score: 1500, division: "HR Division" }
          ];
        }
        setLeaderboard(data); 
        setLoadingLb(false); 
      })
      .catch(() => setLoadingLb(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-5 animate-slideUp">
      {/* ── Hero Banner (Sleek Glassmorphism Split) ── */}
      <div className="relative rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden mb-6 bg-cover bg-center ring-1 ring-black/5 dark:ring-white/10"
        style={{ backgroundImage: `url('/@fs/C:/Users/User/.gemini/antigravity-ide/brain/29a0a901-89c7-44bb-b8ba-d27e704d88a7/.user_uploaded/${isDark ? 'media_1791169498492.png' : 'media_1791171890246.png'}')` }}>

        {/* Animated Glowing Overlay */}
        <div className="absolute inset-0 bg-emerald-500/20 mix-blend-normal dark:bg-emerald-400/60 dark:mix-blend-color-dodge animate-pulse-slow pointer-events-none"></div>
        
        {/* Scanning Light Beam (Hardware Accelerated) */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none animate-scanline opacity-60 mix-blend-normal dark:mix-blend-color-dodge dark:opacity-70"
          style={{
            backgroundImage: 'linear-gradient(to bottom right, transparent 40%, rgba(16,185,129,0.8) 50%, transparent 60%)'
          }}>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 pt-5 min-h-[170px]">
          <h1 className="text-[24px] font-black tracking-tight leading-tight text-slate-900 dark:text-white dark:[text-shadow:_0_2px_15px_rgb(0_0_0_/_1),_0_1px_2px_rgb(0_0_0_/_1)]">
            Welcome back, {USERNAME.split(' ')[0]}!
          </h1>
          <p className="text-emerald-700 dark:text-[#a0e8c5] text-[13px] mt-1.5 leading-relaxed font-bold dark:[text-shadow:_0_1px_4px_rgb(0_0_0_/_1)]">
            Energy Transition & Regulatory updates.
          </p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setActiveTab('glossary')} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 dark:bg-white dark:hover:bg-slate-50 dark:active:bg-slate-100 text-white dark:text-emerald-700 text-[13px] font-black rounded-full shadow-[0_4px_15px_rgba(16,185,129,0.3)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all flex items-center gap-1.5">
              📖 Dictionary
            </button>
            <button onClick={() => setActiveTab('quiz')} className="px-5 py-2.5 bg-slate-900/5 hover:bg-slate-900/10 active:bg-slate-900/15 dark:bg-black/20 dark:hover:bg-black/30 dark:active:bg-black/40 text-slate-800 dark:text-white text-[13px] font-bold rounded-full border border-slate-900/10 dark:border-white/30 backdrop-blur-md shadow-sm transition-all">
              Monthly Quiz
            </button>
          </div>
        </div>
      </div>



      {/* ── Leaderboard on Home ── */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-bounce-slow">🏆</div>
            <div>
              <h2 className="text-[16px] font-black text-white tracking-tight">Monthly Leaderboard</h2>
              <p className="text-white/70 text-[11px] font-medium">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <button onClick={() => setShowFullLb(true)} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold rounded-lg backdrop-blur-sm transition-all">
            View All →
          </button>
        </div>

        <div className="p-4">
          {loadingLb ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm">
              <div className="text-3xl mb-2">🎯</div>
              No entries yet — be the first to take the quiz!
            </div>
          ) : (
            <>
              {/* Podium */}
              <div className="grid grid-cols-3 items-end gap-2 pt-4 px-1">
                {/* 2nd Place */}
                <div className="w-full">
                  {leaderboard.length > 1 && (
                    <div className="flex flex-col items-center justify-end relative">
                      <div className="text-[12px] font-black text-slate-800 dark:text-white w-full text-center px-1 mb-1 truncate">
                        {leaderboard[1].username.split(' ')[0]}
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-[14px] shadow-lg relative z-10 -mb-5 border-2 border-white dark:border-slate-900 bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 shadow-slate-400/40 animate-bounce-slow [animation-delay:150ms]">
                        {leaderboard[1].username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="w-full rounded-t-lg flex flex-col items-center pt-7 pb-2 shadow-inner transition-all h-20 bg-gradient-to-b from-slate-200 to-slate-50 dark:from-slate-600/40 dark:to-slate-800/10 border-t-2 border-slate-300 dark:border-slate-500">
                        <div className="font-black text-[14px] text-slate-800 dark:text-white leading-none">{leaderboard[1].score}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 1st Place */}
                <div className="w-full">
                  {leaderboard.length > 0 && (
                    <div className="flex flex-col items-center justify-end relative">
                      <div className="absolute -top-5 text-lg animate-bounce z-20 drop-shadow-md">👑</div>
                      <div className="text-[13px] font-black text-slate-800 dark:text-white w-full text-center px-1 mb-1 truncate">
                        {leaderboard[0].username.split(' ')[0]}
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-[16px] shadow-lg relative z-10 -mb-5 border-2 border-white dark:border-slate-900 bg-gradient-to-br from-yellow-300 to-amber-500 text-white shadow-amber-500/40 animate-bounce-slow">
                        {leaderboard[0].username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="w-full rounded-t-lg flex flex-col items-center pt-7 pb-2 shadow-inner transition-all h-28 bg-gradient-to-b from-amber-200 to-amber-50 dark:from-amber-600/40 dark:to-amber-900/10 border-t-2 border-amber-300 dark:border-amber-500">
                        <div className="font-black text-[15px] text-slate-800 dark:text-white leading-none">{leaderboard[0].score}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3rd Place */}
                <div className="w-full">
                  {leaderboard.length > 2 && (
                    <div className="flex flex-col items-center justify-end relative">
                      <div className="text-[12px] font-black text-slate-800 dark:text-white w-full text-center px-1 mb-1 truncate">
                        {leaderboard[2].username.split(' ')[0]}
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-[14px] shadow-lg relative z-10 -mb-5 border-2 border-white dark:border-slate-900 bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-orange-500/40 animate-bounce-slow [animation-delay:300ms]">
                        {leaderboard[2].username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="w-full rounded-t-lg flex flex-col items-center pt-7 pb-2 shadow-inner transition-all h-16 bg-gradient-to-b from-orange-200 to-orange-50 dark:from-orange-600/40 dark:to-orange-900/10 border-t-2 border-orange-300 dark:border-orange-500">
                        <div className="font-black text-[14px] text-slate-800 dark:text-white leading-none">{leaderboard[2].score}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Runners up */}
              {leaderboard.length > 3 && (
                <div className="mt-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-2.5 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1">Runners-up</div>
                  {leaderboard.slice(3, 5).map((entry, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-800 px-3 py-2.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300 shadow-inner">
                          {idx + 4}
                        </div>
                        <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{entry.username}</div>
                      </div>
                      <div className="text-[13px] font-black text-emerald-600 dark:text-emerald-400">{entry.score} <span className="text-[9px] text-slate-400 uppercase">pts</span></div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Category Quick Access ── */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10">
        <h3 className="text-[13px] font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-base">📂</span> Browse by Category
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.slice(1).map(cat => {
            const clr = getColor(cat.key);
            return (
              <button key={cat.key} onClick={() => { if (setActiveGlossaryCat) setActiveGlossaryCat(cat.key); setActiveTab('glossary'); }} className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all active:scale-95 hover:shadow-md ${clr.bg} border ${clr.border}`}>
                <div className="w-6 flex items-center justify-center shrink-0">
                  {cat.iconImage ? (
                    <img src={cat.iconImage} alt={cat.label} className="h-6 w-auto object-contain scale-[1.5]" />
                  ) : (
                    <span className="text-lg">{cat.emoji}</span>
                  )}
                </div>
                <span className={`text-[11px] font-bold ${clr.text} leading-tight`}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Posts ── */}
      <div id="posts" className="scroll-mt-28 space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[13px] font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-base">📰</span> Latest Posts
          </h3>
          <span className="text-xs font-semibold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
            {filteredPosts.length} posts
          </span>
        </div>

        {/* Post Category Dropdown */}
        <div className="px-4 mb-2">
          <div className="relative">
            <select
              value={postCat}
              onChange={(e) => setPostCat(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[13px] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              {CATEGORIES.map(c => {
                const count = c.key === 'All' ? posts.length : (postCatCounts[c.key] || 0);
                if (count === 0 && c.key !== 'All') return null; // Hide empty categories
                return (
                  <option key={c.key} value={c.key}>
                    {c.emoji} {c.label} ({count})
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-8 text-center text-slate-400 font-medium border border-dashed border-slate-200 dark:border-slate-700 mx-4">
            No posts available in this category.
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase mb-1.5 inline-block border border-emerald-200 dark:border-emerald-800/50">
                    {post.category || 'General'}
                  </span>
                  <h2 className="text-[19px] font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                    {post.title}
                  </h2>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap mt-1.5">
                  {new Date(post.postedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              
              {post.description && <p className="mt-3 text-[13px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{post.description}</p>}
              
              {post.imageUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10 shadow-inner group">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer" loading="lazy" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Full Leaderboard Modal */}
      {showFullLb && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-100 dark:bg-slate-900 animate-slideUp">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-4 pb-4 pt-[max(env(safe-area-inset-top),32px)] flex items-center shadow-md z-10 relative">
            <button onClick={() => setShowFullLb(false)} className="absolute left-4 top-[max(env(safe-area-inset-top),32px)] w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform" aria-label="Go back">
              <span className="text-xl leading-none font-bold">←</span>
            </button>
            <h2 className="text-lg font-black text-white w-full text-center">Full Leaderboard</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[max(env(safe-area-inset-bottom),24px)] space-y-3">
            {leaderboard.map((entry, idx) => {
              const isMe = entry.username === USERNAME;
              return (
                <div key={idx} className={`px-4 py-3 rounded-2xl flex items-center gap-4 transition-all shadow-sm ${
                  idx === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200/50 dark:border-amber-800/50' :
                  idx === 1 ? 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50' :
                  idx === 2 ? 'bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30' :
                  isMe ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800' :
                  'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
                }`}>
                  <div className="text-2xl font-black w-8 text-center shrink-0">
                    {idx < 3 ? medals[idx] : <span className="text-lg text-slate-400">#{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[15px] truncate text-slate-900 dark:text-white">{entry.username}</p>
                      {isMe && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">You</span>}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">{entry.division}</div>
                  </div>
                  <div className="font-black text-emerald-600 dark:text-emerald-400 text-[16px] whitespace-nowrap">
                    {entry.score} <span className="text-[10px] text-slate-400">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Glossary Tab ───
function GlossaryTab({ glossary, onStreakUpdate, activeGlossaryCat, setActiveGlossaryCat }) {
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
  const USERNAME = "Ahmad Azib Danish";

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
            Definitions, formulas & acronyms across all divisions 🔥
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
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pb-1 category-scroll">
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
                  <div className={`w-12 h-12 ${clr.bg} ${clr.text} rounded-xl flex items-center justify-center font-black text-[15px] font-mono shrink-0`}>
                    {item.term.length > 4 ? item.term.slice(0, 3) : item.term}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-[15px] text-slate-900 dark:text-white">{item.term}</h3>
                      <span className={`text-[9px] font-bold ${clr.pill} text-white px-1.5 py-0.5 rounded-full`}>
                        {catMeta.emoji} {item.cat}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{item.full}</p>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                    <h4 className={`text-[14px] font-bold ${clr.text} mt-3`}>{item.full}</h4>
                    <div className="mt-2">
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Definition</span>
                       <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                    </div>

                    {/* Formula Display */}
                    {item.formula && (
                      <div className={`mt-3 ${clr.bg} border ${clr.border} rounded-xl p-3`}>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">📐 Formula / Reference</div>
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

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">✓ Read</span>
                      <span>Counts toward your daily streak!</span>
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
                      <div className={`font-bold font-mono ${clr.text}`}>{item.term}</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">{item.full}</div>
                      <span className={`text-[9px] font-bold ${clr.pill} text-white px-1.5 py-0.5 rounded-full mt-1 inline-block`}>{item.cat}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 align-top">
                      {item.desc}
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
                  <div className={`mt-4 text-[10px] font-bold ${getColor(card.cat).pill} text-white px-3 py-1 rounded-full`}>
                    {getCatMeta(card.cat).emoji} {card.cat}
                  </div>
                </div>
                <div className={`flashcard-back absolute w-full h-full flex flex-col items-center justify-center ${getColor(card.cat).bg} rounded-2xl p-6 text-center overflow-y-auto`}>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{card.full}</h3>
                  <p className="text-[13px] text-slate-600 dark:text-slate-300">{card.desc}</p>
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
                  <div className="mt-3 text-[11px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">✓ Streak counted!</div>
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

function QuizTab({ streak, setActiveTab, onStreakUpdate }) {
  const [state, setState] = useState('idle'); // idle | loading | active | review | leaderboard
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0); // This is now total points
  const [qStartTime, setQStartTime] = useState(0);

  const USERNAME = "Ahmad Azib Danish"; // Simulated logged-in user
  const DIVISION = "Strategic Planning Division"; // Simulated division

  // Fetch Monthly questions
  const startQuiz = async () => {
    setState('loading');
    try {
      const res = await fetch(`${API_BASE}/api/quiz/${currentMonth}`);
      const data = await res.json();
      if (!data || data.length === 0) {
        alert("No questions available for this month yet. Check back later!");
        setState('idle');
        return;
      }
      setQuestions(data.sort(() => Math.random() - 0.5));
      setState('active');
      setCurrentQ(0);
      setSelected(null);
      setAnswered(false);
      setAnswers([]);
      setScore(0);
      setQStartTime(Date.now());
    } catch (e) {
      console.error(e);
      alert("Network Error: " + e.message + ". Make sure backend is running and accessible.");
      setState('idle');
    }
  };



  const selectAnswer = async (idx) => {
    if (answered) return;

    const timeTakenMs = Date.now() - qStartTime;
    const timeTakenSeconds = Math.floor(timeTakenMs / 1000);

    setSelected(idx);
    setAnswered(true);
    const q = questions[currentQ];
    const isCorrect = idx === q.correctIndex;

    let pointsAwarded = 0;
    if (isCorrect) {
      pointsAwarded = Math.max(500, 1000 - (timeTakenSeconds * 10)); // max 1000, min 500
      setScore(s => s + pointsAwarded);
    }

    setAnswers(prev => [...prev, { questionId: q.id, selected: idx, correct: q.correctIndex, isCorrect, points: pointsAwarded }]);

    fetch(`${API_BASE}/api/submit-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Username: USERNAME,
        Division: DIVISION,
        Month: currentMonth,
        QuestionId: q.id,
        QuestionText: q.question,
        SelectedOption: q.options[idx],
        IsCorrect: isCorrect,
        TimeTakenSeconds: timeTakenSeconds,
        PointsAwarded: pointsAwarded
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          alert("Failed to save answer: " + res.status + " " + text);
        } else {
          fetch(`${API_BASE}/api/streak/record`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: USERNAME })
          }).then(r => r.ok && r.json()).then(data => {
            if (data && onStreakUpdate) onStreakUpdate(data.streak, data.recorded);
          }).catch(()=>{});
        }
      })
      .catch(e => alert("Network error saving answer: " + e.message));
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setQStartTime(Date.now());
    } else {
      setState('review');
    }
  };

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-slideUp">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  // ─ Idle Screen ─
  if (state === 'idle') {
    return (
      <div className="animate-slideUp space-y-5">
        <div className="text-center pt-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-4">Monthly Knowledge Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-1.5">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Quiz</p>
        </div>

        {/* Streak Banner */}
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${streak > 0 ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
          <div className="text-3xl">{streak > 0 ? '🔥' : '💤'}</div>
          <div>
            <div className="font-black text-[15px] text-slate-900 dark:text-white">
              {streak > 0 ? `${streak}-Day Streak!` : 'No Streak Yet'}
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">
              {streak > 0 ? 'Keep reading daily to maintain your streak!' : 'Tap terms in the Dictionary to start your streak.'}
            </p>
          </div>
          {streak >= 7 && <div className="ml-auto text-[11px] bg-orange-500 text-white px-2 py-1 rounded-full font-bold">🏆 Week!</div>}
        </div>

        <div className="space-y-3">
          <button
            onClick={startQuiz}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-5 shadow-lg shadow-emerald-500/25 text-left active:scale-[0.98] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[16px] font-bold">Start Monthly Quiz</span>
              <p className="text-[13px] text-emerald-100 mt-1">Test your knowledge for this month</p>
            </div>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
          </button>


        </div>
      </div>
    );
  }



  // ─ Active Quiz ─
  if (state === 'active') {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <div className="animate-fadeIn space-y-5">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setState('idle')} className="flex items-center text-[12px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg> Quit
          </button>
          <span className="text-[12px] font-bold text-slate-500">Question {currentQ + 1}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-[17px] font-bold leading-snug">{q.question}</h3>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let styles = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
            if (answered) {
              if (idx === q.correctIndex) styles = 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300';
              else if (idx === selected) styles = 'bg-red-50 border-red-500 text-red-800 dark:bg-red-950/30 dark:text-red-300';
              else styles = 'opacity-50';
            }

            return (
              <button key={idx} onClick={() => selectAnswer(idx)} disabled={answered} className={`w-full text-left p-4 rounded-2xl border-2 text-[15px] font-medium transition-all ${styles}`}>
                <div className="flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold mr-3 shrink-0 ${answered && idx === q.correctIndex ? 'bg-emerald-500 text-white' : answered && idx === selected ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {answered && idx === q.correctIndex ? '✓' : answered && idx === selected ? '✗' : String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-6 animate-scaleIn space-y-3">
            <div className={`text-center font-black text-xl ${answers[answers.length - 1]?.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
              +{answers[answers.length - 1]?.points || 0} Points
            </div>
            <button onClick={nextQuestion} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl shadow-lg">
              {currentQ < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─ Review Screen ─
  if (state === 'review') {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const pct = Math.round((correctCount / questions.length) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '📚';
    return (
      <div className="animate-slideUp space-y-5 text-center">
        <div className="pt-6">
          <div className="text-5xl mb-4 animate-bounce-slow">{emoji}</div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
            <span className="text-3xl font-black text-white">{pct}%</span>
          </div>
          <h2 className="text-2xl font-black mt-4">Quiz Completed!</h2>
          <p className="text-slate-500 text-[14px] mt-1">You earned <span className="font-bold text-emerald-600">{score} pts</span> ({correctCount} / {questions.length} correct)</p>
        </div>

        {/* Streak update */}
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex items-center justify-center gap-3">
          <span className="text-2xl">🔥</span>
          <div className="text-left">
            <div className="font-black text-[15px]">{streak}-Day Streak</div>
            <div className="text-[12px] text-slate-500">Keep it going tomorrow!</div>
          </div>
        </div>


        <button onClick={() => setState('idle')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl">
          Back to Hub
        </button>
      </div>
    );
  }
}

function ProfileTab() {
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [currentRank, setCurrentRank] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(''); // empty = All time
  const [activeMonths, setActiveMonths] = useState([]);
  const USERNAME = "Ahmad Azib Danish";

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
  }, []);

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
  }, [filterMonth]);

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
          <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
            <img src={`/@fs/C:/Users/User/.gemini/antigravity-ide/brain/a5279ace-f008-468b-b7a8-4b9b95e590f6/.user_uploaded/media_1790819018175.jpg`} alt="Ahmad Azib Danish" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Ahmad Azib Danish</h2>
            <div className="flex flex-col mt-0.5">
              <span className="text-emerald-100 text-[12px] font-medium">Strategic Planning Division</span>
              <span className="text-emerald-200/80 text-[11px]">EMP-8492</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Total Score & Standing */}
      {!loading && (
        <div className="flex gap-3">
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Score</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-0.5">
                {totalScore}
              </p>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl">
              🏆
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
          <div className="space-y-3">
            {recentQuizzes.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                {filterMonth ? `No questions answered in ${formatMonth(filterMonth)}.` : "You haven't answered any questions yet."}
              </div>
            ) : (
              recentQuizzes.map((ans, idx) => {
                const date = new Date(ans.dateAnswered).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <div key={idx} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight pr-4">
                        {ans.questionText}
                      </div>
                      <div className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${ans.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {ans.isCorrect ? 'Correct' : 'Wrong'}
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-1">
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
    </div>
  );
}

// ─── Main App ───
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeGlossaryCat, setActiveGlossaryCat] = useState('All');
  const [isDark, setIsDark] = useState(false);
  const [glossary, setGlossary] = useState([]);
  const [streak, setStreak] = useState(0);
  const [streakToast, setStreakToast] = useState(null); // toast notification at root level
  const USERNAME = "Ahmad Azib Danish";

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // Fetch glossary from DB
  const fetchGlossary = useCallback(() => {
    fetch(`${API_BASE}/api/glossary`)
      .then(r => r.json())
      .then(d => setGlossary(d))
      .catch(e => console.error(e));
  }, []);

  useEffect(() => { fetchGlossary(); }, [fetchGlossary]);

  // Fetch streak on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/streak/${encodeURIComponent(USERNAME)}`)
      .then(r => r.ok ? r.json() : { streak: 0 })
      .then(d => setStreak(d.streak || 0))
      .catch(() => { });
  }, []);

  const [hasShownAlreadySaved, setHasShownAlreadySaved] = useState(false);

  // Handle streak updates from child components
  const handleStreakUpdate = (newStreak, newlyRecorded = false) => {
    setStreak(newStreak);
    if (newlyRecorded) {
      setStreakToast(`🔥 Daily streak recorded! Day ${newStreak}`);
      setTimeout(() => setStreakToast(null), 3000);
    } else if (!hasShownAlreadySaved) {
      setStreakToast(`🔥 Streak already saved for today! Day ${newStreak}`);
      setHasShownAlreadySaved(true);
      setTimeout(() => setStreakToast(null), 3000);
    }
  };

  const tabs = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'glossary', label: 'Dictionary', Icon: BookIcon },
    { id: 'quiz', label: 'Hub', Icon: QuizIcon },
    { id: 'profile', label: 'Profile', Icon: ProfileIcon },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-200 w-full max-w-[430px] xl:max-w-none mx-auto relative shadow-2xl bg-cover bg-center bg-fixed bg-no-repeat"
         style={{ backgroundImage: `url('/@fs/C:/Users/User/.gemini/antigravity-ide/brain/29a0a901-89c7-44bb-b8ba-d27e704d88a7/.user_uploaded/${isDark ? 'media_1791170397543.png' : 'media_1791169829651.png'}')` }}>



      {/* Root level Toast Notification */}
      {streakToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-orange-500 text-white px-5 py-3 rounded-2xl shadow-xl shadow-orange-500/30 text-[13px] font-bold animate-scaleIn whitespace-nowrap">
          {streakToast}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 safe-area-top shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">

          {/* ─── LOGO AREA ─── */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-slate-200 dark:border-slate-800">
              <img src={`/@fs/C:/Users/User/.gemini/antigravity-ide/brain/95fe2e2f-feb8-4f19-bdf8-1c99180fb6cf/.user_uploaded/media_1790929057227.jpg`} alt="S&S Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[20px] font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                SESI
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 leading-none tracking-tight">
                Sabah Electricity Supply Industry
              </span>
            </div>
          </div>

          {/* ─── ACTIONS AREA ─── */}
          <div className="flex items-center gap-2">

            {/* Streak Badge */}
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 border border-orange-200/50 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 px-2.5 py-1.5 rounded-full shadow-sm shrink-0">
                <span className="text-[12px] leading-none">🔥</span>
                <span className="text-[13px] font-black leading-none">{streak}</span>
              </div>
            )}

            {/* Settings/Theme Pill Group */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-full p-1 border border-slate-200/50 dark:border-slate-700/50 shrink-0">

              {/* Admin Button */}
              <button onClick={() => setActiveTab('admin')} className="w-8 h-8 flex items-center justify-center rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all relative">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {/* Small indicator dot to make it pop */}
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border-[1.5px] border-slate-100 dark:border-slate-800"></div>
              </button>

              {/* Dark Mode Toggle */}
              <button onClick={() => setIsDark(!isDark)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all hover:text-slate-900 dark:hover:text-white">
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-container px-4 pt-4 pb-28">
        {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} setActiveGlossaryCat={setActiveGlossaryCat} isDark={isDark} />}
        {activeTab === 'glossary' && <GlossaryTab glossary={glossary} onStreakUpdate={handleStreakUpdate} activeGlossaryCat={activeGlossaryCat} setActiveGlossaryCat={setActiveGlossaryCat} />}
        {activeTab === 'quiz' && <QuizTab streak={streak} setActiveTab={setActiveTab} onStreakUpdate={handleStreakUpdate} />}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'admin' && <AdminTab onGlossaryChange={fetchGlossary} />}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] xl:max-w-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-[68px] px-2">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1.5 space-y-0.5 rounded-xl ${activeTab === id ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'opacity-50'}`}>
              <Icon active={activeTab === id} />
              <span className={`text-[10px] font-bold ${activeTab === id ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
