import { SYMBOLS, SymbolKey, WILD_KEY } from './symbols';
import { HEAT_WILD_MULTIPLIER } from '../constants/config';

/**
 * Deterministic, seedable generator. One seed per attempt so a bug is
 * reproducible: seed = spinIndex * 7919 ^ attempt * 104729.
 */
export function makeSeed(spinIndex: number, attempt: number): number {
  return ((spinIndex * 7919) ^ (attempt * 104729)) >>> 0;
}

export function createRandom(seed: number): () => number {
  let s = (seed || 1) >>> 0;
  return function next(): number {
    // mulberry32
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type DrawBias = {
  /** 5+ losing spins in a row soften the dry streak. */
  pity: boolean;
  /** the spin right after a full Seven Heat meter. */
  heatSpin: boolean;
  /** 2 spins after a big win run on the plain weights. */
  cooldown: boolean;
};

export const PLAIN_BIAS: DrawBias = { pity: false, heatSpin: false, cooldown: true };

export function weightsFor(bias: DrawBias): number[] {
  return SYMBOLS.map(s => {
    if (!s.isWild || bias.cooldown) {
      return s.weight;
    }
    let w = s.weight;
    if (bias.heatSpin) {
      w *= HEAT_WILD_MULTIPLIER;
    }
    if (bias.pity) {
      w *= 1.4;
    }
    return w;
  });
}

export function drawSymbol(rand: () => number, bias: DrawBias): SymbolKey {
  const weights = weightsFor(bias);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rand() * total;
  for (let i = 0; i < SYMBOLS.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      return SYMBOLS[i].key;
    }
  }
  return SYMBOLS[SYMBOLS.length - 1].key;
}

/** grid[col][row] - 3 columns of 3 visible rows, all from the shared pool. */
export function drawGrid(rand: () => number, bias: DrawBias): SymbolKey[][] {
  const grid: SymbolKey[][] = [];
  for (let c = 0; c < 3; c++) {
    const col: SymbolKey[] = [];
    for (let r = 0; r < 3; r++) {
      col.push(drawSymbol(rand, bias));
    }
    grid.push(col);
  }
  return grid;
}

/** Filler symbols that scroll past before a reel lands. */
export function drawStrip(rand: () => number, length: number): SymbolKey[] {
  const out: SymbolKey[] = [];
  for (let i = 0; i < length; i++) {
    out.push(drawSymbol(rand, PLAIN_BIAS));
  }
  return out;
}

export function countWilds(grid: SymbolKey[][]): number {
  let n = 0;
  for (let c = 0; c < grid.length; c++) {
    for (let r = 0; r < grid[c].length; r++) {
      if (grid[c][r] === WILD_KEY) {
        n++;
      }
    }
  }
  return n;
}

/** How many of each symbol landed on the board this spin. */
export function tallyGrid(grid: SymbolKey[][]): Record<string, number> {
  const tally: Record<string, number> = {};
  for (let c = 0; c < grid.length; c++) {
    for (let r = 0; r < grid[c].length; r++) {
      const k = grid[c][r];
      tally[k] = (tally[k] || 0) + 1;
    }
  }
  return tally;
}
