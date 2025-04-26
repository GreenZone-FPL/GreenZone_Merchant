import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, GLOBAL_KEYS} from '../../../constants';
import {TitleText} from '../../../components';

const MerchantInfo = ({data}) => {
  return (
    <View style={styles.container}>
      <TitleText text="Cửa hàng" style={{color: colors.primary}} />
      <Text style={styles.name}>{data?.name}</Text>
      <Text style={styles.address}>{`${data?.address}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: colors.gray200,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginBottom: GLOBAL_KEYS.GAP_SMALL,
    gap: 8,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.orange700,
  },
  name: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  address: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
});

export default MerchantInfo;
