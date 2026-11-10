import { XP_PER_LEVEL, XP_PER_SPIN, XP_PER_WIN } from '../constants/config';

export type Milestone = {
  key: string;
  title: string;
  target: number;
  reward: number;
  metric: 'totalSpins' | 'sevensLanded' | 'setsCompleted' | 'decorOwned';
};

export const MILESTONES: Milestone[] = [
  { key: 'spins100', title: '100 SPINS', target: 100, reward: 200, metric: 'totalSpins' },
  { key: 'spins500', title: '500 SPINS', target: 500, reward: 750, metric: 'totalSpins' },
  { key: 'sevens10', title: '10 SEVENS', target: 10, reward: 300, metric: 'sevensLanded' },
  { key: 'firstSet', title: 'FIRST SET', target: 1, reward: 250, metric: 'setsCompleted' },
  { key: 'furnished', title: 'LOUNGE FURNISHED', target: 6, reward: 1200, metric: 'decorOwned' },
];

export function xpForSpin(won: boolean): number {
  return XP_PER_SPIN + (won ? XP_PER_WIN : 0);
}

export function levelForXp(xp: number): number {
  return 1 + Math.floor(Math.max(0, xp) / XP_PER_LEVEL);
}

export function xpInLevel(xp: number): number {
  return Math.max(0, xp) % XP_PER_LEVEL;
}

export function xpToNext(): number {
  return XP_PER_LEVEL;
}

export function levelProgress(xp: number): number {
  return xpInLevel(xp) / XP_PER_LEVEL;
}

/** Named in words, never a bare number. */
export function nextUnlockLabel(level: number): string {
  if (level < 2) {
    return 'NEXT: HIGH TABLE SESSION';
  }
  if (level < 3) {
    return 'NEXT: SEVEN RUN SESSION';
  }
  if (level < 5) {
    return 'NEXT: HOUSE RESPECT - RICHER DAILY RUNS';
  }
  return 'ALL TABLES OPEN - KEEP THE STREAK ALIVE';
}

export type MilestoneMetrics = {
  totalSpins: number;
  sevensLanded: number;
  setsCompleted: number;
  decorOwned: number;
};

export function milestoneProgress(m: Milestone, metrics: MilestoneMetrics): number {
  return metrics[m.metric] || 0;
}

export function isMilestoneComplete(m: Milestone, metrics: MilestoneMetrics): boolean {
  return milestoneProgress(m, metrics) >= m.target;
}

export function claimableMilestones(metrics: MilestoneMetrics, claimed: string[]): Milestone[] {
  return MILESTONES.filter(m => isMilestoneComplete(m, metrics) && claimed.indexOf(m.key) < 0);
}
