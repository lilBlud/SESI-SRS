import React from 'react';
import { Interactive, useCurrentFrame } from 'remotion';
import { PointerCursor } from '../components/PointerCursor';
import { SceneCaption } from '../components/SceneCaption';
import { TopographicWorld } from '../components/TopographicWorld';
import { GLOSSARY_CARDS } from '../data/sesiData';
import {
  evaluateCursorTrack,
  pressEnvelope,
  type CursorTrackSpec,
} from '../motion/choreography';
import { Eases, easeRange } from '../motion/eases';
import { SCENE_TIMING } from '../timeline';
import { Flashcard3D } from './scene3/Flashcard3D';
import { PrintReferenceShowcase } from './scene3/PrintReferenceShowcase';

type Scene3Props = {
  readonly captionPrefix: string;
  readonly captionAccent: string;
  readonly secondaryCaptionPrefix: string;
  readonly secondaryCaptionAccent: string;
};

const SCENE3_CURSOR_TRACK: CursorTrackSpec = {
  moves: [
    { start: 76, end: 94, from: [1280, 810], to: [1138, 668], ease: Eases.softLand },
    { start: 112, end: 130, from: [1138, 668], to: [1280, 790], ease: Eases.accelExit },
    { start: 170, end: 188, from: [1280, 790], to: [1138, 668], ease: Eases.softLand },
    { start: 204, end: 236, from: [1138, 668], to: [1345, 224], ease: Eases.softLand },
    { start: 276, end: 300, from: [1345, 224], to: [1316, 344], ease: Eases.cruise },
    { start: 356, end: 376, from: [1316, 344], to: [1520, 420], ease: Eases.accelExit },
  ],
  visibility: [
    { start: 76, end: 130, fadeIn: 6, fadeOut: 10 },
    { start: 170, end: 376, fadeIn: 6, fadeOut: 12 },
  ],
  clicks: [
    { frame: 96 },
    { frame: 192 },
    { frame: 240 },
    { frame: 342 },
  ],
};

const Scene3Inner: React.FC<Scene3Props> = ({
  captionPrefix,
  captionAccent,
  secondaryCaptionPrefix,
  secondaryCaptionAccent,
}) => {
  const frame = useCurrentFrame();

  const whipInX = easeRange(frame, 0, 18, 1800, 0, Eases.whip);
  const whipInBlur = easeRange(frame, 0, 10, 14, 0, Eases.whip);

  // Cards clear full 1920px viewport (-1550 / +1550) before unmounting/mounting
  const card1Flip = easeRange(frame, 46, 72, 0, 180, Eases.softLand);
  const card1ExitX = easeRange(frame, 118, 138, 0, -1550, Eases.accelExit);
  const card2InX = easeRange(frame, 122, 144, 1550, 0, Eases.snapSettle);
  const card2Flip = easeRange(frame, 152, 176, 0, 180, Eases.softLand);

  const bookmarkPress = pressEnvelope(frame, 96, { release: 18 });
  const card2BookmarkPress = pressEnvelope(frame, 192, { release: 14 });
  const savePdfPress = pressEnvelope(frame, 240, { minScale: 0.92, release: 16 });
  const printReadyPress = pressEnvelope(frame, 342, { minScale: 0.92, release: 16 });

  const stackOutOp = easeRange(frame, 200, 212, 1, 0, Eases.accelExit);
  const stackOutScale = easeRange(frame, 200, 212, 1, 0.95, Eases.accelExit);
  const printHubOp = easeRange(frame, 206, 222, 0, 1, Eases.snapSettle);
  const printHubScale = easeRange(frame, 206, 224, 0.95, 1, Eases.snapSettle);

  const pdfClicked = frame >= 240;
  const pdfExported = frame >= 342;
  const sheetReveal = easeRange(frame, 242, 268, 0, 1, Eases.snapSettle);
  const sheetY = easeRange(frame, 242, 268, 44, 0, Eases.snapSettle);
  const exportBadgeOp = easeRange(frame, 346, 362, 0, 1, Eases.snapSettle);
  const exportBadgeScale = easeRange(frame, 346, 366, 0.88, 1.0, Eases.popOver);
  const paperSheen = easeRange(frame, 352, 412, -30, 135, Eases.softInOut);

  const copyY = easeRange(frame, 14, 30, 38, 0, Eases.snapSettle);
  const copyDriftX = easeRange(frame, 14, 434, 14, -22, Eases.cruise);
  const copyOp = easeRange(frame, 14, 22, 0, 1, Eases.softLand);
  const captionCrossfade = easeRange(frame, 204, 222, 0, 1, Eases.softInOut);

  const stackScale = easeRange(frame, 18, 434, 0.985, 1.035, Eases.glide);
  const exitPushScale = easeRange(frame, 434, 450, 1, 1.42, Eases.accelExit);
  const exitOp = easeRange(frame, 438, 450, 1, 0, Eases.accelExit);

  const orbitRotY = easeRange(frame, 18, 208, -3.5, 2.5, Eases.cruise);
  const orbitRotX = easeRange(frame, 18, 208, 2.0, -1.2, Eases.cruise);

  const cursor = evaluateCursorTrack(frame, SCENE3_CURSOR_TRACK);
  const [card1, card2] = GLOSSARY_CARDS;

  return (
    <>
      <TopographicWorld
        cameraX={-140 - frame * 0.35}
        cameraZoom={easeRange(frame, 0, 450, 1.02, 1.09, Eases.cruise)}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${whipInX}px) scale(${stackScale * exitPushScale})`,
          opacity: exitOp,
          filter: whipInBlur > 0.2 ? `blur(${whipInBlur}px)` : undefined,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative', width: 980, height: 575 }}>
          {frame < 214 && (
            <Interactive.Div
              name="Flashcard Stack"
              style={{
                position: 'absolute',
                inset: '26px 10px',
                perspective: 1600,
                opacity: stackOutOp,
                transform: `rotateY(${orbitRotY}deg) rotateX(${orbitRotX}deg) scale(${stackOutScale})`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 36,
                  backgroundColor: 'rgba(255, 255, 255, 0.72)',
                  border: '1px solid #cbd5e1',
                  transform: 'translate3d(28px, 22px, -60px) scale(0.95)',
                  boxShadow: '0 20px 50px rgba(15, 23, 42, 0.06)',
                }}
              />

              {frame < 140 && (
                <Flashcard3D
                  card={card1}
                  rotateY={card1Flip}
                  translateX={card1ExitX}
                  isBookmarked={frame >= 96}
                  bookmarkScale={bookmarkPress}
                  indexLabel="Term 01"
                />
              )}

              {frame >= 124 && (
                <Flashcard3D
                  card={card2}
                  rotateY={card2Flip}
                  translateX={card2InX}
                  isBookmarked={frame >= 192}
                  bookmarkScale={card2BookmarkPress}
                  indexLabel="Term 02"
                />
              )}
            </Interactive.Div>
          )}

          {frame >= 206 && (
            <PrintReferenceShowcase
              cards={[card1, card2]}
              hubOpacity={printHubOp}
              hubScale={printHubScale}
              savePdfPress={savePdfPress}
              printReadyPress={printReadyPress}
              pdfClicked={pdfClicked}
              pdfExported={pdfExported}
              sheetReveal={sheetReveal}
              sheetY={sheetY}
              exportBadgeOp={exportBadgeOp}
              exportBadgeScale={exportBadgeScale}
              paperSheen={paperSheen}
            />
          )}
        </div>

        <SceneCaption
          name="Scene 3 Caption"
          prefix={captionPrefix}
          accent={captionAccent}
          secondaryPrefix={secondaryCaptionPrefix}
          secondaryAccent={secondaryCaptionAccent}
          crossfadeOpacity={captionCrossfade}
          opacity={copyOp}
          driftX={copyDriftX}
          offsetY={copyY}
          style={{ marginTop: 42, width: 1400 }}
        />
      </div>

      <PointerCursor
        x={cursor.x}
        y={cursor.y}
        scale={cursor.scale}
        opacity={cursor.opacity}
      />
    </>
  );
};

export const Scene3GlossaryFlashcards = Interactive.create({
  Component: Scene3Inner,
  layout: 'absolute-fill',
  schema: {
    captionPrefix: { type: 'string', default: SCENE_TIMING.scene3.props.captionPrefix, description: 'Caption prefix' },
    captionAccent: { type: 'string', default: SCENE_TIMING.scene3.props.captionAccent, description: 'Caption accent' },
    secondaryCaptionPrefix: {
      type: 'string',
      default: SCENE_TIMING.scene3.props.secondaryCaptionPrefix,
      description: 'Print beat caption prefix',
    },
    secondaryCaptionAccent: {
      type: 'string',
      default: SCENE_TIMING.scene3.props.secondaryCaptionAccent,
      description: 'Print beat caption accent',
    },
  },
});
