import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { COLORS, RADII } from '../constants/theme';
import { DailyModifier, streakBonus } from '../game/daily';
import { formatCoins, formatPercent } from '../utils/format';

type Props = {
  modifier: DailyModifier;
  bankroll: number;
  reward: number;
  streak: number;
  state: 'available' | 'played' | 'running';
  countdown?: string;
  lastReward?: number;
};

export default function DailyModifierCard({
  modifier,
  bankroll,
  reward,
  streak,
  state,
  countdown,
  lastReward,
}: Props) {
  const dim = state === 'played';
  return (
    <View style={[styles.card, { borderColor: modifier.accent + '66' }, dim ? styles.dim : null]}>
      <View style={styles.headRow}>
        <Text style={[styles.title, { color: modifier.accent }]} numberOfLines={1}>
          {modifier.title}
        </Text>
        <View style={styles.streakRow}>
          <Flame size={16} color={COLORS.ruby} strokeWidth={2.4} />
          <Text style={styles.streakText}>
            {'STREAK ' + streak + ' · +' + formatPercent(streakBonus(streak))}
          </Text>
        </View>
      </View>

      <Text style={styles.rule} numberOfLines={2}>
        {modifier.rule}
      </Text>

      <View style={styles.divider} />

      {state === 'played' ? (
        <View style={styles.block}>
          <Text style={styles.closed}>TONIGHT&apos;S RUN IS CLOSED</Text>
          <Text style={styles.meta}>
            {'IT PAID ' + formatCoins(lastReward || 0) + ' COINS'}
          </Text>
          <Text style={styles.meta}>{'NEXT RUN IN ' + (countdown || '00H 00M')}</Text>
        </View>
      ) : (
        <View style={styles.block}>
          <Text style={styles.meta}>{'RUN STAKE BUDGET  ' + formatCoins(bankroll) + ' COINS'}</Text>
          <Text style={styles.meta}>{'REWARD ON CLEAR  ' + formatCoins(reward) + ' COINS'}</Text>
          <Text style={styles.metaMuted}>ONE RUN PER CALENDAR DAY</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 170,
    borderRadius: RADII.xl,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  dim: {
    opacity: 0.68,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },
  rule: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.hairLight,
  },
  block: {
    gap: 4,
  },
  closed: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.goldLight,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textSecondary,
  },
  metaMuted: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
});
