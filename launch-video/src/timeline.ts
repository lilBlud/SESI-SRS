export const LAUNCH_FPS = 30;
export const LAUNCH_WIDTH = 1920;
export const LAUNCH_HEIGHT = 1080;

export const SCENE_TIMING = {
  scene1: {
    id: '01-World-Hook',
    name: '01 World & Hook',
    from: 0,
    durationInFrames: 6 * LAUNCH_FPS, // 180
    props: {
      line1Prefix: 'Sabah energy',
      line1Accent: 'guide.',
      line2Prefix: 'Meet',
      line2Accent: 'SESI',
    },
  },
  scene2: {
    id: '02-Match-Cut-Entrance',
    name: '02 Match-Cut Entrance',
    from: 6 * LAUNCH_FPS, // 180
    durationInFrames: 5 * LAUNCH_FPS, // 150
    props: {
      captionPrefix: 'Dictionary, quizzes, and',
      captionAccent: 'grid data.',
      hubTitle: 'Knowledge Hub',
    },
  },
  scene3: {
    id: '03-Glossary-Flashcards',
    name: '03 Glossary & Save PDF',
    from: 11 * LAUNCH_FPS, // 330
    durationInFrames: 15 * LAUNCH_FPS, // 450
    props: {
      captionPrefix: 'Regulatory terms with',
      captionAccent: 'real formulas.',
      secondaryCaptionPrefix: 'Save bookmarks and',
      secondaryCaptionAccent: 'print your guide.',
    },
  },
  scene4: {
    id: '04-Quiz-Momentum',
    name: '04 Quiz & Streak Momentum',
    from: 26 * LAUNCH_FPS, // 780
    durationInFrames: 13 * LAUNCH_FPS, // 390
    props: {
      quizTitle: 'November 2026 Quiz',
      captionPrefix: 'Monthly quizzes that',
      captionAccent: 'track your streak.',
    },
  },
  scene5: {
    id: '05-Leaderboard-Podium',
    name: '05 Leaderboard Podium',
    from: 39 * LAUNCH_FPS, // 1170
    durationInFrames: 5 * LAUNCH_FPS, // 150
    props: {
      boardTitle: 'Monthly Leaderboard',
      boardMonth: 'November 2026',
      captionPrefix: 'See where you',
      captionAccent: 'rank this month.',
    },
  },
  scene6: {
    id: '06-Sabah-Future-Map',
    name: '06 Sabah Future Gen Map',
    from: 44 * LAUNCH_FPS, // 1320
    durationInFrames: 12 * LAUNCH_FPS, // 360
    props: {
      tensionCopy: 'Sabah 2030 grid plan',
      captionPrefix: '7 future plants',
      captionAccent: 'across Sabah.',
      secondaryCaptionPrefix: 'Tap any pin for',
      secondaryCaptionAccent: 'live plant details.',
    },
  },
  scene7: {
    id: '07-Finale-Lockup',
    name: '07 Finale Lockup',
    from: 56 * LAUNCH_FPS, // 1680
    durationInFrames: 3 * LAUNCH_FPS, // 90
    props: {
      title: 'SESI',
      subtitle: 'Sabah Electricity Supply Industry',
    },
  },
} as const;

export const TOTAL_DURATION_FRAMES =
  SCENE_TIMING.scene7.from + SCENE_TIMING.scene7.durationInFrames; // 1770 (59.0s)

export interface AudioCue {
  readonly name: string;
  readonly src: string;
  readonly from: number;
  readonly durationInFrames: number;
  readonly volume: number;
}

const AAC_PRIMING_OFFSET = -1;
const cueAt = (sceneFrom: number, localFrame: number) =>
  Math.max(0, sceneFrom + localFrame + AAC_PRIMING_OFFSET);

export const SFX_CUES: readonly AudioCue[] = [
  { name: 'Contour Pulse Whoosh', src: 'sfx/whoosh-soft.wav', from: 0, durationInFrames: 15, volume: 0.55 },
  { name: 'Device Z-Reveal', src: 'sfx/whoosh-soft.wav', from: cueAt(SCENE_TIMING.scene2.from, 0), durationInFrames: 15, volume: 0.45 },
  { name: 'Glossary Whip Pan', src: 'sfx/whip.wav', from: cueAt(SCENE_TIMING.scene2.from, 138), durationInFrames: 10, volume: 0.6 },
  { name: 'IBR Flip', src: 'sfx/card-flip.wav', from: cueAt(SCENE_TIMING.scene3.from, 46), durationInFrames: 8, volume: 0.6 },
  { name: 'Bookmark Pop', src: 'sfx/pop-save.wav', from: cueAt(SCENE_TIMING.scene3.from, 96), durationInFrames: 9, volume: 0.8 },
  { name: 'SAIDI Flip', src: 'sfx/card-flip.wav', from: cueAt(SCENE_TIMING.scene3.from, 152), durationInFrames: 8, volume: 0.8 },
  { name: 'SAIDI Bookmark Pop', src: 'sfx/pop-save.wav', from: cueAt(SCENE_TIMING.scene3.from, 192), durationInFrames: 9, volume: 0.8 },
  { name: 'Print Sheet Reveal', src: 'sfx/whoosh-soft.wav', from: cueAt(SCENE_TIMING.scene3.from, 242), durationInFrames: 15, volume: 0.62 },
  { name: 'Quiz Shockwave', src: 'sfx/shockwave-chime.wav', from: cueAt(SCENE_TIMING.scene4.from, 68), durationInFrames: 23, volume: 0.75 },
  { name: 'Streak Whip Up', src: 'sfx/whip.wav', from: cueAt(SCENE_TIMING.scene4.from, 185), durationInFrames: 10, volume: 0.75 },
  { name: 'Podium Shimmer', src: 'sfx/podium-rise.wav', from: cueAt(SCENE_TIMING.scene5.from, 10), durationInFrames: 27, volume: 0.8 },
  { name: 'Tension Riser', src: 'sfx/riser.wav', from: cueAt(SCENE_TIMING.scene6.from, 36), durationInFrames: 36, volume: 0.72 },
  { name: 'Sabah Grid Ignite', src: 'sfx/grid-ignite.wav', from: cueAt(SCENE_TIMING.scene6.from, 72), durationInFrames: 36, volume: 0.8 },
  { name: 'Finale Chord', src: 'sfx/finale-resolve.wav', from: cueAt(SCENE_TIMING.scene7.from, 1), durationInFrames: 48, volume: 0.78 },
];

export const UI_CLICK_CUES: readonly AudioCue[] = [
  { name: 'Save as PDF Tap', src: 'sfx/tap-click.wav', from: cueAt(SCENE_TIMING.scene3.from, 240), durationInFrames: 4, volume: 0.78 },
  { name: 'Print PDF Export Tap', src: 'sfx/tap-click.wav', from: cueAt(SCENE_TIMING.scene3.from, 342), durationInFrames: 4, volume: 0.78 },
  { name: 'Print Export Sparkle', src: 'sfx/sparkle.wav', from: cueAt(SCENE_TIMING.scene3.from, 347), durationInFrames: 28, volume: 0.62 },
  { name: 'Start Quiz Tap', src: 'sfx/tap-click.wav', from: cueAt(SCENE_TIMING.scene4.from, 68), durationInFrames: 4, volume: 0.75 },
  { name: 'Answer C Tap', src: 'sfx/tap-click.wav', from: cueAt(SCENE_TIMING.scene4.from, 150), durationInFrames: 4, volume: 0.75 },
  { name: 'Grid Sparkle', src: 'sfx/sparkle.wav', from: cueAt(SCENE_TIMING.scene6.from, 108), durationInFrames: 28, volume: 0.68 },
  { name: 'Pin 2 Tecoma Tap', src: 'sfx/tap-click.wav', from: cueAt(SCENE_TIMING.scene6.from, 192), durationInFrames: 4, volume: 0.78 },
  { name: 'Pin 6 Sequioa Tap', src: 'sfx/tap-click.wav', from: cueAt(SCENE_TIMING.scene6.from, 268), durationInFrames: 4, volume: 0.78 },
  { name: 'Finale Sparkle', src: 'sfx/sparkle.wav', from: cueAt(SCENE_TIMING.scene7.from, 37), durationInFrames: 28, volume: 0.65 },
];
