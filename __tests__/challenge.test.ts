import {
  SESSIONS,
  goalProgress,
  isGoalMet,
  isSessionLocked,
  isSessionOver,
  lockLabel,
  sessionByKey,
  startSession,
} from '../src/game/sessions';
import { initialState, reducer } from '../src/game/state';

describe('challenge sessions', () => {
  it('offers three tables with spin budgets and goals', () => {
    expect(SESSIONS.map(s => s.key)).toEqual(['warm', 'high', 'sevenrun']);
    expect(SESSIONS.map(s => s.spins)).toEqual([10, 15, 12]);
  });

  it('locks the deeper tables behind Club Level and explains the lock', () => {
    const high = sessionByKey('high')!;
    expect(isSessionLocked(high, 1)).toBe(true);
    expect(isSessionLocked(high, 2)).toBe(false);
    expect(lockLabel(high)).toBe('UNLOCKS AT CLUB LEVEL 2');
  });

  it('counts spins down and ends when the budget is gone', () => {
    const def = sessionByKey('warm')!;
    let run = startSession(def);
    expect(run.spinsLeft).toBe(10);
    for (let i = 0; i < 10; i++) {
      run = { ...run, spinsLeft: run.spinsLeft - 1 };
    }
    expect(isSessionOver(run, def)).toBe(true);
    expect(isGoalMet(run, def)).toBe(false);
  });

  it('ends early when the coin goal is met', () => {
    const def = sessionByKey('warm')!;
    const run = { ...startSession(def), coinsWon: 150 };
    expect(goalProgress(run, def)).toBe(1);
    expect(isGoalMet(run, def)).toBe(true);
    expect(isSessionOver(run, def)).toBe(true);
  });

  it('tracks the sevens goal of the Seven Run', () => {
    const def = sessionByKey('sevenrun')!;
    const run = { ...startSession(def), sevens: 3 };
    expect(isGoalMet(run, def)).toBe(true);
  });

  it('pays the session reward and the shard into the state', () => {
    const state = initialState();
    const out = reducer(state, {
      type: 'SESSION_REWARD',
      coins: 120,
      shardKey: 'bell',
      shards: 1,
    });
    expect(out.balance).toBe(state.balance + 120);
    expect(out.shards.bell).toBe(1);
  });
});
