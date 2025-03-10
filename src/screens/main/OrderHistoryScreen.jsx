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
import {getOrders} from '../../axios/index';
import {
  Ani_ModalLoading,
  Column,
  CustomTabView,
  LightStatusBar,
  NormalLoading,
} from '../../components';
import {colors, GLOBAL_KEYS, OrderStatus, PaymentMethod} from '../../constants';
import {TextFormatter} from '../../utils';
import OrderDetailScreen from '../order/OrderDetailScreen';
import {jsiConfigureProps} from 'react-native-reanimated/lib/typescript/core';

const width = Dimensions.get('window').width;

const OrderHistoryScreen = props => {
  const {navigation} = props;

  const [pendingConfirmation, setPendingConfirmation] = useState([]); //'Chờ xác nhận',
  const [processing, setProcessing] = useState([]); // 'Đang xử lý',
  const [readyForPickup, setReadyForPickup] = useState([]); //'Chờ lấy hàng'
  const [cancelled, setCancelled] = useState([]); //'Đã huỷ'
  const [failedDelivery, setFailedDelivery] = useState([]); // 'Giao hàng thất bại',

  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOrderDetail, setIsModalOrderDetail] = useState(false);
  const [idOrder, setIdOrder] = useState(null);

  ///
  const feathOrders = async ({status, setOrders}) => {
    setLoading(true);
    try {
      const response = await getOrders(status);
      setOrders(response.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };
  //
  useEffect(() => {
    feathOrders({
      status: OrderStatus.PENDING_CONFIRMATION.value,
      setOrders: setPendingConfirmation,
    });
  }, []);
  //
  useEffect(() => {
    feathOrders({
      status: OrderStatus.PROCESSING.value,
      setOrders: setProcessing,
    });
  }, []);
  //
  useEffect(() => {
    feathOrders({
      status: OrderStatus.READY_FOR_PICKUP.value,
      setOrders: setReadyForPickup,
    });
  }, []);
  //
  useEffect(() => {
    feathOrders({
      status: OrderStatus.CANCELLED.value,
      setOrders: setCancelled,
    });
  }, []);
  //
  useEffect(() => {
    feathOrders({
      status: OrderStatus.FAILED_DELIVERY.value,
      setOrders: setFailedDelivery,
    });
  }, []);

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
            'Giao hàng thất bại',
            'Đã huỷ',
          ],
          titleActiveColor: colors.primary,
          titleInActiveColor: colors.gray700,
        }}>
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={pendingConfirmation}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={processing}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={readyForPickup}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={failedDelivery}
        />
        <OrderListView
          handleRepeatOrder={handleRepeatOrder}
          orders={cancelled}
        />
      </CustomTabView>
      <Ani_ModalLoading loading={loading} />
      <OrderDetailScreen
        setIsModalOrderDetail={setIsModalOrderDetail}
        isModalOrderDetail={isModalOrderDetail}
        idOrder={idOrder}
      />
    </View>
  );
};

const OrderListView = ({orders, loading, handleRepeatOrder}) => {
  console.log('>>>', JSON.stringify(orders[1], null, 2));
  const filteredOrders =
    orders.sort((a, b) => {
      const dateA = new Date(a.fulfillmentDateTime).getTime();
      const dateB = new Date(b.fulfillmentDateTime).getTime();
      return dateB - dateA;
    }) || [];

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
        <EmptyView message={getEmptyMessage(orders.status)} />
      )}
    </View>
  );
};

const Item = ({item, handleRepeatOrder}) => {
  // console.log(JSON.stringify(item, null, 2));
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
        <Text style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT}}>
          Đơn hàng: <Text style={{fontWeight: '500'}}>{item._id}</Text>
        </Text>
        <Text style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT}}>
          {item.owner?.firstName
            ? 'Khách hàng: ' + item.owner.firstName + ' ' + item.owner.lastName
            : 'Khách hàng vãng lai'}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          gap: GLOBAL_KEYS.GAP_SMALL,
          width: '20%',
        }}>
        <ItemOrderText deliveryMethod={item.deliveryMethod} />
        <Text
          style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500'}}>
          {item.paymentMethod == PaymentMethod.COD.value
            ? 'Thanh toán tiền mặt'
            : 'Thanh toán ngân hàng'}
        </Text>
      </View>
      <View style={{flex: Column, gap: GLOBAL_KEYS.GAP_SMALL, width: '20%'}}>
        <Text
          style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, fontWeight: '500'}}>
          {TextFormatter.formatCurrency(item.totalPrice)}
        </Text>

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
  emptyImage: {width: width / 3, height: width / 3},
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
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
});

export default OrderHistoryScreen;
