import React, { useState } from 'react';
import { matchesUser } from '../../../utils/rbac';
import AdminUserCard from './AdminUserCard';
import AdminRoleModal from './AdminRoleModal';

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

  // Derived counts
  const totalCount = users.length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const staffCount = totalCount - adminCount;

  // Normalized search filter
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
    if (currentUser && matchesUser(user, currentUser) && newRole === 'Staff') {
      setActionError("You cannot revoke your own administrator privileges to prevent locking yourself out.");
      return;
    }

    // Prevent demoting the last remaining admin
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

      {/* ─── Feedback Toast Alerts ─── */}
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

      {/* ─── Search Bar & Role Filter Pills ─── */}
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

      {/* ─── User List Roster ─── */}
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
          {filteredUsers.map((u) => (
            <AdminUserCard
              key={u.id || u.email}
              user={u}
              isSelf={Boolean(currentUser && matchesUser(u, currentUser))}
              adminCount={adminCount}
              onSelectRoleChange={handleOpenConfirm}
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
        onClose={() => {
          setTargetUser(null);
          setPendingRole(null);
        }}
      />
    </div>
  );
}
