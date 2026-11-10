import fs from 'fs';
import path from 'path';
import { LOADER_DURATION_MS } from '../src/constants/config';
import { lockLabel, sessionByKey } from '../src/game/sessions';
import { missingCoins } from '../src/game/lounge';
import { brokeResult, nightResult, sessionResult } from '../src/game/result';
import { deserializeState } from '../src/game/storage';

const SCREENS = path.join(__dirname, '..', 'src', 'screens');

function screen(name: string): string {
  return fs.readFileSync(path.join(SCREENS, name), 'utf8');
}

describe('loading, empty, error and completion states', () => {
  it('holds the loader for exactly 8000 ms with a progress marker and no CTA', () => {
    expect(LOADER_DURATION_MS).toBe(8000);
    const loader = screen('LoaderScreen.tsx');
    expect(loader).toContain('LOADING');
    expect(loader).not.toMatch(/\bPLAY\b|\bSTART\b/);
    expect(loader).not.toContain('<Pressable');
  });

  it('shows a themed empty state wherever a list can be empty', () => {
    ['ChallengeScreen.tsx', 'ProgressScreen.tsx', 'CollectionScreen.tsx'].forEach(file => {
      expect(screen(file)).toContain('<EmptyState');
    });
    expect(screen('CollectionScreen.tsx')).toContain('NOTHING UNLOCKED YET');
    expect(screen('CollectionScreen.tsx')).toContain('THE LOUNGE IS BARE');
    expect(screen('ProgressScreen.tsx')).toContain('NO NIGHTS LOGGED YET');
    expect(screen('ChallengeScreen.tsx')).toContain('THE TABLES ARE RESTING');
  });

  it('explains a locked session and an unaffordable decor instead of a dead button', () => {
    expect(lockLabel(sessionByKey('high')!)).toMatch(/UNLOCKS AT CLUB LEVEL/);
    expect(missingCoins(50, 'booth')).toBe(200);
    expect(screen('CollectionScreen.tsx')).toContain('LoungeSlotCard');
  });

  it('shows a completion state for a spent daily run', () => {
    const daily = screen('DailyModeScreen.tsx');
    expect(daily).toContain("state={played ? 'played' : 'available'}");
    expect(daily).toContain('THE DOOR REOPENS AT MIDNIGHT');
  });

  it('names every round outcome in the club own words', () => {
    expect(brokeResult([]).headline).toBe('OUT OF COINS');
    expect(brokeResult([]).offerRefill).toBe(true);
    expect(nightResult([], true).headline).toBe('NIGHT CLOSED');
    expect(sessionResult(true, [], 'challenge').headline).toBe('SESSION CLEARED');
    expect(sessionResult(false, [], 'daily').headline).toBe('SESSION MISSED');
  });

  it('turns a bad save into a themed card, never a crash', () => {
    const loaded = deserializeState('}{ broken');
    expect(loaded.corrupted).toBe(true);
    expect(screen('MenuScreen.tsx')).toContain('SAVE RESET');
  });
});
