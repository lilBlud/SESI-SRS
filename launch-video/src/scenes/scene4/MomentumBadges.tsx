import React from 'react';
import { Interactive } from 'remotion';
import { FlameIcon } from '../../components/Icons';
import { BRAND, QUIZ_DEMO_DATA } from '../../data/sesiData';
import { FONT_MONO, FONT_SANS } from '../../motion/fonts';

type MomentumBadgesProps = {
  readonly streakOp: number;
  readonly streakY: number;
  readonly xpBadgeOp: number;
  readonly xpBadgeScale: number;
  readonly scoreVal: number;
};

export const MomentumBadges: React.FC<MomentumBadgesProps> = ({
  streakOp,
  streakY,
  xpBadgeOp,
  xpBadgeScale,
  scoreVal,
}) => (
  <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 24 }}>
    <div style={{ opacity: streakOp, transform: `translateY(${streakY}px)` }}>
      <Interactive.Div
        name="Streak Badge"
        style={{
          padding: '18px 32px',
          borderRadius: 24,
          backgroundColor: '#fffbeb',
          border: '1.5px solid #fcd34d',
          boxShadow: '0 16px 40px rgba(245, 158, 11, 0.14)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FlameIcon size={30} color="#d97706" />
        </div>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 28, fontWeight: 700, color: '#92400e', lineHeight: 1.1 }}>
            {QUIZ_DEMO_DATA.streakDays} Day Streak
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 700, color: '#d97706', marginTop: 3 }}>
            Daily Check-in · Active
          </div>
        </div>
      </Interactive.Div>
    </div>

    <div style={{ opacity: xpBadgeOp, transform: `scale(${xpBadgeScale})` }}>
      <Interactive.Div
        name="XP Score Badge"
        style={{
          padding: '18px 36px',
          borderRadius: 24,
          backgroundColor: '#ecfdf5',
          border: `1.5px solid ${BRAND.emerald}`,
          boxShadow: '0 16px 44px rgba(5, 150, 105, 0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 999,
            backgroundColor: BRAND.emerald,
            fontFamily: FONT_MONO,
            fontSize: 18,
            fontWeight: 700,
            color: BRAND.white,
          }}
        >
          +{QUIZ_DEMO_DATA.xpReward} XP
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 34, fontWeight: 700, color: BRAND.ink }}>
          {scoreVal.toLocaleString()} pts
        </div>
      </Interactive.Div>
    </div>
  </div>
);
