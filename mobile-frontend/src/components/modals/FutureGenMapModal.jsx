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
import {
  SabahInteractiveMap,
  ProjectBreakdownCard,
  PipelineStagesView,
  BridgingCapacityView
} from './future-gen';

export function FutureGenMapModal({ isOpen, onClose, isDark = false }) {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'pipeline' | 'bridging'
  const [selectedProjectId, setSelectedProjectId] = useState('rancha'); // default to Rancha or first project

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

            {/* Sabah SVG Interactive Map Canvas */}
            <SabahInteractiveMap
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              isDark={isDark}
            />

            {/* Project Breakdown Detail Card */}
            <ProjectBreakdownCard
              selectedProject={selectedProject}
              selectedFuel={selectedFuel}
              totalProjects={FUTURE_GEN_PROJECTS.length}
              onPrev={handlePrevProject}
              onNext={handleNextProject}
            />
          </div>
        )}

        {/* Pipeline Table View */}
        {activeTab === 'pipeline' && (
          <PipelineStagesView
            pipelineStages={PIPELINE_STAGES}
            projects={FUTURE_GEN_PROJECTS}
            watchItems={WATCH_ITEMS}
          />
        )}

        {/* East Coast Bridging Capacity View */}
        {activeTab === 'bridging' && (
          <BridgingCapacityView
            bridgingCapacity={BRIDGING_CAPACITY}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
