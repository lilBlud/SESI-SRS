import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DEFAULT_HISTORICAL_METRICS, getYAxisUnit } from '../../data/historicalPerformanceData';
import { parseChartData } from '../../domain/glossaryModel';

export function PostImageSlider({ images, title, onImageClick, aspectRatio = 'aspect-[4/5]', category = null }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;

  const currentIdx = Math.min(Math.max(0, idx), images.length - 1);

  const handlePrev = (e) => {
    e.stopPropagation();
    setIdx(i => i === 0 ? images.length - 1 : i - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIdx(i => i === images.length - 1 ? 0 : i + 1);
  };

  return (
    <div className={`relative ${aspectRatio} w-full concentric-inner border-alpha overflow-hidden bg-slate-950 shadow-inner group select-none`}>
      <img
        src={images[currentIdx]}
        alt={`${title} ${currentIdx + 1}`}
        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
        loading="lazy"
        onClick={() => onImageClick && onImageClick(currentIdx)}
      />

      {/* Subtle vignette gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      {/* Optional Floating Category Badge */}
      {category && (
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/20 shadow-sm">
            {category}
          </span>
        </div>
      )}

      {images.length > 1 && (
        <>
          {/* Top-Right Page Indicator */}
          <div className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20 shadow-sm z-20 flex items-center gap-1.5 pointer-events-none tabular-nums">
            <svg className="w-3.5 h-3.5 opacity-85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{currentIdx + 1} / {images.length}</span>
          </div>

          {/* Left / Previous Chevron Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-black/55 hover:bg-black/80 text-white rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-150 active:scale-90 shadow-md z-20 hover:scale-105"
            aria-label="Previous poster image"
            title="Previous image"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right / Next Chevron Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-black/55 hover:bg-black/80 text-white rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-150 active:scale-90 shadow-md z-20 hover:scale-105"
            aria-label="Next poster image"
            title="Next image"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Pagination Dots at Bottom (28px touch/click hit targets around compact visual dots) */}
          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center items-center z-20 pointer-events-auto">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(dotIdx);
                }}
                className="min-w-[28px] min-h-[28px] flex items-center justify-center active:scale-90 transition-transform"
                aria-label={`Go to image ${dotIdx + 1}`}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === currentIdx
                      ? 'w-5 bg-white shadow-sm ring-1 ring-black/20'
                      : 'w-1.5 bg-white/55 hover:bg-white/85'
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Chart Module-Level Helpers ───
const MONTH_MAP = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

function ChartDot(props) {
  const { cx, cy, index, dataLength } = props;
  if (cx === undefined || cy === undefined) return null;
  const isLast = index === dataLength - 1;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isLast ? 5 : 4}
      stroke="#ffffff"
      strokeWidth={isLast ? 2.5 : 2}
      fill="#10b981"
    />
  );
}

function ChartActiveDot(props) {
  const { cx, cy } = props;
  if (cx === undefined || cy === undefined) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={14} fill="#10b981" fillOpacity={0.2} className="animate-ping" />
      <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="#ffffff" strokeWidth={2.5} />
    </g>
  );
}

function isLowerBetterMetric(termName) {
  const name = (termName || '').toUpperCase();
  return ['SAIDI', 'SAIFI', 'CAIDI', 'SYSTEM MINUTES', 'SYSTEM LOSS', 'LOSS', 'LTIFR', 'SAFETY', 'AUDIT'].some(k => name.includes(k));
}

function ChartTooltip({ active, payload, term, yAxisLabel }) {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    const val = Number(payload[0].value);
    const hasPrev = point.prevValue !== null && point.prevValue !== undefined && point.prevValue !== 0;
    const momDelta = hasPrev ? ((val - point.prevValue) / Math.abs(point.prevValue)) * 100 : 0;
    const momFavorable = isLowerBetterMetric(term) ? momDelta <= 0 : momDelta >= 0;

    return (
      <div className="bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 shadow-lg flex flex-col gap-0.5 z-50">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{point.fullName}</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <p className="text-white font-black text-[13px] tracking-tight tabular-nums">
            {formatFooter(term, yAxisLabel, val)}
          </p>
        </div>
        {hasPrev && momDelta !== 0 && (
          <p className={`text-[10px] font-bold tabular-nums ml-3 ${momFavorable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {momDelta > 0 ? '+' : ''}{momDelta.toFixed(1)}% vs {point.prevMonth}
          </p>
        )}
      </div>
    );
  }
  return null;
}

function formatBigStat(termName, customFormat, value) {
  const fmt = (customFormat || '').trim().toLowerCase();
  const name = (termName || '').toUpperCase();
  const isRM = fmt.includes('rm') || ['TOTAL REVENUE', 'PAT', 'EBIT', 'CAPEX', 'OPEX'].some(k => name.includes(k));
  return isRM ? `RM ${value}` : `${value}`;
}

function formatFooter(termName, customFormat, value) {
  const fmt = (customFormat || '').trim().toLowerCase();
  const name = (termName || '').toUpperCase();

  if (fmt === 'in %' || fmt === '%') return `${value}%`;
  if (fmt === 'in rm mil') return `RM ${value} mil`;
  if (fmt === 'in rm bil') return `RM ${value} bil`;
  if (fmt === 'in rm') return `RM ${value}`;
  if (fmt === 'in mins' || fmt === 'mins') return `${value} mins`;
  if (fmt === 'in ltifr' || fmt === 'ltifr') return `LTIFR ${value}`;
  if (fmt.startsWith('in ')) return `${value} ${customFormat.trim().slice(3).trim()}`;

  if (name.includes('REVENUE')) return `RM ${value} bil`;
  if (['PAT', 'EBIT', 'CAPEX', 'OPEX'].some(k => name.includes(k))) return `RM ${value} mil`;
  if (['SAIDI', 'SAIFI', 'CAIDI', 'SYSTEM MINUTES', 'SYSTEM UNIT', 'MINUTES', 'MINS'].some(k => name.includes(k))) return `${value} mins`;
  if (['SYSTEM LOSS', 'ASSET CAPITALISATION', 'AUDIT ISSUE', 'ROI', 'ROA', 'ROE', 'PERCENT', 'RATE', 'MARGIN', 'LOSS', 'CAPITALISATION'].some(k => name.includes(k))) return `${value}%`;
  if (name.includes('SAFETY') || name.includes('LTIFR')) return `LTIFR ${value}`;
  if (name.includes('RM') || name.includes('COST') || name.includes('PROFIT') || name.includes('EXPENSE')) return `RM ${value}`;

  return `${value}`;
}

function getUnitLabel(termName, customFormat) {
  if (customFormat && customFormat.trim()) {
    const trimmed = customFormat.trim();
    const lower = trimmed.toLowerCase();
    if (lower === 'in %' || lower === '%') return 'in percentage (%)';
    if (lower === 'in rm mil') return 'in million';
    if (lower === 'in rm bil') return 'in billion';
    if (lower === 'in rm') return 'in RM';
    if (lower === 'in mins' || lower === 'mins') return 'in minutes (mins)';
    if (lower === 'in ltifr' || lower === 'ltifr') return 'in rate (per 1M hours)';
    return trimmed.startsWith('in ') ? trimmed : `in ${trimmed}`;
  }
  if (!termName) return '';
  const name = termName.toUpperCase();
  if (name.includes('REVENUE')) return 'in billion';
  if (['PAT', 'EBIT', 'CAPEX', 'OPEX'].some(k => name.includes(k))) return 'in million';
  if (['LOSS', 'CAPITALISATION', 'AUDIT', 'ROI', 'ROA', 'ROE', 'PERCENT', 'RATE', 'MARGIN'].some(k => name.includes(k))) return 'in percentage (%)';
  if (['SAIDI', 'SAIFI', 'CAIDI', 'MINUTES', 'MINS', 'DURATION', 'SYSTEM UNIT'].some(k => name.includes(k))) return 'in minutes (mins)';
  if (name.includes('SAFETY') || name.includes('LTIFR')) return 'in rate (per 1M hours)';
  return '';
}

// ─── Corporate Performance Chart ───
export function CorporatePerformanceChart({ chartData, term = '', description = '', yAxisFormat, chartType, formula }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [viewOverride, setViewOverride] = useState(null);
  const yAxisLabel = getYAxisUnit(term, yAxisFormat);

  let parsed = parseChartData(chartData);

  const normalizedTerm = (term || '').trim().toUpperCase();
  const defaultMetric = DEFAULT_HISTORICAL_METRICS[normalizedTerm];

  if (parsed.length === 0 && defaultMetric?.chartData) {
    parsed = [...defaultMetric.chartData];
  } else if (parsed.length > 0 && defaultMetric?.chartData) {
    const parsedYears = new Set(parsed.map(d => String(d.year)));
    if (!parsedYears.has('2022') && defaultMetric.chartData.length > 0) {
      const historicalPoints = defaultMetric.chartData.filter(d => !parsedYears.has(String(d.year)));
      parsed = [...historicalPoints, ...parsed];
    }
  }

  const isStaticAuditFallback = normalizedTerm.includes('AUDIT') && parsed.length === 0;
  const defaultIsBar = chartType === 'bar' ||
    (formula && String(formula).toLowerCase().trim() === 'bar') ||
    ['CAPEX', 'OPEX', 'ASSET CAPITALISATION', 'ASSET CAP'].includes(normalizedTerm);
  const isBar = viewOverride ? viewOverride === 'bar' : defaultIsBar;

  const allYearsDesc = [...new Set(parsed.map(d => parseInt(d.year, 10)))].sort((a, b) => b - a);
  const allYearsAsc = [...allYearsDesc].reverse();
  const activeYear = selectedYear || allYearsDesc[0];

  const dataForYear = parsed.filter(d => parseInt(d.year, 10) === activeYear);
  dataForYear.sort((a, b) => MONTH_MAP[a.month] - MONTH_MAP[b.month]);

  const formattedData = dataForYear.map((d, idx) => ({
    name: `${d.month}`,
    fullName: `${d.month} ${activeYear}`,
    value: Number(d.value) || 0,
    prevValue: idx > 0 ? (Number(dataForYear[idx - 1].value) || 0) : null,
    prevMonth: idx > 0 ? dataForYear[idx - 1].month : null
  }));

  const unitLabel = getUnitLabel(term, yAxisLabel);
  const lastData = formattedData[formattedData.length - 1];
  const firstData = formattedData[0];
  const values = formattedData.map(d => d.value);
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const rawAvg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const avgVal = Number.isInteger(rawAvg) ? rawAvg : Number(rawAvg.toFixed(2));
  const isLatestZero = (lastData?.value ?? 0) === 0;
  const growth = firstData && lastData && firstData.value !== 0
    ? ((lastData.value - firstData.value) / Math.abs(firstData.value)) * 100
    : 0;
  const isUp = growth >= 0;
  const isZero = growth === 0;
  const isFavorable = isLowerBetterMetric(term) ? growth <= 0 : growth >= 0;

  return (
    <div
      className="bg-slate-50/70 dark:bg-slate-800/40 surface-depth-2 concentric-inner p-4 sm:p-5 border-alpha animate-fadeIn relative overflow-hidden group focus:outline-none flex flex-col justify-between h-full w-full"
      onClick={(e) => e.stopPropagation()}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 relative z-10">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{term}</span>
            {unitLabel && (
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                · {unitLabel}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2.5 mt-0.5">
            {!isStaticAuditFallback && formattedData.length > 0 && (
              <>
                <span className="text-[28px] font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                  {formatBigStat(term, yAxisLabel, lastData?.value ?? 0)}
                </span>
                {isLatestZero ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-alpha">
                    Baseline (0)
                  </span>
                ) : !isZero && (
                  <span
                    className={`text-[13px] font-bold flex items-center px-2 py-0.5 rounded-md tabular-nums ${
                      isFavorable
                        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300'
                        : 'text-rose-600 bg-rose-50 dark:bg-rose-500/15 dark:text-rose-400'
                    }`}
                  >
                    <svg className={`w-3.5 h-3.5 mr-0.5 ${!isUp ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3.25a.75.75 0 01.53.22l5 5a.75.75 0 11-1.06 1.06L10.75 5.81v10.44a.75.75 0 01-1.5 0V5.81L5.53 9.53a.75.75 0 01-1.06-1.06l5-5a.75.75 0 01.53-.22z" clipRule="evenodd" />
                    </svg>
                    {growth > 0 ? '+' : ''}{growth.toFixed(2)}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Interactive Controls: Year Pills + Area/Bar Toggle */}
        {!isStaticAuditFallback && formattedData.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {allYearsAsc.length > 0 && (
              <div className="inline-flex items-center concentric-pill-group bg-white/90 dark:bg-slate-900/80 border-alpha shadow-2xs">
                {allYearsAsc.map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setSelectedYear(y)}
                    className={`px-2 py-0.5 concentric-pill-item text-[11px] font-bold tabular-nums transition-all ${
                      activeYear === y
                        ? 'bg-emerald-500 text-white shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            <div className="inline-flex items-center concentric-pill-group bg-white/90 dark:bg-slate-900/80 border-alpha shadow-2xs">
              <button
                type="button"
                onClick={() => setViewOverride('area')}
                className={`px-2 py-0.5 concentric-pill-item text-[11px] font-bold transition-all ${
                  !isBar
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Trend
              </button>
              <button
                type="button"
                onClick={() => setViewOverride('bar')}
                className={`px-2 py-0.5 concentric-pill-item text-[11px] font-bold transition-all ${
                  isBar
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Bars
              </button>
            </div>
          </div>
        )}
      </div>

      {description && (
        <p className="mb-3 text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
          {description}
        </p>
      )}

      {isStaticAuditFallback ? (
        <div className="flex flex-col gap-4 mt-3 relative z-10 flex-1">
          <div className="flex items-stretch gap-4 w-full flex-1">
            <div className="flex-1 border-alpha rounded-[24px] p-4 flex flex-col justify-center items-center bg-white dark:bg-slate-800/50 shadow-sm">
              <div className="text-[48px] font-black text-slate-800 dark:text-slate-100 leading-none mb-1 tracking-tight tabular-nums">56</div>
              <div className="text-[16px] font-black text-slate-600 dark:text-slate-300 mb-1">open</div>
              <div className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">JAN 26</div>
            </div>
            <div className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-[24px] p-4 flex flex-col justify-center items-center bg-white dark:bg-slate-800/20">
              <div className="text-[48px] font-black text-emerald-600 dark:text-emerald-400 leading-none mb-1 tracking-tight tabular-nums">15</div>
              <div className="text-[16px] font-black text-slate-600 dark:text-slate-300 mb-1">closed</div>
              <div className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">APR 26</div>
            </div>
          </div>
          <div className="text-[16px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border-alpha px-4 py-3.5 rounded-[16px] text-center shadow-sm w-full">
            Pending: 41
          </div>
        </div>
      ) : formattedData.length === 0 ? (
        <div className="h-32 w-full rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-400">
          No chart data recorded yet
        </div>
      ) : (
        <>
          <div className="h-44 w-full relative z-10 [&_*]:outline-none [&_svg]:!outline-none" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
            <ResponsiveContainer width="100%" height="100%" className="!outline-none focus:!outline-none">
              {isBar ? (
                <BarChart data={formattedData} margin={{ top: 12, right: 10, left: 10, bottom: 2 }} style={{ outline: 'none' }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.18} />
                  <ReferenceLine y={avgVal} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.55} />
                  <Tooltip
                    content={(tooltipProps) => <ChartTooltip {...tooltipProps} term={term} yAxisLabel={yAxisLabel} />}
                    cursor={{ fill: '#e2e8f0', opacity: 0.35 }}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    height={22}
                    padding={{ left: 6, right: 6 }}
                  />
                  <YAxis hide={true} domain={[0, (dataMax) => Number((dataMax + (Math.abs(dataMax) * 0.12 || 1)).toFixed(2))]} />
                  <Bar
                    dataKey="value"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    animationDuration={900}
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
                <AreaChart data={formattedData} margin={{ top: 12, right: 10, left: 10, bottom: 2 }} style={{ outline: 'none' }}>
                  <defs>
                    <linearGradient id={`colorValue-${(term || '').replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.18} />
                  <ReferenceLine y={avgVal} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.55} />
                  <Tooltip
                    content={(tooltipProps) => <ChartTooltip {...tooltipProps} term={term} yAxisLabel={yAxisLabel} />}
                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.4 }}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    height={22}
                    padding={{ left: 6, right: 6 }}
                  />
                  <YAxis
                    hide={true}
                    domain={[
                      (dataMin) => Math.max(0, Number((dataMin * 0.88).toFixed(2))),
                      (dataMax) => Number((dataMax * 1.08 || 1).toFixed(2))
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill={`url(#colorValue-${(term || '').replace(/\s+/g, '')})`}
                    activeDot={ChartActiveDot}
                    dot={(dotProps) => <ChartDot {...dotProps} dataLength={formattedData.length} />}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    isAnimationActive={true}
                    style={{ outline: 'none' }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* 4-Metric Annual Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 px-2 pt-3 border-t border-alpha border-dashed relative z-10 tabular-nums">
            <div className="flex flex-col">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">{firstData?.name} Start</span>
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                {formatFooter(term, yAxisLabel, firstData?.value ?? 0)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">Period Low</span>
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                {formatFooter(term, yAxisLabel, minVal)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">{activeYear} Avg</span>
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                {formatFooter(term, yAxisLabel, avgVal)}
              </span>
            </div>
            <div className="flex flex-col sm:items-end">
              <span className="text-[10.5px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                {lastData?.name} Latest
              </span>
              <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400">
                {formatFooter(term, yAxisLabel, lastData?.value ?? 0)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
