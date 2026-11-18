import React from 'react';
import { CrownIcon, FlameIcon } from '../../components/Icons';
import { BRAND } from '../../data/sesiData';
import { FONT_SANS } from '../../motion/fonts';

export interface PodiumTierStyle {
  readonly avatarSize: number;
  readonly avatarFontSize: number;
  readonly avatarBg: string;
  readonly avatarBorder: string;
  readonly avatarColor: string;
  readonly avatarShadow: string;
  readonly nameSize: number;
  readonly nameWeight: number;
  readonly nameColor: string;
  readonly plinthRadius: number;
  readonly plinthBg: string;
  readonly plinthTopBorder: string;
  readonly plinthSideBorder: string;
  readonly paddingTop: number;
  readonly scoreSize: number;
  readonly scoreColor: string;
  readonly metaSize: number;
  readonly metaColor: string;
  readonly flameColor: string;
  readonly showCrown?: boolean;
}

type PodiumColumnProps = {
  readonly rank: 1 | 2 | 3;
  readonly name: string;
  readonly initials: string;
  readonly streak: number;
  readonly score: number;
  readonly barHeight: number;
  readonly avatarOpacity: number;
  readonly styleConfig: PodiumTierStyle;
  readonly crownFloatY?: number;
  readonly crownScale?: number;
  readonly goldSheen?: number;
};

export const PodiumColumn: React.FC<PodiumColumnProps> = ({
  rank,
  name,
  initials,
  streak,
  score,
  barHeight,
  avatarOpacity,
  styleConfig: s,
  crownFloatY = 0,
  crownScale = 1,
  goldSheen,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ opacity: avatarOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }}>
      {s.showCrown && (
        <div style={{ marginBottom: 6, transform: `translateY(${crownFloatY}px) scale(${crownScale})` }}>
          <CrownIcon size={32} color="#d97706" />
        </div>
      )}
      <div style={{ fontFamily: FONT_SANS, fontSize: s.nameSize, fontWeight: s.nameWeight, color: s.nameColor, marginBottom: 10 }}>
        {name}
      </div>
      <div
        style={{
          width: s.avatarSize,
          height: s.avatarSize,
          borderRadius: 999,
          background: s.avatarBg,
          border: s.avatarBorder,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_SANS,
          fontSize: s.avatarFontSize,
          fontWeight: 800,
          color: s.avatarColor,
          boxShadow: s.avatarShadow,
        }}
      >
        {initials}
      </div>
    </div>

    <div
      style={{
        width: '100%',
        height: barHeight,
        borderTopLeftRadius: s.plinthRadius,
        borderTopRightRadius: s.plinthRadius,
        background: s.plinthBg,
        borderTop: s.plinthTopBorder,
        borderLeft: s.plinthSideBorder,
        borderRight: s.plinthSideBorder,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: s.paddingTop,
        overflow: 'hidden',
        position: goldSheen !== undefined ? 'relative' : undefined,
      }}
    >
      {goldSheen !== undefined && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(115deg, transparent ${goldSheen - 18}%, rgba(255, 255, 255, 0.45) ${goldSheen}%, transparent ${goldSheen + 18}%)`,
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: s.scoreSize,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          fontVariantNumeric: 'tabular-nums',
          color: s.scoreColor,
          lineHeight: 1.05,
        }}
      >
        {score.toLocaleString()}
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: s.metaSize,
          fontWeight: 700,
          color: s.metaColor,
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <span>#{rank}</span>
        <span>·</span>
        <FlameIcon size={rank === 1 ? 16 : 15} color={s.flameColor} />
        <span>{streak}d</span>
      </div>
    </div>
  </div>
);

export const PODIUM_TIER_STYLES: Record<1 | 2 | 3, PodiumTierStyle> = {
  1: {
    avatarSize: 78,
    avatarFontSize: 25,
    avatarBg: 'linear-gradient(145deg, #fde047, #f59e0b)',
    avatarBorder: '3px solid #d97706',
    avatarColor: '#78350f',
    avatarShadow: '0 10px 24px rgba(245, 158, 11, 0.30)',
    nameSize: 22,
    nameWeight: 800,
    nameColor: BRAND.ink,
    plinthRadius: 20,
    plinthBg: 'linear-gradient(180deg, #fde68a 0%, #fcd34d 100%)',
    plinthTopBorder: '3px solid #d97706',
    plinthSideBorder: '1px solid #f59e0b',
    paddingTop: 26,
    scoreSize: 38,
    scoreColor: '#451a03',
    metaSize: 15,
    metaColor: '#92400e',
    flameColor: '#b45309',
    showCrown: true,
  },
  2: {
    avatarSize: 66,
    avatarFontSize: 21,
    avatarBg: 'linear-gradient(145deg, #f1f5f9, #cbd5e1)',
    avatarBorder: '2px solid #94a3b8',
    avatarColor: '#1e293b',
    avatarShadow: '0 8px 18px rgba(100, 116, 139, 0.22)',
    nameSize: 19,
    nameWeight: 700,
    nameColor: BRAND.slate800,
    plinthRadius: 18,
    plinthBg: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
    plinthTopBorder: '3px solid #94a3b8',
    plinthSideBorder: `1px solid ${BRAND.slate300}`,
    paddingTop: 22,
    scoreSize: 30,
    scoreColor: BRAND.ink,
    metaSize: 14,
    metaColor: '#475569',
    flameColor: '#d97706',
  },
  3: {
    avatarSize: 64,
    avatarFontSize: 20,
    avatarBg: 'linear-gradient(145deg, #fed7aa, #fb923c)',
    avatarBorder: '2px solid #ea580c',
    avatarColor: '#7c2d12',
    avatarShadow: '0 8px 18px rgba(234, 88, 12, 0.22)',
    nameSize: 19,
    nameWeight: 700,
    nameColor: BRAND.slate800,
    plinthRadius: 18,
    plinthBg: 'linear-gradient(180deg, #ffedd5 0%, #fed7aa 100%)',
    plinthTopBorder: '3px solid #ea580c',
    plinthSideBorder: '1px solid #fdba74',
    paddingTop: 18,
    scoreSize: 28,
    scoreColor: '#431407',
    metaSize: 14,
    metaColor: '#9a3412',
    flameColor: '#c2410c',
  },
};
