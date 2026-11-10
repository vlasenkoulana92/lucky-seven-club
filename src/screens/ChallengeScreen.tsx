import React, { useCallback, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppHeader from '../components/AppHeader';
import ScreenBackground from '../components/ScreenBackground';
import SlotBoard from '../components/SlotBoard';
import WinBanner from '../components/WinBanner';
import SessionCard from '../components/SessionCard';
import SecondaryButton from '../components/SecondaryButton';
import EmptyState from '../components/EmptyState';
import CoinBadge from '../components/CoinBadge';
import { Trophy } from 'lucide-react-native';
import { BET, CELL_COMPACT, SPRING_BUTTON } from '../constants/config';
import { COLORS, GRADIENTS, RADII } from '../constants/theme';
import {
  SESSIONS,
  SessionRun,
  goalLabel,
  goalProgress,
  isGoalMet,
  isSessionLocked,
  sessionByKey,
  startSession,
} from '../game/sessions';
import { ResultPayload, sessionResult } from '../game/result';
import { barWidth, formatCoins } from '../utils/format';
import { useSpin } from '../hooks/useSpin';
import { useBalance, useDispatch, useLevel, useSettings } from '../hooks/useGameState';

type Props = {
  onHome: () => void;
  onFinish: (payload: ResultPayload) => void;
};

export default function ChallengeScreen({ onHome, onFinish }: Props) {
  const level = useLevel();
  const balance = useBalance();
  const settings = useSettings();
  const dispatch = useDispatch();

  const [run, setRun] = useState<SessionRun | null>(null);
  const runRef = useRef<SessionRun | null>(null);
  const spinScale = useRef(new Animated.Value(1)).current;

  const finish = useCallback(
    (current: SessionRun, cleared: boolean) => {
      const def = sessionByKey(current.key);
      if (def && cleared) {
        dispatch({
          type: 'SESSION_REWARD',
          coins: def.reward,
          shardKey: 'bell',
          shards: def.shardReward,
        });
      }
      runRef.current = null;
      setRun(null);
      onFinish(
        sessionResult(
          cleared,
          [
            { label: 'TABLE', value: def ? def.title : 'SESSION' },
            { label: 'SPINS USED', value: String(current.spinsTotal - current.spinsLeft) },
            { label: 'COINS WON', value: formatCoins(current.coinsWon) },
            { label: 'SEVENS LANDED', value: String(current.sevens) },
            { label: 'REWARD', value: cleared && def ? formatCoins(def.reward) : '0' },
          ],
          'challenge',
        ),
      );
    },
    [dispatch, onFinish],
  );

  const handleSettled = useCallback(
    (summary: { total: number; sevens: number }) => {
      const current = runRef.current;
      if (!current) {
        return;
      }
      const def = sessionByKey(current.key);
      if (!def) {
        return;
      }
      const next: SessionRun = {
        ...current,
        spinsLeft: Math.max(0, current.spinsLeft - 1),
        coinsWon: current.coinsWon + summary.total,
        sevens: current.sevens + summary.sevens,
      };
      runRef.current = next;
      setRun(next);
      if (isGoalMet(next, def)) {
        finish(next, true);
      } else if (next.spinsLeft <= 0) {
        finish(next, false);
      }
    },
    [finish],
  );

  const { columns, offsets, spinning, wins, winningCells, banner, spin } = useSpin({
    bet: BET,
    cell: CELL_COMPACT,
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
        finish(current, false);
      }
    }
  };

  const begin = (key: string) => {
    const def = sessionByKey(key);
    if (!def) {
      return;
    }
    const fresh = startSession(def);
    runRef.current = fresh;
    setRun(fresh);
  };

  const def = run ? sessionByKey(run.key) : undefined;
  const openSessions = SESSIONS.filter(s => !isSessionLocked(s, level));

  const pressIn = () => {
    Animated.spring(spinScale, { toValue: 0.96, ...SPRING_BUTTON, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(spinScale, { toValue: 1, ...SPRING_BUTTON, useNativeDriver: true }).start();
  };

  return (
    <ScreenBackground overlay="default" blobTop={180}>
      <AppHeader title="CHALLENGE" onHome={onHome} rightSlot={<CoinBadge value={balance} />} />

      {run && def ? (
        <View style={styles.body}>
          <View style={styles.hud}>
            <Text style={styles.hudMain}>
              {'SPINS LEFT ' + run.spinsLeft + '/' + run.spinsTotal}
            </Text>
            <Text style={styles.hudGoal}>{goalLabel(def.goal)}</Text>
            <View style={styles.track}>
              <View style={barWidth(goalProgress(run, def))}>
                <LinearGradient
                  colors={GRADIENTS.xp as unknown as string[]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.fill}
                />
              </View>
            </View>
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
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={styles.lead}>PICK A TABLE · ONE SPIN BUTTON · A FIXED BUDGET</Text>
          {openSessions.length === 0 ? (
            <EmptyState
              title="THE TABLES ARE RESTING"
              hint="COME BACK AFTER YOUR NEXT CLUB LEVEL"
              Icon={Trophy}
            />
          ) : (
            <View style={styles.cards}>
              {SESSIONS.map(s => (
                <SessionCard
                  key={s.key}
                  session={s}
                  locked={isSessionLocked(s, level)}
                  onStart={begin}
                />
              ))}
            </View>
          )}
        </View>
      )}

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
  lead: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  cards: {
    gap: 12,
  },
  hud: {
    borderRadius: RADII.md,
    backgroundColor: 'rgba(20,20,24,0.78)',
    borderWidth: 1,
    borderColor: COLORS.hairGold,
    padding: 14,
    gap: 8,
  },
  hudMain: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: COLORS.goldLight,
  },
  hudGoal: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  fill: {
    flex: 1,
  },
  boardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
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
