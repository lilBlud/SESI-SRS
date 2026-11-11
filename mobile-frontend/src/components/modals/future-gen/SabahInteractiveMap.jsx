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
    <div className="h-[310px] lg:h-full w-full lg:flex-1 shrink-0 lg:shrink relative bg-[#EEF3F7] dark:bg-slate-900/90 px-2 py-2 lg:p-6 overflow-hidden flex items-center justify-center border-b lg:border-b-0">
      <svg
        viewBox={MAP_CONFIG.viewBox}
        className="w-full h-full select-none"
        style={{ maxHeight: '100%', maxWidth: '100%' }}
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
            points="0,-7 32,-7 32,-12 48,0 32,12 32,7 0,7"
            fill="#FFFFFF"
            stroke="#334155"
            strokeWidth="1.3"
            filter="url(#pinShadow)"
          />
          <text
            x="18"
            y="3.5"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="900"
            fill="#0F172A"
          >
            {TRANSMISSION_GRID.powerFlowArrow.label}
          </text>
        </g>

        {/* ── 9. Offshore Mutiara Gas Cluster ── */}
        <g transform={`translate(${TRANSMISSION_GRID.offshoreGas.x}, ${TRANSMISSION_GRID.offshoreGas.y})`}>
          <polygon points="0,-8 8,0 0,8 -8,0" fill="#EA580C" stroke="#C2410C" strokeWidth="1.2" />
          <text x="12" y="-1" fontSize="8.5" fontWeight="800" fill="#C2410C">
            {TRANSMISSION_GRID.offshoreGas.name}
          </text>
          <text x="12" y="9" fontSize="7.5" fontWeight="700" fill="#C2410C">
            {TRANSMISSION_GRID.offshoreGas.capacity}
          </text>
        </g>

        {/* ── 10. Map Top-Right Legend Box ── */}
        <g transform="translate(258, 16)">
          <line x1="0" y1="5" x2="16" y2="5" stroke="#DC2626" strokeWidth="2.4" />
          <text x="20" y="8" fontSize="8.5" fontWeight="700" fill="#334155">275 kV</text>

          <line x1="62" y1="5" x2="78" y2="5" stroke="#16A34A" strokeWidth="2.2" />
          <text x="82" y="8" fontSize="8.5" fontWeight="700" fill="#334155">132 kV</text>

          <line x1="124" y1="5" x2="140" y2="5" stroke="#DC2626" strokeWidth="2.2" strokeDasharray="3 2" />
          <text x="144" y="8" fontSize="8.5" fontWeight="700" fill="#334155">Future link</text>

          <circle cx="8" cy="22" r="4.5" fill="#0F172A" />
          <text x="16" y="25" fontSize="8.5" fontWeight="700" fill="#334155">Gas</text>

          <circle cx="50" cy="22" r="4.5" fill="#D97706" />
          <text x="58" y="25" fontSize="8.5" fontWeight="700" fill="#334155">Solar</text>

          <circle cx="92" cy="22" r="4.5" fill="#2563EB" />
          <text x="100" y="25" fontSize="8.5" fontWeight="700" fill="#334155">Hydro</text>

          <circle cx="136" cy="22" r="4.5" fill="#059669" />
          <text x="144" y="25" fontSize="8.5" fontWeight="700" fill="#334155">Conversion</text>
        </g>

        {/* ── 11. Town & Substation Nodes with High-Contrast Halo ── */}
        {TOWN_NODES.map((t, idx) => (
          <g key={`town-${idx}`}>
            <circle cx={t.x} cy={t.y} r="3.2" fill="#FFFFFF" stroke="#334155" strokeWidth="1.3" />
            <text
              x={t.x + t.dx}
              y={t.y + t.dy}
              textAnchor={t.anchor}
              fontSize="8.5"
              fontWeight="800"
              stroke="#FFFFFF"
              strokeWidth="2.6"
              strokeLinejoin="round"
              paintOrder="stroke fill"
              className="fill-slate-800 dark:fill-slate-100 pointer-events-none select-none"
            >
              {t.name}
            </text>
          </g>
        ))}

        {/* ── 12. Existing Plant Badges [G] ── */}
        {EXISTING_PLANTS.map((gNode, idx) => (
          <g key={`g-${idx}`} transform={`translate(${gNode.x}, ${gNode.y})`}>
            <rect width="9" height="9" rx="2" fill="#64748B" />
            <text x="4.5" y="6.8" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#FFFFFF">
              G
            </text>
          </g>
        ))}

        {/* Existing Plant Legend */}
        <g transform="translate(365, 343)">
          <rect width="9" height="9" rx="2" fill="#64748B" />
          <text x="4.5" y="6.8" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#FFFFFF">G</text>
          <text x="13" y="7.5" fontSize="7.5" fontWeight="700" fill="#64748B">Existing plant</text>
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
      <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs lg:text-[13px] font-bold text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-2 pointer-events-none">
        <span className="animate-pulse">📍</span>
        <span>Interactive Sabah Grid: Click any project pin</span>
      </div>

      {/* Desktop Floating Legend Badge */}
      <div className="hidden lg:flex flex-col gap-2 absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-md text-xs pointer-events-none">
        <div className="font-extrabold uppercase tracking-wider text-slate-400 text-[10.5px]">Grid Infrastructure</div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-0.5 bg-red-600 rounded"></div>
          <span className="font-bold text-slate-700 dark:text-slate-200">275 kV Backbone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-0.5 bg-emerald-600 rounded"></div>
          <span className="font-bold text-slate-700 dark:text-slate-200">132 kV Grid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 border-t-2 border-dashed border-red-600"></div>
          <span className="font-bold text-slate-700 dark:text-slate-200">Future Strategic Link</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-500 rounded flex items-center justify-center text-white text-[9px] font-black">G</div>
          <span className="font-bold text-slate-700 dark:text-slate-200">Existing Plant</span>
        </div>
      </div>
    </div>
  );
}
