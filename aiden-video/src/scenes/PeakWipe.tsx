import type { TransitionPresentationComponentProps } from '@remotion/transitions';
import React from 'react';
import { interpolate } from 'remotion';
import { softInOut } from '../motion';

/**
 * Soft-feathered diagonal wipe aligned with Sabah Electricity / AIDEN ridge slope.
 * Smooth leading feather prevents harsh hard edges without blurring faces.
 */
export const PeakWipePresentation: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationDirection, presentationProgress }) => {
  if (presentationDirection === 'exiting') {
    const exitShift = interpolate(softInOut(presentationProgress), [0, 1], [0, -24]);
    return (
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${exitShift}px)` }}>
        {children}
      </div>
    );
  }

  const p = softInOut(presentationProgress);
  const edge = p * 150 - 22; // Slow velvety sweep across wide feathered diagonal band
  const mask = `linear-gradient(112deg, #000 ${edge - 20}%, rgba(0,0,0,0.45) ${edge - 5}%, transparent ${edge + 16}%)`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Optical rack-focus cross-dissolve for calm documentary seams.
 * Keeps the outgoing plate full brightness underneath so luminance never dips dark.
 */
export const BlurFocusTransition: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationDirection, presentationProgress }) => {
  const p = softInOut(presentationProgress);

  if (presentationDirection === 'exiting') {
    const blur = interpolate(p, [0, 1], [0, 2.5]);
    const scale = interpolate(p, [0, 1], [1.0, 1.02]);
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale})`,
          filter: blur > 0.15 ? `blur(${blur.toFixed(1)}px)` : undefined,
        }}
      >
        {children}
      </div>
    );
  }

  const blur = interpolate(p, [0, 1], [4.5, 0]);
  const scale = interpolate(p, [0, 1], [1.025, 1.0]);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: p,
        transform: `scale(${scale})`,
        filter: blur > 0.15 ? `blur(${blur.toFixed(1)}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Editorial directional glide cut carrying horizontal momentum cleanly across shots.
 */
export const DirectionalPushTransition: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationDirection, presentationProgress }) => {
  const p = softInOut(presentationProgress);

  if (presentationDirection === 'exiting') {
    const x = interpolate(p, [0, 1], [0, -140]);
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${x}px)`,
          opacity: interpolate(p, [0, 0.85, 1], [1, 0.72, 0.5]),
        }}
      >
        {children}
      </div>
    );
  }

  const x = interpolate(p, [0, 1], [1920, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translateX(${x}px)`,
        boxShadow: '-24px 0 48px rgba(4, 10, 22, 0.36)',
      }}
    >
      {children}
    </div>
  );
};
