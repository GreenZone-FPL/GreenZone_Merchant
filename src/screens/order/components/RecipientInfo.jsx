import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DeliveryMethod, colors, GLOBAL_KEYS} from '../../../constants';
import {TitleText} from '../../../components';

const RecipientInfo = ({data}) => {
  const recipientLabel =
    data?.owner && Object.keys(data.owner).length > 0
      ? `${data.owner.firstName} ${data.owner.lastName} | ${data.owner.phoneNumber}`
      : 'Khách vãng lai';
  const deliveryLabel =
    DeliveryMethod[
      Object.keys(DeliveryMethod).find(
        key => DeliveryMethod[key].value === data?.deliveryMethod,
      )
    ]?.label || 'Không xác định';

  return (
    <View style={styles.container}>
      <TitleText text="Người nhận" style={{color: colors.black2}} />

      <Text style={styles.info}>{recipientLabel}</Text>
      <Text style={styles.info}>{deliveryLabel}</Text>
      <Text style={styles.info}>{data?.shippingAddress}</Text>
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
    color: colors.primary,
  },
  info: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
});

export default RecipientInfo;
