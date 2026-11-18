import React from 'react';
import { Audio } from '@remotion/media';
import { AbsoluteFill, interpolate, staticFile, Track } from 'remotion';
import { Scene1WorldHook } from './scenes/Scene1WorldHook';
import { Scene2MatchCutEntrance } from './scenes/Scene2MatchCutEntrance';
import { Scene3GlossaryFlashcards } from './scenes/Scene3GlossaryFlashcards';
import { Scene4QuizMomentum } from './scenes/Scene4QuizMomentum';
import { Scene5LeaderboardPodium } from './scenes/Scene5LeaderboardPodium';
import { Scene6SabahFutureMap } from './scenes/Scene6SabahFutureMap';
import { Scene7FinaleLockup } from './scenes/Scene7FinaleLockup';
import {
  LAUNCH_FPS,
  SCENE_TIMING,
  SFX_CUES,
  TOTAL_DURATION_FRAMES,
  UI_CLICK_CUES,
  type AudioCue,
} from './timeline';

type SesiLaunchVideoProps = {
  readonly bgm?: boolean;
};

const renderCueTrack = (name: string, cues: readonly AudioCue[]) => (
  <Track name={name}>
    {cues.map((cue) => (
      <Audio
        key={`${cue.name}-${cue.from}`}
        name={cue.name}
        src={staticFile(cue.src)}
        from={cue.from}
        durationInFrames={cue.durationInFrames}
        volume={cue.volume}
      />
    ))}
  </Track>
);

export const SesiLaunchVideo: React.FC<SesiLaunchVideoProps> = ({ bgm = true }) => {
  const { scene1, scene2, scene3, scene4, scene5, scene6, scene7 } = SCENE_TIMING;
  const fadeStart = TOTAL_DURATION_FRAMES - 2 * LAUNCH_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8fafc' }}>
      <Track name="Scenes">
        <Scene1WorldHook
          name={scene1.name}
          from={scene1.from}
          durationInFrames={scene1.durationInFrames}
          {...scene1.props}
        />
        <Scene2MatchCutEntrance
          name={scene2.name}
          from={scene2.from}
          durationInFrames={scene2.durationInFrames}
          {...scene2.props}
        />
        <Scene3GlossaryFlashcards
          name={scene3.name}
          from={scene3.from}
          durationInFrames={scene3.durationInFrames}
          {...scene3.props}
        />
        <Scene4QuizMomentum
          name={scene4.name}
          from={scene4.from}
          durationInFrames={scene4.durationInFrames}
          {...scene4.props}
        />
        <Scene5LeaderboardPodium
          name={scene5.name}
          from={scene5.from}
          durationInFrames={scene5.durationInFrames}
          {...scene5.props}
        />
        <Scene6SabahFutureMap
          name={scene6.name}
          from={scene6.from}
          durationInFrames={scene6.durationInFrames}
          {...scene6.props}
        />
        <Scene7FinaleLockup
          name={scene7.name}
          from={scene7.from}
          durationInFrames={scene7.durationInFrames}
          {...scene7.props}
        />
      </Track>

      {bgm && (
        <Track name="Music">
          <Audio
            name="Keynote Underscore"
            src={staticFile('sfx/ambient-bed-60s.wav')}
            from={0}
            durationInFrames={TOTAL_DURATION_FRAMES}
            volume={(f) =>
              interpolate(f, [fadeStart, TOTAL_DURATION_FRAMES - 1], [1.0, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            }
          />
        </Track>
      )}

      {renderCueTrack('SFX', SFX_CUES)}
      {renderCueTrack('UI Clicks & Sparkle', UI_CLICK_CUES)}
    </AbsoluteFill>
  );
};
