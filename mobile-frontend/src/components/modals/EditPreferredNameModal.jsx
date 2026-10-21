import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export function EditPreferredNameModal({
  isOpen,
  onClose,
  currentName = '',
  fullName = '',
  onSave
}) {
  const [tempName, setTempName] = useState(currentName);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    setSaving(true);
    try {
      await onSave(tempName.trim());
      onClose();
    } catch (err) {
      console.error("Failed to save preferred name:", err);
      alert("Failed to save preferred name. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800 animate-scaleIn text-left relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center text-xl font-black mb-4 shadow-lg shadow-emerald-500/20">
          ✏️
        </div>
        <h3 className="text-[19px] font-black text-slate-900 dark:text-white">Preferred Name</h3>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Set a shorter nickname or preferred name to show on the leaderboard and podium.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Leaderboard Display Name (max 10 chars)
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              maxLength={10}
              placeholder="e.g. Azib"
              autoFocus
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span className="truncate pr-2">Real name: {fullName || "User"}</span>
              <span>{tempName.length}/10</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[13px] rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !tempName.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-[13px] rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Name"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
