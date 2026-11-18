import React from 'react';
import { Interactive, interpolate, useCurrentFrame } from 'remotion';
import { SceneCaption } from '../components/SceneCaption';
import { TopographicWorld } from '../components/TopographicWorld';
import { FUTURE_GEN_PROJECTS } from '../data/futureGenData';
import { PIN_COORDS_BY_ID } from '../data/sabahMapGeoData';
import { RESET2030_METRICS } from '../data/sesiData';
import { evaluateCursorTrack, type CursorTrackSpec } from '../motion/choreography';
import { Eases, easeRange } from '../motion/eases';
import { FONT_SANS } from '../motion/fonts';
import { SCENE_TIMING } from '../timeline';
import { ProjectBreakdownPanel } from './scene6/ProjectBreakdownPanel';
import { SabahGridMap, type PinSelectionBeat } from './scene6/SabahGridMap';
import { TelemetryOverviewPanel } from './scene6/TelemetryOverviewPanel';

type Scene6Props = {
  readonly tensionCopy: string;
  readonly captionPrefix: string;
  readonly captionAccent: string;
  readonly secondaryCaptionPrefix: string;
  readonly secondaryCaptionAccent: string;
};

const PIN_SELECTION_BEATS: readonly PinSelectionBeat[] = [
  { id: 'tecoma', clickFrame: 192, rippleColor: '#0F172A' },
  { id: 'sequioa', clickFrame: 268, rippleColor: '#2563EB' },
];

const SCENE6_CURSOR_TRACK: CursorTrackSpec = {
  moves: [
    { start: 164, end: 188, from: [226, 218], to: PIN_COORDS_BY_ID.tecoma, ease: Eases.softLand },
    { start: 244, end: 264, from: PIN_COORDS_BY_ID.tecoma, to: PIN_COORDS_BY_ID.sequioa, ease: Eases.softLand },
    { start: 288, end: 310, from: PIN_COORDS_BY_ID.sequioa, to: [155, 310], ease: Eases.softInOut },
  ],
  visibility: [{ start: 164, end: 310, fadeIn: 8, fadeOut: 14 }],
  clicks: [
    { frame: 192, minScale: 0.82 },
    { frame: 268, minScale: 0.82 },
  ],
};

const Scene6Inner: React.FC<Scene6Props> = ({
  tensionCopy,
  captionPrefix,
  captionAccent,
  secondaryCaptionPrefix,
  secondaryCaptionAccent,
}) => {
  const frame = useCurrentFrame();

  const tensionCopyOp =
    frame < 88
      ? easeRange(frame, 0, 20, 0.15, 1, Eases.softLand) *
        easeRange(frame, 58, 86, 1, 0, Eases.softInOut)
      : 0;
  const tensionScale = easeRange(frame, 0, 86, 0.96, 1.04, Eases.glide);
  const dimFactor =
    frame < 58 ? 0.88 : easeRange(frame, 58, 98, 0.88, 0, Eases.softInOut);

  const mapInScale = easeRange(frame, 70, 120, 0.93, 1.0, Eases.softLand);
  const mapOp = easeRange(frame, 70, 102, 0, 1, Eases.softLand);
  const gridDraw = easeRange(frame, 88, 178, 800, 0, Eases.softLand);
  const powerFlowDash = -(frame * 2.6);

  const mapCamZoom =
    frame < 192
      ? easeRange(frame, 72, 192, 0.94, 1.01, Eases.softLand)
      : easeRange(frame, 192, 330, 1.01, 1.04, Eases.glide);
  const mapCamX = easeRange(frame, 72, 330, 10, -8, Eases.cruise);
  const mapCamY = easeRange(frame, 72, 330, 6, -4, Eases.cruise);
  const mapTiltX = easeRange(frame, 72, 192, 4.0, 0, Eases.softLand);
  const mapTiltY = easeRange(frame, 72, 260, -3.0, 1.0, Eases.glide);

  const capMW = Math.round(
    easeRange(frame, 96, 182, 0, RESET2030_METRICS.dependableCapacityMW, Eases.softLand),
  );
  const peakMW = Math.round(
    easeRange(frame, 106, 184, 0, RESET2030_METRICS.peakDemandMW, Eases.softLand),
  );
  const reservePct = Math.round(
    easeRange(
      frame,
      114,
      186,
      RESET2030_METRICS.reserveStartPct,
      RESET2030_METRICS.reserveTargetPct,
      Eases.softLand,
    ),
  );
  const projectCount = Math.round(
    easeRange(frame, 108, 178, 0, RESET2030_METRICS.projectCount, Eases.softLand),
  );

  // Active pin selection resolves from PIN_SELECTION_BEATS
  const activeBeat = [...PIN_SELECTION_BEATS]
    .reverse()
    .find((beat) => frame >= beat.clickFrame);
  const activePinId = activeBeat?.id ?? null;

  const cursor = evaluateCursorTrack(frame, SCENE6_CURSOR_TRACK);

  const overviewOp = frame < 186 ? 1 : easeRange(frame, 186, 206, 1, 0, Eases.softInOut);
  const overviewY = frame < 186 ? 0 : easeRange(frame, 186, 206, 0, -18, Eases.softInOut);

  const copyY = easeRange(frame, 94, 122, 36, 0, Eases.softLand);
  const copyDriftX = easeRange(frame, 94, 330, 18, -18, Eases.cruise);
  const copyOp = easeRange(frame, 94, 114, 0, 1, Eases.softLand);
  const captionCrossfade = frame < 192 ? 0 : easeRange(frame, 192, 214, 0, 1, Eases.softInOut);

  const exitT = easeRange(frame, 330, 360, 0, 1, Eases.softInOut);
  const exitOp = 1 - exitT;
  const exitScale = interpolate(exitT, [0, 1], [1, 0.93]);
  const exitY = interpolate(exitT, [0, 1], [0, -28]);

  return (
    <>
      <TopographicWorld
        cameraX={-100 - frame * 0.35}
        cameraZoom={easeRange(frame, 0, 360, 1.02, 1.09, Eases.cruise)}
        dimFactor={dimFactor}
      />

      {tensionCopyOp > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: tensionCopyOp,
            transform: `scale(${tensionScale})`,
            zIndex: 20,
          }}
        >
          <Interactive.Div
            name="Tension Beat Title"
            style={{
              fontFamily: FONT_SANS,
              fontSize: 78,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#ffffff',
            }}
          >
            {tensionCopy}
          </Interactive.Div>
        </div>
      )}

      {frame >= 70 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 40,
            padding: '28px 68px 126px',
            opacity: mapOp * exitOp,
            transform: `translateY(${exitY}px) scale(${mapInScale * exitScale})`,
          }}
        >
          <SabahGridMap
            frame={frame}
            gridDraw={gridDraw}
            powerFlowDash={powerFlowDash}
            activePinId={activePinId}
            selectionBeats={PIN_SELECTION_BEATS}
            cursor={cursor}
            camZoom={mapCamZoom}
            camX={mapCamX}
            camY={mapCamY}
            tiltX={mapTiltX}
            tiltY={mapTiltY}
          />

          <div
            style={{
              width: 470,
              flexShrink: 0,
              position: 'relative',
              height: 590,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {frame < 206 && (
              <TelemetryOverviewPanel
                capMW={capMW}
                peakMW={peakMW}
                reservePct={reservePct}
                projectCount={projectCount}
                opacity={overviewOp}
                translateY={overviewY}
              />
            )}

            {PIN_SELECTION_BEATS.map((beat, idx) => {
              const nextBeat = PIN_SELECTION_BEATS[idx + 1];
              const isVisible =
                frame >= beat.clickFrame && (!nextBeat || frame <= nextBeat.clickFrame + 10);
              if (!isVisible) return null;

              const proj = FUTURE_GEN_PROJECTS.find((p) => p.id === beat.id);
              if (!proj) return null;

              const isLeaving = Boolean(nextBeat && frame >= nextBeat.clickFrame - 4);
              const panelOp = isLeaving && nextBeat
                ? easeRange(frame, nextBeat.clickFrame - 4, nextBeat.clickFrame + 14, 1, 0, Eases.softInOut)
                : easeRange(frame, beat.clickFrame, beat.clickFrame + 18, 0, 1, Eases.softLand);
              const panelY = isLeaving && nextBeat
                ? easeRange(frame, nextBeat.clickFrame - 4, nextBeat.clickFrame + 14, 0, -18, Eases.softInOut)
                : easeRange(frame, beat.clickFrame, beat.clickFrame + 18, 24, 0, Eases.softLand);

              return (
                <ProjectBreakdownPanel
                  key={beat.id}
                  project={proj}
                  opacity={panelOp}
                  translateY={panelY}
                />
              );
            })}
          </div>
        </div>
      )}

      {frame >= 94 && (
        <SceneCaption
          name="Scene 6 Caption"
          prefix={captionPrefix}
          accent={captionAccent}
          secondaryPrefix={secondaryCaptionPrefix}
          secondaryAccent={secondaryCaptionAccent}
          crossfadeOpacity={captionCrossfade}
          opacity={copyOp * exitOp}
          driftX={copyDriftX}
          offsetY={copyY + exitY * 0.5}
          style={{ position: 'absolute', left: 100, right: 100, bottom: 58 }}
        />
      )}
    </>
  );
};

export const Scene6SabahFutureMap = Interactive.create({
  Component: Scene6Inner,
  layout: 'absolute-fill',
  schema: {
    tensionCopy: { type: 'string', default: SCENE_TIMING.scene6.props.tensionCopy, description: 'Tension beat text' },
    captionPrefix: { type: 'string', default: SCENE_TIMING.scene6.props.captionPrefix, description: 'Caption prefix' },
    captionAccent: { type: 'string', default: SCENE_TIMING.scene6.props.captionAccent, description: 'Caption accent' },
    secondaryCaptionPrefix: {
      type: 'string',
      default: SCENE_TIMING.scene6.props.secondaryCaptionPrefix,
      description: 'Pin click caption prefix',
    },
    secondaryCaptionAccent: {
      type: 'string',
      default: SCENE_TIMING.scene6.props.secondaryCaptionAccent,
      description: 'Pin click caption accent',
    },
  },
});
