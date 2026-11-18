import React from 'react';
import { getUserInitials } from '../../../utils/rbac';

/**
 * Single aligned staff row inside the Admin Staff Directory roster.
 */
export default function AdminUserCard({
  user,
  isSelf = false,
  adminCount = 1,
  onSelectRoleChange,
  onDeleteUser
}) {
  const isAdmin = user.role === 'Admin';

  return (
    <div className="p-4 sm:px-5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/35 transition-colors">
      {/* Left: Avatar + Name + Contact */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs shadow-inner">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            getUserInitials(user.fullName)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white truncate">
              {user.fullName || 'Unnamed Staff'}
            </span>

            {user.preferredName && (
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                @{user.preferredName}
              </span>
            )}

            {isSelf && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                You
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
            <span className="truncate">{user.email}</span>
            {user.staffId && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0 tabular-nums">
                  {user.staffId}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Middle: Division & Role */}
      <div className="flex items-center gap-3 flex-wrap md:justify-end">
        {user.division && (
          <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
            {user.division}
          </span>
        )}

        {isAdmin ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Admin</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 shrink-0">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Staff</span>
          </span>
        )}
      </div>

      {/* Right: Session Status or Role/Delete Actions */}
      <div className="shrink-0 flex items-center gap-2 md:pl-2">
        {isSelf ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active Session</span>
          </span>
        ) : (
          <>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => onSelectRoleChange(user, 'Staff')}
                disabled={adminCount <= 1}
                className="min-h-[38px] px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 dark:text-rose-300 rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                title={adminCount <= 1 ? 'Cannot demote the only remaining admin' : 'Demote to Staff'}
              >
                Revoke Admin
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectRoleChange(user, 'Admin')}
                className="min-h-[38px] px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 dark:text-emerald-300 rounded-xl text-xs font-bold transition active:scale-95 inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Grant Admin</span>
              </button>
            )}

            {onDeleteUser && (
              <button
                type="button"
                onClick={() => onDeleteUser(user)}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition active:scale-90"
                title={`Delete account for ${user.fullName}`}
                aria-label={`Delete ${user.fullName}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
