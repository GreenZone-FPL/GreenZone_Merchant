import React from 'react';
import PropTypes from 'prop-types';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../constants';
import {Row} from '../containers/Row';

const ButtonGroupPropTypes = {
  buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  containerColor: PropTypes.string,
  selectedButtonColor: PropTypes.string,
  textColor: PropTypes.string,
  selectedTextColor: PropTypes.string,
  containerStyle: PropTypes.object,
};
export const ButtonGroup = ({
  buttons,
  selectedIndex,
  onSelect,
  containerColor = colors.white,
  selectedButtonColor = colors.primary,
  textColor = colors.black,
  selectedTextColor = colors.white,
  containerStyle,
}) => {
  return (
    <Row
      style={[
        styles.buttonGroup,
        containerStyle,
        {backgroundColor: containerColor},
      ]}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            index === 0 && styles.firstButton,
            index === buttons.length - 1 && styles.lastButton,
            selectedIndex === index && {
              ...styles.selectedButton,
              backgroundColor: selectedButtonColor,
              borderColor: selectedButtonColor,
            },
          ]}
          onPress={() => onSelect(index)}>
          <Text
            style={[
              styles.buttonText,
              {color: textColor},
              selectedIndex === index && {color: selectedTextColor},
            ]}>
            {button}
          </Text>
        </TouchableOpacity>
      ))}
    </Row>
  );
};

ButtonGroup.propTypes = ButtonGroupPropTypes;

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.gray400,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-start', // Giúp wrap-content
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderColor: colors.gray400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  lastButton: {
    borderRightWidth: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  buttonText: {
    color: colors.black,
    fontWeight: '500',
  },
  selectedText: {
    color: colors.white,
    fontWeight: '500',
  },
});
