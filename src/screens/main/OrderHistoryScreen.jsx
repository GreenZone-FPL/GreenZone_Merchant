import React, { memo, useEffect, useMemo, useState } from 'react';
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
import { Column, CustomTabView, LightStatusBar, NormalText } from '../../components';
import {
  colors,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod
} from '../../constants';
import MerchantSocketService from '../../sevices/merchantSocketService';
import { TextFormatter } from '../../utils';
import OrderDetailScreen from '../order/OrderDetailScreen';

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

  // Hàm sắp xếp đơn hàng theo thời gian
  const sortOrdersByDate = orders => {
    return orders.sort(
      (a, b) =>
        new Date(b.fulfillmentDateTime) - new Date(a.fulfillmentDateTime),
    );
  };





  // Cập nhật lại đơn hàng nếu có đơn hàng mới
  useEffect(() => {
    const handleNewOrder = data => {
      if (data._id !== null) {
        const { status, setter } = orderStatusConfig[tabIndex];
        fetchOrdersByStatus(status, setter);
      }
    };

    // MerchantSocketService.on('order.new', handleNewOrder);
    return () => {
      // MerchantSocketService.off('order.new', handleNewOrder);
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
        // fetchOrders={async() => {
        //   const { status, setter } = orderStatusConfig[tabIndex];
        //   await fetchOrdersByStatus(status, setter);
        // }}
      />

    </View>
  );
};


const OrderListView = memo(({ orders, handleRepeatOrder }) => {
  return (
    <View style={{}}>
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

  // const { shippingAddress } = item;
  // const {
  //   consigneeName = "Chưa có tên",
  //   consigneePhone = "Chưa có số điện thoại",
  //   specificAddress = "Chưa có địa chỉ",
  //   ward = "Chưa có phường",
  //   district = "Chưa có quận",
  //   province = "Chưa có tỉnh"
  // } = shippingAddress;

  // const formattedAddress = `${specificAddress}, ${ward}, ${district}, ${province}`;

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

      <Column style={{ flex: 1, justifyContent: 'center'}}>

        <NormalText text={`#${item._id}`} style={{ fontWeight: '500', textAlign: 'center' }} />

        <Text numberOfLines={2} style={styles.orderName}>
          {getOrderItemsText()}
        </Text>

      </Column>

      <Column style={{ flex: 1, alignItems: 'center' }}>
        {
          item.deliveryMethod === 'delivery' ?
            <Column >
              <NormalText text={`${item.consigneeName} || ${item.consigneePhone}`} style={styles.recipientText} />
              <NormalText text={item.shippingAddress} style={{ textAlign: 'center' }} />
            </Column>
            :
            <NormalText text='Khách vãng lai' style={{ textAlign: 'center' }} />
        }

      </Column>



      <Column style={{ justifyContent: 'center' }}>
        <NormalText
          style={{ color: colors.pink500, fontWeight: '500', textAlign: 'center' }}
          text={TextFormatter.formatCurrency(item.totalPrice)} />
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


const ItemOrderType = ({ deliveryMethod, item }) => {
  const imageMap = {
    pickup: require('../../assets/serving-method/takeaway.png'),
    delivery: require('../../assets/serving-method/delivery.png'),
  };

  return (
    <Column style={{ alignItems: 'center', backgroundColor: 'white' }}>
      {/* <Image
        style={styles.orderTypeIcon}
        source={imageMap[deliveryMethod] || imageMap['pickup']}
      /> */}

      <NormalText text={TextFormatter.formatDateTime(item.fulfillmentDateTime)} />
      <NormalText
        style={{ color: item.deliveryMethod === 'delivery' ? colors.brown700 : colors.orange700, textAlign: 'center' }}
        text={item.deliveryMethod === 'pickup' ? 'Mang đi' : 'Giao tận nơi'} />
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
  container: { flex: 1, backgroundColor: colors.white },
  itemOrder: {
    paddingHorizontal: 24,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    gap: 16
  },
  orderName: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500', color: colors.primary, textAlign: 'center' },


  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: width / 3,
    height: width / 3,
  },
  orderTypeeIcon: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },

  recipientText: { color: colors.black, fontWeight: '500', textAlign: 'center' },
});

export default OrderHistoryScreen;
