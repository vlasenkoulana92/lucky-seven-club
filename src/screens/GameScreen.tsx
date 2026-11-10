import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppHeader from '../components/AppHeader';
import ScreenBackground from '../components/ScreenBackground';
import SlotBoard from '../components/SlotBoard';
import HeatMeter from '../components/HeatMeter';
import StatStrip from '../components/StatStrip';
import WinBanner from '../components/WinBanner';
import SecondaryButton from '../components/SecondaryButton';
import { BET, BOARD_W, SPRING_BUTTON } from '../constants/config';
import { COLORS, GRADIENTS, RADII } from '../constants/theme';
import { formatCoins } from '../utils/format';
import { useSpin } from '../hooks/useSpin';
import { useBalance, useDispatch, useHeat, useLastWin, useSettings } from '../hooks/useGameState';
import { ResultPayload, brokeResult, nightResult } from '../game/result';

type Props = {
  onHome: () => void;
  onGameOver: (payload: ResultPayload) => void;
};

export default function GameScreen({ onHome, onGameOver }: Props) {
  const balance = useBalance();
  const lastWin = useLastWin();
  const heat = useHeat();
  const settings = useSettings();
  const dispatch = useDispatch();

  const [paused, setPaused] = useState(false);
  const nightRef = useRef({ spins: 0, won: 0, best: 0, sevens: 0 });
  const brokeTimer = useRef<any>(null);

  const spinScale = useRef(new Animated.Value(1)).current;
  const balancePulse = useRef(new Animated.Value(1)).current;

  const handleSettled = useCallback(
    (summary: { total: number; sevens: number; wins: any[]; balanceAfter: number }) => {
      const night = nightRef.current;
      night.spins += 1;
      night.won += summary.total;
      night.sevens += summary.sevens;
      night.best = Math.max(night.best, summary.total);

      if (summary.total > 0) {
        Animated.sequence([
          Animated.spring(balancePulse, { toValue: 1.12, ...SPRING_BUTTON, useNativeDriver: true }),
          Animated.spring(balancePulse, { toValue: 1, ...SPRING_BUTTON, useNativeDriver: true }),
        ]).start();
      }
    },
    [balancePulse],
  );

  const { columns, offsets, spinning, wins, winningCells, banner, heatSpinActive, spin } = useSpin({
    bet: BET,
    onSettled: handleSettled,
  });

  const broke = balance < BET && !spinning;

  // Out of coins is a soft state: the result screen opens with a refill offer.
  useEffect(() => {
    if (broke && !paused) {
      brokeTimer.current = setTimeout(() => {
        const n = nightRef.current;
        onGameOver(
          brokeResult([
            { label: 'SPINS', value: String(n.spins) },
            { label: 'BEST LINE', value: formatCoins(n.best) },
            { label: 'COINS EARNED', value: formatCoins(n.won) },
            { label: 'SEVENS LANDED', value: String(n.sevens) },
          ]),
        );
      }, 1600);
    }
    return () => {
      if (brokeTimer.current) {
        clearTimeout(brokeTimer.current);
        brokeTimer.current = null;
      }
    };
  }, [broke, onGameOver, paused]);

  const onSpinPress = () => {
    if (spinning || broke) {
      return;
    }
    spin();
  };

  const closeNight = () => {
    const n = nightRef.current;
    onGameOver(
      nightResult(
        [
          { label: 'SPINS', value: String(n.spins) },
          { label: 'BEST LINE', value: formatCoins(n.best) },
          { label: 'COINS EARNED', value: formatCoins(n.won) },
          { label: 'SEVENS LANDED', value: String(n.sevens) },
        ],
        n.won >= n.spins * BET,
      ),
    );
  };

  const pressIn = () => {
    Animated.spring(spinScale, { toValue: 0.96, ...SPRING_BUTTON, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(spinScale, { toValue: 1, ...SPRING_BUTTON, useNativeDriver: true }).start();
  };

  const spinColors = (spinning
    ? GRADIENTS.goldButtonFlat
    : GRADIENTS.goldButtonStrong) as unknown as string[];

  return (
    <ScreenBackground overlay="default" blobTop={200}>
      <AppHeader title="CLUB FLOOR" onHome={onHome} onPause={() => setPaused(true)} />

      <View style={styles.area}>
        <HeatMeter value={heat} width={BOARD_W} />
        <View style={styles.boardWrap}>
          <SlotBoard
            columns={columns}
            offsets={offsets}
            winningCells={winningCells}
            wins={wins}
            spinning={spinning}
            heat={heatSpinActive}
            showPaylines={settings.paylineOverlay}
          />
          <WinBanner
            title={banner ? banner.title : ''}
            amount={banner ? banner.amount : 0}
            visible={!!banner}
          />
        </View>
      </View>

      <StatStrip
        items={[
          { label: 'BALANCE', value: formatCoins(balance), tone: COLORS.goldLight },
          { label: 'BET', value: String(BET) },
          { label: 'LAST WIN', value: formatCoins(lastWin), tone: lastWin > 0 ? COLORS.green : COLORS.textMuted },
        ]}
      />

      <View style={styles.controls}>
        {broke ? (
          <Pressable
            onPress={() => dispatch({ type: 'REFILL' })}
            accessibilityRole="button"
            accessibilityLabel="Take a refill"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.refillBtn}>
            <Text style={styles.refillText}>OUT OF COINS — TAP FOR A REFILL</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onSpinPress}
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
                colors={spinColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.spinGradient, spinning ? styles.spinGradientOff : null]}>
                <Text style={[styles.spinLabel, spinning ? styles.spinLabelOff : null]}>
                  {spinning ? 'SPINNING...' : 'SPIN'}
                </Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        )}

        <Text style={styles.hint}>ONE TAP TO SPIN · WINS PAY ON 5 LINES</Text>

        <View style={styles.endRow}>
          <SecondaryButton label="END NIGHT" tone="gold" onPress={closeNight} />
        </View>
      </View>

      {paused ? (
        <View style={styles.pauseLayer}>
          <View style={styles.pauseCard}>
            <Text style={styles.pauseTitle}>FLOOR ON HOLD</Text>
            <Text style={styles.pauseNote}>THE REELS WAIT FOR YOU</Text>
            <SecondaryButton label="RESUME" tone="gold" onPress={() => setPaused(false)} />
            <SecondaryButton label="MENU" onPress={onHome} />
          </View>
        </View>
      ) : null}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },
  boardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    backgroundColor: '#141418',
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.25)',
    paddingTop: 16,
    paddingBottom: 22,
    paddingHorizontal: 20,
    gap: 10,
  },
  spinPress: {
    width: '100%',
    height: 64,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  spinAnim: {
    width: '100%',
    height: 64,
    borderRadius: RADII.xl,
  },
  spinGradient: {
    width: '100%',
    height: 64,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinGradientOff: {
    borderColor: 'rgba(245,215,122,0.22)',
    opacity: 0.6,
  },
  spinLabel: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: 4,
    color: COLORS.textOnGold,
  },
  spinLabelOff: {
    color: '#C9BFA6',
    fontSize: 16,
    letterSpacing: 3,
  },
  refillBtn: {
    width: '100%',
    height: 64,
    borderRadius: RADII.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(198,43,71,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(198,43,71,0.6)',
  },
  refillText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.textPrimary,
  },
  hint: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  endRow: {
    marginTop: 2,
  },
  pauseLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,11,15,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  pauseCard: {
    width: '100%',
    borderRadius: RADII.xl,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairGoldStrong,
    padding: 22,
    gap: 12,
  },
  pauseTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: 2.4,
    color: COLORS.goldLight,
    textAlign: 'center',
  },
  pauseNote: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
  },
});
