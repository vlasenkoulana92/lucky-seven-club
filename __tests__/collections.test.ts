import {
  COLLECTION_SETS,
  applyShardDrops,
  completedSetCount,
  emptyShards,
  isSetFull,
  shardDropsFor,
  totalShards,
} from '../src/game/collections';
import { initialState, reducer } from '../src/game/state';

describe('collections', () => {
  it('defines four themed sets of four shards with unique accents', () => {
    expect(COLLECTION_SETS).toHaveLength(4);
    expect(new Set(COLLECTION_SETS.map(s => s.accent)).size).toBe(4);
    COLLECTION_SETS.forEach(s => expect(s.slots).toBe(4));
  });

  it('drops a shard only when two or more of a symbol land', () => {
    expect(shardDropsFor({ bell: 1, bar: 3 })).toEqual({ bar: 1 });
    expect(shardDropsFor({ bell: 2, cherry: 2 })).toEqual({ bell: 1, cherry: 1 });
    expect(shardDropsFor({})).toEqual({});
  });

  it('doubles cherry shards on a ruby night', () => {
    expect(shardDropsFor({ cherry: 2 }, { doubleCherry: true })).toEqual({ cherry: 2 });
  });

  it('never fills a set past its slot count', () => {
    let shards = emptyShards();
    for (let i = 0; i < 10; i++) {
      shards = applyShardDrops(shards, { bell: 1 });
    }
    expect(shards.bell).toBe(4);
    expect(isSetFull(shards, 'bell')).toBe(true);
    expect(completedSetCount(shards)).toBe(1);
    expect(totalShards(shards)).toBe(4);
  });

  it('claims a full set once, pays 300 coins and never twice', () => {
    let state = initialState();
    state = { ...state, shards: applyShardDrops(state.shards, { bell: 4 }) };
    const before = state.balance;
    const claimed = reducer(state, { type: 'CLAIM_SET', key: 'bell' });
    expect(claimed.balance).toBe(before + 300);
    expect(claimed.claimedSets).toEqual(['bell']);
    const again = reducer(claimed, { type: 'CLAIM_SET', key: 'bell' });
    expect(again.balance).toBe(claimed.balance);
  });

  it('refuses to claim an unfinished set', () => {
    const state = initialState();
    const out = reducer(state, { type: 'CLAIM_SET', key: 'bell' });
    expect(out.balance).toBe(state.balance);
    expect(out.claimedSets).toHaveLength(0);
  });
});
