import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const jakarta = loadJakarta('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

const mono = loadMono('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
});

export const FONT_SANS = jakarta.fontFamily;
export const FONT_MONO = mono.fontFamily;
