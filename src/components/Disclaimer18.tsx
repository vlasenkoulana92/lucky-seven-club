import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';

export const DISCLAIMER_SHORT = '18+ · VIRTUAL COINS ONLY · NOT REDEEMABLE';
export const DISCLAIMER_LONG =
  '18+ — FICTIONAL COINS, NOT REDEEMABLE FOR MONEY OR GOODS';
export const DISCLAIMER_LOADER = '18+ · FICTIONAL COINS · NO REAL MONEY';

export default function Disclaimer18({ variant = 'short' }: { variant?: 'short' | 'long' | 'loader' }) {
  const text =
    variant === 'long' ? DISCLAIMER_LONG : variant === 'loader' ? DISCLAIMER_LOADER : DISCLAIMER_SHORT;
  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
