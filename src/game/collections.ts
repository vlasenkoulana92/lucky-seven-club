import { SymbolKey } from './symbols';
import { SET_BONUS_PER_SET, SET_CLAIM_REWARD } from '../constants/config';

export type SetKey = SymbolKey;

export type CollectionSet = {
  key: SetKey;
  title: string;
  accent: string;
  slots: number;
  bonusLabel: string;
  reward: number;
};

/** Four themed sets plus the seven vault - one per symbol in the shared pool. */
export const COLLECTION_SETS: CollectionSet[] = [
  { key: 'cherry', title: 'RUBY ROW', accent: '#C62B47', slots: 4, bonusLabel: 'PAYOUTS +2%', reward: SET_CLAIM_REWARD },
  { key: 'bell', title: 'BELL SUITE', accent: '#D4AF37', slots: 4, bonusLabel: 'PAYOUTS +2%', reward: SET_CLAIM_REWARD },
  { key: 'diamond', title: 'DIAMOND LOUNGE', accent: '#8FB8C9', slots: 4, bonusLabel: 'PAYOUTS +2%', reward: SET_CLAIM_REWARD },
  { key: 'bar', title: 'TRIPLE BAR CLASSIC', accent: '#C08A4A', slots: 4, bonusLabel: 'PAYOUTS +2%', reward: SET_CLAIM_REWARD },
];

export type ShardMap = Record<string, number>;

export function emptyShards(): ShardMap {
  const m: ShardMap = {};
  COLLECTION_SETS.forEach(s => {
    m[s.key] = 0;
  });
  return m;
}

export function setByKey(key: string): CollectionSet | undefined {
  return COLLECTION_SETS.find(s => s.key === key);
}

export function isSetFull(shards: ShardMap, key: string): boolean {
  const set = setByKey(key);
  if (!set) {
    return false;
  }
  return (shards[key] || 0) >= set.slots;
}

/** +2% per claimed set, capped at +8%. */
export function setBonusFor(claimed: string[]): number {
  const unique = claimed.filter((v, i) => claimed.indexOf(v) === i);
  return Math.min(unique.length, COLLECTION_SETS.length) * SET_BONUS_PER_SET;
}

export function totalShards(shards: ShardMap): number {
  return COLLECTION_SETS.reduce((a, s) => a + (shards[s.key] || 0), 0);
}

export function completedSetCount(shards: ShardMap): number {
  return COLLECTION_SETS.filter(s => isSetFull(shards, s.key)).length;
}

/**
 * A spin that lands two or more of one symbol drops a shard of that symbol.
 * Ruby Night doubles cherry shards; Comfort adds a small extra-shard chance.
 */
export function shardDropsFor(
  tally: Record<string, number>,
  opts: { doubleCherry?: boolean; comfortBonus?: number; roll?: number } = {},
): ShardMap {
  const drops: ShardMap = {};
  COLLECTION_SETS.forEach(set => {
    const count = tally[set.key] || 0;
    if (count < 2) {
      return;
    }
    let n = 1;
    if (opts.doubleCherry && set.key === 'cherry') {
      n = 2;
    }
    const chance = Math.min(0.25, (opts.comfortBonus || 0) * 0.01);
    if (chance > 0 && typeof opts.roll === 'number' && opts.roll < chance) {
      n += 1;
    }
    drops[set.key] = n;
  });
  return drops;
}

export function applyShardDrops(shards: ShardMap, drops: ShardMap): ShardMap {
  const next: ShardMap = { ...shards };
  Object.keys(drops).forEach(k => {
    const set = setByKey(k);
    const cap = set ? set.slots : 4;
    next[k] = Math.min(cap, (next[k] || 0) + drops[k]);
  });
  return next;
}
