import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';
import { QuantityButton } from './QuantityButton';
import PropTypes from 'prop-types';


const QuantitySelectorPropTypes = {
  quantity: PropTypes.number.isRequired,
  iconColor: PropTypes.string,
  textColor: PropTypes.string,
  handlePlus: PropTypes.func,
  handleMinus: PropTypes.func,
}

export const QuantitySelector = ({
  quantity,
  iconColor = colors.primary,
  textColor = colors.black,
  handlePlus,
  handleMinus,
}) => {
  return (
    <View style={styles.row}>
      <QuantityButton
        iconName="minus"
        onPress={handleMinus}
        iconColor={iconColor}
      />
      <Text style={[styles.quantityText, { color: textColor }]}>{quantity}</Text>
      <QuantityButton
        iconName="plus"
        onPress={handlePlus}
        iconColor={iconColor}
      />
    </View>
  );
};


QuantitySelector.propTypes = QuantitySelectorPropTypes


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
  },
});


