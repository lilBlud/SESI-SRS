import React, { useState, useEffect } from 'react';
import { CorporatePerformanceChart, PostImageSlider } from '../ui/UIComponents';
import { API_BASE, currentMonth, CATEGORIES, CAT_COLORS, getColor, getCatMeta } from '../../utils/constants';
import { saveImage } from '../ui/Icons';

export function HomeTab({ user, glossary, setActiveTab, setActiveGlossaryCat, isDark, bookmarkActions }) {
  const { isBookmarked, toggleBookmark } = bookmarkActions;
  const [posts, setPosts] = useState([]);
  const [postCat, setPostCat] = useState('All');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLb, setLoadingLb] = useState(true);
  const [showFullLb, setShowFullLb] = useState(false);
  const [imgViewerPost, setImgViewerPost] = useState(null); // { images, idx }
  const USERNAME = user?.fullName || "Ahmad Azib Danish";

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
        style={{ backgroundImage: `url('/assets/${isDark ? 'pattern_dark.png' : 'pattern_light.png'}')` }}>

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

      {/* ── Corporate Performance Slider ── */}
      {(glossary || []).filter(item => item.cat === 'Corporate Performance').length > 0 && (
        <div className="mb-6 -mx-4 sm:mx-0">
          <div className="flex items-center justify-between mb-1 px-6 sm:px-0">
            <h2 className="text-[15px] font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              Corporate Performance
            </h2>
            <button 
              onClick={() => { setActiveGlossaryCat('Corporate Performance'); setActiveTab('glossary'); }}
              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
          <div 
            className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x snap-mandatory scrollbar-hide px-[6vw] md:px-[calc(50%-175px)] items-stretch" 
            style={{ WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '6vw' }}
          >
            {(glossary || []).filter(item => item.cat === 'Corporate Performance').map(item => (
              <div key={item.id || item.term} className="snap-center shrink-0 w-[88vw] sm:w-[350px] flex">
                <div className="-mt-4 w-full h-full flex flex-col">
                  <CorporatePerformanceChart chartData={item.chartData} term={item.term} description="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Leaderboard on Home ── */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Leaderboard Rich 3D Trophy SVG */}
            <div className="relative w-9 h-9 flex items-center justify-center overflow-visible">
              <svg className="w-8 h-8 animate-trophy-bounce z-10 overflow-visible" viewBox="0 0 32 32" fill="none" style={{ filter: 'drop-shadow(0px 4px 3px rgba(0,0,0,0.3))' }}>
                <defs>
                  <linearGradient id="goldGleamLb" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ca8a04" />
                    <stop offset="20%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="80%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#854d0e" />
                  </linearGradient>
                  <linearGradient id="goldBaseLb" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a16207" />
                    <stop offset="50%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#713f12" />
                  </linearGradient>
                </defs>

                {/* Handles */}
                <path d="M7 11 C 1 9 1 18 11 16.5" fill="none" stroke="url(#goldBaseLb)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M25 11 C 31 9 31 18 21 16.5" fill="none" stroke="url(#goldBaseLb)" strokeWidth="2.5" strokeLinecap="round" />

                {/* Base */}
                <path d="M10 24 h12 l2 3 h-16 z" fill="#334155" />
                <path d="M8 27 h16 v2 c0 1 -1 1 -1 1 H9 c-1 0 -1 0 -1 -1 v-2 z" fill="#0f172a" />
                <rect x="14" y="27.5" width="4" height="1.5" fill="#fef08a" />

                {/* Stem */}
                <path d="M14 18 h4 l1 6 h-6 z" fill="url(#goldBaseLb)" />
                <rect x="13.5" y="17" width="5" height="1.5" fill="#fef08a" rx="0.5" />

                {/* Cup Body */}
                <path d="M7 7 C 7 16 12 18 14 18 h4 C 20 18 25 16 25 7 Z" fill="url(#goldGleamLb)" />

                {/* Cup Lip */}
                <ellipse cx="16" cy="7" rx="9" ry="2.5" fill="#fef9c3" />
                <ellipse cx="16" cy="7" rx="7.5" ry="1.5" fill="#a16207" opacity="0.8" />

                {/* Engraved Star */}
                <polygon points="16 11 16.5 12.5 18 12.5 16.8 13.5 17.2 15 16 14 14.8 15 15.2 13.5 14 12.5 15.5 12.5" fill="#fef9c3" opacity="0.9" />
              </svg>
              {/* Confetti Particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-sm animate-confetti-pop" style={{ '--tx': '-15px', '--ty': '-18px', '--rot': '-45deg' }}></div>
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-sm animate-confetti-pop" style={{ '--tx': '15px', '--ty': '-15px', '--rot': '45deg', animationDelay: '0.1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-2 bg-indigo-400 rounded-sm animate-confetti-pop" style={{ '--tx': '-12px', '--ty': '14px', '--rot': '90deg', animationDelay: '0.2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-1 bg-emerald-400 rounded-sm animate-confetti-pop" style={{ '--tx': '12px', '--ty': '10px', '--rot': '135deg', animationDelay: '0.05s' }}></div>
              </div>
            </div>
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
          filteredPosts.map(post => {
            // Collect all images: primary + additional
            const allImages = [];
            if (post.imageUrl) allImages.push(post.imageUrl);
            if (post.additionalImages) {
              try {
                const parsed = typeof post.additionalImages === 'string' ? JSON.parse(post.additionalImages) : post.additionalImages;
                if (Array.isArray(parsed)) allImages.push(...parsed);
              } catch (e) { }
            }
            const catMeta = getCatMeta(post.category || 'General');
            const clr = getColor(post.category || 'General');
            return (
              <div key={post.id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/10 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <span className={`text-[10px] ${clr.text} font-bold uppercase mb-1.5 inline-flex items-center gap-1`}>
                      {catMeta.emoji} {post.category || 'General'}
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

                {/* Image gallery - supports multiple images */}
                {allImages.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <PostImageSlider images={allImages} title={post.title} onImageClick={(idx) => setImgViewerPost({ images: allImages, idx })} />
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {allImages.length > 0 && (
                      <button onClick={() => saveImage(allImages[0], `${post.title.replace(/\s+/g, '_')}.png`)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl transition-all active:scale-95">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Save Image
                      </button>
                    )}
                    {allImages.length > 1 && (
                      <span className="text-[10px] text-slate-400 font-medium">{allImages.length} images</span>
                    )}
                  </div>
                  <button onClick={() => toggleBookmark(post, 'poster')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-95 text-[11px] font-bold ${isBookmarked(post.id, 'poster') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                    <svg className="w-3.5 h-3.5" fill={isBookmarked(post.id, 'poster') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    {isBookmarked(post.id, 'poster') ? 'Saved' : 'Bookmark'}
                  </button>
                </div>
              </div>
            );
          })
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
                <div key={idx} className={`px-4 py-3 rounded-2xl flex items-center gap-4 transition-all shadow-sm ${idx === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200/50 dark:border-amber-800/50' :
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

      {/* Image Viewer Modal */}
      {imgViewerPost && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col bg-black animate-fadeIn" onClick={() => setImgViewerPost(null)}>
          <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),16px)] pb-2 z-10">
            <button onClick={() => setImgViewerPost(null)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform">
              <span className="text-xl leading-none font-bold">←</span>
            </button>
            <span className="text-white/70 text-[13px] font-bold">{imgViewerPost.idx + 1} / {imgViewerPost.images.length}</span>
            <button onClick={(e) => { e.stopPropagation(); saveImage(imgViewerPost.images[imgViewerPost.idx], 'sesi-post.png'); }} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 relative" onClick={(e) => e.stopPropagation()}>
            <img src={imgViewerPost.images[imgViewerPost.idx]} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
            {imgViewerPost.idx > 0 && (
              <button onClick={() => setImgViewerPost(p => ({ ...p, idx: p.idx - 1 }))} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold active:scale-95">←</button>
            )}
            {imgViewerPost.idx < imgViewerPost.images.length - 1 && (
              <button onClick={() => setImgViewerPost(p => ({ ...p, idx: p.idx + 1 }))} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold active:scale-95">→</button>
            )}
          </div>
          {/* Thumbnail strip at bottom */}
          {imgViewerPost.images.length > 1 && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 pb-[max(env(safe-area-inset-bottom),16px)]">
              {imgViewerPost.images.map((img, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setImgViewerPost(p => ({ ...p, idx: i })); }} className={`w-12 h-12 rounded-lg overflow-hidden ring-2 transition-all ${i === imgViewerPost.idx ? 'ring-white scale-110' : 'ring-transparent opacity-50'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}



// ─── Glossary Tab ───
