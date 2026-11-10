import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import ReelCell from './ReelCell';
import { SymbolKey } from '../game/symbols';

type Props = {
  /** [result0, result1, result2, ...fillers] - the first three are what lands */
  symbols: SymbolKey[];
  offset: Animated.Value;
  cell: number;
  col: number;
  winningCells: Record<string, boolean>;
  spinning: boolean;
};

/**
 * One vertical strip. The window is masked to three rows; translateY runs from
 * -(fillers * cell) up to 0, so the symbols visibly travel downwards and the
 * result row lands last. Transform only - native driver safe.
 */
function ReelColumn({ symbols, offset, cell, col, winningCells, spinning }: Props) {
  return (
    <View style={[styles.window, { width: cell, height: cell * 3 }]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.strip, { transform: [{ translateY: offset }] }]}>
        {symbols.map((sym, i) => (
          <ReelCell
            key={col + '-' + i}
            symbol={sym}
            size={cell}
            index={i + col}
            highlighted={!spinning && i < 3 && !!winningCells[col + ':' + i]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    overflow: 'hidden',
  },
  strip: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default React.memo(ReelColumn);
