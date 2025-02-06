import {View, Text, Dimensions, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import CountDown from 'react-native-countdown-component';
import {GLOBAL_KEYS, colors} from '../../constants';
import {TextFormatter} from '../../utils';
import {Column} from '../containers/Column';
import {Row} from '../containers/Row';

const width = Dimensions.get('window').width;

export const SaleCountdown = props => {
  const {startDate, endDate, currentDate} = props;

  const timeCountdown =
    currentDate < endDate ? (endDate - startDate) / 1000 : 0;

  return (
    <View>
      <CountDown
        size={GLOBAL_KEYS.TEXT_SIZE_DEFAULT}
        until={timeCountdown}
        digitStyle={{
          gap: GLOBAL_KEYS.GAP_SMALL,
        }}
        digitTxtStyle={{color: colors.primary}}
        separatorStyle={{color: colors.primary}}
        timeToShow={['H', 'M', 'S']}
        timeLabels={{m: null, s: null}}
        showSeparator
      />
    </View>
  );
};

export const SaleDiscount = props => {
  const {showSale, percentDiscount} = props;

  return (
    <View>
      {showSale ? (
        <View style={styles.itemDiscount}>
          <Text style={styles.discountText}>- {percentDiscount}%</Text>
        </View>
      ) : (
        <Text />
      )}
    </View>
  );
};
export const SalePrice = props => {
  const {showSale, price, discount} = props;

  return (
    <View style={{marginHorizontal: GLOBAL_KEYS.PADDING_SMALL}}>
      {showSale ? (
        <Row>
          <Text style={styles.itemPrice}>
            {TextFormatter.formatCurrency(price - discount)}
          </Text>
          <Text style={styles.itemOldPrice}>
            {TextFormatter.formatCurrency(price)}
          </Text>
        </Row>
      ) : (
        <Text style={styles.itemPrice}>
          {TextFormatter.formatCurrency(price)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemDiscount: {
    backgroundColor: colors.red800,
    width: '50%',
    alignSelf: 'flex-end',
    borderTopRightRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderBottomLeftRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    fontWeight: 'bold',
    padding: 1,
  },
  discountText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
  },
  itemPrice: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: 'bold',
  },
  itemOldPrice: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    color: colors.gray700,
    fontWeight: 'bold',
    textDecorationLine: 'line-through',
  },
});
