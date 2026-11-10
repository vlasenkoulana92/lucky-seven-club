import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { buttonRound, iconHome, iconPause } from '../assets';
import { COLORS } from '../constants/theme';

type Props = {
  title: string;
  onHome?: () => void;
  onPause?: () => void;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
};

function RoundButton({
  source,
  label,
  onPress,
}: {
  source: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.roundBtn}>
      <ImageBackground source={buttonRound} style={styles.roundPlate} resizeMode="contain">
        <Image source={source} style={styles.roundIcon} />
      </ImageBackground>
    </Pressable>
  );
}

/**
 * The single header used by every screen in the app. Slots differ per screen,
 * the styling never does.
 */
export default function AppHeader({ title, onHome, onPause, rightSlot, leftSlot }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {leftSlot ? leftSlot : null}
        {onHome ? <RoundButton source={iconHome} label="Back to menu" onPress={onHome} /> : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.sideRight]}>
        {rightSlot ? rightSlot : null}
        {onPause ? <RoundButton source={iconPause} label="Pause" onPress={onPause} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 44,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: COLORS.scrim,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairGold,
  },
  side: {
    width: 96,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: COLORS.textSecondary,
  },
  roundBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundPlate: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
