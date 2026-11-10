import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ShardTrack from './ShardTrack';
import SecondaryButton from './SecondaryButton';
import { COLORS, RADII } from '../constants/theme';
import { CollectionSet } from '../game/collections';
import { symbolOf, SymbolKey } from '../game/symbols';
import { formatCoins } from '../utils/format';

type Props = {
  set: CollectionSet;
  owned: number;
  claimed: boolean;
  onClaim: (key: string) => void;
};

export default function CollectionSetCard({ set, owned, claimed, onClaim }: Props) {
  const def = symbolOf(set.key as SymbolKey);
  const complete = owned >= set.slots;
  return (
    <View style={[styles.card, { borderColor: set.accent + '66' }]}>
      <View style={styles.headRow}>
        <Text style={[styles.title, { color: set.accent }]} numberOfLines={1}>
          {set.title}
        </Text>
        {complete ? (
          <View style={[styles.ribbon, { backgroundColor: set.accent + '2A', borderColor: set.accent }]}>
            <Text style={[styles.ribbonText, { color: set.accent }]}>COMPLETE</Text>
          </View>
        ) : (
          <Text style={styles.count}>{owned + ' / ' + set.slots}</Text>
        )}
      </View>

      <ShardTrack owned={owned} total={set.slots} art={def.art} accent={set.accent} />

      <View style={styles.footRow}>
        <Text style={styles.bonus} numberOfLines={1}>
          {complete ? set.bonusLabel : 'SPIN TWO OF A KIND TO DROP A SHARD'}
        </Text>
      </View>

      {complete && !claimed ? (
        <SecondaryButton
          label={'CLAIM SET  ' + formatCoins(set.reward)}
          tone="gold"
          onPress={() => onClaim(set.key)}
        />
      ) : null}
      {complete && claimed ? (
        <Text style={styles.claimed}>{'CLAIMED · ' + set.bonusLabel + ' ACTIVE'}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: RADII.xl,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  count: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  ribbon: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  ribbonText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  footRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonus: {
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  claimed: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.green,
  },
});
