import { SymbolKey, symbolOf, WILD_KEY, winHeadline } from './symbols';

export type Cell = { col: number; row: number };

/** Five fixed lines: three rows and the two diagonals. */
export const PAYLINES: { id: number; name: string; cells: Cell[] }[] = [
  { id: 0, name: 'TOP ROW', cells: [{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 2, row: 0 }] },
  { id: 1, name: 'CENTRE ROW', cells: [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }] },
  { id: 2, name: 'BOTTOM ROW', cells: [{ col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }] },
  { id: 3, name: 'FALLING LINE', cells: [{ col: 0, row: 0 }, { col: 1, row: 1 }, { col: 2, row: 2 }] },
  { id: 4, name: 'RISING LINE', cells: [{ col: 0, row: 2 }, { col: 1, row: 1 }, { col: 2, row: 0 }] },
];

export type LineWin = {
  lineId: number;
  lineName: string;
  symbol: SymbolKey;
  amount: number;
  cells: Cell[];
};

export type SpinEvaluation = {
  wins: LineWin[];
  total: number;
  best: LineWin | null;
  headline: string;
};

/** Wild substitutes for any symbol; three real sevens pay the seven payout. */
export function resolveLineSymbol(keys: SymbolKey[]): SymbolKey | null {
  const nonWild = keys.filter(k => k !== WILD_KEY);
  if (nonWild.length === 0) {
    return WILD_KEY;
  }
  const first = nonWild[0];
  for (let i = 1; i < nonWild.length; i++) {
    if (nonWild[i] !== first) {
      return null;
    }
  }
  return first;
}

export function evaluateGrid(
  grid: SymbolKey[][],
  bet: number,
  setBonus: number = 0,
): SpinEvaluation {
  const wins: LineWin[] = [];
  for (let i = 0; i < PAYLINES.length; i++) {
    const line = PAYLINES[i];
    const keys = line.cells.map(c => grid[c.col][c.row]);
    const resolved = resolveLineSymbol(keys);
    if (!resolved) {
      continue;
    }
    const def = symbolOf(resolved);
    wins.push({
      lineId: line.id,
      lineName: line.name,
      symbol: resolved,
      amount: Math.round(bet * def.payout * (1 + setBonus)),
      cells: line.cells,
    });
  }
  const total = wins.reduce((a, w) => a + w.amount, 0);
  let best: LineWin | null = null;
  for (let i = 0; i < wins.length; i++) {
    if (!best || wins[i].amount > best.amount) {
      best = wins[i];
    }
  }
  return { wins, total, best, headline: best ? winHeadline(best.symbol) : '' };
}

export function cellKey(cell: Cell): string {
  return cell.col + ':' + cell.row;
}

export function winningCellSet(wins: LineWin[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  wins.forEach(w =>
    w.cells.forEach(c => {
      map[cellKey(c)] = true;
    }),
  );
  return map;
}
