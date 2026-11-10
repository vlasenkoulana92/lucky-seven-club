import {
  StorageBackend,
  clearState,
  deserializeState,
  loadState,
  migrate,
  saveState,
  serializeState,
  setStorageBackend,
} from '../src/game/storage';
import { STATE_VERSION, initialState, reducer } from '../src/game/state';

class FakeBackend implements StorageBackend {
  payload: string | null = null;
  read() {
    return this.payload;
  }
  write(p: string) {
    this.payload = p;
  }
  clear() {
    this.payload = null;
  }
}

describe('persistence', () => {
  let backend: FakeBackend;

  beforeEach(() => {
    backend = new FakeBackend();
    setStorageBackend(backend);
  });

  it('round-trips the whole snapshot', () => {
    let state = initialState();
    state = reducer(state, { type: 'BUY_DECOR', key: 'booth' });
    state = reducer(state, { type: 'SET_SETTING', key: 'turbo', value: true });
    saveState(state);
    const loaded = loadState();
    expect(loaded.corrupted).toBe(false);
    expect(loaded.state.decor).toEqual(['booth']);
    expect(loaded.state.balance).toBe(state.balance);
    expect(loaded.state.settings.turbo).toBe(true);
  });

  it('reports a fresh profile when nothing is stored', () => {
    const loaded = loadState();
    expect(loaded.fresh).toBe(true);
    expect(loaded.state.balance).toBe(1000);
  });

  it('migrates an older snapshot instead of crashing', () => {
    const old = { version: 1, balance: 420, shards: { bell: 9 }, decor: ['booth', 7] };
    const migrated = migrate(old);
    expect(migrated.version).toBe(STATE_VERSION);
    expect(migrated.balance).toBe(420);
    expect(migrated.shards.bell).toBe(4);
    expect(migrated.decor).toEqual(['booth']);
    expect(migrated.settings.paylineOverlay).toBe(true);
  });

  it('turns a corrupted snapshot into a themed reset, never a throw', () => {
    backend.payload = '{not json at all';
    const loaded = loadState();
    expect(loaded.corrupted).toBe(true);
    expect(loaded.state.balance).toBe(1000);
  });

  it('serializes with the current version and clears on demand', () => {
    const payload = serializeState(initialState());
    expect(JSON.parse(payload).version).toBe(STATE_VERSION);
    saveState(initialState());
    clearState();
    expect(deserializeState(backend.read()).fresh).toBe(true);
  });
});
