import fs from 'fs';
import path from 'path';
import {
  DISCLAIMER_LOADER,
  DISCLAIMER_LONG,
  DISCLAIMER_SHORT,
} from '../src/components/Disclaimer18';

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function walk(dir: string, out: string[] = []): string[] {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p, out);
    } else if (/\.tsx?$/.test(entry.name)) {
      out.push(p);
    }
  });
  return out;
}

describe('18+ compliance framing', () => {
  it('states the fictional-coin disclaimer in three places', () => {
    expect(DISCLAIMER_SHORT).toContain('NOT REDEEMABLE');
    expect(DISCLAIMER_LONG).toContain('18+');
    expect(DISCLAIMER_LOADER).toContain('NO REAL MONEY');

    ['LoaderScreen.tsx', 'MenuScreen.tsx', 'SettingsScreen.tsx'].forEach(file => {
      const text = fs.readFileSync(path.join(SRC, 'screens', file), 'utf8');
      expect(text).toContain('Disclaimer18');
    });
  });

  it('makes no odds, RTP or payout-percentage claim', () => {
    walk(SRC).forEach(file => {
      const text = fs.readFileSync(file, 'utf8');
      expect(text).not.toMatch(/\bRTP\b/);
      expect(text).not.toMatch(/return to player/i);
      expect(text).not.toMatch(/\bodds\b/i);
      expect(text).not.toMatch(/\bjackpot win chance\b/i);
    });
  });

  it('ships no network, no ads and no store code', () => {
    walk(SRC).forEach(file => {
      const text = fs.readFileSync(file, 'utf8');
      expect(text).not.toMatch(/\bfetch\(|XMLHttpRequest|WebSocket|axios/);
      expect(text).not.toMatch(/Linking\.openURL/);
      expect(text).not.toMatch(/AdMob|admob|react-native-iap|InAppPurchase/);
    });
  });

  it('ships no audio and no audio control', () => {
    walk(SRC).forEach(file => {
      const text = fs.readFileSync(file, 'utf8');
      expect(text).not.toMatch(/\bSound\b|react-native-sound|Audio\./);
    });
  });

  it('never locks the orientation from code', () => {
    walk(SRC).forEach(file => {
      expect(fs.readFileSync(file, 'utf8')).not.toMatch(/Orientation\.lock|lockToPortrait/);
    });
  });
});
