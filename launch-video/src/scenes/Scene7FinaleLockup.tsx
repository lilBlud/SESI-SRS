import React from 'react';
import { Img, Interactive, staticFile, useCurrentFrame } from 'remotion';
import { TopographicWorld } from '../components/TopographicWorld';
import { Eases, easeRange } from '../motion/eases';
import { FONT_SANS } from '../motion/fonts';
import { SCENE_TIMING } from '../timeline';

type Scene7Props = {
  readonly title: string;
  readonly subtitle: string;
};

const Scene7Inner: React.FC<Scene7Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame(); // 0..90 local (global 1680..1770)

  // Continuous specular sweep & subtle push settles cleanly at frame 56 -> 34f (1.13s) resolved hold (passes Gate G3)
  const settleFrame = Math.min(frame, 56);

  const logoScale = easeRange(settleFrame, 0, 28, 0.86, 1.0, Eases.snapSettle);
  const logoY = easeRange(settleFrame, 0, 28, 28, 0, Eases.softLand);
  const logoOp = easeRange(settleFrame, 0, 16, 0, 1, Eases.softLand);

  const titleY = easeRange(settleFrame, 12, 36, 22, 0, Eases.softLand);
  const titleOp = easeRange(settleFrame, 12, 26, 0, 1, Eases.softLand);

  const subY = easeRange(settleFrame, 20, 44, 18, 0, Eases.softLand);
  const subOp = easeRange(settleFrame, 20, 36, 0, 1, Eases.softLand);

  const sheen = easeRange(settleFrame, 22, 56, -35, 135, Eases.softInOut);
  const stageZoom = easeRange(settleFrame, 0, 56, 1.035, 1.0, Eases.glide);
  const bgCameraX = easeRange(settleFrame, 0, 56, -80, 0, Eases.softLand);

  return (
    <>
      <TopographicWorld cameraX={bgCameraX} cameraZoom={stageZoom} emeraldIntensity={0.95} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${stageZoom})`,
        }}
      >
        <div
          style={{
            opacity: logoOp,
            transform: `translateY(${logoY}px) scale(${logoScale})`,
            position: 'relative',
          }}
        >
          <Interactive.Div
            name="Finale Logo Card"
            style={{
              width: 310,
              height: 310,
              borderRadius: 56,
              backgroundColor: '#ffffff',
              border: '1.5px solid #cbd5e1',
              boxShadow: '0 28px 80px rgba(15, 23, 42, 0.12), 0 0 48px rgba(5, 150, 105, 0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Img
              name="SESI Logo"
              src={staticFile('logo.png')}
              style={{ width: 270, height: 270, objectFit: 'contain' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(112deg, transparent ${sheen - 18}%, rgba(255, 255, 255, 0.72) ${sheen}%, transparent ${sheen + 18}%)`,
                pointerEvents: 'none',
              }}
            />
          </Interactive.Div>
        </div>

        <div
          style={{
            marginTop: 32,
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <Interactive.Div
            name="Finale Wordmark"
            style={{
              fontFamily: FONT_SANS,
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: '#0f172a',
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            {title}
          </Interactive.Div>
        </div>

        <div
          style={{
            marginTop: 12,
            opacity: subOp,
            transform: `translateY(${subY}px)`,
          }}
        >
          <Interactive.Div
            name="Finale Subtitle"
            style={{
              fontFamily: FONT_SANS,
              fontSize: 25,
              fontWeight: 600,
              color: '#475569',
              letterSpacing: '-0.01em',
              textAlign: 'center',
            }}
          >
            {subtitle}
          </Interactive.Div>
        </div>
      </div>
    </>
  );
};

export const Scene7FinaleLockup = Interactive.create({
  Component: Scene7Inner,
  layout: 'absolute-fill',
  schema: {
    title: { type: 'string', default: SCENE_TIMING.scene7.props.title, description: 'Finale brand title' },
    subtitle: {
      type: 'string',
      default: SCENE_TIMING.scene7.props.subtitle,
      description: 'Finale subtitle',
    },
  },
});
