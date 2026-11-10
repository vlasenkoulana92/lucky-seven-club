export type SessionKey = 'warm' | 'high' | 'sevenrun';

export type SessionGoal =
  | { kind: 'coins'; amount: number }
  | { kind: 'sevens'; amount: number };

export type SessionDef = {
  key: SessionKey;
  title: string;
  spins: number;
  goal: SessionGoal;
  reward: number;
  shardReward: number;
  requiredLevel: number;
  blurb: string;
};

export const SESSIONS: SessionDef[] = [
  {
    key: 'warm',
    title: 'WARM TABLE',
    spins: 10,
    goal: { kind: 'coins', amount: 150 },
    reward: 120,
    shardReward: 1,
    requiredLevel: 1,
    blurb: 'A gentle opener on the house felt',
  },
  {
    key: 'high',
    title: 'HIGH TABLE',
    spins: 15,
    goal: { kind: 'coins', amount: 400 },
    reward: 350,
    shardReward: 2,
    requiredLevel: 2,
    blurb: 'Deeper pockets, steeper target',
  },
  {
    key: 'sevenrun',
    title: 'SEVEN RUN',
    spins: 12,
    goal: { kind: 'sevens', amount: 3 },
    reward: 500,
    shardReward: 1,
    requiredLevel: 3,
    blurb: 'Land three sevens before the clock',
  },
];

export function sessionByKey(key: string): SessionDef | undefined {
  return SESSIONS.find(s => s.key === key);
}

export function isSessionLocked(def: SessionDef, level: number): boolean {
  return level < def.requiredLevel;
}

export function lockLabel(def: SessionDef): string {
  return 'UNLOCKS AT CLUB LEVEL ' + def.requiredLevel;
}

export function goalLabel(goal: SessionGoal): string {
  if (goal.kind === 'coins') {
    return 'GOAL  WIN ' + goal.amount + ' COINS';
  }
  return 'GOAL  LAND ' + goal.amount + ' SEVENS';
}

export type SessionRun = {
  key: SessionKey;
  spinsLeft: number;
  spinsTotal: number;
  coinsWon: number;
  sevens: number;
};

export function startSession(def: SessionDef): SessionRun {
  return {
    key: def.key,
    spinsLeft: def.spins,
    spinsTotal: def.spins,
    coinsWon: 0,
    sevens: 0,
  };
}

export function goalProgress(run: SessionRun, def: SessionDef): number {
  if (def.goal.kind === 'coins') {
    return Math.min(1, run.coinsWon / def.goal.amount);
  }
  return Math.min(1, run.sevens / def.goal.amount);
}

export function isGoalMet(run: SessionRun, def: SessionDef): boolean {
  return goalProgress(run, def) >= 1;
}

export function isSessionOver(run: SessionRun, def: SessionDef): boolean {
  return run.spinsLeft <= 0 || isGoalMet(run, def);
}
