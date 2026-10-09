export const API_BASE = import.meta.env.VITE_API_BASE || "";
export const currentMonth = new Date().toISOString().slice(0, 7);

// ─── Category Config (colours, emoji, labels) ───
export const CATEGORIES = [
  { key: 'All', label: 'All Categories', emoji: '📚', color: 'slate' },
  { key: 'IBR Framework', label: 'IBR Framework', emoji: '⚡', color: 'blue' },
  { key: 'Strategy and Sustainability', label: 'Strategy & Sustainability', emoji: '🎯', color: 'violet' },
  { key: 'Energy Market and Industry', label: 'Energy Market & Industry', emoji: '🔋', color: 'amber' },
  { key: 'ESG', label: 'ESG', emoji: '🌱', color: 'green' },
  { key: 'EPSB', label: 'EPSB', emoji: '🔌', color: 'cyan' },
  { key: 'BDV', label: 'BDV', emoji: '🔬', color: 'rose' },
  { key: 'Governance', label: 'Governance', emoji: '🏛️', color: 'indigo' },
  { key: 'Corporate Performance', label: 'Corporate Performance', emoji: '📊', color: 'orange' },
  { key: 'ISO Management', label: 'ISO Management', emoji: '🏅', color: 'teal' },
  { key: 'SE Risk', label: 'Sabah Electricity Risks', emoji: '⚠️', color: 'red' },
  { key: 'ReSET2030', label: 'ReSET2030', emoji: '🔄', iconImage: '/assets/reset2030_icon.png', color: 'sky' },
];

export const getCatMeta = (catKey) => CATEGORIES.find(c => c.key === catKey) || CATEGORIES[0];

export const CAT_COLORS = {
  'IBR Framework': { bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', pill: 'bg-blue-500', gradient: 'from-blue-500 to-blue-700' },
  'Strategy and Sustainability': { bg: 'bg-violet-100 dark:bg-violet-950/40', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800', pill: 'bg-violet-500', gradient: 'from-violet-500 to-violet-700' },
  'Energy Market and Industry': { bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', pill: 'bg-amber-500', gradient: 'from-amber-500 to-amber-700' },
  'ESG': { bg: 'bg-green-100 dark:bg-green-950/40', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800', pill: 'bg-green-500', gradient: 'from-green-500 to-green-700' },
  'EPSB': { bg: 'bg-cyan-100 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', pill: 'bg-cyan-500', gradient: 'from-cyan-500 to-cyan-700' },
  'BDV': { bg: 'bg-rose-100 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', pill: 'bg-rose-500', gradient: 'from-rose-500 to-rose-700' },
  'Governance': { bg: 'bg-indigo-100 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', pill: 'bg-indigo-500', gradient: 'from-indigo-500 to-indigo-700' },
  'Corporate Performance': { bg: 'bg-orange-100 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', pill: 'bg-orange-500', gradient: 'from-orange-500 to-orange-700' },
  'ISO Management': { bg: 'bg-teal-100 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', pill: 'bg-teal-500', gradient: 'from-teal-500 to-teal-700' },
  'SE Risk': { bg: 'bg-red-100 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', pill: 'bg-red-500', gradient: 'from-red-500 to-red-700' },
  'ReSET2030': { bg: 'bg-sky-100 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', pill: 'bg-sky-500', gradient: 'from-sky-500 to-sky-700' },
};
export const getColor = (cat) => CAT_COLORS[cat] || { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700', pill: 'bg-slate-500', gradient: 'from-slate-500 to-slate-700' };

