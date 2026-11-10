import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Award,
  Calendar,
  Crown,
  Gem,
  Info,
  Layers,
  Settings as SettingsIcon,
  Spade,
  Trophy,
} from 'lucide-react-native';
import ScreenBackground from '../components/ScreenBackground';
import SheetContainer from '../components/SheetContainer';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import NavPill from '../components/NavPill';
import CoinBadge from '../components/CoinBadge';
import StatTile, { StatTileRow } from '../components/StatTile';
import Disclaimer18 from '../components/Disclaimer18';
import { logo } from '../assets';
import { COLORS, RADII } from '../constants/theme';
import { FLOAT_MS } from '../constants/config';
import { completedSetCount } from '../game/collections';
import {
  useBalance,
  useComfort,
  useLevel,
  useSaveError,
  useSettings,
  useShards,
} from '../hooks/useGameState';

type Props = {
  onPlay: () => void;
  onChallenge: () => void;
  onDaily: () => void;
  onCollection: () => void;
  onProgress: () => void;
  onSettings: () => void;
};

export default function MenuScreen({
  onPlay,
  onChallenge,
  onDaily,
  onCollection,
  onProgress,
  onSettings,
}: Props) {
  const balance = useBalance();
  const level = useLevel();
  const comfort = useComfort();
  const shards = useShards();
  const settings = useSettings();
  const saveError = useSaveError();
  const [rulesOpen, setRulesOpen] = useState(false);

  const rise = useRef(new Animated.Value(40)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entry = Animated.parallel([
      Animated.timing(rise, { toValue: 0, duration: 380, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]);
    entry.start();

    let loop: Animated.CompositeAnimation | null = null;
    if (!settings.reduceMotion) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(float, { toValue: 1, duration: FLOAT_MS / 2, useNativeDriver: true }),
          Animated.timing(float, { toValue: 0, duration: FLOAT_MS / 2, useNativeDriver: true }),
        ]),
      );
      loop.start();
    }
    return () => {
      entry.stop();
      if (loop) {
        loop.stop();
      }
    };
  }, [fade, float, rise, settings.reduceMotion]);

  const heroShift = float.interpolate({ inputRange: [0, 1], outputRange: [5, -5] });
  const sets = completedSetCount(shards);

  return (
    <ScreenBackground overlay="menu" blobTop={120}>
      <View style={styles.topStrip}>
        <Pressable
          onPress={() => setRulesOpen(v => !v)}
          accessibilityRole="button"
          accessibilityLabel="House rules"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.infoBtn}>
          <Info size={22} color={COLORS.goldLight} strokeWidth={2.2} />
        </Pressable>
        <CoinBadge value={balance} />
      </View>

      <View style={styles.hero}>
        <Animated.View
          pointerEvents="none"
          style={[styles.heroArt, { transform: [{ translateY: heroShift }] }]}>
          <Image source={logo} style={styles.logo} />
        </Animated.View>
        {saveError ? (
          <View style={styles.saveCard}>
            <Text style={styles.saveText}>SAVE RESET — YOUR LOUNGE IS BACK TO THE DOOR</Text>
          </View>
        ) : null}
      </View>

      {rulesOpen ? (
        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>HOUSE RULES</Text>
          <Text style={styles.rulesLine}>ONE TAP ON SPIN WORKS THE THREE BRASS REELS</Text>
          <Text style={styles.rulesLine}>FIVE LINES PAY: THREE ROWS AND BOTH DIAGONALS</Text>
          <Text style={styles.rulesLine}>LUCKY SEVEN IS WILD AND FILLS THE HEAT METER</Text>
          <Text style={styles.rulesLine}>TWO OF A KIND DROPS A SHARD INTO ITS SET</Text>
          <Text style={styles.rulesLine}>COINS ARE FICTIONAL — NOTHING HERE IS FOR SALE</Text>
          <SecondaryButton label="CLOSE" tone="gold" onPress={() => setRulesOpen(false)} />
        </View>
      ) : null}

      <Animated.View
        pointerEvents="box-none"
        style={{ opacity: fade, transform: [{ translateY: rise }] }}>
        <SheetContainer>
          <Text style={styles.title}>LUCKY SEVEN CLUB</Text>
          <Text style={styles.tagline}>SPIN · COLLECT · FURNISH YOUR LOUNGE</Text>

          <View style={styles.statsWrap}>
            <StatTileRow>
              <StatTile value={String(level)} label="CLUB LEVEL" accent={COLORS.goldLight} />
              <StatTile value={String(sets)} label="SETS DONE" accent={COLORS.green} />
              <StatTile value={String(comfort)} label="COMFORT" accent={COLORS.ruby} />
            </StatTileRow>
          </View>

          <View style={styles.ctaWrap}>
            <PrimaryButton label="PLAY NOW" onPress={onPlay} Icon={Spade} />
          </View>

          <View style={styles.navGrid}>
            <View style={styles.navRow}>
              <NavPill label="CHALLENGE" Icon={Trophy} onPress={onChallenge} />
              <NavPill label="DAILY MODE" Icon={Calendar} onPress={onDaily} />
            </View>
            <View style={styles.navRow}>
              <NavPill label="COLLECTION" Icon={Gem} onPress={onCollection} />
              <NavPill label="PROGRESS" Icon={Award} onPress={onProgress} />
            </View>
            <View style={styles.navRow}>
              <NavPill label="HOW TO PLAY" Icon={Crown} onPress={() => setRulesOpen(true)} />
              <NavPill label="SETTINGS" Icon={SettingsIcon} onPress={onSettings} />
            </View>
          </View>

          <View style={styles.disclaimerWrap}>
            <Disclaimer18 variant="short" />
          </View>
        </SheetContainer>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  topStrip: {
    paddingTop: 44,
    height: 92,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20,20,24,0.72)',
    borderWidth: 1,
    borderColor: COLORS.hairGoldStrong,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroArt: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 108,
    height: 108,
    resizeMode: 'contain',
  },
  saveCard: {
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADII.sm,
    backgroundColor: 'rgba(198,43,71,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(198,43,71,0.5)',
  },
  saveText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  rulesCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: RADII.xl,
    backgroundColor: 'rgba(11,11,15,0.92)',
    borderWidth: 1,
    borderColor: COLORS.hairGoldStrong,
    gap: 8,
  },
  rulesTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.goldLight,
    textAlign: 'center',
  },
  rulesLine: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
  },
  title: {
    marginTop: 14,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.goldLight,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statsWrap: {
    marginTop: 16,
  },
  ctaWrap: {
    marginTop: 18,
  },
  navGrid: {
    marginTop: 14,
    gap: 10,
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
  },
  disclaimerWrap: {
    marginTop: 12,
    marginBottom: 20,
  },
});
