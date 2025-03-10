import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  colors,
  DeliveryMethod,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
} from '../../constants';
import {TextFormatter, AppAsyncStorage} from '../../utils';
import {createPickUpOrder, updateOrderStatus} from '../../axios/index';
import {Ani_ModalLoading} from '../../components';

const {width, height} = Dimensions.get('window');

const ModalCheckout = ({
  data,
  setIsCheckout,
  isCheckout,
  setCart,
  phoneNumber,
  setPhoneNumber,
  customer,
  setScannedCode,
}) => {
  const [order, setOrder] = useState(data);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(false);

  // lấy dữ liệu cửa hàng
  useEffect(() => {
    const loadMerchant = async () => {
      try {
        const merchantData = await AppAsyncStorage.readData('merchant');
        if (merchantData) {
          setMerchant(JSON.parse(merchantData));
        }
      } catch (error) {}
    };

    loadMerchant();
  }, []);

  // xac nhan
  const showAlert = ({notification, message, onPress}) => {
    Alert.alert(notification, message, [
      {
        text: 'Huỷ',
        onPress: () => {
          console.log('Xác nhận huỷ');
        },
        style: 'cancel',
      },
      {
        text: 'Xác Nhận',
        onPress: onPress,
      },
    ]);
  };

  const processCashPayment = () => {
    const newOrder = {...order, paymentMethod: 'cod'};
    showAlert({
      notification: 'Xác nhận tạo đơn hàng',
      message: 'Xác nhận đã thanh toán tiền mặt, tạo đơn hàng.',
      onPress: async () => {
        try {
          await createOrder(newOrder);
        } catch (error) {}
      },
    });
  };

  // Tạo đơn hàng
  const createOrder = async order => {
    setLoading(true);
    try {
      const response = await createPickUpOrder(order);
      if (response.status === 201) {
        await updateStatus(
          response.data.data._id,
          OrderStatus.PROCESSING.value,
        );
        setShowMessage(true);
        setMessage('TẠO ĐƠN THÀNH CÔNG');
        setTimeout(() => {
          setShowMessage(false);
          setCart(null);
          setIsCheckout(false);
          setMessage('');
          setPhoneNumber('');
          setScannedCode('');
        }, 3000);
      }
      console.log('status:', response.status);
      console.log(
        'Dữ liệu gửi lên API:',
        JSON.stringify(response.data, null, 2),
      );
      return response;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateStatus = async (orderId, status) => {
    try {
      const response = await updateOrderStatus(orderId, status);
      return response;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      throw error;
    }
  };
  return (
    <Modal visible={isCheckout} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.infoContainer}>
            <Item
              title={'Phương thức nhận hàng'}
              text={
                order.deliveryMethod === DeliveryMethod.PICK_UP.value &&
                DeliveryMethod.PICK_UP.label
              }
            />

            <Item
              title={'Thời gian hoàn tất đơn hàng'}
              text={TextFormatter.formatDateTime(order.fulfillmentDateTime)}
            />
            <Item
              title={'Người đặt hàng'}
              text={
                customer
                  ? customer?.customer?.firstName +
                    ' ' +
                    customer?.customer?.lastName
                  : 'Khách vãng lai'
              }
            />
            <Item
              title={'Ghi chú'}
              text={order.note ? order.note : 'không có ghi chú'}
            />
            <Item
              title={'Phương thức thanh toán'}
              text={' Thanh toán tiền mặt'}
            />
            <Item
              title={'Địa chỉ giao hàng'}
              text={order.shippingAddress ? order.shippingAddress : 'Tại quán'}
            />
            <Item
              title={'Mã giảm giá'}
              text={order.voucher ? order.voucher : 'Không có'}
            />
            <Item
              title={'Tổng giá trị đơn hàng'}
              text={TextFormatter.formatCurrency(order.totalPrice)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={() => {
                processCashPayment();
              }}>
              <Text style={styles.buttonText}>Tạo đơn</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.paymentButton}>
              <Text style={styles.buttonText}>Thanh Toán Chuyển Khoản</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => setIsCheckout(false)}
              style={styles.cancelButton}>
              <Text style={styles.buttonText}>Quay Lại</Text>
            </TouchableOpacity>
          </View>
          {showMessage && <Message message={message} />}
        </View>
      </View>
      <Ani_ModalLoading loading={loading} />
    </Modal>
  );
};

const Message = ({message}) => {
  return (
    <View
      style={{
        position: 'absolute',
      }}>
      <Text style={styles.showMessage}>{message}</Text>
    </View>
  );
};
const Item = ({title, text}) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{title}:</Text>
      <Text style={styles.itemText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.overlay,
    width: width,
    height: height,
  },
  modalContent: {
    flex: 1,
    margin: '10%',
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    justifyContent: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  infoContainer: {
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  paymentButton: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    width: width / 6,
  },
  cancelButton: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.red900,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    width: width / 6,
  },
  buttonText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    width: '100%',

    marginBottom: GLOBAL_KEYS.GAP_SMALL,
  },
  itemTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    width: '25%',
  },
  itemText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.primary,
    fontWeight: '700',
  },
  showMessage: {
    backgroundColor: colors.white,
    color: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    elevation: 4,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '700',
    padding: 100,
  },
});

export default React.memo(ModalCheckout);
