import React from 'react';
import { createPortal } from 'react-dom';
import { saveImage } from '../ui';

export function ImageViewerModal({
  isOpen,
  images = [],
  currentIndex = 0,
  onClose,
  onChangeIndex
}) {
  if (!isOpen || !images || images.length === 0) return null;

  const currentIdx = Math.min(Math.max(0, currentIndex), images.length - 1);
  const currentImg = images[currentIdx];

  const handlePrev = (e) => {
    e.stopPropagation();
    if (onChangeIndex && currentIdx > 0) {
      onChangeIndex(currentIdx - 1);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (onChangeIndex && currentIdx < images.length - 1) {
      onChangeIndex(currentIdx + 1);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[110] flex flex-col bg-black animate-fadeIn" 
      onClick={onClose}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),16px)] pb-2 z-10">
        <button 
          onClick={onClose} 
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
          aria-label="Close image viewer"
        >
          <span className="text-xl leading-none font-bold">←</span>
        </button>
        <span className="text-white/70 text-[13px] font-bold">
          {currentIdx + 1} / {images.length}
        </span>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            saveImage(currentImg, 'sesi-image.png'); 
          }} 
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
          aria-label="Download image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 flex items-center justify-center px-4 relative" onClick={(e) => e.stopPropagation()}>
        <img 
          src={currentImg} 
          alt={`Image ${currentIdx + 1}`} 
          className="max-w-full max-h-full object-contain rounded-lg" 
        />
        {currentIdx > 0 && (
          <button 
            onClick={handlePrev} 
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold active:scale-95"
            aria-label="Previous image"
          >
            ←
          </button>
        )}
        {currentIdx < images.length - 1 && (
          <button 
            onClick={handleNext} 
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold active:scale-95"
            aria-label="Next image"
          >
            →
          </button>
        )}
      </div>

      {/* Thumbnail strip at bottom */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 px-4 py-3 pb-[max(env(safe-area-inset-bottom),16px)]">
          {images.map((img, i) => (
            <button 
              key={i} 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (onChangeIndex) onChangeIndex(i); 
              }} 
              className={`w-12 h-12 rounded-lg overflow-hidden ring-2 transition-all ${
                i === currentIdx ? 'ring-white scale-110' : 'ring-transparent opacity-50'
              }`}
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
