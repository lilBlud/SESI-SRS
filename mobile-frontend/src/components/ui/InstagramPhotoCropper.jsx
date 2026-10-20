import React, { useState, useRef, useEffect } from 'react';

/**
 * Instagram-Style Profile Photo Cropper
 * Features:
 * - Circular mask viewport with rule-of-thirds grid lines
 * - Touch & mouse pan/drag
 * - Smooth zoom slider (1x - 3x) and nudge buttons (+ / -)
 * - 90-degree rotation support
 * - Reset position button
 * - Live mini avatar preview
 * - High quality, compact JPEG canvas export (~30-40KB)
 */
export function InstagramPhotoCropper({ imageSrc, onCancel, onSave, isSaving }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0, baseWidth: 0, baseHeight: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const CROP_SIZE = 280; // Diameter of crop circle in px
  const OUTPUT_SIZE = 360; // Export resolution

  // Load and calculate baseline image dimensions
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const nw = img.naturalWidth || 400;
      const nh = img.naturalHeight || 400;
      // Calculate cover dimensions so shorter side matches CROP_SIZE
      const aspect = nw / nh;
      let bw, bh;
      if (aspect > 1) {
        bh = CROP_SIZE;
        bw = CROP_SIZE * aspect;
      } else {
        bw = CROP_SIZE;
        bh = CROP_SIZE / aspect;
      }
      setImgDims({ width: nw, height: nh, baseWidth: bw, baseHeight: bh });
      setPos({ x: 0, y: 0 });
      setScale(1);
      setRotation(0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Update live preview thumbnail whenever scale, pos, or rotation changes
  useEffect(() => {
    if (!imgRef.current || !imgDims.baseWidth) return;
    const timer = setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        const ratio = 80 / CROP_SIZE;

        ctx.save();
        ctx.translate(40, 40);
        ctx.translate(pos.x * ratio, pos.y * ratio);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);

        const dw = imgDims.baseWidth * ratio;
        const dh = imgDims.baseHeight * ratio;
        ctx.drawImage(imgRef.current, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();

        setPreviewUrl(canvas.toDataURL('image/jpeg', 0.8));
      } catch { }
    }, 80);
    return () => clearTimeout(timer);
  }, [scale, pos, rotation, imgDims]);

  // Touch Handlers for Dragging
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pos.x,
        y: e.touches[0].clientY - pos.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    setPos({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse Handlers for Desktop Dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPos({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleRotate = () => {
    setRotation(r => (r + 90) % 360);
  };

  const handleReset = () => {
    setPos({ x: 0, y: 0 });
    setScale(1);
    setRotation(0);
  };

  const handleExport = async () => {
    if (!imgRef.current || !imgDims.baseWidth) return;
    setErrorMsg('');
    try {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');
      const ratio = OUTPUT_SIZE / CROP_SIZE;

      // Fill white background for safety
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      ctx.save();
      ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);
      ctx.translate(pos.x * ratio, pos.y * ratio);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);

      const dw = imgDims.baseWidth * ratio;
      const dh = imgDims.baseHeight * ratio;
      ctx.drawImage(imgRef.current, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();

      const finalBase64 = canvas.toDataURL('image/jpeg', 0.84);
      if (onSave) {
        await onSave(finalBase64);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to crop photo');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-slate-950 text-white select-none animate-fadeIn">
      {/* ─── Top Bar (Instagram Style) ─── */}
      <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),16px)] pb-3 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md z-30">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="text-[14px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
        >
          Cancel
        </button>

        <div className="text-center">
          <div className="text-[15px] font-black text-white leading-tight">Edit Profile Photo</div>
          <div className="text-[10px] font-medium text-slate-400">Move & Scale to fit circle</div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={isSaving}
          className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-[13px] font-black rounded-full shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Done</span>
              <span className="text-xs">✓</span>
            </>
          )}
        </button>
      </div>

      {/* ─── Error Notification ─── */}
      {errorMsg && (
        <div className="mx-4 mt-3 p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-[12px] font-bold text-rose-300 flex items-center justify-between animate-fadeIn z-30">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 font-bold ml-2">✕</button>
        </div>
      )}

      {/* ─── Viewport Area (Circular Crop Frame) ─── */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden bg-black touch-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Invisible image element to measure & draw from */}
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Original"
          className="hidden"
          crossOrigin="anonymous"
        />

        {/* The Image inside crop viewport */}
        {imgDims.baseWidth > 0 && (
          <div
            className="absolute pointer-events-none transition-transform duration-75 ease-out"
            style={{
              width: `${imgDims.baseWidth}px`,
              height: `${imgDims.baseHeight}px`,
              transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={imageSrc}
              alt="Crop Target"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        )}

        {/* ─── Circular Viewfinder Overlay ─── */}
        <div
          className="pointer-events-none absolute z-20 rounded-full border-2 border-emerald-400/90 shadow-[0_0_0_9999px_rgba(3,7,18,0.78)] transition-all"
          style={{ width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px` }}
        >
          {/* Instagram Rule-of-Thirds Grid inside Circle */}
          <div className="w-full h-full relative rounded-full overflow-hidden opacity-35">
            {/* Horizontal grid lines */}
            <div className="absolute inset-x-0 top-1/3 border-b border-white/60"></div>
            <div className="absolute inset-x-0 top-2/3 border-b border-white/60"></div>
            {/* Vertical grid lines */}
            <div className="absolute inset-y-0 left-1/3 border-r border-white/60"></div>
            <div className="absolute inset-y-0 left-2/3 border-r border-white/60"></div>
          </div>
        </div>

        {/* Helper Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-[11px] font-bold text-slate-300 pointer-events-none flex items-center gap-1.5 shadow-lg">
          <span>👆 Drag photo to position face in circle</span>
        </div>
      </div>

      {/* ─── Bottom Controls Panel (Instagram Style) ─── */}
      <div className="bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 p-4 space-y-4 pb-[max(env(safe-area-inset-bottom),20px)] z-30">
        
        {/* Zoom Slider + Nudge Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setScale(s => Math.max(1, +(s - 0.15).toFixed(2)))}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold active:scale-95 text-base hover:text-white"
            title="Zoom out"
          >
            −
          </button>

          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">🔍</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.02"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => setScale(s => Math.min(3, +(s + 0.15).toFixed(2)))}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold active:scale-95 text-base hover:text-white"
            title="Zoom in"
          >
            +
          </button>
        </div>

        {/* Action Row: Rotate, Reset, and Live Preview */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRotate}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[12px] font-bold text-slate-300 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>⟳</span>
              <span>Rotate 90°</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[12px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>↺</span>
              <span>Reset</span>
            </button>
          </div>

          {/* Mini Live Preview */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preview</span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/80 shrink-0 bg-slate-800">
              {previewUrl && <img src={previewUrl} alt="" className="w-full h-full object-cover" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
