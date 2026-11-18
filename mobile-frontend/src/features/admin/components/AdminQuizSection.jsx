import React, { useState, useMemo } from 'react';
import { currentMonth, formatMonthName } from '../../../utils/constants';
import {
  addQuizQuestion as addQuizQuestionService,
  updateQuizQuestion as updateQuizQuestionService,
  deleteQuizQuestion as deleteQuizQuestionService,
} from '../../quiz/quizService';
import CopyQuizQuestionsModal from './CopyQuizQuestionsModal';

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

/**
 * Two-column Quiz Studio for managing monthly question archives,
 * inline authoring/editing, and copying questions from previous months.
 */
export default function AdminQuizSection({
  selectedMonth,
  setSelectedMonth,
  questions = [],
  qCount = 0,
  quizMonthCounts = {},
  onRefreshQuestions
}) {
  const [editingId, setEditingId] = useState(null);
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFeedback, setStatusFeedback] = useState(null); // { ok: boolean, text: string }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  const archiveMonths = useMemo(() => {
    const map = { ...quizMonthCounts };
    if (currentMonth && map[currentMonth] === undefined) {
      map[currentMonth] = selectedMonth === currentMonth ? qCount : 0;
    }
    if (selectedMonth && map[selectedMonth] === undefined) {
      map[selectedMonth] = qCount;
    } else if (selectedMonth) {
      map[selectedMonth] = qCount;
    }

    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([month, count]) => ({ month, count }));
  }, [quizMonthCounts, selectedMonth, qCount]);

  const filteredQuestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter(item =>
      (item.questionText || '').toLowerCase().includes(q) ||
      (item.optionA || '').toLowerCase().includes(q) ||
      (item.optionB || '').toLowerCase().includes(q) ||
      (item.optionC || '').toLowerCase().includes(q) ||
      (item.optionD || '').toLowerCase().includes(q)
    );
  }, [questions, searchTerm]);

  const isPastMonth = Boolean(selectedMonth && currentMonth && selectedMonth < currentMonth);
  const monthLabel = formatMonthName(selectedMonth) || selectedMonth;
  const hasPreviousCopySource = archiveMonths.some(m => m.month !== selectedMonth && m.count > 0);

  const notify = (ok, text) => {
    setStatusFeedback({ ok, text });
    setTimeout(() => setStatusFeedback(null), 3500);
  };

  const resetComposer = () => {
    setEditingId(null);
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrect('A');
  };

  const handleSelectMonth = (month) => {
    if (!month) return;
    const clamped = month < '2026-01' ? '2026-01' : month;
    if (editingId) resetComposer();
    setSearchTerm('');
    setSelectedMonth(clamped);
  };

  const handleStartEdit = (question) => {
    setEditingId(question.id);
    setQText(question.questionText || '');
    setOptA(question.optionA || '');
    setOptB(question.optionB || '');
    setOptC(question.optionC || '');
    setOptD(question.optionD || '');
    setCorrect(question.correctOption || 'A');
    setStatusFeedback(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      month: selectedMonth,
      questionText: qText.trim(),
      optionA: optA.trim(),
      optionB: optB.trim(),
      optionC: optC.trim(),
      optionD: optD.trim(),
      correctOption: correct,
    };

    try {
      if (editingId) {
        await updateQuizQuestionService(editingId, payload);
        notify(true, 'Question updated.');
      } else {
        await addQuizQuestionService(payload);
        notify(true, `Question added to ${monthLabel}.`);
      }
      resetComposer();
      await onRefreshQuestions();
    } catch (err) {
      notify(false, err?.message || 'Failed to save question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question from this month?')) return;
    try {
      await deleteQuizQuestionService(id);
      if (editingId === id) resetComposer();
      notify(true, 'Question removed.');
      await onRefreshQuestions();
    } catch (err) {
      notify(false, err?.message || 'Failed to delete question.');
    }
  };

  const optionInputs = [
    ['A', optA, setOptA],
    ['B', optB, setOptB],
    ['C', optC, setOptC],
    ['D', optD, setOptD],
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* ─── Monthly Archive Strip ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Monthly Question Archive
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
              Managing <span className="font-bold text-slate-700 dark:text-slate-200">{monthLabel}</span> · {qCount} saved {qCount === 1 ? 'question' : 'questions'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!hasPreviousCopySource}
              onClick={() => setShowCopyModal(true)}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-700 text-xs font-bold transition-all active:scale-95 inline-flex items-center gap-1.5 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy from Month</span>
            </button>

            <div className="relative">
              <input
                type="month"
                min="2026-01"
                value={selectedMonth}
                onChange={e => handleSelectMonth(e.target.value)}
                aria-label="Pick month"
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Archive Month Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {archiveMonths.map(({ month, count }) => {
            const active = month === selectedMonth;
            const isCurrent = month === currentMonth;
            return (
              <button
                key={month}
                type="button"
                onClick={() => handleSelectMonth(month)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 flex items-center gap-2 shrink-0 border ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isCurrent && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-white' : 'bg-emerald-500'}`}
                    title="Current month"
                  />
                )}
                <span>{formatMonthName(month) || month}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-md tabular-nums font-extrabold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Past Month Safeguard Notice ─── */}
      {isPastMonth && (
        <div className="rounded-2xl px-4 py-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/70 flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold text-amber-900 dark:text-amber-200">
          <svg className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>
            Past month archive ({monthLabel}) — edits affect historical quiz records and leaderboard reference data.
          </span>
        </div>
      )}

      {/* ─── 2-Column Studio (Sticky Composer Left, Saved Questions Right) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Composer / Editor */}
        <div className="lg:col-span-5 lg:sticky lg:top-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingId ? 'Edit Question' : 'Add Question'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target month: <span className="font-bold text-emerald-700 dark:text-emerald-400">{monthLabel}</span>
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetComposer}
                className="min-h-[34px] px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 transition active:scale-95"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                Question Prompt
              </label>
              <textarea
                required
                placeholder="Enter question text..."
                rows={3}
                className="w-full p-3.5 rounded-xl border text-sm bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                value={qText}
                onChange={e => setQText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Answer Options</span>
                <span className="text-[11px] font-medium text-slate-400">Select the correct letter</span>
              </div>

              {optionInputs.map(([letter, value, setter]) => {
                const isCorrect = correct === letter;
                return (
                  <div key={letter} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrect(letter)}
                      title={`Mark option ${letter} as correct`}
                      aria-label={`Mark option ${letter} as correct`}
                      aria-pressed={isCorrect}
                      className={`w-10 h-10 rounded-xl text-xs font-black shrink-0 transition-all active:scale-90 border ${
                        isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      {letter}
                    </button>
                    <input
                      required
                      placeholder={`Option ${letter}`}
                      className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        isCorrect
                          ? 'border-emerald-300 dark:border-emerald-700'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                      value={value}
                      onChange={e => setter(e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Secondary selector pills for clarity */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Correct Answer:</span>
              <div className="flex gap-1.5">
                {OPTION_KEYS.map(key => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCorrect(key)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all active:scale-90 ${
                      correct === key
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {statusFeedback && (
              <div
                className={`text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-2 border ${
                  statusFeedback.ok
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d={statusFeedback.ok ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}
                  />
                </svg>
                <span>{statusFeedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[44px] py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white font-bold text-sm rounded-xl active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting
                ? (editingId ? 'Saving Changes...' : 'Adding Question...')
                : (editingId ? 'Save Question Changes' : `Add to ${monthLabel}`)}
            </button>
          </form>
        </div>

        {/* Right: Saved Questions Deck */}
        <div className="lg:col-span-7 space-y-3">
          {/* Deck Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                {monthLabel} Questions
              </h3>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 tabular-nums">
                {questions.length}
              </span>
            </div>

            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filter questions..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-3">
            {filteredQuestions.map((q, i) => {
              const isEditing = editingId === q.id;
              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border transition-all ${
                    isEditing
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-center text-xs font-black shrink-0 tabular-nums">
                        {i + 1}
                      </span>
                      <p className="font-bold text-sm sm:text-[15px] text-slate-900 dark:text-white leading-snug pt-0.5">
                        {q.questionText}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(q)}
                        title="Edit question"
                        aria-label={`Edit question ${i + 1}`}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center justify-center transition active:scale-90"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(q.id)}
                        title="Delete question"
                        aria-label={`Delete question ${i + 1}`}
                        className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 flex items-center justify-center transition active:scale-90"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:pl-11">
                    {OPTION_KEYS.map(letter => {
                      const optVal = q[`option${letter}`] || '';
                      const isCorrect = q.correctOption === letter;
                      return (
                        <div
                          key={letter}
                          className={`text-xs sm:text-[13px] px-3 py-2 rounded-xl flex items-center gap-2 border ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold'
                              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span className="font-black shrink-0">{letter}.</span>
                          <span className="flex-1 min-w-0 truncate">{optVal}</span>
                          {isCorrect && (
                            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {questions.length === 0 ? (
              <div className="text-center py-10 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  No questions saved for {monthLabel} yet.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Use the composer on the left to add new questions, or reuse from a previous month.
                </p>
                {hasPreviousCopySource && (
                  <button
                    type="button"
                    onClick={() => setShowCopyModal(true)}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy from a Previous Month</span>
                  </button>
                )}
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                No questions matching &quot;{searchTerm}&quot;.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ─── Copy from Month Modal ─── */}
      <CopyQuizQuestionsModal
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        targetMonth={selectedMonth}
        availableMonths={archiveMonths}
        existingQuestions={questions}
        onCopied={async (count) => {
          notify(true, `Copied ${count} question${count === 1 ? '' : 's'} into ${monthLabel}.`);
          await onRefreshQuestions();
        }}
      />
    </div>
  );
}
