import React from 'react';
import { Interactive, useCurrentFrame } from 'remotion';
import { SceneCaption } from '../components/SceneCaption';
import { TopographicWorld } from '../components/TopographicWorld';
import { RESET2030_METRICS } from '../data/sesiData';
import { Eases, easeRange } from '../motion/eases';
import { SCENE_TIMING } from '../timeline';
import { DesktopPwaMockup } from './scene2/DesktopPwaMockup';
import { MobilePhoneMockup } from './scene2/MobilePhoneMockup';

type Scene2Props = {
  readonly captionPrefix: string;
  readonly captionAccent: string;
  readonly hubTitle: string;
};

const Scene2Inner: React.FC<Scene2Props> = ({
  captionPrefix,
  captionAccent,
  hubTitle,
}) => {
  const frame = useCurrentFrame();

  const phoneScale = easeRange(frame, 0, 22, 1.24, 0.94, Eases.snapSettle);
  const phoneRotY = easeRange(frame, 0, 134, -4, -20, Eases.glide);
  const phoneRotX = easeRange(frame, 0, 134, 2, 7, Eases.glide);
  const phoneShiftX = easeRange(frame, 28, 86, 0, 440, Eases.softLand);
  const phoneShiftY =
    easeRange(frame, 28, 86, 0, 10, Eases.softLand) + Math.sin(frame * 0.08) * 6;

  const desktopScale = easeRange(frame, 24, 134, 0.78, 0.98, Eases.glide);
  const desktopOp = easeRange(frame, 24, 40, 0, 1, Eases.softLand);
  const desktopRotY = easeRange(frame, 24, 134, 9, 2, Eases.glide);
  const desktopShiftX = easeRange(frame, 28, 86, 0, -110, Eases.softLand);

  const driftX = easeRange(frame, 76, 134, 0, -28, Eases.cruise);
  const capCounter = Math.round(
    easeRange(frame, 36, 118, 850, RESET2030_METRICS.dependableCapacityMW, Eases.softLand),
  );
  const copyDriftX = easeRange(frame, 48, 134, 12, -16, Eases.cruise);
  const copyY = easeRange(frame, 48, 62, 36, 0, Eases.snapSettle);
  const copyOp = easeRange(frame, 48, 56, 0, 1, Eases.softLand);

  const whipOutX = easeRange(frame, 134, 150, 0, -2100, Eases.accelExit);
  const whipOutBlur = easeRange(frame, 140, 150, 0, 14, Eases.accelExit);
  const bgCameraX = easeRange(frame, 0, 150, 18, -140, Eases.cruise) + whipOutX * 0.25;

  return (
    <>
      <TopographicWorld cameraX={bgCameraX} cameraZoom={1.04} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${whipOutX}px)`,
          filter: whipOutBlur > 0.2 ? `blur(${whipOutBlur}px)` : undefined,
        }}
      >
        <DesktopPwaMockup
          hubTitle={hubTitle}
          capCounter={capCounter}
          opacity={desktopOp}
          shiftX={desktopShiftX + driftX}
          scale={desktopScale}
          rotateY={desktopRotY}
        />

        <MobilePhoneMockup
          shiftX={phoneShiftX + driftX * 1.3}
          shiftY={phoneShiftY}
          scale={phoneScale}
          rotateY={phoneRotY}
          rotateX={phoneRotX}
        />

        <SceneCaption
          name="Scene 2 Caption"
          prefix={captionPrefix}
          accent={captionAccent}
          opacity={copyOp}
          driftX={copyDriftX}
          offsetY={copyY}
          fontSize={64}
          style={{ position: 'absolute', left: 100, right: 100, bottom: 62, zIndex: 30 }}
        />
      </div>
    </>
  );
};

export const Scene2MatchCutEntrance = Interactive.create({
  Component: Scene2Inner,
  layout: 'absolute-fill',
  schema: {
    captionPrefix: { type: 'string', default: SCENE_TIMING.scene2.props.captionPrefix, description: 'Caption prefix' },
    captionAccent: { type: 'string', default: SCENE_TIMING.scene2.props.captionAccent, description: 'Caption accent' },
    hubTitle: { type: 'string', default: SCENE_TIMING.scene2.props.hubTitle, description: 'Desktop hub title' },
  },
});
