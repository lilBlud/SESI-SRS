import React from 'react';
import { BoltIcon } from '../../components/Icons';
import { BRAND, QUIZ_DEMO_DATA } from '../../data/sesiData';
import { FONT_SANS } from '../../motion/fonts';

type QuizIntroCardProps = {
  readonly quizTitle: string;
  readonly btnScale: number;
};

export const QuizIntroCard: React.FC<QuizIntroCardProps> = ({ quizTitle, btnScale }) => (
  <>
    {/* Monthly Archive Strip */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 14px',
          borderRadius: 12,
          backgroundColor: BRAND.ground,
          border: `1px solid ${BRAND.slate200}`,
          fontFamily: FONT_SANS,
          fontSize: 13,
          fontWeight: 700,
          color: BRAND.inkMuted,
        }}
      >
        <span>October 2026</span>
        <span style={{ color: BRAND.inkSubtle, fontWeight: 600 }}>• Completed</span>
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 14px',
          borderRadius: 12,
          backgroundColor: BRAND.emeraldSoft,
          border: '1px solid #6ee7b7',
          fontFamily: FONT_SANS,
          fontSize: 13,
          fontWeight: 800,
          color: '#065f46',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: BRAND.emerald }} />
        <span>November 2026 · Current</span>
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: 32, fontWeight: 800, color: BRAND.ink }}>
            {quizTitle}
          </span>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 17, color: BRAND.inkSubtle, marginTop: 6 }}>
          {QUIZ_DEMO_DATA.subtitle}
        </div>
      </div>

      <div
        style={{
          padding: '8px 16px',
          borderRadius: 999,
          backgroundColor: '#f0fdfa',
          border: '1px solid #99f6e4',
          fontFamily: FONT_SANS,
          fontSize: 15,
          fontWeight: 700,
          color: '#0f766e',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <BoltIcon size={16} color="#0f766e" />
        <span>Available</span>
      </div>
    </div>

    <p style={{ fontFamily: FONT_SANS, fontSize: 19, color: BRAND.inkMuted, lineHeight: 1.5, margin: '0 0 24px' }}>
      {QUIZ_DEMO_DATA.introCopy}
    </p>

    <div
      style={{
        width: '100%',
        padding: '20px 28px',
        borderRadius: 18,
        background: `linear-gradient(90deg, ${BRAND.emerald}, ${BRAND.teal})`,
        boxShadow: '0 10px 28px rgba(5, 150, 105, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: FONT_SANS,
        fontSize: 22,
        fontWeight: 800,
        color: BRAND.white,
        transform: `scale(${btnScale})`,
      }}
    >
      <span>Start Quiz</span>
      <span>→</span>
    </div>
  </>
);
