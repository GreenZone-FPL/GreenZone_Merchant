import React from 'react';
import {Image, Text, View} from 'react-native';
import {StatusText} from '../../../components';
import {DualTextRow, Row} from '../../../components';
import {GLOBAL_KEYS, OrderStatus, colors} from '../../../constants';
import OrderId from './OrderId';

const PaymentDetailsView = ({
  detail,
  _id,
  shippingFee,
  paymentMethod,
  deliveryMethod,
  orderItems,
  totalPrice,
  status,
  createdAt,
}) => {
  // console.log('detail', JSON.stringify(detail, null, 2));
  // Tính tổng tiền sản phẩm (chưa bao gồm phí giao hàng và giảm giá)
  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Số tiền giảm giá từ voucher (nếu có)
  console.log('detail', JSON.stringify(detail, null, 2));

  let discount = 0;
  if (detail?.voucher) {
    if (detail?.voucher.discountType === 'percentage') {
      discount = (subTotal * detail?.voucher.value) / 100;
    } else {
      discount = detail?.voucher.value;
    }
  }

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
  const getPaymentStatus = (status, paymentMethod) => {
    if (status === 'completed') {
      return {text: 'Đã thanh toán', color: colors.primary};
    } else if (
      paymentMethod === 'online' &&
      status !== OrderStatus.AWAITING_PAYMENT.value
    ) {
      return {text: 'Đã thanh toán', color: colors.primary};
    } else if (status === 'awaitingPayment') {
      return {text: 'Chờ thanh toán', color: colors.pink500};
    } else {
      return {text: 'Chưa thanh toán', color: colors.orange700};
    }
  };

  const paymentStatus = getPaymentStatus(status, paymentMethod);

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
      <OrderId _id={_id} />

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
      {detail?.cancelReason && (
        <DualTextRow
          leftText="Lý do huỷ đơn"
          rightText={detail?.cancelReason}
          rightTextStyle={{color: paymentStatus.color}}
        />
      )}

      <DualTextRow
        leftText={`Tạm tính (${orderItems.length} sản phẩm)`}
        rightText={`${(
          detail.orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ) || 0
        ).toLocaleString('vi-VN')}đ`}
      />

      <DualTextRow
        leftText="Phí giao hàng"
        rightText={`${
          detail.deliveryMethod === 'delivery'
            ? shippingFee.toLocaleString('vi-VN')
            : 0
        }đ`}
      />

      <DualTextRow
        leftText={
          detail?.voucher?.name
            ? `Giảm giá (${detail.voucher.name})`
            : `Giảm giá`
        }
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
          Phương thức thanh toán
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {paymentMethod === 'online' ? (
            <Image
              source={require('../../../assets/images/onl.jpg')}
              style={{width: 22, height: 22}}
            />
          ) : (
            <Image
              source={require('../../../assets/images/logo_vnd.png')}
              style={{width: 22, height: 22}}
            />
          )}
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
