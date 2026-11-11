import React, { memo } from 'react';

/**
 * Static contour path definitions for the 1920x1080 coordinate space.
 * Pre-defined opacity values preserve exact visual elevation depth across theme modes.
 */
const CONTOUR_PATHS = [
  // Top-Left Elevation Ridges
  { d: 'M-80,-40 C140,-20 280,180 200,420 C140,600 -20,720 -100,760', darkOp: 'opacity-20', lightOp: 'opacity-15' },
  { d: 'M-60,40 C180,60 340,240 260,500 C190,700 30,820 -80,880', darkOp: 'opacity-25', lightOp: 'opacity-18' },
  { d: 'M-40,120 C220,150 400,310 320,580 C240,780 80,920 -60,990', darkOp: 'opacity-30', lightOp: 'opacity-22' },
  { d: 'M-20,200 C270,240 460,390 380,670 C300,880 140,1010 -40,1080', darkOp: 'opacity-25', lightOp: 'opacity-18' },
  { d: 'M0,280 C320,330 520,470 440,760 C360,970 200,1090 40,1150', darkOp: 'opacity-20', lightOp: 'opacity-15' },
  { d: 'M20,360 C370,420 580,560 500,850 C430,1050 270,1170 120,1220', darkOp: 'opacity-15', lightOp: 'opacity-12' },

  // Central Valley Flow (S-Curves)
  { d: 'M240,-80 C480,160 620,440 920,520 C1240,600 1520,380 1780,240 C1880,190 1980,170 2060,180', darkOp: 'opacity-20', lightOp: 'opacity-15' },
  { d: 'M320,-80 C560,180 700,480 1000,560 C1320,640 1600,430 1850,300 C1940,250 2030,230 2100,240', darkOp: 'opacity-25', lightOp: 'opacity-18' },
  { d: 'M400,-80 C640,210 780,520 1080,610 C1400,690 1670,490 1920,370 C2000,320 2080,300 2140,310', darkOp: 'opacity-30', lightOp: 'opacity-22' },
  { d: 'M480,-80 C720,240 860,570 1160,660 C1480,740 1740,550 1980,440 C2060,400 2130,380 2180,390', darkOp: 'opacity-25', lightOp: 'opacity-18' },
  { d: 'M560,-80 C800,280 940,620 1240,710 C1560,800 1810,620 2040,520 C2120,480 2180,460 2220,470', darkOp: 'opacity-20', lightOp: 'opacity-15' },

  // Bottom-Right Mountain Ridge (Concentric Rings)
  { d: 'M840,1160 C1060,940 1340,820 1680,860 C1860,880 1990,960 2060,1040', darkOp: 'opacity-20', lightOp: 'opacity-15' },
  { d: 'M960,1160 C1160,980 1420,880 1730,910 C1890,930 2010,1000 2070,1070', darkOp: 'opacity-25', lightOp: 'opacity-18' },
  { d: 'M1080,1160 C1260,1020 1500,940 1780,960 C1920,980 2030,1040 2080,1100', darkOp: 'opacity-30', lightOp: 'opacity-22' },
  { d: 'M1200,1160 C1360,1060 1570,1000 1820,1020 C1940,1030 2040,1080 2080,1130', darkOp: 'opacity-25', lightOp: 'opacity-18' },
  { d: 'M1320,1160 C1460,1100 1640,1060 1860,1070 C1960,1080 2040,1120 2070,1150', darkOp: 'opacity-20', lightOp: 'opacity-15' },
  { d: 'M1440,1160 C1560,1130 1710,1110 1890,1120 C1970,1130 2030,1150 2050,1170', darkOp: 'opacity-15', lightOp: 'opacity-12' },

  // Fine Secondary Harmonic Waves
  { d: 'M-40,460 C260,520 460,680 400,920 C340,1100 180,1210 20,1260', darkOp: 'opacity-15', lightOp: 'opacity-10' },
  { d: 'M660,-80 C900,320 1040,680 1340,780 C1660,870 1900,700 2110,610', darkOp: 'opacity-15', lightOp: 'opacity-10' },
  { d: 'M740,1160 C960,900 1250,770 1620,810 C1820,830 1970,920 2050,1010', darkOp: 'opacity-15', lightOp: 'opacity-10' }
];

/**
 * TopographicBackground
 * 
 * Crisp, infinitely-scalable vector topographic contour lines with ambient gradient mesh.
 * Eliminates raster scaling blur on high-resolution widescreen monitors (1080p, 2K, 4K Retina).
 * Uses vector-effect="non-scaling-stroke" for razor-sharp hairline curves at any zoom level.
 * Memoized to prevent re-renders when parent application state updates.
 */
function TopographicBackgroundComponent({ isDark }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none -z-20 overflow-hidden select-none transition-colors duration-500 will-change-transform"
    >
      {/* ─── Ambient Gradient Mesh Backing ─── */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark
            ? 'bg-[#090d16]'
            : 'bg-gradient-to-br from-slate-50 via-[#f3f8f7] to-[#eef6f5]'
        }`}
      />

      {/* ─── Soft Color Glow Orbs (Subtle Depth) ─── */}
      <div
        className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl transition-opacity duration-500 ${
          isDark ? 'bg-emerald-500/10' : 'bg-emerald-400/12'
        }`}
      />
      <div
        className={`absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full blur-3xl transition-opacity duration-500 ${
          isDark ? 'bg-sky-500/8' : 'bg-teal-400/10'
        }`}
      />
      <div
        className={`absolute -bottom-32 left-1/3 w-[650px] h-[650px] rounded-full blur-3xl transition-opacity duration-500 ${
          isDark ? 'bg-teal-500/8' : 'bg-cyan-400/8'
        }`}
      />

      {/* ─── High-Precision Vector Topographic Contours (1920x1080 Coordinate Space) ─── */}
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className={`absolute inset-0 w-full h-full transition-colors duration-500 ${
          isDark ? 'text-emerald-400' : 'text-slate-600'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {CONTOUR_PATHS.map((contour, idx) => (
            <path
              key={idx}
              d={contour.d}
              className={isDark ? contour.darkOp : contour.lightOp}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default memo(TopographicBackgroundComponent);
