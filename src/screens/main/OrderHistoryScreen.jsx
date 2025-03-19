import React, {useEffect, useMemo, useState} from 'react';
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
  DeliveryMethod,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
} from '../../constants';
import {TextFormatter} from '../../utils';
import OrderDetailScreen from '../order/OrderDetailScreen';
import MerchantSocketService from '../../sevices/merchantSocketService';

const width = Dimensions.get('window').width;

const OrderHistoryScreen = () => {
  const [order, setOrder] = useState([]); // tôngwr don hang
  const [pendingConfirmation, setPendingConfirmation] = useState([]); //'Chờ xác nhận',
  const [processing, setProcessing] = useState([]); // 'Đang xử lý',
  const [readyForPickup, setReadyForPickup] = useState([]); //'Chờ lấy hàng'
  const [shippingOrder, setShippingOrder] = useState([]); //'Đang giao hàng',
  const [completed, setCompleted] = useState([]); //'Hoàn thành',
  const [cancelled, setCancelled] = useState([]); //'Đã huỷ'
  const [failedDelivery, setFailedDelivery] = useState([]); // 'Giao hàng thất bại',

  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOrderDetail, setIsModalOrderDetail] = useState(false);
  const [idOrder, setIdOrder] = useState(null);

  // lấy danh sách đơn hàng
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const responseOrder = await getOrders();
      if (responseOrder) {
        setOrder(responseOrder.data);
      }
    } catch (error) {
      console.log('Lỗi khi lấy danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (order?.length > 0) {
      // Lấy đơn hàng trạng thái Chờ xác nhận
      setPendingConfirmation(
        filterAndSortOrders(order, OrderStatus.PENDING_CONFIRMATION.value),
      );
      // Lấy đơn hàng trạng thái Đang xử lý
      setProcessing(filterAndSortOrders(order, OrderStatus.PROCESSING.value));
      // Lấy đơn hàng trạng thái Chờ lấy hàng
      setReadyForPickup(
        filterAndSortOrders(order, OrderStatus.READY_FOR_PICKUP.value),
      );
      // Lấy đơn hàng trạng thái Đang giao hàng
      setShippingOrder(
        filterAndSortOrders(order, OrderStatus.SHIPPING_ORDER.value),
      );
      // Lấy đơn hàng trạng thái Hoàn thành
      setCompleted(filterAndSortOrders(order, OrderStatus.COMPLETED.value));
      // Lấy đơn hàng trạng thái Đã huỷ
      setCancelled(filterAndSortOrders(order, OrderStatus.CANCELLED.value));
      // Lấy đơn hàng trạng thái Giao hàng thất bại
      setFailedDelivery(
        filterAndSortOrders(order, OrderStatus.FAILED_DELIVERY.value),
      );
    }
  }, [order]);

  const handleRepeatOrder = id => {
    setIsModalOrderDetail(true);
    setIdOrder(id);
  };

  useEffect(() => {
    const handleNewOrder = data => {
      if (data._id !== null) {
        fetchOrders();
      }
    };

    MerchantSocketService.on('order.new');
    return () => {
      MerchantSocketService.off('order.new', handleNewOrder);
    };
  }, []);

  const filterAndSortOrders = useMemo(() => {
    return (array, status) => {
      return array
        .filter(item => item.status === status) // Lọc theo trạng thái
        .sort(
          (a, b) =>
            new Date(b.fulfillmentDateTime) - new Date(a.fulfillmentDateTime),
        ); // Sắp xếp theo ngày, từ mới nhất đến cũ nhất
    };
  }, []); // Thêm mảng phụ thuộc nếu cần thiết, ví dụ khi muốn tính lại nếu state thay đổi
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
          status={'pendingConfirmation'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={processing}
          status={'processing'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={readyForPickup}
          status={'readyForPickup'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={shippingOrder}
          status={'shippingOrder'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={completed}
          status={'completed'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={failedDelivery}
          status={'failedDelivery'}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={cancelled}
          status={'cancelled'}
        />
      </CustomTabView>

      <OrderDetailScreen
        setIsModalOrderDetail={setIsModalOrderDetail}
        isModalOrderDetail={isModalOrderDetail}
        idOrder={idOrder}
        setIdOrder={setIdOrder}
        fetchOrders={fetchOrders}
      />
      {/* <NormalLoading visible={loading} /> */}
    </View>
  );
};

const OrderListView = ({orders, loading, handleRepeatOrder, status}) => {
  // console.log('>>>', JSON.stringify(orders[1], null, 2));

  return (
    <View style={styles.scene}>
      {loading ? (
        <NormalLoading visible={true} message="Đang tải lịch sử đơn hàng..." />
      ) : orders.length > 0 ? (
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
};

const Item = ({item, handleRepeatOrder}) => {
  const paymentMethod = checkPaymentStatus(item);
  return (
    <TouchableOpacity
      onPress={() => handleRepeatOrder(item._id)}
      style={styles.itemOrder}>
      <ItemOrderType deliveryMethod={item.deliveryMethod} />
      <View style={styles.view1}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            flex: 1,
          }}>
          <Text
            style={{
              fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
            }}>
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
