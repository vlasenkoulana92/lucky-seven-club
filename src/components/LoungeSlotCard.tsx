import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Coins } from 'lucide-react-native';
import { COLORS, RADII } from '../constants/theme';
import { Decor } from '../game/lounge';
import { formatCoins } from '../utils/format';

type Props = {
  decor: Decor;
  owned: boolean;
  affordable: boolean;
  missing: number;
  onPlace: (key: string) => void;
};

export default function LoungeSlotCard({ decor, owned, affordable, missing, onPlace }: Props) {
  const lit = useRef(new Animated.Value(owned ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(lit, {
      toValue: owned ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [owned, lit]);

  const disabled = owned || !affordable;

  return (
    <View style={[styles.card, owned ? { borderColor: decor.accent } : null]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          { backgroundColor: decor.accent + '26', opacity: lit, transform: [{ scale: lit }] },
        ]}
      />
      <Text style={[styles.title, owned ? { color: decor.accent } : null]} numberOfLines={1}>
        {decor.title}
      </Text>
      <Text style={styles.note} numberOfLines={2}>
        {decor.note}
      </Text>

      {owned ? (
        <Text style={[styles.placed, { color: decor.accent }]}>
          {'PLACED · COMFORT +' + decor.comfort}
        </Text>
      ) : (
        <View style={styles.priceRow}>
          <Coins size={16} color={COLORS.gold} strokeWidth={2.4} />
          <Text style={styles.price}>{formatCoins(decor.price)}</Text>
        </View>
      )}

      {owned ? null : (
        <Pressable
          onPress={affordable ? () => onPlace(decor.key) : undefined}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={'Place ' + decor.title}
          accessibilityState={{ disabled }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.btn, affordable ? styles.btnOn : styles.btnOff]}>
          <Text style={[styles.btnText, affordable ? styles.btnTextOn : styles.btnTextOff]}>
            {affordable ? 'PLACE' : 'NEED ' + formatCoins(missing) + ' MORE'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 150,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairLight,
    padding: 14,
    gap: 6,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  glow: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  title: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },
  note: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    color: COLORS.goldLight,
  },
  placed: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  btn: {
    height: 48,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  btnOn: {
    backgroundColor: 'rgba(212,175,55,0.18)',
    borderColor: COLORS.hairGoldStrong,
  },
  btnOff: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
    opacity: 0.6,
  },
  btnText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  btnTextOn: {
    color: COLORS.goldLight,
  },
  btnTextOff: {
    color: COLORS.textMuted,
  },
});
