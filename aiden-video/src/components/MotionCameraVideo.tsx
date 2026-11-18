import React from 'react';
import { Video } from '@remotion/media';
import { interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import type { VideoShotConfig } from '../data/interviewShots';
import { accelExit, progress } from '../motion';
import { PALETTE } from '../theme';
import { Nameplate } from './Nameplate';
import { Subtitles } from './Subtitles';

const smoothAudioFade = (
  frame: number,
  trimBefore: number,
  durationInFrames: number,
  baseVolume = 0.78,
) => {
  const end = trimBefore + durationInFrames - 1;
  const fadeIn = interpolate(frame, [trimBefore, trimBefore + 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [end - 10, end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return baseVolume * Math.min(fadeIn, fadeOut);
};

export const MotionCameraVideo: React.FC<{
  readonly name: string;
  readonly src: string;
  readonly trimBefore: number;
  readonly durationInFrames: number;
  readonly scaleFrom: number;
  readonly scaleTo: number;
  readonly origin?: string;
  readonly volumeScale?: number;
}> = ({
  name,
  src,
  trimBefore,
  durationInFrames,
  scaleFrom,
  scaleTo,
  origin = '50% 42%',
  volumeScale = 0.84,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - trimBefore;
  const t = Math.max(0, Math.min(1, localFrame / Math.max(1, durationInFrames)));
  const zoom = interpolate(t, [0, 1], [scaleFrom, scaleTo]);
  const exitShift =
    accelExit(progress(localFrame, 6, durationInFrames - 6)) * -12;
  const volume = smoothAudioFade(frame, trimBefore, durationInFrames, volumeScale);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: PALETTE.bgMidnight }}>
      <Video
        name={name}
        src={src}
        volume={volume}
        objectFit="cover"
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${zoom}) translateX(${exitShift}px)`,
          transformOrigin: origin,
        }}
      />
    </div>
  );
};

export const TrimmedShotBody: React.FC<{ readonly shot: VideoShotConfig }> = ({ shot }) => (
  <>
    <Sequence
      name={shot.trimName}
      layout="none"
      trimBefore={shot.trimBefore}
      durationInFrames={shot.durationInFrames}
    >
      <MotionCameraVideo
        name={shot.videoName}
        src={staticFile(shot.src)}
        trimBefore={shot.trimBefore}
        durationInFrames={shot.durationInFrames}
        scaleFrom={shot.scaleFrom}
        scaleTo={shot.scaleTo}
        origin={shot.origin}
        volumeScale={shot.volumeScale}
      />
      {shot.captions && (
        <Subtitles captions={shot.captions} combineMs={shot.combineMs} />
      )}
    </Sequence>
    {shot.nameplate && (
      <Sequence
        name={shot.nameplate.sequenceName}
        from={shot.nameplate.from}
        durationInFrames={shot.nameplate.durationInFrames}
      >
        <Nameplate
          fullName={shot.nameplate.fullName}
          roleLine={shot.nameplate.roleLine}
        />
      </Sequence>
    )}
  </>
);
