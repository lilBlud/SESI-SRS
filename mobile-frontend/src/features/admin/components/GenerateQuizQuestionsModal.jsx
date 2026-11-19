import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'motion/react';
import { formatMonthName } from '../../../utils/constants';
import { addQuizQuestion } from '../../quiz/quizService';
import {
  BATCH_SIZE,
  MAX_QUESTIONS_PER_RUN,
  buildBatchSizes,
  generateQuizQuestionsFromDocument,
  prepareDocumentPayload,
} from '../../quiz/quizGeneratorService';
import { EASE_OUT_EXPO, MODAL_BACKDROP, MODAL_DIALOG } from '../../../utils/motionConfig';

const COUNT_PRESETS = [5, 10, 15, 20];
const DIFFICULTIES = [
  { id: 'basic', label: 'Basic' },
  { id: 'mixed', label: 'Mixed' },
  { id: 'technical', label: 'Technical' },
];
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Modal dialog allowing administrators to upload a document (PDF/TXT/Image)
 * or paste source text, choose how many questions to generate (1–50),
 * review/edit drafts inline, and bulk-import selected items into the target month.
 */
export default function GenerateQuizQuestionsModal({
  isOpen,
  onClose,
  targetMonth,
  existingQuestions = [],
  onGenerated,
}) {
  const [step, setStep] = useState('source'); // 'source' | 'review'
  const [fileMeta, setFileMeta] = useState(null); // { name, size }
  const [filePayload, setFilePayload] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('mixed');
  const [focus, setFocus] = useState('');

  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ done: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState('');

  const [drafts, setDrafts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const fileInputRef = useRef(null);
  const abortRef = useRef(null);

  const monthLabel = formatMonthName(targetMonth) || targetMonth;
  const clampedCount = Math.max(1, Math.min(MAX_QUESTIONS_PER_RUN, Math.floor(Number(questionCount) || 1)));
  const plannedBatches = buildBatchSizes(clampedCount);

  const handleClose = () => {
    if (generating || importing) return;
    setErrorMsg('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !generating && !importing) {
        setErrorMsg('');
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, generating, importing, onClose]);

  useEffect(() => {
    if (!isOpen) {
      abortRef.current?.abort();
    }
  }, [isOpen]);

  const handleFilePick = async (file) => {
    if (!file) return;
    setErrorMsg('');
    try {
      const prepared = await prepareDocumentPayload(file);
      setFilePayload(prepared);
      setFileMeta({ name: file.name, size: file.size });
    } catch (err) {
      setFilePayload(null);
      setFileMeta(null);
      setErrorMsg(err?.message || 'Failed to read the selected document.');
    }
  };

  const clearFile = () => {
    setFilePayload(null);
    setFileMeta(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (generating) return;
    if (!filePayload && !pastedText.trim()) {
      setErrorMsg('Upload a document (PDF, TXT, MD, CSV, or image) or paste text first.');
      return;
    }

    setErrorMsg('');
    setGenerating(true);
    setProgress(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await generateQuizQuestionsFromDocument({
        count: clampedCount,
        difficulty,
        month: targetMonth,
        focus,
        text: pastedText,
        filePayload,
        existingQuestions,
        onProgress: setProgress,
        signal: controller.signal,
      });

      setDrafts(result.questions);
      setSelectedIds(
        new Set(result.questions.filter(q => !q.isDuplicate).map(q => q.draftId))
      );
      setStep('review');
    } catch (err) {
      if (err?.name === 'AbortError') {
        setErrorMsg('Generation cancelled.');
      } else {
        setErrorMsg(err?.message || 'Failed to generate questions.');
      }
    } finally {
      setGenerating(false);
      setProgress(null);
      abortRef.current = null;
    }
  };

  const toggleSelect = (draftId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(draftId)) next.delete(draftId);
      else next.add(draftId);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size >= drafts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(drafts.map(d => d.draftId)));
    }
  };

  const updateDraftField = (draftId, field, value) => {
    setDrafts(prev =>
      prev.map(d => (d.draftId === draftId ? { ...d, [field]: value } : d))
    );
  };

  const removeDraft = (draftId) => {
    setDrafts(prev => prev.filter(d => d.draftId !== draftId));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(draftId);
      return next;
    });
  };

  const handleImport = async () => {
    const toImport = drafts.filter(d => selectedIds.has(d.draftId));
    if (toImport.length === 0 || importing) return;

    const invalid = toImport.find(
      d =>
        !d.questionText.trim() ||
        !d.optionA.trim() ||
        !d.optionB.trim() ||
        !d.optionC.trim() ||
        !d.optionD.trim()
    );
    if (invalid) {
      setErrorMsg('All selected questions must have a prompt and 4 non-empty options.');
      return;
    }

    setImporting(true);
    setErrorMsg('');
    setImportProgress({ done: 0, total: toImport.length });

    let saved = 0;
    try {
      for (const item of toImport) {
        await addQuizQuestion({
          month: targetMonth,
          questionText: item.questionText.trim(),
          optionA: item.optionA.trim(),
          optionB: item.optionB.trim(),
          optionC: item.optionC.trim(),
          optionD: item.optionD.trim(),
          correctOption: item.correctOption || 'A',
        });
        saved++;
        setImportProgress({ done: saved, total: toImport.length });
      }

      if (onGenerated) await onGenerated(saved);
      setStep('source');
      setDrafts([]);
      setSelectedIds(new Set());
      clearFile();
      setPastedText('');
      setFocus('');
      onClose();
    } catch (err) {
      setErrorMsg(
        saved > 0
          ? `Imported ${saved} of ${toImport.length} questions before an error occurred: ${err?.message || 'Save failed.'}`
          : err?.message || 'Failed to save generated questions.'
      );
      if (saved > 0 && onGenerated) {
        await onGenerated(saved);
      }
    } finally {
      setImporting(false);
    }
  };

  const selectedCount = drafts.filter(d => selectedIds.has(d.draftId)).length;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="generate-quiz-backdrop"
          {...MODAL_BACKDROP}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-3 sm:p-5"
          onClick={handleClose}
        >
          <m.div
            key="generate-quiz-dialog"
            {...MODAL_DIALOG}
            role="dialog"
            aria-modal="true"
            aria-label="Generate Quiz Questions from Document"
            onClick={e => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90dvh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
          >
            {/* ─── Header ─── */}
            <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white truncate">
                    Generate Questions from Document
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Target archive: <span className="font-bold text-emerald-700 dark:text-emerald-400">{monthLabel}</span>
                </p>
              </div>

              <button
                type="button"
                disabled={generating || importing}
                onClick={handleClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition active:scale-95 disabled:opacity-40 shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ─── Body ─── */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
              {errorMsg && (
                <div className="rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/70">
                  {errorMsg}
                </div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                {step === 'source' ? (
                  <m.div
                    key="step-source"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                    className="space-y-4"
                  >
                    {/* Document Upload Dropzone */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Upload Document (PDF, TXT, Markdown, CSV, or Image)
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt,.md,.markdown,.csv,.png,.jpg,.jpeg,.webp,application/pdf,text/plain,text/markdown,text/csv,image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={e => handleFilePick(e.target.files?.[0])}
                      />
                      {fileMeta ? (
                        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {fileMeta.name}
                              </div>
                              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                                {formatBytes(fileMeta.size)} · Ready to generate
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={generating}
                            onClick={clearFile}
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-700 transition shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={generating}
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => {
                            e.preventDefault();
                            if (!generating) handleFilePick(e.dataTransfer.files?.[0]);
                          }}
                          className="w-full p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/70 dark:bg-slate-800/40 transition flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </div>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            Click to choose a file or drag &amp; drop
                          </span>
                          <span className="text-[11.5px] text-slate-500 dark:text-slate-400">
                            PDF, TXT, Markdown, CSV, PNG/JPG/WEBP · Max 10 MB
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Or Paste Source Text */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Or Paste Document Excerpt / Policy Notes
                      </label>
                      <textarea
                        rows={4}
                        disabled={generating}
                        placeholder="Paste regulatory text, IBR formulas, circulars, or notes here (optional if you uploaded a file)..."
                        value={pastedText}
                        onChange={e => setPastedText(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                      />
                    </div>

                    {/* Number of Questions + Difficulty */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="quiz-gen-count" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Number of Questions
                          </label>
                          <span className="text-[11px] font-semibold text-slate-400 tabular-nums">
                            1 – {MAX_QUESTIONS_PER_RUN}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {COUNT_PRESETS.map(preset => {
                            const active = clampedCount === preset;
                            return (
                              <button
                                key={preset}
                                type="button"
                                disabled={generating}
                                onClick={() => setQuestionCount(preset)}
                                className={`flex-1 min-h-[38px] rounded-xl text-xs font-extrabold tabular-nums transition border ${
                                  active
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                                }`}
                              >
                                {preset}
                              </button>
                            );
                          })}
                          <input
                            id="quiz-gen-count"
                            type="number"
                            min={1}
                            max={MAX_QUESTIONS_PER_RUN}
                            disabled={generating}
                            value={questionCount}
                            onChange={e => {
                              const val = e.target.value;
                              if (val === '') {
                                setQuestionCount('');
                              } else {
                                const parsed = parseInt(val, 10);
                                if (!Number.isNaN(parsed)) {
                                  setQuestionCount(Math.min(MAX_QUESTIONS_PER_RUN, Math.max(1, parsed)));
                                }
                              }
                            }}
                            onBlur={() => setQuestionCount(clampedCount)}
                            aria-label="Custom number of questions"
                            className="w-20 min-h-[38px] px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-sm font-black tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        {plannedBatches.length > 1 && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Will generate in {plannedBatches.length} batches (up to {BATCH_SIZE} each) to avoid repeats.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Difficulty Level
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {DIFFICULTIES.map(d => {
                            const active = difficulty === d.id;
                            return (
                              <button
                                key={d.id}
                                type="button"
                                disabled={generating}
                                onClick={() => setDifficulty(d.id)}
                                className={`min-h-[38px] rounded-xl text-xs font-bold transition border ${
                                  active
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                                }`}
                              >
                                {d.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Optional Focus Prompt */}
                    <div className="space-y-1.5">
                      <label htmlFor="quiz-gen-focus" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Optional Focus / Topic Guidance
                      </label>
                      <input
                        id="quiz-gen-focus"
                        type="text"
                        disabled={generating}
                        placeholder="e.g., Focus on IBR tariff formulas, SAIDI targets, or safety compliance"
                        value={focus}
                        onChange={e => setFocus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Generation Progress Banner */}
                    {generating && (
                      <div className="rounded-2xl p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200">
                              {progress && progress.totalBatches > 1
                                ? `Generating batch ${progress.currentBatch} of ${progress.totalBatches} (${progress.generatedSoFar}/${progress.targetCount} drafted)...`
                                : `Reading document & drafting ${clampedCount} ${clampedCount === 1 ? 'question' : 'questions'}...`}
                            </div>
                            <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                              You&apos;ll be able to review and edit every draft before saving.
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => abortRef.current?.abort()}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-rose-600 shrink-0"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </m.div>
                ) : (
                  <m.div
                    key="step-review"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                    className="space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                        {selectedCount} of {drafts.length} draft {drafts.length === 1 ? 'question' : 'questions'} selected
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={importing}
                          onClick={toggleAll}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                        >
                          {selectedCount >= drafts.length ? 'Clear All' : 'Select All'}
                        </button>
                        <button
                          type="button"
                          disabled={importing}
                          onClick={() => {
                            setStep('source');
                            setErrorMsg('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                        >
                          ← Back to Source
                        </button>
                      </div>
                    </div>

                    {drafts.length === 0 ? (
                      <div className="text-center py-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-500">
                        All drafts removed. Go back to generate a new batch.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {drafts.map((draft, idx) => {
                          const checked = selectedIds.has(draft.draftId);
                          return (
                            <div
                              key={draft.draftId}
                              className={`rounded-2xl border p-4 space-y-3 transition ${
                                checked
                                  ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                                  : 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 opacity-70'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={importing}
                                  onChange={() => toggleSelect(draft.draftId)}
                                  aria-label={`Select draft question ${idx + 1}`}
                                  className="mt-1 checkbox checkbox-sm checkbox-primary"
                                />
                                <div className="flex-1 min-w-0 space-y-2.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 tabular-nums">
                                        Draft #{idx + 1}
                                      </span>
                                      {draft.isDuplicate && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                                          Possible duplicate
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      disabled={importing}
                                      onClick={() => removeDraft(draft.draftId)}
                                      className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition"
                                    >
                                      Remove
                                    </button>
                                  </div>

                                  <textarea
                                    rows={2}
                                    disabled={importing}
                                    value={draft.questionText}
                                    onChange={e => updateDraftField(draft.draftId, 'questionText', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                  />

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {OPTION_LETTERS.map(letter => {
                                      const field = `option${letter}`;
                                      const isCorrect = draft.correctOption === letter;
                                      return (
                                        <div key={letter} className="flex items-center gap-1.5">
                                          <button
                                            type="button"
                                            disabled={importing}
                                            onClick={() => updateDraftField(draft.draftId, 'correctOption', letter)}
                                            title={`Mark ${letter} as correct`}
                                            aria-pressed={isCorrect}
                                            className={`w-8 h-8 rounded-lg text-xs font-black shrink-0 transition border ${
                                              isCorrect
                                                ? 'bg-emerald-600 text-white border-emerald-600'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                                            }`}
                                          >
                                            {letter}
                                          </button>
                                          <input
                                            type="text"
                                            disabled={importing}
                                            value={draft[field]}
                                            onChange={e => updateDraftField(draft.draftId, field, e.target.value)}
                                            className={`flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border text-xs font-medium bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                              isCorrect
                                                ? 'border-emerald-300 dark:border-emerald-700'
                                                : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {draft.sourceSnippet && (
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
                                      <span className="font-bold text-slate-700 dark:text-slate-300">Source:</span>{' '}
                                      {draft.sourceSnippet}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── Footer ─── */}
            <div className="px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                disabled={generating || importing}
                onClick={handleClose}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition disabled:opacity-45"
              >
                Close
              </button>

              {step === 'source' ? (
                <button
                  type="button"
                  disabled={generating || (!filePayload && !pastedText.trim())}
                  onClick={handleGenerate}
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition active:scale-[0.98] disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="tabular-nums">
                        Generate {clampedCount} {clampedCount === 1 ? 'Question' : 'Questions'}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={importing || selectedCount === 0}
                  onClick={handleImport}
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition active:scale-[0.98] disabled:opacity-50 inline-flex items-center gap-2 tabular-nums"
                >
                  {importing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving {importProgress.done} / {importProgress.total}...</span>
                    </>
                  ) : (
                    <span>
                      Import {selectedCount} {selectedCount === 1 ? 'Question' : 'Questions'} to {monthLabel}
                    </span>
                  )}
                </button>
              )}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
