import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { TABULAR, formatCoins } from '../utils/format';

type Item = { label: string; value: string; tone?: string };

type Props = {
  items: Item[];
};

/** The thin G3 strip under the board. */
export default function StatStrip({ items }: Props) {
  const visible = items.filter(i => !!i.label && !!i.value);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.strip}>
      {visible.map(item => (
        <View key={item.label} style={styles.cell}>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
          <Text
            style={[styles.value, { color: item.tone || COLORS.textPrimary }, TABULAR]}
            numberOfLines={1}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function coinText(value: number): string {
  return formatCoins(value);
}

const styles = StyleSheet.create({
  strip: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderTopWidth: 1,
    borderTopColor: COLORS.hairGold,
    paddingHorizontal: 12,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textMuted,
  },
  value: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '800',
  },
});
