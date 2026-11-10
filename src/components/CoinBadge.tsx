import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Coins } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { TABULAR, formatCoins } from '../utils/format';

type Props = {
  value: number;
  tone?: 'gold' | 'plain';
};

export default function CoinBadge({ value, tone = 'gold' }: Props) {
  return (
    <View style={styles.pill} accessibilityLabel={'Balance ' + formatCoins(value) + ' coins'}>
      <Coins size={18} color={COLORS.gold} strokeWidth={2.4} />
      <Text style={[styles.value, tone === 'plain' ? styles.valuePlain : null, TABULAR]}>
        {formatCoins(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 36,
    minWidth: 92,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(20,20,24,0.78)',
    borderWidth: 1,
    borderColor: COLORS.hairGoldStrong,
  },
  value: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '800',
    color: COLORS.goldLight,
  },
  valuePlain: {
    color: COLORS.textPrimary,
  },
});
