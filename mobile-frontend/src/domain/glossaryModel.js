export const CHART_FORMULA_TYPES = new Set(['area', 'bar', 'line']);

/**
 * Safely parse stored chart JSON/array into normalized point objects.
 */
export function parseChartData(rawChartData) {
  if (Array.isArray(rawChartData)) return rawChartData;
  if (typeof rawChartData !== 'string' || !rawChartData.trim()) return [];
  try {
    const parsed = JSON.parse(rawChartData);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Returns true when `formula` holds an actual mathematical formula
 * rather than a legacy chart-type token ('area', 'bar', 'line').
 */
export function isMathFormula(formula) {
  if (!formula || typeof formula !== 'string') return false;
  const trimmed = formula.trim().toLowerCase();
  return Boolean(trimmed) && !CHART_FORMULA_TYPES.has(trimmed);
}

/**
 * Normalize a GlossaryTerm record (Supabase row, ASP.NET DTO, or UI draft)
 * into a single canonical shape with backwards-compatible aliases.
 */
export function normalizeGlossaryTerm(raw) {
  if (!raw || typeof raw !== 'object') return raw;

  const id = raw.Id ?? raw.id;
  const term = raw.Term ?? raw.term ?? '';
  const full = raw.FullName ?? raw.full ?? raw.fullName ?? '';
  const desc = raw.Description ?? raw.desc ?? raw.description ?? '';
  const cat = raw.Category ?? raw.cat ?? raw.category ?? 'General';
  const formula = raw.Formula ?? raw.formula ?? '';
  const formulaNotations = raw.FormulaNotations ?? raw.formulaNotations ?? '';
  const formulaTermMeanings = raw.FormulaTermMeanings ?? raw.formulaTermMeanings ?? '';
  const rawChartData = raw.ChartData ?? raw.chartData ?? '';
  const parsedChartData = parseChartData(rawChartData);

  const rawFormulaLower = String(formula || '').trim().toLowerCase();
  const isChartToken = CHART_FORMULA_TYPES.has(rawFormulaLower);
  const chartType = isChartToken && rawFormulaLower === 'bar' ? 'bar' : 'area';
  const mathFormula = isChartToken ? '' : String(formula || '').trim();
  const isPerformanceCard = cat === 'Corporate Performance' || parsedChartData.length > 0;
  const yAxisFormat = raw.yAxisFormat ?? (isPerformanceCard ? formulaNotations : '');

  return {
    id,
    term,
    full,
    desc,
    cat,
    fullName: full,
    description: desc,
    category: cat,
    formula,
    formulaNotations,
    formulaTermMeanings,
    yAxisFormat,
    chartData: typeof rawChartData === 'string' ? rawChartData : JSON.stringify(parsedChartData),
    parsedChartData,
    isPerformanceCard,
    chartType,
    mathFormula,
  };
}

/**
 * Unpack primary and additional poster images into a clean array of URLs/data URIs.
 */
export function unpackPosterImages(post) {
  if (!post || typeof post !== 'object') return [];
  const images = [];
  const main = post.ImageUrl ?? post.imageUrl;
  if (main) images.push(main);

  const extra = post.AdditionalImages ?? post.additionalImages;
  if (Array.isArray(extra)) {
    images.push(...extra.filter(Boolean));
  } else if (typeof extra === 'string' && extra.trim()) {
    try {
      const parsed = JSON.parse(extra);
      if (Array.isArray(parsed)) images.push(...parsed.filter(Boolean));
    } catch {
      // ignore malformed JSON
    }
  }
  return images;
}
