import { loadFont as loadSans } from '@remotion/google-fonts/PlusJakartaSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const sans = loadSans('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

const mono = loadMono('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
});

export const FONT_SANS = `${sans.fontFamily}, "Segoe UI", system-ui, sans-serif`;
export const FONT_MONO = `${mono.fontFamily}, Consolas, monospace`;

export const PALETTE = {
  bgLight: '#F4F7FB',
  surfaceOffWhite: '#F5F7FA',
  surfaceClosing: '#F6F8FC',
  bgSurface: '#FFFFFF',
  bgDark: '#081427',
  bgMidnight: '#061326',
  bgMidnightAlt: '#071830',
  bgSlateSoft: '#E8EFF8',
  navy: '#0D3B7A',
  navyBright: '#1557B0',
  green: '#2FA65A',
  greenSoft: '#E8F7EE',
  emeraldAccent: '#34D399',
  gold: '#E59819',
  goldSoft: '#FEF5E4',
  crimson: '#C62828',
  crimsonSoft: '#FDECEC',
  ink: '#0F172A',
  inkSlate: '#1E293B',
  inkSecondary: '#475569',
  inkMuted: '#64748B',
  slateLight: '#94A3B8',
  textOnDark: '#F8FAFC',
  borderSubtle: 'rgba(13, 59, 122, 0.12)',
  shadowCard: '0 24px 60px rgba(13, 59, 122, 0.10)',
  shadowDark: '0 24px 60px rgba(4, 12, 26, 0.42)',
} as const;
