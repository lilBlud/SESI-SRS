import React from 'react';
import { Audio } from '@remotion/media';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { AbsoluteFill, interpolate, staticFile, Track, useCurrentFrame } from 'remotion';
import { TrimmedShotBody } from './components/MotionCameraVideo';
import { VIDEO_SHOTS } from './data/interviewShots';
import {
  BlurFocusTransition,
  DirectionalPushTransition,
  PeakWipePresentation,
} from './scenes/PeakWipe';
import {
  BridgeKeywordBeat,
  ClosingLockupScene,
  TurnPartAScene,
  TurnPartBScene,
} from './scenes/TypographicBeats';
import { PALETTE } from './theme';
import {
  AIDEN_SFX_CUES,
  BEAT_DURATIONS,
  MUSIC_DUCK_FRAMES,
  MUSIC_DUCK_VOLUMES,
  TOTAL_DURATION_FRAMES,
  TRANSITION_DURATIONS,
} from './timeline';

export interface AidenPromoProps {
  readonly bgm?: boolean;
}

export const AidenPromoVideo: React.FC<AidenPromoProps> = ({ bgm = true }) => {
  const frame = useCurrentFrame();

  const musicVolume = interpolate(
    frame,
    [...MUSIC_DUCK_FRAMES],
    [...MUSIC_DUCK_VOLUMES],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const blur34 = linearTiming({ durationInFrames: TRANSITION_DURATIONS.focus34 });
  const push28 = linearTiming({ durationInFrames: TRANSITION_DURATIONS.push28 });
  const wipe30 = linearTiming({ durationInFrames: TRANSITION_DURATIONS.wipe30 });
  const soft18 = linearTiming({ durationInFrames: TRANSITION_DURATIONS.soft18 });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgMidnight }}>
      <TransitionSeries name="Film Cut">
        <TransitionSeries.Sequence name={VIDEO_SHOTS.teaser.sequenceName} durationInFrames={BEAT_DURATIONS.teaser}>
          <TrimmedShotBody shot={VIDEO_SHOTS.teaser} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: BlurFocusTransition, props: {} }} timing={blur34} />

        <TransitionSeries.Sequence name={VIDEO_SHOTS.binders.sequenceName} durationInFrames={BEAT_DURATIONS.binders}>
          <TrimmedShotBody shot={VIDEO_SHOTS.binders} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: DirectionalPushTransition, props: {} }} timing={push28} />

        <TransitionSeries.Sequence name={VIDEO_SHOTS.psiFail.sequenceName} durationInFrames={BEAT_DURATIONS.psiFail}>
          <TrimmedShotBody shot={VIDEO_SHOTS.psiFail} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: PeakWipePresentation, props: {} }} timing={push28} />

        <TransitionSeries.Sequence name="04 Turn Statement" durationInFrames={BEAT_DURATIONS.turnA}>
          <TurnPartAScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: PeakWipePresentation, props: {} }} timing={push28} />

        <TransitionSeries.Sequence name="05 AIDEN Reveal" durationInFrames={BEAT_DURATIONS.turnB}>
          <TurnPartBScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: PeakWipePresentation, props: {} }} timing={wipe30} />

        <TransitionSeries.Sequence name={VIDEO_SHOTS.aidenDemo.sequenceName} durationInFrames={BEAT_DURATIONS.aidenDemo}>
          <TrimmedShotBody shot={VIDEO_SHOTS.aidenDemo} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: BlurFocusTransition, props: {} }} timing={soft18} />

        <TransitionSeries.Sequence name={VIDEO_SHOTS.m1.sequenceName} durationInFrames={BEAT_DURATIONS.m1}>
          <TrimmedShotBody shot={VIDEO_SHOTS.m1} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: PeakWipePresentation, props: {} }} timing={push28} />

        <TransitionSeries.Sequence name="08 Bridge Draft Verify Approve" durationInFrames={BEAT_DURATIONS.brStatus}>
          <BridgeKeywordBeat mode="status" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: PeakWipePresentation, props: {} }} timing={push28} />

        <TransitionSeries.Sequence name={VIDEO_SHOTS.m2a.sequenceName} durationInFrames={BEAT_DURATIONS.m2a}>
          <TrimmedShotBody shot={VIDEO_SHOTS.m2a} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: PeakWipePresentation, props: {} }} timing={push28} />

        <TransitionSeries.Sequence name="10 Bridge Auto Notify" durationInFrames={BEAT_DURATIONS.brNotify}>
          <BridgeKeywordBeat mode="notify" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: PeakWipePresentation, props: {} }} timing={push28} />

        <TransitionSeries.Sequence name={VIDEO_SHOTS.m2b.sequenceName} durationInFrames={BEAT_DURATIONS.m2b}>
          <TrimmedShotBody shot={VIDEO_SHOTS.m2b} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: BlurFocusTransition, props: {} }} timing={blur34} />

        <TransitionSeries.Sequence name={VIDEO_SHOTS.m3.sequenceName} durationInFrames={BEAT_DURATIONS.m3}>
          <TrimmedShotBody shot={VIDEO_SHOTS.m3} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: PeakWipePresentation, props: {} }} timing={push28} />

        <TransitionSeries.Sequence name="13 Bridge Formats" durationInFrames={BEAT_DURATIONS.brUpload}>
          <BridgeKeywordBeat mode="upload" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: BlurFocusTransition, props: {} }} timing={blur34} />

        <TransitionSeries.Sequence name={VIDEO_SHOTS.female.sequenceName} durationInFrames={BEAT_DURATIONS.female}>
          <TrimmedShotBody shot={VIDEO_SHOTS.female} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={{ component: BlurFocusTransition, props: {} }} timing={blur34} />

        <TransitionSeries.Sequence name="15 Closing Lockup" durationInFrames={BEAT_DURATIONS.close}>
          <ClosingLockupScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {bgm && (
        <Track name="Score">
          <Audio
            name="Score Bed"
            src={staticFile('audio/bgm-corporate.wav')}
            trimBefore={120}
            volume={musicVolume}
            durationInFrames={TOTAL_DURATION_FRAMES}
          />
        </Track>
      )}

      <Track name="SFX">
        {AIDEN_SFX_CUES.map((cue) => (
          <Audio
            key={`${cue.name}-${cue.from}`}
            name={cue.name}
            src={staticFile(cue.src)}
            from={cue.from}
            volume={cue.volume}
          />
        ))}
      </Track>
    </AbsoluteFill>
  );
};
