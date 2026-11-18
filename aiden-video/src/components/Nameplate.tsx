import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { accelExit, progress, softLand } from '../motion';
import { FONT_SANS, PALETTE } from '../theme';

interface NameplateProps {
  readonly fullName: string;
  readonly roleLine: string;
}

/**
 * Editorial documentary lower-left nameplate (no boxy HUD chrome/rounded pill clutter).
 */
export const Nameplate: React.FC<NameplateProps> = ({ fullName, roleLine }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const barIn = softLand(progress(frame, 10, 0));
  const textIn = softLand(progress(frame, 14, 4));
  const exitP = accelExit(progress(frame, 10, Math.max(0, durationInFrames - 10)));

  const opacity = Math.min(interpolate(textIn, [0, 0.3, 1], [0, 0.85, 1]), 1 - exitP);
  const slideX = interpolate(textIn, [0, 1], [-22, 0]) - exitP * 24;
  const barScaleY = Math.min(barIn, 1 - exitP * 0.9);

  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        bottom: 256,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        pointerEvents: 'none',
        padding: '10px 34px 10px 16px',
        background:
          'linear-gradient(90deg, rgba(6, 16, 34, 0.66) 0%, rgba(6, 16, 34, 0.36) 72%, rgba(6, 16, 34, 0) 100%)',
        borderRadius: 4,
      }}
    >
      <div
        style={{
          width: 4,
          height: 52,
          borderRadius: 2,
          backgroundColor: PALETTE.green,
          transform: `scaleY(${barScaleY})`,
          transformOrigin: 'top',
          flexShrink: 0,
        }}
      />
      <div
        style={{
          opacity,
          transform: `translateX(${slideX}px)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 27,
            fontWeight: 600,
            color: '#F8FAFC',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            textShadow: '0 2px 10px rgba(4, 10, 22, 0.75)',
          }}
        >
          {fullName}
        </div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 19,
            fontWeight: 400,
            color: 'rgba(226, 232, 240, 0.90)',
            lineHeight: 1.2,
            textShadow: '0 2px 10px rgba(4, 10, 22, 0.75)',
          }}
        >
          {roleLine}
        </div>
      </div>
    </div>
  );
};
