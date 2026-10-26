import React, { useEffect } from 'react';

export default function AdminRoleModal({
  targetUser,
  pendingRole,
  isUpdating = false,
  onConfirm,
  onClose
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isUpdating) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUpdating, onClose]);

  if (!targetUser || !pendingRole) return null;

  const isGranting = pendingRole === 'Admin';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUpdating) onClose();
      }}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
      >
        <div className="text-center space-y-2">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-sm ${
            isGranting
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
              : 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
          }`}>
            {isGranting ? '🛡️' : '👤'}
          </div>

          <h3 id="role-modal-title" className="text-lg font-black text-slate-900 dark:text-white">
            {isGranting ? 'Grant Admin Privileges?' : 'Revoke Admin Privileges?'}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isGranting ? (
              <>
                Are you sure you want to promote <strong className="text-slate-800 dark:text-slate-200">{targetUser.fullName}</strong> to <strong className="text-emerald-600">Administrator</strong>?
                <br /><br />
                They will be able to manage quiz questions, dictionary entries, infographics, and grant/revoke admin rights for others.
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
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className={`flex-1 py-2.5 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 ${
              isGranting
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
  );
}
