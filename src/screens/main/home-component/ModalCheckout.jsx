import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
} from 'react-native';
import { colors, GLOBAL_KEYS } from '../../../constants';
import { createPickUpOrder } from '../../../axios/index';
import { Ani_ModalLoading } from '../../../components';
import NomalLoading from '../../../components/animations/NormalLoading';

const { width, height } = Dimensions.get('window');

const ModalCheckout = ({
  data,
  setIsCheckout,
  isCheckout,
  setCart,
  setPhoneNumber,
  setScannedCode,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Xử lý tạo đơn hàng
  const createOrder = async () => {
    setLoading(true);
    try {
      const response = await createPickUpOrder({ ...data, paymentMethod: 'cod' });
      if (response.status === 201) {
        setMessage('Tạo đơn thành công');
        setTimeout(() => {
          setIsCheckout(false);
          setCart(null);
          setPhoneNumber('');
          setScannedCode('');
        }, 1000);
      }
    } catch (error) {
      console.log('Lỗi tạo đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isCheckout} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Xác nhận</Text>
            <Text style={styles.subText}>Bạn xác nhận tạo đơn hàng</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsCheckout(false)}>
              <Text style={styles.buttonText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={createOrder}>
              <Text style={styles.buttonText}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <NomalLoading visible={loading} />
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
