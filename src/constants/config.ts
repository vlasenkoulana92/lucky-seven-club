import { Dimensions } from 'react-native';

/**
 * Loader hold. EXACTLY 8000 ms — the product maximum and the value every
 * pipeline scan expects. Shorter values race the QA screenshot window.
 */
export const LOADER_DURATION_MS = 8000;

export const SCREEN_W = Dimensions.get('window').width;
export const SCREEN_H = Dimensions.get('window').height;

/* ---------- Slot board geometry (parent padding + border accounted for) ---------- */
export const REELS = 3;
export const ROWS = 3;
export const BOARD_PAD = 10;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 12
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const CELL = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / REELS);
export const BOARD_W = CELL * REELS + 2 * BOARD_FRAME;
export const BOARD_H = CELL * ROWS + 2 * BOARD_FRAME;
export const CELL_COMPACT = CELL - 10;

/* ---------- Economy ---------- */
export const START_BALANCE = 1000;
export const BET = 10;
export const REFILL_AMOUNT = 500;
export const SET_CLAIM_REWARD = 300;
export const SET_BONUS_PER_SET = 0.02; // +2% payouts per completed set

/* ---------- Spin timing ---------- */
export const SPIN_DURATION_CLASSIC = 2400;
export const SPIN_DURATION_TURBO = 1200;
export const REEL_STOPS_CLASSIC = [1400, 1660, 1920];
export const REEL_STOPS_TURBO = [700, 860, 1020];
export const RESOLVE_PAUSE_MS = 120;
export const WIN_BANNER_HOLD_MS = 700;
export const STRIP_FILL = 18; // filler symbols scrolled before the result row

export function reelStops(turbo: boolean): number[] {
  return turbo ? REEL_STOPS_TURBO : REEL_STOPS_CLASSIC;
}

export function spinDurationMs(turbo: boolean): number {
  return turbo ? SPIN_DURATION_TURBO : SPIN_DURATION_CLASSIC;
}

/* ---------- Seven Heat ---------- */
export const HEAT_MAX = 5;
export const HEAT_WILD_MULTIPLIER = 3;

/* ---------- Progression ---------- */
export const XP_PER_SPIN = 4;
export const XP_PER_WIN = 12;
export const XP_PER_LEVEL = 2000;

/* ---------- Daily ---------- */
export const DAILY_BASE_BANKROLL = 300;
export const DAILY_COMFORT_BONUS = 10;
export const DAILY_MAX_SPINS = 20;
export const DAILY_STREAK_STEP = 0.05;
export const DAILY_STREAK_CAP = 0.15;

/* ---------- Animation ---------- */
export const SPRING_BUTTON = { tension: 180, friction: 12 };
export const SPRING_CARD = { tension: 170, friction: 11 };
export const FADE_SCREEN_MS = 260;
export const FADE_SCREEN_REDUCED_MS = 150;
export const BREATHE_MS = 2600;
export const FLOAT_MS = 3200;

export function motionMs(base: number, reduceMotion: boolean): number {
  return reduceMotion ? Math.min(base, FADE_SCREEN_REDUCED_MS) : base;
}

export default {
  LOADER_DURATION_MS,
  BET,
  START_BALANCE,
};
