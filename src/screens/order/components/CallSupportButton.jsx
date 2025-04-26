// CallSupportButton.js
import React from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { colors, GLOBAL_KEYS } from '../../../constants';

export const CallSupportButton = ({ phoneNumber = '', label = 'Gọi hỗ trợ' }) => {
  const makePhoneCall = () => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err => {
      console.error('Không thể thực hiện cuộc gọi:', err);
    });
  };

  return (
    <Pressable style={styles.button} onPress={makePhoneCall}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>

  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green100,
    paddingVertical: 12,
    borderRadius: 16,
  },
  text: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default CallSupportButton;
