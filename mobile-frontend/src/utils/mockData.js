// Offline fallback mock data for testing when the backend API is unreachable.
// Active glossary terms are fetched directly from the PostgreSQL backend via /api/glossary.

export const mockGlossary = [
  {
    id: 1,
    term: "IBR",
    full: "Incentive-Based Regulation",
    desc: "A regulatory framework that sets a ceiling on revenues while offering financial rewards for cost savings.",
    formula: "Revenue = OPEX + Dep + (RAB × WACC) + Tax",
    formulaNotations: "Revenue\nOPEX\nDep\nRAB\nWACC\nTax",
    formulaTermMeanings: "Revenue: Allowed revenue\nOPEX: Operating Expenditure\nDep: Depreciation\nRAB: Regulated Asset Base\nWACC: Weighted Average Cost of Capital\nTax: Tax allowance",
    cat: "IBR Framework",
    chartData: ""
  },
  {
    id: 2,
    term: "TOTAL REVENUE",
    full: "Total Revenue",
    desc: "Total income generated from the sale of electricity and related services before any expenses are deducted.",
    formula: "",
    formulaNotations: "",
    formulaTermMeanings: "",
    cat: "Corporate Performance",
    chartData: '[{"month":"Jan","year":"2026","value":1.70},{"month":"Feb","year":"2026","value":1.75},{"month":"Mar","year":"2026","value":1.80},{"month":"Apr","year":"2026","value":1.85},{"month":"May","year":"2026","value":1.90},{"month":"Jun","year":"2026","value":1.91},{"month":"Jul","year":"2026","value":1.93}]'
  }
];
