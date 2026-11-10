import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII } from '../constants/theme';

type Props = {
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
};

export default function SegmentedControl({ options, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {options.map(opt => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[styles.segment, active ? styles.segmentActive : null]}>
            <Text style={[styles.label, active ? styles.labelActive : null]} numberOfLines={1}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 44,
    flexDirection: 'row',
    borderRadius: RADII.md,
    backgroundColor: 'rgba(20,20,24,0.82)',
    borderWidth: 1,
    borderColor: COLORS.hairGold,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 34,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: 'rgba(212,175,55,0.18)',
    borderWidth: 1,
    borderColor: COLORS.hairGoldStrong,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textMuted,
  },
  labelActive: {
    color: COLORS.goldLight,
  },
});
