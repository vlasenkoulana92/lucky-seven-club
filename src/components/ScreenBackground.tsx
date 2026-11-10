import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { bgGame } from '../assets';
import { COLORS, GRADIENTS } from '../constants/theme';

export type OverlayKind = 'loader' | 'menu' | 'default' | 'result';

const OVERLAYS: Record<OverlayKind, string[]> = {
  loader: GRADIENTS.loaderOverlay as unknown as string[],
  menu: GRADIENTS.menuScrim as unknown as string[],
  default: GRADIENTS.defaultScrim as unknown as string[],
  result: GRADIENTS.resultScrim as unknown as string[],
};

type Props = {
  children: React.ReactNode;
  overlay?: OverlayKind;
  /** the soft radial gold blob sits behind the main element */
  blobTop?: number;
};

/**
 * bg_game is the one and only background in the project. Screens are told
 * apart by the gradient scrim laid over it.
 */
export default function ScreenBackground({ children, overlay = 'default', blobTop = 120 }: Props) {
  const colors = OVERLAYS[overlay] || OVERLAYS.default;
  return (
    <ImageBackground source={bgGame} style={styles.bg} resizeMode="cover">
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[styles.blob, { top: blobTop }]} />
      <View pointerEvents="none" style={[styles.rule, styles.ruleTop]} />
      <View pointerEvents="none" style={[styles.rule, styles.ruleBottom]} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  blob: {
    position: 'absolute',
    alignSelf: 'center',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(212,175,55,0.10)',
  },
  rule: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(212,175,55,0.16)',
  },
  ruleTop: {
    top: '25%',
  },
  ruleBottom: {
    bottom: '25%',
  },
});
