import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { InstagramPhotoCropper } from '../../ui';

export function ProfilePhotoPickerModal({
  isOpen,
  onClose,
  user,
  username,
  uploadingPhoto,
  onSavePhoto,
  onRemovePhoto
}) {
  const [selectedPhotoSrc, setSelectedPhotoSrc] = useState(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const displayName = user?.preferredName || username;

  const handlePhotoFileSelected = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setSelectedPhotoSrc(loadEvt.target.result);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCropped = async (croppedBase64) => {
    await onSavePhoto(croppedBase64);
    setSelectedPhotoSrc(null);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <>
      <input
        type="file"
        ref={galleryInputRef}
        onChange={(e) => handlePhotoFileSelected(e.target.files?.[0])}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={(e) => handlePhotoFileSelected(e.target.files?.[0])}
        accept="image/*"
        capture="user"
        className="hidden"
      />

      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={onClose}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl border-t sm:border border-slate-100 dark:border-slate-800 animate-slideUp sm:animate-scaleIn text-center relative overflow-hidden pb-[max(env(safe-area-inset-bottom),24px)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Grab handle for mobile bottom sheet */}
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

            {/* Current avatar preview */}
            <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 p-0.5 bg-white dark:bg-slate-800">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Current profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center text-3xl font-black rounded-full">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <h3 className="text-[18px] font-black text-slate-900 dark:text-white">Change Profile Photo</h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 mb-5 leading-relaxed">
              Snap a new picture or choose from your library with Instagram-style crop & scale
            </p>

            <div className="space-y-2.5">
              {/* Option 1: Take Photo */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-full py-3.5 px-4 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold text-[14px] rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-emerald-200/60 dark:border-emerald-800/50 shadow-xs"
              >
                <span className="text-xl">📸</span>
                <span>Take Photo</span>
              </button>

              {/* Option 2: Choose from Library */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-[14px] rounded-2xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span className="text-xl">🖼️</span>
                <span>Choose from Library</span>
              </button>

              {/* Option 3: Remove Current Photo */}
              {user?.profilePicture && (
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  disabled={uploadingPhoto}
                  className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-[13px] rounded-2xl transition-all active:scale-95 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Remove Current Photo</span>
                </button>
              )}

              {/* Option 4: Cancel */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[13px] rounded-2xl transition-all active:scale-95 mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Instagram Move & Scale Cropper Modal */}
      {selectedPhotoSrc && createPortal(
        <InstagramPhotoCropper
          imageSrc={selectedPhotoSrc}
          onCancel={() => setSelectedPhotoSrc(null)}
          onSave={handleSaveCropped}
          isSaving={uploadingPhoto}
        />,
        document.body
      )}
    </>
  );
}
