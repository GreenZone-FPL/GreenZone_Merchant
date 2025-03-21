import React, { useEffect, useState, useMemo, memo } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getOrders } from '../../axios/index';
import { CustomTabView, LightStatusBar, NormalText, Row, Column } from '../../components';
import {
  checkPaymentStatus,
  colors,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
} from '../../constants';
import { TextFormatter } from '../../utils';
import OrderDetailScreen from '../order/OrderDetailScreen';
import MerchantSocketService from '../../sevices/merchantSocketService';

const width = Dimensions.get('window').width;

const OrderHistoryScreen = () => {
  const [pendingConfirmation, setPendingConfirmation] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [readyForPickup, setReadyForPickup] = useState([]);
  const [shippingOrder, setShippingOrder] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [failedDelivery, setFailedDelivery] = useState([]);

  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOrderDetail, setIsModalOrderDetail] = useState(false);
  const [idOrder, setIdOrder] = useState(null);

  // Sử dụng useMemo để tạo mảng cấu hình cho các tab chỉ một lần khi component mount
  const orderStatusConfig = useMemo(
    () => [
      {
        status: OrderStatus.PENDING_CONFIRMATION.value,
        setter: setPendingConfirmation,
      },
      { status: OrderStatus.PROCESSING.value, setter: setProcessing },
      { status: OrderStatus.READY_FOR_PICKUP.value, setter: setReadyForPickup },
      { status: OrderStatus.SHIPPING_ORDER.value, setter: setShippingOrder },
      { status: OrderStatus.COMPLETED.value, setter: setCompleted },
      { status: OrderStatus.FAILED_DELIVERY.value, setter: setFailedDelivery },
      { status: OrderStatus.CANCELLED.value, setter: setCancelled },
    ],
    [],
  );

  // Hàm sắp xếp đơn hàng theo thời gian
  const sortOrdersByDate = orders => {
    return orders.sort(
      (a, b) =>
        new Date(b.fulfillmentDateTime) - new Date(a.fulfillmentDateTime),
    );
  };

  // Lấy danh sách đơn hàng theo trạng thái
  const fetchOrdersByStatus = async (status, setOrder) => {
    setLoading(true);
    try {
      const responseOrder = await getOrders(status);
      if (responseOrder) {
        // Sắp xếp đơn hàng ngay sau khi nhận dữ liệu
        const sortedOrders = sortOrdersByDate(responseOrder.data);
        setOrder(sortedOrders);
      }
    } catch (error) {
      console.log('Lỗi khi lấy danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch đơn hàng cho tab hiện tại khi tabIndex thay đổi
  useEffect(() => {
    const { status, setter } = orderStatusConfig[tabIndex];
    fetchOrdersByStatus(status, setter);
  }, [tabIndex, orderStatusConfig]);

  // Cập nhật lại đơn hàng nếu có đơn hàng mới
  useEffect(() => {
    const handleNewOrder = data => {
      if (data._id !== null) {
        const { status, setter } = orderStatusConfig[tabIndex];
        fetchOrdersByStatus(status, setter);
      }
    };

    MerchantSocketService.on('order.new', handleNewOrder);
    return () => {
      MerchantSocketService.off('order.new', handleNewOrder);
    };
  }, []);

  const handleRepeatOrder = id => {
    setIsModalOrderDetail(true);
    setIdOrder(id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.fbBg, gap: 16 }}>
      <LightStatusBar />
      <CustomTabView
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        tabBarConfig={{
          titles: [
            'Chờ xác nhận',
            'Đang xử lý',
            'Chờ lấy hàng',
            'Đang giao hàng',
            'Hoàn thành',
            'Giao hàng thất bại',
            'Đã huỷ',
          ],
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}>
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={pendingConfirmation}
          loading={loading}
          status={'pendingConfirmation'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={processing}
          loading={loading}
          status={'processing'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={readyForPickup}
          loading={loading}
          status={'readyForPickup'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={shippingOrder}
          loading={loading}
          status={'shippingOrder'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={completed}
          loading={loading}
          status={'completed'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={failedDelivery}
          loading={loading}
          status={'failedDelivery'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={cancelled}
          loading={loading}
          status={'cancelled'}
        />
      </CustomTabView>

      <OrderDetailScreen
        setIsModalOrderDetail={setIsModalOrderDetail}
        isModalOrderDetail={isModalOrderDetail}
        idOrder={idOrder}
        setIdOrder={setIdOrder}
        fetchOrders={() => {
          const { status, setter } = orderStatusConfig[tabIndex];
          fetchOrdersByStatus(status, setter);
        }}
      />

    </View>
  );
};


const OrderListView = memo(({ orders, handleRepeatOrder }) => {
  return (
    <View style={{paddingHorizontal: 16}}>
      {orders.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders}
          keyExtractor={item => item.orderId || item._id}
          renderItem={({ item }) => (
            <Item item={item} handleRepeatOrder={handleRepeatOrder} />
          )}
          contentContainerStyle={{
            gap: GLOBAL_KEYS.GAP_SMALL,
            backgroundColor: colors.fbBg
          }}
        />
      ) : (
        <EmptyView />
      )}
    </View>
  );
});


const Item = memo(({ item, handleRepeatOrder }) => {


  const getOrderItemsText = () => {
    const items = item?.orderItems || [];
    if (items.length > 2) {
      return `${items[0].product.name} - ${items[1].product.name} và ${items.length - 2
        } sản phẩm khác`;
    }
    return (
      items.map(item => item.product.name).join(' - ') || 'Chưa có sản phẩm'
    );
  };
  return (
    <TouchableOpacity
      onPress={() => handleRepeatOrder(item._id)}
      style={styles.itemOrder}>
      <ItemOrderType deliveryMethod={item.deliveryMethod} item={item} />

      <Column style={{ width: '30%' }}>

        <NormalText text={`#${item._id}`} style={{ fontWeight: '500', }} />

        <Text numberOfLines={2} style={styles.orderName}>
          {getOrderItemsText()}
        </Text>

        <NormalText text={item.owner?.firstName
          ? 'Khách hàng: ' + item.owner.firstName + ' ' + item.owner.lastName
          : 'Khách vãng lai'}

          style={{ color: item.owner?.firstName ? colors.primary : colors.black }}
        />
      </Column>

    

      <Column style={{ width: '20%' }}>

        <NormalText
          style={{ color: colors.pink500, fontWeight: '500' }}
          text={TextFormatter.formatCurrency(item.totalPrice)} />

        <NormalText text={TextFormatter.formatDateTime(item.fulfillmentDateTime)} />

      </Column>
      <Column style={{ width: '20%', justifyContent: 'center' }}>
        <NormalText
          style={{ color: colors.black2, textAlign: 'center' }}
          text={item.paymentMethod === PaymentMethod.COD.value
            ? 'Tiền mặt'
            : 'Chuyển khoản'} />
        <NormalText
          style={{ color: getPaymentStatus(item.status, item.paymentMethod).color, textAlign: 'center' }}
          text={getPaymentStatus(item.status, item.paymentMethod).text} />

      </Column>
    </TouchableOpacity>
  );
});

const getPaymentStatus = (status, paymentMethod) => {
  if (status === 'completed') {
    return { text: 'Đã thanh toán', color: colors.primary };
  }
  if (paymentMethod === 'cod') {
    return { text: 'Chưa thanh toán', color: 'red' };
  }
  if (status === 'awaitingPayment') {
    return { text: 'Chờ thanh toán', color: 'orange' };
  }
  return { text: 'Đã thanh toán', color: colors.primary };
};

const getEmptyMessage = status => {
  switch (status) {
    case 'pendingConfirmation':
      return 'Chưa có đơn hàng Chờ xác nhận';
    case 'processing':
      return 'Chưa có đơn hàng Đang xử lý';
    case 'readyForPickup':
      return 'Chưa có đơn hàng Chờ lấy hàng';
    case 'shippingOrder':
      return 'Chưa có đơn Đang giao hàng';
    case 'completed':
      return 'Chưa có đơn hàng Hoàn thành';
    case 'failedDelivery':
      return 'Chưa có đơn hàng Giao thất bại';
    case 'cancelled':
      return 'Chưa có đơn hàng Đã hủy';
    default:
      return 'Không có dữ liệu';
  }
};

const ItemOrderType = ({ deliveryMethod, item }) => {
  const imageMap = {
    pickup: require('../../assets/serving-method/takeaway.png'),
    delivery: require('../../assets/serving-method/delivery.png'),
  };

  return (
    <Column style={{backgroundColor: 'green', width: '15%', alignItems: 'center'}}>
      <Image
        style={styles.orderTypeIcon}
        source={imageMap[deliveryMethod] || imageMap['pickup']}
      />

      <NormalText
        style={{ color: item.deliveryMethod === 'delivery' ? colors.gray850 : colors.pink500, textAlign: 'center' }}
        text={item.deliveryMethod === 'pickup' ? 'Mang đi' : 'Giao tận nơi'} />
    </Column>
  );
};


const EmptyView = () => (
  <View style={styles.emptyContainer1}>
    <Image
      style={styles.emptyImage}
      resizeMode="cover"
      source={require('../../assets/images/logo.png')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  itemOrder: {
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  orderName: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500', color: colors.primary },

  scene: {
    width: '100%',
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyContainer1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: width / 3,
    height: width / 3,
  },
  orderTypeIcon: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
});

export default OrderHistoryScreen;
