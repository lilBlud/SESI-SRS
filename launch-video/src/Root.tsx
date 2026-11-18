import React from 'react';
import { Composition, Folder } from 'remotion';
import { SesiLaunchVideo } from './Composition';
import { Scene1WorldHook } from './scenes/Scene1WorldHook';
import { Scene2MatchCutEntrance } from './scenes/Scene2MatchCutEntrance';
import { Scene3GlossaryFlashcards } from './scenes/Scene3GlossaryFlashcards';
import { Scene4QuizMomentum } from './scenes/Scene4QuizMomentum';
import { Scene5LeaderboardPodium } from './scenes/Scene5LeaderboardPodium';
import { Scene6SabahFutureMap } from './scenes/Scene6SabahFutureMap';
import { Scene7FinaleLockup } from './scenes/Scene7FinaleLockup';
import {
  LAUNCH_FPS,
  LAUNCH_HEIGHT,
  LAUNCH_WIDTH,
  SCENE_TIMING,
  TOTAL_DURATION_FRAMES,
} from './timeline';

export const RemotionRoot: React.FC = () => {
  const { scene1, scene2, scene3, scene4, scene5, scene6, scene7 } = SCENE_TIMING;

  return (
    <>
      <Composition
        id="SesiLaunchVideo"
        component={SesiLaunchVideo}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={LAUNCH_FPS}
        width={LAUNCH_WIDTH}
        height={LAUNCH_HEIGHT}
        defaultProps={{ bgm: true }}
      />
      <Folder name="Scenes">
        <Composition
          id={scene1.id}
          component={Scene1WorldHook}
          durationInFrames={scene1.durationInFrames}
          fps={LAUNCH_FPS}
          width={LAUNCH_WIDTH}
          height={LAUNCH_HEIGHT}
          defaultProps={scene1.props}
        />
        <Composition
          id={scene2.id}
          component={Scene2MatchCutEntrance}
          durationInFrames={scene2.durationInFrames}
          fps={LAUNCH_FPS}
          width={LAUNCH_WIDTH}
          height={LAUNCH_HEIGHT}
          defaultProps={scene2.props}
        />
        <Composition
          id={scene3.id}
          component={Scene3GlossaryFlashcards}
          durationInFrames={scene3.durationInFrames}
          fps={LAUNCH_FPS}
          width={LAUNCH_WIDTH}
          height={LAUNCH_HEIGHT}
          defaultProps={scene3.props}
        />
        <Composition
          id={scene4.id}
          component={Scene4QuizMomentum}
          durationInFrames={scene4.durationInFrames}
          fps={LAUNCH_FPS}
          width={LAUNCH_WIDTH}
          height={LAUNCH_HEIGHT}
          defaultProps={scene4.props}
        />
        <Composition
          id={scene5.id}
          component={Scene5LeaderboardPodium}
          durationInFrames={scene5.durationInFrames}
          fps={LAUNCH_FPS}
          width={LAUNCH_WIDTH}
          height={LAUNCH_HEIGHT}
          defaultProps={scene5.props}
        />
        <Composition
          id={scene6.id}
          component={Scene6SabahFutureMap}
          durationInFrames={scene6.durationInFrames}
          fps={LAUNCH_FPS}
          width={LAUNCH_WIDTH}
          height={LAUNCH_HEIGHT}
          defaultProps={scene6.props}
        />
        <Composition
          id={scene7.id}
          component={Scene7FinaleLockup}
          durationInFrames={scene7.durationInFrames}
          fps={LAUNCH_FPS}
          width={LAUNCH_WIDTH}
          height={LAUNCH_HEIGHT}
          defaultProps={scene7.props}
        />
      </Folder>
    </>
  );
};
