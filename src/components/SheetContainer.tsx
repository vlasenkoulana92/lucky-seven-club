import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, GRADIENTS, RADII } from '../constants/theme';

/** The M2 bottom sheet: frosted brass panel that carries the CTA. */
export default function SheetContainer({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient colors={GRADIENTS.sheet as unknown as string[]} style={styles.sheet}>
      <View style={styles.handle} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: RADII.sheet,
    borderTopRightRadius: RADII.sheet,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.28)',
    paddingHorizontal: 20,
    paddingTop: 14,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 16,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: 'rgba(212,175,55,0.45)',
  },
});

export const SHEET_BG = COLORS.surfaceSunken;
