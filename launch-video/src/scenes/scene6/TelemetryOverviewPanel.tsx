import React from 'react';
import { Interactive } from 'remotion';
import { BRAND, RESET2030_METRICS } from '../../data/sesiData';
import { FONT_MONO, FONT_SANS } from '../../motion/fonts';

type TelemetryOverviewPanelProps = {
  readonly capMW: number;
  readonly peakMW: number;
  readonly reservePct: number;
  readonly projectCount: number;
  readonly opacity: number;
  readonly translateY: number;
};

export const TelemetryOverviewPanel: React.FC<TelemetryOverviewPanelProps> = ({
  capMW,
  peakMW,
  reservePct,
  projectCount,
  opacity,
  translateY,
}) => (
  <Interactive.Div
    name="Telemetry Summary"
    style={{
      position: 'absolute',
      inset: 0,
      paddingLeft: 34,
      borderLeft: '2px solid rgba(5, 150, 105, 0.35)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 28,
      opacity,
      transform: `translateY(${translateY}px)`,
    }}
  >
    <div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: 700, color: BRAND.emerald }}>
        Dependable Capacity
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 62,
          fontWeight: 700,
          color: BRAND.ink,
          lineHeight: 1.05,
          marginTop: 6,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {capMW.toLocaleString()} MW
      </div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: 500, color: BRAND.inkMuted, marginTop: 6 }}>
        West Coast {RESET2030_METRICS.westCoastMW.toLocaleString()} MW · East Coast{' '}
        {RESET2030_METRICS.eastCoastMW.toLocaleString()} MW
      </div>
    </div>

    <div style={{ height: 1, backgroundColor: 'rgba(15, 23, 42, 0.1)' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24 }}>
      <div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: 600, color: BRAND.inkSubtle }}>
          Peak Demand
        </div>
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 32,
            fontWeight: 700,
            color: BRAND.ink,
            marginTop: 4,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {peakMW.toLocaleString()} MW
        </div>
      </div>

      <div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: 700, color: BRAND.emerald }}>
          2030 Target
        </div>
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 32,
            fontWeight: 700,
            color: BRAND.emerald,
            marginTop: 4,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {reservePct}% Reserve
        </div>
      </div>
    </div>

    <div style={{ height: 1, backgroundColor: 'rgba(15, 23, 42, 0.1)' }} />

    <div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 22, fontWeight: 800, color: BRAND.ink }}>
        {projectCount} Planned Generation Projects
      </div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: 500, color: BRAND.inkMuted, marginTop: 6 }}>
        {RESET2030_METRICS.fuelSummary}
      </div>
    </div>
  </Interactive.Div>
);
