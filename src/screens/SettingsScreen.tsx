import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import ScreenBackground from '../components/ScreenBackground';
import SettingRow from '../components/SettingRow';
import SecondaryButton from '../components/SecondaryButton';
import CoinBadge from '../components/CoinBadge';
import Disclaimer18 from '../components/Disclaimer18';
import { COLORS, RADII } from '../constants/theme';
import { useBalance, useDispatch, useResetProgress, useSettings } from '../hooks/useGameState';

type Props = {
  onHome: () => void;
};

const SPEED_OPTIONS = [
  { key: 'classic', label: 'CLASSIC' },
  { key: 'turbo', label: 'TURBO' },
];

export default function SettingsScreen({ onHome }: Props) {
  const settings = useSettings();
  const balance = useBalance();
  const dispatch = useDispatch();
  const resetProgress = useResetProgress();
  const [confirming, setConfirming] = useState(false);

  const set = (key: 'turbo' | 'reduceMotion' | 'highContrast' | 'paylineOverlay', value: boolean) =>
    dispatch({ type: 'SET_SETTING', key, value });

  return (
    <ScreenBackground overlay="default" blobTop={180}>
      <AppHeader title="SETTINGS" onHome={onHome} rightSlot={<CoinBadge value={balance} />} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <SettingRow
          kind="segment"
          label="REEL SPEED"
          hint="Classic runs the reels for 2.4s, Turbo for 1.2s"
          value={settings.turbo ? 'turbo' : 'classic'}
          options={SPEED_OPTIONS}
          onChange={next => set('turbo', next === 'turbo')}
        />
        <SettingRow
          kind="switch"
          label="REDUCE MOTION"
          hint="Stops idle loops and shortens every transition"
          value={settings.reduceMotion}
          onChange={v => set('reduceMotion', v)}
        />
        <SettingRow
          kind="switch"
          label="HIGH CONTRAST TEXT"
          hint="Brighter body text and stronger surface borders"
          value={settings.highContrast}
          onChange={v => set('highContrast', v)}
        />
        <SettingRow
          kind="switch"
          label="PAYLINE OVERLAY"
          hint="Draws the winning lines across the board"
          value={settings.paylineOverlay}
          onChange={v => set('paylineOverlay', v)}
        />
        <SettingRow
          kind="danger"
          label="RESET CLUB PROGRESS"
          hint="Clears the save and restores the 1,000 starting coins"
          actionLabel="RESET"
          onPress={() => setConfirming(true)}
        />

        {confirming ? (
          <View style={styles.confirm}>
            <Text style={styles.confirmTitle}>CLEAR THE WHOLE CLUB RECORD?</Text>
            <Text style={styles.confirmNote}>
              SHARDS, DECOR, MILESTONES AND THE DAILY STREAK ARE LOST
            </Text>
            <SecondaryButton
              label="RESET"
              tone="danger"
              onPress={() => {
                resetProgress();
                setConfirming(false);
                onHome();
              }}
            />
            <SecondaryButton label="CANCEL" onPress={() => setConfirming(false)} />
          </View>
        ) : null}

        <View style={styles.legal}>
          <Text style={styles.legalLine}>OFFLINE · NO ADS · NO PURCHASES</Text>
          <Disclaimer18 variant="long" />
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
    gap: 12,
  },
  confirm: {
    borderRadius: RADII.xl,
    backgroundColor: 'rgba(198,43,71,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(198,43,71,0.5)',
    padding: 18,
    gap: 10,
  },
  confirmTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  confirmNote: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  legal: {
    marginTop: 8,
    gap: 6,
  },
  legalLine: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 18,
    paddingBottom: 22,
    paddingTop: 10,
  },
});
