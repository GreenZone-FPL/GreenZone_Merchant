import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getMyOrders} from '../../axios/index';
import {
  Column,
  CustomTabView,
  LightStatusBar,
  NormalHeader,
  NormalLoading,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {OrderGraph} from '../../layouts/graphs';
import {TextFormatter} from '../../utils';

const width = Dimensions.get('window').width;

const OrderHistoryScreen = props => {
  const {navigation} = props;

  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  ///
  const feathOrders = async () => {
    setLoading(true);
    try {
      const response = await getMyOrders();
      setOrders(response.data);
      // console.log('>>>>.', response.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    feathOrders();
  }, []);

  const handleRepeatOrder = id => {
    navigation.navigate(OrderGraph.OrderDetailScreen, {id});
  };

  return (
    <View style={{flex: 1}}>
      <LightStatusBar />
      <CustomTabView
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        tabBarConfig={{
          titles: [
            'Chờ Thanh Toán',
            'Chờ xử lý',
            'Đang thực hiện',
            'Đã hoàn tất',
            'Đã huỷ',
          ],
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}>
        {[
          'awaitingPayment',
          'pendingConfirmation',
          'processing',
          'completed',
          'cancelled',
        ].map((status, index) => (
          <OrderListView
            status={status}
            orders={orders}
            handleRepeatOrder={handleRepeatOrder}
          />
        ))}
      </CustomTabView>
    </View>
  );
};

const OrderListView = ({
  status,
  orders,
  loading,
  onItemPress,
  handleRepeatOrder,
}) => {
  const STATUS_GROUPS = {
    awaitingPayment: ['awaitingPayment'],
    pendingConfirmation: ['pendingConfirmation'],
    processing: ['processing', 'readyForPickup', 'shippingOrder'],
    completed: ['completed'],
    cancelled: ['cancelled', 'failedDelivery'],
  };

  const filteredOrders =
    orders
      ?.filter(order => STATUS_GROUPS[status]?.includes(order.status))
      .sort((a, b) => {
        const dateA = new Date(a.fulfillmentDateTime).getTime();
        const dateB = new Date(b.fulfillmentDateTime).getTime();
        return dateB - dateA;
      }) || [];

  let obj = {};
  return (
    <View style={styles.scene}>
      {loading ? (
        <NormalLoading visible={true} message="Đang tải lịch sử đơn hàng..." />
      ) : filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
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
  console.log(JSON.stringify(item, null, 2));
  return (
    <TouchableOpacity
      onPress={() => handleRepeatOrder(item._id)}
      style={{
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        backgroundColor: colors.fbBg,
        marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
      }}>
      <ItemOrderType deliveryMethod={item.deliveryMethod} />
      <View
        style={{
          flexDirection: 'column',
          gap: GLOBAL_KEYS.GAP_SMALL,
          width: '30%',
        }}>
        <Text>Đơn hàng: {item._id}</Text>
        <Text>
          {item.owner?.firstName
            ? 'Khách hàng: ' + item.owner.firstName + ' ' + item.owner.lastName
            : 'Khách hàng vãng lai'}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          gap: GLOBAL_KEYS.GAP_SMALL,
        }}>
        <ItemOrderText deliveryMethod={item.deliveryMethod} />
        <Text>{item.paymentMethod}</Text>
      </View>
      <View style={{flex: Column, gap: GLOBAL_KEYS.GAP_SMALL, width: '20%'}}>
        <Text>{TextFormatter.formatCurrency(item.totalPrice)}</Text>

        <Text>{TextFormatter.formatDateTime(item.fulfillmentDateTime)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getEmptyMessage = status => {
  switch (status) {
    case 'pendingConfirmation':
      return 'Chưa có đơn hàng chờ xử lý';
    case 'processing':
      return 'Chưa có đơn hàng đang thực hiện';
    case 'completed':
      return 'Chưa có đơn hàng hoàn thành';
    case 'cancelled':
      return 'Chưa có đơn hàng đã hủy';
  }
};
const ItemOrderType = ({deliveryMethod}) => {
  const imageMap = {
    pickup: require('../../assets/serving-method/takeaway.png'),
    delivery: require('../../assets/serving-method/delivery.png'),
  };

  return (
    <Image
      style={styles.orderTypeIcon}
      source={imageMap[deliveryMethod] || imageMap['pickup']}
    />
  );
};

const ItemOrderText = ({deliveryMethod}) => {
  const textMap = {
    pickup: 'Mang đi',
    delivery: 'Giao tận nơi',
  };

  return (
    <Text style={styles.orderTime}>{textMap[deliveryMethod] || 'Mang đi'}</Text>
  );
};

const EmptyView = ({message}) => (
  <View style={styles.emptyContainer}>
    <Image
      style={styles.emptyImage}
      resizeMode="cover"
      source={require('../../assets/images/logo.png')}
    />
    <Text>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  scene: {
    width: '100%',
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  emptyContainer: {justifyContent: 'center', alignItems: 'center'},
  emptyImage: {width: width / 2, height: width / 2},
  orderItem: {
    margin: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomColor: colors.gray200,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  orderColumn: {
    width: '70%',
  },
  orderColumnEnd: {justifyContent: 'center', alignItems: 'center'},
  orderName: {fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500'},
  orderTime: {fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.gray850},
  orderTotal: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.pink500,
  },
  buttonContainer: {alignItems: 'center', justifyContent: 'center'},
  buttonText: {
    padding: 6,
    backgroundColor: colors.primary,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    color: colors.white,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  orderTypeIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    resizeMode: 'cover',
  },
});

export default OrderHistoryScreen;
