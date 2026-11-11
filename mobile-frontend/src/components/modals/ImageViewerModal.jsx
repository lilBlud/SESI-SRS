import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { saveImage } from '../ui';

export function ImageViewerModal({
  isOpen,
  images = [],
  currentIndex = 0,
  onClose,
  onChangeIndex
}) {
  const currentIdx = Math.min(Math.max(0, currentIndex), Math.max(0, images.length - 1));
  const currentImg = images[currentIdx];

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    if (onChangeIndex && images.length > 1) {
      onChangeIndex(currentIdx === 0 ? images.length - 1 : currentIdx - 1);
    }
  }, [currentIdx, images.length, onChangeIndex]);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    if (onChangeIndex && images.length > 1) {
      onChangeIndex(currentIdx === images.length - 1 ? 0 : currentIdx + 1);
    }
  }, [currentIdx, images.length, onChangeIndex]);

  // Keyboard navigation: Escape to close, Left/Right arrow keys to cycle images
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !images || images.length === 0) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex flex-col bg-slate-950/95 backdrop-blur-2xl animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-[max(env(safe-area-inset-top),20px)] pb-3 z-30">
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center gap-1.5 text-white active:scale-95 transition-all text-xs font-bold"
          aria-label="Close image viewer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden sm:inline">Close</span>
        </button>

        <span className="text-white/80 text-xs sm:text-sm font-bold bg-white/10 px-3.5 py-1 rounded-full border border-white/15 backdrop-blur-md tabular-nums">
          {images.length > 1 ? `Image ${currentIdx + 1} of ${images.length}` : 'Poster View'}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            saveImage(currentImg, `sesi-poster-${currentIdx + 1}.png`);
          }}
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center gap-1.5 text-white active:scale-95 transition-all text-xs font-bold"
          aria-label="Download image"
          title="Save image to device"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>

      {/* Main Image Viewport & Navigation Chevrons */}
      <div
        className="flex-1 flex items-center justify-center p-3 sm:p-6 relative min-h-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImg}
          alt={`Poster preview ${currentIdx + 1}`}
          className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-all duration-300 ring-1 ring-white/10"
        />

        {/* Previous Image Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/25 flex items-center justify-center backdrop-blur-xl transition-all active:scale-90 hover:scale-105 shadow-2xl z-30"
            aria-label="Previous image"
            title="Previous (Left arrow key)"
          >
            <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Image Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/25 flex items-center justify-center backdrop-blur-xl transition-all active:scale-90 hover:scale-105 shadow-2xl z-30"
            aria-label="Next image"
            title="Next (Right arrow key)"
          >
            <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 pb-[max(env(safe-area-inset-bottom),20px)] z-30 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onChangeIndex) onChangeIndex(i);
              }}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden ring-2 transition-all duration-200 shrink-0 ${
                i === currentIdx
                  ? 'ring-emerald-400 scale-105 opacity-100 shadow-md shadow-emerald-500/30'
                  : 'ring-transparent opacity-40 hover:opacity-80'
              }`}
              aria-label={`Switch to image ${i + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
