import React from 'react';

export function GlossaryFutureGenCard({ onOpenMap }) {
  return (
    <div
      onClick={onOpenMap}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-rose-600 to-indigo-900 p-4 shadow-[0_10px_30px_rgba(225,29,72,0.25)] text-white cursor-pointer active:scale-[0.99] transition-all hover:shadow-[0_14px_34px_rgba(225,29,72,0.35)] ring-1 ring-white/20 group animate-fadeIn"
    >
      {/* Subtle animated light glow in background */}
      <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              📌 Pinned BDV Pipeline
            </span>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-200 border border-rose-400/30">
              6 Projects · 1,189 MW
            </span>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-200 border border-indigo-400/30">
              Security of Supply
            </span>
          </div>

          <h3 className="font-black text-[17px] text-white mt-1.5 flex items-center gap-2 leading-tight">
            <span>🗺️ Future Generation Map</span>
          </h3>

          <p className="text-[12.5px] text-rose-100/90 mt-1 leading-relaxed line-clamp-2">
            Interactive Sabah generation pipeline map across West & East coasts. Tap pins on the map to explore capacity, plant types, COD, status and watch items.
          </p>

          {/* Quick tags */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="bg-black/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-1">
              <span>📍</span> Interactive Sabah SVG
            </span>
            <span className="bg-black/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-1">
              <span>⚡</span> 10% → 30% Reserve Margin
            </span>
            <span className="bg-black/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-1">
              <span>📋</span> Pipeline Table
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center justify-between self-stretch pl-1">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-110 group-hover:bg-white/30 transition-all">
            →
          </div>
          <span className="text-[9px] font-black text-white/80 uppercase tracking-wider mt-auto">
            Explore
          </span>
        </div>
      </div>
    </div>
  );
}
