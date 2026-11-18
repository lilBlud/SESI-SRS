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
    { start: 72, end: 94, from: [1280, 810], to: [1138, 668], ease: Eases.softLand },
    { start: 112, end: 132, from: [1138, 668], to: [1280, 790], ease: Eases.softInOut },
    { start: 174, end: 194, from: [1280, 790], to: [1138, 668], ease: Eases.softLand },
    { start: 208, end: 238, from: [1138, 668], to: [1345, 224], ease: Eases.softLand },
    { start: 278, end: 306, from: [1345, 224], to: [1316, 344], ease: Eases.cruise },
    { start: 356, end: 380, from: [1316, 344], to: [1520, 420], ease: Eases.softInOut },
  ],
  visibility: [
    { start: 72, end: 132, fadeIn: 8, fadeOut: 12 },
    { start: 174, end: 380, fadeIn: 8, fadeOut: 14 },
  ],
  clicks: [
    { frame: 96 },
    { frame: 196 },
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

  const whipInX = easeRange(frame, 0, 30, 1800, 0, Eases.softLand);
  const whipInBlur = easeRange(frame, 0, 20, 8, 0, Eases.softLand);

  // Cards clear full 1920px viewport (-1550 / +1550) smoothly
  const card1Flip = easeRange(frame, 46, 78, 0, 180, Eases.softInOut);
  const card1ExitX = easeRange(frame, 116, 148, 0, -1550, Eases.softInOut);
  const card2InX = easeRange(frame, 124, 160, 1550, 0, Eases.softLand);
  const card2Flip = easeRange(frame, 158, 188, 0, 180, Eases.softInOut);

  const bookmarkPress = pressEnvelope(frame, 96, { release: 18 });
  const card2BookmarkPress = pressEnvelope(frame, 196, { release: 16 });
  const savePdfPress = pressEnvelope(frame, 240, { minScale: 0.92, release: 16 });
  const printReadyPress = pressEnvelope(frame, 342, { minScale: 0.92, release: 16 });

  const stackOutOp = easeRange(frame, 198, 224, 1, 0, Eases.softInOut);
  const stackOutScale = easeRange(frame, 198, 224, 1, 0.95, Eases.softInOut);
  const printHubOp = easeRange(frame, 208, 236, 0, 1, Eases.softLand);
  const printHubScale = easeRange(frame, 208, 238, 0.95, 1, Eases.softLand);

  const pdfClicked = frame >= 240;
  const pdfExported = frame >= 342;
  const sheetReveal = easeRange(frame, 244, 278, 0, 1, Eases.softLand);
  const sheetY = easeRange(frame, 244, 278, 44, 0, Eases.softLand);
  const exportBadgeOp = easeRange(frame, 346, 366, 0, 1, Eases.softLand);
  const exportBadgeScale = easeRange(frame, 346, 370, 0.88, 1.0, Eases.popOver);
  const paperSheen = easeRange(frame, 354, 418, -30, 135, Eases.softInOut);

  const copyY = easeRange(frame, 16, 36, 38, 0, Eases.softLand);
  const copyDriftX = easeRange(frame, 16, 424, 14, -22, Eases.cruise);
  const copyOp = easeRange(frame, 16, 30, 0, 1, Eases.softLand);
  const captionCrossfade = easeRange(frame, 204, 232, 0, 1, Eases.softInOut);

  const stackScale = easeRange(frame, 22, 424, 0.985, 1.035, Eases.glide);
  const exitPushScale = easeRange(frame, 424, 450, 1, 1.24, Eases.softInOut);
  const exitOp = easeRange(frame, 424, 450, 1, 0, Eases.softInOut);

  const orbitRotY = easeRange(frame, 22, 212, -3.5, 2.5, Eases.cruise);
  const orbitRotX = easeRange(frame, 22, 212, 2.0, -1.2, Eases.cruise);

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
