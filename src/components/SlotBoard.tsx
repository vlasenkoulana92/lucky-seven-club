import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReelColumn from './ReelColumn';
import PaylineOverlay from './PaylineOverlay';
import { BOARD_FRAME, CELL, CELL_COMPACT } from '../constants/config';
import { COLORS, GRADIENTS, RADII } from '../constants/theme';
import { LineWin } from '../game/paylines';
import { SymbolKey } from '../game/symbols';

type Props = {
  columns: SymbolKey[][];
  offsets: Animated.Value[];
  winningCells: Record<string, boolean>;
  wins: LineWin[];
  spinning: boolean;
  compact?: boolean;
  heat?: boolean;
  showPaylines?: boolean;
};

/**
 * The brass cabinet. Geometry accounts for the frame on both sides, so the
 * cells never stick out: BOARD_W = CELL * 3 + 2 * BOARD_FRAME.
 */
export default function SlotBoard({
  columns,
  offsets,
  winningCells,
  wins,
  spinning,
  compact = false,
  heat = false,
  showPaylines = true,
}: Props) {
  const cell = compact ? CELL_COMPACT : CELL;
  const boardW = cell * 3 + 2 * BOARD_FRAME;
  const boardH = cell * 3 + 2 * BOARD_FRAME;

  return (
    <View style={[styles.outer, { width: boardW, height: boardH }]}>
      <LinearGradient
        colors={GRADIENTS.board as unknown as string[]}
        style={[
          styles.frame,
          { width: boardW, height: boardH, padding: BOARD_FRAME },
          heat ? styles.frameHeat : null,
        ]}>
        <View style={styles.inner}>
          {columns.map((col, i) => (
            <ReelColumn
              key={'reel-' + i}
              col={i}
              symbols={col}
              offset={offsets[i]}
              cell={cell}
              winningCells={winningCells}
              spinning={spinning}
            />
          ))}
        </View>
      </LinearGradient>
      {showPaylines && !spinning ? (
        <PaylineOverlay
          lines={wins}
          cell={cell}
          frame={BOARD_FRAME}
          width={boardW}
          height={boardH}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  frame: {
    borderRadius: RADII.xl,
    borderWidth: 2,
    borderColor: COLORS.gold,
    overflow: 'hidden',
  },
  frameHeat: {
    borderColor: COLORS.ruby,
  },
  inner: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
