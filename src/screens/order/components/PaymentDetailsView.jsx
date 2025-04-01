import React from 'react';
import {Image, Text, View} from 'react-native';
import {StatusText} from '../../../components';
import {DualTextRow, Row} from '../../../components';
import {GLOBAL_KEYS, colors} from '../../../constants';
import OrderId from './OrderId';
import {TextFormatter} from '../../../utils';

const PaymentDetailsView = ({
  detail,
  _id,
  shippingFee,
  voucher,
  paymentMethod,
  orderItems,
  totalPrice,
  status,
  createdAt,
}) => {
  console.log('detail', JSON.stringify(detail, null, 2));
  // Tính tổng tiền sản phẩm (chưa bao gồm phí giao hàng và giảm giá)
  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Số tiền giảm giá từ voucher (nếu có)
  const discount = voucher
    ? voucher.discountType === 'percentage'
      ? (subTotal * voucher.discountValue) / 100
      : voucher.discountValue
    : 0;

  // Chọn icon phù hợp với phương thức thanh toán
  const getPaymentIcon = method => {
    switch (method) {
      case 'cod':
        return (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../../assets/images/logo_vnd.png')}
          />
        );
      case 'payOs':
        return (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../../assets/images/logo_payos.png')}
          />
        );
      case 'zalopay':
        return (
          <Image
            style={{width: 24, height: 24}}
            source={require('../../../assets/images/logo_zalopay.png')}
          />
        );
      default:
        return null;
    }
  };

  // Xác định trạng thái thanh toán
  const getPaymentStatus = () => {
    if (status === 'completed') {
      return {text: 'Đã thanh toán', color: colors.primary};
    }
    if (paymentMethod === 'cod') {
      return {text: 'Chưa thanh toán', color: colors.orange700};
    }
    if (status === 'awaitingPayment') {
      return {text: 'Chờ thanh toán', color: colors.pink500};
    }
    if (status === 'cancelled') {
      return {text: 'Chưa thanh toán', color: colors.orange700};
    }
    return {text: 'Đã thanh toán', color: colors.primary};
  };

  const paymentStatus = getPaymentStatus();

  const calculateTotalOrderPrice = orderItems => {
    if (!Array.isArray(orderItems)) return 0;

    return orderItems.reduce((total, item) => {
      const productTotal = item.price * item.quantity;

      const toppingTotal =
        item.toppingItems?.reduce((sum, topping) => {
          if (topping?.price && topping?.quantity) {
            return sum + topping.price * topping.quantity;
          }
          return sum;
        }, 0) || 0;

      return total + productTotal + toppingTotal;
    }, 0);
  };
  return (
    <View
      style={{
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.white,
      }}>
      <DualTextRow
        leftText="Chi tiết thanh toán"
        leftTextStyle={{
          color: colors.primary,
          fontWeight: 'bold',
          fontSize: 20,
          marginBottom: 8,
        }}
      />
      <OrderId data={_id} />

      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
            color: colors.black,
            marginRight: 8,
          }}>
          Trạng thái đơn hàng
        </Text>
        <StatusText status={status} />
      </Row>

      {/* <DualTextRow
        leftText={`Tạm tính (${orderItems.length} sản phẩm)`}
        // rightText={`${subTotal.toLocaleString()}đ`}

        rightText={
          calculateTotalOrderPrice(detail.orderItems).toLocaleString('vi-VN') ||
          0
        }
      /> */}

      <DualTextRow
        leftText="Phí giao hàng"
        rightText={`${
          detail.deliveryMethod === 'delivery'
            ? shippingFee.toLocaleString('vi-VN')
            : 0
        }đ`}
      />

      <DualTextRow
        leftText="Giảm giá"
        rightText={`-${(discount || 0).toLocaleString('vi-VN')}đ`}
        rightTextStyle={{color: colors.primary}}
      />

      <DualTextRow
        leftText="Trạng thái thanh toán"
        rightText={paymentStatus.text}
        rightTextStyle={{color: paymentStatus.color}}
      />

      <DualTextRow
        leftText="Thời gian đặt hàng"
        rightText={new Date(createdAt).toLocaleString('vi-VN')}
      />

      {/* Kiểm tra và hiển thị nếu có thời gian pendingConfirmationAt */}
      {detail?.pendingConfirmationAt && (
        <DualTextRow
          leftText="Thời gian chờ xác nhận"
          rightText={new Date(detail?.pendingConfirmationAt).toLocaleString(
            'vi-VN',
          )}
        />
      )}

      {detail?.readyForPickupAt && (
        <DualTextRow
          leftText="Thời gian sẵn sàng lấy hàng"
          rightText={new Date(detail?.readyForPickupAt).toLocaleString('vi-VN')}
        />
      )}

      {detail?.shippingOrderAt && (
        <DualTextRow
          leftText="Thời gian giao hàng"
          rightText={new Date(detail?.shippingOrderAt).toLocaleString('vi-VN')}
        />
      )}

      {detail?.completedAt && (
        <DualTextRow
          leftText="Thời gian hoàn thành"
          rightText={new Date(detail?.completedAt).toLocaleString('vi-VN')}
        />
      )}

      {detail?.cancelledAt && (
        <DualTextRow
          leftText="Thời gian hủy đơn"
          rightText={new Date(detail?.cancelledAt).toLocaleString('vi-VN')}
        />
      )}

      <Row
        style={{
          alignItems: 'center',
          marginVertical: 6,
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
            color: colors.black,
            marginRight: 8,
          }}>
          Phương thức thanh toán:
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {getPaymentIcon(paymentMethod)}
          <Text
            style={{
              fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
              color: colors.black,
              marginLeft: 8,
            }}>
            {paymentMethod === 'online' ? 'Thanh toán online' : 'Tiền mặt'}
          </Text>
        </View>
      </Row>

      <DualTextRow
        leftText="Tổng tiền"
        rightText={`${totalPrice.toLocaleString('vi-VN')}đ`}
        rightTextStyle={{
          color: colors.primary,
          fontWeight: '700',
          fontSize: 18,
        }}
        leftTextStyle={{color: colors.black, fontWeight: '500'}}
      />
    </View>
  );
};

export default PaymentDetailsView;
