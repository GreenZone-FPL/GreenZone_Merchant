import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Modal, Pressable} from 'react-native';
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
  setCustomer,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Xử lý tạo đơn hàng
  const createOrder = async () => {
    setLoading(true);
    try {
      let response;
      console.log('data', JSON.stringify(data, null, 2));
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
        setOrderResponse(response.data);
        if (response.data.paymentMethod === PaymentMethod.COD.value) {
          console.log('API trả về:', JSON.stringify(response, null, 2));
          setMessage('Tạo đơn thành công');
          setCart(null);
          setPhoneNumber('');
          setScannedCode('');
          setCustomer(null);
          setIsCheckout(false);
        }
        if (response.data.paymentMethod === PaymentMethod.ONLINE.value) {
          setIsPayment(true);
          setIsCheckout(false);
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

  useEffect(() => {
    console.log('data', JSON.stringify(data, null, 2));
  }, [data]);

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
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setIsCheckout(false);
                setIsSelectedPaymentMethod(true);
              }}>
              <Text style={styles.buttonText}>Quay lại</Text>
            </Pressable>
            <Pressable style={styles.paymentButton} onPress={createOrder}>
              <Text style={styles.buttonText}>Đồng ý</Text>
            </Pressable>
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
