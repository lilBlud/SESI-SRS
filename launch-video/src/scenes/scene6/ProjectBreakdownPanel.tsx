import React from 'react';
import { Interactive } from 'remotion';
import {
  FUEL_DISPLAY_META,
  FUTURE_GEN_PROJECTS,
  WATCH_TONE_STYLES,
} from '../../data/futureGenData';
import { BRAND } from '../../data/sesiData';
import { FONT_MONO, FONT_SANS } from '../../motion/fonts';

type BreakdownProps = {
  readonly project: (typeof FUTURE_GEN_PROJECTS)[number];
  readonly opacity: number;
  readonly translateY: number;
};

/**
 * Mirrors ProjectBreakdownCard.jsx from mobile-frontend with clean 1080p typography.
 */
export const ProjectBreakdownPanel: React.FC<BreakdownProps> = ({
  project,
  opacity,
  translateY,
}) => {
  const fuel = FUEL_DISPLAY_META[project.fuelType] ?? FUEL_DISPLAY_META.gas;
  const watchTone = project.watchItem
    ? WATCH_TONE_STYLES[project.watchItem.tone] ?? WATCH_TONE_STYLES.amber
    : null;

  return (
    <Interactive.Div
      name={`Project Breakdown (${project.name})`}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        border: `1.5px solid ${BRAND.slate300}`,
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
        overflow: 'hidden',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          padding: '15px 24px',
          backgroundColor: BRAND.ground,
          borderBottom: `1px solid ${BRAND.slate200}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              backgroundColor: fuel.color,
              color: BRAND.white,
              fontFamily: FONT_MONO,
              fontSize: 15,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {project.pinNumber}
          </span>
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.07em',
              color: BRAND.inkMuted,
              textTransform: 'uppercase',
            }}
          >
            Project Breakdown
          </span>
        </div>

        <span
          style={{
            padding: '4px 12px',
            borderRadius: 999,
            backgroundColor: BRAND.white,
            border: `1px solid ${BRAND.slate300}`,
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 700,
            color: BRAND.slate700,
          }}
        >
          {project.pinNumber} of {FUTURE_GEN_PROJECTS.length}
        </span>
      </div>

      <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 30, fontWeight: 800, color: BRAND.ink, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
              {project.name}
            </div>
            <span
              style={{
                padding: '6px 14px',
                borderRadius: 10,
                backgroundColor: BRAND.ink,
                color: BRAND.white,
                fontFamily: FONT_MONO,
                fontSize: 16,
                fontWeight: 800,
                whiteSpace: 'nowrap',
              }}
            >
              {project.capacity}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 8,
                backgroundColor: `${fuel.color}15`,
                color: fuel.color,
                fontFamily: FONT_SANS,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {fuel.label}
            </span>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: 8,
                backgroundColor: BRAND.slate100,
                color: '#475569',
                fontFamily: FONT_SANS,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {project.stage}
            </span>
          </div>

          <div style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 600, color: BRAND.inkMuted, marginTop: 8 }}>
            {project.plantType}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Target COD', value: project.cod },
            { label: 'Equity Split', value: project.equity },
            { label: 'Location', value: project.location },
            { label: 'Grid Region', value: project.region },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                padding: '10px 13px',
                borderRadius: 12,
                backgroundColor: BRAND.ground,
                border: `1px solid ${BRAND.slate200}`,
              }}
            >
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: BRAND.inkSubtle }}>
                {metric.label}
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: 800, color: BRAND.ink, marginTop: 3 }}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: '12px 14px',
            borderRadius: 14,
            backgroundColor: BRAND.ground,
            border: `1px solid ${BRAND.slate200}`,
          }}
        >
          <div style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: BRAND.inkSubtle }}>
            Status &amp; Way Forward
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 500, color: BRAND.slate700, lineHeight: 1.45, marginTop: 4 }}>
            {project.status}
          </div>
        </div>

        {project.watchItem && watchTone && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              backgroundColor: watchTone.bg,
              border: `1px solid ${watchTone.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 800, color: watchTone.titleColor }}>
                {project.watchItem.title}
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  backgroundColor: watchTone.badgeBg,
                  color: watchTone.badgeText,
                  fontFamily: FONT_SANS,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {project.watchItem.badge}
              </span>
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 500, color: watchTone.titleColor }}>
              {project.watchItem.text}
            </div>
          </div>
        )}
      </div>
    </Interactive.Div>
  );
};
