// Future Generation Pipeline & Sabah Map Data
// Source: Energy-related project progress as of August 2026 and ReSET2030 Security of Supply

export const FUTURE_GEN_STATS = {
  peakDemand: '1,295 MW',
  peakDemandSub: 'Sep 2026 Peak',
  dependableCapacity: '1,429 MW',
  dependableCapacitySub: 'Dependable Total',
  reserveMargin: '10% → 30%',
  reserveMarginSub: 'Reserve Target 2030',
  maxTransfer: '~340 MW',
  maxTransferSub: 'Max West → East Grid Transfer',
  westCoast: {
    region: 'West Coast',
    peakDemand: '881 MW',
    peakDemandSub: 'Peak Jul 2026',
    dependableCapacity: '1,090 MW',
    reserveMargin: '23.7%',
    fuelMix: 'Gas 960 MW · Hydro 110 MW · Oil 20 MW'
  },
  eastCoast: {
    region: 'East Coast',
    peakDemand: '421 MW',
    peakDemandSub: 'Peak May 2026',
    dependableCapacity: '322 MW',
    reserveMargin: '-23.5%',
    fuelMix: 'Oil 291 MW · Biomass/biogas 30 MW · Hydro 1 MW'
  }
};

export const FUTURE_GEN_PROJECTS = [
  {
    id: 'mengaris',
    pinNumber: 1,
    name: 'Mengaris Solar',
    capacity: '15 MW',
    capacityNum: 15,
    plantType: 'Solar PV',
    fuelType: 'solar',
    location: 'Kota Belud',
    region: 'West Coast',
    stage: 'Pipeline',
    stageCategory: 'pipeline',
    cod: '2027',
    equity: 'SE 100%',
    status: 'New solar generation facility situated along the northern West Coast corridor, boosting renewable injection into Kota Belud and Kudat.',
    watchItem: null,
    coords: { x: 179.1, y: 100.1 }
  },
  {
    id: 'tecoma',
    pinNumber: 2,
    name: 'Tecoma',
    capacity: '300 MW',
    capacityNum: 300,
    plantType: 'Combined Cycle Gas Turbine (CCGT)',
    fuelType: 'gas',
    location: 'Melawa, Kota Kinabalu',
    region: 'West Coast',
    stage: 'Feasibility Stage',
    stageCategory: 'feasibility',
    cod: '2032',
    equity: 'SE 65%',
    status: 'LOI from ECoS received 27 Apr 2026. Technical Advisor for the feasibility study to be appointed by 30 Nov 2026.',
    watchItem: {
      badge: 'Upcoming Milestone',
      title: 'Nov 2026: feasibility starts',
      text: 'Technical Advisors for Tecoma and Shorea appointed by 30 Nov 2026.',
      tone: 'amber'
    },
    coords: { x: 138.0, y: 142.0 }
  },
  {
    id: 'acacia',
    pinNumber: 3,
    name: 'Acacia',
    capacity: '100 MW',
    capacityNum: 100,
    plantType: 'Gas-fired plant',
    fuelType: 'gas',
    location: 'Kimanis',
    region: 'West Coast',
    stage: 'Contracting and Financial-Close Stage',
    stageCategory: 'contracting',
    cod: 'Q2 2028',
    equity: 'SE 40%',
    status: "LON from ECoS received 22 Apr 2026. To finalise: SHA, PPA and GSA, EPCC award (TBA), LTSA, Owner's Engineer, financial close.",
    watchItem: null,
    coords: { x: 98.0, y: 208.0 }
  },
  {
    id: 'rancha',
    pinNumber: 4,
    name: 'Rancha',
    capacity: '120 MW',
    capacityNum: 120,
    plantType: 'Gas engine (7 units)',
    fuelType: 'gas',
    location: 'Labuan',
    region: 'West Coast',
    stage: 'Contracting and Financial-Close Stage',
    stageCategory: 'contracting',
    cod: '1 Jan 2028',
    equity: 'SE Joint Venture',
    note: '2028; replaces SJ Patau-Patau 95 MW',
    status: 'EPCC consortium: KAB Energy–Sinohydro. Contracts to finalise: PPA, GSA, LTSA, LLA, EPC, PSA. Equity injection RM8.56M (24 Apr 2026).',
    watchItem: {
      badge: 'Action Required',
      title: 'Rancha: approval pending',
      text: 'Extension of FCD and PPA requested from ST on 27 Aug 2026; awaiting feedback (PPA deadline 31 Aug; FCD 15 Nov 2026).',
      tone: 'rose'
    },
    coords: { x: 34.7, y: 235.4 }
  },
  {
    id: 'oriole',
    pinNumber: 5,
    name: 'Oriole Hydro',
    capacity: '162 MW',
    capacityNum: 162,
    plantType: 'Hydro run-of-river',
    fuelType: 'hydro',
    location: 'Hulu Sungai Padas, Sipitang',
    region: 'West Coast',
    stage: 'Contracting and Financial-Close Stage',
    stageCategory: 'contracting',
    cod: '31 Dec 2030',
    equity: 'SE 20%',
    note: 'COD Q2 2030; SE 20%',
    status: "EPCC consortium: Xi'an Electric–XD Power Transmission. Financial close moved from 1 Jun 2026 to 30 Jun 2027; SCOD now 31 Dec 2030.",
    watchItem: {
      badge: 'Schedule Alert',
      title: 'Oriole: timeline reset',
      text: 'FCD extended to 30 Jun 2027 and SCOD to 31 Dec 2030. Potential equity divestment by SE.',
      tone: 'amber'
    },
    coords: { x: 70.0, y: 255.0 }
  },
  {
    id: 'sequioa',
    pinNumber: 6,
    name: 'Sequioa Hydro',
    capacity: '427 MW',
    capacityNum: 427,
    plantType: 'Hydro run-of-river',
    fuelType: 'hydro',
    location: 'Padas River, Tenom',
    region: 'West Coast',
    stage: 'Feasibility Stage',
    stageCategory: 'feasibility',
    cod: 'TBA (Target 2033)',
    equity: 'SE Lead',
    note: 'Feasibility; COD 2033',
    status: 'Detailed feasibility study. Pre-award to successful consultant; kick-off with ECoS and FS start in Nov 2026.',
    watchItem: {
      badge: 'Upcoming Milestone',
      title: 'Nov 2026: feasibility starts',
      text: 'Sequioa FS kick-off with ECoS; Technical Advisors for Tecoma and Shorea appointed by 30 Nov.',
      tone: 'sky'
    },
    coords: { x: 116.0, y: 268.0 }
  },
  {
    id: 'shorea',
    pinNumber: 7,
    name: 'Shorea',
    capacity: '80 MW',
    capacityNum: 80,
    plantType: 'Aeroderivative GT (LM2500 × 5)',
    fuelType: 'conversion',
    location: 'Sandakan & Tawau',
    region: 'East Coast',
    stage: 'Feasibility Stage',
    stageCategory: 'feasibility',
    cod: '2029',
    equity: 'SE 100%',
    note: 'Sandakan & Tawau converted to gas, 2029',
    status: 'CLOA from ECoS received 27 Apr 2026. Technical Advisor for feasibility and life assessment by 30 Nov 2026.',
    watchItem: {
      badge: 'Upcoming Milestone',
      title: 'Nov 2026: feasibility starts',
      text: 'Technical Advisors for Tecoma and Shorea appointed by 30 Nov.',
      tone: 'sky'
    },
    coords: { x: 336.3, y: 174.8 },
    secondCoords: { x: 315.8, y: 346.3 }
  }
];

export const BRIDGING_CAPACITY = [
  {
    id: 'shorea_bridge',
    name: 'Shorea',
    capacity: '80 MW',
    status: 'Sandakan & Tawau converted to gas, 2029',
    type: 'Aeroderivative GT (LM2500 × 5)',
    location: 'Sandakan & Tawau',
    badge: 'Conversion',
    badgeColor: 'emerald'
  },
  {
    id: 'sj_sandakan',
    name: 'SJ Sandakan',
    capacity: '72.7 MW',
    status: 'Extended to 2028, then gas',
    type: 'Thermal / Gas transition',
    location: 'Sandakan',
    badge: 'Bridging',
    badgeColor: 'slate'
  },
  {
    id: 'gt_tawau',
    name: 'GT Tawau',
    capacity: 'Bridging Unit',
    status: 'Extended to 2028, then gas (Shorea)',
    type: 'Gas Turbine',
    location: 'Tawau',
    badge: 'Bridging',
    badgeColor: 'slate'
  },
  {
    id: 'sj_tawau_dg',
    name: 'SJ Tawau DG',
    capacity: '27.2 MW',
    status: 'Extended to 2030',
    type: 'Diesel Generator',
    location: 'Tawau',
    badge: 'Bridging',
    badgeColor: 'slate'
  },
  {
    id: 'sj_kubota',
    name: 'SJ Kubota',
    capacity: '44 MW',
    status: 'Extended to 2030',
    type: 'Thermal plant',
    location: 'Tawau',
    badge: 'Bridging',
    badgeColor: 'slate'
  },
  {
    id: 'mutiara_gas',
    name: 'Mutiara Gas Cluster',
    capacity: '~40 mmscfd',
    status: 'New gas supply for Sandakan, 2029',
    type: 'Gas Supply Infrastructure',
    location: 'Sandakan Offshore Corridor',
    badge: 'Gas Supply',
    badgeColor: 'amber'
  }
];

export const PIPELINE_STAGES = [
  {
    id: 'contracting',
    title: 'CONTRACTING AND FINANCIAL-CLOSE STAGE',
    totalMW: '382 MW',
    projectIds: ['rancha', 'oriole', 'acacia'],
    accentColor: 'indigo'
  },
  {
    id: 'feasibility',
    title: 'FEASIBILITY STAGE',
    totalMW: '807 MW',
    projectIds: ['sequioa', 'tecoma', 'shorea'],
    accentColor: 'amber'
  }
];

export const WATCH_ITEMS = [
  {
    id: 'rancha_watch',
    title: 'Rancha: approval pending',
    tone: 'rose',
    text: 'Extension of FCD and PPA requested from ST on 27 Aug 2026; awaiting feedback (PPA deadline 31 Aug; FCD 15 Nov 2026)'
  },
  {
    id: 'oriole_watch',
    title: 'Oriole: timeline reset',
    tone: 'amber',
    text: 'FCD extended to 30 Jun 2027 and SCOD to 31 Dec 2030. Potential equity divestment by SE'
  },
  {
    id: 'feasibility_watch',
    title: 'Nov 2026: feasibility starts',
    tone: 'sky',
    text: 'Sequioa FS kick-off with ECoS; Technical Advisors for Tecoma and Shorea appointed by 30 Nov'
  }
];

export const FUEL_TYPE_CONFIG = {
  gas: {
    label: 'Gas',
    color: '#0F172A',
    bgClass: 'bg-slate-900 dark:bg-slate-800 text-white',
    pillClass: 'bg-slate-800 text-white',
    pinFill: '#1E293B',
    emoji: '🔥'
  },
  solar: {
    label: 'Solar',
    color: '#F59E0B',
    bgClass: 'bg-amber-500 text-white',
    pillClass: 'bg-amber-500 text-white',
    pinFill: '#D97706',
    emoji: '☀️'
  },
  hydro: {
    label: 'Hydro',
    color: '#2563EB',
    bgClass: 'bg-blue-600 text-white',
    pillClass: 'bg-blue-600 text-white',
    pinFill: '#2563EB',
    emoji: '💧'
  },
  conversion: {
    label: 'Conversion',
    color: '#059669',
    bgClass: 'bg-emerald-600 text-white',
    pillClass: 'bg-emerald-600 text-white',
    pinFill: '#059669',
    emoji: '🔄'
  }
};

// Re-export geographical SVG assets from sabahMapGeoData for backwards compatibility
export { SABAH_DISTRICTS, SABAH_MAP_DATA } from './sabahMapGeoData';
