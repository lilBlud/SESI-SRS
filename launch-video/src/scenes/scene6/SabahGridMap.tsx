import React from 'react';
import { Interactive } from 'remotion';
import { PointerCursorShape } from '../../components/PointerCursor';
import { FUTURE_GEN_PROJECTS } from '../../data/futureGenData';
import {
  LABUAN_GEOM,
  MAINLAND_COASTLINE_PATH,
  MAP_PINS,
  PIN_COORDS_BY_ID,
  PIN_LABEL_OFFSETS,
  SABAH_DISTRICTS,
  SARAWAK_GEOM,
  TRANSMISSION_GRID,
} from '../../data/sabahMapGeoData';
import { BRAND } from '../../data/sesiData';
import type { CursorPose } from '../../motion/choreography';
import { Eases, easeRange } from '../../motion/eases';
import { FONT_MONO, FONT_SANS } from '../../motion/fonts';

export interface PinSelectionBeat {
  readonly id: string;
  readonly clickFrame: number;
  readonly rippleColor: string;
}

type SabahGridMapProps = {
  readonly frame: number;
  readonly gridDraw: number;
  readonly powerFlowDash: number;
  readonly activePinId: string | null;
  readonly selectionBeats: readonly PinSelectionBeat[];
  readonly cursor: CursorPose;
  readonly camZoom: number;
  readonly camX: number;
  readonly camY: number;
  readonly tiltX: number;
  readonly tiltY: number;
};

export const SabahGridMap: React.FC<SabahGridMapProps> = ({
  frame,
  gridDraw,
  powerFlowDash,
  activePinId,
  selectionBeats,
  cursor,
  camZoom,
  camX,
  camY,
  tiltX,
  tiltY,
}) => (
  <div
    style={{
      flex: 1,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}
  >
    <Interactive.Div
      name="Sabah Map Canvas"
      style={{
        width: '100%',
        height: '100%',
        maxWidth: 1200,
        maxHeight: 870,
        position: 'relative',
        transform: `perspective(1600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${camX}px, ${camY}px, 0) scale(${camZoom})`,
        transformOrigin: '50% 50%',
      }}
    >
      <svg
        viewBox="-24 2 508 378"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          filter: 'drop-shadow(0 18px 42px rgba(15, 23, 42, 0.1))',
        }}
      >
        <defs>
          <filter id="pinGlowClean" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#0f172a" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* Sarawak Enclave */}
        <path
          d={SARAWAK_GEOM.path}
          fill={BRAND.slate200}
          stroke={BRAND.white}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 27 Sabah Districts */}
        {SABAH_DISTRICTS.map((d) => (
          <path
            key={d.id}
            d={d.path}
            fill={d.fill}
            stroke={BRAND.white}
            strokeWidth="0.95"
            strokeLinejoin="round"
          />
        ))}

        {/* Labuan */}
        <ellipse
          cx={LABUAN_GEOM.cx}
          cy={LABUAN_GEOM.cy}
          rx={LABUAN_GEOM.rx}
          ry={LABUAN_GEOM.ry}
          fill={LABUAN_GEOM.fill}
          stroke={BRAND.white}
          strokeWidth="1.2"
        />

        {/* Crisp Outer Coastline */}
        <path
          d={MAINLAND_COASTLINE_PATH}
          fill="none"
          stroke={BRAND.white}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Regional Labels */}
        <text x="105" y="88" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#15803D" opacity="0.88" letterSpacing="1.2" fontFamily={FONT_SANS}>
          WEST COAST
        </text>
        <text x="352" y="102" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#1D4ED8" opacity="0.88" letterSpacing="1.2" fontFamily={FONT_SANS}>
          EAST COAST
        </text>

        {/* 132 kV Green Distribution Lines */}
        {TRANSMISSION_GRID.lines132kV.map((line) => (
          <path
            key={line.id}
            d={line.d}
            fill="none"
            stroke="#16A34A"
            strokeWidth={line.isFeeder ? '1.4' : '1.9'}
            strokeDasharray="800"
            strokeDashoffset={gridDraw}
            strokeLinecap="round"
          />
        ))}

        {/* 275 kV Red Transmission Backbone */}
        <path
          d={TRANSMISSION_GRID.line275kV}
          fill="none"
          stroke="#DC2626"
          strokeWidth="2.6"
          strokeDasharray="800"
          strokeDashoffset={gridDraw}
          strokeLinecap="round"
        />

        {frame >= 135 && (
          <path
            d={TRANSMISSION_GRID.line275kV}
            fill="none"
            stroke={BRAND.white}
            strokeWidth="1.3"
            strokeDasharray="4 18"
            strokeDashoffset={powerFlowDash}
            strokeLinecap="round"
            opacity={0.78}
          />
        )}

        {/* Future Strategic Grid Interconnections */}
        {TRANSMISSION_GRID.futureLinks.map((link) => (
          <path
            key={link.id}
            d={link.d}
            fill="none"
            stroke="#DC2626"
            strokeWidth="1.9"
            strokeDasharray="4.5 4"
            strokeDashoffset={powerFlowDash * 0.55}
            strokeLinecap="round"
            opacity={0.85}
          />
        ))}

        {/* ~340 MW West -> East Transfer Arrow */}
        <g transform={`translate(${TRANSMISSION_GRID.powerFlowArrow.x}, ${TRANSMISSION_GRID.powerFlowArrow.y})`}>
          <polygon
            points="0,-6 30,-6 30,-10.5 44,0 30,10.5 30,6 0,6"
            fill={BRAND.white}
            stroke={BRAND.slate700}
            strokeWidth="1.1"
            filter="url(#pinGlowClean)"
          />
          <text x="17" y="3" textAnchor="middle" fontSize="7.8" fontWeight="900" fill={BRAND.ink} fontFamily={FONT_MONO}>
            {TRANSMISSION_GRID.powerFlowArrow.label}
          </text>
        </g>

        {/* Offshore Mutiara Gas Cluster */}
        <g transform={`translate(${TRANSMISSION_GRID.offshoreGas.x}, ${TRANSMISSION_GRID.offshoreGas.y})`}>
          <polygon points="0,-6.5 6.5,0 0,6.5 -6.5,0" fill="#EA580C" stroke={BRAND.white} strokeWidth="1.1" />
          <text x="10" y="-1" fontSize="7.2" fontWeight="800" fill="#C2410C" fontFamily={FONT_SANS}>
            {TRANSMISSION_GRID.offshoreGas.name}
          </text>
          <text x="10" y="7.5" fontSize="6.5" fontWeight="700" fill="#C2410C" fontFamily={FONT_MONO}>
            {TRANSMISSION_GRID.offshoreGas.capacity}
          </text>
        </g>

        {/* Cartographic Legend */}
        <g transform="translate(274, 18)">
          <line x1="0" y1="5" x2="15" y2="5" stroke="#DC2626" strokeWidth="2.2" />
          <text x="19" y="7.5" fontSize="7.8" fontWeight="700" fill={BRAND.slate700} fontFamily={FONT_SANS}>275 kV</text>

          <line x1="58" y1="5" x2="73" y2="5" stroke="#16A34A" strokeWidth="2" />
          <text x="77" y="7.5" fontSize="7.8" fontWeight="700" fill={BRAND.slate700} fontFamily={FONT_SANS}>132 kV</text>

          <line x1="116" y1="5" x2="131" y2="5" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 2" />
          <text x="135" y="7.5" fontSize="7.8" fontWeight="700" fill={BRAND.slate700} fontFamily={FONT_SANS}>Future link</text>

          <circle cx="7" cy="20" r="4" fill="#0F172A" />
          <text x="14" y="22.5" fontSize="7.5" fontWeight="700" fill={BRAND.slate700} fontFamily={FONT_SANS}>Gas</text>

          <circle cx="44" cy="20" r="4" fill="#D97706" />
          <text x="51" y="22.5" fontSize="7.5" fontWeight="700" fill={BRAND.slate700} fontFamily={FONT_SANS}>Solar</text>

          <circle cx="84" cy="20" r="4" fill="#2563EB" />
          <text x="91" y="22.5" fontSize="7.5" fontWeight="700" fill={BRAND.slate700} fontFamily={FONT_SANS}>Hydro</text>

          <circle cx="126" cy="20" r="4" fill="#059669" />
          <text x="133" y="22.5" fontSize="7.5" fontWeight="700" fill={BRAND.slate700} fontFamily={FONT_SANS}>Conversion</text>
        </g>

        {/* Fuel-Coded Project Pins */}
        {MAP_PINS.map((pin, idx) => {
          const startF = 116 + idx * 5;
          const nodeScale = easeRange(frame, startF, startF + 16, 0, 1, Eases.popOver);
          const pulseRing = 1 + (((frame + idx * 9) % 36) / 36) * 1.3;
          const pulseOp = 1 - ((frame + idx * 9) % 36) / 36;
          const proj = FUTURE_GEN_PROJECTS.find((p) => p.id === pin.id);
          const offset = PIN_LABEL_OFFSETS[pin.id] ?? { dx: 10, dy: 3, anchor: 'start' };
          const isSelected = activePinId === pin.id && !pin.isSecondary;
          const pinRadius = isSelected ? 8.8 : 6.8;

          return (
            <g
              key={`${pin.id}-${pin.x}-${pin.y}`}
              transform={`translate(${pin.x}, ${pin.y}) scale(${nodeScale})`}
              filter="url(#pinGlowClean)"
            >
              {isSelected ? (
                <>
                  <circle
                    r={11.5 * pulseRing}
                    fill="none"
                    stroke={pin.color}
                    strokeWidth="1.5"
                    opacity={pulseOp * 0.72}
                  />
                  <circle r="11.8" fill="none" stroke={BRAND.white} strokeWidth="2.1" opacity={0.96} />
                </>
              ) : (
                <circle
                  r={7 * pulseRing}
                  fill="none"
                  stroke={pin.color}
                  strokeWidth="0.9"
                  opacity={pulseOp * 0.45}
                />
              )}

              <circle
                r={pinRadius}
                fill={pin.color}
                stroke={BRAND.white}
                strokeWidth={isSelected ? '1.9' : '1.5'}
              />
              <text
                y="2.4"
                textAnchor="middle"
                fontSize={isSelected ? '7.2' : '6.4'}
                fontWeight="800"
                fill={BRAND.white}
                fontFamily={FONT_MONO}
              >
                {pin.num}
              </text>
              {proj && !pin.isSecondary && (
                <text
                  x={isSelected ? (offset.anchor === 'end' ? offset.dx - 2 : offset.dx + 2) : offset.dx}
                  y={offset.dy}
                  textAnchor={offset.anchor}
                  fontSize={isSelected ? '7.3' : '6.4'}
                  fontWeight="800"
                  fill={isSelected ? pin.color : BRAND.ink}
                  stroke={BRAND.ground}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  fontFamily={FONT_SANS}
                >
                  {proj.name} · {proj.capacity}
                </text>
              )}
            </g>
          );
        })}

        {/* Click Ripple Bursts synced to selectionBeats */}
        {selectionBeats.map((beat) => {
          if (frame < beat.clickFrame || frame > beat.clickFrame + 22) return null;
          const coords = PIN_COORDS_BY_ID[beat.id];
          if (!coords) return null;
          return (
            <circle
              key={beat.id}
              cx={coords[0]}
              cy={coords[1]}
              r={easeRange(frame, beat.clickFrame, beat.clickFrame + 22, 7, 26, Eases.softLand)}
              fill="none"
              stroke={beat.rippleColor}
              strokeWidth="1.6"
              opacity={easeRange(frame, beat.clickFrame, beat.clickFrame + 22, 0.85, 0, Eases.softLand)}
            />
          );
        })}

        <PointerCursorShape
          x={cursor.x}
          y={cursor.y}
          scale={0.66 * cursor.scale}
          opacity={cursor.opacity}
          filter="url(#pinGlowClean)"
        />
      </svg>
    </Interactive.Div>
  </div>
);
