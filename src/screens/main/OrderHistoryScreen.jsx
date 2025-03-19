import React, {useEffect, useState, useMemo, memo} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getOrders} from '../../axios/index';
import {CustomTabView, LightStatusBar} from '../../components';
import {
  checkPaymentStatus,
  colors,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
} from '../../constants';
import {TextFormatter} from '../../utils';
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
      {status: OrderStatus.PROCESSING.value, setter: setProcessing},
      {status: OrderStatus.READY_FOR_PICKUP.value, setter: setReadyForPickup},
      {status: OrderStatus.SHIPPING_ORDER.value, setter: setShippingOrder},
      {status: OrderStatus.COMPLETED.value, setter: setCompleted},
      {status: OrderStatus.FAILED_DELIVERY.value, setter: setFailedDelivery},
      {status: OrderStatus.CANCELLED.value, setter: setCancelled},
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
    const {status, setter} = orderStatusConfig[tabIndex];
    fetchOrdersByStatus(status, setter);
  }, [tabIndex, orderStatusConfig]);

  // Fetch dữ liệu cho tab đầu tiên khi component mount
  useEffect(() => {
    const {status, setter} = orderStatusConfig[tabIndex];
    fetchOrdersByStatus(status, setter);
  }, [orderStatusConfig, tabIndex]);

  // Cập nhật lại đơn hàng nếu có đơn hàng mới
  useEffect(() => {
    const handleNewOrder = data => {
      if (data._id !== null) {
        const {status, setter} = orderStatusConfig[tabIndex];
        fetchOrdersByStatus(status, setter);
      }
    };

    MerchantSocketService.on('order.new', handleNewOrder);
    return () => {
      MerchantSocketService.off('order.new', handleNewOrder);
    };
  }, [tabIndex, orderStatusConfig]);

  const handleRepeatOrder = id => {
    setIsModalOrderDetail(true);
    setIdOrder(id);
  };

  return (
    <View style={{flex: 1}}>
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
          const {status, setter} = orderStatusConfig[tabIndex];
          fetchOrdersByStatus(status, setter);
        }}
      />
      {/* <NormalLoading visible={loading} /> */}
    </View>
  );
};

// Component OrderListView được bọc trong React.memo để tránh render lại không cần thiết
const OrderListView = memo(({orders, loading, handleRepeatOrder, status}) => {
  return (
    <View style={styles.scene}>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={item => item.orderId || item._id}
          renderItem={({item}) => (
            <Item item={item} handleRepeatOrder={handleRepeatOrder} />
          )}
          contentContainerStyle={{
            gap: GLOBAL_KEYS.GAP_DEFAULT,
          }}
        />
      ) : (
        <EmptyView message={getEmptyMessage(status)} />
      )}
    </View>
  );
});

// Component Item được bọc trong React.memo để tránh render lại nếu props không thay đổi
const Item = memo(({item, handleRepeatOrder}) => {
  const paymentMethod = checkPaymentStatus(item);
  return (
    <TouchableOpacity
      onPress={() => handleRepeatOrder(item._id)}
      style={styles.itemOrder}>
      <ItemOrderType deliveryMethod={item.deliveryMethod} />
      <View style={styles.view1}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end', flex: 1}}>
          <Text style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT}}>
            Đơn hàng:{' '}
          </Text>
          <Text style={{fontWeight: '500'}}>{item._id}</Text>
        </View>
        <Text style={item.owner?.firstName ? styles.owner : styles.ownerNull}>
          {item.owner?.firstName
            ? 'Khách hàng: ' + item.owner.firstName + ' ' + item.owner.lastName
            : 'Khách hàng vãng lai'}
        </Text>
      </View>
      <View style={styles.view2}>
        <ItemOrderText deliveryMethod={item.deliveryMethod} />
        <Text style={styles.cod}>
          {item.paymentMethod == PaymentMethod.COD.value
            ? 'Thanh toán tiền mặt'
            : 'Thanh toán ngân hàng'}
        </Text>
      </View>
      <View style={styles.view2}>
        <Text style={styles.price}>
          {TextFormatter.formatCurrency(item.totalPrice)}
        </Text>
        <Text style={styles.date}>
          {TextFormatter.formatDateTime(item.fulfillmentDateTime)}
        </Text>
      </View>
      <View style={styles.view2}>
        {paymentMethod === 'Chưa thanh toán' ? (
          <Text style={styles.noPaid}>Chưa thanh toán</Text>
        ) : (
          <Text style={styles.paid}>Đã thanh toán</Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

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

const ItemOrderType = ({deliveryMethod}) => {
  const imageMap = {
    pickup: require('../../assets/serving-method/takeaway.png'),
    delivery: require('../../assets/serving-method/delivery.png'),
  };

  return (
    <View style={styles.emptyContainer}>
      <Image
        style={styles.orderTypeIcon}
        source={imageMap[deliveryMethod] || imageMap['pickup']}
      />
    </View>
  );
};

const ItemOrderText = ({deliveryMethod}) => {
  const textMap = {
    pickup: 'Mang đi',
    delivery: 'Giao tận nơi',
  };

  return (
    <Text
      style={[
        styles.orderTime,
        deliveryMethod === 'delivery' ? {color: colors.pink500} : {},
      ]}>
      {textMap[deliveryMethod] || 'Mang đi'}
    </Text>
  );
};

const EmptyView = ({message}) => (
  <View style={styles.emptyContainer1}>
    <Image
      style={styles.emptyImage}
      resizeMode="cover"
      source={require('../../assets/images/logo.png')}
    />
    <Text
      style={{
        color: colors.yellow700,
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
      }}>
      {message}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
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
  view1: {
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
    width: '30%',
  },
  view2: {
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
    width: '20%',
  },
  cod: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.primary,
  },
  price: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.pink500,
    textAlign: 'right',
  },
  date: {
    color: colors.gray500,
  },
  ownerNull: {color: colors.black, fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT},
  owner: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  paid: {
    color: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderBottomWidth: 1,
    borderColor: colors.primary,
  },
  noPaid: {
    color: colors.yellow700,
    fontWeight: '500',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderBottomWidth: 1,
    borderColor: colors.yellow700,
  },
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
  orderTime: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray850,
    fontWeight: '500',
  },
  orderTypeIcon: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
});

export default OrderHistoryScreen;
