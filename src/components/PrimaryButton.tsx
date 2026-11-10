import React from 'react';
import { IconComponent } from "../constants/icons";
import { Animated, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { buttonRect } from '../assets';
import { COLORS, GRADIENTS, RADII } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

export const PRIMARY_ICON_SIZE = 24;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  disabled?: boolean;
  height?: number;
};

/**
 * Pressable is the PARENT, the Animated.View lives INSIDE it. Icon is locked
 * to 24x24 and the label lineHeight matches it, so nothing drifts.
 */
export default function PrimaryButton({
  label,
  onPress,
  Icon,
  disabled = false,
  height = 60,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const colors = (disabled ? GRADIENTS.goldButtonFlat : GRADIENTS.goldButton) as unknown as string[];

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
      style={[styles.press, { height }, disabled ? styles.pressDisabled : null]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.anim, { height }, { transform: [{ scale }] }]}>
        <ImageBackground
          source={buttonRect}
          resizeMode="stretch"
          style={[styles.plate, { height }]}
          imageStyle={styles.plateImage}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, { height }, disabled ? styles.gradientDisabled : null]}>
            <View style={styles.row}>
              {Icon ? (
                <Icon size={PRIMARY_ICON_SIZE} color={COLORS.textOnGold} strokeWidth={2.5} />
              ) : null}
              <Text style={[styles.label, disabled ? styles.labelDisabled : null]}>{label}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: RADII.lg,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  pressDisabled: {
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  },
  anim: {
    width: '100%',
    borderRadius: RADII.lg,
  },
  plate: {
    width: '100%',
    borderRadius: RADII.lg,
    overflow: 'hidden',
  },
  plateImage: {
    borderRadius: RADII.lg,
  },
  gradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
  },
  gradientDisabled: {
    borderColor: 'rgba(245,215,122,0.25)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 19,
    lineHeight: PRIMARY_ICON_SIZE,
    fontWeight: '800',
    letterSpacing: 3,
    color: COLORS.textOnGold,
  },
  labelDisabled: {
    color: '#C9BFA6',
  },
});
