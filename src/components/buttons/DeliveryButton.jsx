import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GLOBAL_KEYS, colors} from '../../constants';
import { Row } from '../containers/Row';

const {width} = Dimensions.get('window');
export const DeliveryButton = ({title, address, onPress, style, onPressCart}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: GLOBAL_KEYS.GAP_SMALL,
        }}>
        <Image
          source={require('../../assets/images/ic_delivery.png')}
          style={styles.icon}
        />
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <Row style={{flex: 1, }}>
      <Text numberOfLines={1} style={styles.address}>
        {address}
      </Text>
      <TouchableOpacity style={styles.btnCart} onPress={onPressCart}>
        <Text style={styles.quantity}>1</Text>
        <Text style={styles.textOrder}>Đơn hàng</Text>
      </TouchableOpacity>
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.green100,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: width - GLOBAL_KEYS.PADDING_DEFAULT * 2,
    flex: 1,
  },

  icon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },

  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    fontWeight: 'bold',
  },
  address: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    width: width/1.8
  },
  btnCart:{
    flexDirection: 'row',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.primary,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL
  },
  quantity:{
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    color: colors.primary,
    fontWeight: '700',
  },
  textOrder:{
    fontWeight: '700',
    color: colors.white,
  }

});
