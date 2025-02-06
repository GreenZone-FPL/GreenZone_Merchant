import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import {IconWithBadge} from './IconWithBadge';
import { GLOBAL_KEYS, colors } from '../../constants';
import PropTypes from 'prop-types'


const HeaderWithBadgePropTypes = {
  title: PropTypes.string,
  onBadgePress: PropTypes.func,
  isHome: PropTypes.bool,
};

export const  HeaderWithBadge = (props) => {
  const { title, onBadgePress, isHome } = props;
  return (
    <View style={styles.header}>


      { // Kiểm tra xem có phải trang Home hay không
        // 1. Nếu là trang Home thì đổi Header Chào user
        // 2. Nếu không phải Home thì chỉ hiển thị Header Title
        isHome ? (
          <View style={styles.left}>
            <Image
              source={require('../../assets/images/ic_coffee_cup.png')}
              style={styles.image}
            />
            <Text style={[styles.title, {fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE}]}>Chào bạn mới</Text>
            <Icon source='hand-wave' color={colors.yellow700} size={GLOBAL_KEYS.ICON_SIZE_SMALL} />
          </View>

        ) : (
          <View style={styles.left}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}


      <TouchableOpacity style={styles.right}>
        <IconWithBadge onPress={onBadgePress} />
      </TouchableOpacity>
    </View>
  );
};

HeaderWithBadge.propTypes = HeaderWithBadgePropTypes


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,

  },
  left: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },

  image: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
  },

});


