import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { COLORS, RADII } from '../constants/theme';
import { SessionDef, goalLabel, lockLabel } from '../game/sessions';
import { usePressScale } from '../hooks/usePressScale';
import { formatCoins } from '../utils/format';

type Props = {
  session: SessionDef;
  locked: boolean;
  onStart: (key: string) => void;
};

export default function SessionCard({ session, locked, onStart }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.98);

  return (
    <Pressable
      onPress={locked ? undefined : () => onStart(session.key)}
      onPressIn={locked ? undefined : onPressIn}
      onPressOut={locked ? undefined : onPressOut}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={session.title}
      accessibilityState={{ disabled: locked }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.card, locked ? styles.cardLocked : null, { transform: [{ scale }] }]}>
        <View style={styles.headRow}>
          <Text style={styles.title} numberOfLines={1}>
            {session.title}
          </Text>
          <Text style={styles.spins}>{session.spins + ' SPINS'}</Text>
        </View>
        <Text style={styles.blurb} numberOfLines={1}>
          {session.blurb}
        </Text>
        <Text style={styles.goal} numberOfLines={1}>
          {goalLabel(session.goal)}
        </Text>
        <View style={styles.footRow}>
          <Text style={styles.reward} numberOfLines={1}>
            {'REWARD  ' + formatCoins(session.reward) + ' COINS · ' + session.shardReward + ' SHARD'}
          </Text>
          {locked ? (
            <View style={styles.lockRow}>
              <Lock size={14} color={COLORS.textMuted} strokeWidth={2.4} />
              <Text style={styles.lockText} numberOfLines={1}>
                {lockLabel(session)}
              </Text>
            </View>
          ) : (
            <Text style={styles.open}>OPEN</Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 124,
  },
  card: {
    width: '100%',
    height: 124,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairGold,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  cardLocked: {
    opacity: 0.55,
    borderColor: COLORS.hairLight,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: COLORS.goldLight,
  },
  spins: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
  },
  blurb: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  goal: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },
  footRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reward: {
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.gold,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lockText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  open: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: COLORS.green,
  },
});
