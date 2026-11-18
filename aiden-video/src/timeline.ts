export const FPS = 30;

/**
 * Individual beat durations in frames (sum = 2494; 14 transition overlaps sum = 408 -> 2086f = 69.53s).
 */
export const BEAT_DURATIONS = {
  teaser: 246, // 8.20s
  binders: 144, // 4.80s
  psiFail: 158, // 5.27s
  turnA: 74, // 2.47s
  turnB: 98, // 3.27s
  aidenDemo: 300, // 10.00s
  m1: 348, // 11.60s
  brStatus: 74, // 2.47s
  m2a: 122, // 4.07s
  brNotify: 74, // 2.47s
  m2b: 144, // 4.80s
  m3: 222, // 7.40s
  brUpload: 74, // 2.47s
  female: 330, // 11.00s
  close: 86, // 2.87s
} as const;

export const TRANSITION_DURATIONS = {
  focus34: 34, // 1.13s slow optical focus dissolve
  wipe30: 30, // 1.00s slow feathered reveal wipe
  push28: 28, // 0.93s directional wipe/push
  soft18: 18, // 0.60s demo -> interview dissolve
} as const;

const SCENE_LIST = [
  BEAT_DURATIONS.teaser,
  BEAT_DURATIONS.binders,
  BEAT_DURATIONS.psiFail,
  BEAT_DURATIONS.turnA,
  BEAT_DURATIONS.turnB,
  BEAT_DURATIONS.aidenDemo,
  BEAT_DURATIONS.m1,
  BEAT_DURATIONS.brStatus,
  BEAT_DURATIONS.m2a,
  BEAT_DURATIONS.brNotify,
  BEAT_DURATIONS.m2b,
  BEAT_DURATIONS.m3,
  BEAT_DURATIONS.brUpload,
  BEAT_DURATIONS.female,
  BEAT_DURATIONS.close,
] as const;

const OVERLAP_LIST = [
  TRANSITION_DURATIONS.focus34, // teaser -> binders
  TRANSITION_DURATIONS.push28, // binders -> psiFail
  TRANSITION_DURATIONS.push28, // psiFail -> turnA
  TRANSITION_DURATIONS.push28, // turnA -> turnB
  TRANSITION_DURATIONS.wipe30, // turnB -> aidenDemo
  TRANSITION_DURATIONS.soft18, // aidenDemo -> m1
  TRANSITION_DURATIONS.push28, // m1 -> brStatus
  TRANSITION_DURATIONS.push28, // brStatus -> m2a
  TRANSITION_DURATIONS.push28, // m2a -> brNotify
  TRANSITION_DURATIONS.push28, // brNotify -> m2b
  TRANSITION_DURATIONS.focus34, // m2b -> m3
  TRANSITION_DURATIONS.push28, // m3 -> brUpload
  TRANSITION_DURATIONS.focus34, // brUpload -> female
  TRANSITION_DURATIONS.focus34, // female -> close
] as const;

export const TOTAL_DURATION_FRAMES =
  SCENE_LIST.reduce((acc, d) => acc + d, 0) -
  OVERLAP_LIST.reduce((acc, t) => acc + t, 0); // 2086

export const MUSIC_DUCK_FRAMES = [
  0, 206, 236, 448, 478, 558, 594, 824, 870, 1166, 1222, 1306, 1362, 1656,
  1710, 1986, 2012, 2066, 2085,
] as const;

export const MUSIC_DUCK_VOLUMES = [
  0, 0, 0.055, 0.055, 0.12, 0.12, 0.06, 0.06, 0.04, 0.09, 0.04, 0.09, 0.04,
  0.09, 0.04, 0.04, 0.11, 0.06, 0,
] as const;

export interface AidenAudioCue {
  readonly name: string;
  readonly src: string;
  readonly from: number;
  readonly volume: number;
}

export const AIDEN_SFX_CUES: readonly AidenAudioCue[] = [
  { name: 'PSI Error Hit', src: 'audio/error-alert.wav', from: 403, volume: 0.28 },
  { name: 'Peak Wipe Whoosh', src: 'audio/whoosh.wav', from: 454, volume: 0.3 },
  { name: 'Approve UI Pop', src: 'audio/ui-pop.wav', from: 1192, volume: 0.25 },
  { name: 'Auto Notify Chime', src: 'audio/notify-chime.wav', from: 1333, volume: 0.28 },
  { name: 'Formats Pop', src: 'audio/ui-pop.wav', from: 1682, volume: 0.24 },
  { name: 'Closing Chord', src: 'audio/closing-chord.wav', from: 2000, volume: 0.26 },
];
