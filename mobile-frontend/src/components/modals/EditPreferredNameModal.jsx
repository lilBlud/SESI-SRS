import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SESB_DIVISIONS = [
  "IDD",
  "Information & Digital",
  "Chief Executive Officer (CEO) Office",
  "Strategy & Sustainability",
  "Corporate Services",
  "Corporate Communication",
  "Single Buyer",
  "Grid System Operator",
  "Major Project",
  "Operating",
  "Generation",
  "Transmission",
  "Distribution",
  "Retail",
  "Finance",
  "Human Resources",
  "Procurement"
];

export function EditPreferredNameModal({
  isOpen,
  onClose,
  currentName = '',
  currentDivision = 'IDD',
  fullName = '',
  onSave
}) {
  const [tempName, setTempName] = useState(currentName);
  const [tempDivision, setTempDivision] = useState(currentDivision || 'IDD');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempName(currentName || '');
      setTempDivision(currentDivision || 'IDD');
    }
  }, [isOpen, currentName, currentDivision]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    setSaving(true);
    try {
      await onSave({
        preferredName: tempName.trim(),
        division: tempDivision || 'IDD'
      });
      onClose();
    } catch (err) {
      console.error("Failed to save profile info:", err);
      alert("Failed to save changes. Please try again.");
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
        <h3 className="text-[19px] font-black text-slate-900 dark:text-white">Edit Profile Details</h3>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Update your leaderboard display nickname and assigned organizational division.
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

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Division
            </label>
            <div className="relative">
              <select
                value={tempDivision}
                onChange={(e) => setTempDivision(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-[13px] font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none pr-10 shadow-inner"
              >
                {SESB_DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
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
              {saving ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
