/**
 * Measured motion curves from professional launch reels (motionmaxxing/motion.md).
 * Every curve expects normalized progress t in [0, 1].
 */

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/** Fast decisive entry (~60% travel in first quarter) with smooth tail. */
export const softLand = (t: number) => {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3.4);
};

/** Signature hero impact (~54% in first ~10%, crisp magnetic settle). */
export const snapSettle = (t: number) => {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 5.2);
};

/** Balanced medium push / glide (power ~1.7 out). */
export const glide = (t: number) => {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 1.7);
};

/** Leaving curve: slow build -> exits at peak velocity right into a hard cut. */
export const accelExit = (t: number) => {
  const x = clamp01(t);
  return Math.pow(x, 2.6);
};

/** Gentle S-curve for color / subtle ambient shifts. */
export const softInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};

/** Maps raw frame to clamped normalized [0, 1] progress over duration frames. */
export const progress = (frame: number, duration: number, delay = 0) => {
  if (duration <= 0) return 1;
  return clamp01((frame - delay) / duration);
};
