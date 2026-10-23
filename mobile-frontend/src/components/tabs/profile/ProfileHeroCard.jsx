import React from 'react';

export function ProfileHeroCard({
  user,
  username,
  uploadingPhoto,
  onOpenPhotoModal,
  onOpenEditNameModal
}) {
  const displayName = user?.preferredName || username;

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center gap-4 relative z-10 min-w-0">
        {/* Avatar with Camera Upload */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shrink-0 text-2xl font-black shadow-inner overflow-hidden relative group hover:opacity-95 transition-all active:scale-95"
            title="Change Profile Photo"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{displayName.charAt(0).toUpperCase()}</span>
            )}

            {/* Uploading Spinner */}
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-10">
                <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
            )}
          </button>

          {/* Camera Badge */}
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white text-emerald-700 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-emerald-600 z-10"
            title="Upload photo"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold truncate">{displayName}</h2>
            <button
              onClick={onOpenEditNameModal}
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs transition-transform active:scale-95 shrink-0"
              title="Edit Leaderboard Preferred Name"
            >
              ✏️
            </button>
          </div>
          {user?.preferredName && user?.preferredName !== username && (
            <div className="text-emerald-100/90 text-[13px] font-semibold truncate leading-tight">
              {username}
            </div>
          )}
          <div className="flex flex-col mt-1">
            <span className="text-emerald-100 text-[12px] font-medium truncate">{user?.division || 'IDD'}</span>
            <span className="text-emerald-200/80 text-[11px]">{user?.staffId || 'DEMO-001'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
