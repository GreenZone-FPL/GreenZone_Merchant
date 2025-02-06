import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React from 'react';
import { GLOBAL_KEYS, colors } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const PaymentMethodRow = ({
  onChange,
  enableChange = true,
  leftText = "Phương thức thanh toán",
  rightText = "Momo",
  imageSource = require('../../assets/images/logo_momo.png'),
  textStyle = {},
  imageStyle = {},
}) => {
  return (
    <View style={styles.row}>
      <Text style={[styles.normalText, textStyle]}>{leftText}</Text>
      <Pressable style={styles.row} onPress={onChange}>
        <Image
          source={imageSource}
          style={[styles.image, imageStyle]}
        />
        <Text style={[styles.normalText, textStyle]}>{rightText}</Text>
        {enableChange && <AntDesign name="down" color={colors.primary} size={14} />}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  normalText: {
    textAlign: 'justify',
    lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
});