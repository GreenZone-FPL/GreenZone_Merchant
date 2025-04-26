import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Icon} from 'react-native-paper';
import {colors, GLOBAL_KEYS} from '../../../constants';
import Clipboard from '@react-native-clipboard/clipboard';
import {Toaster} from '../../../utils';

const OrderId = ({_id}) => {
  const handleCopy = () => {
    Clipboard.setString(_id);
    Toaster.show('Đã sao chép mã đơn hàng!');
  };

  return (
    <View style={[styles.row, {marginBottom: 6}]}>
      <Text style={styles.normalText}>Mã đơn hàng</Text>
      <Pressable style={styles.row} onPress={handleCopy}>
        <Text style={[styles.normalText, {fontWeight: 'bold', marginRight: 8}]}>
          {_id}
        </Text>
        <Icon source="content-copy" color={colors.teal900} size={18} />
      </Pressable>
    </View>
  );
};

export default OrderId;

const styles = StyleSheet.create({
  normalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
