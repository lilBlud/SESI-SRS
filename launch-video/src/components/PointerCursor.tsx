import React from 'react';

export const POINTER_CURSOR_PATH =
  'M3 2.5L24.5 16.5L14.5 18.5L19 28L15.2 29.8L10.7 20.3L4.5 26.5L3 2.5Z';

type PointerCursorProps = {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
};

/**
 * Crisp physical pointer SVG for UI interaction beats (click compression + shadow).
 */
export const PointerCursor: React.FC<PointerCursorProps> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
}) => {
  if (opacity <= 0.01) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `translate(-4px, -4px) scale(${scale})`,
        transformOrigin: '4px 4px',
        pointerEvents: 'none',
        zIndex: 60,
        filter: 'drop-shadow(0 8px 18px rgba(15, 23, 42, 0.28))',
      }}
    >
      <svg width="34" height="38" viewBox="0 0 28 32" fill="none">
        <path
          d={POINTER_CURSOR_PATH}
          fill="#0f172a"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

type PointerCursorShapeProps = PointerCursorProps & {
  filter?: string;
};

/**
 * Same cursor geometry positioned directly in an SVG viewBox (tip anchored at x, y).
 */
export const PointerCursorShape: React.FC<PointerCursorShapeProps> = ({
  x,
  y,
  scale = 0.66,
  opacity = 1,
  filter,
}) => {
  if (opacity <= 0.01) return null;

  return (
    <g
      opacity={opacity}
      transform={`translate(${x}, ${y}) scale(${scale}) translate(-3, -2.5)`}
      filter={filter}
    >
      <path
        d={POINTER_CURSOR_PATH}
        fill="#0f172a"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </g>
  );
};
