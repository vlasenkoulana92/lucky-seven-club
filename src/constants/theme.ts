/**
 * CASINO_GOLD preset (design-system/presets.ts) with a single restrained
 * ruby accent override, exactly as the design document specifies.
 */
export const THEME = {
  name: 'CASINO_GOLD',
  presetKey: 'casino-gold',
  style: 'SKEUOMORPHISM',
} as const;

export const COLORS = {
  bgDeep: '#0B0B0F',
  bgWarm: '#1E1A14',
  surface: '#141418',
  surfaceRaised: '#1C1C24',
  surfaceSunken: '#17171C',

  gold: '#D4AF37',
  goldLight: '#F5D77A',
  goldDark: '#A8812A',
  goldDeep: '#9C7622',

  ruby: '#C62B47',
  green: '#6FCF97',

  textPrimary: '#FFF8E7',
  textSecondary: '#B9B3A4',
  textMuted: '#7A7467',
  textOnGold: '#120F08',

  hairGold: 'rgba(212,175,55,0.22)',
  hairGoldStrong: 'rgba(212,175,55,0.35)',
  hairLight: 'rgba(255,255,255,0.10)',
  bevelTop: 'rgba(255,255,255,0.08)',
  bevelBottom: 'rgba(0,0,0,0.55)',
  glassFill: 'rgba(255,255,255,0.05)',
  scrim: 'rgba(0,0,0,0.34)',
} as const;

export const GRADIENTS = {
  loaderOverlay: ['rgba(11,11,15,0.97)', 'rgba(11,11,15,0.92)', 'rgba(30,26,20,0.96)'],
  menuScrim: ['rgba(11,11,15,0.55)', 'rgba(11,11,15,0.05)'],
  defaultScrim: ['rgba(11,11,15,0.78)', 'rgba(11,11,15,0.86)', 'rgba(30,26,20,0.92)'],
  resultScrim: ['rgba(11,11,15,0.90)', 'rgba(30,26,20,0.94)'],
  sheet: ['#17171C', '#121216'],
  goldButton: ['#D4AF37', '#A8812A'],
  goldButtonStrong: ['#D4AF37', '#9C7622'],
  goldButtonFlat: ['#4A4232', '#3A3426'],
  board: ['#241F16', '#15130E'],
  heat: ['#C62B47', '#F5D77A'],
  xp: ['#A8812A', '#F5D77A'],
} as const;

export const RADII = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 20,
  sheet: 28,
  pill: 999,
} as const;

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
} as const;

export const TYPE = {
  hero: { fontSize: 40, fontWeight: '800' as const, letterSpacing: 5 },
  title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 2 },
  section: { fontSize: 17, fontWeight: '700' as const, letterSpacing: 1.2 },
  body: { fontSize: 15, fontWeight: '500' as const },
  caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.4 },
  legal: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 1.2 },
} as const;

/** High-contrast variants are applied through this helper, never ad hoc. */
export function textTone(highContrast: boolean) {
  return {
    primary: highContrast ? '#FFFFFF' : COLORS.textPrimary,
    secondary: highContrast ? '#E8E2D4' : COLORS.textSecondary,
    muted: highContrast ? '#C9C2B2' : COLORS.textMuted,
    border: highContrast ? 'rgba(255,255,255,0.28)' : COLORS.hairLight,
  };
}

export default THEME;
