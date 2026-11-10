import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { LineWin } from '../game/paylines';
import { COLORS } from '../constants/theme';

type Props = {
  lines: LineWin[];
  cell: number;
  frame: number;
  width: number;
  height: number;
};

/** Thin champagne strokes through the centres of the winning cells. */
export default function PaylineOverlay({ lines, cell, frame, width, height }: Props) {
  if (!lines || lines.length === 0) {
    return null;
  }
  const cx = (col: number) => frame + col * cell + cell / 2;
  const cy = (row: number) => frame + row * cell + cell / 2;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.wrap]}>
      <Svg width={width} height={height}>
        {lines.map(line => {
          const a = line.cells[0];
          const b = line.cells[line.cells.length - 1];
          return (
            <Line
              key={'pl-' + line.lineId}
              x1={cx(a.col)}
              y1={cy(a.row)}
              x2={cx(b.col)}
              y2={cy(b.row)}
              stroke={COLORS.goldLight}
              strokeWidth={3}
              strokeOpacity={0.9}
              strokeLinecap="round"
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
