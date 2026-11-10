import { DEFAULT_SETTINGS, GameState, STATE_VERSION, initialState } from './state';
import { emptyShards } from './collections';

/**
 * Storage-agnostic persistence layer.
 *
 * The dependency allowlist carries no storage native module, so the default
 * backend is a module-level singleton written on every mutation and re-read by
 * the loader. serialize / deserialize / migrate are pure, so a durable backend
 * can be dropped in later without touching a line of game logic.
 */
export interface StorageBackend {
  read(): string | null;
  write(payload: string): void;
  clear(): void;
}

export const SAVE_KEY = 'luckysevenclub.save.v2';

class MemoryBackend implements StorageBackend {
  private payload: string | null = null;

  read(): string | null {
    return this.payload;
  }

  write(payload: string): void {
    this.payload = payload;
  }

  clear(): void {
    this.payload = null;
  }
}

let backend: StorageBackend = new MemoryBackend();

export function setStorageBackend(next: StorageBackend): void {
  backend = next;
}

export function serializeState(state: GameState): string {
  return JSON.stringify({ ...state, version: STATE_VERSION });
}

function asNumber(v: any, fallback: number): number {
  return typeof v === 'number' && isFinite(v) ? v : fallback;
}

function asStringArray(v: any): string[] {
  return Array.isArray(v) ? v.filter(x => typeof x === 'string') : [];
}

/** Older snapshots are upgraded field by field; nothing throws. */
export function migrate(raw: any): GameState {
  const base = initialState();
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  const shards = { ...emptyShards() };
  if (raw.shards && typeof raw.shards === 'object') {
    Object.keys(shards).forEach(k => {
      shards[k] = Math.max(0, Math.min(4, asNumber(raw.shards[k], 0)));
    });
  }
  return {
    version: STATE_VERSION,
    balance: Math.max(0, asNumber(raw.balance, base.balance)),
    lastWin: Math.max(0, asNumber(raw.lastWin, 0)),
    bestLineWin: Math.max(0, asNumber(raw.bestLineWin, 0)),
    totalSpins: Math.max(0, asNumber(raw.totalSpins, 0)),
    sevensLanded: Math.max(0, asNumber(raw.sevensLanded, 0)),
    heat: Math.max(0, Math.min(5, asNumber(raw.heat, 0))),
    xp: Math.max(0, asNumber(raw.xp, 0)),
    shards,
    claimedSets: asStringArray(raw.claimedSets),
    decor: asStringArray(raw.decor),
    milestonesClaimed: asStringArray(raw.milestonesClaimed),
    lossStreak: Math.max(0, asNumber(raw.lossStreak, 0)),
    bigWinCooldown: Math.max(0, asNumber(raw.bigWinCooldown, 0)),
    dailyLastDay: typeof raw.dailyLastDay === 'string' ? raw.dailyLastDay : null,
    dailyStreak: Math.max(0, asNumber(raw.dailyStreak, 0)),
    dailyLastReward: Math.max(0, asNumber(raw.dailyLastReward, 0)),
    settings: {
      ...DEFAULT_SETTINGS,
      ...(raw.settings && typeof raw.settings === 'object' ? raw.settings : {}),
    },
    saveError: false,
  };
}

export type LoadResult = { state: GameState; corrupted: boolean; fresh: boolean };

export function deserializeState(payload: string | null): LoadResult {
  if (!payload) {
    return { state: initialState(), corrupted: false, fresh: true };
  }
  try {
    return { state: migrate(JSON.parse(payload)), corrupted: false, fresh: false };
  } catch (e) {
    return { state: initialState(), corrupted: true, fresh: false };
  }
}

export function saveState(state: GameState): void {
  try {
    backend.write(serializeState(state));
  } catch (e) {
    // persistence must never take the app down
  }
}

export function loadState(): LoadResult {
  try {
    return deserializeState(backend.read());
  } catch (e) {
    return { state: initialState(), corrupted: true, fresh: false };
  }
}

export function clearState(): void {
  try {
    backend.clear();
  } catch (e) {
    // ignore
  }
}
