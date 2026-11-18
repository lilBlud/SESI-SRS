import React from 'react';
import { Img, Interactive, staticFile } from 'remotion';
import { FlameIcon } from '../../components/Icons';
import { BRAND, QUIZ_DEMO_DATA, RESET2030_METRICS } from '../../data/sesiData';
import { FONT_SANS } from '../../motion/fonts';

type MobilePhoneMockupProps = {
  readonly shiftX: number;
  readonly shiftY: number;
  readonly scale: number;
  readonly rotateY: number;
  readonly rotateX: number;
};

export const MobilePhoneMockup: React.FC<MobilePhoneMockupProps> = ({
  shiftX,
  shiftY,
  scale,
  rotateY,
  rotateX,
}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: 150,
      width: 340,
      height: 640,
      marginLeft: -170,
      transform: `perspective(1400px) translate3d(${shiftX}px, ${shiftY}px, 80px) scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
      transformOrigin: '50% 0%',
    }}
  >
    <Interactive.Div
      name="Mobile Phone Mockup"
      style={{
        width: 340,
        height: 640,
        borderRadius: 46,
        backgroundColor: BRAND.ground,
        border: `4px solid ${BRAND.slate300}`,
        boxShadow: '0 36px 85px rgba(15, 23, 42, 0.22), 0 0 36px rgba(5, 150, 105, 0.16)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 6,
          width: '100%',
          background: `linear-gradient(90deg, ${BRAND.emerald}, ${BRAND.emeraldBright}, ${BRAND.emerald})`,
        }}
      />

      <div
        style={{
          padding: '20px 22px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: BRAND.white,
          borderBottom: `1px solid ${BRAND.slate100}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Img src={staticFile('logo.png')} style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: 800, color: BRAND.ink }}>
            SESI
          </span>
        </div>
        <div
          style={{
            padding: '4px 10px',
            borderRadius: 999,
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            fontFamily: FONT_SANS,
            fontSize: 12,
            fontWeight: 700,
            color: '#b45309',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <FlameIcon size={14} color="#b45309" />
          <span>{QUIZ_DEMO_DATA.streakDays}d</span>
        </div>
      </div>

      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <div
          style={{
            borderRadius: 22,
            padding: 18,
            backgroundColor: BRAND.white,
            border: '1px solid #a7f3d0',
            boxShadow: '0 6px 20px rgba(5, 150, 105, 0.08)',
          }}
        >
          <div style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: 800, color: BRAND.emerald, letterSpacing: '0.06em' }}>
            NOVEMBER 2026
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 20, fontWeight: 800, color: BRAND.ink, marginTop: 4 }}>
            Monthly Quiz
          </div>
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 12,
              background: `linear-gradient(90deg, ${BRAND.emerald}, ${BRAND.teal})`,
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 800,
              color: BRAND.white,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Start Quiz</span>
            <span>→</span>
          </div>
        </div>

        <div
          style={{
            borderRadius: 22,
            padding: 18,
            backgroundColor: BRAND.white,
            border: `1px solid ${BRAND.slate200}`,
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: 800, color: BRAND.ink }}>
            Glossary Flashcards
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: BRAND.inkSubtle, marginTop: 4 }}>
            IBR • SAIDI • ReSET2030
          </div>
        </div>

        <div
          style={{
            borderRadius: 22,
            padding: 18,
            backgroundColor: BRAND.white,
            border: `1px solid ${BRAND.slate200}`,
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: 800, color: BRAND.ink }}>
            Sabah Future Gen
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: BRAND.emerald, marginTop: 4 }}>
            {RESET2030_METRICS.dependableCapacityMW.toLocaleString()} MW Interactive Grid
          </div>
        </div>
      </div>

      <div
        style={{
          height: 62,
          backgroundColor: BRAND.white,
          borderTop: `1px solid ${BRAND.slate200}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          fontFamily: FONT_SANS,
          fontSize: 11,
          fontWeight: 700,
          color: BRAND.inkSubtle,
        }}
      >
        <span style={{ color: BRAND.emerald }}>Home</span>
        <span>Glossary</span>
        <span>Quiz</span>
        <span>Profile</span>
      </div>
    </Interactive.Div>
  </div>
);
