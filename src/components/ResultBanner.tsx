import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

type Props = {
  headline: string;
  note: string;
  win: boolean;
};

/** Result wording is always in the club's own words, never "You win". */
export default function ResultBanner({ headline, note, win }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.headline, { color: win ? COLORS.goldLight : COLORS.ruby }]}>
        {headline}
      </Text>
      <View style={styles.rule} />
      <Text style={styles.note}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 10,
  },
  headline: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  rule: {
    width: 120,
    height: 1,
    backgroundColor: COLORS.hairGoldStrong,
  },
  note: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
