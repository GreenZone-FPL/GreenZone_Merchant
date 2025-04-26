import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {getOrders} from '../../axios/index';
import {
  Column,
  CustomSearchBar,
  CustomTabView,
  LightStatusBar,
  NormalText,
} from '../../components';
import {
  colors,
  DeliveryMethod,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
} from '../../constants';
import {TextFormatter} from '../../utils';
import OrderDetailScreen from '../order/OrderDetailScreen';
import {useAppContext} from '../../context/appContext';
const width = Dimensions.get('window').width;

const OrderHistoryScreen = () => {
  const [awaitingPayment, setAwaitingPayment] = useState([]);
  const [pendingConfirmation, setPendingConfirmation] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [readyForPickup, setReadyForPickup] = useState([]);
  const [shippingOrder, setShippingOrder] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [cancelled, setCancelled] = useState([]);
  const [failedDelivery, setFailedDelivery] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOrderDetail, setIsModalOrderDetail] = useState(false);
  const [idOrder, setIdOrder] = useState(null);
  const {orderNew, setOrderNew} = useAppContext();

  useEffect(() => {
    const {status, setter} = orderStatusConfig[tabIndex];
    fetchOrdersByStatus(status, setter);
  }, [orderNew]);

  // Sử dụng useMemo để khởi tạo mảng cấu hình một lần khi component mount
  const orderStatusConfig = useMemo(
    () => [
      {
        status: OrderStatus.AWAITING_PAYMENT.value,
        setter: setAwaitingPayment,
      },
      {
        status: OrderStatus.PENDING_CONFIRMATION.value,
        setter: setPendingConfirmation,
      },
      {
        status: OrderStatus.PROCESSING.value,
        setter: setProcessing,
      },
      {
        status: OrderStatus.READY_FOR_PICKUP.value,
        setter: setReadyForPickup,
      },
      {
        status: OrderStatus.SHIPPING_ORDER.value,
        setter: setShippingOrder,
      },
      {
        status: OrderStatus.COMPLETED.value,
        setter: setCompleted,
      },
      {
        status: OrderStatus.CANCELLED.value,
        setter: setCancelled,
      },
    ],
    [],
  );

  // Hàm fetch đơn hàng theo trạng thái, dùng useCallback để ổn định tham chiếu
  const fetchOrdersByStatus = useCallback(async (status, setOrder) => {
    setLoading(true);
    try {
      const responseOrder = await getOrders(status);
      if (responseOrder) {
        // console.log('responseOrder', JSON.stringify(responseOrder, null, 2));

        setOrder(responseOrder);
      }
    } catch (error) {
      console.log('Lỗi khi lấy danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch đơn hàng khi tabIndex thay đổi
  useEffect(() => {
    const {status, setter} = orderStatusConfig[tabIndex];
    fetchOrdersByStatus(status, setter);
  }, [tabIndex, orderStatusConfig, fetchOrdersByStatus]);

  // tim kiem
  const filterOrders = orders => {
    if (!searchTerm) return orders;

    return orders.filter(order => {
      // Ensure that the fields exist before calling .includes()
      const orderIdMatch = order._id
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const ownerPhoneMatch = order.owner?.phoneNumber?.includes(searchTerm);
      const ownerFirstNameMatch = order.owner?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const ownerLastNameMatch = order.owner?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const totalPriceMatch = order.totalPrice?.toString().includes(searchTerm);
      const deliveryMethodMatch = order.deliveryMethod
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const shippingAddressMatch = order.shippingAddress
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const productNameMatch = order.orderItems?.some(item =>
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      return (
        orderIdMatch ||
        ownerPhoneMatch ||
        ownerFirstNameMatch ||
        ownerLastNameMatch ||
        totalPriceMatch ||
        deliveryMethodMatch ||
        shippingAddressMatch ||
        productNameMatch
      );
    });
  };

  // Cập nhật đơn hàng nếu có đơn hàng mới từ socket
  const handleRepeatOrder = id => {
    setIsModalOrderDetail(true);
    setIdOrder(id);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.fbBg, gap: 16}}>
      <LightStatusBar />
      <CustomSearchBar
        placeholder="Tìm kiếm sản phẩm..."
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
        onClearIconPress={() => setSearchTerm('')}
        style={{
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.gray200,
        }}
      />
      <View style={{gap: 16, flex: 1}}>
        <CustomTabView
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          tabBarConfig={{
            titles: [
              'Chờ thanh toán',
              'Chờ xác nhận',
              'Đang xử lý',
              'Chờ lấy hàng',
              'Đang giao hàng',
              'Hoàn thành',
              'Đã huỷ',
            ],
            titleActiveColor: colors.primary,
            titleInActiveColor: colors.gray700,
          }}>
          <OrderListView
            handleRepeatOrder={handleRepeatOrder}
            orders={filterOrders(awaitingPayment)}
            loading={loading}
            status="awaitingPayment"
          />
          <OrderListView
            handleRepeatOrder={handleRepeatOrder}
            orders={filterOrders(pendingConfirmation)}
            loading={loading}
            status="pendingConfirmation"
          />
          <OrderListView
            handleRepeatOrder={handleRepeatOrder}
            orders={filterOrders(processing)}
            loading={loading}
            status="processing"
          />
          <OrderListView
            handleRepeatOrder={handleRepeatOrder}
            orders={filterOrders(readyForPickup)}
            loading={loading}
            status="readyForPickup"
          />
          <OrderListView
            handleRepeatOrder={handleRepeatOrder}
            orders={filterOrders(shippingOrder)}
            loading={loading}
            status="shippingOrder"
          />
          <OrderListView
            handleRepeatOrder={handleRepeatOrder}
            orders={filterOrders(completed)}
            loading={loading}
            status="completed"
          />

          <OrderListView
            handleRepeatOrder={handleRepeatOrder}
            orders={filterOrders(cancelled)}
            loading={loading}
            status="cancelled"
          />
        </CustomTabView>
      </View>

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
    </View>
  );
};

const OrderListView = ({orders, handleRepeatOrder}) => {
  // console.log('order', JSON.stringify(orders, null, 2));

  return (
    <View>
      {orders.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={orders}
          keyExtractor={item => item.orderId || item._id}
          renderItem={({item}) => (
            <Item item={item} handleRepeatOrder={handleRepeatOrder} />
          )}
          contentContainerStyle={{
            gap: GLOBAL_KEYS.GAP_SMALL,
            backgroundColor: colors.fbBg,
          }}
        />
      ) : (
        <EmptyView />
      )}
    </View>
  );
};

const Item = ({item, handleRepeatOrder}) => {
  const getOrderItemsText = () => {
    const items = item?.orderItems || [];
    if (items.length > 2) {
      return `${items[0].product.name} - ${items[1].product.name} và ${
        items.length - 2
      } sản phẩm khác`;
    }
    return (
      items.map(item => item.product.name).join(' - ') || 'Chưa có sản phẩm'
    );
  };

  return (
    <Pressable
      onPress={() => handleRepeatOrder(item._id)}
      style={styles.itemOrder}>
      <ItemOrderType deliveryMethod={item.deliveryMethod} item={item} />

      <Column
        style={{
          width: '30%',
          justifyContent: 'center',
        }}>
        <NormalText
          text={`#${item._id}`}
          style={{fontWeight: '500', textAlign: 'center'}}
        />

        <Text numberOfLines={2} style={styles.orderName}>
          {getOrderItemsText()}
        </Text>
      </Column>

      <Column style={{width: '30%', alignItems: 'center'}}>
        {item?.owner?.phoneNumber ? (
          <Column>
            <NormalText
              text={`${item?.owner?.firstName} ${item?.owner?.lastName} - ${item?.owner?.phoneNumber}`}
              style={styles.recipientText}
            />
            <NormalText
              text={item?.shippingAddress || ''}
              style={{textAlign: 'center'}}
            />
          </Column>
        ) : (
          <NormalText text="Khách vãng lai" style={{textAlign: 'center'}} />
        )}
      </Column>

      <Column style={{width: (width / 10) * 2, justifyContent: 'center'}}>
        <NormalText
          style={{
            color: colors.pink500,
            fontWeight: '500',
            textAlign: 'center',
          }}
          text={TextFormatter.formatCurrency(item.totalPrice)}
        />
        <NormalText
          style={{color: colors.black2, textAlign: 'center'}}
          text={
            item.paymentMethod === PaymentMethod.COD.value
              ? 'Tiền mặt'
              : 'Chuyển khoản'
          }
        />
        <NormalText
          style={{
            color: getPaymentStatus(
              item.status,
              item.paymentMethod,
              item.deliveryMethod,
            ).color,
            textAlign: 'center',
          }}
          text={
            getPaymentStatus(
              item.status,
              item.paymentMethod,
              item.deliveryMethod,
            ).text
          }
        />
      </Column>
    </Pressable>
  );
};

// Xác định trạng thái thanh toán
const getPaymentStatus = (status, paymentMethod) => {
  if (status === 'completed') {
    return {text: 'Đã thanh toán', color: colors.primary};
  } else if (
    paymentMethod === 'online' &&
    status !== OrderStatus.AWAITING_PAYMENT.value
  ) {
    return {text: 'Đã thanh toán', color: colors.primary};
  } else if (status === 'awaitingPayment') {
    return {text: 'Chờ thanh toán', color: colors.pink500};
  } else {
    return {text: 'Chưa thanh toán', color: colors.orange700};
  }
};

const ItemOrderType = ({item}) => {
  const imageMap = {
    pickup: require('../../assets/serving-method/takeaway.png'),
    delivery: require('../../assets/serving-method/delivery.png'),
  };

  return (
    <Column
      style={{width: '20%', alignItems: 'center', backgroundColor: 'white'}}>
      <NormalText
        text={new Date(item.fulfillmentDateTime).toLocaleString('vi-VN')}
      />
      <NormalText
        style={{
          color:
            item.deliveryMethod === 'delivery'
              ? colors.blue600
              : colors.orange700,
        }}
        text={
          item.deliveryMethod === 'pickup'
            ? 'Tự đến lấy hàng'
            : 'Giao hàng tận nơi'
        }
      />
    </Column>
  );
};

const EmptyView = () => (
  <View style={styles.emptyContainer}>
    <Image
      style={styles.emptyImage}
      resizeMode="cover"
      source={require('../../assets/images/logo.png')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {width: width, backgroundColor: colors.white},
  itemOrder: {
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    width: width,
  },
  orderName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.primary,
    textAlign: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyImage: {
    width: width / 3,
    height: width / 3,
  },
  recipientText: {color: colors.black, fontWeight: '500', textAlign: 'center'},
});

export default OrderHistoryScreen;
