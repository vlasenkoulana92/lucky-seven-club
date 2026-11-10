import fs from 'fs';
import path from 'path';
import {
  CREDIT_REASONS,
  DEBIT_REASONS,
  canSpin,
  credit,
  debit,
  isBroke,
  isValidCredit,
  payout,
  refill,
} from '../src/game/economy';
import { BET, START_BALANCE } from '../src/constants/config';

const SRC = path.join(__dirname, '..', 'src');

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

describe('economy', () => {
  it('starts a fresh profile on 1000 fictional coins with a fixed 10 bet', () => {
    expect(START_BALANCE).toBe(1000);
    expect(BET).toBe(10);
  });

  it('only credits coins for a gameplay reason', () => {
    expect(CREDIT_REASONS).toEqual([
      'lineWin',
      'sessionReward',
      'milestoneClaim',
      'setClaim',
      'dailyReward',
      'refill',
    ]);
    expect(isValidCredit('purchase')).toBe(false);
    expect(credit(100, 50, 'purchase')).toBe(100);
    expect(credit(100, 50, 'lineWin')).toBe(150);
  });

  it('only debits coins for the bet or for decor', () => {
    expect(DEBIT_REASONS).toEqual(['bet', 'decor']);
    expect(debit(100, 10, 'bet')).toBe(90);
    expect(debit(100, 10, 'withdrawal')).toBe(100);
    expect(debit(5, 10, 'bet')).toBe(0);
  });

  it('computes win as bet x payout x set bonus', () => {
    expect(payout(10, 12, 0)).toBe(120);
    expect(payout(10, 12, 0.04)).toBe(125);
  });

  it('treats a balance under the bet as broke and always offers a refill', () => {
    expect(canSpin(10)).toBe(true);
    expect(canSpin(9)).toBe(false);
    expect(isBroke(9)).toBe(true);
    expect(refill(0)).toBe(500);
  });

  it('exposes no purchase, deposit or redemption surface anywhere in src', () => {
    const forbidden = /\b(in-?app purchase|iap|paywall|deposit|withdraw|real money|cash prize|rtp)\b/i;
    walk(SRC).forEach(file => {
      const text = fs.readFileSync(file, 'utf8');
      // the compliance copy is allowed to say NO REAL MONEY / NOT REDEEMABLE
      const stripped = text
        .replace(/NO REAL MONEY/g, '')
        .replace(/withdrawals?/gi, '')
        .replace(/deposits?/gi, '');
      expect(stripped).not.toMatch(forbidden);
    });
  });
});
