import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {
  Action,
  GameState,
  Settings,
  comfortOf,
  initialState,
  levelOf,
  metricsOf,
  reducer,
  setBonusOf,
} from '../game/state';
import { clearState, loadState, saveState } from '../game/storage';

type Ctx = {
  state: GameState;
  dispatch: (a: Action) => void;
  stateRef: React.MutableRefObject<GameState>;
  hydrate: () => void;
  reset: () => void;
};

const GameContext = createContext<Ctx | null>(null);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, undefined, initialState);
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  // Every mutation is persisted through the storage layer, never from render.
  const dispatch = useCallback((action: Action) => {
    rawDispatch(action);
    if (action.type !== 'HYDRATE') {
      const next = reducer(stateRef.current, action);
      stateRef.current = next;
      saveState(next);
    }
  }, []);

  const hydrate = useCallback(() => {
    const result = loadState();
    stateRef.current = result.state;
    rawDispatch({ type: 'HYDRATE', state: result.state, saveError: result.corrupted });
  }, []);

  const reset = useCallback(() => {
    clearState();
    const fresh = initialState();
    stateRef.current = fresh;
    rawDispatch({ type: 'RESET' });
    saveState(fresh);
  }, []);

  const value = useMemo(
    () => ({ state, dispatch, stateRef, hydrate, reset }),
    [state, dispatch, hydrate, reset],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

function useCtx(): Ctx {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('GameStateProvider is missing above this component');
  }
  return ctx;
}

/* ---------- Narrow selectors: a component subscribes only to what it draws ---------- */

export function useDispatch() {
  return useCtx().dispatch;
}

export function useStateRef() {
  return useCtx().stateRef;
}

export function useHydrate() {
  return useCtx().hydrate;
}

export function useResetProgress() {
  return useCtx().reset;
}

export function useBalance(): number {
  return useCtx().state.balance;
}

export function useLastWin(): number {
  return useCtx().state.lastWin;
}

export function useHeat(): number {
  return useCtx().state.heat;
}

export function useSettings(): Settings {
  return useCtx().state.settings;
}

export function useShards() {
  return useCtx().state.shards;
}

export function useClaimedSets(): string[] {
  return useCtx().state.claimedSets;
}

export function useDecor(): string[] {
  return useCtx().state.decor;
}

export function useComfort(): number {
  return comfortOf(useCtx().state);
}

export function useSetBonus(): number {
  return setBonusOf(useCtx().state);
}

export function useLevel(): number {
  return levelOf(useCtx().state);
}

export function useXp(): number {
  return useCtx().state.xp;
}

export function useMetrics() {
  return metricsOf(useCtx().state);
}

export function useMilestonesClaimed(): string[] {
  return useCtx().state.milestonesClaimed;
}

export function useDaily() {
  const s = useCtx().state;
  return {
    lastDay: s.dailyLastDay,
    streak: s.dailyStreak,
    lastReward: s.dailyLastReward,
  };
}

export function useLifetime() {
  const s = useCtx().state;
  return {
    totalSpins: s.totalSpins,
    bestLineWin: s.bestLineWin,
    sevensLanded: s.sevensLanded,
  };
}

export function useSaveError(): boolean {
  return useCtx().state.saveError;
}
