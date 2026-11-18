import React from 'react';
import { BRAND, QUIZ_DEMO_DATA } from '../../data/sesiData';
import { FONT_MONO, FONT_SANS } from '../../motion/fonts';

type QuizQuestionCardProps = {
  readonly progressBarFill: number;
  readonly questionInY: number;
  readonly optionScale: number;
  readonly optionSelected: boolean;
};

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  progressBarFill,
  questionInY,
  optionScale,
  optionSelected,
}) => (
  <div style={{ transform: `translateY(${questionInY}px)` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 15, fontWeight: 700, color: BRAND.emerald }}>
        {QUIZ_DEMO_DATA.questionLabel}
      </span>
      <span style={{ fontFamily: FONT_MONO, fontSize: 15, fontWeight: 700, color: '#d97706' }}>
        {Math.round(progressBarFill)}% · +{QUIZ_DEMO_DATA.xpReward} XP
      </span>
    </div>
    <div
      style={{
        width: '100%',
        height: 6,
        borderRadius: 999,
        backgroundColor: BRAND.slate200,
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: `${progressBarFill}%`,
          height: '100%',
          borderRadius: 999,
          background: `linear-gradient(90deg, ${BRAND.emerald}, ${BRAND.teal})`,
        }}
      />
    </div>

    <div style={{ fontFamily: FONT_SANS, fontSize: 28, fontWeight: 800, color: BRAND.ink, lineHeight: 1.35, marginBottom: 24 }}>
      {QUIZ_DEMO_DATA.prompt}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {QUIZ_DEMO_DATA.options.map((opt) => {
        const isPicked = opt.correct && optionSelected;
        return (
          <div
            key={opt.key}
            style={{
              padding: '18px 20px',
              borderRadius: 16,
              backgroundColor: isPicked ? '#ecfdf5' : BRAND.ground,
              border: isPicked ? `2px solid ${BRAND.emerald}` : `1px solid ${BRAND.slate200}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transform: opt.correct ? `scale(${optionScale})` : 'none',
              boxShadow: isPicked ? '0 8px 24px rgba(5, 150, 105, 0.16)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: isPicked ? BRAND.emerald : BRAND.slate200,
                  color: isPicked ? BRAND.white : BRAND.slate700,
                  fontFamily: FONT_MONO,
                  fontSize: 15,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {opt.key}
              </span>
              <span style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: 700, color: BRAND.ink }}>
                {opt.label}
              </span>
            </div>
            {isPicked && <span style={{ fontSize: 20, color: BRAND.emerald, fontWeight: 800 }}>✓</span>}
          </div>
        );
      })}
    </div>
  </div>
);
