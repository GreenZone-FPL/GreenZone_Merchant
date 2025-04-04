import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import {
  colors,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
} from '../../../constants';
import {createPickUpOrder} from '../../../axios/index';
import {NormalLoading, OverlayStatusBar} from '../../../components';

const ModalCheckout = ({
  data,
  setIsCheckout,
  isCheckout,
  setCart,
  setPhoneNumber,
  setScannedCode,
  setIsSelectedPaymentMethod,
  setIsPayment,
  setOrderResponse,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Xử lý tạo đơn hàng
  const createOrder = async () => {
    setLoading(true);
    try {
      let response;

      if (data.paymentMethod === PaymentMethod.ONLINE.value) {
        response = await createPickUpOrder({
          ...data,
          status: OrderStatus.AWAITING_PAYMENT.value,
        });
      } else {
        response = await createPickUpOrder({...data});
      }

      // Kiểm tra response có tồn tại không trước khi truy cập vào nó
      if (response) {
        console.log('API trả về:', JSON.stringify(response, null, 2));
        setOrderResponse(response.data);
        setMessage('Tạo đơn thành công');
        setCart(null);
        setPhoneNumber('');
        setScannedCode('');
        setIsCheckout(false);
        if (response.data.paymentMethod === PaymentMethod.ONLINE.value) {
          setIsPayment(true);
        }
      } else {
        throw new Error('API không trả về dữ liệu hợp lệ.');
      }
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isCheckout} transparent animationType="slide">
      <OverlayStatusBar />
      <Pressable onPress={() => setIsCheckout(false)} style={styles.container}>
        <Pressable onPress={() => {}} style={styles.modalContent}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Xác nhận</Text>
            <Text style={styles.subText}>Bạn xác nhận tạo đơn hàng</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsCheckout(false);
                setIsSelectedPaymentMethod(true);
              }}>
              <Text style={styles.buttonText}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={createOrder}>
              <Text style={styles.buttonText}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
      <NormalLoading visible={loading} />
    </Modal>
  );
};

export default React.memo(ModalCheckout);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  modalContent: {
    width: '50%',
    padding: GLOBAL_KEYS.PADDING_DEFAULT * 2,
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    elevation: 5,
  },
  textContainer: {
    alignSelf: 'flex-start',
  },
  headerText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    color: colors.primary,
    fontWeight: '500',
  },
  subText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.black,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    marginTop: GLOBAL_KEYS.PADDING_DEFAULT,
    alignSelf: 'flex-end',
  },
  paymentButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    minWidth: 100,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.gray700,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    minWidth: 100,
  },
  buttonText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
});
