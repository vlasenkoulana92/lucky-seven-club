import {
  DAILY_BASE_BANKROLL,
  DAILY_COMFORT_BONUS,
  DAILY_MAX_SPINS,
  DAILY_STREAK_CAP,
  DAILY_STREAK_STEP,
} from '../constants/config';

export type ModifierKey = 'bellfever' | 'rubynight' | 'sevenstorm' | 'tighthouse';

export type DailyModifier = {
  key: ModifierKey;
  title: string;
  rule: string;
  accent: string;
};

export const MODIFIERS: DailyModifier[] = [
  { key: 'bellfever', title: 'BELL FEVER', rule: 'BELLS PAY DOUBLE TONIGHT', accent: '#D4AF37' },
  { key: 'rubynight', title: 'RUBY NIGHT', rule: 'CHERRIES DROP TWO SHARDS', accent: '#C62B47' },
  { key: 'sevenstorm', title: 'SEVEN STORM', rule: 'WILDS ARE WEIGHTED UP', accent: '#F5D77A' },
  { key: 'tighthouse', title: 'TIGHT HOUSE', rule: 'HALF BANKROLL, DOUBLE REWARD', accent: '#8FB8C9' },
];

/** Local calendar day key - the daily run is keyed off this, never off a clock. */
export function dayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

export function modifierForDay(key: string): DailyModifier {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return MODIFIERS[hash % MODIFIERS.length];
}

export function bankrollFor(comfort: number, modifier: DailyModifier): number {
  const base = DAILY_BASE_BANKROLL + comfort * DAILY_COMFORT_BONUS;
  return modifier.key === 'tighthouse' ? Math.round(base / 2) : base;
}

export function rewardFor(modifier: DailyModifier, streak: number): number {
  const base = modifier.key === 'tighthouse' ? 600 : 300;
  return Math.round(base * (1 + streakBonus(streak)));
}

export function streakBonus(streak: number): number {
  return Math.min(DAILY_STREAK_CAP, Math.max(0, streak) * DAILY_STREAK_STEP);
}

export function isPreviousDay(prev: string | null, today: string): boolean {
  if (!prev) {
    return false;
  }
  const parts = today.split('-').map(n => parseInt(n, 10));
  const yesterday = new Date(parts[0], parts[1] - 1, parts[2] - 1);
  return dayKey(yesterday) === prev;
}

export function nextStreak(prev: string | null, today: string, streak: number): number {
  if (prev === today) {
    return streak;
  }
  return isPreviousDay(prev, today) ? streak + 1 : 1;
}

export function isPlayedToday(lastDay: string | null, today: string): boolean {
  return !!lastDay && lastDay === today;
}

export const DAILY_SPIN_CAP = DAILY_MAX_SPINS;
