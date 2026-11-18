import React from 'react';
import { Interactive } from 'remotion';
import { BRAND } from '../data/sesiData';
import { FONT_SANS } from '../motion/fonts';

type SceneCaptionProps = {
  readonly name: string;
  readonly prefix: string;
  readonly accent: string;
  readonly secondaryPrefix?: string;
  readonly secondaryAccent?: string;
  readonly crossfadeOpacity?: number;
  readonly opacity: number;
  readonly driftX?: number;
  readonly offsetY?: number;
  readonly fontSize?: number;
  readonly style?: React.CSSProperties;
};

/**
 * Shared emerald-accented editorial caption supporting single or dual-beat crossfades.
 */
export const SceneCaption: React.FC<SceneCaptionProps> = ({
  name,
  prefix,
  accent,
  secondaryPrefix,
  secondaryAccent,
  crossfadeOpacity = 0,
  opacity,
  driftX = 0,
  offsetY = 0,
  fontSize = 60,
  style,
}) => {
  const hasSecondary = Boolean(secondaryPrefix || secondaryAccent);
  const primaryOp = hasSecondary ? 1 - crossfadeOpacity : 1;

  const baseTextStyle: React.CSSProperties = {
    fontFamily: FONT_SANS,
    fontSize,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: BRAND.ink,
    lineHeight: 1.15,
  };

  return (
    <div
      style={{
        textAlign: 'center',
        opacity,
        transform: `translate(${driftX}px, ${offsetY}px)`,
        position: hasSecondary ? 'relative' : undefined,
        minHeight: hasSecondary ? Math.round(fontSize * 1.3) : undefined,
        ...style,
      }}
    >
      <Interactive.Div
        name={name}
        style={{
          ...baseTextStyle,
          ...(hasSecondary ? { position: 'absolute', inset: 0, opacity: primaryOp } : undefined),
        }}
      >
        {prefix} <span style={{ color: BRAND.emerald }}>{accent}</span>
      </Interactive.Div>

      {hasSecondary && (
        <div
          style={{
            ...baseTextStyle,
            position: 'absolute',
            inset: 0,
            opacity: crossfadeOpacity,
          }}
        >
          {secondaryPrefix} <span style={{ color: BRAND.emerald }}>{secondaryAccent}</span>
        </div>
      )}
    </div>
  );
};
