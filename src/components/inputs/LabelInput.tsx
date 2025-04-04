// @ts-ignore
import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import {colors, GLOBAL_KEYS} from '../../constants';

interface LabelInputProps {
  label: string;
  required?: boolean;
  style?: TextStyle;
}

const LabelInput: React.FC<LabelInputProps> = ({label, required = false, style}) => {
  return (
    <Text style={[styles.label, style]}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '400',
  },
  required: {
    color: colors.red900,
  },
});

export default LabelInput;
