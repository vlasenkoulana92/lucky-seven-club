import fs from 'fs';
import path from 'path';
import { DEFAULT_SETTINGS, initialState, reducer } from '../src/game/state';
import { motionMs, reelStops, spinDurationMs } from '../src/constants/config';
import { serializeState, deserializeState } from '../src/game/storage';

describe('settings', () => {
  it('ships four options and no audio control', () => {
    expect(Object.keys(DEFAULT_SETTINGS).sort()).toEqual([
      'highContrast',
      'paylineOverlay',
      'reduceMotion',
      'turbo',
    ]);
    const screen = fs.readFileSync(
      path.join(__dirname, '..', 'src', 'screens', 'SettingsScreen.tsx'),
      'utf8',
    );
    expect(screen).not.toMatch(/(volume|music|sound|mute|audio)/i);
  });

  it('reel speed changes the spin duration and the stop stagger', () => {
    expect(spinDurationMs(false)).toBe(2400);
    expect(spinDurationMs(true)).toBe(1200);
    expect(reelStops(false)).toEqual([1400, 1660, 1920]);
    expect(reelStops(true)).toEqual([700, 860, 1020]);
  });

  it('reduce motion shortens every transition', () => {
    expect(motionMs(260, false)).toBe(260);
    expect(motionMs(260, true)).toBe(150);
  });

  it('writes each option into the state', () => {
    let state = initialState();
    state = reducer(state, { type: 'SET_SETTING', key: 'turbo', value: true });
    state = reducer(state, { type: 'SET_SETTING', key: 'highContrast', value: true });
    expect(state.settings.turbo).toBe(true);
    expect(state.settings.highContrast).toBe(true);
    expect(state.settings.paylineOverlay).toBe(true);
  });

  it('persists the options across a serialize round trip', () => {
    let state = initialState();
    state = reducer(state, { type: 'SET_SETTING', key: 'reduceMotion', value: true });
    const restored = deserializeState(serializeState(state)).state;
    expect(restored.settings.reduceMotion).toBe(true);
  });

  it('reset restores the starting balance and clears progress', () => {
    let state = initialState();
    state = reducer(state, { type: 'BUY_DECOR', key: 'booth' });
    const out = reducer(state, { type: 'RESET' });
    expect(out.balance).toBe(1000);
    expect(out.decor).toHaveLength(0);
  });
});
