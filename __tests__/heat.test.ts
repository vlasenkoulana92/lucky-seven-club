import { HEAT_MAX, HEAT_WILD_MULTIPLIER } from '../src/constants/config';
import { SYMBOLS } from '../src/game/symbols';
import { weightsFor } from '../src/game/rng';
import { initialState, reducer } from '../src/game/state';

function spinOutcome(sevens: number, heatSpin: boolean) {
  return {
    grid: [],
    wins: [],
    total: 0,
    sevens,
    shardDrops: {},
    heatSpin,
    bet: 10,
  } as any;
}

describe('seven heat', () => {
  it('fills by one per seven on the board and stops at the maximum', () => {
    let state = initialState();
    state = reducer(state, { type: 'SPIN_RESULT', outcome: spinOutcome(2, false) });
    expect(state.heat).toBe(2);
    state = reducer(state, { type: 'SPIN_RESULT', outcome: spinOutcome(9, false) });
    expect(state.heat).toBe(HEAT_MAX);
  });

  it('resets the meter on the heat spin itself', () => {
    let state = { ...initialState(), heat: HEAT_MAX };
    state = reducer(state, { type: 'SPIN_RESULT', outcome: spinOutcome(1, true) });
    expect(state.heat).toBe(0);
  });

  it('triples the wild weight for a heat spin only', () => {
    const wildIndex = SYMBOLS.findIndex(s => s.isWild);
    const base = weightsFor({ pity: false, heatSpin: false, cooldown: false });
    const hot = weightsFor({ pity: false, heatSpin: true, cooldown: false });
    expect(hot[wildIndex]).toBe(base[wildIndex] * HEAT_WILD_MULTIPLIER);
    SYMBOLS.forEach((s, i) => {
      if (!s.isWild) {
        expect(hot[i]).toBe(base[i]);
      }
    });
  });

  it('counts the sevens into the lifetime record', () => {
    let state = initialState();
    state = reducer(state, { type: 'SPIN_RESULT', outcome: spinOutcome(3, false) });
    expect(state.sevensLanded).toBe(3);
  });
});
