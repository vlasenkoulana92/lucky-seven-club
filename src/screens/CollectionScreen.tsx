import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gem, Sparkles } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import ScreenBackground from '../components/ScreenBackground';
import SegmentedControl from '../components/SegmentedControl';
import CollectionSetCard from '../components/CollectionSetCard';
import LoungeSlotCard from '../components/LoungeSlotCard';
import SecondaryButton from '../components/SecondaryButton';
import EmptyState from '../components/EmptyState';
import CoinBadge from '../components/CoinBadge';
import { COLORS } from '../constants/theme';
import { COLLECTION_SETS, totalShards } from '../game/collections';
import { LOUNGE_DECOR, isOwned, missingCoins } from '../game/lounge';
import {
  useBalance,
  useClaimedSets,
  useDecor,
  useDispatch,
  useShards,
} from '../hooks/useGameState';

type Props = {
  onHome: () => void;
};

const PANELS = [
  { key: 'sets', label: 'COLLECTIONS' },
  { key: 'lounge', label: 'LOUNGE' },
];

export default function CollectionScreen({ onHome }: Props) {
  const [panel, setPanel] = useState('sets');
  const shards = useShards();
  const claimedSets = useClaimedSets();
  const decor = useDecor();
  const balance = useBalance();
  const dispatch = useDispatch();

  const anyShards = totalShards(shards) > 0;

  return (
    <ScreenBackground overlay="default" blobTop={180}>
      <AppHeader title="COLLECTION" onHome={onHome} rightSlot={<CoinBadge value={balance} />} />

      <View style={styles.tabs}>
        <SegmentedControl options={PANELS} value={panel} onChange={setPanel} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {panel === 'sets' ? (
          anyShards ? (
            COLLECTION_SETS.map(set => (
              <CollectionSetCard
                key={set.key}
                set={set}
                owned={shards[set.key] || 0}
                claimed={claimedSets.indexOf(set.key) >= 0}
                onClaim={key => dispatch({ type: 'CLAIM_SET', key })}
              />
            ))
          ) : (
            <EmptyState
              title="NOTHING UNLOCKED YET"
              hint="SPIN TO FIND SHARDS — TWO OF A KIND DROPS ONE"
              Icon={Gem}
            />
          )
        ) : null}

        {panel === 'lounge' ? (
          <View>
            <Text style={styles.leadText}>
              COMFORT RAISES THE DAILY BANKROLL AND THE SHARD CHANCE
            </Text>
            {decor.length === 0 ? (
              <EmptyState
                title="THE LOUNGE IS BARE"
                hint="WIN COINS TO FURNISH IT — THE FIRST PIECE IS 250"
                Icon={Sparkles}
              />
            ) : null}
            <View style={styles.grid}>
              {LOUNGE_DECOR.map(d => (
                <View key={d.key} style={styles.gridSlot}>
                  <LoungeSlotCard
                    decor={d}
                    owned={isOwned(decor, d.key)}
                    affordable={balance >= d.price}
                    missing={missingCoins(balance, d.key)}
                    onPlace={key => dispatch({ type: 'BUY_DECOR', key })}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <SecondaryButton label="MENU" onPress={onHome} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  tabs: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 12,
  },
  leadText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.1,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridSlot: {
    width: '47%',
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: 18,
    paddingBottom: 22,
    paddingTop: 10,
  },
});
