import React from 'react';
import { StatusBar } from 'react-native';
import { colors } from '../../constants';

export const OverlayStatusBar = () => (
  <StatusBar
    animated={true}
    backgroundColor={colors.overlay}
    hidden={false}
    barStyle="dark-content"
  />
);


