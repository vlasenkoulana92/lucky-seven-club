import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenBackground from '../components/ScreenBackground';
import Disclaimer18 from '../components/Disclaimer18';
import { logo } from '../assets';
import { COLORS, GRADIENTS } from '../constants/theme';
import { LOADER_DURATION_MS } from '../constants/config';
import { useHydrate, useSettings } from '../hooks/useGameState';

const BAR_W = 180;

type Props = {
  onDone: () => void;
};

/**
 * Brand card only. Non-interactive: the single 8000 ms timer moves the app on,
 * never a tap and never an animation callback.
 */
export default function LoaderScreen({ onDone }: Props) {
  const hydrate = useHydrate();
  const settings = useSettings();

  const medallion = useRef(new Animated.Value(0.82)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const titleRise = useRef(new Animated.Value(14)).current;
  const breathe = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const entry = Animated.parallel([
      Animated.spring(medallion, { toValue: 1, tension: 180, friction: 12, useNativeDriver: true }),
      Animated.timing(fadeIn, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(titleRise, {
        toValue: 0,
        duration: 420,
        delay: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    entry.start();

    // the bar is a layout-width animation, so it runs on the JS driver only
    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    });
    bar.start();

    let loop: Animated.CompositeAnimation | null = null;
    if (!settings.reduceMotion) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(breathe, { toValue: 1.03, duration: 1300, useNativeDriver: true }),
          Animated.timing(breathe, { toValue: 1, duration: 1300, useNativeDriver: true }),
        ]),
      );
      loop.start();
    }

    const timer = setTimeout(onDone, LOADER_DURATION_MS);
    return () => {
      clearTimeout(timer);
      entry.stop();
      bar.stop();
      if (loop) {
        loop.stop();
      }
    };
  }, [breathe, fadeIn, medallion, onDone, progress, settings.reduceMotion, titleRise]);

  const barFill = progress.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <ScreenBackground overlay="loader" blobTop={150}>
      <View style={styles.wrap}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.medallion,
            { opacity: fadeIn, transform: [{ scale: Animated.multiply(medallion, breathe) }] },
          ]}>
          <Image source={logo} style={styles.logo} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.titleBlock, { opacity: fadeIn, transform: [{ translateY: titleRise }] }]}>
          <Text style={styles.titleTop}>LUCKY SEVEN</Text>
          <Text style={styles.titleBottom}>CLUB</Text>
          <Text style={styles.subtitle}>MEMBERS LOUNGE · 777</Text>
        </Animated.View>

        <View style={styles.progressBlock}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: barFill }]}>
              <LinearGradient
                colors={GRADIENTS.xp as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fillInner}
              />
            </Animated.View>
          </View>
          <Text style={styles.loadingText}>LOADING...</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Disclaimer18 variant="loader" />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  medallion: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#1E1A14',
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gold,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  logo: {
    width: 92,
    height: 92,
    resizeMode: 'contain',
  },
  titleBlock: {
    marginTop: 28,
    alignItems: 'center',
  },
  titleTop: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: 5,
    color: COLORS.goldLight,
    textAlign: 'center',
  },
  titleBottom: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: 14,
    color: COLORS.gold,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 3,
    color: COLORS.textSecondary,
  },
  progressBlock: {
    marginTop: 40,
    alignItems: 'center',
  },
  track: {
    width: BAR_W,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fillInner: {
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.textMuted,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
  },
});
