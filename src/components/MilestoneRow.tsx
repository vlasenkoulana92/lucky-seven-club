import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { COLORS, RADII } from '../constants/theme';
import { Milestone } from '../game/progression';
import { formatCoins } from '../utils/format';

type Props = {
  milestone: Milestone;
  progress: number;
  claimed: boolean;
  claimable: boolean;
  onClaim: (key: string) => void;
};

export default function MilestoneRow({
  milestone,
  progress,
  claimed,
  claimable,
  onClaim,
}: Props) {
  const done = progress >= milestone.target;
  return (
    <View style={[styles.row, claimed ? styles.rowClaimed : null]}>
      <View style={[styles.mark, done ? styles.markDone : styles.markOpen]}>
        {done ? <Check size={16} color={COLORS.green} strokeWidth={3} /> : null}
      </View>
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {milestone.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {Math.min(progress, milestone.target) +
            ' / ' +
            milestone.target +
            ' · PAYS ' +
            formatCoins(milestone.reward)}
        </Text>
      </View>
      {claimable ? (
        <Pressable
          onPress={() => onClaim(milestone.key)}
          accessibilityRole="button"
          accessibilityLabel={'Claim ' + milestone.title}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.claimBtn}>
          <Text style={styles.claimText}>CLAIM</Text>
        </Pressable>
      ) : null}
      {claimed ? <Text style={styles.claimedText}>CLAIMED</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairLight,
  },
  rowClaimed: {
    borderColor: 'rgba(111,207,151,0.45)',
  },
  mark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markOpen: {
    borderColor: COLORS.textMuted,
  },
  markDone: {
    borderColor: COLORS.green,
    backgroundColor: 'rgba(111,207,151,0.12)',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.textPrimary,
  },
  meta: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  claimBtn: {
    width: 84,
    height: 40,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212,175,55,0.2)',
    borderWidth: 1,
    borderColor: COLORS.hairGoldStrong,
  },
  claimText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.goldLight,
  },
  claimedText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.green,
  },
});
