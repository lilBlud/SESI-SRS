import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FUTURE_GEN_STATS,
  FUTURE_GEN_PROJECTS,
  BRIDGING_CAPACITY,
  PIPELINE_STAGES,
  FUEL_TYPE_CONFIG
} from '../../utils/futureGenData';
import {
  SabahInteractiveMap,
  ProjectBreakdownCard,
  PipelineStagesView,
  BridgingCapacityView
} from './future-gen';

export function FutureGenMapModal({ isOpen, onClose, isDark = false }) {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'pipeline' | 'bridging'
  const [selectedProjectId, setSelectedProjectId] = useState('rancha'); // default to Rancha or first project

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedProject = FUTURE_GEN_PROJECTS.find(p => p.id === selectedProjectId) || FUTURE_GEN_PROJECTS[0];
  const selectedFuel = FUEL_TYPE_CONFIG[selectedProject.fuelType] || FUEL_TYPE_CONFIG.gas;

  const handleSelectProjectAndViewMap = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('map');
  };

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
        className="app-shell-frame h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-900 shadow-2xl relative overflow-hidden border-x border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 antialiased"
        onClick={e => e.stopPropagation()}
      >
        {/* Hardware Accelerated HD Background Image - Matches App Theme with Smooth Cross-Fade */}
        <img
          src="/assets/hd_light_topo.jpg"
          alt="Background Light"
          className={`absolute inset-0 w-full h-full object-cover object-center -z-20 pointer-events-none transition-opacity duration-350 ease-in-out ${
            isDark ? 'opacity-0' : 'opacity-40'
          }`}
        />
        <img
          src="/assets/hd_dark_topo.jpg"
          alt="Background Dark"
          className={`absolute inset-0 w-full h-full object-cover object-center -z-20 pointer-events-none transition-opacity duration-350 ease-in-out ${
            isDark ? 'opacity-20' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-0 bg-slate-950/40 -z-10 pointer-events-none transition-opacity duration-350 ease-in-out ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Header Bar - Solid, crisp styling with no blur filters to prevent iOS WebKit font blurring */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 pb-3 pt-[max(env(safe-area-inset-top),14px)] shadow-xs z-20 relative shrink-0 antialiased">
          <div className="max-w-6xl mx-auto flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all duration-150 shrink-0 border border-slate-200/60 dark:border-slate-700/60"
                aria-label="Back to Dictionary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex-1 text-center min-w-0">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                  Future Generation Map
                </h1>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all duration-150 shrink-0 border border-slate-200/60 dark:border-slate-700/60"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* View Mode Switcher - Centered Compact Segmented Control */}
            <div className="w-full max-w-lg mx-auto flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className={`flex-1 min-h-[36px] py-1.5 px-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                  activeTab === 'map'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
                }`}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Sabah Map</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pipeline')}
                className={`flex-1 min-h-[36px] py-1.5 px-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                  activeTab === 'pipeline'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
                }`}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="tabular-nums">Pipeline (6)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bridging')}
                className={`flex-1 min-h-[36px] py-1.5 px-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                  activeTab === 'bridging'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
                }`}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>East Coast</span>
              </button>
            </div>
          </div>
        </div>

        {/* Top 4 KPI Metrics Strip */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 py-2.5 lg:py-3.5 shadow-sm shrink-0">
          <div className="max-w-6xl mx-auto grid grid-cols-4 gap-1.5 tabular-nums">
            <div className="text-center px-1">
              <div className="text-sm sm:text-base lg:text-xl font-black text-slate-900 dark:text-white leading-tight">
                {FUTURE_GEN_STATS.peakDemand}
              </div>
              <div className="text-[10px] sm:text-xs lg:text-[13px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Peak (Sep 26)
              </div>
            </div>
            <div className="text-center px-1 border-l border-slate-200 dark:border-slate-800">
              <div className="text-sm sm:text-base lg:text-xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">
                {FUTURE_GEN_STATS.dependableCapacity}
              </div>
              <div className="text-[10px] sm:text-xs lg:text-[13px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Dependable
              </div>
            </div>
            <div className="text-center px-1 border-l border-slate-200 dark:border-slate-800">
              <div className="text-sm sm:text-base lg:text-xl font-black text-rose-600 dark:text-rose-400 leading-tight">
                {FUTURE_GEN_STATS.reserveMargin}
              </div>
              <div className="text-[10px] sm:text-xs lg:text-[13px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Reserve Margin
              </div>
            </div>
            <div className="text-center px-1 border-l border-slate-200 dark:border-slate-800">
              <div className="text-sm sm:text-base lg:text-xl font-black text-indigo-600 dark:text-indigo-400 leading-tight">
                {FUTURE_GEN_STATS.maxTransfer}
              </div>
              <div className="text-[10px] sm:text-xs lg:text-[13px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Max W→E Grid
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative overflow-hidden">
            {/* Regional Status Pill Strip (Mobile Only) */}
            <div className="lg:hidden px-3 pt-2.5 pb-1 flex items-center justify-between gap-2 shrink-0">
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

            {/* ── LEFT: Interactive Map Viewport (50% Split on Desktop) ── */}
            <div className="w-full lg:w-1/2 h-full min-h-0 flex flex-col relative overflow-hidden bg-[#EEF3F7] dark:bg-slate-950/60 lg:border-r border-slate-200/80 dark:border-slate-800">
              <SabahInteractiveMap
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
                isDark={isDark}
              />
            </div>

            {/* ── RIGHT: Desktop Intelligence Sidebar & Breakdown Panel (50% Equal Split) ── */}
            <div className="w-full lg:w-1/2 lg:shrink-0 flex flex-col bg-white dark:bg-slate-900 border-t lg:border-t-0 overflow-y-auto custom-scrollbar">
              {/* Desktop Regional Reserve Margins (Compact 1-row Strip) */}
              <div className="hidden lg:grid grid-cols-2 gap-2.5 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shrink-0 tabular-nums">
                <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-black text-emerald-800 dark:text-emerald-300">West Coast</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
                      881 MW Peak · 1,090 MW Cap
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-200/70 dark:bg-emerald-900/80 px-2 py-0.5 rounded-md shrink-0">
                    +23.7% RM
                  </span>
                </div>

                <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/60 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-black text-rose-800 dark:text-rose-300">East Coast</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate">
                      421 MW Peak · 322 MW Cap
                    </div>
                  </div>
                  <span className="text-xs font-black text-rose-700 dark:text-rose-300 bg-rose-200/70 dark:bg-rose-900/80 px-2 py-0.5 rounded-md shrink-0">
                    -23.5% RM
                  </span>
                </div>
              </div>

              {/* Desktop Compact Project Selector Chips (1 to 7) */}
              <div className="hidden lg:block px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                  <span>Generation Projects</span>
                  <span className="tabular-nums text-slate-400">{FUTURE_GEN_PROJECTS.length} Pins</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {FUTURE_GEN_PROJECTS.map(p => {
                    const isSel = p.id === selectedProjectId;
                    const fuel = FUEL_TYPE_CONFIG[p.fuelType] || FUEL_TYPE_CONFIG.gas;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProjectId(p.id)}
                        className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left transition-all duration-150 active:scale-[0.97] border ${
                          isSel
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-700 text-rose-950 dark:text-rose-100 ring-1 ring-rose-500/20'
                            : 'bg-white dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 tabular-nums"
                          style={{ backgroundColor: fuel?.color || '#0F172A' }}
                        >
                          {p.pinNumber}
                        </span>
                        <span className="text-xs font-bold whitespace-nowrap">{p.name}</span>
                        <span className={`text-[11px] font-extrabold tabular-nums whitespace-nowrap ${isSel ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
                          {p.capacity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Breakdown Detail Card */}
              <div className="flex-1 flex flex-col min-h-0">
                <ProjectBreakdownCard
                  selectedProject={selectedProject}
                  selectedFuel={selectedFuel}
                  totalProjects={FUTURE_GEN_PROJECTS.length}
                  onPrev={handlePrevProject}
                  onNext={handleNextProject}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Table View */}
        {activeTab === 'pipeline' && (
          <PipelineStagesView
            pipelineStages={PIPELINE_STAGES}
            projects={FUTURE_GEN_PROJECTS}
            fuelConfig={FUEL_TYPE_CONFIG}
            onSelectProject={handleSelectProjectAndViewMap}
          />
        )}

        {/* East Coast Bridging Capacity View */}
        {activeTab === 'bridging' && (
          <BridgingCapacityView
            bridgingCapacity={BRIDGING_CAPACITY}
            eastCoastStats={FUTURE_GEN_STATS.eastCoast}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
