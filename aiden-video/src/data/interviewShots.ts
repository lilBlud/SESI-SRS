import type { Caption } from '@remotion/captions';
import { BEAT_DURATIONS } from '../timeline';

export interface VideoShotConfig {
  readonly id: string;
  readonly sequenceName: string;
  readonly trimName: string;
  readonly videoName: string;
  readonly src: string;
  readonly trimBefore: number;
  readonly durationInFrames: number;
  readonly scaleFrom: number;
  readonly scaleTo: number;
  readonly origin: string;
  readonly volumeScale: number;
  readonly captions?: readonly Caption[];
  readonly combineMs?: number;
  readonly nameplate?: {
    readonly sequenceName: string;
    readonly from: number;
    readonly durationInFrames: number;
    readonly fullName: string;
    readonly roleLine: string;
  };
}

export const VIDEO_SHOTS: Record<string, VideoShotConfig> = {
  teaser: {
    id: 'teaser',
    sequenceName: '01 Teaser Sting',
    trimName: 'Teaser Trim',
    videoName: 'Teaser Video',
    src: 'video/01-teaser.mp4',
    trimBefore: 6,
    durationInFrames: BEAT_DURATIONS.teaser,
    scaleFrom: 1.0,
    scaleTo: 1.04,
    origin: '50% 50%',
    volumeScale: 0.78,
  },
  binders: {
    id: 'binders',
    sequenceName: '02 Physical ISO Stack',
    trimName: 'Binders Trim',
    videoName: 'Binders Footage',
    src: 'video/02a-binders.mp4',
    trimBefore: 24,
    durationInFrames: BEAT_DURATIONS.binders,
    scaleFrom: 1.0,
    scaleTo: 1.09,
    origin: '55% 60%',
    volumeScale: 0.78,
  },
  psiFail: {
    id: 'psiFail',
    sequenceName: '03 Legacy PSI Crash',
    trimName: 'PSI Fail Trim',
    videoName: 'PSI Error Footage',
    src: 'video/02b-psi-fail.mp4',
    trimBefore: 42,
    durationInFrames: BEAT_DURATIONS.psiFail,
    scaleFrom: 1.02,
    scaleTo: 1.09,
    origin: '32% 45%',
    volumeScale: 0.8,
  },
  aidenDemo: {
    id: 'aidenDemo',
    sequenceName: '06 AIDEN Live Workflow',
    trimName: 'AIDEN Demo Trim',
    videoName: 'AIDEN Desktop Footage',
    src: 'video/02c-aiden-demo.mp4',
    trimBefore: 27,
    durationInFrames: BEAT_DURATIONS.aidenDemo,
    scaleFrom: 1.01,
    scaleTo: 1.07,
    origin: '44% 48%',
    volumeScale: 0.8,
    captions: [
      { text: 'Wah,', startMs: 9380, endMs: 9820, timestampMs: 9600, confidence: null },
      { text: ' laju', startMs: 9900, endMs: 10250, timestampMs: 10075, confidence: null },
      { text: ' juga!', startMs: 10250, endMs: 10680, timestampMs: 10465, confidence: null },
    ],
  },
  m1: {
    id: 'm1',
    sequenceName: '07 Mohd Hamdan Status',
    trimName: 'M1 Status Footage',
    videoName: 'M1 Interview',
    src: 'video/03-interview-male.mp4',
    trimBefore: 0,
    durationInFrames: BEAT_DURATIONS.m1,
    scaleFrom: 1.0,
    scaleTo: 1.08,
    origin: '48% 36%',
    volumeScale: 0.78,
    nameplate: {
      sequenceName: 'Mohd Hamdan Nameplate',
      from: 18,
      durationInFrames: 118,
      fullName: 'Mohd Hamdan Mohd Husin',
      roleLine: 'Engineer, Generation Division',
    },
    captions: [
      { text: 'Sistem', startMs: 180, endMs: 720, timestampMs: 450, confidence: null },
      { text: ' AIDEN', startMs: 720, endMs: 1200, timestampMs: 960, confidence: null },
      { text: ' baru', startMs: 1200, endMs: 1580, timestampMs: 1390, confidence: null },
      { text: ' berbanding', startMs: 2520, endMs: 3200, timestampMs: 2860, confidence: null },
      { text: ' dengan', startMs: 3200, endMs: 3650, timestampMs: 3425, confidence: null },
      { text: ' PSI', startMs: 3650, endMs: 4180, timestampMs: 3915, confidence: null },
      { text: ' lama,', startMs: 4180, endMs: 4580, timestampMs: 4380, confidence: null },
      { text: ' satu,', startMs: 4920, endMs: 5600, timestampMs: 5260, confidence: null },
      { text: ' dia', startMs: 6400, endMs: 6950, timestampMs: 6675, confidence: null },
      { text: ' ada', startMs: 6950, endMs: 7400, timestampMs: 7175, confidence: null },
      { text: ' dashboard', startMs: 7400, endMs: 8250, timestampMs: 7825, confidence: null },
      { text: ' pemantauan', startMs: 8250, endMs: 9200, timestampMs: 8725, confidence: null },
      { text: ' status', startMs: 9200, endMs: 9850, timestampMs: 9525, confidence: null },
      { text: ' prosedur.', startMs: 9850, endMs: 10680, timestampMs: 10265, confidence: null },
    ],
  },
  m2a: {
    id: 'm2a',
    sequenceName: '09 Proof Notify A',
    trimName: 'M2a Auto Notify',
    videoName: 'M2a Interview',
    src: 'video/03-interview-male.mp4',
    trimBefore: 1054,
    durationInFrames: BEAT_DURATIONS.m2a,
    scaleFrom: 1.18,
    scaleTo: 1.24,
    origin: '46% 30%',
    volumeScale: 0.78,
    captions: [
      { text: 'Kita', startMs: 35720, endMs: 36220, timestampMs: 35970, confidence: null },
      { text: ' ada', startMs: 36220, endMs: 36620, timestampMs: 36420, confidence: null },
      { text: ' sistem', startMs: 36620, endMs: 37220, timestampMs: 36920, confidence: null },
      { text: ' notifikasi', startMs: 37220, endMs: 37900, timestampMs: 37560, confidence: null },
      { text: ' automatik.', startMs: 37900, endMs: 38600, timestampMs: 38250, confidence: null },
    ],
  },
  m2b: {
    id: 'm2b',
    sequenceName: '11 Proof Notify B',
    trimName: 'M2b Verifier Approver',
    videoName: 'M2b Interview',
    src: 'video/03-interview-male.mp4',
    trimBefore: 1282,
    durationInFrames: BEAT_DURATIONS.m2b,
    scaleFrom: 1.06,
    scaleTo: 1.13,
    origin: '48% 36%',
    volumeScale: 0.78,
    captions: [
      { text: 'Notify', startMs: 43380, endMs: 44150, timestampMs: 43765, confidence: null },
      { text: ' verifier', startMs: 44150, endMs: 45150, timestampMs: 44650, confidence: null },
      { text: ' dengan', startMs: 45150, endMs: 45850, timestampMs: 45500, confidence: null },
      { text: ' approver.', startMs: 45850, endMs: 46750, timestampMs: 46300, confidence: null },
    ],
  },
  m3: {
    id: 'm3',
    sequenceName: '12 Proof Unlimited',
    trimName: 'M3 Upload Footage',
    videoName: 'M3 Interview',
    src: 'video/03-interview-male.mp4',
    trimBefore: 1938,
    durationInFrames: BEAT_DURATIONS.m3,
    scaleFrom: 1.02,
    scaleTo: 1.12,
    origin: '48% 42%',
    volumeScale: 0.78,
    captions: [
      { text: 'Sistem', startMs: 65300, endMs: 65900, timestampMs: 65600, confidence: null },
      { text: ' AIDEN', startMs: 65900, endMs: 66450, timestampMs: 66175, confidence: null },
      { text: ' baru', startMs: 66450, endMs: 66950, timestampMs: 66700, confidence: null },
      { text: ' ni', startMs: 66950, endMs: 67350, timestampMs: 67150, confidence: null },
      { text: ' dia', startMs: 67350, endMs: 67650, timestampMs: 67500, confidence: null },
      { text: ' tiada', startMs: 67650, endMs: 68150, timestampMs: 67900, confidence: null },
      { text: ' had', startMs: 68150, endMs: 68500, timestampMs: 68325, confidence: null },
      { text: ' muat', startMs: 68550, endMs: 68900, timestampMs: 68725, confidence: null },
      { text: ' naik', startMs: 68900, endMs: 69250, timestampMs: 69075, confidence: null },
      { text: ' dokumen', startMs: 69250, endMs: 69950, timestampMs: 69600, confidence: null },
      { text: ' dan', startMs: 69950, endMs: 70350, timestampMs: 70150, confidence: null },
      { text: ' lampiran.', startMs: 70350, endMs: 71000, timestampMs: 70675, confidence: null },
    ],
  },
  female: {
    id: 'female',
    sequenceName: '14 Stakeholder Hope',
    trimName: 'F1 Hope Footage',
    videoName: 'F1 Interview',
    src: 'video/04-interview-female.mp4',
    trimBefore: 1446,
    durationInFrames: BEAT_DURATIONS.female,
    scaleFrom: 1.08,
    scaleTo: 1.15,
    origin: '28% 34%',
    volumeScale: 0.8,
    combineMs: 2000,
    captions: [
      { text: 'Semoga', startMs: 48620, endMs: 49080, timestampMs: 48850, confidence: null },
      { text: ' sistem', startMs: 49080, endMs: 49560, timestampMs: 49320, confidence: null },
      { text: ' AIDEN', startMs: 49560, endMs: 50150, timestampMs: 49855, confidence: null },
      { text: ' berjalan', startMs: 50550, endMs: 50950, timestampMs: 50750, confidence: null },
      { text: ' lancar', startMs: 50950, endMs: 51300, timestampMs: 51125, confidence: null },
      { text: ' insya-Allah,', startMs: 51450, endMs: 52400, timestampMs: 51925, confidence: null },
      { text: ' dan', startMs: 52650, endMs: 53250, timestampMs: 52950, confidence: null },
      { text: ' semoga', startMs: 53250, endMs: 53750, timestampMs: 53500, confidence: null },
      { text: ' SESB', startMs: 53750, endMs: 54300, timestampMs: 54025, confidence: null },
      { text: ' menjadi', startMs: 54650, endMs: 55550, timestampMs: 55100, confidence: null },
      { text: ' lebih', startMs: 55950, endMs: 56800, timestampMs: 56375, confidence: null },
      { text: ' produktif.', startMs: 56800, endMs: 58300, timestampMs: 57550, confidence: null },
    ],
  },
};
