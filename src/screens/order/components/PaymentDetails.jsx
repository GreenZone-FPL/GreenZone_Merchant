import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, View, Text} from 'react-native';
import {DualTextRow, NormalText} from '../../../components';
import {updateOrderStatus} from '../../../axios/index';
import {
  DeliveryMethod,
  GLOBAL_KEYS,
  OrderStatus,
  colors,
} from '../../../constants';
import ShipperSelectModal from './ShipperSelectModal';
import CancelOrderModal from './CancelOrderModal';

const PaymentDetails = ({data, fetchOrders, fetchOrderDetail}) => {
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [shipperModalVisible, setShipperModalVisible] = useState(false);
  const [isCancelOrdeModal, setIsCancelOrdeModal] = useState(false);

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
      ? (voucher.value * totalPrice) / 100
      : voucher.value || 0;
  }

  const updateStatus = async (
    status,
    deliveryMethod,
    shipperId = null,
    reason,
  ) => {
    try {
      const response = await updateOrderStatus(
        data?._id,
        status,
        deliveryMethod,
        shipperId,
        reason,
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

  const handleStatusUpdate = async (newStatus, reason = '') => {
    try {
      await updateStatus(newStatus, data?.deliveryMethod, null, reason);
      await fetchOrders();
      await fetchOrderDetail();
    } catch (error) {
      console.log('Cập nhật trạng thái đơn hàng thất bại:', error);
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
              onPress={() => setIsCancelOrdeModal(true)}>
              <NormalText text="Huỷ đơn" style={styles.buttonTextWhite} />
              <CancelOrderModal
                visible={isCancelOrdeModal}
                onClose={() => setIsCancelOrdeModal(false)}
                onSelect={reason =>
                  handleStatusUpdate(OrderStatus.CANCELLED.value, reason.text)
                }
              />
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
                  <NormalText
                    text="Chọn nhân viên giao hàng"
                    style={styles.buttonText}
                  />
                </Pressable>
                <ShipperSelectModal
                  visible={shipperModalVisible}
                  onClose={() => setShipperModalVisible(false)}
                  onSelect={shipper => {
                    showAlert({
                      notification: 'Xác nhận shipper',
                      message: `Bạn có chắc chắn chọn nhân viên ${shipper.firstName} ${shipper.lastName}?`,
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
        // case 1:
        return (
          <>
            {data.deliveryMethod === DeliveryMethod.DELIVERY.value ? (
              // <Pressable
              //   style={styles.button}
              //   onPress={() =>
              //     showAlert({
              //       notification: 'Giao cho shipper',
              //       message: 'Đơn giao cho shipper thành công?',
              //       onPress: () =>
              //         handleStatusUpdate(OrderStatus.SHIPPING_ORDER.value),
              //     })
              //   }>
              //   <NormalText
              //     text="Giao thành công cho Shipper"
              //     style={styles.buttonText}
              //   />
              // </Pressable>
              <View></View>
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
      // case OrderStatus.SHIPPING_ORDER.value:
      case 2:
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
    borderColor: colors.primary,
    borderWidth: 1.5,
    minWidth: '20%',
    alignSelf: 'flex-start',
  },
  button1: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.pink500,
    minWidth: '20%',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
  },
  buttonTextWhite: {
    color: colors.pink500,
    fontWeight: '600',
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
