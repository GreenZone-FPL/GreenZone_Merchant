import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants';
import { Row } from '../containers/Row';

export const ButtonGroup = ({ buttons, selectedIndex, onSelect }) => {
  return (
    <Row style={styles.buttonGroup}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            index === 0 && styles.firstButton,
            index === buttons.length - 1 && styles.lastButton,
            selectedIndex === index && styles.selectedButton,
          ]}
          onPress={() => onSelect(index)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedIndex === index && styles.selectedText,
            ]}
          >
            {button}
          </Text>
        </TouchableOpacity>
      ))}
    </Row>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.gray400,
    borderRadius: 10,
    overflow: 'hidden',
    gap: 0
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderColor: colors.gray400,
    alignItems: 'center',  // Căn chỉnh nội dung giữa
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
    borderWidth: 1,  // Đảm bảo độ dày viền không thay đổi
  },
  buttonText: {
    color: colors.black,
    fontWeight: '500',
  },
  selectedText: {
    color: colors.white,
    fontWeight: '500',  // Giữ font-weight giống button chưa chọn
  },
});
