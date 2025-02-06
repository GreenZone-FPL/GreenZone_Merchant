import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {RadioButton} from './RadioButton';
import { GLOBAL_KEYS, colors } from '../../constants';
import PropTypes from 'prop-types';


const RadioGroupPropTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onValueChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  required: PropTypes.bool,
  note: PropTypes.string,
};

export const RadioGroup = ({
  items,
  selectedValue,
  onValueChange,
  title,
  required = false,
  note
}) => {
  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      {title && (
        <Text style={styles.title}>
          {title}
          {required && <Text style={styles.redText}>*</Text>}
          {note && <Text style={styles.note}> ({note})</Text>}
        </Text>
      )}

      {/* Danh sách Radio Buttons */}
      {items.map((item) => {
        const { id, name, price } = item;

        return (
          <RadioButton
            key={id}
            label={name}
            selected={selectedValue === id}
            onPress={() => onValueChange(id)}
            price={price}
          />
        );
      })}
    </View>
  );
};

RadioGroup.propTypes = RadioGroupPropTypes



const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
    marginBottom: GLOBAL_KEYS.PADDING_SMALL,
  },
  redText: {
    color: colors.red800,
  },
  note: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '400',
  }
});






