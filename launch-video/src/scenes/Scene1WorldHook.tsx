import React from 'react';
import { Interactive, useCurrentFrame, interpolate } from 'remotion';
import { TopographicWorld } from '../components/TopographicWorld';
import { BRAND } from '../data/sesiData';
import { Eases, easeRange } from '../motion/eases';
import { FONT_SANS } from '../motion/fonts';
import { SCENE_TIMING } from '../timeline';

type Scene1Props = {
  readonly line1Prefix: string;
  readonly line1Accent: string;
  readonly line2Prefix: string;
  readonly line2Accent: string;
};

type MaskedWordProps = {
  readonly text: string;
  readonly frame: number;
  readonly startFrame: number;
  readonly color?: string;
};

const MaskedWord: React.FC<MaskedWordProps> = ({ text, frame, startFrame, color }) => (
  <span style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: 8 }}>
    <span
      style={{
        display: 'inline-block',
        color,
        opacity: easeRange(frame, startFrame, startFrame + 6, 0, 1, Eases.softLand),
        transform: `translateY(${easeRange(frame, startFrame, startFrame + 14, 115, 0, Eases.snapSettle)}%)`,
      }}
    >
      {text}
    </span>
  </span>
);

const Scene1Inner: React.FC<Scene1Props> = ({
  line1Prefix,
  line1Accent,
  line2Prefix,
  line2Accent,
}) => {
  const frame = useCurrentFrame();

  const pulseDraw = easeRange(frame, 0, 38, 2600, 0, Eases.snapSettle);
  const pulseGlow = easeRange(frame, 0, 20, 0.9, 1, Eases.softLand);

  const terrainIntensity = easeRange(frame, 12, 55, 0.2, 1, Eases.softLand);
  const terrainTilt = easeRange(frame, 18, 160, 14, 4, Eases.glide);
  const cameraZoom = easeRange(frame, 0, 162, 1.18, 1.0, Eases.glide);
  const cameraX = easeRange(frame, 0, 180, -36, 18, Eases.cruise);

  const copyAInOp = easeRange(frame, 22, 28, 0, 1, Eases.softLand);
  const copyAScale = easeRange(frame, 22, 92, 0.98, 1.035, Eases.glide);
  const copyAOutClip = easeRange(frame, 86, 98, 0, 100, Eases.accelExit);
  const copyAOutY = easeRange(frame, 86, 98, 0, -34, Eases.accelExit);
  const showCopyA = frame >= 20 && frame < 100 && copyAInOp >= 0;

  const copyBInOp = easeRange(frame, 96, 102, 0, 1, Eases.softLand);
  const copyBScale = easeRange(frame, 96, 168, 0.97, 1.045, Eases.glide);
  const copyBOutY = easeRange(frame, 156, 172, 0, -52, Eases.accelExit);
  const copyBOutOp = easeRange(frame, 158, 172, 1, 0, Eases.accelExit);
  const showCopyB = frame >= 95 && frame <= 174;

  const morphT = easeRange(frame, 154, 180, 0, 1, Eases.accelExit);
  const barWidth = interpolate(morphT, [0, 1], [1920, 422]);
  const barHeight = interpolate(morphT, [0, 1], [3.5, 8]);
  const barY = interpolate(morphT, [0, 1], [540, 150]);
  const barOpacity = easeRange(frame, 152, 166, 0, 1, Eases.softLand);

  return (
    <>
      <TopographicWorld
        cameraX={cameraX}
        cameraZoom={cameraZoom}
        tiltX={terrainTilt}
        emeraldIntensity={terrainIntensity}
      />

      {/* Primary Emerald Energy Pulse Line */}
      <svg
        viewBox="0 0 1920 1080"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: interpolate(morphT, [0, 0.6], [pulseGlow, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `scale(${cameraZoom}) translateX(${cameraX * 0.9}px)`,
        }}
        fill="none"
      >
        <defs>
          <filter id="emeraldPulseGlowLight" x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M-60,640 C320,620 560,460 920,520 C1260,575 1520,380 1980,290"
          stroke={BRAND.emerald}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray="2600"
          strokeDashoffset={pulseDraw}
          filter="url(#emeraldPulseGlowLight)"
        />
        {frame <= 154 && (
          <path
            d="M-60,640 C320,620 560,460 920,520 C1260,575 1520,380 1980,290"
            stroke="#6ee7b7"
            strokeWidth={5.5}
            strokeLinecap="round"
            strokeDasharray="160 2600"
            strokeDashoffset={easeRange(frame, 0, 154, 2600, -320, Eases.cruise)}
            opacity={easeRange(frame, 130, 154, 0.9, 0, Eases.softLand)}
          />
        )}
      </svg>

      {/* Copy Beat A: Word-by-word masked kinetic reveal */}
      {showCopyA && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 120px',
            transform: `translateY(${copyAOutY}px) scale(${copyAScale})`,
            clipPath: `inset(0 0 ${copyAOutClip}% 0)`,
          }}
        >
          <Interactive.Div
            name="Hook headline 1"
            style={{
              fontFamily: FONT_SANS,
              fontSize: 108,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: BRAND.ink,
              lineHeight: 1.1,
              textAlign: 'center',
              display: 'flex',
              gap: 28,
              alignItems: 'baseline',
            }}
          >
            {line1Prefix
              .trim()
              .split(/\s+/)
              .map((word, idx) => (
                <MaskedWord key={`${word}-${idx}`} text={word} frame={frame} startFrame={22 + idx * 4} />
              ))}
            <MaskedWord
              text={line1Accent}
              frame={frame}
              startFrame={22 + line1Prefix.trim().split(/\s+/).length * 4}
              color={BRAND.emerald}
            />
          </Interactive.Div>
        </div>
      )}

      {/* Copy Beat B: Word-by-word masked kinetic reveal */}
      {showCopyB && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 120px',
            opacity: copyBOutOp,
            transform: `translateY(${copyBOutY}px) scale(${copyBScale})`,
          }}
        >
          <Interactive.Div
            name="Hook headline 2"
            style={{
              fontFamily: FONT_SANS,
              fontSize: 124,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: BRAND.ink,
              lineHeight: 1.08,
              textAlign: 'center',
              display: 'flex',
              gap: 30,
              alignItems: 'baseline',
            }}
          >
            <MaskedWord text={line2Prefix} frame={frame} startFrame={96} />
            <span style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  opacity: copyBInOp * easeRange(frame, 100, 106, 0, 1, Eases.softLand),
                  transform: `translateY(${easeRange(frame, 100, 114, 115, 0, Eases.snapSettle)}%)`,
                }}
              >
                <span style={{ color: BRAND.emerald }}>{line2Accent}</span>.
              </span>
            </span>
          </Interactive.Div>
        </div>
      )}

      {/* Match-cut carrier bar */}
      {frame >= 152 && (
        <div
          style={{
            position: 'absolute',
            left: 960 - barWidth / 2,
            top: barY,
            width: barWidth,
            height: barHeight,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${BRAND.emerald}, ${BRAND.emeraldBright}, ${BRAND.emerald})`,
            boxShadow: '0 4px 20px rgba(5, 150, 105, 0.45)',
            opacity: barOpacity,
          }}
        />
      )}
    </>
  );
};

export const Scene1WorldHook = Interactive.create({
  Component: Scene1Inner,
  layout: 'absolute-fill',
  schema: {
    line1Prefix: { type: 'string', default: SCENE_TIMING.scene1.props.line1Prefix, description: 'First headline prefix' },
    line1Accent: { type: 'string', default: SCENE_TIMING.scene1.props.line1Accent, description: 'First headline accent' },
    line2Prefix: { type: 'string', default: SCENE_TIMING.scene1.props.line2Prefix, description: 'Second headline prefix' },
    line2Accent: { type: 'string', default: SCENE_TIMING.scene1.props.line2Accent, description: 'Second headline accent' },
  },
});
