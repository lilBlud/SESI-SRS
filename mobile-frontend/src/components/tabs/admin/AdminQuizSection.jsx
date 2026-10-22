import React, { useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function AdminQuizSection({
  selectedMonth,
  setSelectedMonth,
  questions,
  qCount,
  onRefreshQuestions
}) {
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState('A');
  const [qMsg, setQMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      Month: selectedMonth,
      QuestionText: qText,
      OptionA: optA,
      OptionB: optB,
      OptionC: optC,
      OptionD: optD,
      CorrectOption: correct
    };

    let directSuccess = false;
    try {
      const { error } = await supabase.from('QuizQuestions').insert([payload]);
      if (!error) directSuccess = true;
    } catch (sbErr) {
      console.warn("Direct Supabase addQuestion failed, trying fallback:", sbErr);
    }

    if (directSuccess) {
      setQMsg('✅ Question added!');
      onRefreshQuestions();
      setQText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setCorrect('A');
    } else if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/admin/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            month: selectedMonth,
            questionText: qText,
            optionA: optA,
            optionB: optB,
            optionC: optC,
            optionD: optD,
            correctOption: correct
          })
        });
        if (res.ok) {
          setQMsg('✅ Question added!');
          onRefreshQuestions();
          setQText('');
          setOptA('');
          setOptB('');
          setOptC('');
          setOptD('');
          setCorrect('A');
        } else {
          setQMsg('❌ Failed to add question');
        }
      } catch {
        setQMsg('❌ Failed to add question');
      }
    } else {
      setQMsg('❌ Failed to add question');
    }

    setIsSubmitting(false);
    setTimeout(() => setQMsg(''), 3000);
  };

  const deleteQuestion = async (id) => {
    if (!confirm('Delete this question?')) return;
    try {
      await supabase.from('QuizQuestions').delete().eq('Id', id);
    } catch (err) {
      console.warn("Direct Supabase deleteQuestion failed:", err);
    }
    if (API_BASE) {
      await fetch(`${API_BASE}/api/admin/questions/${id}`, { method: 'DELETE' }).catch(() => null);
    }
    onRefreshQuestions();
  };

  return (
    <div className="space-y-4">
      {/* Month picker */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm">
        <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Managing Month
        </label>
        <div className="w-full">
          <input
            type="month"
            min="2026-01"
            value={selectedMonth}
            onChange={e => {
              const val = e.target.value;
              if (val && val < '2026-01') {
                setSelectedMonth('2026-01');
                return;
              }
              setSelectedMonth(val);
            }}
            className="w-full box-border block px-3.5 py-2.5 rounded-xl border text-sm font-mono dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Counter */}
      <div className="rounded-2xl p-4 flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl bg-emerald-500 text-white">
          {qCount}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-bold text-emerald-700 dark:text-emerald-400">
            Questions for {selectedMonth}
          </div>
        </div>
        <div className="text-[13px] font-black text-slate-400">{qCount} Total</div>
      </div>

      {/* Add question form */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-[16px] font-bold mb-4">Add New Question</h2>
        <form onSubmit={addQuestion} className="space-y-3">
          <textarea
            required
            placeholder="Question text..."
            rows={2}
            className="w-full p-3 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            value={qText}
            onChange={e => setQText(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            {[
              ['A', optA, setOptA],
              ['B', optB, setOptB],
              ['C', optC, setOptC],
              ['D', optD, setOptD]
            ].map(([l, v, s]) => (
              <div key={l} className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-black text-emerald-600">
                  {l}
                </span>
                <input
                  required
                  placeholder={`Option ${l}`}
                  className="w-full pl-7 pr-2.5 py-2.5 rounded-xl border text-sm dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={v}
                  onChange={e => s(e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Correct:</span>
            <div className="flex gap-2">
              {['A', 'B', 'C', 'D'].map(o => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setCorrect(o)}
                  className={`w-9 h-9 rounded-xl text-sm font-black transition-all ${
                    correct === o
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
          {qMsg && (
            <div
              className={`text-sm font-semibold px-3 py-2 rounded-xl ${
                qMsg.startsWith('✅')
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
              }`}
            >
              {qMsg}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : '+ Add Question'}
          </button>
        </form>
      </div>

      {/* Questions list */}
      <div className="space-y-2">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-3 items-start"
          >
            <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[13px] leading-snug">{q.questionText}</p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {[
                  ['A', q.optionA],
                  ['B', q.optionB],
                  ['C', q.optionC],
                  ['D', q.optionD]
                ].map(([l, t]) => (
                  <div
                    key={l}
                    className={`text-[11px] px-2 py-1 rounded-lg flex gap-1 ${
                      q.correctOption === l
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    <span className="font-black">{l}.</span> {t}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => deleteQuestion(q.id)}
              className="text-red-400 bg-red-50 dark:bg-red-950/40 p-2 rounded-xl shrink-0 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        {questions.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            No questions for this month yet.
          </div>
        )}
      </div>
    </div>
  );
}
