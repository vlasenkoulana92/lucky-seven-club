import { sprite1, sprite2, sprite3, sprite4, sprite5 } from '../assets';

export type SymbolKey = 'seven' | 'diamond' | 'bell' | 'bar' | 'cherry';

export type SymbolDef = {
  key: SymbolKey;
  name: string;
  art: any;
  weight: number;
  payout: number; // multiplier of the bet for 3-of-a-kind
  isWild?: boolean;
  accent: string;
  setName: string;
};

/**
 * THE one shared symbol pool. Every reel cell on every screen draws from this
 * array - there is no second pool and no per-reel strip definition.
 */
export const SYMBOLS: SymbolDef[] = [
  {
    key: 'seven',
    name: 'LUCKY SEVEN',
    art: sprite1,
    weight: 3,
    payout: 50,
    isWild: true,
    accent: '#F5D77A',
    setName: 'SEVEN VAULT',
  },
  {
    key: 'diamond',
    name: 'DIAMOND CHIP',
    art: sprite2,
    weight: 19,
    payout: 20,
    accent: '#8FB8C9',
    setName: 'DIAMOND LOUNGE',
  },
  {
    key: 'bell',
    name: 'GOLDEN BELL',
    art: sprite3,
    weight: 22,
    payout: 12,
    accent: '#D4AF37',
    setName: 'BELL SUITE',
  },
  {
    key: 'bar',
    name: 'TRIPLE BAR',
    art: sprite4,
    weight: 27,
    payout: 8,
    accent: '#C08A4A',
    setName: 'TRIPLE BAR CLASSIC',
  },
  {
    key: 'cherry',
    name: 'RUBY CHERRY',
    art: sprite5,
    weight: 29,
    payout: 5,
    accent: '#C62B47',
    setName: 'RUBY ROW',
  },
];

export const SYMBOL_BY_KEY: Record<SymbolKey, SymbolDef> = SYMBOLS.reduce((acc, s) => {
  acc[s.key] = s;
  return acc;
}, {} as Record<SymbolKey, SymbolDef>);

export const WILD_KEY: SymbolKey = 'seven';

export function symbolOf(key: SymbolKey): SymbolDef {
  return SYMBOL_BY_KEY[key] || SYMBOLS[SYMBOLS.length - 1];
}

/** Headline wording for a win, in the club's own words. */
export function winHeadline(key: SymbolKey): string {
  switch (key) {
    case 'seven':
      return 'SEVENS ALIGNED';
    case 'diamond':
      return 'DIAMOND RUN';
    case 'bell':
      return 'BELL RUN';
    case 'bar':
      return 'BAR LINE';
    default:
      return 'RUBY ROW';
  }
}
