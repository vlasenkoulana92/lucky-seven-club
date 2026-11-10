import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Award } from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import ScreenBackground from '../components/ScreenBackground';
import StatTile, { StatTileRow } from '../components/StatTile';
import MilestoneRow from '../components/MilestoneRow';
import SecondaryButton from '../components/SecondaryButton';
import EmptyState from '../components/EmptyState';
import CoinBadge from '../components/CoinBadge';
import { COLORS, GRADIENTS, RADII } from '../constants/theme';
import { XP_PER_LEVEL } from '../constants/config';
import {
  MILESTONES,
  isMilestoneComplete,
  levelProgress,
  nextUnlockLabel,
  xpInLevel,
} from '../game/progression';
import { barWidth, formatCoins } from '../utils/format';
import {
  useBalance,
  useComfort,
  useDaily,
  useDispatch,
  useLevel,
  useLifetime,
  useMetrics,
  useMilestonesClaimed,
  useXp,
} from '../hooks/useGameState';

type Props = {
  onHome: () => void;
};

export default function ProgressScreen({ onHome }: Props) {
  const level = useLevel();
  const xp = useXp();
  const balance = useBalance();
  const comfort = useComfort();
  const metrics = useMetrics();
  const lifetime = useLifetime();
  const daily = useDaily();
  const claimed = useMilestonesClaimed();
  const dispatch = useDispatch();

  const nothingLogged = lifetime.totalSpins === 0;

  return (
    <ScreenBackground overlay="default" blobTop={180}>
      <AppHeader title="PROGRESS" onHome={onHome} rightSlot={<CoinBadge value={balance} />} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.levelCard}>
          <Text style={styles.levelLabel}>CLUB LEVEL</Text>
          <Text style={styles.levelValue}>{String(level)}</Text>
          <View style={styles.track}>
            <View style={barWidth(levelProgress(xp))}>
              <LinearGradient
                colors={GRADIENTS.xp as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </View>
          </View>
          <Text style={styles.xpText}>
            {formatCoins(xpInLevel(xp)) + ' / ' + formatCoins(XP_PER_LEVEL) + ' XP'}
          </Text>
          <Text style={styles.unlock}>{nextUnlockLabel(level)}</Text>
        </View>

        {nothingLogged ? (
          <EmptyState
            title="NO NIGHTS LOGGED YET"
            hint="PLAY A ROUND TO START YOUR RECORD"
            Icon={Award}
          />
        ) : (
          <View style={styles.tileBlock}>
            <StatTileRow>
              <StatTile
                value={String(lifetime.totalSpins)}
                label="TOTAL SPINS"
                accent={COLORS.goldLight}
              />
              <StatTile
                value={formatCoins(lifetime.bestLineWin)}
                label="BEST LINE"
                accent={COLORS.green}
              />
              <StatTile
                value={String(lifetime.sevensLanded)}
                label="SEVENS"
                accent={COLORS.ruby}
              />
            </StatTileRow>
            <StatTileRow>
              <StatTile
                value={String(metrics.setsCompleted)}
                label="SETS DONE"
                accent="#8FB8C9"
              />
              <StatTile value={String(daily.streak)} label="DAILY STREAK" accent="#C08A4A" />
              <StatTile value={String(comfort)} label="COMFORT" accent={COLORS.gold} />
            </StatTileRow>
          </View>
        )}

        <Text style={styles.sectionTitle}>MILESTONES</Text>
        <View style={styles.milestones}>
          {MILESTONES.map(m => {
            const done = isMilestoneComplete(m, metrics);
            const isClaimed = claimed.indexOf(m.key) >= 0;
            return (
              <MilestoneRow
                key={m.key}
                milestone={m}
                progress={(metrics as any)[m.metric] || 0}
                claimed={isClaimed}
                claimable={done && !isClaimed}
                onClaim={key => dispatch({ type: 'CLAIM_MILESTONE', key })}
              />
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <SecondaryButton label="MENU" onPress={onHome} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    gap: 16,
  },
  levelCard: {
    borderRadius: RADII.xl,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairGold,
    padding: 18,
    gap: 8,
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.textSecondary,
  },
  levelValue: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    color: COLORS.goldLight,
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  fill: {
    flex: 1,
  },
  xpText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },
  unlock: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.gold,
    textAlign: 'center',
  },
  tileBlock: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: COLORS.textSecondary,
  },
  milestones: {
    gap: 10,
  },
  footer: {
    paddingHorizontal: 18,
    paddingBottom: 22,
    paddingTop: 10,
  },
});
