import React from 'react';
import {
  MAP_CONFIG,
  SARAWAK_GEOM,
  SABAH_DISTRICTS,
  LABUAN_GEOM,
  MAINLAND_COASTLINE_PATH,
  TRANSMISSION_GRID,
  TOWN_NODES,
  EXISTING_PLANTS,
  MAP_PINS
} from '../../../utils/sabahMapGeoData';

export function SabahInteractiveMap({
  selectedProjectId,
  onSelectProject,
  isDark = false
}) {
  return (
    <div className="h-[310px] shrink-0 relative bg-[#EEF3F7] dark:bg-slate-900 px-1 py-1 overflow-hidden flex items-center justify-center border-b border-slate-200/80 dark:border-slate-800">
      <svg
        viewBox={MAP_CONFIG.viewBox}
        className="w-full h-full select-none"
        style={{ maxHeight: '100%' }}
      >
        <defs>
          <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
          </filter>
          <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* ── 1. Sarawak Enclave (Northern Sarawak / Lawas) ── */}
        <path
          d={SARAWAK_GEOM.path}
          fill={isDark ? SARAWAK_GEOM.darkFill : SARAWAK_GEOM.fill}
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* ── 2. Individual Sabah District Boundaries (27 Districts) ── */}
        <g id="sabah-districts">
          {SABAH_DISTRICTS.map((d) => (
            <path
              key={d.id}
              d={d.path}
              fill={isDark ? d.darkFill : d.fill}
              stroke="#FFFFFF"
              strokeWidth="1.0"
              strokeLinejoin="round"
            />
          ))}
          {/* Labuan Island */}
          <ellipse
            cx={LABUAN_GEOM.cx}
            cy={LABUAN_GEOM.cy}
            rx={LABUAN_GEOM.rx}
            ry={LABUAN_GEOM.ry}
            fill={isDark ? LABUAN_GEOM.darkFill : LABUAN_GEOM.fill}
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
        </g>

        {/* ── 3. Crisp White Outer Coastline ── */}
        <path
          d={MAINLAND_COASTLINE_PATH}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* ── 4. Regional Watermark Labels ── */}
        <text
          x={MAP_CONFIG.labels.westCoast.x}
          y={MAP_CONFIG.labels.westCoast.y}
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill="#15803D"
          opacity="0.85"
          letterSpacing="1"
        >
          {MAP_CONFIG.labels.westCoast.text}
        </text>
        <text
          x={MAP_CONFIG.labels.eastCoast.x}
          y={MAP_CONFIG.labels.eastCoast.y}
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill="#1D4ED8"
          opacity="0.85"
          letterSpacing="1"
        >
          {MAP_CONFIG.labels.eastCoast.text}
        </text>
        <text
          x={MAP_CONFIG.labels.sarawak.x}
          y={MAP_CONFIG.labels.sarawak.y}
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="800"
          fill={isDark ? "#94A3B8" : "#64748B"}
          opacity="0.85"
          letterSpacing="0.8"
        >
          {MAP_CONFIG.labels.sarawak.text}
        </text>

        {/* ── 5. Transmission Grid (132 kV Green Distribution Lines) ── */}
        {TRANSMISSION_GRID.lines132kV.map((line) => (
          <path
            key={line.id}
            d={line.d}
            fill="none"
            stroke="#16A34A"
            strokeWidth={line.isFeeder ? "1.6" : "2"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* ── 6. Transmission Backbone (275 kV Red Solid Line) ── */}
        <path
          d={TRANSMISSION_GRID.line275kV}
          fill="none"
          stroke="#DC2626"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── 7. Future Strategic Grid Interconnections (Red Dashed) ── */}
        {TRANSMISSION_GRID.futureLinks.map((link) => (
          <g key={link.id}>
            <path
              d={link.d}
              fill="none"
              stroke="#DC2626"
              strokeWidth="2.2"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
            <text
              x={link.labelPos.x}
              y={link.labelPos.y}
              textAnchor={link.textAnchor || "start"}
              fontSize={link.fontSize || 7}
              fontWeight="700"
              fill={link.color || "#DC2626"}
            >
              {link.label}
            </text>
          </g>
        ))}

        {/* ── 8. Power Flow Arrow (~340 MW West → East) ── */}
        <g transform={`translate(${TRANSMISSION_GRID.powerFlowArrow.x}, ${TRANSMISSION_GRID.powerFlowArrow.y})`}>
          <polygon
            points="0,-6 28,-6 28,-11 42,0 28,11 28,6 0,6"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="1.2"
            filter="url(#pinShadow)"
          />
          <text
            x="16"
            y="3"
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="900"
            fill="#0F172A"
          >
            {TRANSMISSION_GRID.powerFlowArrow.label}
          </text>
        </g>

        {/* ── 9. Offshore Mutiara Gas Cluster ── */}
        <g transform={`translate(${TRANSMISSION_GRID.offshoreGas.x}, ${TRANSMISSION_GRID.offshoreGas.y})`}>
          <polygon points="0,-7 7,0 0,7 -7,0" fill="#EA580C" stroke="#C2410C" strokeWidth="1" />
          <text x="11" y="-1" fontSize="7.5" fontWeight="800" fill="#C2410C">
            {TRANSMISSION_GRID.offshoreGas.name}
          </text>
          <text x="11" y="8" fontSize="6.5" fontWeight="600" fill="#C2410C">
            {TRANSMISSION_GRID.offshoreGas.capacity}
          </text>
        </g>

        {/* ── 10. Map Top-Right Legend Box ── */}
        <g transform="translate(265, 18)">
          <line x1="0" y1="5" x2="16" y2="5" stroke="#DC2626" strokeWidth="2.2" />
          <text x="20" y="8" fontSize="7.5" fontWeight="600" fill="#334155">275 kV</text>

          <line x1="60" y1="5" x2="76" y2="5" stroke="#16A34A" strokeWidth="2" />
          <text x="80" y="8" fontSize="7.5" fontWeight="600" fill="#334155">132 kV</text>

          <line x1="120" y1="5" x2="136" y2="5" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 2" />
          <text x="140" y="8" fontSize="7.5" fontWeight="600" fill="#334155">Future link</text>

          <circle cx="8" cy="20" r="4" fill="#0F172A" />
          <text x="16" y="23" fontSize="7.5" fontWeight="600" fill="#334155">Gas</text>

          <circle cx="48" cy="20" r="4" fill="#D97706" />
          <text x="56" y="23" fontSize="7.5" fontWeight="600" fill="#334155">Solar</text>

          <circle cx="88" cy="20" r="4" fill="#2563EB" />
          <text x="96" y="23" fontSize="7.5" fontWeight="600" fill="#334155">Hydro</text>

          <circle cx="130" cy="20" r="4" fill="#059669" />
          <text x="138" y="23" fontSize="7.5" fontWeight="600" fill="#334155">Conversion</text>
        </g>

        {/* ── 11. Town & Substation Nodes ── */}
        {TOWN_NODES.map((t, idx) => (
          <g key={`town-${idx}`}>
            <circle cx={t.x} cy={t.y} r="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.2" />
            <text
              x={t.x + t.dx}
              y={t.y + t.dy}
              textAnchor={t.anchor}
              fontSize="7"
              fontWeight="600"
              className="fill-slate-700 dark:fill-slate-300 pointer-events-none select-none"
            >
              {t.name}
            </text>
          </g>
        ))}

        {/* ── 12. Existing Plant Badges [G] ── */}
        {EXISTING_PLANTS.map((gNode, idx) => (
          <g key={`g-${idx}`} transform={`translate(${gNode.x}, ${gNode.y})`}>
            <rect width="8" height="8" rx="1.5" fill="#64748B" />
            <text x="4" y="6" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#FFFFFF">
              G
            </text>
          </g>
        ))}

        {/* Existing Plant Legend */}
        <g transform="translate(372, 345)">
          <rect width="8" height="8" rx="1.5" fill="#64748B" />
          <text x="4" y="6" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#FFFFFF">G</text>
          <text x="11" y="6.5" fontSize="6.5" fontWeight="600" fill="#64748B">Existing plant</text>
        </g>

        {/* ── 13. Interactive Generation Project Pins (1 to 7) ── */}
        {MAP_PINS.map((pin, idx) => {
          const isSelected = selectedProjectId === pin.id;
          return (
            <g
              key={`pin-${idx}-${pin.id}`}
              transform={`translate(${pin.x}, ${pin.y})`}
              className="cursor-pointer group"
              onClick={() => onSelectProject(pin.id)}
            >
              {/* Stable transparent hit area */}
              <circle cx="0" cy="0" r="18" fill="transparent" />

              {/* Selection Pulsing Ring */}
              {isSelected && (
                <g className="pointer-events-none">
                  <circle cx="0" cy="0" r="16" fill={pin.color} opacity="0.3" className="animate-ping" />
                  <circle cx="0" cy="0" r="14" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
                </g>
              )}

              {/* Main Pin Circle */}
              <circle
                cx="0"
                cy="0"
                r={isSelected ? 12 : 10}
                fill={pin.color}
                stroke="#FFFFFF"
                strokeWidth={isSelected ? 2.5 : 2}
                filter="url(#pinShadow)"
                className="transition-all duration-150 group-hover:brightness-125 group-hover:stroke-slate-100 pointer-events-none"
              />

              {/* Pin Number */}
              <text
                x="0"
                y="3.5"
                textAnchor="middle"
                fontSize={isSelected ? '10' : '9'}
                fontWeight="900"
                fill="#FFFFFF"
                className="pointer-events-none select-none"
              >
                {pin.num}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tap Pin Hint */}
      <div className="absolute top-1.5 left-2 bg-white dark:bg-slate-800 rounded-lg px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 shadow-sm flex items-center gap-1 pointer-events-none">
        <span className="animate-pulse">📍</span>
        <span>Tap any pin for project breakdown</span>
      </div>
    </div>
  );
}
