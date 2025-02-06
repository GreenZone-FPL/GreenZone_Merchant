import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';

const TitleTextPropTypes = {
  text: PropTypes.string,
  color: PropTypes.string, 
  style: PropTypes.object,
};

export const TitleText = ({
  text = 'Title text',
  color = colors.black, 
  style,
}) => {
  return (
    <View>
      <Text style={[styles.text, { color }, style]} >{text}</Text>
    </View>
  );
};

TitleText.propTypes = TitleTextPropTypes;

const styles = StyleSheet.create({
  text: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '500',
  },
});
