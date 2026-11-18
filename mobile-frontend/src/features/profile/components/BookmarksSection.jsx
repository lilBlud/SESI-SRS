import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getColor, getCatMeta } from '../../../utils/constants';
import { PostImageSlider, saveImage } from '../../../components/ui';
import { ImageViewerModal } from '../../../components/modals';
import { exportBookmarksToPdf, exportSingleTermToPdf } from '../../../utils/pdfExport';
import { unpackPosterImages } from '../../../domain/glossaryModel';
import { GlossaryTermDetailCard } from '../../glossary/components';

export function BookmarksSection({ bookmarks = [], toggleBookmark, setActiveTab }) {
  const [activeBookmark, setActiveBookmark] = useState(null);
  const [imgViewerIdx, setImgViewerIdx] = useState(null);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const viewerImages = activeBookmark?.type === 'poster' ? unpackPosterImages(activeBookmark) : [];

  return (
    <div className="space-y-3 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-[17px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Saved Bookmarks
              </h3>
              {bookmarks.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                  {bookmarks.length}
                </span>
              )}
            </div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-normal">
              Your saved posters and dictionary reference cards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {bookmarks.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => exportBookmarksToPdf(bookmarks)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs shrink-0"
                title="Download PDF Reference Guide of saved bookmarks"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Save as PDF</span>
              </button>

              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={scrollLeft}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-xs"
                  title="Scroll Left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={scrollRight}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-xs"
                  title="Scroll Right"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bookmarks List or Empty State */}
      {bookmarks.length === 0 ? (
        <div className="w-full text-center py-10 px-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-300 flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Bookmarks Saved Yet
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Tap the bookmark icon on any infographic poster or glossary card to keep quick references in your profile.
          </p>
          {setActiveTab && (
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab('glossary')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
              >
                Explore Dictionary
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
              >
                Browse Posters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-hide mask-fade-x -mx-4 px-5 sm:mx-0 sm:px-3"
        >
          {bookmarks.map((bm, idx) => {
            if (bm.type === 'poster') {
              const img = unpackPosterImages(bm)[0] || null;
              return (
                <div
                  key={bm.id || idx}
                  onClick={() => setActiveBookmark(bm)}
                  className="w-[180px] h-[240px] shrink-0 snap-center concentric-card surface-depth-1 border-alpha overflow-hidden bg-white dark:bg-slate-800 shadow-sm flex flex-col cursor-pointer active:scale-95 transition-all"
                >
                  {img ? (
                    <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative min-h-0">
                      <img src={img} alt={bm.title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md z-10">Poster</div>
                      <button
                        type="button"
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
            }
            if (bm.type === 'glossary') {
              const clr = bm.cat ? getColor(bm.cat) : getColor('All');
              const catMeta = bm.cat ? getCatMeta(bm.cat) : getCatMeta('All');
              return (
                <div
                  key={bm.id || bm.term || idx}
                  onClick={() => setActiveBookmark(bm)}
                  className="w-[180px] h-[240px] shrink-0 snap-center concentric-card surface-depth-1 border-alpha p-4 shadow-sm flex flex-col cursor-pointer active:scale-95 transition-all relative overflow-hidden bg-white dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between mb-2 shrink-0 gap-2">
                    <div className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap truncate ${clr.text}`}>
                      {catMeta.emoji} {bm.cat || 'Dictionary'}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(bm, 'glossary'); }}
                      className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center active:scale-95 ${clr.bg} ${clr.text}`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col min-h-0 mt-1">
                    <div className="font-black text-[15px] font-mono mb-1 shrink-0 line-clamp-2 text-slate-900 dark:text-white">
                      {bm.term}
                      {bm.full && !bm.term.includes(' ') && (
                        <span className="ml-1 font-sans text-[11px] font-bold text-slate-500">({bm.full})</span>
                      )}
                    </div>
                    <div className="text-[11px] line-clamp-5 leading-relaxed overflow-hidden text-slate-500 dark:text-slate-400">{bm.desc}</div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Active Bookmark Modal */}
      {activeBookmark && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveBookmark(null)}
        >
          <div
            className="bg-slate-100 dark:bg-slate-900 surface-depth-3 border-alpha w-full max-w-[400px] max-h-[85dvh] concentric-card shadow-2xl flex flex-col transform transition-all animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-alpha">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">
                {activeBookmark.type === 'poster' ? 'Poster' : 'Dictionary Card'}
              </h2>
              <button
                type="button"
                onClick={() => setActiveBookmark(null)}
                className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold active:scale-95"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {activeBookmark.type === 'poster' ? (() => {
                const clr = activeBookmark.cat ? getColor(activeBookmark.cat) : getColor('All');
                const catMeta = activeBookmark.cat ? getCatMeta(activeBookmark.cat) : getCatMeta('All');
                const allImages = unpackPosterImages(activeBookmark);
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
                    {activeBookmark.description && (
                      <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
                        {activeBookmark.description}
                      </p>
                    )}
                    {allImages.length > 0 && (
                      <div className="space-y-2">
                        <PostImageSlider images={allImages} title={activeBookmark.title} onImageClick={(idx) => setImgViewerIdx(idx)} />
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {allImages.length > 0 && (
                        <button
                          type="button"
                          onClick={() => saveImage(allImages[0], `${(activeBookmark.title || 'poster').replace(/\s+/g, '_')}.png`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-xl transition-all active:scale-95"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Save Image
                        </button>
                      )}
                    </div>
                  </div>
                );
              })() : (() => {
                const clr = activeBookmark.cat ? getColor(activeBookmark.cat) : getColor('All');
                return (
                  <div className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/5 ring-2 ${clr.border}`}>
                    <div className="p-4 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-[15px] text-slate-900 dark:text-white">
                          {activeBookmark.term}
                          {activeBookmark.full && !activeBookmark.term.includes(' ') && (
                            <span className="ml-2 font-semibold text-[13px] text-slate-500 dark:text-slate-400">
                              ({activeBookmark.full})
                            </span>
                          )}
                        </h3>
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                      <GlossaryTermDetailCard
                        item={activeBookmark}
                        variant="compact"
                        onExportPdf={exportSingleTermToPdf}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}

      <ImageViewerModal
        isOpen={imgViewerIdx !== null && viewerImages.length > 0}
        images={viewerImages}
        currentIndex={imgViewerIdx ?? 0}
        onClose={() => setImgViewerIdx(null)}
        onChangeIndex={setImgViewerIdx}
      />
    </div>
  );
}
