import React from 'react';
import { Composition } from 'remotion';
import { AidenPromoVideo } from './AidenPromoVideo';
import { ClosingLockupScene, TurnPartBScene } from './scenes/TypographicBeats';
import { BEAT_DURATIONS, FPS, TOTAL_DURATION_FRAMES } from './timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AidenPromoVideo"
        component={AidenPromoVideo}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          bgm: true,
        }}
      />
      <Composition
        id="TurnAIDEN"
        component={TurnPartBScene}
        durationInFrames={BEAT_DURATIONS.turnB}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="ClosingLockup"
        component={ClosingLockupScene}
        durationInFrames={BEAT_DURATIONS.close}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
