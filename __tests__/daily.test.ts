import {
  MODIFIERS,
  bankrollFor,
  dayKey,
  isPlayedToday,
  isPreviousDay,
  modifierForDay,
  nextStreak,
  rewardFor,
  streakBonus,
} from '../src/game/daily';
import { initialState, reducer } from '../src/game/state';

describe('daily mode', () => {
  it('keys the run off the local calendar day', () => {
    expect(dayKey(new Date(2026, 10, 9))).toBe('2026-11-09');
    expect(isPlayedToday('2026-11-09', '2026-11-09')).toBe(true);
    expect(isPlayedToday('2026-11-08', '2026-11-09')).toBe(false);
    expect(isPlayedToday(null, '2026-11-09')).toBe(false);
  });

  it('rotates four modifiers deterministically per day', () => {
    expect(MODIFIERS).toHaveLength(4);
    expect(new Set(MODIFIERS.map(m => m.key)).size).toBe(4);
    const a = modifierForDay('2026-11-09');
    const b = modifierForDay('2026-11-09');
    expect(a.key).toBe(b.key);
  });

  it('scales the bankroll with Comfort and halves it on a tight house', () => {
    const bell = MODIFIERS.find(m => m.key === 'bellfever')!;
    const tight = MODIFIERS.find(m => m.key === 'tighthouse')!;
    expect(bankrollFor(0, bell)).toBe(300);
    expect(bankrollFor(5, bell)).toBe(350);
    expect(bankrollFor(0, tight)).toBe(150);
  });

  it('grows the streak only on consecutive days and caps the bonus at 15%', () => {
    expect(isPreviousDay('2026-11-08', '2026-11-09')).toBe(true);
    expect(isPreviousDay('2026-11-06', '2026-11-09')).toBe(false);
    expect(nextStreak('2026-11-08', '2026-11-09', 3)).toBe(4);
    expect(nextStreak('2026-11-01', '2026-11-09', 3)).toBe(1);
    expect(nextStreak('2026-11-09', '2026-11-09', 3)).toBe(3);
    expect(streakBonus(2)).toBeCloseTo(0.1);
    expect(streakBonus(9)).toBeCloseTo(0.15);
  });

  it('pays double on a tight house and records the spent day', () => {
    const tight = MODIFIERS.find(m => m.key === 'tighthouse')!;
    const bell = MODIFIERS.find(m => m.key === 'bellfever')!;
    expect(rewardFor(tight, 0)).toBe(600);
    expect(rewardFor(bell, 0)).toBe(300);

    const state = initialState();
    const out = reducer(state, {
      type: 'DAILY_FINISHED',
      day: '2026-11-09',
      streak: 2,
      reward: 330,
    });
    expect(out.balance).toBe(state.balance + 330);
    expect(out.dailyLastDay).toBe('2026-11-09');
    expect(out.dailyStreak).toBe(2);
    expect(isPlayedToday(out.dailyLastDay, '2026-11-09')).toBe(true);
  });
});
