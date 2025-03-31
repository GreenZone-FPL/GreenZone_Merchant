import React from 'react';
import {StyleSheet, View} from 'react-native';
import {OrderStatus, colors} from '../../constants';
import {NormalText} from './NormalText';

export const StatusText = ({status}) => {
  const getStatusStyle = () => {
    switch (status) {
      case OrderStatus.AWAITING_PAYMENT.value:
      case OrderStatus.PENDING_CONFIRMATION.value:
        return {color: colors.orange700, backgroundColor: colors.milk200};
      case OrderStatus.COMPLETED.value:
        return {color: colors.primary, backgroundColor: colors.green100};
      case OrderStatus.CANCELLED.value:
      case OrderStatus.FAILED_DELIVERY.value:
        return {color: colors.red900, backgroundColor: colors.lightRed};
      case OrderStatus.PROCESSING.value:
      case OrderStatus.READY_FOR_PICKUP.value:
        return {color: colors.blue600, backgroundColor: colors.lightBlue};
      default:
        return {color: colors.gray600, backgroundColor: colors.gray200};
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <View
      style={[
        styles.statusContainer,
        {backgroundColor: statusStyle.backgroundColor},
      ]}>
      <NormalText
        style={{color: statusStyle.color, fontWeight: '600'}}
        text={OrderStatus.getLabelByValue(status)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
});
