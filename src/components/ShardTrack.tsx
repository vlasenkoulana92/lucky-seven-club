import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';

type Props = {
  owned: number;
  total: number;
  art: any;
  accent: string;
};

/** Filled slots carry the set sprite; empty slots are dashed gold outlines. */
export default function ShardTrack({ owned, total, art, accent }: Props) {
  const slots = [];
  for (let i = 0; i < total; i++) {
    const filled = i < owned;
    slots.push(
      <View
        key={'shard-' + i}
        style={[
          styles.slot,
          filled
            ? { borderColor: accent, backgroundColor: accent + '1A' }
            : styles.slotEmpty,
        ]}>
        {filled ? <Image source={art} style={styles.art} /> : null}
      </View>,
    );
  }
  return <View style={styles.row}>{slots}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  slot: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotEmpty: {
    borderStyle: 'dashed',
    borderColor: COLORS.hairGoldStrong,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  art: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
