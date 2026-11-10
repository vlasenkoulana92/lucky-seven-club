import { useRef } from 'react';
import { Animated } from 'react-native';
import { SPRING_BUTTON } from '../constants/config';

/**
 * Press feedback the way this stack needs it: the Pressable stays the PARENT
 * and drives an Animated.View that lives INSIDE it. Transform only, so the
 * native driver is safe.
 */
export function usePressScale(to: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      ...SPRING_BUTTON,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...SPRING_BUTTON,
    }).start();
  };

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
