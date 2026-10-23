import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FUTURE_GEN_STATS,
  FUTURE_GEN_PROJECTS,
  BRIDGING_CAPACITY,
  PIPELINE_STAGES,
  WATCH_ITEMS,
  FUEL_TYPE_CONFIG,
  SABAH_MAP_DATA,
  SABAH_DISTRICTS
} from '../../utils/futureGenData';

export function FutureGenMapModal({ isOpen, onClose, isDark = false }) {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'pipeline' | 'bridging'
  const [selectedProjectId, setSelectedProjectId] = useState('rancha'); // default to Rancha or first project
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);

  if (!isOpen) return null;

  const selectedProject = FUTURE_GEN_PROJECTS.find(p => p.id === selectedProjectId) || FUTURE_GEN_PROJECTS[0];
  const selectedFuel = FUEL_TYPE_CONFIG[selectedProject.fuelType] || FUEL_TYPE_CONFIG.gas;

  const handleNextProject = () => {
    const idx = FUTURE_GEN_PROJECTS.findIndex(p => p.id === selectedProjectId);
    const nextIdx = (idx + 1) % FUTURE_GEN_PROJECTS.length;
    setSelectedProjectId(FUTURE_GEN_PROJECTS[nextIdx].id);
  };

  const handlePrevProject = () => {
    const idx = FUTURE_GEN_PROJECTS.findIndex(p => p.id === selectedProjectId);
    const prevIdx = (idx - 1 + FUTURE_GEN_PROJECTS.length) % FUTURE_GEN_PROJECTS.length;
    setSelectedProjectId(FUTURE_GEN_PROJECTS[prevIdx].id);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex justify-center bg-slate-950/70 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-900 shadow-2xl relative overflow-hidden border-x border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 antialiased"
        onClick={e => e.stopPropagation()}
      >
        {/* Hardware Accelerated HD Background Image - Matches App Theme */}
        <img
          src={isDark ? '/assets/hd_dark_topo.jpg' : '/assets/hd_light_topo.jpg'}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center -z-20 pointer-events-none opacity-40 dark:opacity-20"
        />
        {isDark && <div className="absolute inset-0 bg-slate-950/40 -z-10 pointer-events-none" />}

        {/* Header Bar - Solid, crisp styling with no blur filters to prevent iOS WebKit font blurring */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pb-3 pt-[max(env(safe-area-inset-top),16px)] shadow-xs z-20 relative shrink-0 antialiased">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all shrink-0 border border-slate-200/60 dark:border-slate-700/60"
              aria-label="Back to Dictionary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex-1 text-center min-w-0">
              <h1 className="text-[16px] font-black text-slate-900 dark:text-white leading-tight truncate">
                Future Generation Map
              </h1>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all shrink-0 border border-slate-200/60 dark:border-slate-700/60"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* View Mode Switcher - Clean Segmented Control */}
          <div className="mt-2.5 flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <span>🗺️</span>
              <span>Sabah Map</span>
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'pipeline'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <span>📋</span>
              <span>Pipeline (6)</span>
            </button>
            <button
              onClick={() => setActiveTab('bridging')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bridging'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <span>⚡</span>
              <span>East Coast</span>
            </button>
          </div>
        </div>

        {/* Top 4 KPI Metrics Strip */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-3 py-2.5 grid grid-cols-4 gap-1.5 shadow-sm shrink-0">
          <div className="text-center px-1">
            <div className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">
              {FUTURE_GEN_STATS.peakDemand}
            </div>
            <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Peak (Sep 26)
            </div>
          </div>
          <div className="text-center px-1 border-l border-slate-200 dark:border-slate-800">
            <div className="text-[13px] font-black text-emerald-600 dark:text-emerald-400 leading-tight">
              {FUTURE_GEN_STATS.dependableCapacity}
            </div>
            <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Dependable
            </div>
          </div>
          <div className="text-center px-1 border-l border-slate-200 dark:border-slate-800">
            <div className="text-[13px] font-black text-rose-600 dark:text-rose-400 leading-tight">
              {FUTURE_GEN_STATS.reserveMargin}
            </div>
            <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Reserve Margin
            </div>
          </div>
          <div className="text-center px-1 border-l border-slate-200 dark:border-slate-800">
            <div className="text-[13px] font-black text-indigo-600 dark:text-indigo-400 leading-tight">
              {FUTURE_GEN_STATS.maxTransfer}
            </div>
            <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Max W→E Grid
            </div>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
            {/* Regional Status Pill Strip */}
            <div className="px-3 pt-2.5 pb-1 flex items-center justify-between gap-2 shrink-0">
              <div className="flex-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                    West Coast
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    881 MW Peak · 1,090 MW Cap
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded-md">
                  +23.7% RM
                </span>
              </div>

              <div className="flex-1 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/60 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-sky-700 dark:text-sky-300">
                    East Coast
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    421 MW Peak · 322 MW Cap
                  </div>
                </div>
                <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-1.5 py-0.5 rounded-md">
                  -23.5% RM
                </span>
              </div>
            </div>

            {/* Sabah SVG Interactive Map Canvas - Fixed height prevents resizing when switching pins */}
            <div className="h-[310px] shrink-0 relative bg-[#EEF3F7] dark:bg-slate-900 px-1 py-1 overflow-hidden flex items-center justify-center border-b border-slate-200/80 dark:border-slate-800">
              <svg
                viewBox={SABAH_MAP_DATA.viewBox}
                className="w-full h-full select-none"
                style={{ maxHeight: '100%' }}
              >
                <defs>
                  {/* Subtle Filter for Pins & Badges */}
                  <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
                  </filter>
                  <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
                  </filter>

                  {/* Exact Sabah GeoJSON Boundary ClipPath */}
                  <clipPath id="sabahOutline">
                    <path d={SABAH_MAP_DATA.mainlandPath} />
                    <path d={SABAH_MAP_DATA.banggiPath} />
                    <ellipse
                      cx={SABAH_MAP_DATA.labuan.cx}
                      cy={SABAH_MAP_DATA.labuan.cy}
                      rx={SABAH_MAP_DATA.labuan.rx}
                      ry={SABAH_MAP_DATA.labuan.ry}
                    />
                  </clipPath>
                </defs>

                {/* Sarawak Enclave Landmass (Northern Sarawak / Lawas) */}
                <path
                  d={SABAH_MAP_DATA.sarawakPath}
                  fill={isDark ? "#1E293B" : "#DDE7DF"}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />

                {/* Individual Sabah District Polygons - Following exact lines of each area */}
                <g id="sabah-districts">
                  {SABAH_DISTRICTS.map((d) => (
                    <path
                      key={d.id}
                      d={d.path}
                      fill={isDark ? d.darkFill : d.fill}
                      stroke="#FFFFFF"
                      strokeWidth="1.0"
                      strokeLinejoin="round"
                    />
                  ))}
                  {/* Labuan Island */}
                  <ellipse
                    cx={SABAH_MAP_DATA.labuan.cx}
                    cy={SABAH_MAP_DATA.labuan.cy}
                    rx={SABAH_MAP_DATA.labuan.rx}
                    ry={SABAH_MAP_DATA.labuan.ry}
                    fill={isDark ? "#1E2E24" : "#BFE4CB"}
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                  />
                </g>

                {/* Crisp White Outer Coastline Stroke */}
                <path
                  d={SABAH_MAP_DATA.mainlandPath}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />

                {/* Watermark Region Titles */}
                <text
                  x="180"
                  y="82"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill="#15803D"
                  opacity="0.85"
                  letterSpacing="1"
                >
                  WEST COAST
                </text>
                <text
                  x="295"
                  y="85"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill="#1D4ED8"
                  opacity="0.85"
                  letterSpacing="1"
                >
                  EAST COAST
                </text>
                <text
                  x="46"
                  y="316"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="800"
                  fill={isDark ? "#94A3B8" : "#64748B"}
                  opacity="0.85"
                  letterSpacing="0.8"
                >
                  SARAWAK
                </text>

                {/* Transmission Lines - 132 kV (Green Lines) */}
                {/* Kudat -> Kota Belud -> Kota Kinabalu -> Kolombong Junction */}
                <path
                  d="M 205.2,64.5 L 161.1,121.3 L 123.3,160.9 L 136.0,168.0"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Kolombong Junction -> Keningau (North-South vertical trunk) */}
                <path
                  d="M 136.0,168.0 L 132.8,228.9"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Papar -> Beaufort -> Sipitang */}
                <path
                  d="M 108.2,187.3 L 88.3,228.5 L 70.0,255.0"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Feeder to Labuan */}
                <path
                  d="M 88.3,228.5 L 43.7,235.4"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* Beaufort -> Keningau */}
                <path
                  d="M 88.3,228.5 L 132.8,228.9"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Keningau -> Tenom -> Upper Padas */}
                <path
                  d="M 132.8,228.9 L 109.3,251.8 L 85.0,278.4"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Keningau -> Existing Plant [G] */}
                <path
                  d="M 132.8,228.9 L 148.0,248.0"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* Segaliud -> Sandakan */}
                <path
                  d="M 306.6,192.6 L 336.3,174.8"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Lahad Datu -> Kunak -> Tawau & Semporna */}
                <path
                  d="M 362.6,262.7 L 354.4,299.4 L 325.0,336.0 L 315.8,346.3"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 354.4,299.4 L 392.8,321.0 L 325.0,336.0"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Lahad Datu cluster feeder */}
                <path
                  d="M 362.6,262.7 L 370.0,268.0 L 383.0,273.0"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Transmission Line - 275 kV (Red Backbone: Papar -> Kolombong Junction -> Sapi Nangoh -> Segaliud -> Lahad Datu) */}
                <path
                  d="M 108.2,187.3 L 136.0,168.0 L 267.6,173.1 L 306.6,192.6 L 362.6,262.7"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Future Link: Southern Madani Link Ph. 1A (Red Dashed) */}
                <path
                  d="M 70.0,255.0 L 51.6,281.6"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2.2"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                />
                <text
                  x="64"
                  y="295"
                  fontSize="6.5"
                  fontWeight="700"
                  fill="#B91C1C"
                >
                  Southern Madani Link Ph. 1A
                </text>

                {/* Future Link: Southern Link (future) - Tenom to Tawau */}
                <path
                  d="M 109.3,251.8 C 145,295 180,335 240,336 L 290,336 L 315.8,346.3"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2.2"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                />
                <text
                  x="235"
                  y="318"
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="700"
                  fill="#DC2626"
                >
                  Southern Link (future)
                </text>

                {/* Central ~340 MW Power Flow Arrow */}
                <g transform="translate(225, 172)">
                  <polygon
                    points="0,-6 28,-6 28,-11 42,0 28,11 28,6 0,6"
                    fill="#FFFFFF"
                    stroke="#334155"
                    strokeWidth="1.2"
                    filter="url(#pinShadow)"
                  />
                  <text
                    x="16"
                    y="3"
                    textAnchor="middle"
                    fontSize="7.5"
                    fontWeight="900"
                    fill="#0F172A"
                  >
                    ~340 MW
                  </text>
                </g>

                {/* Offshore Mutiara Gas Cluster */}
                <g transform="translate(348, 126)">
                  <polygon points="0,-7 7,0 0,7 -7,0" fill="#EA580C" stroke="#C2410C" strokeWidth="1" />
                  <text x="11" y="-1" fontSize="7.5" fontWeight="800" fill="#C2410C">
                    Mutiara gas cluster
                  </text>
                  <text x="11" y="8" fontSize="6.5" fontWeight="600" fill="#C2410C">
                    ~40 mmscfd, 2029
                  </text>
                </g>

                {/* Map Top-Right Legend Box */}
                <g transform="translate(265, 18)">
                  {/* Line 1: Links */}
                  <line x1="0" y1="5" x2="16" y2="5" stroke="#DC2626" strokeWidth="2.2" />
                  <text x="20" y="8" fontSize="7.5" fontWeight="600" fill="#334155">275 kV</text>

                  <line x1="60" y1="5" x2="76" y2="5" stroke="#16A34A" strokeWidth="2" />
                  <text x="80" y="8" fontSize="7.5" fontWeight="600" fill="#334155">132 kV</text>

                  <line x1="120" y1="5" x2="136" y2="5" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="140" y="8" fontSize="7.5" fontWeight="600" fill="#334155">Future link</text>

                  {/* Line 2: Fuels */}
                  <circle cx="8" cy="20" r="4" fill="#0F172A" />
                  <text x="16" y="23" fontSize="7.5" fontWeight="600" fill="#334155">Gas</text>

                  <circle cx="48" cy="20" r="4" fill="#D97706" />
                  <text x="56" y="23" fontSize="7.5" fontWeight="600" fill="#334155">Solar</text>

                  <circle cx="88" cy="20" r="4" fill="#2563EB" />
                  <text x="96" y="23" fontSize="7.5" fontWeight="600" fill="#334155">Hydro</text>

                  <circle cx="130" cy="20" r="4" fill="#059669" />
                  <text x="138" y="23" fontSize="7.5" fontWeight="600" fill="#334155">Conversion</text>
                </g>

                {/* Town Nodes (18 towns) */}
                {[
                  { name: 'Kudat', x: 205.2, y: 64.5, dx: 7, dy: 3, anchor: 'start' },
                  { name: 'Kota Belud', x: 161.1, y: 121.3, dx: -6, dy: 3, anchor: 'end' },
                  { name: 'Kota Kinabalu', x: 123.3, y: 160.9, dx: -6, dy: 3, anchor: 'end' },
                  { name: 'Ranau', x: 186.2, y: 164.2, dx: 0, dy: -6, anchor: 'middle' },
                  { name: 'Papar', x: 108.2, y: 187.3, dx: -6, dy: 3, anchor: 'end' },
                  { name: 'Beaufort', x: 88.3, y: 228.5, dx: 7, dy: 3, anchor: 'start' },
                  { name: 'Labuan', x: 34.7, y: 235.4, dx: 0, dy: 18, anchor: 'middle' },
                  { name: 'Lawas', x: 51.6, y: 281.6, dx: -6, dy: 3, anchor: 'end' },
                  { name: 'Upper Padas', x: 85.0, y: 278.4, dx: 0, dy: 10, anchor: 'middle' },
                  { name: 'Keningau', x: 132.8, y: 228.9, dx: 6, dy: 3, anchor: 'start' },
                  { name: 'Tenom', x: 109.3, y: 251.8, dx: 6, dy: 3, anchor: 'start' },
                  { name: 'Sapi Nangoh', x: 267.6, y: 173.1, dx: 0, dy: 10, anchor: 'middle' },
                  { name: 'Segaliud', x: 306.6, y: 192.6, dx: 0, dy: 10, anchor: 'middle' },
                  { name: 'Sandakan', x: 336.3, y: 174.8, dx: 14, dy: 2, anchor: 'start' },
                  { name: 'Lahad Datu', x: 362.6, y: 262.7, dx: 7, dy: 3, anchor: 'start' },
                  { name: 'Kunak', x: 354.4, y: 299.4, dx: 7, dy: 3, anchor: 'start' },
                  { name: 'Semporna', x: 392.8, y: 321.0, dx: 7, dy: 3, anchor: 'start' },
                  { name: 'Tawau', x: 315.8, y: 346.3, dx: 0, dy: 14, anchor: 'middle' },
                ].map((t, idx) => (
                  <g key={`town-${idx}`}>
                    <circle cx={t.x} cy={t.y} r="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.2" />
                    <text
                      x={t.x + t.dx}
                      y={t.y + t.dy}
                      textAnchor={t.anchor}
                      fontSize="7"
                      fontWeight="600"
                      className="fill-slate-700 dark:fill-slate-300 pointer-events-none select-none"
                    >
                      {t.name}
                    </text>
                  </g>
                ))}

                {/* Existing Plant Badges [G] */}
                {[
                  { x: 216, y: 60 },
                  { x: 132, y: 147 },
                  { x: 21, y: 245 },
                  { x: 144, y: 228 },
                  { x: 348, y: 182 },
                  { x: 375, y: 262 },
                  { x: 366, y: 302 },
                  { x: 298, y: 350 },
                ].map((gNode, idx) => (
                  <g key={`g-${idx}`} transform={`translate(${gNode.x}, ${gNode.y})`}>
                    <rect width="8" height="8" rx="1.5" fill="#64748B" />
                    <text x="4" y="6" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#FFFFFF">
                      G
                    </text>
                  </g>
                ))}

                {/* Existing Plant Legend (bottom right) */}
                <g transform="translate(372, 345)">
                  <rect width="8" height="8" rx="1.5" fill="#64748B" />
                  <text x="4" y="6" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#FFFFFF">G</text>
                  <text x="11" y="6.5" fontSize="6.5" fontWeight="600" fill="#64748B">Existing plant</text>
                </g>


                {/* Interactive Project Pins (1 to 7) */}
                {[
                  { id: 'mengaris', num: 1, x: 179.1, y: 100.1, color: '#D97706' },
                  { id: 'tecoma', num: 2, x: 138.0, y: 142.0, color: '#0F172A' },
                  { id: 'acacia', num: 3, x: 98.0, y: 208.0, color: '#0F172A' },
                  { id: 'rancha', num: 4, x: 34.7, y: 235.4, color: '#0F172A' },
                  { id: 'oriole', num: 5, x: 70.0, y: 255.0, color: '#2563EB' },
                  { id: 'sequioa', num: 6, x: 116.0, y: 268.0, color: '#2563EB' },
                  { id: 'shorea', num: 7, x: 336.3, y: 174.8, color: '#059669' },
                  { id: 'shorea', num: 7, x: 315.8, y: 346.3, color: '#059669' },
                ].map((pin, idx) => {
                  const isSelected = selectedProjectId === pin.id;
                  return (
                    <g
                      key={`pin-${idx}`}
                      transform={`translate(${pin.x}, ${pin.y})`}
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedProjectId(pin.id);
                        setIsBottomSheetExpanded(true);
                      }}
                    >
                      {/* Stable hit area (transparent) prevents mouseenter/mouseleave oscillation */}
                      <circle cx="0" cy="0" r="18" fill="transparent" />

                      {/* Selection Pulsing Ring */}
                      {isSelected && (
                        <g className="pointer-events-none">
                          <circle cx="0" cy="0" r="16" fill={pin.color} opacity="0.3" className="animate-ping" />
                          <circle cx="0" cy="0" r="14" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
                        </g>
                      )}

                      {/* Main Pin Circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 12 : 10}
                        fill={pin.color}
                        stroke="#FFFFFF"
                        strokeWidth={isSelected ? 2.5 : 2}
                        filter="url(#pinShadow)"
                        className="transition-all duration-150 group-hover:brightness-125 group-hover:stroke-slate-100 pointer-events-none"
                      />

                      {/* Pin Number */}
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fontSize={isSelected ? '10' : '9'}
                        fontWeight="900"
                        fill="#FFFFFF"
                        className="pointer-events-none select-none"
                      >
                        {pin.num}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tap Pin Hint */}
              <div className="absolute top-1.5 left-2 bg-white dark:bg-slate-800 rounded-lg px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 shadow-sm flex items-center gap-1 pointer-events-none">
                <span className="animate-pulse">📍</span>
                <span>Tap any pin for project breakdown</span>
              </div>
            </div>

            {/* Project Breakdown Panel - Flexible scroll area with rock-solid fixed map above */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-slate-900 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] px-4 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] z-20 custom-scrollbar flex flex-col justify-start">
              {/* Drawer Handle & Navigation */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                    style={{ backgroundColor: selectedFuel.color }}
                  >
                    {selectedProject.pinNumber}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Project Breakdown
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevProject}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs active:scale-95 transition-all"
                    title="Previous project"
                  >
                    ←
                  </button>
                  <span className="text-[10px] font-bold text-slate-400 px-1">
                    {selectedProject.pinNumber} of {FUTURE_GEN_PROJECTS.length}
                  </span>
                  <button
                    onClick={handleNextProject}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs active:scale-95 transition-all"
                    title="Next project"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Project Card Header */}
              <div className="pt-2 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                      {selectedProject.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300/40">
                      {selectedProject.capacity}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedProject.stageCategory === 'contracting' ? 'Contracting & FC' : 'Feasibility'}
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                    {selectedProject.plantType} · {selectedProject.location}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Target COD</div>
                  <div className="text-[12px] font-black text-indigo-600 dark:text-indigo-400">
                    {selectedProject.cod}
                  </div>
                </div>
              </div>

              {/* Status and Description */}
              <div className="mt-2 text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-bold text-slate-800 dark:text-slate-200">Status & Way Forward: </span>
                {selectedProject.status}
              </div>

              {/* Watch Item Highlight Alert */}
              {selectedProject.watchItem && (
                <div className="mt-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-700/70 rounded-xl p-2.5 flex items-start gap-2">
                  <span className="text-sm shrink-0">⚠️</span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-black text-amber-900 dark:text-amber-200">
                      Watch Item: {selectedProject.watchItem.title}
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-snug">
                      {selectedProject.watchItem.text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pipeline Table View (Image 1 Structure) */}
        {activeTab === 'pipeline' && (
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar">
            {/* Header intro */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-3.5 text-white shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Generation Pipeline
              </span>
              <h2 className="text-base font-black mt-0.5">
                6 Projects (1,189 MW)
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                3 projects in contracting & financial close stage, 3 in feasibility stage.
              </p>
            </div>

            {/* Stages */}
            {PIPELINE_STAGES.map(stage => {
              const stageProjects = FUTURE_GEN_PROJECTS.filter(p => stage.projectIds.includes(p.id));
              return (
                <div key={stage.id} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {stage.title}
                    </h3>
                    <span className="text-[11px] font-black text-rose-600 dark:text-rose-400">
                      {stage.totalMW}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {stageProjects.map(proj => (
                      <div
                        key={proj.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                              {proj.pinNumber}
                            </span>
                            <div>
                              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                                {proj.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {proj.plantType} · {proj.location}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                              {proj.capacity}
                            </span>
                            <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                              COD: {proj.cod}
                            </div>
                          </div>
                        </div>

                        <div className="text-[11.5px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 leading-relaxed">
                          <span className="font-bold text-slate-800 dark:text-slate-200">Way Forward: </span>
                          {proj.status}
                        </div>

                        {proj.watchItem && (
                          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-2.5 text-[11px] text-rose-800 dark:text-rose-300">
                            <span className="font-black">⚠️ Watch Item: </span>
                            {proj.watchItem.text}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Mengaris Solar Additional Mention */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Mengaris Solar (15 MW)</h4>
                  <p className="text-[10px] text-slate-500">Renewable energy addition · COD 2027</p>
                </div>
              </div>
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">15 MW</span>
            </div>

            {/* Watch Items Central Box */}
            <div className="space-y-2 pt-2">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 px-1">
                Active Watch Items & Risks
              </h3>
              <div className="space-y-2">
                {WATCH_ITEMS.map(watch => (
                  <div
                    key={watch.id}
                    className={`rounded-2xl p-3 border ${
                      watch.tone === 'rose'
                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                        : watch.tone === 'amber'
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                        : 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                    }`}
                  >
                    <div className="font-black text-xs">{watch.title}</div>
                    <div className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                      {watch.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* East Coast Bridging Capacity View */}
        {activeTab === 'bridging' && (
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 custom-scrollbar">
            <div className="bg-gradient-to-r from-sky-900 to-indigo-950 rounded-2xl p-3.5 text-white shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                East Coast Security of Supply
              </span>
              <h2 className="text-base font-black mt-0.5">
                Bridging Capacity & Gas Transition
              </h2>
              <p className="text-[11px] text-sky-100/90 mt-0.5 leading-relaxed">
                Interim generation extensions to overcome the East Coast reserve deficit (-23.5%) before major transmission and CCGT completions.
              </p>
            </div>

            <div className="space-y-2.5">
              {BRIDGING_CAPACITY.map(plant => (
                <div
                  key={plant.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        {plant.name}
                      </h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        plant.badgeColor === 'emerald'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : plant.badgeColor === 'amber'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {plant.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      {plant.type} · {plant.location}
                    </p>
                    <p className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-200 mt-1.5">
                      {plant.status}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-1 rounded-lg">
                      {plant.capacity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
