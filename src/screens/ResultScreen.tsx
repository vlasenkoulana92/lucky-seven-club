import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Coins, RotateCcw } from 'lucide-react-native';
import ScreenBackground from '../components/ScreenBackground';
import AppHeader from '../components/AppHeader';
import ResultBanner from '../components/ResultBanner';
import SummaryCard from '../components/SummaryCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import CoinBadge from '../components/CoinBadge';
import Disclaimer18 from '../components/Disclaimer18';
import { COLORS, RADII } from '../constants/theme';
import { SPRING_CARD } from '../constants/config';
import { ResultPayload } from '../game/result';
import { useBalance, useDispatch } from '../hooks/useGameState';

type Props = {
  payload: ResultPayload;
  onPlayAgain: () => void;
  onMenu: () => void;
  onCollection: () => void;
};

export default function ResultScreen({ payload, onPlayAgain, onMenu, onCollection }: Props) {
  const balance = useBalance();
  const dispatch = useDispatch();
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const anim = Animated.spring(scale, { toValue: 1, ...SPRING_CARD, useNativeDriver: true });
    anim.start();
    return () => anim.stop();
  }, [scale]);

  const takeRefill = () => {
    dispatch({ type: 'REFILL' });
    onPlayAgain();
  };

  return (
    <ScreenBackground overlay="result" blobTop={160}>
      <AppHeader title="THE DOOR" rightSlot={<CoinBadge value={balance} />} />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.card, { transform: [{ scale }] }]}>
          <ResultBanner headline={payload.headline} note={payload.note} win={payload.win} />
          <View style={styles.summaryWrap}>
            <SummaryCard rows={payload.rows} />
          </View>
        </Animated.View>

        <View style={styles.ctaStack}>
          {payload.offerRefill ? (
            <PrimaryButton label="CLAIM 500 COINS" onPress={takeRefill} Icon={Coins} />
          ) : null}
          <PrimaryButton
            label="SPIN AGAIN"
            onPress={onPlayAgain}
            Icon={RotateCcw}
            height={payload.offerRefill ? 56 : 60}
          />
          <SecondaryButton label="MENU" onPress={onMenu} />
          <Pressable
            onPress={onCollection}
            accessibilityRole="button"
            accessibilityLabel="Open collection"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.linkBtn}>
            <Text style={styles.linkText}>COLLECTION</Text>
          </Pressable>
        </View>

        <Disclaimer18 variant="short" />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: RADII.xl,
    backgroundColor: 'rgba(20,20,24,0.78)',
    borderWidth: 1,
    borderColor: COLORS.hairGoldStrong,
    paddingVertical: 22,
    paddingHorizontal: 18,
    gap: 16,
  },
  summaryWrap: {
    width: '100%',
  },
  ctaStack: {
    gap: 12,
  },
  linkBtn: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: COLORS.gold,
  },
});
