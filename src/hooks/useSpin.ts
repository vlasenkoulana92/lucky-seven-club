import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import {
  BET,
  CELL,
  HEAT_MAX,
  RESOLVE_PAUSE_MS,
  STRIP_FILL,
  WIN_BANNER_HOLD_MS,
  reelStops,
} from '../constants/config';
import { createRandom, drawGrid, drawStrip, makeSeed, tallyGrid, DrawBias } from '../game/rng';
import { LineWin, evaluateGrid, winningCellSet } from '../game/paylines';
import { SymbolKey, WILD_KEY } from '../game/symbols';
import { shardDropsFor } from '../game/collections';
import { ModifierKey } from '../game/daily';
import { useComfort, useDispatch, useSetBonus, useSettings, useStateRef } from './useGameState';

export type SpinStatus = 'idle' | 'spinning' | 'resolving' | 'win';

export type SpinSummary = {
  total: number;
  sevens: number;
  wins: LineWin[];
  balanceAfter: number;
};

export type UseSpinOptions = {
  bet?: number;
  /** cell height of the board this hook drives - the reel travel follows it */
  cell?: number;
  modifier?: ModifierKey | null;
  onSettled?: (summary: SpinSummary) => void;
};

const COLUMN_LEN = 3 + STRIP_FILL;

function initialColumns(rand: () => number): SymbolKey[][] {
  const bias: DrawBias = { pity: false, heatSpin: false, cooldown: true };
  const grid = drawGrid(rand, bias);
  return grid.map(col => col.concat(drawStrip(rand, STRIP_FILL)));
}

export function useSpin(options: UseSpinOptions = {}) {
  const bet = options.bet || BET;
  const modifier = options.modifier || null;
  const cell = options.cell || CELL;
  const travel = STRIP_FILL * cell;

  const dispatch = useDispatch();
  const stateRef = useStateRef();
  const settings = useSettings();
  const setBonus = useSetBonus();
  const comfort = useComfort();

  const bootRand = useMemo(() => createRandom(makeSeed(0, 1)), []);
  const [columns, setColumns] = useState<SymbolKey[][]>(() => initialColumns(bootRand));
  const [status, setStatus] = useState<SpinStatus>('idle');
  const [wins, setWins] = useState<LineWin[]>([]);
  const [banner, setBanner] = useState<{ title: string; amount: number } | null>(null);
  const [heatSpinActive, setHeatSpinActive] = useState(false);

  const statusRef = useRef<SpinStatus>('idle');
  const attemptRef = useRef(1);
  const mountedRef = useRef(true);
  const timersRef = useRef<any[]>([]);
  const offsets = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const setBonusRef = useRef(setBonus);
  setBonusRef.current = setBonus;
  const comfortRef = useRef(comfort);
  comfortRef.current = comfort;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current = [];
      offsets.forEach(v => v.stopAnimation());
    };
  }, [offsets]);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      if (mountedRef.current) {
        fn();
      }
    }, ms);
    timersRef.current.push(t);
    return t;
  }, []);

  const settle = useCallback(
    (grid: SymbolKey[][], heatSpin: boolean) => {
      const s = stateRef.current;
      const evaluation = evaluateGrid(grid, bet, setBonusRef.current);
      let lineWins = evaluation.wins;
      if (modifier === 'bellfever') {
        lineWins = lineWins.map(w =>
          w.symbol === 'bell' ? { ...w, amount: w.amount * 2 } : w,
        );
      }
      const total = lineWins.reduce((a, w) => a + w.amount, 0);
      const tally = tallyGrid(grid);
      const sevens = tally[WILD_KEY] || 0;
      const shardDrops = shardDropsFor(tally, {
        doubleCherry: modifier === 'rubynight',
        comfortBonus: comfortRef.current,
        roll: Math.random(),
      });

      dispatch({
        type: 'SPIN_RESULT',
        outcome: { grid, wins: lineWins, total, sevens, shardDrops, heatSpin, bet },
      });

      setWins(lineWins);
      if (total > 0) {
        const best = lineWins.reduce((m, w) => (w.amount > m.amount ? w : m), lineWins[0]);
        setBanner({ title: evaluation.headline || best.lineName, amount: total });
        setStatus('win');
        statusRef.current = 'win';
        later(() => {
          setBanner(null);
          setStatus('idle');
          statusRef.current = 'idle';
        }, WIN_BANNER_HOLD_MS + 360);
      } else {
        setStatus('idle');
        statusRef.current = 'idle';
      }

      if (options.onSettled) {
        // the bet was already debited when the spin started
        options.onSettled({
          total,
          sevens,
          wins: lineWins,
          balanceAfter: s.balance + total,
        });
      }
    },
    [bet, dispatch, later, modifier, options, stateRef],
  );

  const spin = useCallback(() => {
    if (statusRef.current !== 'idle') {
      return false;
    }
    const s = stateRef.current;
    if (s.balance < bet) {
      return false;
    }

    const reduceMotion = settingsRef.current.reduceMotion;
    const stops = reelStops(settingsRef.current.turbo);
    const stagger = reduceMotion ? 120 : 0;
    const resolvedStops = reduceMotion
      ? [stops[0], stops[0] + stagger, stops[0] + stagger * 2]
      : stops;

    const heatSpin = s.heat >= HEAT_MAX;
    const bias: DrawBias = {
      pity: s.lossStreak >= 5,
      heatSpin: heatSpin || modifier === 'sevenstorm',
      cooldown: s.bigWinCooldown > 0,
    };

    attemptRef.current += 1;
    const rand = createRandom(makeSeed(s.totalSpins + 1, attemptRef.current));
    const grid = drawGrid(rand, bias);
    const nextColumns = grid.map(col => col.concat(drawStrip(rand, STRIP_FILL)));

    dispatch({ type: 'PLACE_BET', bet });
    setWins([]);
    setBanner(null);
    setColumns(nextColumns);
    setHeatSpinActive(heatSpin);
    setStatus('spinning');
    statusRef.current = 'spinning';

    offsets.forEach(v => v.setValue(-travel));

    offsets.forEach((value, index) => {
      Animated.sequence([
        Animated.timing(value, {
          toValue: 6,
          duration: resolvedStops[index],
          easing: Easing.bezier(0.05, 0.7, 0.15, 1),
          useNativeDriver: true,
        }),
        Animated.spring(value, {
          toValue: 0,
          tension: 220,
          friction: 14,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (index === offsets.length - 1 && mountedRef.current) {
          setStatus('resolving');
          statusRef.current = 'resolving';
          later(() => settle(grid, heatSpin), RESOLVE_PAUSE_MS);
        }
      });
    });

    return true;
  }, [bet, dispatch, later, modifier, offsets, settle, stateRef, travel]);

  const winningCells = useMemo(() => winningCellSet(wins), [wins]);

  return {
    columns,
    offsets,
    status,
    spinning: status === 'spinning' || status === 'resolving',
    wins,
    winningCells,
    banner,
    heatSpinActive,
    spin,
    columnLength: COLUMN_LEN,
  };
}

export default useSpin;
