import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatMonthName } from '../../../utils/constants';
import { addQuizQuestion, getAdminQuizQuestions } from '../../quiz/quizService';

/**
 * Modal dialog allowing administrators to browse a saved previous month
 * and copy selected questions into the target managing month.
 */
export default function CopyQuizQuestionsModal({
  isOpen,
  onClose,
  targetMonth,
  availableMonths = [],
  existingQuestions = [],
  onCopied
}) {
  const sourceCandidates = availableMonths.filter(m => m.month !== targetMonth && m.count > 0);
  const [sourceMonth, setSourceMonth] = useState(sourceCandidates[0]?.month || '');
  const [sourceQuestions, setSourceQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const existingTexts = new Set(
    existingQuestions.map(q => String(q.questionText || '').trim().toLowerCase()).filter(Boolean)
  );

  useEffect(() => {
    if (!isOpen) return;
    if (!sourceMonth || sourceMonth === targetMonth || !sourceCandidates.some(c => c.month === sourceMonth)) {
      setSourceMonth(sourceCandidates[0]?.month || '');
    }
  }, [isOpen, targetMonth, sourceMonth, sourceCandidates]);

  useEffect(() => {
    if (!isOpen || !sourceMonth) {
      setSourceQuestions([]);
      setSelectedIds(new Set());
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMsg('');
    getAdminQuizQuestions(sourceMonth, false)
      .then(res => {
        if (cancelled) return;
        const list = res?.questions || [];
        setSourceQuestions(list);
        const nonDuplicates = list
          .filter(q => !existingTexts.has(String(q.questionText || '').trim().toLowerCase()))
          .map(q => q.id);
        setSelectedIds(new Set(nonDuplicates));
      })
      .catch(err => {
        if (!cancelled) setErrorMsg(err?.message || 'Failed to load questions from selected month.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sourceMonth]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !copying) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, copying, onClose]);

  if (!isOpen) return null;

  const selectableIds = sourceQuestions
    .filter(q => !existingTexts.has(String(q.questionText || '').trim().toLowerCase()))
    .map(q => q.id);

  const toggleItem = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size >= selectableIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableIds));
    }
  };

  const handleCopy = async () => {
    const toCopy = sourceQuestions.filter(q => selectedIds.has(q.id));
    if (toCopy.length === 0) return;

    setCopying(true);
    setErrorMsg('');
    try {
      for (const q of toCopy) {
        await addQuizQuestion({
          month: targetMonth,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: q.correctOption || 'A',
        });
      }
      if (onCopied) await onCopied(toCopy.length);
      onClose();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to copy selected questions.');
    } finally {
      setCopying(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[130] bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => !copying && onClose()}
    >
      <div
        className="w-full max-w-2xl max-h-[88dvh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Copy Questions to {formatMonthName(targetMonth) || targetMonth}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reuse questions from a previous month&apos;s saved archive without affecting the source month.
            </p>
          </div>
          <button
            type="button"
            disabled={copying}
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition active:scale-90 shrink-0"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Source Month Picker */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">
              Source Month
            </label>
            <select
              value={sourceMonth}
              disabled={sourceCandidates.length === 0 || copying}
              onChange={e => setSourceMonth(e.target.value)}
              className="select select-sm flex-1 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold rounded-xl"
            >
              {sourceCandidates.length === 0 ? (
                <option value="">No previous months with saved questions</option>
              ) : (
                sourceCandidates.map(m => (
                  <option key={m.month} value={m.month}>
                    {formatMonthName(m.month) || m.month} ({m.count} questions)
                  </option>
                ))
              )}
            </select>
          </div>

          {selectableIds.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline px-2 py-1"
            >
              {selectedIds.size >= selectableIds.length ? 'Deselect All' : `Select All (${selectableIds.length})`}
            </button>
          )}
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-sm text-slate-400">Loading saved questions...</div>
          ) : sourceCandidates.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No previous months have saved questions yet.
            </div>
          ) : sourceQuestions.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No questions found in {formatMonthName(sourceMonth) || sourceMonth}.
            </div>
          ) : (
            sourceQuestions.map((q, idx) => {
              const isDup = existingTexts.has(String(q.questionText || '').trim().toLowerCase());
              const isChecked = selectedIds.has(q.id);
              return (
                <label
                  key={q.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer ${
                    isDup
                      ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/70 dark:border-slate-800 opacity-60 cursor-not-allowed'
                      : isChecked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/70'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={isDup || copying}
                    checked={isChecked}
                    onChange={() => toggleItem(q.id)}
                    className="checkbox checkbox-sm checkbox-success mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-snug">
                        {idx + 1}. {q.questionText}
                      </span>
                      {isDup && (
                        <span className="text-[10.5px] font-bold text-slate-500 bg-slate-200/80 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md shrink-0">
                          Already in month
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                      Answer ({q.correctOption}): {q[`option${q.correctOption}`] || q.optionA}
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
            {selectedIds.size} selected to copy
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={copying}
              onClick={onClose}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={copying || selectedIds.size === 0}
              onClick={handleCopy}
              className="min-h-[40px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition active:scale-95 disabled:opacity-50"
            >
              {copying ? 'Copying...' : `Copy ${selectedIds.size} Questions`}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
