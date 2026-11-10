import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/theme';
import { HEAT_MAX } from '../constants/config';
import { barWidth } from '../utils/format';

type Props = {
  value: number;
  max?: number;
  width: number;
};

/**
 * Seven Heat. Static layout width - the fill is a plain percentage view, no
 * animated width anywhere (layout props are never native-driven here).
 */
export default function HeatMeter({ value, max = HEAT_MAX, width }: Props) {
  const safe = Math.max(0, Math.min(max, value));
  const ready = safe >= max;
  return (
    <View style={[styles.wrap, { width }]}>
      <View style={styles.row}>
        <Text style={styles.caption}>{'SEVEN HEAT ' + safe + '/' + max}</Text>
        <Text style={[styles.caption, ready ? styles.ready : styles.captionMuted]}>
          {ready ? 'HEAT SPIN READY' : 'FILL WITH SEVENS'}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={barWidth(safe / max)}>
          <LinearGradient
            colors={GRADIENTS.heat as unknown as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caption: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
  },
  captionMuted: {
    color: COLORS.textMuted,
  },
  ready: {
    color: COLORS.goldLight,
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  fill: {
    flex: 1,
    borderRadius: 5,
  },
});
