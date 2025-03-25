import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Column, NormalText} from '../../../components';
import {GLOBAL_KEYS, colors} from '../../../constants';

const ShipperInfo = ({shipper}) => {
  if (!shipper || Object.keys(shipper).length === 0) {
    return null
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../../assets/images/helmet.png')}
      />
      <Column style={{flex: 1}}>
        <NormalText text="Nhân viên giao hàng" style={{fontWeight: '500'}} />
        <Text style={styles.name}>
          {shipper.firstName
            ? `${shipper.firstName} ${shipper.lastName}`
            : 'Đang chuẩn bị ...'}
        </Text>
      </Column>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', gap: 16, margin: 16},
  image: {width: 40, height: 40},
  name: {fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.orange700},
});

export default ShipperInfo;
