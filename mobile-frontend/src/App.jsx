import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminTab from './AdminTab';
import LoginPage from './LoginPage';

const API_BASE = import.meta.env.VITE_API_BASE || "";
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

// ─── Save post image helper ───
async function saveImage(url, filename) {
  try {
    // Fetch the image as a blob to bypass cross-origin download restrictions
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Network error');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'sesi-post.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Failed to download image:', err);
    alert('Failed to save image automatically. You may need to right-click (or long-press) the image and save it manually.');
  }
}

// ─── Bookmarks Hook ───
function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('sesi_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const toggleBookmark = (item, type) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === item.id && b.type === type);
      let updated;
      if (exists) {
        updated = prev.filter(b => !(b.id === item.id && b.type === type));
      } else {
        updated = [{ ...item, type, bookmarkedAt: Date.now() }, ...prev];
      }
      localStorage.setItem('sesi_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (id, type) => {
    return bookmarks.some(b => b.id === id && b.type === type);
  };

  return { bookmarks, toggleBookmark, isBookmarked };
}

// ─── Post Image Slider ───
function PostImageSlider({ images, title, onImageClick }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setIdx(i => i === 0 ? images.length - 1 : i - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIdx(i => i === images.length - 1 ? 0 : i + 1);
  };

  return (
    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10 shadow-inner group">
      <img src={images[idx]} alt={`${title} ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer" loading="lazy" onClick={() => onImageClick(idx)} />

      {images.length > 1 && (
        <>
          <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm z-10">
            {idx + 1}/{images.length}
          </div>

          <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 active:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all active:scale-95 z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 active:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all active:scale-95 z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, dotIdx) => (
              <div key={dotIdx} className={`h-1.5 rounded-full transition-all duration-300 ${dotIdx === idx ? 'w-4 bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)]' : 'w-1.5 bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


// ─── Corporate Performance Chart ───
export function CorporatePerformanceChart({ chartData, term, description }) {
  const [selectedYear, setSelectedYear] = useState(null);

  if (!chartData) return null;
  let parsed = [];
  try {
    parsed = typeof chartData === 'string' ? JSON.parse(chartData) : chartData;
  } catch (e) {
    return null;
  }

  if (!Array.isArray(parsed) || parsed.length === 0) return null;

  // Map month names to numbers for sorting
  const monthMap = { 'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12 };
  
  // Get all unique years
  const allYears = [...new Set(parsed.map(d => parseInt(d.year)))].sort((a,b) => b-a);
  const activeYear = selectedYear || allYears[0];

  // Filter and sort for the active year
  const dataForYear = parsed.filter(d => parseInt(d.year) === activeYear);
  dataForYear.sort((a, b) => monthMap[a.month] - monthMap[b.month]);

  const formattedData = dataForYear.map(d => ({
    name: `${d.month}`,
    fullName: `${d.month} '${d.year.toString().slice(-2)}`,
    value: d.value
  }));

  const getUnitFormatter = (termName) => {
    if (!termName) return (v) => v;
    const name = termName.toUpperCase();
    if (name === "TOTAL REVENUE") return (v) => `RM ${v} bil`;
    if (["PAT", "EBIT", "CAPEX", "OPEX"].includes(name)) return (v) => `RM ${v} mil`;
    if (["SAIDI", "SYSTEM MINUTES", "SYSTEM UNIT"].includes(name)) return (v) => `${v} mins`;
    if (["SYSTEM LOSS", "ASSET CAPITALISATION", "AUDIT ISSUE"].includes(name)) return (v) => `${v}%`;
    if (name === "SAFETY" || name === "LTIFR") return (v) => `LTIFR ${v}`;
    return (v) => v;
  };

  const formatter = getUnitFormatter(term);

  const lastData = formattedData[formattedData.length - 1];
  const firstData = formattedData[0];
  const growth = firstData && firstData.value !== 0 
    ? ((lastData.value - firstData.value) / Math.abs(firstData.value)) * 100 
    : 0;
  const isPositive = growth >= 0;
  const isZero = growth === 0;

  // Custom dot rendering for each month
  const CustomDot = (props) => {
    const { cx, cy, index } = props;
    const isLast = index === formattedData.length - 1;
    if (cx === undefined || cy === undefined) return null;
    return (
      <circle 
        key={`dot-${index}`}
        cx={cx} 
        cy={cy} 
        r={isLast ? 5 : 4} 
        stroke="#ffffff" 
        strokeWidth={isLast ? 2.5 : 2} 
        fill="#10b981" 
      />
    );
  };

  // Custom active dot with a beautiful pulse effect for interaction
  const CustomActiveDot = (props) => {
    const { cx, cy } = props;
    if (cx === undefined || cy === undefined) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={14} fill="#10b981" fillOpacity={0.2} className="animate-ping" />
        <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="#ffffff" strokeWidth={2.5} />
      </g>
    );
  };

  // Custom stylish tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/60 shadow-lg flex flex-col z-50">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-0.5">{payload[0].payload.fullName}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <p className="text-white font-black text-[13px] tracking-tight">
              {formatter(payload[0].value)}
            </p>
          </div>
          <p className="text-emerald-500 text-[8px] font-bold uppercase mt-px ml-3 tracking-wider">{term}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="mt-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm animate-fadeIn relative overflow-hidden group focus:outline-none"
      onClick={(e) => e.stopPropagation()}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      
      {/* Decorative gradient orb for premium feel */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>

      {/* Header section matching the aesthetic */}
      <div className="flex items-end justify-between mb-4 relative z-10">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{term}</span>
            {/* Dropdown Year Filter */}
            {allYears.length > 0 && (
              <div className="relative inline-block focus:outline-none" onClick={(e) => e.stopPropagation()}>
                <select 
                  value={activeYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-full pl-2.5 pr-6 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer"
                >
                  {allYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[28px] font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">
              {formatter(lastData?.value ?? 0)}
            </span>
            {!isZero && (
              <span className={`text-[13px] font-bold flex items-center px-1.5 py-0.5 rounded-md ${isPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                <svg className={`w-3.5 h-3.5 mr-0.5 ${!isPositive ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3.25a.75.75 0 01.53.22l5 5a.75.75 0 11-1.06 1.06L10.75 5.81v10.44a.75.75 0 01-1.5 0V5.81L5.53 9.53a.75.75 0 01-1.06-1.06l5-5a.75.75 0 01.53-.22z" clipRule="evenodd" />
                </svg>
                {isPositive ? '+' : ''}{growth.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Definition Section */}
      {description && (
        <div className="mb-5 text-[12px] text-slate-500 dark:text-slate-400 font-medium italic border-l-2 border-emerald-500 pl-3 leading-relaxed relative z-10">
          {description}
        </div>
      )}

      <div className="h-36 w-full -ml-2 relative z-10 [&_*]:outline-none [&_svg]:!outline-none" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
        <ResponsiveContainer width="100%" height="100%" className="!outline-none focus:!outline-none">
          <AreaChart data={formattedData} margin={{ top: 15, right: 10, left: 0, bottom: 0 }} style={{ outline: 'none' }}>
            <defs>
              <linearGradient id={`colorValue-${(term || '').replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35}/>
                <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              content={CustomTooltip}
              cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.4 }}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
            <XAxis dataKey="name" hide={true} padding={{ left: 10, right: 10 }} />
            <YAxis hide={true} domain={[(dataMin) => dataMin - (Math.abs(dataMin) * 0.1 || 1), (dataMax) => dataMax + (Math.abs(dataMax) * 0.1 || 1)]} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={3.5}
              fillOpacity={1} 
              fill={`url(#colorValue-${(term || '').replace(/\s+/g, '')})`}
              activeDot={CustomActiveDot} 
              dot={CustomDot}
              animationDuration={1800}
              animationEasing="ease-out"
              isAnimationActive={true}
              style={{ outline: 'none' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer labels matching the aesthetic */}
      <div className="flex justify-between items-center mt-3 px-2 pt-3 border-t border-slate-200 dark:border-slate-700 border-dashed relative z-10">
        <div className="flex flex-col items-start">
          <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">{firstData?.fullName || firstData?.name}</span>
          <span className="text-[10px] font-medium text-slate-400">{formatter(firstData?.value ?? 0)}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400">{lastData?.fullName || lastData?.name} (Latest)</span>
          <span className="text-[10px] font-bold text-emerald-500/80">{formatter(lastData?.value ?? 0)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Home Tab ───
function HomeTab({ user, glossary, setActiveTab, setActiveGlossaryCat, isDark, bookmarkActions }) {
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

      {/* ── Corporate Performance Slider ── */}
      {(glossary || []).filter(item => item.cat === 'Corporate Performance').length > 0 && (
        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center justify-between mb-1 px-2">
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
            className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x snap-mandatory category-scroll" 
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {(glossary || []).filter(item => item.cat === 'Corporate Performance').map(item => (
              <div key={item.id || item.term} className="snap-center shrink-0 w-[92%] sm:w-[350px] first:ml-0 last:mr-4">
                <div className="-mt-4">
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
function GlossaryTab({ user, glossary, onStreakUpdate, activeGlossaryCat, setActiveGlossaryCat, bookmarkActions }) {
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

function QuizTab({ user, streak, setActiveTab, onStreakUpdate }) {
  const [state, setState] = useState('idle'); // idle | loading | active | review | leaderboard
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0); // This is now total points
  const [qStartTime, setQStartTime] = useState(0);

  const USERNAME = user?.fullName || "Ahmad Azib Danish"; // Simulated logged-in user
  const DIVISION = user?.division || "Strategic Planning Division"; // Simulated division

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
          }).catch(() => { });
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

function ProfileTab({ user, bookmarkActions, setActiveTab, triggerInstallPrompt }) {
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
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4">
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

      {/* Manual Install Button */}
      <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
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

                pdfWin.document.write(`<div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-start;"><button onclick="window.close()" style="background: #0f172a; color: white; padding: 12px 20px; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">← Back to App</button></div>`);

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
                    pdfWin.document.write(`<h3 class="dict-term">${bm.term}${bm.full && !bm.term.includes(' ') ? ` <span style="font-size:14px;color:#64748b;font-weight:600;margin-left:8px;">(${bm.full})</span>` : ''}</h3>`);
                    pdfWin.document.write(`<div class="dict-desc">${bm.desc}</div>`);
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

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4">
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
                              <CorporatePerformanceChart chartData={activeBookmark.chartData} term={activeBookmark.term} description="" />
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
function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeGlossaryCat, setActiveGlossaryCat] = useState('All');
  const [isDark, setIsDark] = useState(false);
  const [glossary, setGlossary] = useState([]);
  const [streak, setStreak] = useState(0);
  const [streakToast, setStreakToast] = useState(null); // toast notification at root level
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (user) {
      const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      };
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = ('standalone' in window.navigator) && window.navigator.standalone === true;
      const hasDismissed = sessionStorage.getItem('dismissedInstallPrompt');
      
      // Clear old localStorage to ensure it pops up for the user during testing
      localStorage.removeItem('dismissedInstallPrompt');
      
      if ((!isStandalone && !isIosStandalone && !hasDismissed) || (isIos() && !isIosStandalone && !hasDismissed)) {
        const timer = setTimeout(() => setShowInstallPrompt(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    sessionStorage.setItem('dismissedInstallPrompt', 'true');
  };

  const bookmarkActions = useBookmarks();
  const USERNAME = user?.fullName || "Ahmad Azib Danish";

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  // Fetch glossary from DB
  const fetchGlossary = useCallback(() => {
    fetch(`${API_BASE}/api/glossary?t=${Date.now()}`)
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

  // (Removed duplicated iOS prompt state)

  const tabs = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'glossary', label: 'Dictionary', Icon: BookIcon },
    { id: 'quiz', label: 'Hub', Icon: QuizIcon },
    { id: 'profile', label: 'Profile', Icon: ProfileIcon },
  ];

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`h-[100vh] overflow-hidden flex flex-col text-slate-900 transition-colors duration-200 w-full max-w-[430px] xl:max-w-none mx-auto relative shadow-2xl ${isDark ? 'dark:text-slate-100' : ''}`}>
      {/* Hardware Accelerated HD Background Image */}
      <img
        src={isDark ? '/@fs/C:/Users/User/.gemini/antigravity-ide/brain/64e02f0e-9a34-4ae4-a35c-a08ed77461c3/hd_dark_topo_1791271080189.jpg' : '/@fs/C:/Users/User/.gemini/antigravity-ide/brain/64e02f0e-9a34-4ae4-a35c-a08ed77461c3/hd_light_topo_1791271068815.jpg'}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center -z-20 pointer-events-none"
      />
      {/* Dark Mode Text Contrast Overlay */}
      {isDark && <div className="absolute inset-0 bg-slate-950/50 -z-10 pointer-events-none"></div>}

      {/* Root level Toast Notification */}
      {streakToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-orange-500 text-white px-5 py-3 rounded-2xl shadow-xl shadow-orange-500/30 text-[13px] font-bold animate-scaleIn whitespace-nowrap">
          {streakToast}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/80 safe-area-top shadow-sm relative">
        <div className="flex items-center justify-between px-4 h-16 relative z-10">

          {/* ─── LOGO AREA + BACK BUTTON ─── */}
          <div className="flex items-center gap-2.5">
            {/* Back Button - shown when not on home */}
            {activeTab !== 'home' && (
              <button onClick={() => setActiveTab('home')} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shrink-0 mr-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-slate-200 dark:border-slate-800 shrink-0">
              <img src="/@fs/C:/Users/User/.gemini/antigravity-ide/brain/64e02f0e-9a34-4ae4-a35c-a08ed77461c3/.user_uploaded/media_1791269952460.png" alt="S&S Logo" className="w-full h-full object-cover p-0.5" />
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

              {/* Logout Button */}
              <button onClick={() => setUser(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-rose-500/80 dark:text-rose-400/80 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:shadow-sm transition-all hover:text-rose-600 dark:hover:text-rose-300 ml-1">
                <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-container px-4 pt-4 pb-20">
        {activeTab === 'home' && <HomeTab user={user} glossary={glossary} setActiveTab={setActiveTab} setActiveGlossaryCat={setActiveGlossaryCat} isDark={isDark} bookmarkActions={bookmarkActions} />}
        {activeTab === 'glossary' && <GlossaryTab user={user} glossary={glossary} onStreakUpdate={handleStreakUpdate} activeGlossaryCat={activeGlossaryCat} setActiveGlossaryCat={setActiveGlossaryCat} bookmarkActions={bookmarkActions} />}
        {activeTab === 'quiz' && <QuizTab user={user} streak={streak} setActiveTab={setActiveTab} onStreakUpdate={handleStreakUpdate} />}
        {activeTab === 'profile' && <ProfileTab user={user} bookmarkActions={bookmarkActions} setActiveTab={setActiveTab} triggerInstallPrompt={() => setShowInstallPrompt(true)} />}
        {activeTab === 'admin' && <AdminTab onGlossaryChange={fetchGlossary} />}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] xl:max-w-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-50 pb-3">
        <div className="flex items-center justify-around h-[68px] px-2">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex flex-col items-center justify-center w-[68px] h-[60px] mx-1 rounded-2xl transition-all ${activeTab === id ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'opacity-60'}`}>
              <div className={`flex flex-col items-center justify-center gap-1.5 ${activeTab === id ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Icon active={activeTab === id} />
                <span className="text-[11px] font-bold leading-none">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Install App Popup */}
      {showInstallPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-fadeIn text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            
            <h3 className="text-[20px] font-black text-slate-900 dark:text-white mb-2">Install SESI App</h3>
            
            <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              For the best experience, install this app on your device!
              {deferredPrompt ? (
                <>
                  <br/><br/>
                  <span className="text-[12px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block text-left">
                    <strong>Android:</strong><br/>
                    Tap the <strong>Install App</strong> button below to add it directly to your home screen!
                  </span>
                </>
              ) : (
                <>
                  <br/><br/>
                  <span className="text-[12px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block text-left">
                    <strong>iOS / iPhone:</strong><br/>
                    Tap <strong className="text-slate-700 dark:text-slate-200">Share</strong> <svg className="inline w-4 h-4 text-slate-700 dark:text-slate-200 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> then <strong className="text-slate-700 dark:text-slate-200">Add to Home Screen</strong> <svg className="inline w-4 h-4 text-slate-700 dark:text-slate-200 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </span>
                </>
              )}
            </p>
            
            <div className="flex gap-2">
              <button onClick={dismissInstallPrompt} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all active:scale-95">
                Not Now
              </button>
              <button onClick={() => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then(({ outcome }) => {
                    if (outcome === 'accepted') {
                      setDeferredPrompt(null);
                      setShowInstallPrompt(false);
                    }
                  });
                } else {
                  alert("To install on iOS: Tap the 'Share' icon in Safari (at the bottom), then select 'Add to Home Screen'.");
                  // Intentionally NOT closing the popup here so iOS users can read it while they share!
                }
              }} className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/30">
                Install App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
