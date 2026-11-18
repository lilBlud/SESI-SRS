// Authentic SESI data sourced directly from ./mobile-frontend/src/

export const BRAND = {
  // Light mode palette matching TopographicBackground.jsx & mobile-frontend
  ground: '#f8fafc', // slate-50
  groundMid: '#f3f8f7',
  groundEnd: '#eef6f5',
  groundNearBlack: '#090d16',
  cardBg: 'rgba(255, 255, 255, 0.92)',
  cardBorder: 'rgba(203, 213, 225, 0.85)', // slate-300/85
  emerald: '#059669', // emerald-600
  emeraldBright: '#10b981', // emerald-500
  emeraldLight: '#059669', // crisp emerald-600 for light mode contrast
  emeraldSoft: '#d1fae5', // emerald-100
  teal: '#0d9488', // teal-600
  white: '#ffffff',
  ink: '#0f172a', // slate-900 primary text on light ground
  inkMuted: '#475569', // slate-600 secondary text
  inkSubtle: '#64748b', // slate-500
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  url: 'sesi--srs.pages.dev',
} as const;

/**
 * Real topographic contour paths from TopographicBackground.jsx (1920x1080 space).
 * Uses lightOp values from TopographicBackground.jsx for light mode.
 */
export const CONTOUR_PATHS = [
  // Top-Left Elevation Ridges
  { d: 'M-80,-40 C140,-20 280,180 200,420 C140,600 -20,720 -100,760', opacity: 0.15, layer: 0 },
  { d: 'M-60,40 C180,60 340,240 260,500 C190,700 30,820 -80,880', opacity: 0.18, layer: 1 },
  { d: 'M-40,120 C220,150 400,310 320,580 C240,780 80,920 -60,990', opacity: 0.22, layer: 2 },
  { d: 'M-20,200 C270,240 460,390 380,670 C300,880 140,1010 -40,1080', opacity: 0.18, layer: 1 },
  { d: 'M0,280 C320,330 520,470 440,760 C360,970 200,1090 40,1150', opacity: 0.15, layer: 0 },
  { d: 'M20,360 C370,420 580,560 500,850 C430,1050 270,1170 120,1220', opacity: 0.12, layer: 0 },

  // Central Valley Flow (S-Curves)
  { d: 'M240,-80 C480,160 620,440 920,520 C1240,600 1520,380 1780,240 C1880,190 1980,170 2060,180', opacity: 0.15, layer: 1 },
  { d: 'M320,-80 C560,180 700,480 1000,560 C1320,640 1600,430 1850,300 C1940,250 2030,230 2100,240', opacity: 0.18, layer: 2 },
  { d: 'M400,-80 C640,210 780,520 1080,610 C1400,690 1670,490 1920,370 C2000,320 2080,300 2140,310', opacity: 0.22, layer: 2 },
  { d: 'M480,-80 C720,240 860,570 1160,660 C1480,740 1740,550 1980,440 C2060,400 2130,380 2180,390', opacity: 0.18, layer: 1 },
  { d: 'M560,-80 C800,280 940,620 1240,710 C1560,800 1810,620 2040,520 C2120,480 2180,460 2220,470', opacity: 0.15, layer: 0 },

  // Bottom-Right Mountain Ridge
  { d: 'M840,1160 C1060,940 1340,820 1680,860 C1860,880 1990,960 2060,1040', opacity: 0.15, layer: 0 },
  { d: 'M960,1160 C1160,980 1420,880 1730,910 C1890,930 2010,1000 2070,1070', opacity: 0.18, layer: 1 },
  { d: 'M1080,1160 C1260,1020 1500,940 1780,960 C1920,980 2030,1040 2080,1100', opacity: 0.22, layer: 2 },
  { d: 'M1200,1160 C1360,1060 1570,1000 1820,1020 C1940,1030 2040,1080 2080,1130', opacity: 0.18, layer: 1 },
  { d: 'M1320,1160 C1460,1100 1640,1060 1860,1070 C1960,1080 2040,1120 2070,1150', opacity: 0.15, layer: 0 },
  { d: 'M1440,1160 C1560,1130 1710,1110 1890,1120 C1970,1130 2030,1150 2050,1170', opacity: 0.12, layer: 0 },

  // Fine Secondary Harmonic Waves
  { d: 'M-40,460 C260,520 460,680 400,920 C340,1100 180,1210 20,1260', opacity: 0.10, layer: 0 },
  { d: 'M660,-80 C900,320 1040,680 1340,780 C1660,870 1900,700 2110,610', opacity: 0.10, layer: 1 },
  { d: 'M740,1160 C960,900 1250,770 1620,810 C1820,830 1970,920 2050,1010', opacity: 0.10, layer: 0 },
];

export interface GlossaryCardData {
  id: string;
  term: string;
  full: string;
  cat: string;
  catColor: string;
  catBg: string;
  catBorder: string;
  cardBg: string;
  pillColor: string;
  desc: string;
  formula?: string;
  formulaNotations?: string;
}

export const GLOSSARY_CARDS: GlossaryCardData[] = [
  {
    id: 'ibr',
    term: 'IBR',
    full: 'Incentive-Based Regulation',
    cat: 'IBR Framework',
    catColor: '#1d4ed8',
    catBg: '#dbeafe',
    catBorder: '#bfdbfe',
    cardBg: '#eff6ff',
    pillColor: '#3b82f6',
    desc: 'A regulatory framework that sets multi-year revenue caps to incentivize Sabah Electricity to improve grid efficiency, reliability, and service quality.',
    formula: 'Allowed Revenue = OPEX + Return on RAB + Depreciation',
    formulaNotations: 'RAB: Regulatory Asset Base | OPEX: Operating Expenditure',
  },
  {
    id: 'saidi',
    term: 'SAIDI',
    full: 'System Average Interruption Duration Index',
    cat: 'Corporate Performance',
    catColor: '#c2410c',
    catBg: '#ffedd5',
    catBorder: '#fed7aa',
    cardBg: '#fff7ed',
    pillColor: '#f97316',
    desc: 'Measures the average total outage duration experienced by each customer over a year, tracked in minutes per customer per year.',
    formula: 'SAIDI = Σ(ri × Ni) / Nt',
    formulaNotations: 'ri: Restoration time | Ni: Interrupted customers | Nt: Total customers',
  },
  {
    id: 'reset2030',
    term: 'ReSET2030',
    full: 'Renewable & Sustainable Energy Transition 2030',
    cat: 'ReSET2030',
    catColor: '#0369a1',
    catBg: '#e0f2fe',
    catBorder: '#bae6fd',
    cardBg: '#f0f9ff',
    pillColor: '#0ea5e9',
    desc: 'Sabah plan to strengthen Security of Supply, reach 1,429 MW+ dependable capacity, and raise the reserve margin from 10% to 30% by 2030.',
    formula: 'Reserve Margin (%) = (Dependable Capacity − Peak Demand) / Peak Demand × 100',
    formulaNotations: 'Target: 30% by 2030 | Peak Demand: 1,295 MW',
  },
];

export const LEADERBOARD_ENTRIES = [
  { rank: 1, name: 'Aiman', fullName: 'Aiman Hakim', score: 1420, streak: 12, initials: 'AH' },
  { rank: 2, name: 'Nurul', fullName: 'Nurul Izzah', score: 1285, streak: 9, initials: 'NI' },
  { rank: 3, name: 'Hafiz', fullName: 'Hafizuddin', score: 1190, streak: 7, initials: 'HZ' },
] as const;

export const RESET2030_METRICS = {
  dependableCapacityMW: 1429,
  peakDemandMW: 1295,
  reserveStartPct: 10,
  reserveTargetPct: 30,
  projectCount: 7,
  westCoastMW: 1090,
  eastCoastMW: 322,
  fuelSummary: 'Solar · Hydro · CCGT · Gas Conversion',
} as const;

export const QUIZ_DEMO_DATA = {
  subtitle: '10 Questions • ReSET2030 & Grid Reliability',
  introCopy: 'Answer monthly questions to earn points on the monthly leaderboard.',
  questionLabel: 'QUESTION 10 OF 10',
  xpReward: 150,
  streakDays: 7,
  startScore: 1270,
  endScore: LEADERBOARD_ENTRIES[0].score,
  prompt: 'What is Sabah 2030 Reserve Margin target under ReSET2030?',
  options: [
    { key: 'A', label: '15% Reserve Margin', correct: false },
    { key: 'B', label: '22% Reserve Margin', correct: false },
    { key: 'C', label: '30% Reserve Margin', correct: true },
    { key: 'D', label: '45% Reserve Margin', correct: false },
  ],
} as const;
