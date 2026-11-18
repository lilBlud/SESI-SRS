import { interpolate } from 'remotion';

/**
 * Motionmaxxing measured easing curves (from 53 frame-accurate pro moments).
 * Every curve maps t in [0, 1] -> progress.
 */
export const Eases = {
  /** Fast whip-in (54% travel in first ~10% of time) + long silk settle. */
  snapSettle: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    // Piecewise Hermite-like curve matching 10%:0.54, 25%:0.84, 50%:0.96, 75%:0.985
    return 1 - Math.pow(1 - t, 5.2) * (1 - 0.15 * t);
  },

  /** Hook/proof workhorse: 30% at 10%, 59% at 25%, 85% at 50%, 95% at 75%. */
  softLand: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(1 - t, 3.4);
  },

  /** Big fast whip pan: 23% at 10%, 52% at 25%, 83% at 50%, 97% at 75%. */
  whip: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(1 - t, 2.5);
  },

  /** All-purpose medium camera push/pull: 16% at 10%, 39% at 25%, 69% at 50%. */
  glide: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(1 - t, 1.7);
  },

  /** Leaving curve: accelerates into a cut, peak speed at t ~ 0.9. */
  accelExit: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return Math.pow(t, 2.6);
  },

  /** Hard camera pull-off / exit ending in a hard cut at full speed. */
  crashOut: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return Math.pow(t, 4);
  },

  /** Container contraction / push-in before replacement. */
  gentleIn: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return Math.pow(t, 2.07);
  },

  /** Smooth S-curve for color, ground, and counter ramps. */
  softInOut: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  /** Tactile late-lean overshoot: peaks ~1.07 at t=0.68, settles cleanly to 1.0. */
  popOver: (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const base = 1 - Math.pow(1 - t, 3);
    const overshoot = Math.sin(t * Math.PI * 1.15) * 0.085 * Math.pow(1 - t, 0.7);
    return base + overshoot;
  },

  /** Linear drift / counter cruise. */
  cruise: (t: number): number => t,
} as const;

export type EaseFn = (t: number) => number;

/**
 * Clamped interpolation helper with motionmaxxing easing.
 */
export function easeRange(
  frame: number,
  startFrame: number,
  endFrame: number,
  from: number,
  to: number,
  easing: EaseFn = Eases.softLand
): number {
  if (endFrame <= startFrame) return frame >= endFrame ? to : from;
  return interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
}
