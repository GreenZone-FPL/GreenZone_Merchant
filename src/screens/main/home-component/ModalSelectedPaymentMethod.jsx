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
import {colors, GLOBAL_KEYS, PaymentMethod} from '../../../constants';
import {OverlayStatusBar, Row} from '../../../components';

const ModalSelectedPaymentMethod = ({
  setIsSelectedPaymentMethod,
  isSelectedPaymentMethod,
  setIsCheckout,
  cart,
  setCart,
}) => {
  const updatePaymentMethod = paymentMethod => {
    setCart({...cart, paymentMethod: paymentMethod});
  };

  const goCheckout = () => {
    setIsCheckout(true);
    setIsSelectedPaymentMethod(false);
  };

  return (
    <Modal visible={isSelectedPaymentMethod} transparent animationType="slide">
      <OverlayStatusBar />
      <Pressable
        onPress={() => setIsSelectedPaymentMethod(false)}
        style={styles.container}>
        <Pressable onPress={() => {}} style={styles.modalContent}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Phương thức thanh toán</Text>
          </View>
          <Row style={{gap: 50}}>
            <Pressable
              style={[
                styles.paymentMethod,
                cart.paymentMethod == PaymentMethod.COD.value &&
                  styles.paymentMethodSelectd,
              ]}
              onPress={() => {
                updatePaymentMethod(PaymentMethod.COD.value);
              }}>
              <Text
                style={[
                  styles.textPaymenMethod,
                  cart.paymentMethod == PaymentMethod.COD.value &&
                    styles.textPaymenMethodSelect,
                ]}>
                Tiền mặt
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.paymentMethod,
                cart.paymentMethod == PaymentMethod.ONLINE.value &&
                  styles.paymentMethodSelectd,
              ]}
              onPress={() => {
                updatePaymentMethod(PaymentMethod.ONLINE.value);
              }}>
              <Text
                style={[
                  styles.textPaymenMethod,
                  cart.paymentMethod == PaymentMethod.ONLINE.value &&
                    styles.textPaymenMethodSelect,
                ]}>
                Thanh toán online
              </Text>
            </Pressable>
          </Row>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsSelectedPaymentMethod(false)}>
              <Text style={styles.buttonText}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentButton} onPress={goCheckout}>
              <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default React.memo(ModalSelectedPaymentMethod);

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
    gap: 20,
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
    alignSelf: 'flex-end',
  },
  paymentButton: {
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    minWidth: 100,
  },
  cancelButton: {
    paddingVertical: 12,
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
  paymentMethod: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
    minWidth: 200,
    alignItems: 'center',
  },
  paymentMethodSelectd: {
    borderColor: colors.primary,
  },
  textPaymenMethod: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  textPaymenMethodSelect: {color: colors.primary},
});
