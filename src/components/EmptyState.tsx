import React from 'react';
import { IconComponent } from "../constants/icons";
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII } from '../constants/theme';

type Props = {
  title: string;
  hint: string;
  Icon?: IconComponent;
};

/** Never a blank area: every list that can be empty renders this instead. */
export default function EmptyState({ title, hint, Icon }: Props) {
  return (
    <View style={styles.wrap}>
      {Icon ? (
        <View style={styles.iconWrap}>
          <Icon size={28} color={COLORS.gold} strokeWidth={2} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    maxWidth: 320,
    marginTop: 28,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: RADII.xl,
    backgroundColor: 'rgba(28,28,36,0.82)',
    borderWidth: 1,
    borderColor: COLORS.hairGold,
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.goldLight,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
