import { API_BASE, getAuthHeaders } from '../../services/apiConfig';

export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_QUESTIONS_PER_RUN = 50;
export const BATCH_SIZE = 15;

const TEXT_EXTENSIONS = new Set(['txt', 'md', 'markdown', 'csv', 'json']);
const SUPPORTED_BINARY_MIMES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

function getExtension(name = '') {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Prepares a browser File object into either plain text or a base64 payload
 * suitable for Gemini multimodal generateContent.
 */
export async function prepareDocumentPayload(file) {
  if (!file) return null;
  if (file.size > MAX_DOCUMENT_BYTES) {
    throw new Error('File is too large. Please upload a document under 10 MB.');
  }

  const ext = getExtension(file.name);
  const mime = (file.type || '').toLowerCase();

  if (mime.startsWith('text/') || TEXT_EXTENSIONS.has(ext)) {
    const content = await file.text();
    if (!content.trim()) {
      throw new Error('The uploaded text file is empty.');
    }
    return {
      kind: 'text',
      name: file.name,
      text: content.slice(0, 120000),
    };
  }

  const resolvedMime = mime || (ext === 'pdf' ? 'application/pdf' : '');
  if (!SUPPORTED_BINARY_MIMES.has(resolvedMime)) {
    throw new Error(
      'Unsupported file type. Upload a PDF, TXT, Markdown, CSV, or image (PNG/JPG/WEBP), or paste text directly.'
    );
  }

  const buffer = await file.arrayBuffer();
  return {
    kind: 'file',
    name: file.name,
    mimeType: resolvedMime,
    base64: arrayBufferToBase64(buffer),
  };
}

/**
 * Normalizes and validates raw generated draft questions from the backend.
 */
export function normalizeGeneratedQuestions(rawList = [], existingNormalized = new Set()) {
  const seen = new Set(existingNormalized);
  const results = [];

  for (const item of rawList) {
    if (!item || typeof item !== 'object') continue;
    const questionText = String(item.questionText ?? item.question ?? '').trim();
    const optionA = String(item.optionA ?? '').trim();
    const optionB = String(item.optionB ?? '').trim();
    const optionC = String(item.optionC ?? '').trim();
    const optionD = String(item.optionD ?? '').trim();
    const rawCorrect = String(item.correctOption ?? 'A').trim().toUpperCase();
    const correctOption = ['A', 'B', 'C', 'D'].includes(rawCorrect) ? rawCorrect : 'A';
    const sourceSnippet = String(item.sourceSnippet ?? '').trim();

    if (!questionText || !optionA || !optionB || !optionC || !optionD) continue;

    const dedupeKey = questionText.toLowerCase();
    const isDuplicate = seen.has(dedupeKey);
    seen.add(dedupeKey);

    results.push({
      draftId: `${Date.now()}-${results.length}-${Math.random().toString(36).slice(2, 7)}`,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      sourceSnippet,
      isDuplicate,
    });
  }

  return results;
}

/**
 * Splits a target question count into balanced batches of at most BATCH_SIZE.
 */
export function buildBatchSizes(totalCount, maxBatchSize = BATCH_SIZE) {
  const clamped = Math.max(1, Math.min(MAX_QUESTIONS_PER_RUN, Math.floor(Number(totalCount) || 1)));
  if (clamped <= maxBatchSize) return [clamped];

  const batchCount = Math.ceil(clamped / maxBatchSize);
  const base = Math.floor(clamped / batchCount);
  const remainder = clamped % batchCount;
  return Array.from({ length: batchCount }, (_, i) => base + (i < remainder ? 1 : 0));
}

/**
 * Calls POST /api/admin/questions/generate (handled by mobile-backend on localhost
 * and Cloudflare Pages Function on *.pages.dev), automatically batching requests > 15.
 */
export async function generateQuizQuestionsFromDocument({
  count = 5,
  difficulty = 'mixed',
  month = '',
  focus = '',
  text = '',
  filePayload = null,
  existingQuestions = [],
  onProgress,
  signal,
}) {
  const combinedText = [
    filePayload?.kind === 'text' ? `[Document: ${filePayload.name}]\n${filePayload.text}` : '',
    text.trim(),
  ]
    .filter(Boolean)
    .join('\n\n');

  const binaryFile = filePayload?.kind === 'file'
    ? {
        name: filePayload.name,
        mimeType: filePayload.mimeType,
        base64: filePayload.base64,
      }
    : null;

  if (!combinedText && !binaryFile) {
    throw new Error('Please upload a document or paste source text first.');
  }

  const batchSizes = buildBatchSizes(count);
  const existingTexts = existingQuestions
    .map(q => String(typeof q === 'string' ? q : q?.questionText || '').trim())
    .filter(Boolean);
  const existingSet = new Set(existingTexts.map(t => t.toLowerCase()));

  const accumulated = [];
  let resolvedModel = '';

  for (let i = 0; i < batchSizes.length; i++) {
    const batchCount = batchSizes[i];
    if (onProgress) {
      onProgress({
        currentBatch: i + 1,
        totalBatches: batchSizes.length,
        generatedSoFar: accumulated.length,
        targetCount: batchSizes.reduce((a, b) => a + b, 0),
      });
    }

    const avoidList = [
      ...existingTexts,
      ...accumulated.map(q => q.questionText),
    ].slice(-60);

    const response = await fetch(`${API_BASE}/api/admin/questions/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        count: batchCount,
        difficulty,
        month,
        focus: focus.trim(),
        text: combinedText,
        file: binaryFile,
        existingQuestions: avoidList,
      }),
      signal,
    });

    const rawText = await response.text();
    let parsed = null;
    try {
      parsed = rawText ? JSON.parse(rawText) : null;
    } catch {
      parsed = null;
    }

    if (!response.ok) {
      const serverErr = parsed?.error || parsed?.message || rawText?.slice(0, 180);
      throw new Error(serverErr || `Generation failed (HTTP ${response.status}).`);
    }

    if (parsed?.model) resolvedModel = parsed.model;
    const batchDrafts = normalizeGeneratedQuestions(parsed?.questions || [], existingSet);
    for (const draft of batchDrafts) {
      existingSet.add(draft.questionText.toLowerCase());
      accumulated.push(draft);
    }
  }

  if (accumulated.length === 0) {
    throw new Error('No valid quiz questions could be generated from this document. Try adding more detail.');
  }

  return {
    model: resolvedModel || 'gemini-3.8-flash',
    questions: accumulated,
  };
}
