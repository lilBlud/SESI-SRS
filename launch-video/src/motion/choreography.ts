import { Eases, easeRange, type EaseFn } from './eases';

export interface PressEnvelopeOptions {
  readonly lead?: number;
  readonly release?: number;
  readonly minScale?: number;
  readonly releaseEase?: EaseFn;
}

/**
 * Evaluates a tactile press-and-rebound scale curve centered on `pressFrame`.
 */
export function pressEnvelope(
  frame: number,
  pressFrame: number,
  {
    lead = 4,
    release = 16,
    minScale = 0.94,
    releaseEase = Eases.popOver,
  }: PressEnvelopeOptions = {},
): number {
  const pressStart = pressFrame - lead;
  const releaseEnd = pressFrame + release;
  if (frame < pressStart || frame >= releaseEnd) return 1;
  if (frame < pressFrame) {
    return easeRange(frame, pressStart, pressFrame, 1, minScale, Eases.gentleIn);
  }
  return easeRange(frame, pressFrame, releaseEnd, minScale, 1, releaseEase);
}

export interface KeyframeSegment {
  readonly start: number;
  readonly end: number;
  readonly from: number;
  readonly to: number;
  readonly ease?: EaseFn;
}

/**
 * Evaluates an ordered list of timed motion segments without nested ternaries.
 */
export function keyframeSegments(
  frame: number,
  segments: readonly KeyframeSegment[],
  initialValue: number,
): number {
  if (segments.length === 0) return initialValue;

  let value = initialValue;
  for (const seg of segments) {
    if (frame < seg.start) return value;
    value = easeRange(
      frame,
      seg.start,
      seg.end,
      seg.from,
      seg.to,
      seg.ease ?? Eases.softLand,
    );
    if (frame <= seg.end) return value;
  }
  return value;
}

export type CursorPoint = readonly [number, number];

export interface CursorMoveSegment {
  readonly start: number;
  readonly end: number;
  readonly from: CursorPoint;
  readonly to: CursorPoint;
  readonly ease?: EaseFn;
}

export interface CursorVisibilityWindow {
  readonly start: number;
  readonly end: number;
  readonly fadeIn?: number;
  readonly fadeOut?: number;
}

export interface CursorClickEvent {
  readonly frame: number;
  readonly lead?: number;
  readonly release?: number;
  readonly minScale?: number;
}

export interface CursorTrackSpec {
  readonly moves: readonly CursorMoveSegment[];
  readonly visibility: readonly CursorVisibilityWindow[];
  readonly clicks: readonly CursorClickEvent[];
}

export interface CursorPose {
  readonly x: number;
  readonly y: number;
  readonly opacity: number;
  readonly scale: number;
}

/**
 * Evaluates a declarative cursor choreography track (position, visibility, click press).
 */
export function evaluateCursorTrack(frame: number, spec: CursorTrackSpec): CursorPose {
  const x = keyframeSegments(
    frame,
    spec.moves.map((m) => ({
      start: m.start,
      end: m.end,
      from: m.from[0],
      to: m.to[0],
      ease: m.ease,
    })),
    spec.moves[0]?.from[0] ?? 0,
  );

  const y = keyframeSegments(
    frame,
    spec.moves.map((m) => ({
      start: m.start,
      end: m.end,
      from: m.from[1],
      to: m.to[1],
      ease: m.ease,
    })),
    spec.moves[0]?.from[1] ?? 0,
  );

  let opacity = 0;
  for (const win of spec.visibility) {
    if (frame >= win.start && frame <= win.end) {
      const fadeIn = win.fadeIn ?? 6;
      const fadeOut = win.fadeOut ?? 10;
      const inOp = easeRange(frame, win.start, win.start + fadeIn, 0, 1, Eases.softLand);
      const outOp = easeRange(frame, win.end - fadeOut, win.end, 1, 0, Eases.accelExit);
      opacity = inOp * outOp;
      break;
    }
  }

  let scale = 1;
  for (const click of spec.clicks) {
    const s = pressEnvelope(frame, click.frame, {
      lead: click.lead ?? 4,
      release: click.release ?? 8,
      minScale: click.minScale ?? 0.84,
      releaseEase: Eases.snapSettle,
    });
    if (s !== 1) {
      scale = s;
      break;
    }
  }

  return { x, y, opacity, scale };
}

/**
 * Subtle idle sinusoidal breathing multiplier after `startFrame`.
 */
export function ambientSine(
  frame: number,
  startFrame: number,
  freq = 0.09,
  amp = 0.014,
): number {
  return frame >= startFrame ? 1 + Math.sin((frame - startFrame) * freq) * amp : 1;
}
