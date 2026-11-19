export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

export const SPRING_PILL = {
  type: 'spring',
  stiffness: 460,
  damping: 36,
  mass: 0.9,
};

export const SPRING_CARD = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
};

export const MODAL_BACKDROP = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18, ease: 'easeOut' },
};

export const MODAL_SHEET = {
  initial: { opacity: 0, y: 24, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.985 },
  transition: { duration: 0.24, ease: EASE_OUT_EXPO },
};

export const MODAL_DIALOG = {
  initial: { opacity: 0, scale: 0.94, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
  transition: { duration: 0.2, ease: EASE_OUT_EXPO },
};
