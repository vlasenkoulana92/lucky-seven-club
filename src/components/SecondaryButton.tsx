import React from 'react';
import { IconComponent } from "../constants/icons";
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

export const SECONDARY_ICON_SIZE = 24;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  tone?: 'neutral' | 'danger' | 'gold';
  disabled?: boolean;
};

export default function SecondaryButton({
  label,
  onPress,
  Icon,
  tone = 'neutral',
  disabled = false,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const accent =
    tone === 'danger' ? COLORS.ruby : tone === 'gold' ? COLORS.goldLight : COLORS.textPrimary;
  const border =
    tone === 'danger'
      ? 'rgba(198,43,71,0.55)'
      : tone === 'gold'
      ? COLORS.hairGoldStrong
      : COLORS.hairLight;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, disabled ? styles.disabled : null]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.anim, { borderColor: border }, { transform: [{ scale }] }]}>
        <View style={styles.row}>
          {Icon ? <Icon size={SECONDARY_ICON_SIZE} color={accent} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color: accent }]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 48,
  },
  disabled: {
    opacity: 0.4,
  },
  anim: {
    width: '100%',
    height: 48,
    borderRadius: RADII.md,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 15,
    lineHeight: SECONDARY_ICON_SIZE,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
