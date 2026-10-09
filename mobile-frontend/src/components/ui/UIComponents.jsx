import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function PostImageSlider({ images, title, onImageClick }) {
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
    fullName: `${d.month}`,
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
      className="mt-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm animate-fadeIn relative overflow-hidden group focus:outline-none flex flex-col justify-between h-full w-full"
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
            {!term.toUpperCase().includes('AUDIT') && (
              <>
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
              </>
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

      {(term || '').toUpperCase().includes('AUDIT') ? (
        <div className="flex flex-col gap-4 mt-3 relative z-10 flex-1">
          <div className="flex items-stretch gap-4 w-full flex-1">
            <div className="flex-1 border-2 border-slate-200 dark:border-slate-700 rounded-[24px] p-4 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-800/50 shadow-sm">
              <div className="text-[48px] font-black text-slate-800 dark:text-slate-100 leading-none mb-1 tracking-tighter">56</div>
              <div className="text-[16px] font-black text-slate-600 dark:text-slate-300 mb-1">open</div>
              <div className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">JAN 26</div>
            </div>
            <div className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-[24px] p-4 flex flex-col justify-center items-center bg-white dark:bg-slate-800/20">
              <div className="text-[48px] font-black text-emerald-600 dark:text-emerald-400 leading-none mb-1 tracking-tighter">15</div>
              <div className="text-[16px] font-black text-slate-600 dark:text-slate-300 mb-1">closed</div>
              <div className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">APR 26</div>
            </div>
          </div>
          <div className="text-[16px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50 px-4 py-3.5 rounded-[16px] text-center shadow-sm w-full">
            Pending: 41
          </div>
        </div>
      ) : (
        <>
          <div className="h-36 w-full -ml-2 relative z-10 [&_*]:outline-none [&_svg]:!outline-none" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
            <ResponsiveContainer width="100%" height="100%" className="!outline-none focus:!outline-none">
              {['CAPEX', 'OPEX', 'ASSET CAPITALISATION', 'ASSET CAP'].includes((term || '').toUpperCase()) ? (
                <BarChart data={formattedData} margin={{ top: 15, right: 10, left: 0, bottom: 0 }} style={{ outline: 'none' }}>
                  <Tooltip 
                    content={CustomTooltip}
                    cursor={{ fill: '#e2e8f0', opacity: 0.4 }}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
                  <XAxis dataKey="name" hide={true} padding={{ left: 10, right: 10 }} />
                  <YAxis hide={true} domain={[0, (dataMax) => dataMax + (Math.abs(dataMax) * 0.1 || 1)]} />
                  <Bar 
                    dataKey="value" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    isAnimationActive={true}
                    maxBarSize={40}
                  >
                    {formattedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === formattedData.length - 1 ? '#059669' : '#34d399'} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
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
              )}
            </ResponsiveContainer>
          </div>

          {/* Footer labels matching the aesthetic */}
          <div className="flex justify-between items-center mt-3 px-2 pt-3 border-t border-slate-200 dark:border-slate-700 border-dashed relative z-10">
            <div className="flex flex-col items-start">
              <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">{firstData?.name}</span>
              <span className="text-[10px] font-medium text-slate-400">{formatter(firstData?.value ?? 0)}</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400">{lastData?.name} (Latest)</span>
              <span className="text-[10px] font-bold text-emerald-500/80">{formatter(lastData?.value ?? 0)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Home Tab ───
