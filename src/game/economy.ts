import { BET, REFILL_AMOUNT } from '../constants/config';

/**
 * Every coin movement names its gameplay reason. Coins are fictional: there is
 * no purchase, no redemption and no transfer source in this list, and a credit
 * with no gameplay reason is rejected.
 */
export type CreditReason =
  | 'lineWin'
  | 'sessionReward'
  | 'milestoneClaim'
  | 'setClaim'
  | 'dailyReward'
  | 'refill';

export type DebitReason = 'bet' | 'decor';

export const CREDIT_REASONS: CreditReason[] = [
  'lineWin',
  'sessionReward',
  'milestoneClaim',
  'setClaim',
  'dailyReward',
  'refill',
];

export const DEBIT_REASONS: DebitReason[] = ['bet', 'decor'];

export function isValidCredit(reason: string): reason is CreditReason {
  return CREDIT_REASONS.indexOf(reason as CreditReason) >= 0;
}

export function isValidDebit(reason: string): reason is DebitReason {
  return DEBIT_REASONS.indexOf(reason as DebitReason) >= 0;
}

export function credit(balance: number, amount: number, reason: string): number {
  if (!isValidCredit(reason) || !(amount > 0)) {
    return balance;
  }
  return balance + Math.round(amount);
}

export function debit(balance: number, amount: number, reason: string): number {
  if (!isValidDebit(reason) || !(amount > 0)) {
    return balance;
  }
  return Math.max(0, balance - Math.round(amount));
}

export function canSpin(balance: number, bet: number = BET): boolean {
  return balance >= bet;
}

export function isBroke(balance: number, bet: number = BET): boolean {
  return balance < bet;
}

export function refill(balance: number): number {
  return credit(balance, REFILL_AMOUNT, 'refill');
}

/** win = bet x symbol payout, then the collection set bonus. */
export function payout(bet: number, multiplier: number, setBonus: number): number {
  return Math.round(bet * multiplier * (1 + setBonus));
}
