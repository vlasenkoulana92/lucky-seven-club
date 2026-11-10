import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SymbolKey, symbolOf } from '../game/symbols';
import { COLORS } from '../constants/theme';

type Props = {
  symbol: SymbolKey;
  size: number;
  index: number;
  highlighted?: boolean;
};

/**
 * Plain Image with resizeMode contain - aspect always preserved, never a
 * circular overflow:hidden mask around a transparent sprite.
 */
function ReelCell({ symbol, size, index, highlighted = false }: Props) {
  const def = symbolOf(symbol);
  const art = size - 26 > 24 ? size - 26 : 24;
  return (
    <View
      style={[
        styles.cell,
        { width: size, height: size },
        index % 2 === 0 ? styles.feltA : styles.feltB,
        highlighted ? styles.hit : null,
      ]}>
      <Image source={def.art} style={{ width: art, height: art, resizeMode: 'contain' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.14)',
  },
  feltA: {
    backgroundColor: '#1A1711',
  },
  feltB: {
    backgroundColor: '#171410',
  },
  hit: {
    borderWidth: 2,
    borderColor: COLORS.goldLight,
    backgroundColor: 'rgba(212,175,55,0.14)',
  },
});

export default React.memo(ReelCell);
