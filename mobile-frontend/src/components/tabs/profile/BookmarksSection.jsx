import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { getColor, getCatMeta } from '../../../utils/constants';
import { CorporatePerformanceChart, PostImageSlider, saveImage } from '../../ui';
import { exportBookmarksToPdf, exportSingleTermToPdf } from '../../../utils/pdfExport';

export function BookmarksSection({ bookmarks = [], toggleBookmark }) {
  const [activeBookmark, setActiveBookmark] = useState(null);
  const [imgViewerIdx, setImgViewerIdx] = useState(null);

  return (
    <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
      {/* Header */}
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
            onClick={() => exportBookmarksToPdf(bookmarks)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs shrink-0"
            title="Download PDF Reference Guide of saved bookmarks"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Save as PDF</span>
          </button>
        )}
      </div>

      {/* Bookmarks Horizontal Scroll List */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4">
        {bookmarks.length === 0 ? (
          <div className="w-full text-center py-8 text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            No bookmarks yet. Tap the bookmark icon on any poster or dictionary card to save it here.
          </div>
        ) : (
          bookmarks.map((bm, idx) => {
            if (bm.type === 'poster') {
              const img = bm.imageUrl || (bm.additionalImages && bm.additionalImages.length > 0 ? bm.additionalImages[0] : null);
              return (
                <div
                  key={idx}
                  onClick={() => setActiveBookmark(bm)}
                  className="w-[180px] h-[240px] shrink-0 snap-center rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm ring-1 ring-black/5 flex flex-col cursor-pointer active:scale-95 transition-all"
                >
                  {img ? (
                    <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative min-h-0">
                      <img src={img} alt={bm.title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md z-10">Poster</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(bm, 'poster'); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white active:scale-95 z-10 backdrop-blur-md"
                      >
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
              return (
                <div
                  key={idx}
                  onClick={() => setActiveBookmark(bm)}
                  className="w-[180px] h-[240px] shrink-0 snap-center rounded-3xl p-4 shadow-sm ring-1 flex flex-col cursor-pointer active:scale-95 transition-all relative overflow-hidden bg-white dark:bg-slate-800 ring-black/5 dark:ring-white/10"
                >
                  <div className="flex items-start justify-between mb-2 shrink-0 gap-2">
                    <div className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap truncate ${clr.text}`}>
                      {catMeta.emoji} {bm.cat || 'Dictionary'}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(bm, 'glossary'); }}
                      className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center active:scale-95 ${clr.bg} ${clr.text}`}
                    >
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

      {/* Active Bookmark Full Modal */}
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
                  const allImages = [];
                  if (activeBookmark.imageUrl) allImages.push(activeBookmark.imageUrl);
                  if (activeBookmark.additionalImages) {
                    try {
                      const parsed = typeof activeBookmark.additionalImages === 'string' ? JSON.parse(activeBookmark.additionalImages) : activeBookmark.additionalImages;
                      if (Array.isArray(parsed)) allImages.push(...parsed);
                    } catch (e) { }
                  }

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
                      {allImages.length > 0 && (
                        <div className="space-y-2">
                          <PostImageSlider images={allImages} title={activeBookmark.title} onImageClick={(idx) => setImgViewerIdx(idx)} />
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        {allImages.length > 0 && (
                          <button
                            onClick={() => saveImage(allImages[0], `${activeBookmark.title.replace(/\s+/g, '_')}.png`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl transition-all active:scale-95"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Save Image
                          </button>
                        )}
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
                          {(activeBookmark.cat === 'Corporate Performance' || (activeBookmark.chartData && activeBookmark.chartData.length > 5 && activeBookmark.chartData !== '[]')) ? (
                            <div className="space-y-2 mt-3 mb-2">
                              <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-3 leading-relaxed whitespace-pre-wrap">{activeBookmark.desc}</p>
                              <CorporatePerformanceChart chartData={activeBookmark.chartData} term={activeBookmark.term || activeBookmark.title || ""} description="" yAxisFormat={activeBookmark.formulaNotations || activeBookmark.yAxisFormat} formula={activeBookmark.formula} />
                            </div>
                          ) : (
                            <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">{activeBookmark.desc}</p>
                          )}
                        </div>

                        {activeBookmark.formula && activeBookmark.formula !== 'area' && activeBookmark.formula !== 'bar' && (
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
                                exportSingleTermToPdf(activeBookmark, catMeta);
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
              <div className="w-8" />
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
