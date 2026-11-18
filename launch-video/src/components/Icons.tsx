import React from 'react';

type IconProps = {
  size?: number;
  color?: string;
};

export const FlameIcon: React.FC<IconProps> = ({ size = 20, color = '#d97706' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c1.5 3.2 4.5 4.8 4.5 8.5a4.5 4.5 0 1 1-9 0c0-2.1 1-3.8 2.2-5.1.3 1.4 1.1 2.2 2.3 2.6-.4-2.2 0-4.2 0-6Z" fill={`${color}22`} />
  </svg>
);

export const BoltIcon: React.FC<IconProps> = ({ size = 18, color = '#0f766e' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={`${color}20`} />
  </svg>
);

export const FormulaIcon: React.FC<IconProps> = ({ size = 20, color = '#c2410c' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19h16M4 19V5l16 14H4Z" />
    <path d="M8 15h4" />
  </svg>
);

export const CrownIcon: React.FC<IconProps> = ({ size = 28, color = '#d97706' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={`${color}35`} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18h18l-1.5-10-4.5 4-3-6-3 6-4.5-4L3 18Z" />
    <path d="M4 21h16" />
  </svg>
);

export const PrinterIcon: React.FC<IconProps> = ({ size = 18, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <path d="M6 9V3h12v6" />
    <rect x="6" y="14" width="12" height="7" rx="1" />
  </svg>
);

export const BookmarkIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 20,
  color = 'currentColor',
  filled = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : 'none'}
    stroke={color}
    strokeWidth="2.3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);
