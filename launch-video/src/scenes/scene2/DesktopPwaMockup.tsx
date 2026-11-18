import React from 'react';
import { Img, Interactive, staticFile } from 'remotion';
import { FlameIcon } from '../../components/Icons';
import { BRAND, QUIZ_DEMO_DATA, RESET2030_METRICS } from '../../data/sesiData';
import { FONT_MONO, FONT_SANS } from '../../motion/fonts';

type DesktopPwaMockupProps = {
  readonly hubTitle: string;
  readonly capCounter: number;
  readonly opacity: number;
  readonly shiftX: number;
  readonly scale: number;
  readonly rotateY: number;
};

const QUICK_MODULES = [
  { title: 'Dictionary & Formulas', sub: 'IBR, SAIDI, ReSET2030 & Charts', tag: '113 Terms' },
  { title: 'Knowledge Hub', sub: 'Monthly Archive · Oct & Nov 2026', tag: `+${QUIZ_DEMO_DATA.xpReward} XP` },
  {
    title: 'Sabah Future Gen',
    sub: `${RESET2030_METRICS.projectCount} Generation Projects`,
    tag: '2027–2033',
  },
] as const;

export const DesktopPwaMockup: React.FC<DesktopPwaMockupProps> = ({
  hubTitle,
  capCounter,
  opacity,
  shiftX,
  scale,
  rotateY,
}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 1120,
      height: 640,
      marginLeft: -560,
      marginTop: -370,
      opacity,
      transform: `perspective(1600px) translate3d(${shiftX}px, 0px, -80px) scale(${scale}) rotateY(${rotateY}deg)`,
    }}
  >
    <Interactive.Div
      name="Desktop PWA Frame"
      style={{
        width: 1120,
        height: 640,
        borderRadius: 24,
        backgroundColor: BRAND.white,
        border: `1.5px solid ${BRAND.slate300}`,
        boxShadow: '0 36px 90px rgba(15, 23, 42, 0.14), 0 0 40px rgba(5, 150, 105, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Browser Chrome */}
      <div
        style={{
          height: 46,
          backgroundColor: BRAND.ground,
          borderBottom: `1px solid ${BRAND.slate200}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {['#ef4444', '#f59e0b', BRAND.emeraldBright].map((dotColor) => (
            <div key={dotColor} style={{ width: 11, height: 11, borderRadius: 99, backgroundColor: dotColor }} />
          ))}
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 700, color: BRAND.inkMuted, letterSpacing: '-0.01em' }}>
          SESI · Sabah Electricity Supply Industry
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: 700, color: BRAND.emerald }}>
          Web &amp; Mobile
        </div>
      </div>

      {/* Desktop Dashboard Content */}
      <div
        style={{
          flex: 1,
          padding: '28px 34px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          background: `linear-gradient(135deg, ${BRAND.ground} 0%, ${BRAND.groundMid} 55%, ${BRAND.groundEnd} 100%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Img src={staticFile('logo.png')} style={{ width: 38, height: 38, borderRadius: 10 }} />
            <div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 20, fontWeight: 800, color: BRAND.emerald }}>
                SESI
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: BRAND.inkSubtle }}>
                Sabah Electricity Supply Industry
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Home', 'Dictionary', 'Knowledge Hub', 'My Profile'].map((tab, i) => (
              <div
                key={tab}
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '8px 15px',
                  borderRadius: 12,
                  backgroundColor: i === 0 ? BRAND.emeraldSoft : BRAND.white,
                  color: i === 0 ? '#065f46' : BRAND.inkMuted,
                  border: i === 0 ? '1px solid #6ee7b7' : `1px solid ${BRAND.slate200}`,
                }}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, flex: 1 }}>
          <div
            style={{
              backgroundColor: BRAND.cardBg,
              borderRadius: 20,
              border: `1px solid ${BRAND.slate200}`,
              boxShadow: '0 8px 28px rgba(15, 23, 42, 0.06)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 999,
                  backgroundColor: BRAND.emeraldSoft,
                  color: '#065f46',
                  fontFamily: FONT_SANS,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ReSET2030 &amp; IBR
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 28, fontWeight: 800, color: BRAND.ink, marginTop: 14 }}>
                {hubTitle}
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 15, color: BRAND.inkMuted, marginTop: 8, lineHeight: 1.5 }}>
                Regulatory terms, monthly quizzes, and Sabah 2030 generation plans.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: BRAND.ground,
                  borderRadius: 14,
                  padding: '14px 16px',
                  border: `1px solid ${BRAND.slate200}`,
                }}
              >
                <div style={{ fontFamily: FONT_MONO, fontSize: 24, fontWeight: 700, color: BRAND.emerald, fontVariantNumeric: 'tabular-nums' }}>
                  {capCounter.toLocaleString()} MW
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: BRAND.inkSubtle, marginTop: 4 }}>
                  Dependable Capacity
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#fffbeb',
                  borderRadius: 14,
                  padding: '14px 16px',
                  border: '1px solid #fde68a',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT_MONO, fontSize: 24, fontWeight: 700, color: '#d97706' }}>
                  <FlameIcon size={24} color="#d97706" />
                  <span>{QUIZ_DEMO_DATA.streakDays} Days</span>
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: '#92400e', marginTop: 4 }}>
                  Active Learning Streak
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: BRAND.cardBg,
              borderRadius: 20,
              border: `1px solid ${BRAND.slate200}`,
              boxShadow: '0 8px 28px rgba(15, 23, 42, 0.06)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: 800, color: BRAND.ink }}>
              Quick Modules
            </div>
            {QUICK_MODULES.map((item) => (
              <div
                key={item.title}
                style={{
                  backgroundColor: BRAND.ground,
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: `1px solid ${BRAND.slate200}`,
                }}
              >
                <div>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: 700, color: BRAND.ink }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: BRAND.inkSubtle, marginTop: 2 }}>
                    {item.sub}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#065f46',
                    backgroundColor: BRAND.emeraldSoft,
                    padding: '4px 10px',
                    borderRadius: 999,
                  }}
                >
                  {item.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Interactive.Div>
  </div>
);
