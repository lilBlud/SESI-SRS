import React from 'react';
import { Interactive, interpolate, useCurrentFrame } from 'remotion';
import { PointerCursor } from '../components/PointerCursor';
import { SceneCaption } from '../components/SceneCaption';
import { TopographicWorld } from '../components/TopographicWorld';
import { BRAND, QUIZ_DEMO_DATA } from '../data/sesiData';
import {
  ambientSine,
  evaluateCursorTrack,
  pressEnvelope,
  type CursorTrackSpec,
} from '../motion/choreography';
import { Eases, easeRange } from '../motion/eases';
import { SCENE_TIMING } from '../timeline';
import { MomentumBadges } from './scene4/MomentumBadges';
import { QuizIntroCard } from './scene4/QuizIntroCard';
import { QuizQuestionCard } from './scene4/QuizQuestionCard';

type Scene4Props = {
  readonly quizTitle: string;
  readonly captionPrefix: string;
  readonly captionAccent: string;
};

const START_QUIZ_POINT = [1020, 615] as const;
const OPTION_C_POINT = [790, 636] as const;

const SCENE4_CURSOR_TRACK: CursorTrackSpec = {
  moves: [
    { start: 38, end: 60, from: [1260, 760], to: START_QUIZ_POINT, ease: Eases.softLand },
    { start: 112, end: 138, from: START_QUIZ_POINT, to: OPTION_C_POINT, ease: Eases.softLand },
    { start: 164, end: 182, from: OPTION_C_POINT, to: [1180, 760], ease: Eases.accelExit },
  ],
  visibility: [{ start: 38, end: 182, fadeIn: 8, fadeOut: 8 }],
  clicks: [
    { frame: 68, release: 6 },
    { frame: 150, release: 8 },
  ],
};

const Scene4Inner: React.FC<Scene4Props> = ({
  quizTitle,
  captionPrefix,
  captionAccent,
}) => {
  const frame = useCurrentFrame();

  const cardInScale = easeRange(frame, 0, 22, 0.86, 1.0, Eases.snapSettle);
  const cardInOp = easeRange(frame, 0, 12, 0.25, 1, Eases.softLand);
  const btnScale = pressEnvelope(frame, 68, { minScale: 0.96, release: 8, releaseEase: Eases.snapSettle });
  const optionScale = pressEnvelope(frame, 150, { minScale: 0.96, release: 10, releaseEase: Eases.snapSettle });

  const shockScale = easeRange(frame, 68, 108, 0.2, 4.5, Eases.softLand);
  const shockOp = easeRange(frame, 68, 105, 0.85, 0, Eases.softLand);

  const showQuestion = frame >= 86;
  const questionInY = easeRange(frame, 86, 104, 36, 0, Eases.snapSettle);
  const whipPanY = easeRange(frame, 185, 212, 0, -165, Eases.whip);

  const streakY = easeRange(frame, 204, 224, 90, 0, Eases.snapSettle);
  const streakOp = easeRange(frame, 204, 214, 0, 1, Eases.softLand);
  const xpBadgeScale = easeRange(frame, 218, 240, 0.72, 1.0, Eases.popOver);
  const xpBadgeOp = easeRange(frame, 218, 228, 0, 1, Eases.softLand);

  const scoreVal = Math.round(
    easeRange(frame, 232, 342, QUIZ_DEMO_DATA.startScore, QUIZ_DEMO_DATA.endScore, Eases.softLand),
  );
  const badgeAliveScale = ambientSine(frame, 250, 0.09, 0.014);
  const stageCamZoom = easeRange(frame, 0, 372, 0.99, 1.045, Eases.glide);
  const progressBarFill = easeRange(frame, 206, 336, 90, 100, Eases.softLand);

  const copyY = easeRange(frame, 20, 36, 40, 0, Eases.snapSettle);
  const copyDriftX = easeRange(frame, 20, 372, 18, -20, Eases.cruise);
  const copyOp = easeRange(frame, 20, 28, 0, 1, Eases.softLand);

  const cursor = evaluateCursorTrack(frame, SCENE4_CURSOR_TRACK);

  const exitT = easeRange(frame, 372, 390, 0, 1, Eases.softInOut);
  const exitStageOp = 1 - exitT;
  const exitStageScale = interpolate(exitT, [0, 1], [1, 0.93]);
  const exitStageY = interpolate(exitT, [0, 1], [0, -24]);

  return (
    <>
      <TopographicWorld
        cameraX={-230 - frame * 0.35}
        cameraY={whipPanY * 0.35}
        cameraZoom={easeRange(frame, 0, 390, 1.04, 1.11, Eases.cruise)}
      />

      {frame >= 64 && frame <= 82 && (
        <div
          style={{
            position: 'absolute',
            left: START_QUIZ_POINT[0],
            top: START_QUIZ_POINT[1],
            width: 90,
            height: 90,
            marginLeft: -45,
            marginTop: -45,
            borderRadius: 999,
            border: `2.5px solid ${BRAND.emerald}`,
            opacity: easeRange(frame, 64, 82, 0.85, 0, Eases.softLand),
            transform: `scale(${easeRange(frame, 64, 82, 0.4, 1.8, Eases.softLand)})`,
            pointerEvents: 'none',
            zIndex: 15,
          }}
        />
      )}

      {frame >= 68 && frame <= 110 && (
        <div
          style={{
            position: 'absolute',
            left: START_QUIZ_POINT[0],
            top: START_QUIZ_POINT[1],
            width: 320,
            height: 320,
            marginLeft: -160,
            marginTop: -160,
            borderRadius: 999,
            border: `4px solid ${BRAND.emerald}`,
            boxShadow: '0 0 36px rgba(5, 150, 105, 0.35)',
            opacity: shockOp,
            transform: `scale(${shockScale})`,
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${whipPanY + exitStageY}px) scale(${cardInScale * stageCamZoom * exitStageScale})`,
          opacity: cardInOp * exitStageOp,
        }}
      >
        <Interactive.Div
          name="Quiz Card"
          style={{
            width: 820,
            borderRadius: 34,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            border: `1.5px solid ${BRAND.slate200}`,
            boxShadow: '0 28px 72px rgba(15, 23, 42, 0.1)',
            padding: '40px 44px',
          }}
        >
          {!showQuestion ? (
            <QuizIntroCard quizTitle={quizTitle} btnScale={btnScale} />
          ) : (
            <QuizQuestionCard
              progressBarFill={progressBarFill}
              questionInY={questionInY}
              optionScale={optionScale}
              optionSelected={frame >= 150}
            />
          )}
        </Interactive.Div>

        {frame >= 200 && (
          <MomentumBadges
            streakOp={streakOp}
            streakY={streakY}
            xpBadgeOp={xpBadgeOp}
            xpBadgeScale={xpBadgeScale * badgeAliveScale}
            scoreVal={scoreVal}
          />
        )}
      </div>

      <SceneCaption
        name="Scene 4 Caption"
        prefix={captionPrefix}
        accent={captionAccent}
        opacity={copyOp * exitStageOp}
        driftX={copyDriftX}
        offsetY={copyY + exitStageY * 0.5}
        style={{ position: 'absolute', left: 100, right: 100, bottom: 78 }}
      />

      <PointerCursor x={cursor.x} y={cursor.y} scale={cursor.scale} opacity={cursor.opacity} />
    </>
  );
};

export const Scene4QuizMomentum = Interactive.create({
  Component: Scene4Inner,
  layout: 'absolute-fill',
  schema: {
    quizTitle: { type: 'string', default: SCENE_TIMING.scene4.props.quizTitle, description: 'Quiz card title' },
    captionPrefix: { type: 'string', default: SCENE_TIMING.scene4.props.captionPrefix, description: 'Caption prefix' },
    captionAccent: { type: 'string', default: SCENE_TIMING.scene4.props.captionAccent, description: 'Caption accent' },
  },
});
