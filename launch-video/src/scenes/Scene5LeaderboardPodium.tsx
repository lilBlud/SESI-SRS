import React from 'react';
import { Interactive, useCurrentFrame } from 'remotion';
import { CrownIcon } from '../components/Icons';
import { SceneCaption } from '../components/SceneCaption';
import { TopographicWorld } from '../components/TopographicWorld';
import { BRAND, LEADERBOARD_ENTRIES } from '../data/sesiData';
import { Eases, easeRange } from '../motion/eases';
import { FONT_SANS } from '../motion/fonts';
import { SCENE_TIMING } from '../timeline';
import { PODIUM_TIER_STYLES, PodiumColumn } from './scene5/PodiumColumn';

type Scene5Props = {
  readonly boardTitle: string;
  readonly boardMonth: string;
  readonly captionPrefix: string;
  readonly captionAccent: string;
};

const Scene5Inner: React.FC<Scene5Props> = ({
  boardTitle,
  boardMonth,
  captionPrefix,
  captionAccent,
}) => {
  const frame = useCurrentFrame();

  const cardScale = easeRange(frame, 0, 18, 0.94, 1.0, Eases.snapSettle);
  const cardOp = easeRange(frame, 0, 12, 0, 1, Eases.softLand);

  const barHeights: Record<1 | 2 | 3, number> = {
    1: easeRange(frame, 18, 68, 0, 214, Eases.snapSettle),
    2: easeRange(frame, 10, 56, 0, 152, Eases.softLand),
    3: easeRange(frame, 24, 72, 0, 122, Eases.softLand),
  };

  const avatarOpacities: Record<1 | 2 | 3, number> = {
    1: easeRange(frame, 26, 40, 0, 1, Eases.softLand),
    2: easeRange(frame, 18, 32, 0, 1, Eases.softLand),
    3: easeRange(frame, 32, 46, 0, 1, Eases.softLand),
  };

  const scores: Record<1 | 2 | 3, number> = {
    1: Math.round(easeRange(frame, 24, 112, 1120, LEADERBOARD_ENTRIES[0].score, Eases.softLand)),
    2: Math.round(easeRange(frame, 16, 102, 980, LEADERBOARD_ENTRIES[1].score, Eases.softLand)),
    3: Math.round(easeRange(frame, 28, 106, 890, LEADERBOARD_ENTRIES[2].score, Eases.softLand)),
  };

  const crownScale = easeRange(frame, 42, 72, 0.5, 1.0, Eases.popOver);
  const crownFloatY = frame >= 60 ? Math.sin((frame - 60) * 0.1) * 3 : 0;
  const goldSheen = easeRange(frame, 64, 126, -35, 135, Eases.softInOut);

  const cardDolly = easeRange(frame, 0, 140, 0.975, 1.025, Eases.glide);
  const copyDriftX = easeRange(frame, 12, 140, 12, -12, Eases.cruise);
  const copyY = easeRange(frame, 12, 26, 28, 0, Eases.snapSettle);
  const copyOp = easeRange(frame, 12, 22, 0, 1, Eases.softLand);

  const exitDim = easeRange(frame, 132, 150, 0, 0.88, Eases.softInOut);
  const exitCardOp = easeRange(frame, 132, 149, 1, 0, Eases.accelExit);
  const exitScale = easeRange(frame, 132, 150, 1, 0.94, Eases.accelExit);

  // Display order on podium: #2 (left), #1 (center), #3 (right)
  const displayEntries = [LEADERBOARD_ENTRIES[1], LEADERBOARD_ENTRIES[0], LEADERBOARD_ENTRIES[2]];

  return (
    <>
      <TopographicWorld
        cameraX={-230 - frame * 0.45}
        cameraZoom={easeRange(frame, 0, 150, 1.06, 1.11, Eases.cruise)}
        dimFactor={exitDim}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${cardScale * cardDolly * exitScale})`,
          opacity: cardOp * exitCardOp,
        }}
      >
        <Interactive.Div
          name="Leaderboard Card"
          style={{
            width: 820,
            borderRadius: 32,
            backgroundColor: BRAND.white,
            border: `1px solid ${BRAND.slate300}`,
            boxShadow: '0 28px 72px rgba(15, 23, 42, 0.10), 0 4px 16px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(95deg, #d97706 0%, #ea580c 52%, #e11d48 100%)',
              padding: '22px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CrownIcon size={26} color="#fef08a" />
              </div>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 25, fontWeight: 800, color: BRAND.white, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  {boardTitle}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginTop: 2 }}>
                  {boardMonth}
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '38px 44px 36px', backgroundColor: BRAND.white }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.08fr 1fr',
                alignItems: 'end',
                gap: 20,
                height: 368,
                borderBottom: `2px solid ${BRAND.slate200}`,
              }}
            >
              {displayEntries.map((entry) => {
                const rank = entry.rank as 1 | 2 | 3;
                return (
                  <PodiumColumn
                    key={rank}
                    rank={rank}
                    name={entry.name}
                    initials={entry.initials}
                    streak={entry.streak}
                    score={scores[rank]}
                    barHeight={barHeights[rank]}
                    avatarOpacity={avatarOpacities[rank]}
                    styleConfig={PODIUM_TIER_STYLES[rank]}
                    crownFloatY={rank === 1 ? crownFloatY : 0}
                    crownScale={rank === 1 ? crownScale : 1}
                    goldSheen={rank === 1 ? goldSheen : undefined}
                  />
                );
              })}
            </div>
          </div>
        </Interactive.Div>

        <SceneCaption
          name="Scene 5 Caption"
          prefix={captionPrefix}
          accent={captionAccent}
          opacity={copyOp}
          driftX={copyDriftX}
          offsetY={copyY}
          fontSize={64}
          style={{ marginTop: 52 }}
        />
      </div>
    </>
  );
};

export const Scene5LeaderboardPodium = Interactive.create({
  Component: Scene5Inner,
  layout: 'absolute-fill',
  schema: {
    boardTitle: { type: 'string', default: SCENE_TIMING.scene5.props.boardTitle, description: 'Leaderboard header title' },
    boardMonth: { type: 'string', default: SCENE_TIMING.scene5.props.boardMonth, description: 'Leaderboard month label' },
    captionPrefix: { type: 'string', default: SCENE_TIMING.scene5.props.captionPrefix, description: 'Caption prefix' },
    captionAccent: { type: 'string', default: SCENE_TIMING.scene5.props.captionAccent, description: 'Caption accent' },
  },
});
