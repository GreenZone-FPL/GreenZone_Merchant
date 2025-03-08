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
import {colors, GLOBAL_KEYS} from '../../constants';
import {TextFormatter, AppAsyncStorage} from '../../utils';
import {createPickUpOrder} from '../../axios';
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

  //tạo order
  const createOrder = async order => {
    setLoading(true);
    try {
      const response = await createPickUpOrder(order);
      if (response.status === 201) {
        setLoading(false);

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
      console.log('Dữ liệu gửi lên API:', JSON.stringify(order, null, 2));
      return response;
    } catch (error) {
      throw error;
    }
  };
  return (
    <Modal visible={isCheckout} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.infoContainer}>
            <Item
              title={'Cửa hàng'}
              text={`Green Zone ${merchant?.lastName}`}
            />
            <Item title={'Phương thức nhận hàng'} text={order.deliveryMethod} />
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
            <Item title={'Phương thức thanh toán'} text={order.paymentMethod} />
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
              <Text style={styles.buttonText}>Thanh Toán Tiền Mặt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentButton}>
              <Text style={styles.buttonText}>Thanh Toán Chuyển Khoản</Text>
            </TouchableOpacity>
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
    gap: GLOBAL_KEYS.GAP_DEFAULT * 5,
    justifyContent: 'center',
  },
  infoContainer: {
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT * 2,
  },
  paymentButton: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  cancelButton: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.red900,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  buttonText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '600',
    color: colors.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    width: '100%',
  },
  itemTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
    width: '20%',
  },
  itemText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    color: colors.primary,
    fontWeight: '700',
  },
  showMessage: {
    width: 400,
    height: 200,
    backgroundColor: colors.white,
    color: colors.primary,
    borderRadius: 10,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER + 5,
    elevation: 4,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '700',
  },
});

export default React.memo(ModalCheckout);
