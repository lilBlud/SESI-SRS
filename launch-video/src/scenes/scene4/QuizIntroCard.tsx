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
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: 34, fontWeight: 800, color: BRAND.ink }}>
            {quizTitle}
          </span>
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              backgroundColor: BRAND.emeraldSoft,
              color: '#065f46',
              padding: '5px 12px',
              borderRadius: 8,
            }}
          >
            Current
          </span>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 18, color: BRAND.inkSubtle, marginTop: 8 }}>
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

    <p style={{ fontFamily: FONT_SANS, fontSize: 20, color: BRAND.inkMuted, lineHeight: 1.5, margin: '0 0 28px' }}>
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
