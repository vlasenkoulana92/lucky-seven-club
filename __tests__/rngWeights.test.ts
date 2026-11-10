import { SYMBOLS } from '../src/game/symbols';
import { createRandom, drawGrid, makeSeed, weightsFor } from '../src/game/rng';
import { evaluateGrid } from '../src/game/paylines';
import { BET } from '../src/constants/config';
import { initialState, reducer } from '../src/game/state';

const PLAIN = { pity: false, heatSpin: false, cooldown: false };

describe('weighted rng', () => {
  it('is deterministic for a given seed', () => {
    const a = createRandom(makeSeed(7, 2));
    const b = createRandom(makeSeed(7, 2));
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    const c = createRandom(makeSeed(8, 2));
    expect(a()).not.toBe(c());
  });

  it('keeps the hit rate between 30% and 40% over 20000 spins', () => {
    const rand = createRandom(makeSeed(1, 1));
    const N = 20000;
    let hits = 0;
    for (let i = 0; i < N; i++) {
      const grid = drawGrid(rand, PLAIN);
      if (evaluateGrid(grid, BET, 0).total > 0) {
        hits++;
      }
    }
    const rate = hits / N;
    expect(rate).toBeGreaterThan(0.3);
    expect(rate).toBeLessThan(0.4);
  });

  it('keeps low-value symbols common and the jackpot rare', () => {
    const byKey: Record<string, number> = {};
    SYMBOLS.forEach(s => {
      byKey[s.key] = s.weight;
    });
    expect(byKey.cherry).toBeGreaterThan(byKey.bar);
    expect(byKey.bar).toBeGreaterThan(byKey.bell);
    expect(byKey.bell).toBeGreaterThan(byKey.diamond);
    expect(byKey.diamond).toBeGreaterThan(byKey.seven);
  });

  it('softens a dry streak with a pity bias and suspends it after a big win', () => {
    const wild = SYMBOLS.findIndex(s => s.isWild);
    const plain = weightsFor(PLAIN);
    const pity = weightsFor({ pity: true, heatSpin: false, cooldown: false });
    const cooldown = weightsFor({ pity: true, heatSpin: true, cooldown: true });
    expect(pity[wild]).toBeCloseTo(plain[wild] * 1.4);
    expect(cooldown[wild]).toBe(SYMBOLS[wild].weight);
  });

  it('tracks the loss streak and the big-win cooldown in the state', () => {
    let state = initialState();
    const lose = { grid: [], wins: [], total: 0, sevens: 0, shardDrops: {}, heatSpin: false, bet: BET } as any;
    state = reducer(state, { type: 'SPIN_RESULT', outcome: lose });
    state = reducer(state, { type: 'SPIN_RESULT', outcome: lose });
    expect(state.lossStreak).toBe(2);

    const bigWin = {
      grid: [],
      wins: [{ lineId: 0, lineName: 'TOP ROW', symbol: 'seven', amount: BET * 50, cells: [] }],
      total: BET * 50,
      sevens: 3,
      shardDrops: {},
      heatSpin: false,
      bet: BET,
    } as any;
    state = reducer(state, { type: 'SPIN_RESULT', outcome: bigWin });
    expect(state.lossStreak).toBe(0);
    expect(state.bigWinCooldown).toBe(2);
  });
});
