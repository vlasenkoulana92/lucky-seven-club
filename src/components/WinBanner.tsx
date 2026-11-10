import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { COLORS, RADII } from '../constants/theme';
import { TABULAR, formatCoins } from '../utils/format';

type Props = {
  title: string;
  amount: number;
  visible: boolean;
};

/** Floating result card over the board. Opacity + scale only. */
export default function WinBanner({ title, amount, visible }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: visible ? 160 : 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: visible ? 1 : 0.92,
        tension: 170,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, scale]);

  if (!title) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.card, { opacity, transform: [{ scale }] }]}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.amount, TABULAR]} numberOfLines={1}>
        {'+' + formatCoins(amount)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    alignSelf: 'center',
    top: '34%',
    minWidth: 220,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: RADII.md,
    backgroundColor: 'rgba(11,11,15,0.86)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: COLORS.textPrimary,
  },
  amount: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '800',
    color: COLORS.goldLight,
  },
});
