import React from 'react';

export function ProfileHeroCard({
  user,
  username,
  uploadingPhoto,
  onOpenPhotoModal,
  onOpenEditNameModal
}) {
  const displayName = (user?.preferredName || '').trim() || username;
  const secondaryIdentity = (user?.email || (user?.preferredName && user?.preferredName !== username ? username : '') || '').trim();
  const division = user?.division || 'Information & Digital';
  const staffId = user?.staffId || 'DEMO-001';
  const isAdmin = user?.role === 'Admin';

  return (
    <div className="bg-white/95 dark:bg-slate-800/90 surface-depth-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        {/* Left: Avatar & Identity Details */}
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 text-2xl sm:text-3xl font-black overflow-hidden relative select-none">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}

              {uploadingPhoto && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-10">
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate leading-tight">
                {user?.fullName || displayName}
              </h2>
              {isAdmin ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 inline-flex items-center gap-1">
                  <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                  </svg>
                  Admin
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/60">
                  Staff
                </span>
              )}
              {user?.preferredName && (
                <span className="text-xs sm:text-[13px] font-semibold text-slate-400 dark:text-slate-500">
                  @{user.preferredName}
                </span>
              )}
            </div>

            {secondaryIdentity && (
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-[13px] font-medium truncate mt-0.5">
                {secondaryIdentity}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <span>{division}</span>
              <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">•</span>
              <span className="tabular-nums text-slate-500 dark:text-slate-400">
                ID: {staffId}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t border-slate-100 dark:border-slate-700/60 sm:border-t-0 sm:shrink-0">
          <button
            type="button"
            onClick={onOpenEditNameModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-700/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 border border-slate-200/70 dark:border-slate-600/60"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Name
          </button>
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Change Photo
          </button>
        </div>
      </div>
    </div>
  );
}
