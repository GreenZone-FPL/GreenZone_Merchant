import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Column, NormalText, Row} from '../../../components';
import {GLOBAL_KEYS, colors} from '../../../constants';

const ShipperInfo = ({shipper}) => {
  console.log('shipper', shipper)
  if (!shipper || Object.keys(shipper).length === 0) {
    return null
  }
  return (
    <Row style={styles.container}>
      <Image
        style={styles.image}
        source={{uri: shipper.avatar}}
      />
      <Column style={{flex: 1}}>
        <NormalText text="Nhân viên giao hàng" style={{fontWeight: '500'}} />
        <Text style={styles.name}>
          {shipper.firstName
            ? `${shipper.firstName} ${shipper.lastName}`
            : 'Đang chuẩn bị ...'}
        </Text>
      </Column>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', gap: 16, margin: 16},
  image: {width: 60, height: 60, borderRadius: 30},
  name: {fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.orange700},
});

export default ShipperInfo;
