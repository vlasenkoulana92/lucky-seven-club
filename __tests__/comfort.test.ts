import { DAILY_BASE_BANKROLL, DAILY_COMFORT_BONUS } from '../src/constants/config';
import { LOUNGE_DECOR, comfortFor, dailyBankrollFor } from '../src/game/lounge';
import { MODIFIERS, bankrollFor } from '../src/game/daily';
import { shardDropsFor } from '../src/game/collections';
import { comfortOf, initialState, reducer } from '../src/game/state';

describe('lounge comfort payoff', () => {
  it('sums the comfort of every placed piece', () => {
    expect(comfortFor([])).toBe(0);
    expect(comfortFor(['booth'])).toBe(2);
    expect(comfortFor(['booth', 'lamp'])).toBe(5);
    expect(comfortFor(['booth', 'booth'])).toBe(2);
    expect(comfortFor(LOUNGE_DECOR.map(d => d.key))).toBe(30);
  });

  it('is read straight off the state', () => {
    let state = initialState();
    state = reducer(state, { type: 'BUY_DECOR', key: 'lamp' });
    expect(comfortOf(state)).toBe(3);
  });

  it('raises the daily bankroll by ten coins per point', () => {
    const bell = MODIFIERS.find(m => m.key === 'bellfever')!;
    expect(dailyBankrollFor(0, DAILY_BASE_BANKROLL, DAILY_COMFORT_BONUS)).toBe(300);
    expect(dailyBankrollFor(7, DAILY_BASE_BANKROLL, DAILY_COMFORT_BONUS)).toBe(370);
    expect(bankrollFor(7, bell)).toBe(370);
  });

  it('adds an extra-shard chance that only fires inside the comfort window', () => {
    const tally = { bell: 2 };
    expect(shardDropsFor(tally, { comfortBonus: 0, roll: 0 })).toEqual({ bell: 1 });
    expect(shardDropsFor(tally, { comfortBonus: 10, roll: 0.01 })).toEqual({ bell: 2 });
    expect(shardDropsFor(tally, { comfortBonus: 10, roll: 0.5 })).toEqual({ bell: 1 });
  });
});
