import React, { useState, useMemo } from 'react';
import { matchesUser } from '../../../utils/rbac';
import AdminUserCard from './AdminUserCard';
import AdminRoleModal from './AdminRoleModal';

/**
 * Staff Directory & Role Management Studio for the Admin Control Center.
 * Combines role filter pills, division filter, search, and aligned roster rows.
 */
export default function AdminUsersSection({
  users = [],
  currentUser,
  loading = false,
  onUpdateRole,
  onDeleteUser,
  onRefreshUsers
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all' | 'Admin' | 'Staff'
  const [targetUser, setTargetUser] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const totalCount = users.length;
  const adminCount = useMemo(() => users.filter(u => u.role === 'Admin').length, [users]);
  const staffCount = totalCount - adminCount;

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return users.filter(u => {
      if (filterRole !== 'all' && u.role !== filterRole) return false;
      if (!q) return true;
      return (
        (u.fullName || '').toLowerCase().includes(q) ||
        (u.preferredName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.staffId || '').toLowerCase().includes(q) ||
        (u.division || '').toLowerCase().includes(q)
      );
    });
  }, [users, filterRole, searchTerm]);

  const handleOpenConfirm = (user, newRole) => {
    setActionError('');
    setActionSuccess('');

    if (currentUser && matchesUser(user, currentUser) && newRole === 'Staff') {
      setActionError('You cannot revoke your own administrator privileges to prevent locking yourself out.');
      return;
    }

    if (user.role === 'Admin' && newRole === 'Staff' && adminCount <= 1) {
      setActionError('Cannot demote the last remaining Administrator. At least one admin must exist.');
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
      setActionSuccess(`Changed ${targetUser.fullName}'s role to ${pendingRole}.`);
      setTargetUser(null);
      setPendingRole(null);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setActionError(err.message || 'Failed to update user role.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async (user) => {
    if (!onDeleteUser) return;
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${user.fullName || user.email}'s account?`
    );
    if (!confirmed) return;

    setActionError('');
    setActionSuccess('');
    try {
      await onDeleteUser(user);
      setActionSuccess(`Deleted ${user.fullName || user.email}'s account.`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setActionError(err.message || 'Failed to delete user account.');
    }
  };

  const rolePills = [
    { key: 'all', label: 'All Staff', count: totalCount },
    { key: 'Admin', label: 'Admins', count: adminCount },
    { key: 'Staff', label: 'Staff', count: staffCount },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* ─── Directory Toolbar (Title, Role Pills, Search & Refresh) ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Staff Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
              {totalCount} registered {totalCount === 1 ? 'account' : 'accounts'} · {adminCount} {adminCount === 1 ? 'admin' : 'admins'} · {staffCount} staff
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, ID, division..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {onRefreshUsers && (
              <button
                type="button"
                onClick={onRefreshUsers}
                disabled={loading}
                className="w-10 h-10 shrink-0 flex items-center justify-center bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-700 rounded-xl transition-all active:scale-90 disabled:opacity-50"
                title="Refresh users"
                aria-label="Refresh users"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : 'transition-transform duration-300 hover:rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {rolePills.map(pill => {
            const active = filterRole === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => setFilterRole(pill.key)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 inline-flex items-center gap-2 shrink-0 border ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-md tabular-nums font-extrabold ${
                    active ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200'
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Feedback Toast Alerts ─── */}
      {actionSuccess && (
        <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs sm:text-[13px] font-semibold flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess('')}
            aria-label="Dismiss message"
            className="text-emerald-700 dark:text-emerald-300 hover:opacity-75 p-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {actionError && (
        <div className="px-4 py-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 text-xs sm:text-[13px] font-semibold flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError('')}
            aria-label="Dismiss error"
            className="text-rose-700 dark:text-rose-300 hover:opacity-75 p-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ─── User Roster List ─── */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800" aria-label="Loading staff directory">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="skeleton w-11 h-11 rounded-full shrink-0" />
                <div className="space-y-2">
                  <div className="skeleton w-44 h-4 rounded" />
                  <div className="skeleton w-56 h-3 rounded" />
                </div>
              </div>
              <div className="skeleton w-24 h-8 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
          <div className="w-11 h-11 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No users found</p>
          <p className="text-xs text-slate-400">Try modifying your search or role filter.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredUsers.map((u) => (
            <AdminUserCard
              key={u.id || u.email}
              user={u}
              isSelf={Boolean(currentUser && matchesUser(u, currentUser))}
              adminCount={adminCount}
              onSelectRoleChange={handleOpenConfirm}
              onDeleteUser={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* ─── Role Confirmation Modal ─── */}
      <AdminRoleModal
        targetUser={targetUser}
        pendingRole={pendingRole}
        isUpdating={isUpdating}
        onConfirm={handleConfirmRoleChange}
        onCancel={() => {
          setTargetUser(null);
          setPendingRole(null);
        }}
      />
    </div>
  );
}
