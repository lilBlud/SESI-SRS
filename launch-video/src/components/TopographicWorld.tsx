import React from 'react';
import { BRAND, CONTOUR_PATHS } from '../data/sesiData';

type TopographicWorldProps = {
  /** Horizontal parallax offset in px */
  cameraX?: number;
  /** Vertical parallax offset in px */
  cameraY?: number;
  /** Zoom scale factor around center */
  cameraZoom?: number;
  /** 0 = normal light-mode website ground, 1 = near-black tension beat */
  dimFactor?: number;
  /** Multiplier for contour & ambient glow intensity */
  emeraldIntensity?: number;
  /** Optional 3D tilt in degrees */
  tiltX?: number;
};

/**
 * Light-mode TopographicBackground matching ./mobile-frontend/src/components/layout/TopographicBackground.jsx:
 * - bg-gradient-to-br from-slate-50 via-[#f3f8f7] to-[#eef6f5]
 * - soft emerald/teal/cyan ambient glow orbs
 * - crisp slate-600 vector topographic contour lines across 3 parallax Z-planes
 */
export const TopographicWorld: React.FC<TopographicWorldProps> = ({
  cameraX = 0,
  cameraY = 0,
  cameraZoom = 1,
  dimFactor = 0,
  emeraldIntensity = 1,
  tiltX = 0,
}) => {
  const layerFactors = [0.4, 0.75, 1.15];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: BRAND.ground,
        overflow: 'hidden',
      }}
    >
      {/* Light-mode Ambient Gradient Mesh Backing */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, #f8fafc 0%, #f3f8f7 52%, #eef6f5 100%)',
        }}
      />

      {/* Soft Color Glow Orbs (Light-Mode TopographicBackground.jsx) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 12% 10%, rgba(52, 211, 153, 0.14), transparent 45%), radial-gradient(circle at 88% 28%, rgba(45, 212, 191, 0.11), transparent 44%), radial-gradient(circle at 46% 96%, rgba(34, 211, 238, 0.09), transparent 48%)',
          opacity: emeraldIntensity,
        }}
      />

      {/* 3D-layered Topographic Contour Planes (slate-600 hairlines) */}
      {[0, 1, 2].map((layerIdx) => {
        const factor = layerFactors[layerIdx];
        const layerScale = cameraZoom * (1 + layerIdx * 0.025);
        const tx = cameraX * factor;
        const ty = cameraY * factor;

        return (
          <svg
            key={layerIdx}
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              transform: `perspective(1400px) rotateX(${tiltX}deg) translate3d(${tx}px, ${ty}px, ${layerIdx * 24}px) scale(${layerScale})`,
              transformOrigin: '50% 50%',
              opacity: Math.max(0.18, 1 - dimFactor * 0.82),
            }}
            fill="none"
          >
            <g
              stroke={dimFactor > 0.45 ? '#34d399' : '#475569'}
              strokeWidth={1.25 + layerIdx * 0.15}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {CONTOUR_PATHS.filter((c) => c.layer === layerIdx).map((contour, idx) => (
                <path
                  key={idx}
                  d={contour.d}
                  opacity={contour.opacity * (0.55 + 0.45 * emeraldIntensity)}
                />
              ))}
            </g>
          </svg>
        );
      })}

      {/* Tension-beat dim overlay (keeps faint emerald atmosphere, never dead #000 flat frames) */}
      {dimFactor > 0.001 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 68% 54% at 50% 48%, rgba(6, 78, 59, 0.24) 0%, rgba(9, 13, 22, 0.92) 72%, rgba(9, 13, 22, 0.96) 100%)',
            opacity: dimFactor * 0.9,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
