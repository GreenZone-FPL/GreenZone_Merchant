import React, {useRef} from 'react';
import {Animated, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, GLOBAL_KEYS} from '../../constants';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedButton = ({onPress, children, style}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => onPress && onPress());
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={1}
      style={[{transform: [{scale: scaleAnim}]}, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      {children}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
    flex: 1,
    marginHorizontal: GLOBAL_KEYS.PADDING_SMALL / 2,
  },
});
