import React from 'react';
import { getUserInitials } from '../../../utils/rbac';

export default function AdminUserCard({
  user,
  isSelf = false,
  adminCount = 1,
  onSelectRoleChange
}) {
  const isAdmin = user.role === 'Admin';

  return (
    <div
      className={`p-3.5 bg-white dark:bg-slate-800 rounded-2xl border transition-all ${
        isAdmin
          ? 'border-emerald-300/80 dark:border-emerald-800/80 shadow-xs'
          : 'border-slate-200/80 dark:border-slate-700/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* User Identity & Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs shadow-inner">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              getUserInitials(user.fullName)
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.fullName || 'Unnamed Staff'}
              </span>

              {user.preferredName && (
                <span className="text-[10px] text-slate-400 truncate">
                  ({user.preferredName})
                </span>
              )}

              {/* Role Badge */}
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  🛡️ Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  👤 Staff
                </span>
              )}

              {isSelf && (
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  You
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              <span className="truncate">{user.email}</span>
              {user.staffId && (
                <>
                  <span>•</span>
                  <span className="font-mono text-[10px] shrink-0">{user.staffId}</span>
                </>
              )}
            </div>

            {user.division && (
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                🏢 {user.division}
              </div>
            )}
          </div>
        </div>

        {/* Role Action Button */}
        <div className="shrink-0 flex items-center">
          {isSelf ? (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-2.5 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
              Active Session
            </span>
          ) : isAdmin ? (
            <button
              onClick={() => onSelectRoleChange(user, 'Staff')}
              disabled={adminCount <= 1}
              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 dark:text-rose-400 rounded-xl text-[11px] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
              title={adminCount <= 1 ? "Cannot demote the only remaining admin" : "Demote to Staff"}
            >
              Revoke Admin
            </button>
          ) : (
            <button
              onClick={() => onSelectRoleChange(user, 'Admin')}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 dark:text-emerald-300 rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
            >
              <span>🛡️</span>
              <span>Grant Admin</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
