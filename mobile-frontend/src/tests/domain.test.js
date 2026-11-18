import { describe, it, expect } from 'vitest';
import {
  isMathFormula,
  parseChartData,
  normalizeGlossaryTerm,
  unpackPosterImages
} from '../domain/glossaryModel';
import { escapeHtml, sanitizeImageUrl } from '../utils/pdfExport';

describe('Glossary Domain Model', () => {
  it('distinguishes chart marker formulas from real math formulas', () => {
    expect(isMathFormula('')).toBe(false);
    expect(isMathFormula('area')).toBe(false);
    expect(isMathFormula('bar')).toBe(false);
    expect(isMathFormula('line')).toBe(false);
    expect(isMathFormula('  AREA ')).toBe(false);
    expect(isMathFormula('SAIDI = Customer Minutes Interrupted / Total Customers')).toBe(true);
  });

  it('parses chartData safely across array and JSON string formats', () => {
    expect(parseChartData(null)).toEqual([]);
    expect(parseChartData('invalid-json')).toEqual([]);
    expect(parseChartData('[]')).toEqual([]);
    const pts = [{ year: '2025', month: 'Jan', value: 12.5 }];
    expect(parseChartData(pts)).toEqual(pts);
    expect(parseChartData(JSON.stringify(pts))).toEqual(pts);
  });

  it('normalizes both camelCase and PascalCase/short glossary fields consistently', () => {
    const normalized = normalizeGlossaryTerm({
      Id: 42,
      Term: 'SAIDI',
      FullName: 'System Average Interruption Duration Index',
      Category: 'Corporate Performance',
      Description: 'Measures average outage duration.',
      Formula: 'area',
      FormulaNotations: 'in mins',
      ChartData: JSON.stringify([{ year: '2025', month: 'Jan', value: 10 }])
    });

    expect(normalized.id).toBe(42);
    expect(normalized.term).toBe('SAIDI');
    expect(normalized.full).toBe('System Average Interruption Duration Index');
    expect(normalized.fullName).toBe('System Average Interruption Duration Index');
    expect(normalized.cat).toBe('Corporate Performance');
    expect(normalized.category).toBe('Corporate Performance');
    expect(normalized.desc).toBe('Measures average outage duration.');
    expect(normalized.yAxisFormat).toBe('in mins');
    expect(normalized.isPerformanceCard).toBe(true);
    expect(normalized.chartType).toBe('area');
    expect(normalized.mathFormula).toBe('');
  });

  it('unpacks primary and additional poster images safely', () => {
    expect(unpackPosterImages(null)).toEqual([]);
    expect(
      unpackPosterImages({
        imageUrl: 'https://example.com/main.png',
        additionalImages: JSON.stringify(['https://example.com/2.png', '', null])
      })
    ).toEqual(['https://example.com/main.png', 'https://example.com/2.png']);
  });
});

describe('PDF Export Security Sanitizers', () => {
  it('escapes HTML meta-characters to prevent XSS injection', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
    expect(escapeHtml("O'Connor & Sons")).toBe('O&#39;Connor &amp; Sons');
  });

  it('blocks unsafe image URL protocols such as javascript: and data:text/html', () => {
    expect(sanitizeImageUrl('javascript:alert(1)')).toBe('');
    expect(sanitizeImageUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    expect(sanitizeImageUrl('https://example.com/poster.png')).toBe('https://example.com/poster.png');
    expect(sanitizeImageUrl('/uploads/poster.webp')).toBe('/uploads/poster.webp');
    expect(sanitizeImageUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(
      'data:image/png;base64,iVBORw0KGgo='
    );
  });
});
