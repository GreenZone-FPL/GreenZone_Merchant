import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import {getOrderDetail} from '../../axios/index';
import {
  NormalLoading,
  OverlayStatusBar,
  TitleText,
  Row,
  StatusText,
} from '../../components';
import {GLOBAL_KEYS, OrderStatus, colors} from '../../constants';
import MerchantInfo from './components/MerchantInfo';
import RecipientInfo from './components/RecipientInfo';
import ProductsInfo from './components/ProductsInfo';
import PaymentDetails from './components/PaymentDetails';
import ShipperInfo from './components/ShipperInfo';
import PaymentDetailsView from './components/PaymentDetailsView';

const OrderDetailScreen = ({
  idOrder,
  setIdOrder,
  setIsModalOrderDetail,
  isModalOrderDetail,
  fetchOrders,
}) => {
  const scrollViewRef = useRef(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 1000);
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderDetail(idOrder);
      setOrderDetail(response);
      setStatus(response.status);
    } catch (error) {
      console.log('Lỗi lấy chi tiết đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('order', JSON.stringify(orderDetail, null, 2));

  useEffect(() => {
    if (idOrder == null) return;
    fetchOrderDetail();
  }, [idOrder]);

  useEffect(() => {
    if (status !== null) {
      fetchOrderDetail();
    }
  }, [status]);

  const getOrderStatusLabel = value => {
    const statusEntry = Object.values(OrderStatus).find(s => s.value === value);
    return statusEntry ? statusEntry.label : 'Trạng thái không xác định';
  };

  if (loading) {
    return (
      <View style={styles.body}>
        <NormalLoading visible={loading} />
      </View>
    );
  }
  return (
    <Modal visible={isModalOrderDetail} transparent animationType="slide">
      <OverlayStatusBar />
      <View style={styles.body}>
        <TouchableOpacity
          onPress={() => setIsModalOrderDetail(false)}
          style={styles.viewClose}
        />
        <View style={styles.modalContainer}>
          <View style={styles.headerRow}>
            <View style={styles.headerSpacer} />

            <TitleText
              text="Chi tiết đơn hàng"
              style={styles.titleTextCenter}
            />
            <IconButton
              icon="close"
              size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
              iconColor={colors.primary}
              style={styles.closeButton}
              onPress={() => setIsModalOrderDetail(false)}
            />
          </View>
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
            {orderDetail && (
              <>
                {orderDetail.shippingAddress &&
                  Object.keys(orderDetail.shippingAddress).length > 0 && (
                    <ShipperInfo shipper={orderDetail.shipper} />
                  )}

                <Row
                  style={{
                    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
                    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
                    marginBottom: GLOBAL_KEYS.GAP_SMALL,
                    justifyContent: 'space-between',
                    flex: 1,
                    backgroundColor: colors.white,
                  }}>
                  <Text
                    style={{
                      fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
                      color: colors.black,
                      flex: 1,
                      fontWeight: '500',
                    }}>
                    {orderDetail?.deliveryMethod === 'pickup'
                      ? 'Tự đến lấy hàng'
                      : 'Giao hàng tận nơi'}
                  </Text>

                  <StatusText status={orderDetail.status} />
                </Row>

                <MerchantInfo data={orderDetail.store} />
                <RecipientInfo data={orderDetail} />
                <ProductsInfo orderItems={orderDetail.orderItems} />
                <PaymentDetailsView
                  detail={orderDetail}
                  _id={orderDetail._id}
                  shippingFee={orderDetail.shippingFee}
                  voucher={orderDetail.voucher}
                  paymentMethod={orderDetail.paymentMethod}
                  orderItems={orderDetail.orderItems}
                  totalPrice={orderDetail.totalPrice}
                  status={orderDetail.status}
                  createdAt={orderDetail.createdAt}
                />
                <PaymentDetails
                  data={orderDetail}
                  setIsModalOrderDetail={setIsModalOrderDetail}
                  fetchOrders={fetchOrders}
                  setIdOrder={setIdOrder}
                  fetchOrderDetail={fetchOrderDetail}
                />
              </>
            )}
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => setIsModalOrderDetail(false)}
          style={styles.viewClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewClose: {
    width: '15%',
    height: '100%',
  },
  modalContainer: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    backgroundColor: 'white',
    width: '60%',
    height: '90%',
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  headerSpacer: {
    width: 24,
    height: 24,
  },
  titleTextCenter: {
    alignSelf: 'center',
  },
  closeButton: {
    backgroundColor: colors.green100,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  statusLabel: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black2,
  },
  statusText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
});

export default React.memo(OrderDetailScreen);
