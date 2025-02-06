import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import {GLOBAL_KEYS} from '../../constants';

const ColumnPropTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export const Column = ({children, style}) => {
  return <View style={[styles.column, style]}>{children}</View>;
};

Column.propTypes = ColumnPropTypes;

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
});
