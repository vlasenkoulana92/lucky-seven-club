import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII } from '../constants/theme';
import { TABULAR } from '../utils/format';

type Props = {
  value: string;
  label: string;
  accent?: string;
};

/**
 * The one stat card of the project, reused on Menu, Progress and Result.
 * No raster icon: colour carries the semantics, the number carries the value.
 * A tile with nothing to show renders null instead of an empty box.
 */
export default function StatTile({ value, label, accent = COLORS.gold }: Props) {
  if (!value || value === '0') {
    return null;
  }
  return (
    <View style={[styles.card, { borderColor: accent + '55' }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: accent }, TABULAR]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** A row is only worth drawing when at least two tiles survive. */
export function StatTileRow({ children }: { children: React.ReactNode }) {
  const visible = React.Children.toArray(children).filter(Boolean);
  if (visible.length < 2) {
    return null;
  }
  return <View style={styles.row}>{visible.map((child, i) => (
    <View key={i} style={styles.slot}>{child}</View>
  ))}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  slot: {
    flex: 1,
  },
  card: {
    width: '100%',
    minHeight: 72,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: RADII.md,
    borderWidth: 1,
    backgroundColor: COLORS.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
});
