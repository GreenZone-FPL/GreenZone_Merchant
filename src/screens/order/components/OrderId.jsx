import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Icon} from 'react-native-paper';
import {colors, GLOBAL_KEYS} from '../../../constants';
import {NormalText} from '../../../components';

const OrderId = ({data}) => {
  return (
    <View style={styles.container}>
      <NormalText text="Mã đơn hàng" />
      <Pressable style={styles.pressable} onPress={() => {}}>
        <Text style={styles.orderIdText}>{data}</Text>
        <Icon source="content-copy" color={colors.teal900} size={18} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', marginBottom: 6},
  pressable: {flexDirection: 'row', alignItems: 'center', flex: 1},
  orderIdText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default OrderId;
