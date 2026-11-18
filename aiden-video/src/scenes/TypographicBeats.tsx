import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { accelExit, progress, snapSettle, softInOut, softLand } from '../motion';
import { FONT_SANS, PALETTE } from '../theme';
import { BEAT_DURATIONS } from '../timeline';

/* -------------------------------------------------------------------------- */
/* Clean Geometric Sabah Mountain Peak (SVG mark matching official logo)       */
/* -------------------------------------------------------------------------- */
const MountainPeakVectors: React.FC<{
  readonly navyColor?: string;
  readonly greenColor?: string;
  readonly height?: number;
}> = ({
  navyColor = PALETTE.navy,
  greenColor = PALETTE.green,
  height = 84,
}) => (
  <svg
    width={height * 1.95}
    height={height}
    viewBox="0 0 195 100"
    fill="none"
    style={{ display: 'block' }}
  >
    <path
      d="M8 82 L44 36 L60 54 L94 12 L126 52 L112 68 L94 46 L61 84 L44 64 L22 90 Z"
      fill={navyColor}
    />
    <path
      d="M64 94 L126 20 L186 94 L158 94 L126 54 L92 94 Z"
      fill={greenColor}
    />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* 1. TurnPartA - "Too critical" -> "for folders"                             */
/* -------------------------------------------------------------------------- */
export const TurnPartAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const w1 = softLand(progress(frame, 14, 6));
  const w2 = softLand(progress(frame, 14, 16));

  const exitP = accelExit(progress(frame, 12, durationInFrames - 12));
  const driftX = interpolate(frame, [0, durationInFrames], [0, -14]);
  const exitShift = exitP * -72;

  const y1 = (1 - w1) * 32;
  const blur1 = (1 - w1) * 5;
  const y2 = (1 - w2) * 36;
  const blur2 = (1 - w2) * 6;
  const beamX = interpolate(softLand(progress(frame, 16, 0)), [0, 1], [-18, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.surfaceOffWhite,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-14%',
          top: '-20%',
          width: '48%',
          height: '150%',
          background:
            'linear-gradient(155deg, rgba(13, 59, 122, 0.065) 0%, rgba(47, 166, 90, 0.04) 100%)',
          transform: `translateX(${beamX}%) skewX(-18deg)`,
        }}
      />

      <div
        style={{
          transform: `translateX(${driftX + exitShift}px)`,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 24,
          padding: '0 80px',
          marginTop: -12,
        }}
      >
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 92,
            fontWeight: 500,
            letterSpacing: '-0.035em',
            color: PALETTE.inkSlate,
            transform: `translateY(${y1}px)`,
            filter: blur1 > 0.2 ? `blur(${blur1.toFixed(1)}px)` : undefined,
            opacity: interpolate(w1, [0, 0.4, 1], [0.15, 0.9, 1]),
          }}
        >
          Too critical
        </span>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 92,
            fontWeight: 500,
            letterSpacing: '-0.035em',
            color: PALETTE.navy,
            transform: `translateY(${y2}px)`,
            filter: blur2 > 0.2 ? `blur(${blur2.toFixed(1)}px)` : undefined,
            opacity: interpolate(w2, [0, 0.3, 1], [0, 0.85, 1]),
          }}
        >
          for folders
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. TurnPartB - Deep Midnight Stage -> AIDEN Wordmark Reveal                */
/* -------------------------------------------------------------------------- */
export const TurnPartBScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const markSnap = snapSettle(progress(frame, 20, 10));
  const subLand = softLand(progress(frame, 16, 24));
  const markScale = interpolate(markSnap, [0, 1], [1.34, 1.0]);
  const push = interpolate(frame, [0, durationInFrames], [1.0, 1.06]);
  const lightSweep = interpolate(frame, [0, 48], [-30, 120], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.bgMidnight,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 68% 55% at 50% 42%, rgba(47, 166, 90, 0.16) 0%, rgba(13, 59, 122, 0.14) 48%, rgba(6, 19, 38, 0) 80%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(112deg, transparent ${lightSweep - 18}%, rgba(110, 231, 157, 0.08) ${lightSweep}%, transparent ${lightSweep + 18}%)`,
        }}
      />

      <div
        style={{
          transform: `scale(${push})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <div
          style={{
            transform: `scale(${markScale})`,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            filter:
              markSnap < 0.9
                ? `blur(${((1 - markSnap) * 8).toFixed(1)}px)`
                : undefined,
          }}
        >
          <MountainPeakVectors
            navyColor="#3B82F6"
            greenColor={PALETTE.emeraldAccent}
            height={78}
          />
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 102,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: PALETTE.textOnDark,
              lineHeight: 1,
            }}
          >
            AIDEN
          </span>
        </div>

        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 30,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'rgba(226, 232, 240, 0.84)',
            transform: `translateY(${(1 - subLand) * 18}px)`,
            opacity: interpolate(subLand, [0, 0.35, 1], [0, 0.8, 1]),
          }}
        >
          Centralised ISO Document Management &amp; Audit Control
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. BridgeKeywordBeat - Kinetic proof punctuation between interview shots   */
/* -------------------------------------------------------------------------- */
interface BridgeKeywordProps {
  readonly mode: 'status' | 'notify' | 'upload';
}

const BridgeStage: React.FC<{
  readonly bgColor: string;
  readonly shiftX: number;
  readonly gap: number;
  readonly alignItems?: string;
  readonly children: React.ReactNode;
}> = ({ bgColor, shiftX, gap, alignItems = 'center', children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: bgColor,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}
  >
    <div style={{ transform: `translateX(${shiftX}px)`, display: 'flex', gap, alignItems }}>
      {children}
    </div>
  </AbsoluteFill>
);

const STATUS_TOKENS = [
  { word: 'Draft', delay: 8, color: PALETTE.inkMuted },
  { word: 'Verify', delay: 13, color: PALETTE.navy },
  { word: 'Approve', delay: 18, color: PALETTE.green },
] as const;

const UPLOAD_FORMATS = [
  { label: 'PDF', color: PALETTE.navy },
  { label: 'DOCX', color: '#334155' },
  { label: 'XLSX', color: PALETTE.green },
] as const;

export const BridgeKeywordBeat: React.FC<BridgeKeywordProps> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const driftX = interpolate(frame, [0, durationInFrames], [10, -18]);
  const exitShift = accelExit(progress(frame, 6, durationInFrames - 6)) * -80;
  const stageShiftX = driftX + exitShift;

  if (mode === 'status') {
    return (
      <BridgeStage bgColor={PALETTE.surfaceOffWhite} shiftX={stageShiftX} gap={28}>
        {STATUS_TOKENS.map((t, idx) => {
          const p = softLand(progress(frame, 8, t.delay));
          return (
            <React.Fragment key={t.word}>
              {idx > 0 && (
                <span style={{ fontFamily: FONT_SANS, fontSize: 58, fontWeight: 400, color: PALETTE.slateLight, opacity: frame >= t.delay ? p : 0 }}>
                  &rarr;
                </span>
              )}
              <span
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 88,
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  color: t.color,
                  transform: `translateY(${(1 - p) * 28}px)`,
                  opacity: frame >= t.delay ? interpolate(p, [0, 0.25, 1], [0.2, 0.9, 1]) : 0,
                  filter: p < 0.85 ? `blur(${((1 - p) * 4).toFixed(1)}px)` : undefined,
                }}
              >
                {t.word}
              </span>
            </React.Fragment>
          );
        })}
      </BridgeStage>
    );
  }

  if (mode === 'notify') {
    const p1 = softLand(progress(frame, 12, 8));
    const pArrow = softLand(progress(frame, 12, 14));
    const p2 = snapSettle(progress(frame, 14, 18));

    return (
      <BridgeStage bgColor={PALETTE.bgMidnightAlt} shiftX={stageShiftX} gap={32}>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 78,
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: PALETTE.slateLight,
            transform: `translateY(${(1 - p1) * 20}px)`,
            opacity: interpolate(p1, [0, 0.4, 1], [0.2, 0.9, 1]),
          }}
        >
          Submit
        </span>
        <div style={{ width: interpolate(pArrow, [0, 1], [0, 96]), height: 4, backgroundColor: PALETTE.emeraldAccent, borderRadius: 2 }} />
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 82,
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: PALETTE.textOnDark,
            transform: `scale(${interpolate(p2, [0, 1], [1.14, 1.0])})`,
            opacity: frame >= 18 ? 1 : 0,
          }}
        >
          Auto-notify
        </span>
      </BridgeStage>
    );
  }

  return (
    <BridgeStage bgColor={PALETTE.surfaceOffWhite} shiftX={stageShiftX} gap={54} alignItems="baseline">
      {UPLOAD_FORMATS.map((fmt, idx) => {
        const startFrame = idx * 4 + 10;
        const p = snapSettle(progress(frame, 12, startFrame));
        return (
          <span
            key={fmt.label}
            style={{
              fontFamily: FONT_SANS,
              fontSize: 86,
              fontWeight: 500,
              letterSpacing: '-0.03em',
              color: fmt.color,
              transform: `scale(${interpolate(p, [0, 1], [1.22, 1.0])})`,
              opacity: frame >= startFrame ? 1 : 0,
            }}
          >
            {fmt.label}
          </span>
        );
      })}
    </BridgeStage>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. ClosingLockupScene - Crisp short resolve <= 1.4s hold (Passes Gate G3)  */
/* -------------------------------------------------------------------------- */
const CLOSING_LOGOS = [
  { src: 'logos/se-logo.png', height: 82, startFrame: 10 },
  { src: 'logos/sns-logo.png', height: 106, startFrame: 14 },
  { src: 'logos/aiden-logo.png', height: 62, startFrame: 18 },
] as const;

export const ClosingLockupScene: React.FC = () => {
  const frame = useCurrentFrame();

  const sheen = interpolate(softInOut(progress(frame, 34, 20)), [0, 1], [-25, 125]);
  const gentleCreep = interpolate(frame, [0, BEAT_DURATIONS.close], [1.0, 0.985], {
    extrapolateRight: 'clamp',
  });
  const dividerOp = snapSettle(progress(frame, 18, 14));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.surfaceClosing,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 70% at 32% 28%, rgba(255, 255, 255, 1) 0%, rgba(226, 234, 245, 0.55) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(110deg, transparent ${sheen - 14}%, rgba(255, 255, 255, 0.72) ${sheen}%, transparent ${sheen + 14}%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          transform: `scale(${gentleCreep})`,
          display: 'flex',
          alignItems: 'center',
          gap: 56,
        }}
      >
        {CLOSING_LOGOS.map((logo, idx) => {
          const p = snapSettle(progress(frame, 18, logo.startFrame));
          return (
            <React.Fragment key={logo.src}>
              {idx > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 66,
                    backgroundColor: 'rgba(13, 59, 122, 0.16)',
                    opacity: dividerOp,
                  }}
                />
              )}
              <div
                style={{
                  transform: `scale(${interpolate(p, [0, 1], [1.22, 1.0])})`,
                  opacity: interpolate(p, [0, 0.25, 1], [0.2, 0.9, 1]),
                }}
              >
                <Img
                  src={staticFile(logo.src)}
                  style={{ height: logo.height, width: 'auto', objectFit: 'contain' }}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
