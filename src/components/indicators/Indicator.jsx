import PropTypes from 'prop-types';
import {ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, GLOBAL_KEYS} from '../../constants';

export const Indicator = props => {
  Indicator.propTypes = {
    size: PropTypes.number.isRequired,
    color: PropTypes.string,
  };

  const {size, color} = props;
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
});
