import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import SegmentedControl from './SegmentedControl';
import { COLORS, RADII } from '../constants/theme';

type SwitchProps = {
  kind: 'switch';
  label: string;
  hint: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

type SegmentProps = {
  kind: 'segment';
  label: string;
  hint: string;
  value: string;
  options: { key: string; label: string }[];
  onChange: (next: string) => void;
};

type DangerProps = {
  kind: 'danger';
  label: string;
  hint: string;
  onPress: () => void;
  actionLabel: string;
};

type Props = SwitchProps | SegmentProps | DangerProps;

export default function SettingRow(props: Props) {
  return (
    <View style={[styles.row, props.kind === 'danger' ? styles.rowDanger : null]}>
      <View style={styles.texts}>
        <Text
          style={[styles.label, props.kind === 'danger' ? styles.labelDanger : null]}
          numberOfLines={1}>
          {props.label}
        </Text>
        <Text style={styles.hint} numberOfLines={2}>
          {props.hint}
        </Text>
      </View>

      {props.kind === 'switch' ? (
        <Switch
          value={props.value}
          onValueChange={props.onChange}
          accessibilityLabel={props.label}
          thumbColor={props.value ? COLORS.goldLight : '#6B6558'}
          trackColor={{ false: 'rgba(255,255,255,0.14)', true: 'rgba(212,175,55,0.45)' }}
        />
      ) : null}

      {props.kind === 'segment' ? (
        <View style={styles.segmentWrap}>
          <SegmentedControl
            options={props.options}
            value={props.value}
            onChange={props.onChange}
          />
        </View>
      ) : null}

      {props.kind === 'danger' ? (
        <Pressable
          onPress={props.onPress}
          accessibilityRole="button"
          accessibilityLabel={props.actionLabel}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.dangerBtn}>
          <Text style={styles.dangerText}>{props.actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceRaised,
    borderWidth: 1,
    borderColor: COLORS.hairLight,
  },
  rowDanger: {
    borderColor: 'rgba(198,43,71,0.5)',
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.textPrimary,
  },
  labelDanger: {
    color: COLORS.ruby,
  },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  segmentWrap: {
    width: 160,
  },
  dangerBtn: {
    width: 96,
    height: 48,
    borderRadius: RADII.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(198,43,71,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(198,43,71,0.55)',
  },
  dangerText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.ruby,
  },
});
