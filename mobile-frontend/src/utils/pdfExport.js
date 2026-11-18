import { isMathFormula, parseChartData, unpackPosterImages } from '../domain/glossaryModel';

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch]);
}

export function sanitizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/') ||
    /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(trimmed)
  ) {
    return trimmed;
  }
  return '';
}

export function exportBookmarksToPdf(bookmarks = []) {
  if (bookmarks.length === 0) return;

  const pdfWin = window.open('', '_blank');
  if (!pdfWin) {
    alert('Please allow popups to download / save your bookmarks as PDF.');
    return;
  }

  const dictItems = bookmarks.filter(b => b.type === 'glossary');
  const posterItems = bookmarks.filter(b => b.type === 'poster');

  pdfWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SESI Reference Guide - Compiled Bookmarks</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { box-sizing: border-box; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { margin: 0; padding: 40px; color: #0f172a; background: #fff; line-height: 1.5; }
        .no-print { margin-bottom: 24px; display: flex; justify-content: flex-start; }
        .back-btn { background: #0f172a; color: #fff; padding: 12px 20px; border: none; border-radius: 12px; font-weight: bold; font-size: 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .back-btn:hover { background: #1e293b; }
        .header { border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        .header-title { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0; }
        .header-sub { font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.1em; }
        .header-meta { font-size: 12px; color: #64748b; text-align: right; }
        .section-title { font-size: 18px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; border-left: 4px solid #059669; padding-left: 12px; margin: 40px 0 20px 0; }
        .dict-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .dict-card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; page-break-inside: avoid; background: #f8fafc; }
        .dict-cat { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #059669; background: #d1fae5; padding: 3px 8px; border-radius: 6px; display: inline-block; margin-bottom: 8px; }
        .dict-term { font-size: 20px; font-weight: 900; margin: 0 0 8px 0; color: #0f172a; }
        .dict-desc { font-size: 13px; color: #334155; white-space: pre-wrap; margin-bottom: 12px; }
        .dict-formula { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; font-weight: 700; background: #e2e8f0; padding: 10px; border-radius: 8px; color: #0f172a; border-left: 3px solid #059669; }
        .poster-item { border: 1px solid #cbd5e1; border-radius: 16px; padding: 24px; margin-bottom: 30px; page-break-inside: avoid; }
        .poster-title { font-size: 22px; font-weight: 900; margin: 0 0 8px 0; color: #0f172a; }
        .poster-desc { font-size: 14px; color: #475569; margin-bottom: 16px; white-space: pre-wrap; }
        .poster-images { display: flex; flex-direction: column; gap: 16px; align-items: center; }
        .poster-images img { max-width: 100%; max-height: 600px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; }
        @media print {
          body { padding: 0; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="no-print">
        <button class="back-btn" onclick="window.close()">← Back to App</button>
      </div>
      <div class="header">
        <div>
          <div class="header-sub">SESI • Corporate Reference Guide</div>
          <h1 class="header-title">Saved Bookmarks Archive</h1>
        </div>
        <div class="header-meta">
          Generated on ${escapeHtml(new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }))}<br/>
          Total Bookmarks: ${bookmarks.length}
        </div>
      </div>
  `);

  if (dictItems.length > 0) {
    pdfWin.document.write(`<h2 class="section-title">Dictionary Reference</h2><div class="dict-grid">`);
    dictItems.forEach(bm => {
      const cat = bm.cat || bm.category || 'Dictionary';
      const titleStr = bm.term || bm.title || '';
      const fullStr = bm.full || bm.fullName || '';
      const descStr = bm.desc || bm.description || '';
      const hasChart = cat === 'Corporate Performance' || parseChartData(bm.chartData).length > 0;

      pdfWin.document.write(`<div class="dict-card">`);
      pdfWin.document.write(`<div class="dict-cat">${escapeHtml(cat)}</div>`);
      pdfWin.document.write(
        `<h3 class="dict-term">${escapeHtml(titleStr)}${fullStr && !titleStr.includes(' ') ? ` <span style="font-size:14px;color:#64748b;font-weight:600;margin-left:8px;">(${escapeHtml(fullStr)})</span>` : ''}</h3>`
      );
      pdfWin.document.write(`<div class="dict-desc">${escapeHtml(descStr)}</div>`);

      if (hasChart) {
        const parsed = parseChartData(bm.chartData);
        if (parsed.length > 0) {
          const maxVal = Math.max(...parsed.map(d => Number(d.value) || 0));
          let barsHtml = `<div style="display:flex; align-items:flex-end; gap:6px; height:120px; margin-top:20px; padding-top:16px; border-top: 1px dashed #cbd5e1; page-break-inside: avoid;">`;
          parsed.forEach(d => {
            const val = Number(d.value) || 0;
            const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
            barsHtml += `
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:4px; height:100%;">
                <div style="font-size:8px; color:#64748b; font-weight:700;">${escapeHtml(val)}</div>
                <div style="width:100%; max-width:24px; height:${Math.max(1, heightPct)}%; background:#10b981; border-radius:3px 3px 0 0; min-height:4px;"></div>
                <div style="font-size:8px; font-weight:800; color:#475569;">${escapeHtml(d.month)}</div>
              </div>
            `;
          });
          barsHtml += `</div>`;
          pdfWin.document.write(barsHtml);
        }
      }

      if (isMathFormula(bm.formula)) {
        pdfWin.document.write(`<div class="dict-formula">📐 ${escapeHtml(bm.formula)}</div>`);
      }
      pdfWin.document.write(`</div>`);
    });
    pdfWin.document.write(`</div>`);
  }

  if (posterItems.length > 0) {
    pdfWin.document.write(`<h2 class="section-title">Infographic Posters</h2>`);
    posterItems.forEach(bm => {
      pdfWin.document.write(`<div class="poster-item">`);
      pdfWin.document.write(`<h3 class="poster-title">${escapeHtml(bm.title)}</h3>`);
      if (bm.description) {
        pdfWin.document.write(`<div class="poster-desc">${escapeHtml(bm.description)}</div>`);
      }
      pdfWin.document.write(`<div class="poster-images">`);
      const allImgs = unpackPosterImages(bm).map(sanitizeImageUrl).filter(Boolean);
      allImgs.forEach(img => {
        pdfWin.document.write(`<img src="${escapeHtml(img)}" alt="${escapeHtml(bm.title)}" />`);
      });
      pdfWin.document.write(`</div></div>`);
    });
  }

  pdfWin.document.write(`
    <div style="margin-top:60px; text-align:center; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:20px;">
      SESI • Sabah Electricity Supply Industry Knowledge Platform
    </div>
  </body></html>`);

  pdfWin.document.close();
  setTimeout(() => pdfWin.print(), 300);
}

export function exportSingleTermToPdf(activeBookmark, catMeta) {
  if (typeof window === 'undefined' || !activeBookmark) return;

  const pdfWin = window.open('', '_blank');
  if (!pdfWin) {
    alert('Please allow popups to export to PDF.');
    return;
  }

  const term = activeBookmark.term || '';
  const full = activeBookmark.full || activeBookmark.fullName || '';
  const cat = activeBookmark.cat || activeBookmark.category || 'Dictionary';
  const desc = activeBookmark.desc || activeBookmark.description || '';
  const safeMeaningsHtml = activeBookmark.formulaTermMeanings
    ? escapeHtml(activeBookmark.formulaTermMeanings).replace(/\n/g, '<br/>')
    : '';

  pdfWin.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(term || 'Term')} - SESI Dictionary</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; color: #1e293b; }
    h1 { font-size: 28px; margin: 0; }
    h2 { font-size: 18px; color: #475569; font-weight: 600; margin: 4px 0 16px; }
    .badge { display: inline-block; background: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-bottom: 12px; }
    .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-top: 16px; }
    .desc { font-size: 15px; line-height: 1.7; color: #334155; margin-top: 4px; white-space: pre-wrap; }
    .formula-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 12px; font-family: monospace; font-size: 14px; font-weight: 700; color: #0f172a; }
    .meanings { font-size: 13px; color: #475569; margin-top: 8px; line-height: 1.6; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
    @media print { body { margin: 20px; } .no-print { display: none !important; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: flex-start;">
    <button onclick="window.close()" style="background: #0f172a; color: white; padding: 12px 20px; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      ← Back to App
    </button>
  </div>
  <div class="badge">${escapeHtml(catMeta?.emoji || '📖')} ${escapeHtml(cat)}</div>
  <h1>${escapeHtml(term)}</h1>
  ${full && !term.includes(' ') ? `<h2>${escapeHtml(full)}</h2>` : ''}
  <div class="section-label">Definition</div>
  <div class="desc">${escapeHtml(desc)}</div>
  ${isMathFormula(activeBookmark.formula) ? `<div class="formula-box">📐 ${escapeHtml(activeBookmark.formula)}</div>` : ''}
  ${safeMeaningsHtml ? `<div class="section-label">Term Meanings</div><div class="meanings">${safeMeaningsHtml}</div>` : ''}
  <div class="footer">SESI Dictionary • Sabah Electricity Supply Industry • ${escapeHtml(new Date().toLocaleDateString())}</div>
</body>
</html>`);

  pdfWin.document.close();
  setTimeout(() => pdfWin.print(), 300);
}
