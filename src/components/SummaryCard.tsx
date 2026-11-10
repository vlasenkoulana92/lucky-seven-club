import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII } from '../constants/theme';
import { TABULAR } from '../utils/format';

export type SummaryRow = { label: string; value: string };

type Props = {
  rows: SummaryRow[];
};

/** Rows with nothing to show are dropped; an all-zero card is not rendered. */
export default function SummaryCard({ rows }: Props) {
  const visible = rows.filter(r => r.value && r.value !== '0');
  if (visible.length === 0) {
    return null;
  }
  return (
    <View style={styles.card}>
      {visible.map((row, i) => (
        <View
          key={row.label}
          style={[styles.row, i < visible.length - 1 ? styles.rowDivider : null]}>
          <Text style={styles.label} numberOfLines={1}>
            {row.label}
          </Text>
          <Text style={[styles.value, TABULAR]} numberOfLines={1}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: RADII.xl,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairGold,
    paddingHorizontal: 18,
  },
  row: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.hairLight,
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
});
