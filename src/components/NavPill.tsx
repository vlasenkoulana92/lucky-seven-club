import React from 'react';
import { IconComponent } from "../constants/icons";
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const PILL_ICON_SIZE = 20;

type Props = {
  label: string;
  onPress: () => void;
  Icon: IconComponent;
  full?: boolean;
};

export default function NavPill({ label, onPress, Icon, full = false }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, full ? styles.full : styles.half]}>
      <Animated.View pointerEvents="box-none" style={[styles.anim, { transform: [{ scale }] }]}>
        <View style={styles.row}>
          <Icon size={PILL_ICON_SIZE} color={COLORS.gold} strokeWidth={2.2} />
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    height: 52,
  },
  half: {
    flex: 1,
  },
  full: {
    width: '100%',
  },
  anim: {
    width: '100%',
    height: 52,
    borderRadius: RADII.md,
    backgroundColor: COLORS.glassFill,
    borderWidth: 1,
    borderColor: COLORS.hairLight,
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
    fontSize: 13,
    lineHeight: PILL_ICON_SIZE,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textPrimary,
  },
});
