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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-5 sm:p-6 shadow-md border border-emerald-500/20">
      {/* Decorative ambient background accents */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-16 w-56 h-56 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        {/* Left: Avatar & Identity Details */}
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          {/* Avatar with Camera Trigger */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={onOpenPhotoModal}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30 text-2xl sm:text-3xl font-black shadow-inner overflow-hidden relative group hover:opacity-95 transition-all active:scale-95"
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
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              )}
            </button>

            {/* Camera Action Badge */}
            <button
              type="button"
              onClick={onOpenPhotoModal}
              className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white text-emerald-800 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-emerald-600/30 z-10"
              title="Upload Photo"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* User Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate leading-tight">
                {displayName}
              </h2>
              {user?.role === 'Admin' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950/60 text-emerald-200 border border-emerald-400/40 inline-flex items-center gap-1 shadow-xs">
                  <svg className="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                  </svg>
                  Admin
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/15 text-white border border-white/20 shadow-xs">
                  Staff
                </span>
              )}
              <button
                type="button"
                onClick={onOpenEditNameModal}
                className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/90 hover:text-white transition-all active:scale-95 shrink-0"
                title="Edit Preferred Name"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            {user?.preferredName && user?.preferredName !== username && (
              <p className="text-emerald-100/90 text-[13px] font-medium truncate mt-0.5">
                {username}
              </p>
            )}

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap mt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-100 font-medium">
                <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {user?.division || 'Information & Digital'}
              </span>
              <span className="text-emerald-300/50 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-100 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                ID: {user?.staffId || 'DEMO-001'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t border-white/10 sm:border-t-0 sm:shrink-0">
          <button
            type="button"
            onClick={onOpenEditNameModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 active:scale-95 shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Name
          </button>
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-all active:scale-95 shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Change Photo
          </button>
        </div>
      </div>
    </div>
  );
}
