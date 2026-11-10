import { BET, HEAT_MAX, START_BALANCE } from '../constants/config';
import { applyShardDrops, emptyShards, isSetFull, setBonusFor, ShardMap, completedSetCount } from './collections';
import { comfortFor, decorByKey } from './lounge';
import { credit, debit } from './economy';
import { MILESTONES, levelForXp, xpForSpin } from './progression';
import { SymbolKey } from './symbols';
import { LineWin } from './paylines';

export const STATE_VERSION = 2;

export type Settings = {
  turbo: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  paylineOverlay: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  turbo: false,
  reduceMotion: false,
  highContrast: false,
  paylineOverlay: true,
};

export type GameState = {
  version: number;
  balance: number;
  lastWin: number;
  bestLineWin: number;
  totalSpins: number;
  sevensLanded: number;
  heat: number;
  xp: number;
  shards: ShardMap;
  claimedSets: string[];
  decor: string[];
  milestonesClaimed: string[];
  lossStreak: number;
  bigWinCooldown: number;
  dailyLastDay: string | null;
  dailyStreak: number;
  dailyLastReward: number;
  settings: Settings;
  saveError: boolean;
};

export function initialState(): GameState {
  return {
    version: STATE_VERSION,
    balance: START_BALANCE,
    lastWin: 0,
    bestLineWin: 0,
    totalSpins: 0,
    sevensLanded: 0,
    heat: 0,
    xp: 0,
    shards: emptyShards(),
    claimedSets: [],
    decor: [],
    milestonesClaimed: [],
    lossStreak: 0,
    bigWinCooldown: 0,
    dailyLastDay: null,
    dailyStreak: 0,
    dailyLastReward: 0,
    settings: { ...DEFAULT_SETTINGS },
    saveError: false,
  };
}

export type SpinOutcome = {
  grid: SymbolKey[][];
  wins: LineWin[];
  total: number;
  sevens: number;
  shardDrops: ShardMap;
  heatSpin: boolean;
  bet: number;
};

export type Action =
  | { type: 'HYDRATE'; state: GameState; saveError?: boolean }
  | { type: 'PLACE_BET'; bet: number }
  | { type: 'SPIN_RESULT'; outcome: SpinOutcome }
  | { type: 'REFILL' }
  | { type: 'CLAIM_SET'; key: string }
  | { type: 'BUY_DECOR'; key: string }
  | { type: 'CLAIM_MILESTONE'; key: string }
  | { type: 'SESSION_REWARD'; coins: number; shardKey: string; shards: number }
  | { type: 'DAILY_FINISHED'; day: string; streak: number; reward: number }
  | { type: 'SET_SETTING'; key: keyof Settings; value: boolean }
  | { type: 'RESET' };

export function setBonusOf(state: GameState): number {
  return setBonusFor(state.claimedSets);
}

export function comfortOf(state: GameState): number {
  return comfortFor(state.decor);
}

export function levelOf(state: GameState): number {
  return levelForXp(state.xp);
}

export function metricsOf(state: GameState) {
  return {
    totalSpins: state.totalSpins,
    sevensLanded: state.sevensLanded,
    setsCompleted: completedSetCount(state.shards),
    decorOwned: state.decor.length,
  };
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...action.state, saveError: !!action.saveError };

    case 'PLACE_BET':
      return { ...state, balance: debit(state.balance, action.bet, 'bet'), lastWin: 0 };

    case 'SPIN_RESULT': {
      const o = action.outcome;
      const won = o.total > 0;
      const bestLine = o.wins.reduce((m, w) => Math.max(m, w.amount), 0);
      const heat = o.heatSpin ? 0 : Math.min(HEAT_MAX, state.heat + o.sevens);
      return {
        ...state,
        balance: won ? credit(state.balance, o.total, 'lineWin') : state.balance,
        lastWin: o.total,
        bestLineWin: Math.max(state.bestLineWin, bestLine),
        totalSpins: state.totalSpins + 1,
        sevensLanded: state.sevensLanded + o.sevens,
        heat,
        xp: state.xp + xpForSpin(won),
        shards: applyShardDrops(state.shards, o.shardDrops),
        lossStreak: won ? 0 : state.lossStreak + 1,
        bigWinCooldown: bestLine >= o.bet * 20 ? 2 : Math.max(0, state.bigWinCooldown - 1),
      };
    }

    case 'REFILL':
      return { ...state, balance: credit(state.balance, 500, 'refill') };

    case 'CLAIM_SET': {
      if (!isSetFull(state.shards, action.key) || state.claimedSets.indexOf(action.key) >= 0) {
        return state;
      }
      return {
        ...state,
        balance: credit(state.balance, 300, 'setClaim'),
        claimedSets: state.claimedSets.concat([action.key]),
      };
    }

    case 'BUY_DECOR': {
      const d = decorByKey(action.key);
      if (!d || state.decor.indexOf(action.key) >= 0 || state.balance < d.price) {
        return state;
      }
      return {
        ...state,
        balance: debit(state.balance, d.price, 'decor'),
        decor: state.decor.concat([action.key]),
      };
    }

    case 'CLAIM_MILESTONE': {
      const m = MILESTONES.find(x => x.key === action.key);
      if (!m || state.milestonesClaimed.indexOf(action.key) >= 0) {
        return state;
      }
      const metrics = metricsOf(state);
      if ((metrics as any)[m.metric] < m.target) {
        return state;
      }
      return {
        ...state,
        balance: credit(state.balance, m.reward, 'milestoneClaim'),
        milestonesClaimed: state.milestonesClaimed.concat([action.key]),
      };
    }

    case 'SESSION_REWARD': {
      const drops: ShardMap = {};
      if (action.shards > 0) {
        drops[action.shardKey] = action.shards;
      }
      return {
        ...state,
        balance: credit(state.balance, action.coins, 'sessionReward'),
        shards: applyShardDrops(state.shards, drops),
      };
    }

    case 'DAILY_FINISHED':
      return {
        ...state,
        balance: credit(state.balance, action.reward, 'dailyReward'),
        dailyLastDay: action.day,
        dailyStreak: action.streak,
        dailyLastReward: action.reward,
      };

    case 'SET_SETTING':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } };

    case 'RESET':
      return initialState();

    default:
      return state;
  }
}

export const DEFAULT_BET = BET;
