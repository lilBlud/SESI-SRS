const ALLOWED_MIMES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const MAX_BASE64_LENGTH = 16 * 1024 * 1024; // ~12 MB decoded
const MAX_TEXT_LENGTH = 120000;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function buildPrompt({ count, difficulty, focus, existingQuestions }) {
  const difficultyGuide = {
    basic: 'Basic recall & foundational understanding suitable for all staff.',
    technical: 'Technical regulatory, engineering, formula, and operational depth.',
    mixed: 'A balanced mix of foundational understanding, practical application, and technical detail.',
  }[difficulty] || 'A balanced mix of foundational understanding and practical application.';

  const avoidBlock = Array.isArray(existingQuestions) && existingQuestions.length > 0
    ? `\nDo NOT repeat or closely paraphrase any of these existing questions:\n${existingQuestions
        .slice(0, 60)
        .map((q, i) => `${i + 1}. ${String(q).trim()}`)
        .join('\n')}\n`
    : '';

  const focusBlock = focus
    ? `\nAdditional admin focus instruction: ${focus}\n`
    : '';

  return [
    `You are an instructional designer for Sabah Electricity Supply Industry (SESI).`,
    `Generate EXACTLY ${count} multiple-choice quiz questions strictly grounded in the provided document or text.`,
    `Difficulty level: ${difficultyGuide}`,
    focusBlock,
    avoidBlock,
    `Rules:`,
    `- Every question must be self-contained, clear, unambiguous, and factually verifiable from the provided source.`,
    `- Provide exactly 4 distinct, plausible options (optionA, optionB, optionC, optionD) of similar length and tone.`,
    `- Do NOT include letter prefixes like "A." or "B)" inside optionA..optionD.`,
    `- Distribute correctOption evenly across "A", "B", "C", and "D".`,
    `- Include a concise sourceSnippet (max 140 chars) quoting or pointing to the exact section/fact in the document that proves the answer.`,
    `- Return ONLY valid JSON matching the requested schema.`,
  ].join('\n');
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    questions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          questionText: { type: 'STRING' },
          optionA: { type: 'STRING' },
          optionB: { type: 'STRING' },
          optionC: { type: 'STRING' },
          optionD: { type: 'STRING' },
          correctOption: { type: 'STRING', enum: ['A', 'B', 'C', 'D'] },
          sourceSnippet: { type: 'STRING' },
        },
        required: [
          'questionText',
          'optionA',
          'optionB',
          'optionC',
          'optionD',
          'correctOption',
        ],
      },
    },
  },
  required: ['questions'],
};

function sanitizeQuestions(rawQuestions, maxCount) {
  if (!Array.isArray(rawQuestions)) return [];
  const cleaned = [];
  for (const item of rawQuestions) {
    if (!item || typeof item !== 'object') continue;
    const questionText = String(item.questionText || '').trim();
    const optionA = String(item.optionA || '').trim();
    const optionB = String(item.optionB || '').trim();
    const optionC = String(item.optionC || '').trim();
    const optionD = String(item.optionD || '').trim();
    const rawCorrect = String(item.correctOption || 'A').trim().toUpperCase();
    const correctOption = ['A', 'B', 'C', 'D'].includes(rawCorrect) ? rawCorrect : 'A';
    const sourceSnippet = String(item.sourceSnippet || '').trim().slice(0, 220);

    if (!questionText || !optionA || !optionB || !optionC || !optionD) continue;
    cleaned.push({
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      sourceSnippet,
    });
    if (cleaned.length >= maxCount) break;
  }
  return cleaned;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = (env?.GEMINI_API_KEY || '').trim();
  const model = (env?.GEMINI_MODEL || 'gemini-3.8-flash').trim();

  if (!apiKey) {
    return jsonResponse(
      {
        error:
          'GEMINI_API_KEY is not configured on Cloudflare Pages. Add GEMINI_API_KEY in Cloudflare Pages → Settings → Environment variables and redeploy.',
      },
      503
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON request body.' }, 400);
  }

  const count = Math.max(1, Math.min(15, Math.floor(Number(body?.count) || 5)));
  const difficulty = String(body?.difficulty || 'mixed').toLowerCase();
  const focus = String(body?.focus || '').trim().slice(0, 500);
  const text = String(body?.text || '').trim().slice(0, MAX_TEXT_LENGTH);
  const existingQuestions = Array.isArray(body?.existingQuestions) ? body.existingQuestions : [];
  const file = body?.file && typeof body.file === 'object' ? body.file : null;

  if (!text && !file?.base64) {
    return jsonResponse(
      { error: 'Please provide a document file or source text to generate questions from.' },
      400
    );
  }

  const parts = [];
  if (file?.base64) {
    const mimeType = String(file.mimeType || '').toLowerCase();
    if (!ALLOWED_MIMES.has(mimeType)) {
      return jsonResponse(
        { error: `Unsupported file MIME type: ${mimeType || 'unknown'}.` },
        400
      );
    }
    if (String(file.base64).length > MAX_BASE64_LENGTH) {
      return jsonResponse(
        { error: 'Uploaded document exceeds the maximum allowed size (10 MB).' },
        413
      );
    }
    parts.push({
      inlineData: {
        mimeType,
        data: String(file.base64),
      },
    });
  }

  if (text) {
    parts.push({ text: `SOURCE DOCUMENT CONTENT:\n${text}` });
  }

  parts.push({
    text: buildPrompt({ count, difficulty, focus, existingQuestions }),
  });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let geminiRes;
  try {
    geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    });
  } catch (err) {
    return jsonResponse(
      { error: `Failed to reach Gemini API: ${err?.message || 'network error'}` },
      502
    );
  }

  const geminiBody = await geminiRes.json().catch(() => null);
  if (!geminiRes.ok) {
    const apiErr =
      geminiBody?.error?.message || `Gemini API returned HTTP ${geminiRes.status}.`;
    return jsonResponse({ error: apiErr }, geminiRes.status === 429 ? 429 : 502);
  }

  const candidateText =
    geminiBody?.candidates?.[0]?.content?.parts
      ?.map(p => p?.text || '')
      .join('')
      .trim() || '';

  if (!candidateText) {
    return jsonResponse(
      { error: 'Gemini returned an empty response. Try again or shorten the document.' },
      502
    );
  }

  let parsedOutput;
  try {
    parsedOutput = JSON.parse(candidateText);
  } catch {
    return jsonResponse(
      { error: 'Gemini returned malformed JSON. Please retry.' },
      502
    );
  }

  const questions = sanitizeQuestions(parsedOutput?.questions, count);
  return jsonResponse({ model, questions }, 200);
}
