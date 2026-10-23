import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FUTURE_GEN_STATS,
  FUTURE_GEN_PROJECTS,
  BRIDGING_CAPACITY,
  PIPELINE_STAGES,
  WATCH_ITEMS,
  FUEL_TYPE_CONFIG
} from '../../utils/futureGenData';

export function FutureGenMapModal({ isOpen, onClose }) {
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
      className="fixed inset-0 z-[120] flex justify-center bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 shadow-2xl relative overflow-hidden border-x border-slate-200/60 dark:border-slate-800 animate-slideUp text-slate-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-indigo-900 px-4 pb-3.5 pt-[max(env(safe-area-inset-top),20px)] shadow-md z-20 relative shrink-0">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all shrink-0"
              aria-label="Back to Dictionary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex-1 text-center min-w-0">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-rose-100 backdrop-blur-sm">
                  BDV Strategic Pipeline
                </span>
              </div>
              <h1 className="text-[17px] font-black text-white leading-tight mt-0.5 truncate">
                Future Generation Map
              </h1>
              <p className="text-[11px] text-rose-100/90 font-medium truncate">
                Security of Supply · ~1.2 GW Future Pipeline
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all shrink-0"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="mt-3 flex items-center p-1 bg-black/25 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>🗺️</span>
              <span>Sabah Map</span>
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'pipeline'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>📋</span>
              <span>Pipeline (6 Projects)</span>
            </button>
            <button
              onClick={() => setActiveTab('bridging')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bridging'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
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

            {/* Map Legend */}
            <div className="px-3 py-1 flex items-center justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-300 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-red-500 rounded-sm"></span> 275 kV
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-emerald-500 rounded-sm"></span> 132 kV
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 border-b-2 border-dashed border-rose-500"></span> Future
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-slate-900"></span> Gas</span>
                <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Solar</span>
                <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Hydro</span>
                <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Conv.</span>
              </div>
            </div>

            {/* Sabah SVG Interactive Map Canvas - Fixed height prevents resizing when switching pins */}
            <div className="h-[265px] shrink-0 relative bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 px-2 py-1 overflow-hidden flex items-center justify-center border-b border-slate-200/80 dark:border-slate-800">
              <svg
                viewBox="70 15 400 330"
                className="w-full h-full drop-shadow-md select-none"
              >
                <defs>
                  {/* Subtle Filter for Pins */}
                  <filter id="pinShadow" x="-20%" y="-20%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.35" />
                  </filter>
                  <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="westGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#86efac" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0.30" />
                  </linearGradient>
                  <linearGradient id="eastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.30" />
                  </linearGradient>
                </defs>

                {/* Compass & Title Watermark */}
                <g opacity="0.65" transform="translate(440, 42)">
                  <circle cx="0" cy="0" r="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-slate-400 dark:text-slate-600" />
                  <path d="M 0,-14 L 3,-4 L 0,0 L -3,-4 Z" fill="#ef4444" />
                  <path d="M 0,14 L 3,4 L 0,0 L -3,4 Z" fill="currentColor" className="text-slate-400 dark:text-slate-600" />
                  <text x="0" y="-17" textAnchor="middle" fontSize="9" fontWeight="900" fill="#ef4444">N</text>
                </g>

                {/* West Coast Region Landmass */}
                <path
                  d="M 235,35 
                     L 220,70 L 200,105 L 190,125 L 175,155 L 160,185 L 148,220 L 132,255 L 125,270 
                     L 135,295 L 160,310 L 180,315 L 210,318 L 240,320 
                     L 260,260 L 255,190 L 250,130 L 245,75 Z"
                  fill="url(#westGrad)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  className="transition-colors hover:brightness-105"
                />

                {/* East Coast Region Landmass */}
                <path
                  d="M 235,35 
                     L 245,75 L 250,130 L 255,190 L 260,260 L 240,320 
                     L 280,320 L 340,320 L 375,320 L 390,325 L 405,305 L 435,310 L 445,290 
                     L 420,265 L 410,245 L 450,230 L 435,200 L 395,185 L 380,170 L 350,150 
                     L 300,110 L 265,95 L 250,60 Z"
                  fill="url(#eastGrad)"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  className="transition-colors hover:brightness-105"
                />

                {/* Labuan Island */}
                <ellipse
                  cx="106"
                  cy="238"
                  rx="10"
                  ry="14"
                  fill="#86efac"
                  fillOpacity="0.5"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <text x="106" y="258" textAnchor="middle" fontSize="8" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
                  Labuan
                </text>

                {/* Region Watermark Labels */}
                <text x="180" y="85" fontSize="13" fontWeight="900" letterSpacing="1" fill="#047857" opacity="0.6">
                  WEST COAST
                </text>
                <text x="320" y="95" fontSize="13" fontWeight="900" letterSpacing="1" fill="#1d4ed8" opacity="0.6">
                  EAST COAST
                </text>

                {/* Region Boundary Line (West / East Split) */}
                <path
                  d="M 235,35 L 245,75 L 250,130 L 255,190 L 260,260 L 240,320"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />

                {/* Transmission Lines - 132 kV (Green) */}
                {/* Kudat to Kota Belud to KK */}
                <path
                  d="M 235,55 L 195,120 L 170,155"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* KK to Papar to Beaufort to Sipitang/Lawas */}
                <path
                  d="M 170,155 L 160,185 L 145,225 L 145,275 L 130,290"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Papar to Keningau to Tenom to Upper Padas */}
                <path
                  d="M 160,185 L 205,225 L 185,255 L 155,268"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Sandakan to Segaliud */}
                <path
                  d="M 375,165 L 330,185"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Kunak to Semporna to Tawau */}
                <path
                  d="M 400,270 L 430,290 L 385,305"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Transmission Line - 275 kV (Red Backbone) */}
                {/* KK -> Ranau -> Sapi Nangoh -> Segaliud -> Lahad Datu -> Kunak -> Tawau */}
                <path
                  d="M 170,155 L 240,150 L 285,165 L 330,185 L 395,235 L 400,270 L 385,305"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Future Transmission Line - Southern Madani Link Ph. 1A (Red Dashed) */}
                <path
                  d="M 155,268 Q 240,335 385,305"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.4"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                />
                <text x="250" y="302" fontSize="7.5" fontWeight="800" fill="#f43f5e" textAnchor="middle">
                  Southern Madani Link Ph. 1A (future)
                </text>

                {/* West to East Transfer Arrow (~340 MW) */}
                <g transform="translate(262, 175)">
                  <rect x="-3" y="-10" width="60" height="18" rx="5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" filter="url(#pinShadow)" />
                  <path d="M 43,-5 L 52,0 L 43,5 Z" fill="#2563eb" />
                  <text x="22" y="3" textAnchor="middle" fontSize="9" fontWeight="900" fill="#1e3a8a">
                    ~340 MW →
                  </text>
                </g>

                {/* Offshore Mutiara Gas Cluster */}
                <g transform="translate(390, 125)">
                  <polygon points="0,-7 7,0 0,7 -7,0" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
                  <text x="10" y="3" fontSize="7.5" fontWeight="800" fill="#c2410c" className="dark:fill-orange-400">
                    Mutiara Gas ~40 mmscfd (2029)
                  </text>
                </g>

                {/* Major Grid Town Nodes */}
                {[
                  { name: 'Kudat', x: 235, y: 55, labelPos: 'right' },
                  { name: 'Kota Belud', x: 195, y: 120, labelPos: 'left' },
                  { name: 'Kota Kinabalu', x: 170, y: 155, labelPos: 'left' },
                  { name: 'Ranau', x: 240, y: 150, labelPos: 'top' },
                  { name: 'Papar', x: 160, y: 185, labelPos: 'left' },
                  { name: 'Beaufort', x: 145, y: 225, labelPos: 'left' },
                  { name: 'Keningau', x: 205, y: 225, labelPos: 'right' },
                  { name: 'Tenom', x: 185, y: 255, labelPos: 'right' },
                  { name: 'Upper Padas', x: 155, y: 268, labelPos: 'left' },
                  { name: 'Sapi Nangoh', x: 285, y: 165, labelPos: 'bottom' },
                  { name: 'Segaliud', x: 330, y: 185, labelPos: 'bottom' },
                  { name: 'Sandakan', x: 375, y: 165, labelPos: 'right' },
                  { name: 'Lahad Datu', x: 395, y: 235, labelPos: 'right' },
                  { name: 'Kunak', x: 400, y: 270, labelPos: 'right' },
                  { name: 'Semporna', x: 430, y: 290, labelPos: 'right' },
                  { name: 'Tawau', x: 385, y: 305, labelPos: 'bottom' },
                ].map((town, idx) => (
                  <g key={idx} transform={`translate(${town.x}, ${town.y})`}>
                    <circle cx="0" cy="0" r="3.2" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                    <text
                      x={town.labelPos === 'left' ? -6 : town.labelPos === 'right' ? 6 : 0}
                      y={town.labelPos === 'top' ? -6 : town.labelPos === 'bottom' ? 10 : 3}
                      textAnchor={town.labelPos === 'left' ? 'end' : town.labelPos === 'right' ? 'start' : 'middle'}
                      fontSize="7.5"
                      fontWeight="700"
                      className="fill-slate-700 dark:fill-slate-300 pointer-events-none select-none"
                    >
                      {town.name}
                    </text>
                  </g>
                ))}

                {/* Existing Generation Nodes ('G' badge) */}
                {[
                  { x: 247, y: 62 },
                  { x: 175, y: 135 },
                  { x: 106, y: 250 },
                  { x: 215, y: 235 },
                  { x: 390, y: 175 },
                  { x: 412, y: 245 },
                  { x: 415, y: 275 },
                  { x: 370, y: 310 }
                ].map((gNode, idx) => (
                  <g key={`g-${idx}`} transform={`translate(${gNode.x}, ${gNode.y})`}>
                    <rect x="-4.5" y="-4.5" width="9" height="9" rx="2" fill="#64748b" />
                    <text x="0" y="2.5" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#ffffff">
                      G
                    </text>
                  </g>
                ))}

                {/* Interactive Project Pins (1 to 7) */}
                {[
                  { id: 'mengaris', num: 1, x: 210, y: 105, color: '#f59e0b', label: 'Mengaris 15MW' },
                  { id: 'tecoma', num: 2, x: 185, y: 142, color: '#0f172a', label: 'Tecoma 300MW' },
                  { id: 'acacia', num: 3, x: 155, y: 202, color: '#0f172a', label: 'Acacia 100MW' },
                  { id: 'rancha', num: 4, x: 96, y: 228, color: '#0f172a', label: 'Rancha 120MW' },
                  { id: 'oriole', num: 5, x: 140, y: 258, color: '#2563eb', label: 'Oriole 162MW' },
                  { id: 'sequioa', num: 6, x: 180, y: 278, color: '#2563eb', label: 'Sequioa 427MW' },
                  { id: 'shorea', num: 7, x: 370, y: 148, color: '#059669', label: 'Shorea 80MW' },
                  // Shorea also has Tawau conversion unit
                  { id: 'shorea', num: 7, x: 395, y: 295, color: '#059669', label: 'Shorea (Tawau)' }
                ].map((pin, idx) => {
                  const isSelected = selectedProjectId === pin.id;
                  return (
                    <g
                      key={`pin-${idx}`}
                      transform={`translate(${pin.x}, ${pin.y})`}
                      className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                      onClick={() => {
                        setSelectedProjectId(pin.id);
                        setIsBottomSheetExpanded(true);
                      }}
                    >
                      {/* Selection Pulsing Ring */}
                      {isSelected && (
                        <>
                          <circle cx="0" cy="0" r="18" fill={pin.color} opacity="0.3" className="animate-ping" />
                          <circle cx="0" cy="0" r="15" fill="none" stroke="#ffffff" strokeWidth="2.5" />
                        </>
                      )}

                      {/* Main Pin Circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 11.5 : 10}
                        fill={pin.color}
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#pinShadow)"
                      />

                      {/* Pin Number */}
                      <text
                        x="0"
                        y="3.8"
                        textAnchor="middle"
                        fontSize={isSelected ? '10' : '9'}
                        fontWeight="900"
                        fill="#ffffff"
                        className="pointer-events-none"
                      >
                        {pin.num}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tap Pin Hint */}
              <div className="absolute top-1.5 left-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 shadow-sm flex items-center gap-1 pointer-events-none">
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
