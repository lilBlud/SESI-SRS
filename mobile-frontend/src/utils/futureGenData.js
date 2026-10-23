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
    coords: { x: 130.2, y: 148.1 }
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
    coords: { x: 114.3, y: 203.7 }
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
    coords: { x: 78.1, y: 278.4 }
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
    coords: { x: 106.8, y: 281.6 }
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


// Official geoBoundaries Sabah Map Geometry and Transmission Grid Nodes
export const SABAH_MAP_DATA = {
  viewBox: "18 10 455 360",
  mainlandPath: "M 80.3,360.0 L 84.0,351.2 L 86.7,351.7 L 90.4,345.7 L 94.2,348.3 L 97.2,346.7 L 96.7,344.4 L 101.5,340.3 L 101.7,331.6 L 104.8,330.2 L 107.9,334.6 L 112.7,334.1 L 119.0,337.2 L 119.5,340.9 L 123.7,342.9 L 128.1,336.2 L 132.6,335.8 L 133.5,330.4 L 144.2,333.6 L 152.4,330.6 L 161.3,337.6 L 162.2,341.6 L 165.8,339.9 L 166.9,336.4 L 172.4,337.9 L 172.3,332.3 L 175.6,328.8 L 177.6,332.4 L 180.3,332.2 L 182.3,336.7 L 186.2,334.9 L 189.9,336.8 L 195.2,330.9 L 199.2,336.3 L 201.5,334.9 L 204.6,337.5 L 211.8,333.0 L 217.9,336.3 L 222.0,335.4 L 223.6,338.4 L 226.0,335.4 L 232.9,336.8 L 237.7,334.6 L 242.5,336.5 L 247.7,332.5 L 253.1,339.3 L 261.0,341.9 L 264.8,345.3 L 270.2,353.3 L 277.8,355.2 L 282.7,353.0 L 287.2,355.4 L 286.2,349.4 L 291.6,343.0 L 287.5,340.9 L 287.4,333.7 L 283.9,333.8 L 281.6,330.2 L 283.0,327.0 L 285.2,328.7 L 290.0,325.9 L 297.8,334.0 L 305.3,337.4 L 306.0,330.6 L 307.8,331.0 L 307.4,334.2 L 308.4,333.2 L 309.4,335.9 L 307.2,335.6 L 307.9,339.5 L 313.0,342.0 L 315.0,346.3 L 320.7,345.8 L 327.5,348.7 L 341.7,341.5 L 351.6,340.7 L 363.3,336.6 L 365.4,338.7 L 367.4,335.2 L 371.9,337.4 L 379.8,333.9 L 386.4,335.0 L 385.8,332.2 L 391.2,329.7 L 388.9,327.7 L 390.6,325.3 L 392.6,329.4 L 396.4,325.5 L 393.5,321.2 L 388.5,316.8 L 381.1,317.2 L 381.6,313.7 L 374.1,308.2 L 370.5,309.8 L 367.3,305.4 L 360.9,305.2 L 360.0,302.3 L 356.2,301.8 L 354.8,298.2 L 349.8,294.4 L 348.7,287.4 L 345.7,282.9 L 341.5,283.0 L 342.3,280.1 L 340.6,277.9 L 344.5,278.6 L 345.1,275.2 L 348.3,274.0 L 348.5,271.2 L 352.9,268.0 L 357.9,269.5 L 358.9,266.1 L 360.1,269.8 L 361.3,267.2 L 359.7,265.4 L 361.4,265.9 L 363.4,263.1 L 371.2,263.3 L 375.2,266.3 L 378.3,273.8 L 382.9,273.7 L 386.3,269.9 L 399.9,272.7 L 419.5,266.4 L 426.5,261.5 L 444.2,257.4 L 456.9,250.7 L 462.4,243.4 L 462.5,239.7 L 460.3,237.3 L 462.2,232.1 L 461.3,227.4 L 454.8,219.3 L 450.2,217.4 L 441.9,222.7 L 428.2,219.6 L 427.9,223.0 L 426.0,223.1 L 427.2,221.1 L 425.7,218.8 L 413.9,211.3 L 412.9,219.1 L 413.3,212.1 L 395.0,197.0 L 391.1,198.9 L 391.0,203.8 L 387.5,210.3 L 385.2,210.7 L 386.8,210.0 L 385.2,208.6 L 388.6,203.2 L 388.4,198.7 L 391.7,195.7 L 365.2,177.3 L 364.1,181.7 L 363.0,179.9 L 360.6,180.3 L 362.7,178.4 L 356.8,178.6 L 353.1,175.7 L 344.0,179.9 L 345.7,182.4 L 344.3,183.7 L 347.6,185.9 L 342.3,186.5 L 343.6,191.8 L 341.6,194.6 L 339.9,190.2 L 336.4,191.1 L 334.1,188.7 L 322.3,193.8 L 323.0,191.8 L 320.5,189.2 L 322.3,187.4 L 318.4,186.7 L 319.7,183.4 L 317.2,180.9 L 327.4,179.4 L 329.7,174.0 L 328.6,179.9 L 331.2,181.5 L 342.1,174.6 L 333.9,166.9 L 330.7,168.4 L 331.3,170.0 L 329.4,169.1 L 333.6,166.7 L 330.7,160.8 L 332.7,165.0 L 335.2,163.2 L 331.6,158.7 L 332.7,155.0 L 328.9,156.0 L 330.8,157.5 L 329.2,159.2 L 329.0,152.4 L 326.1,151.5 L 324.5,155.0 L 318.2,159.4 L 316.3,164.3 L 302.2,165.3 L 302.9,169.0 L 293.7,168.5 L 286.8,171.0 L 286.0,167.3 L 294.0,162.3 L 293.8,159.4 L 287.9,156.0 L 291.6,152.2 L 289.0,146.4 L 284.7,143.9 L 286.7,143.3 L 286.1,141.3 L 279.4,142.4 L 283.4,141.4 L 282.6,139.2 L 280.2,139.1 L 283.5,139.9 L 286.0,135.1 L 287.9,136.0 L 292.3,132.6 L 296.6,134.3 L 298.2,132.5 L 299.5,126.6 L 297.7,114.9 L 299.3,117.4 L 300.4,113.3 L 291.3,105.6 L 280.3,101.1 L 276.9,91.4 L 271.8,99.2 L 266.8,99.7 L 261.6,93.6 L 252.5,93.2 L 249.6,83.9 L 251.9,81.1 L 244.8,71.4 L 248.9,66.5 L 247.5,65.4 L 249.1,63.9 L 248.6,58.3 L 242.7,56.8 L 238.0,50.7 L 235.7,51.0 L 235.6,53.7 L 232.5,52.4 L 228.0,54.8 L 228.2,56.9 L 230.8,57.6 L 229.6,59.0 L 225.8,57.3 L 224.5,59.1 L 225.1,63.7 L 227.8,66.0 L 227.0,68.8 L 231.7,72.5 L 228.6,69.1 L 224.2,70.9 L 220.8,76.0 L 221.8,78.5 L 220.3,77.8 L 218.9,79.9 L 219.7,83.7 L 206.5,93.2 L 206.2,97.0 L 197.6,98.3 L 197.6,96.4 L 196.7,97.6 L 194.9,95.8 L 195.5,91.6 L 206.5,76.4 L 206.1,71.7 L 207.6,70.9 L 204.6,69.4 L 206.4,67.2 L 199.8,67.8 L 199.1,64.2 L 201.6,66.0 L 203.4,63.3 L 205.8,65.3 L 206.8,63.4 L 203.5,55.6 L 194.1,48.0 L 188.3,63.2 L 183.4,66.6 L 183.7,69.2 L 186.8,71.3 L 181.9,75.4 L 183.5,83.3 L 180.8,87.5 L 175.9,89.0 L 168.0,101.9 L 167.2,107.0 L 152.4,116.7 L 154.2,118.5 L 151.1,117.3 L 152.1,119.6 L 149.3,119.3 L 148.4,120.7 L 150.2,121.5 L 148.5,122.5 L 150.3,123.0 L 148.2,124.4 L 150.7,126.1 L 146.4,127.1 L 146.1,124.7 L 144.9,127.4 L 140.2,129.0 L 137.4,133.2 L 145.6,129.1 L 144.3,133.0 L 146.5,133.5 L 143.3,135.5 L 144.6,134.3 L 141.2,132.0 L 135.3,134.6 L 130.0,143.7 L 134.8,143.5 L 137.4,141.0 L 136.6,143.6 L 129.3,145.4 L 130.1,148.0 L 132.2,148.0 L 129.8,148.6 L 127.8,146.4 L 129.6,143.8 L 124.4,147.2 L 126.2,150.5 L 127.4,148.3 L 129.4,149.1 L 126.9,158.7 L 123.9,159.0 L 119.6,163.5 L 119.1,176.8 L 104.7,186.2 L 101.0,204.5 L 89.0,209.0 L 79.1,208.0 L 73.1,204.7 L 72.7,210.5 L 71.5,206.3 L 75.0,200.0 L 72.1,198.1 L 67.2,207.8 L 47.9,224.3 L 47.8,230.5 L 45.1,233.9 L 48.8,233.5 L 53.6,237.2 L 57.6,236.7 L 54.4,237.9 L 56.5,240.0 L 64.8,244.6 L 68.0,243.9 L 67.6,246.0 L 69.6,246.5 L 66.9,258.1 L 63.5,262.3 L 58.6,264.1 L 56.6,267.8 L 63.9,269.9 L 72.1,266.7 L 75.0,269.3 L 78.4,281.6 L 78.5,289.3 L 76.4,290.4 L 73.0,300.1 L 69.1,303.5 L 67.0,309.1 L 70.8,317.1 L 68.6,321.1 L 71.9,326.3 L 71.4,333.3 L 79.8,337.6 L 75.9,354.5 L 77.5,359.3 L 80.3,360.0 Z",
  sarawakPath: "M 56.6,267.8 L 55.5,267.6 L 52.1,274.1 L 47.9,276.5 L 37.3,274.2 L 31.8,268.8 L 27.7,274.6 L 27.1,278.7 L 30.7,279.3 L 36.1,286.1 L 38.6,301.9 L 40.0,324.0 L 36.5,332.7 L 28.6,331.8 L 22.0,340.0 L 20.0,360.0 L 80.3,360.0 L 77.5,359.3 L 75.9,354.5 L 79.8,337.6 L 71.4,333.3 L 71.9,326.3 L 68.6,321.1 L 70.8,317.1 L 67.0,309.1 L 69.1,303.5 L 73.0,300.1 L 76.4,290.4 L 78.5,289.3 L 78.4,281.6 L 75.0,269.3 L 72.1,266.7 L 63.9,269.9 Z",
  banggiPath: "M 227.8,38.3 L 229.6,41.3 L 231.0,37.1 L 239.8,32.3 L 245.1,32.3 L 247.8,28.0 L 247.2,32.2 L 249.0,32.0 L 251.7,27.1 L 251.4,25.4 L 249.4,25.8 L 251.1,23.9 L 249.4,22.5 L 252.9,17.3 L 251.2,14.5 L 237.7,14.5 L 234.7,18.3 L 228.1,20.7 L 227.3,32.0 L 229.6,33.1 L 227.8,38.3 Z",
  labuan: { cx: 34.7, cy: 235.4, rx: 9, ry: 13 },
  dividerPath: "M 210,75 L 214,120 L 218,168 L 216,230 L 218,290 L 218,360",
  westClipPolygon: "M 0,0 L 260,0 L 260,50 L 220,68 L 214,120 L 218,168 L 216,230 L 218,290 L 218,400 L 0,400 Z",
  nodes: {
  "Kudat": [
    205.2,
    64.5
  ],
  "Kota Belud": [
    161.1,
    121.3
  ],
  "Mengaris_Solar": [
    179.1,
    100.1
  ],
  "Kota Kinabalu": [
    123.3,
    160.9
  ],
  "Melawa_Tecoma": [
    130.2,
    148.1
  ],
  "Ranau": [
    186.2,
    164.2
  ],
  "Papar": [
    108.2,
    187.3
  ],
  "Kimanis_Acacia": [
    114.3,
    203.7
  ],
  "Beaufort": [
    88.3,
    228.5
  ],
  "Labuan_Rancha": [
    34.7,
    235.4
  ],
  "Keningau": [
    132.8,
    228.9
  ],
  "Tenom": [
    109.3,
    251.8
  ],
  "Oriole_UpperPadas": [
    78.1,
    278.4
  ],
  "Sequoia_Tenom": [
    106.8,
    281.6
  ],
  "Sapi Nangoh": [
    267.6,
    173.1
  ],
  "Segaliud": [
    306.6,
    192.6
  ],
  "Sandakan_Shorea": [
    336.3,
    174.8
  ],
  "Lahad Datu": [
    362.6,
    262.7
  ],
  "Kunak": [
    354.4,
    299.4
  ],
  "Semporna": [
    392.8,
    321.0
  ],
  "Tawau_Shorea": [
    315.8,
    346.3
  ],
  "Lawas": [
    51.6,
    281.6
  ]
},
  existingPlants: [
    { name: "Kudat", x: 216, y: 64 },
    { name: "Kota Kinabalu", x: 132, y: 161 },
    { name: "Labuan", x: 22, y: 244 },
    { name: "Keningau", x: 146, y: 234 },
    { name: "Sandakan", x: 350, y: 182 },
    { name: "Lahad Datu", x: 375, y: 265 },
    { name: "Kunak", x: 366, y: 304 },
    { name: "Tawau", x: 302, y: 355 }
  ],
  mutiaraGas: { x: 355, y: 135 }
};
