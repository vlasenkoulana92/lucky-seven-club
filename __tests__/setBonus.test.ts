import { SET_BONUS_PER_SET } from '../src/constants/config';
import { COLLECTION_SETS, setBonusFor } from '../src/game/collections';
import { evaluateGrid } from '../src/game/paylines';
import { payout } from '../src/game/economy';
import { SymbolKey, symbolOf } from '../src/game/symbols';
import { initialState, setBonusOf } from '../src/game/state';

function centreRow(symbol: SymbolKey): SymbolKey[][] {
  return [
    ['cherry', symbol, 'bar'],
    ['bar', symbol, 'diamond'],
    ['diamond', symbol, 'cherry'],
  ];
}

describe('collection set bonus', () => {
  it('adds 2% per claimed set and caps at 8%', () => {
    expect(setBonusFor([])).toBe(0);
    expect(setBonusFor(['bell'])).toBeCloseTo(SET_BONUS_PER_SET);
    expect(setBonusFor(['bell', 'bell'])).toBeCloseTo(SET_BONUS_PER_SET);
    expect(setBonusFor(COLLECTION_SETS.map(s => s.key))).toBeCloseTo(0.08);
  });

  it('multiplies every later line win', () => {
    const plain = evaluateGrid(centreRow('bell'), 10, 0);
    const boosted = evaluateGrid(centreRow('bell'), 10, 0.08);
    expect(plain.total).toBe(10 * symbolOf('bell').payout);
    expect(boosted.total).toBeGreaterThan(plain.total);
    expect(boosted.total).toBe(payout(10, symbolOf('bell').payout, 0.08));
  });

  it('is read from the live state', () => {
    const state = { ...initialState(), claimedSets: ['bell', 'cherry'] };
    expect(setBonusOf(state)).toBeCloseTo(0.04);
  });
});
