import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import axios from 'axios';
import {WebView} from 'react-native-webview';
import {hmacSHA256} from 'react-native-hmac';
import {LightStatusBar, Row} from '../../components';
import {updateOrderStatus} from '../../axios/modules/order';
import {colors, OrderStatus} from '../../constants';

const ModalPayment = ({
  isPayment,
  setIsPayment,
  orderResponse,
  setOrderResponse,
}) => {
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  // Lấy các thông tin cấu hình từ file .env
  const CLIENT_ID = Config.CLIENT_ID;
  const API_KEY = Config.API_KEY;
  const CHECKSUM_KEY = Config.CHECKSUM_KEY;

  console.log('CLIENT_ID', CLIENT_ID);
  console.log('API_KEY', API_KEY);
  console.log('CHECKSUM_KEY', CHECKSUM_KEY);
  console.log('orderResponse', JSON.stringify(orderResponse, null, 2));

  // Hàm tạo đơn hàng PayOS
  const createPayOSOrder = async () => {
    setLoading(true);
    setCheckoutUrl(null);

    const orderCode = Date.now();
    const amount = 2000;
    const description = `${orderResponse._id}`;
    const returnUrl = 'https://greenzone.motcaiweb.io.vn/v1/category/all';
    const cancelUrl = 'https://greenzone.motcaiweb.io.vn/v1/product/all';

    const expiredAt = Math.floor(Date.now() / 1000) + 100;

    // Tạo chuỗi signature theo định dạng của PayOS
    const params = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
    const signature = await hmacSHA256(params, CHECKSUM_KEY);

    const payload = {
      orderCode,
      amount,
      description,
      items: [],
      cancelUrl,
      returnUrl,
      expiredAt,
      signature,
    };

    try {
      const res = await axios.post(
        'https://api-merchant.payos.vn/v2/payment-requests',
        payload,
        {
          headers: {
            'x-client-id': CLIENT_ID,
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('response data:', res.data);

      const url = res.data?.data?.checkoutUrl;
      console.log('checkoutUrl:', url);

      if (url) {
        setCheckoutUrl(url);
      } else {
        setErrorMessage('Không nhận được liên kết thanh toán từ PayOS.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setErrorMessage(`Lỗi kết nối đến PayOS: ${msg}`);
      console.log('Lỗi tạo đơn hàng:', msg);
    } finally {
      setLoading(false);
    }
  };

  // Tạo đơn hàng
  useEffect(() => {
    if (isPayment && orderResponse) {
      setErrorMessage('');
      createPayOSOrder();
    }
  }, [isPayment, orderResponse]);

  // Xử lý khi WebView thay đổi trạng thái điều hướng
  const handleWebViewNavigation = navState => {
    const {url} = navState;

    if (url.includes('https://greenzone.motcaiweb.io.vn/v1/category/all')) {
      updateStatus(OrderStatus.PROCESSING.value);
      setOrderResponse(null);
      setIsPayment(false);
      console.log('Thanh toán thành công');
    } else if (
      url.includes('https://greenzone.motcaiweb.io.vn/v1/product/all')
    ) {
      updateStatus(OrderStatus.CANCELLED.value);
      setIsPayment(false);
      setOrderResponse(null);
      console.log('Hủy thanh toán');
    }
  };

  const updateStatus = async status => {
    try {
      const response = await updateOrderStatus(orderResponse._id, status);
      return response.data;
    } catch (error) {
      console.log('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      throw error;
    }
  };

  return (
    <Modal visible={isPayment} animationType="slide" transparent={false}>
      <LightStatusBar />
      <View style={styles.container}>
        <View style={{flex: 1}}>
          {loading ? (
            <View style={{flex: 1}}>
              <ActivityIndicator
                size="large"
                color="#00bcd4"
                style={styles.loading}
              />
              <Text style={styles.statusText}>Đang tạo đơn hàng...</Text>
            </View>
          ) : checkoutUrl ? (
            <WebView
              source={{uri: checkoutUrl}}
              onNavigationStateChange={handleWebViewNavigation}
              style={styles.webview}
              startInLoadingState
            />
          ) : (
            <Text style={styles.errorText}>
              {errorMessage || 'Không thể tạo đơn hàng. Vui lòng thử lại.'}
            </Text>
          )}
        </View>
        <Row style={{gap: 20}}>
          {/* <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsPayment(false)}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              console.log('Tạo lại mã thanh toán');
              createPayOSOrder();
            }}>
            <Text style={styles.closeText}>Tạo lại mã thanh toán</Text>
          </TouchableOpacity>
        </Row>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  webview: {flex: 1},
  loading: {marginTop: 40},
  statusText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  closeButton: {
    padding: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    flex: 1,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 20,
    paddingHorizontal: 16,
  },
});

export default ModalPayment;
