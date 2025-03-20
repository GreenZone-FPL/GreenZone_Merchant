import React from 'react';
import PropTypes from 'prop-types';
import {Text, StyleSheet} from 'react-native';
import {colors, GLOBAL_KEYS} from '../../constants';
import {Row} from '../containers/Row';
import {AnimatedButton} from './AnimatedButton';

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
        <AnimatedButton
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
        </AnimatedButton>
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
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderColor: colors.gray400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstButton: {
    borderTopLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderBottomLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  lastButton: {
    borderTopRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderBottomRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderRightWidth: 0,
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.black,
    fontWeight: '500',
  },
});

ButtonGroup.propTypes = ButtonGroupPropTypes;

export default ButtonGroup;
