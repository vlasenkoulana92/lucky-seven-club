export type DecorKey =
  | 'booth'
  | 'lamp'
  | 'sign'
  | 'table'
  | 'bar'
  | 'chandelier';

export type Decor = {
  key: DecorKey;
  title: string;
  price: number;
  comfort: number;
  accent: string;
  note: string;
};

/** The coin sink. Every piece raises Comfort, which feeds the next night. */
export const LOUNGE_DECOR: Decor[] = [
  { key: 'booth', title: 'VELVET BOOTH', price: 250, comfort: 2, accent: '#C62B47', note: 'A quiet corner for the regulars' },
  { key: 'lamp', title: 'BRASS LAMP', price: 400, comfort: 3, accent: '#D4AF37', note: 'Low warm light over the felt' },
  { key: 'sign', title: 'NEON 777 SIGN', price: 600, comfort: 4, accent: '#F5D77A', note: 'The house mark above the door' },
  { key: 'table', title: 'CARD TABLE', price: 900, comfort: 5, accent: '#8FB8C9', note: 'Green felt, brass corners' },
  { key: 'bar', title: 'MARBLE BAR', price: 1400, comfort: 7, accent: '#C08A4A', note: 'Cold stone, warm service' },
  { key: 'chandelier', title: 'CHANDELIER', price: 2000, comfort: 9, accent: '#FFE4A0', note: 'The centrepiece of the room' },
];

export function decorByKey(key: string): Decor | undefined {
  return LOUNGE_DECOR.find(d => d.key === key);
}

export function comfortFor(owned: string[]): number {
  const unique = owned.filter((v, i) => owned.indexOf(v) === i);
  return unique.reduce((total, key) => {
    const d = decorByKey(key);
    return total + (d ? d.comfort : 0);
  }, 0);
}

export function canAfford(balance: number, key: string): boolean {
  const d = decorByKey(key);
  return !!d && balance >= d.price;
}

export function missingCoins(balance: number, key: string): number {
  const d = decorByKey(key);
  if (!d) {
    return 0;
  }
  return Math.max(0, d.price - balance);
}

export function isOwned(owned: string[], key: string): boolean {
  return owned.indexOf(key) >= 0;
}

/** Comfort raises the daily bankroll and the extra-shard chance. */
export function dailyBankrollFor(comfort: number, base: number, perPoint: number): number {
  return base + comfort * perPoint;
}
