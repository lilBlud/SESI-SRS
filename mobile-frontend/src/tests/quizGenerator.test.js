import { describe, it, expect } from 'vitest';
import {
  buildBatchSizes,
  normalizeGeneratedQuestions,
  prepareDocumentPayload,
  MAX_DOCUMENT_BYTES,
} from '../features/quiz/quizGeneratorService';

describe('quizGeneratorService', () => {
  it('splits requested question counts into balanced batches of at most 15', () => {
    expect(buildBatchSizes(0)).toEqual([1]);
    expect(buildBatchSizes(1)).toEqual([1]);
    expect(buildBatchSizes(10)).toEqual([10]);
    expect(buildBatchSizes(15)).toEqual([15]);
    expect(buildBatchSizes(25)).toEqual([13, 12]);
    expect(buildBatchSizes(40)).toEqual([14, 13, 13]);
    expect(buildBatchSizes(99).reduce((a, b) => a + b, 0)).toBe(50);
  });

  it('normalizes generated questions and flags duplicates', () => {
    const existing = new Set(['what does ibr stand for?']);
    const raw = [
      {
        questionText: 'What does IBR stand for?',
        optionA: 'Incentive-Based Regulation',
        optionB: 'Internal Billing Rate',
        optionC: 'Integrated Base Reserve',
        optionD: 'Industrial Bus Relay',
        correctOption: 'a',
        sourceSnippet: 'Section 1.1',
      },
      {
        questionText: 'Which metric tracks average outage duration?',
        optionA: 'SAIFI',
        optionB: 'SAIDI',
        optionC: 'CAIDI',
        optionD: 'MAIFI',
        correctOption: 'B',
      },
      {
        // Incomplete options should be filtered out
        questionText: 'Broken question',
        optionA: 'Only one',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
      },
    ];

    const drafts = normalizeGeneratedQuestions(raw, existing);
    expect(drafts).toHaveLength(2);
    expect(drafts[0].isDuplicate).toBe(true);
    expect(drafts[0].correctOption).toBe('A');
    expect(drafts[1].isDuplicate).toBe(false);
    expect(drafts[1].correctOption).toBe('B');
  });

  it('validates file size and supported document types', async () => {
    const bigFile = { name: 'huge.pdf', type: 'application/pdf', size: MAX_DOCUMENT_BYTES + 1 };
    await expect(prepareDocumentPayload(bigFile)).rejects.toThrow(/too large/i);

    const unsupported = { name: 'archive.zip', type: 'application/zip', size: 100 };
    await expect(prepareDocumentPayload(unsupported)).rejects.toThrow(/unsupported file type/i);

    const txtFile = {
      name: 'notes.md',
      type: 'text/markdown',
      size: 42,
      text: async () => 'SAIDI measures outage duration.',
    };
    const res = await prepareDocumentPayload(txtFile);
    expect(res).toEqual({
      kind: 'text',
      name: 'notes.md',
      text: 'SAIDI measures outage duration.',
    });
  });
});
