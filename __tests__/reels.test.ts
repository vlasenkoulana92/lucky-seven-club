import { SYMBOLS, SymbolKey, WILD_KEY, symbolOf } from '../src/game/symbols';
import { PAYLINES, evaluateGrid, resolveLineSymbol, winningCellSet } from '../src/game/paylines';
import { BET } from '../src/constants/config';

function grid(rows: SymbolKey[][]): SymbolKey[][] {
  // rows are written row-major for readability; the engine reads grid[col][row]
  return [0, 1, 2].map(c => [rows[0][c], rows[1][c], rows[2][c]]);
}

describe('reels', () => {
  it('uses one shared symbol pool of five distinct symbols', () => {
    expect(SYMBOLS).toHaveLength(5);
    const keys = SYMBOLS.map(s => s.key);
    expect(new Set(keys).size).toBe(5);
    expect(SYMBOLS.filter(s => s.isWild).map(s => s.key)).toEqual([WILD_KEY]);
  });

  it('evaluates five fixed lines: three rows and both diagonals', () => {
    expect(PAYLINES).toHaveLength(5);
    PAYLINES.forEach(line => expect(line.cells).toHaveLength(3));
  });

  it('pays bet x payout for three of a kind on the centre row', () => {
    const g = grid([
      ['cherry', 'bar', 'bell'],
      ['bell', 'bell', 'bell'],
      ['bar', 'cherry', 'diamond'],
    ]);
    const res = evaluateGrid(g, BET, 0);
    const bell = symbolOf('bell');
    expect(res.total).toBe(BET * bell.payout);
    expect(res.best && res.best.symbol).toBe('bell');
    expect(res.headline).toBe('BELL RUN');
  });

  it('substitutes the wild seven on a line', () => {
    expect(resolveLineSymbol(['bell', 'seven', 'bell'])).toBe('bell');
    expect(resolveLineSymbol(['seven', 'seven', 'seven'])).toBe('seven');
    expect(resolveLineSymbol(['bell', 'bar', 'bell'])).toBeNull();
  });

  it('pays the seven payout for three real sevens, not a substituted one', () => {
    const g = grid([
      ['cherry', 'bar', 'bell'],
      ['seven', 'seven', 'seven'],
      ['bar', 'cherry', 'diamond'],
    ]);
    const res = evaluateGrid(g, BET, 0);
    expect(res.total).toBe(BET * symbolOf('seven').payout);
    expect(res.headline).toBe('SEVENS ALIGNED');
  });

  it('sums every winning line and marks the winning cells', () => {
    const g = grid([
      ['bar', 'bar', 'bar'],
      ['bell', 'bell', 'bell'],
      ['cherry', 'diamond', 'cherry'],
    ]);
    const res = evaluateGrid(g, BET, 0);
    expect(res.wins.length).toBe(2);
    expect(res.total).toBe(BET * (symbolOf('bar').payout + symbolOf('bell').payout));
    const marked = winningCellSet(res.wins);
    expect(marked['0:0']).toBe(true);
    expect(marked['1:1']).toBe(true);
    expect(marked['0:2']).toBeUndefined();
  });

  it('pays nothing when no line resolves', () => {
    const g = grid([
      ['cherry', 'bar', 'bell'],
      ['bar', 'diamond', 'cherry'],
      ['bell', 'cherry', 'bar'],
    ]);
    expect(evaluateGrid(g, BET, 0).total).toBe(0);
  });
});
