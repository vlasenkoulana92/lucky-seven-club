import { LOUNGE_DECOR, canAfford, comfortFor, decorByKey, isOwned, missingCoins } from '../src/game/lounge';
import { initialState, reducer } from '../src/game/state';

describe('lounge', () => {
  it('offers six decor slots priced 250 to 2000', () => {
    expect(LOUNGE_DECOR).toHaveLength(6);
    expect(LOUNGE_DECOR[0].price).toBe(250);
    expect(LOUNGE_DECOR[LOUNGE_DECOR.length - 1].price).toBe(2000);
    expect(new Set(LOUNGE_DECOR.map(d => d.key)).size).toBe(6);
  });

  it('reports what is still missing while the balance is short', () => {
    expect(canAfford(100, 'booth')).toBe(false);
    expect(missingCoins(100, 'booth')).toBe(150);
    expect(canAfford(250, 'booth')).toBe(true);
    expect(missingCoins(250, 'booth')).toBe(0);
  });

  it('places a piece, deducts the coins and raises Comfort', () => {
    const state = initialState();
    const out = reducer(state, { type: 'BUY_DECOR', key: 'booth' });
    const booth = decorByKey('booth');
    expect(out.balance).toBe(state.balance - (booth ? booth.price : 0));
    expect(isOwned(out.decor, 'booth')).toBe(true);
    expect(comfortFor(out.decor)).toBe(booth ? booth.comfort : 0);
  });

  it('refuses to place a piece the player cannot pay for', () => {
    const state = { ...initialState(), balance: 10 };
    const out = reducer(state, { type: 'BUY_DECOR', key: 'chandelier' });
    expect(out.balance).toBe(10);
    expect(out.decor).toHaveLength(0);
  });

  it('never buys the same piece twice', () => {
    let state = initialState();
    state = reducer(state, { type: 'BUY_DECOR', key: 'booth' });
    const after = reducer(state, { type: 'BUY_DECOR', key: 'booth' });
    expect(after.balance).toBe(state.balance);
    expect(after.decor).toEqual(['booth']);
  });
});
