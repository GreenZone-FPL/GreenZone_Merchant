import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, View, Text} from 'react-native';
import {DualTextRow, NormalText} from '../../../components';
import {updateOrderStatus} from '../../../axios/index';
import {
  DeliveryMethod,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
  colors,
} from '../../../constants';
import {TextFormatter} from '../../../utils';
import ShipperSelectModal from './ShipperSelectModal';
import {Icon} from 'react-native-paper';

const PaymentDetails = ({
  data,
  setIsModalOrderDetail,
  fetchOrders,
  setIdOrder,
  fetchOrderDetail,
}) => {
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [shipperModalVisible, setShipperModalVisible] = useState(false);
  const getPaymentStatus = (status, paymentMethod, deliveryMethod) => {
    if (
      status === 'completed' ||
      (deliveryMethod === 'pickup' &&
        (status == 'processing' || status == 'readyForPickup'))
    ) {
      return {text: 'Đã thanh toán', color: colors.primary};
    }
    if (paymentMethod === 'cod') {
      return {text: 'Chưa thanh toán', color: 'red'};
    }
    if (status === 'awaitingPayment') {
      return {text: 'Chờ thanh toán', color: 'orange'};
    }
    return {text: 'Đã thanh toán', color: colors.primary};
  };

  const totalPrice = calculateTotalPrice(data?.orderItems || []);
  const voucher =
    data?.voucher && Object.keys(data?.voucher).length > 0
      ? data?.voucher
      : null;
  const discountAmount = calculateVoucher(totalPrice, voucher);
  const paymentStatus = getPaymentStatus(
    data?.status,
    data?.paymentMethod,
    data?.deliveryMethod,
  );

  function calculateTotalPrice(items) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      const toppingTotal = (item.toppingItems || []).reduce(
        (sum, topping) => sum + (topping.price || 0) * (topping.quantity || 1),
        0,
      );
      return total + itemTotal + toppingTotal;
    }, 0);
  }

  function calculateVoucher(totalPrice, voucher) {
    if (!voucher) return 0;
    return voucher.discountType === 'percentage'
      ? (voucher.discountValue * totalPrice) / 100
      : voucher.discountValue || 0;
  }

  const updateStatus = async (status, deliveryMethod, shipperId = null) => {
    try {
      const response = await updateOrderStatus(
        data?._id,
        status,
        deliveryMethod,
        shipperId,
      );
      return response.data;
    } catch (error) {
      console.log('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      throw error;
    }
  };

  const showAlert = ({notification, message, onPress}) => {
    Alert.alert(notification, message, [
      {text: 'Đóng', style: 'cancel'},
      {text: 'Xác Nhận', onPress},
    ]);
  };

  const handleStatusUpdate = async newStatus => {
    try {
      await updateStatus(newStatus);
      await fetchOrders();
      // await setIdOrder(null);
      await fetchOrderDetail();
    } catch (error) {
      console.log('Cập nhật trạng thái đơn hàng thất bại:', error);
    } finally {
      // setIsModalOrderDetail(false);
    }
  };

  const handleStatusUpdateWithShipper = async (status, shipperId) => {
    try {
      await updateStatus(status, 'delivery', shipperId);
      await fetchOrders();
      // await setIdOrder(null);
      await fetchOrderDetail();
    } catch (error) {
      console.log('Lỗi cập nhật trạng thái đơn hàng:', error);
    } finally {
      // setIsModalOrderDetail(false);
    }
  };

  const handleOrderStatusButtons = () => {
    switch (data?.status) {
      case OrderStatus.PENDING_CONFIRMATION.value:
        return (
          <>
            <Pressable
              style={styles.button1}
              onPress={() =>
                showAlert({
                  notification: 'Huỷ đơn hàng',
                  message: 'Bạn có chắc chắn muốn huỷ đơn hàng này?',
                  onPress: () =>
                    handleStatusUpdate(OrderStatus.CANCELLED.value),
                })
              }>
              <NormalText text="Huỷ Đơn" style={styles.buttonTextWhite} />
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() =>
                showAlert({
                  notification: 'Xác nhận đơn hàng',
                  message: 'Bạn có chắc chắn muốn xác nhận đơn hàng này?',
                  onPress: () =>
                    handleStatusUpdate(OrderStatus.PROCESSING.value),
                })
              }>
              <NormalText text="Xác nhận" style={styles.buttonText} />
            </Pressable>
          </>
        );
      case OrderStatus.PROCESSING.value:
        return (
          <>
            {data.deliveryMethod === DeliveryMethod.DELIVERY.value ? (
              <>
                <Pressable
                  style={styles.button}
                  onPress={() => setShipperModalVisible(true)}>
                  <NormalText text="Chọn Shipper" style={styles.buttonText} />
                </Pressable>
                <ShipperSelectModal
                  visible={shipperModalVisible}
                  onClose={() => setShipperModalVisible(false)}
                  onSelect={shipper => {
                    showAlert({
                      notification: 'Xác nhận shipper',
                      message: `Bạn có chắc chắn chọn shipper ${shipper.firstName} ${shipper.lastName}?`,
                      onPress: () => {
                        setSelectedShipper(shipper);
                        handleStatusUpdateWithShipper(
                          OrderStatus.READY_FOR_PICKUP.value,
                          shipper._id,
                        );
                        setShipperModalVisible(false);
                      },
                    });
                  }}
                />
              </>
            ) : (
              <Pressable
                style={styles.button}
                onPress={() =>
                  showAlert({
                    notification: 'Sẵn sàng đến lấy',
                    message: 'Đánh dấu đơn hàng là sẵn sàng đến lấy?',
                    onPress: () =>
                      handleStatusUpdate(OrderStatus.READY_FOR_PICKUP.value),
                  })
                }>
                <NormalText text="Sẵn sàng đến lấy" style={styles.buttonText} />
              </Pressable>
            )}
          </>
        );
      case OrderStatus.READY_FOR_PICKUP.value:
        return (
          <>
            {data.deliveryMethod === DeliveryMethod.DELIVERY.value ? (
              <Pressable
                style={styles.button}
                onPress={() =>
                  showAlert({
                    notification: 'Giao cho shipper',
                    message: 'Đơn giao cho shipper thành công?',
                    onPress: () =>
                      handleStatusUpdate(OrderStatus.SHIPPING_ORDER.value),
                  })
                }>
                <NormalText
                  text="Giao thành công cho Shipper"
                  style={styles.buttonText}
                />
              </Pressable>
            ) : (
              <Pressable
                style={styles.button}
                onPress={() =>
                  showAlert({
                    notification: 'Hoàn thành đơn hàng',
                    message: 'Đánh dấu đơn hàng là hoàn thành?',
                    onPress: () =>
                      handleStatusUpdate(OrderStatus.COMPLETED.value),
                  })
                }>
                <NormalText text="Đã hoàn thành" style={styles.buttonText} />
              </Pressable>
            )}
          </>
        );
      case OrderStatus.SHIPPING_ORDER.value:
        return (
          <>
            <Pressable
              style={styles.button}
              onPress={() =>
                showAlert({
                  notification: 'Đơn hoàn thành',
                  message: 'Xác nhận đơn hàng đã giao thành công?',
                  onPress: () =>
                    handleStatusUpdate(OrderStatus.COMPLETED.value),
                })
              }>
              <NormalText text="Đã hoàn thành" style={styles.buttonText} />
            </Pressable>
            <Pressable
              style={styles.button1}
              onPress={() =>
                showAlert({
                  notification: 'Giao hàng thất bại',
                  message: 'Đánh dấu đơn hàng giao không thành công?',
                  onPress: () =>
                    handleStatusUpdate(OrderStatus.FAILED_DELIVERY.value),
                })
              }>
              <NormalText text="Giao thất bại" style={styles.buttonTextWhite} />
            </Pressable>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <DualTextRow
        leftText="Chi tiết thanh toán"
        leftTextStyle={styles.dualTextLeftHeader}
      />
      <View style={styles.oderIdContainer}>
        <NormalText text="Mã đơn hàng: " />
        <Pressable style={styles.pressable} onPress={() => {}}>
          <Text style={styles.orderIdText}>{data?._id}</Text>
          <Icon source="content-copy" color={colors.teal900} size={18} />
        </Pressable>
      </View>
      {[
        {
          leftText: `Tạm tính (${(data?.orderItems || []).reduce(
            (sum, item) => sum + (item.quantity || 0),
            0,
          )} sản phẩm)`,
          rightText: TextFormatter.formatCurrency(totalPrice),
        },
        {
          leftText: 'Phí giao hàng',
          rightText: TextFormatter.formatCurrency(
            data?.deliveryMethod === DeliveryMethod.DELIVERY.value
              ? data?.shippingFee || 0
              : 0,
          ),
        },
        {
          leftText: 'Giảm giá',
          rightText: `-${TextFormatter.formatCurrency(discountAmount)}`,
          rightTextStyle: {color: colors.primary},
        },
        {
          leftText: 'Tổng tiền',
          rightText: `${totalPrice.toLocaleString('vi-VN')}đ`,
          rightTextStyle: {
            color: colors.primary,
            fontWeight: '700',
            fontSize: 20,
          },
          leftTextStyle: {color: colors.primary, fontWeight: '700'},
        },
        {
          leftText: 'Trạng thái thanh toán',
          rightText: paymentStatus.text,
          leftTextStyle: {
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderWidth: 1,
            borderRadius: 6,
            borderColor: paymentStatus.color,
            color: paymentStatus.color,
          },
          rightTextStyle: {color: paymentStatus.color},
        },
        {
          leftText: 'Thời gian đặt hàng',
          rightText: TextFormatter.formatDateTime(data?.fulfillmentDateTime),
        },
        {
          leftText: 'Thanh toán',
          rightText:
            data?.paymentMethod === PaymentMethod.COD.value
              ? 'Tiền mặt'
              : 'Chuyển khoản',
          rightTextStyle: {fontWeight: '700', color: colors.primary},
        },
      ].map((item, index) => (
        <DualTextRow key={index} {...item} />
      ))}
      {data?.status !== OrderStatus.CANCELLED.value &&
        data?.status !== OrderStatus.FAILED_DELIVERY.value && (
          <View style={styles.buttonContainer}>
            {handleOrderStatusButtons()}
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: 6,
  },
  dualTextLeftHeader: {
    color: colors.black2,
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT * 4,
    borderTopWidth: 1,
    borderColor: colors.gray200,
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
    minWidth: '15%',
    alignSelf: 'flex-start',
  },
  button1: {
    backgroundColor: colors.gray400,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
    minWidth: '15%',
  },
  buttonText: {
    color: colors.white,
  },
  buttonTextWhite: {
    color: colors.white,
  },
  oderIdContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    justifyContent: 'space-between',
    flex: 1,
  },
  pressable: {flexDirection: 'row', alignItems: 'center'},
  orderIdText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default PaymentDetails;
