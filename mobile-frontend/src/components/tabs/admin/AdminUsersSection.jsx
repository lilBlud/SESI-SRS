import React, { useState } from 'react';

export default function AdminUsersSection({
  users = [],
  currentUser,
  loading = false,
  onUpdateRole,
  onRefreshUsers
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all' | 'Admin' | 'Staff'
  const [targetUser, setTargetUser] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Counts
  const totalCount = users.length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const staffCount = totalCount - adminCount;

  // Normalized search
  const filteredUsers = users.filter(u => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.trim().toLowerCase();
    return (
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.preferredName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.staffId || '').toLowerCase().includes(q) ||
      (u.division || '').toLowerCase().includes(q)
    );
  });

  const handleOpenConfirm = (user, newRole) => {
    setActionError('');
    setActionSuccess('');

    // Prevent self-demotion
    if (currentUser && (
      uMatch(user, currentUser)
    ) && newRole === 'Staff') {
      setActionError("You cannot revoke your own administrator privileges to prevent locking yourself out.");
      return;
    }

    // Prevent demoting last admin
    if (user.role === 'Admin' && newRole === 'Staff' && adminCount <= 1) {
      setActionError("Cannot demote the last remaining Administrator. At least one admin must exist.");
      return;
    }

    setTargetUser(user);
    setPendingRole(newRole);
  };

  const handleConfirmRoleChange = async () => {
    if (!targetUser || !pendingRole) return;
    setIsUpdating(true);
    setActionError('');
    try {
      await onUpdateRole(targetUser.id || targetUser.email, pendingRole);
      setActionSuccess(`Successfully changed ${targetUser.fullName}'s role to ${pendingRole}!`);
      setTargetUser(null);
      setPendingRole(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setActionError(err.message || 'Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  function uMatch(a, b) {
    if (!a || !b) return false;
    if (a.id && b.id && a.id === b.id) return true;
    if (a.email && b.email && a.email.toLowerCase() === b.email.toLowerCase()) return true;
    if (a.staffId && b.staffId && a.staffId.toLowerCase() === b.staffId.toLowerCase()) return true;
    return false;
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* ─── Metric Summary Cards ─── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{totalCount}</span>
        </div>
        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/50 shadow-xs flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Admins</span>
          <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">{adminCount}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Staff</span>
          <span className="text-xl font-black text-slate-700 dark:text-slate-300 mt-0.5">{staffCount}</span>
        </div>
      </div>

      {/* ─── Toast Feedback Alerts ─── */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-800 text-sm font-bold">×</button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')} className="text-rose-600 hover:text-rose-800 text-sm font-bold">×</button>
        </div>
      )}

      {/* ─── Search & Role Filters ─── */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, staff ID, division..."
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              filterRole === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilterRole('Admin')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              filterRole === 'Admin'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            Admins ({adminCount})
          </button>
          <button
            onClick={() => setFilterRole('Staff')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              filterRole === 'Staff'
                ? 'bg-slate-700 text-white dark:bg-slate-600'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            Staff ({staffCount})
          </button>
        </div>
      </div>

      {/* ─── User List ─── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-2">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Loading user roster...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
          <div className="text-3xl">🔍</div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No users found</p>
          <p className="text-[11px] text-slate-400">Try modifying your search or filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map((u) => {
            const isSelf = currentUser && uMatch(u, currentUser);
            const isAdmin = u.role === 'Admin';

            return (
              <div
                key={u.id || u.email}
                className={`p-3.5 bg-white dark:bg-slate-800 rounded-2xl border transition-all ${
                  isAdmin
                    ? 'border-emerald-300/80 dark:border-emerald-800/80 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* User info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs shadow-inner">
                      {u.profilePicture ? (
                        <img src={u.profilePicture} alt={u.fullName} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(u.fullName)
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {u.fullName || 'Unnamed Staff'}
                        </span>
                        {u.preferredName && (
                          <span className="text-[10px] text-slate-400 truncate">
                            ({u.preferredName})
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
                        <span className="truncate">{u.email}</span>
                        {u.staffId && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[10px] shrink-0">{u.staffId}</span>
                          </>
                        )}
                      </div>

                      {u.division && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                          🏢 {u.division}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 flex items-center">
                    {isSelf ? (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        Active Session
                      </span>
                    ) : isAdmin ? (
                      <button
                        onClick={() => handleOpenConfirm(u, 'Staff')}
                        disabled={adminCount <= 1}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 dark:text-rose-400 rounded-xl text-[11px] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                        title={adminCount <= 1 ? "Cannot demote the only remaining admin" : "Demote to Staff"}
                      >
                        Revoke Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenConfirm(u, 'Admin')}
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
          })}
        </div>
      )}

      {/* ─── Confirmation Modal ─── */}
      {targetUser && pendingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="text-center space-y-2">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-sm ${
                pendingRole === 'Admin'
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
              }`}>
                {pendingRole === 'Admin' ? '🛡️' : '👤'}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {pendingRole === 'Admin' ? 'Grant Admin Privileges?' : 'Revoke Admin Privileges?'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {pendingRole === 'Admin' ? (
                  <>
                    Are you sure you want to promote <strong className="text-slate-800 dark:text-slate-200">{targetUser.fullName}</strong> to <strong className="text-emerald-600">Administrator</strong>?
                    <br /><br />
                    They will be able to manage quiz questions, dictionary entries, infographics, and grant/revoke admin rights.
                  </>
                ) : (
                  <>
                    Are you sure you want to demote <strong className="text-slate-800 dark:text-slate-200">{targetUser.fullName}</strong> to standard <strong className="text-slate-600">Staff</strong>?
                    <br /><br />
                    They will immediately lose access to the Admin Dashboard and content management tools.
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setTargetUser(null);
                  setPendingRole(null);
                }}
                disabled={isUpdating}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleChange}
                disabled={isUpdating}
                className={`flex-1 py-2.5 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 ${
                  pendingRole === 'Admin'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                }`}
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Confirm Change</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
