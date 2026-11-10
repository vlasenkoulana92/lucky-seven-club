import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppHeader from '../components/AppHeader';
import ScreenBackground from '../components/ScreenBackground';
import DailyModifierCard from '../components/DailyModifierCard';
import SlotBoard from '../components/SlotBoard';
import WinBanner from '../components/WinBanner';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import CoinBadge from '../components/CoinBadge';
import { Calendar } from 'lucide-react-native';
import { BET, CELL_COMPACT, DAILY_MAX_SPINS, SPRING_BUTTON } from '../constants/config';
import { COLORS, GRADIENTS, RADII } from '../constants/theme';
import {
  bankrollFor,
  dayKey,
  isPlayedToday,
  modifierForDay,
  nextStreak,
  rewardFor,
} from '../game/daily';
import { ResultPayload, sessionResult } from '../game/result';
import { formatCoins, timeToMidnight } from '../utils/format';
import { useSpin } from '../hooks/useSpin';
import {
  useBalance,
  useComfort,
  useDaily,
  useDispatch,
  useSettings,
} from '../hooks/useGameState';

type Props = {
  onHome: () => void;
  onFinish: (payload: ResultPayload) => void;
};

type Run = { spinsLeft: number; bank: number; won: number; sevens: number };

export default function DailyModeScreen({ onHome, onFinish }: Props) {
  const balance = useBalance();
  const comfort = useComfort();
  const daily = useDaily();
  const settings = useSettings();
  const dispatch = useDispatch();

  const today = useMemo(() => dayKey(), []);
  const modifier = useMemo(() => modifierForDay(today), [today]);
  const bankroll = bankrollFor(comfort, modifier);
  const reward = rewardFor(modifier, nextStreak(daily.lastDay, today, daily.streak));
  const played = isPlayedToday(daily.lastDay, today);

  const [run, setRun] = useState<Run | null>(null);
  const runRef = useRef<Run | null>(null);
  const spinScale = useRef(new Animated.Value(1)).current;

  const finish = useCallback(
    (current: Run, cleared: boolean) => {
      const streak = nextStreak(daily.lastDay, today, daily.streak);
      const paid = cleared ? rewardFor(modifier, streak) : 0;
      dispatch({ type: 'DAILY_FINISHED', day: today, streak, reward: paid });
      runRef.current = null;
      setRun(null);
      onFinish(
        sessionResult(
          cleared,
          [
            { label: 'TONIGHT', value: modifier.title },
            { label: 'SPINS USED', value: String(DAILY_MAX_SPINS - current.spinsLeft) },
            { label: 'COINS WON', value: formatCoins(current.won) },
            { label: 'SEVENS LANDED', value: String(current.sevens) },
            { label: 'REWARD', value: formatCoins(paid) },
          ],
          'daily',
        ),
      );
    },
    [daily.lastDay, daily.streak, dispatch, modifier, onFinish, today],
  );

  const handleSettled = useCallback(
    (summary: { total: number; sevens: number }) => {
      const current = runRef.current;
      if (!current) {
        return;
      }
      const next: Run = {
        spinsLeft: Math.max(0, current.spinsLeft - 1),
        bank: current.bank - BET + summary.total,
        won: current.won + summary.total,
        sevens: current.sevens + summary.sevens,
      };
      runRef.current = next;
      setRun(next);
      if (next.spinsLeft <= 0 || next.bank < BET) {
        finish(next, next.won > 0);
      }
    },
    [finish],
  );

  const { columns, offsets, spinning, wins, winningCells, banner, spin } = useSpin({
    bet: BET,
    cell: CELL_COMPACT,
    modifier: modifier.key,
    onSettled: handleSettled,
  });

  const onSpinPress = () => {
    if (spinning) {
      return;
    }
    const started = spin();
    if (!started && balance < BET) {
      const current = runRef.current;
      if (current) {
        finish(current, current.won > 0);
      }
    }
  };

  const beginRun = () => {
    const fresh: Run = { spinsLeft: DAILY_MAX_SPINS, bank: bankroll, won: 0, sevens: 0 };
    runRef.current = fresh;
    setRun(fresh);
  };

  const pressIn = () => {
    Animated.spring(spinScale, { toValue: 0.96, ...SPRING_BUTTON, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(spinScale, { toValue: 1, ...SPRING_BUTTON, useNativeDriver: true }).start();
  };

  return (
    <ScreenBackground overlay="default" blobTop={180}>
      <AppHeader title="DAILY MODE" onHome={onHome} rightSlot={<CoinBadge value={balance} />} />

      <View style={styles.body}>
        {run ? (
          <>
            <View style={styles.hud}>
              <Text style={styles.hudMain}>
                {'SPINS LEFT ' + run.spinsLeft + '/' + DAILY_MAX_SPINS}
              </Text>
              <Text style={styles.hudSub}>{modifier.title + ' · ' + modifier.rule}</Text>
            </View>

            <View style={styles.boardWrap}>
              <SlotBoard
                columns={columns}
                offsets={offsets}
                winningCells={winningCells}
                wins={wins}
                spinning={spinning}
                compact
                showPaylines={settings.paylineOverlay}
              />
              <WinBanner
                title={banner ? banner.title : ''}
                amount={banner ? banner.amount : 0}
                visible={!!banner}
              />
            </View>

            <Pressable
              onPress={spinning ? undefined : onSpinPress}
              onPressIn={spinning ? undefined : pressIn}
              onPressOut={spinning ? undefined : pressOut}
              disabled={spinning}
              accessibilityRole="button"
              accessibilityLabel="Spin the reels"
              accessibilityState={{ disabled: spinning }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.spinPress}>
              <Animated.View
                pointerEvents="box-none"
                style={[styles.spinAnim, { transform: [{ scale: spinScale }] }]}>
                <LinearGradient
                  colors={
                    (spinning
                      ? GRADIENTS.goldButtonFlat
                      : GRADIENTS.goldButtonStrong) as unknown as string[]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.spinGradient}>
                  <Text style={styles.spinLabel}>{spinning ? 'SPINNING...' : 'SPIN'}</Text>
                </LinearGradient>
              </Animated.View>
            </Pressable>
          </>
        ) : (
          <>
            <DailyModifierCard
              modifier={modifier}
              bankroll={bankroll}
              reward={reward}
              streak={daily.streak}
              state={played ? 'played' : 'available'}
              countdown={timeToMidnight()}
              lastReward={daily.lastReward}
            />
            {played ? (
              <Text style={styles.closedHint}>
                THE DOOR REOPENS AT MIDNIGHT — THE FLOOR IS STILL OPEN TONIGHT
              </Text>
            ) : (
              <Text style={styles.hint}>ONE RUN, ONE MODIFIER, ONE TAP ON SPIN</Text>
            )}
            {played ? null : <PrimaryButton label="START RUN" onPress={beginRun} Icon={Calendar} />}
          </>
        )}
      </View>

      <View style={styles.footer}>
        <SecondaryButton label="MENU" onPress={onHome} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 14,
  },
  hud: {
    borderRadius: RADII.md,
    backgroundColor: 'rgba(20,20,24,0.78)',
    borderWidth: 1,
    borderColor: COLORS.hairGold,
    padding: 14,
    gap: 6,
  },
  hudMain: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: COLORS.goldLight,
  },
  hudSub: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: COLORS.textSecondary,
  },
  boardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  closedHint: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.1,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  spinPress: {
    width: '100%',
    height: 60,
  },
  spinAnim: {
    width: '100%',
    height: 60,
    borderRadius: RADII.lg,
  },
  spinGradient: {
    width: '100%',
    height: 60,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinLabel: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 4,
    color: COLORS.textOnGold,
  },
  footer: {
    paddingHorizontal: 18,
    paddingBottom: 22,
    paddingTop: 10,
  },
});
