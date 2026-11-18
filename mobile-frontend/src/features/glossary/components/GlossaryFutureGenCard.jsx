import React from 'react';

export function GlossaryFutureGenCard({ onOpenMap }) {
  return (
    <div
      onClick={onOpenMap}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-rose-600 to-indigo-900 p-5 shadow-[0_10px_30px_rgba(225,29,72,0.25)] text-white cursor-pointer active:scale-[0.99] transition-all hover:shadow-[0_14px_34px_rgba(225,29,72,0.35)] ring-1 ring-white/20 group animate-fadeIn"
    >
      {/* Subtle animated light glow in background */}
      <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-[17px] sm:text-lg text-white flex items-center gap-2 leading-tight">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" vectorEffect="non-scaling-stroke" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Future Generation Map</span>
          </h3>

          <p className="text-[12.5px] sm:text-[13px] text-rose-100/95 mt-1.5 leading-relaxed line-clamp-2">
            Sabah generation pipeline across the West &amp; East coasts. Select project pins to inspect capacity, fuel mix, COD, and watch items.
          </p>
        </div>

        <div className="shrink-0 w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-110 group-hover:bg-white/30 transition-all">
          →
        </div>
      </div>
    </div>
  );
}
