import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import {
  getEmployeesAllAvailable,
  getOrderDetail,
  updateOrderStatus,
} from '../../axios/index';
import {
  DualTextRow,
  NormalText,
  OverlayStatusBar,
  Row,
  TitleText,
  Column,
  HorizontalProductItem,
} from '../../components';
import {
  DeliveryMethod,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
  checkPaymentStatus,
  colors,
} from '../../constants';
import { TextFormatter } from '../../utils';

const { width } = Dimensions.get('window');

// Định nghĩa một số style chung để tránh tham chiếu động bên trong StyleSheet
const commonRowStyle = {
  // Nếu bạn có style row dùng chung, định nghĩa ở đây (nếu không, có thể để trống)
};
const commonNormalText = {
  fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  color: colors.black,
};
const Title = ({
  title,
  icon,
  titleStyle,
  iconColor = colors.primary,
  iconSize = GLOBAL_KEYS.ICON_SIZE_DEFAULT,
}) => {
  return (
    <View style={styles.titleContainer}>
      {icon && <Icon source={icon} color={iconColor} size={iconSize} />}
      <Text style={[styles.greenText, titleStyle]}>{title}</Text>
    </View>
  );
};

const OrderDetailScreen = ({
  idOrder,
  setIdOrder,
  setIsModalOrderDetail,
  isModalOrderDetail,
  fetchOrders,
}) => {
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  }, []);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await getOrderDetail(idOrder);
      setOrderDetail(response.data);
      setStatus(response.data.status);
    } catch (error) {
      console.log('Lỗi lấy chi tiết đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusLabel = value => {
    const statusEntry = Object.values(OrderStatus).find(
      status => status.value === value,
    );
    return statusEntry ? statusEntry.label : 'Trạng thái không xác định';
  };

  useEffect(() => {
    if (idOrder == null) return;
    fetchOrderDetail();
  }, [idOrder]);

  useEffect(() => {
    if (status !== null) {
      fetchOrderDetail();
    }
  }, [status]);

  const statusKey = orderDetail
    ? Object.keys(OrderStatus).find(
      key => OrderStatus[key].value === orderDetail?.status,
    )
    : null;
  const statusLabel = statusKey ? OrderStatus[statusKey].label : '';

  return (
    <Modal visible={isModalOrderDetail} transparent animationType="fade">
      <OverlayStatusBar />
      <View style={styles.body}>
        <TouchableOpacity
          onPress={() => setIsModalOrderDetail(false)}
          style={styles.viewClose}
        />
        <View style={styles.modalContainer}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={styles.modalContent}>
            <Row style={styles.headerRow}>
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
            </Row>

            <Row
              style={{
                paddingVertical: 8,
                marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
                marginBottom: GLOBAL_KEYS.GAP_SMALL,
                justifyContent: 'space-between',
                flex: 1
              }}>
              <Title title="Trạng thái đơn hàng" titleStyle={{ color: colors.black2 }} />

              <Text style={[styles.status, { color: orderDetail?.status === 'cancelled' ? colors.black : colors.green500 }]}>
                {getOrderStatusLabel(orderDetail?.status)}
              </Text>
            </Row>

            {Object.keys(orderDetail?.shippingAddress || {}).length > 0 && (
              <ShipperInfo shipper={orderDetail?.shipper} />
            )}
            <MerchantInfo data={orderDetail?.store} />
            <RecipientInfo data={orderDetail} />
            <ProductsInfo orderItems={orderDetail?.orderItems} />
            <PaymentDetails
              data={orderDetail}
              setIsModalOrderDetail={setIsModalOrderDetail}
              fetchOrders={fetchOrders}
              setIdOrder={setIdOrder}
              scrollViewRef={scrollViewRef}
            />
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

const MerchantInfo = ({ data }) => {
  return (
    <View style={styles.areaContainer}>
      <Title title="Cửa hàng" icon="store" />
      <Title title={data?.name} titleStyle={{ color: colors.black }} />
      <Text style={styles.normalText}>
        {`${data?.specificAddress}, ${data?.ward}, ${data?.district}, ${data?.province}`}
      </Text>
    </View>
  );
};

const RecipientInfo = ({ data }) => (
  <View style={styles.areaContainer}>
    <Title title="Người nhận" icon="map-marker" />
    <Title
      title={
        data?.owner && Object.keys(data.owner).length > 0
          ? `${data?.owner.firstName} ${data?.owner.lastName} | ${data?.owner.phoneNumber}`
          : 'Khách vãng lai'
      }
      titleStyle={{ color: colors.black }}
    />
    <NormalText
      text={
        DeliveryMethod[
          Object.keys(DeliveryMethod).find(
            key => DeliveryMethod[key].value === data?.deliveryMethod,
          )
        ]?.label || 'Không xác định'
      }
    />
  </View>
);

const ProductsInfo = ({ orderItems }) => {
  return (
    <View style={[styles.areaContainer, { borderBottomWidth: 0 }]}>

      <Title title={'Danh sách sản phẩm'} icon="clipboard-list" />


      <FlatList
        data={orderItems}
        keyExtractor={item => item.product._id}
        renderItem={({ item }) => {
          const formattedItem = {
            productName: item.product.name,
            image: item.product.image,
            variantName: item.product.size,
            price: item.price,
            quantity: item.quantity,
            isVariantDefault: false,
            toppingItems: Array.isArray(item.toppingItems)
              ? item.toppingItems
              : [],
          };
          return (
            <HorizontalProductItem
              item={formattedItem}
              enableAction={false}
            />
          );
        }}
        contentContainerStyle={styles.flatListContentContainer}
        scrollEnabled={false}
      />
    </View>
  );
};

const PaymentDetails = ({
  data,
  setIsModalOrderDetail,
  fetchOrders,
  setIdOrder,
  scrollViewRef,
}) => {
  const totalPrice = calculateTotalPrice(data?.orderItems || []);


  const voucher =
    data?.voucher && Object.keys(data?.voucher).length > 0
      ? data?.voucher
      : null;
  const discountAmount = calculateVoucher(totalPrice, voucher);


  const getPaymentStatus = (status, paymentMethod) => {
    if (status === 'completed') {
      return { text: 'Đã thanh toán', color: colors.primary };
    }
    if (paymentMethod === 'cod') {
      return { text: 'Chưa thanh toán', color: colors.orange700 };
    }
    if (status === 'awaitingPayment') {
      return { text: 'Chờ thanh toán', color: colors.pink500 };
    }
    return { text: 'Đã thanh toán', color: colors.primary };
  };


  const paymentStatus = getPaymentStatus(data?.status, data?.paymentMethod);
  const [selectedShipper, setSelectedShipper] = useState(null);

  function calculateTotalPrice(items) {
    if (!Array.isArray(items)) return 0; // Đảm bảo items là mảng
    return items.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      const toppingTotal = (item.toppingItems || []).reduce(
        (sum, topping) => sum + (topping.price || 0) * (topping.quantity || 1),
        0,
      );
      return total + itemTotal + toppingTotal;
    }, 0);
  }

  function calculateVoucher(totalPrice, voucher) {
    if (!voucher) return 0;
    return voucher.discountType === 'percentage'
      ? (voucher.discountValue * totalPrice) / 100
      : voucher.discountValue || 0;
  }

  const updateStatus = async (status, deliveryMethod) => {
    try {
      const response = await updateOrderStatus(
        data?._id,
        status,
        deliveryMethod,
      );
      return response.data;
    } catch (error) {
      console.log(`Lỗi khi cập nhật trạng thái đơn hàng:`, error);
      throw error;
    }
  };

  const showAlert = ({ notification, message, onPress }) => {
    Alert.alert(notification, message, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xác Nhận', onPress },
    ]);
  };

  const handleStatusUpdate = async newStatus => {
    try {
      await updateStatus(newStatus);
      await fetchOrders();
      setIdOrder(null);
    } catch (error) {
      console.log(`Cập nhật trạng thái đơn hàng thất bại:`, error);
    } finally {
      setIsModalOrderDetail(false);
    }
  };

  useEffect(() => {
    if (!selectedShipper || !selectedShipper._id) {
      return;
    }
    showAlert({
      notification: 'Xác nhận giao hàng',
      message:
        'Chuyển trạng thái đơn hàng sang "Đơn Hàng Đã Giao Cho Shipper"?',
      onPress: async () => {
        await handleStatusUpdateWithShipper(
          OrderStatus.READY_FOR_PICKUP.value,
          selectedShipper._id,
        );
        setSelectedShipper(null);
      },
    });
  }, [selectedShipper]);

  const handleStatusUpdateWithShipper = async (status, shipperId) => {
    try {
      console.log('Status gửi lên:', status);
      console.log('Shipper ID gửi lên:', shipperId);
      await updateOrderStatus(data?._id, status, 'delivery', shipperId);
      await fetchOrders();
      console.log(`Cập nhật trạng thái thành công:`, status);
    } catch (error) {
      console.log(`Lỗi cập nhật trạng thái đơn hàng:`, error);
    } finally {
      setIsModalOrderDetail(false);
    }
  };

  const ShipperSelect = ({ onSelect, scrollViewRef }) => {
    const [shippers, setShippers] = useState([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
      fetchShippers();
    }, []);

    const fetchShippers = async () => {
      try {
        const response = await getEmployeesAllAvailable();
        setShippers(response.data);
      } catch (error) {
        console.log('Lỗi khi lấy danh sách shipper:', error);
      }
    };

    useEffect(() => {
      if (shippers.length > 0) {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    }, [shippers]);

    const handleSelectShipper = shipper => {
      console.log('Shipper được chọn:', JSON.stringify(shipper, null, 2));
      onSelect(shipper);
      setExpanded(false);
    };

    return (
      <View>
        <Pressable
          onPress={() => setExpanded(!expanded)}
          style={styles.selectBox}>
          <Title title="Chọn Shipper" icon="moped-electric" />
        </Pressable>
        {expanded && (
          <View>
            {shippers.map(item => (
              <Pressable
                key={item._id}
                onPress={() => handleSelectShipper(item)}
                style={styles.shipperItem}>
                <Title title={`${item.firstName} ${item.lastName}`} />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  };

  const handleOrderStatusButtons = () => {
    switch (data?.status) {
      case OrderStatus.PENDING_CONFIRMATION.value:
        return (
          <>
            <Pressable
              style={styles.button}
              onPress={() =>
                showAlert({
                  notification: 'Xác nhận đơn hàng',
                  message: 'Bạn có chắc chắn muốn xác nhận đơn hàng này?',
                  onPress: () =>
                    handleStatusUpdate(OrderStatus.PROCESSING.value),
                })
              }>
              <NormalText text="Xác nhận" style={styles.buttonText} />
            </Pressable>
            <Pressable
              style={styles.button1}
              onPress={() =>
                showAlert({
                  notification: 'Xác nhận huỷ đơn hàng',
                  message: 'Bạn có chắc chắn muốn huỷ đơn hàng này?',
                  onPress: () =>
                    handleStatusUpdate(OrderStatus.CANCELLED.value),
                })
              }>
              <NormalText text="Huỷ" style={styles.buttonTextWhite} />
            </Pressable>
          </>
        );
      case OrderStatus.PROCESSING.value:
        return (
          <>
            {data.deliveryMethod === DeliveryMethod.DELIVERY.value ? (
              <ShipperSelect
                onSelect={setSelectedShipper}
                scrollViewRef={scrollViewRef}
              />
            ) : (
              <Pressable
                style={styles.button}
                onPress={() =>
                  showAlert({
                    notification: 'Đơn Đã Hoàn Tất Sẵn Sàng Đến Lấy',
                    message: '"Đơn Đã Hoàn Tất Sẵn Sàng Đến Lấy"?',
                    onPress: () =>
                      handleStatusUpdate(OrderStatus.READY_FOR_PICKUP.value),
                  })
                }>
                <NormalText text="Sẵn Sàng Đến Lấy" style={styles.buttonText} />
              </Pressable>
            )}
          </>
        );
      case OrderStatus.READY_FOR_PICKUP.value:
        return (
          <>
            {data.deliveryMethod === DeliveryMethod.DELIVERY.value ? (
              <Pressable
                style={styles.button}
                onPress={() =>
                  showAlert({
                    notification: 'Đơn Đang Được Giao Cho Shipper',
                    message: 'Đơn Giao Cho Shipper Thành Công',
                    onPress: () =>
                      handleStatusUpdate(OrderStatus.SHIPPING_ORDER.value),
                  })
                }>
                <NormalText
                  text="Giao thành công cho Shipper"
                  style={styles.buttonText}
                />
              </Pressable>
            ) : (
              <Pressable
                style={styles.button}
                onPress={() =>
                  showAlert({
                    notification: 'Đơn Đã Hoàn Thành',
                    message: '"Đơn Đã Hoàn Thành"?',
                    onPress: () =>
                      handleStatusUpdate(OrderStatus.COMPLETED.value),
                  })
                }>
                <NormalText text="Đã Hoàn Thành" style={styles.buttonText} />
              </Pressable>
            )}
          </>
        );
      case OrderStatus.SHIPPING_ORDER.value:
        return (
          <>
            <Pressable
              style={styles.button}
              onPress={() =>
                showAlert({
                  notification: 'Đơn Đã Hoàn Thành',
                  message: 'Đơn hàng đã được giao thành công?',
                  onPress: () =>
                    handleStatusUpdate(OrderStatus.COMPLETED.value),
                })
              }>
              <NormalText text="Đã Hoàn Thành" style={styles.buttonText} />
            </Pressable>
            <Pressable
              style={styles.button1}
              onPress={() =>
                showAlert({
                  notification: 'Giao hàng thất bại',
                  message: 'Đơn hàng giao không thành công?',
                  onPress: () =>
                    handleStatusUpdate(OrderStatus.FAILED_DELIVERY.value),
                })
              }>
              <NormalText text="Giao Thất Bại" style={styles.buttonTextWhite} />
            </Pressable>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.paymentDetailsContainer}>
      <DualTextRow
        leftText="CHI TIẾT THANH TOÁN"
        leftTextStyle={styles.dualTextLeftHeader}
      />
      <OrderId data={data?._id} />
      {[
        {
          leftText: `Tạm tính (${(data?.orderItems || []).reduce(
            (sum, item) => sum + (item.quantity || 0),
            0,
          )} sản phẩm)`,
          rightText: TextFormatter.formatCurrency(totalPrice),
        },
        {
          leftText: 'Phí giao hàng',
          rightText: TextFormatter.formatCurrency(
            data?.deliveryMethod === DeliveryMethod.DELIVERY.value
              ? data?.shippingFee || 0
              : 0,
          ),
        },
        {
          leftText: 'Giảm giá',
          rightText: `-${TextFormatter.formatCurrency(discountAmount)}`,
          rightTextStyle: { color: colors.primary },
        },
        {
          leftText: 'Tổng tiền',
          rightText: `${(totalPrice).toLocaleString('vi-VN')}đ`,
          rightTextStyle: { color: colors.primary, fontWeight: '700', fontSize: 18 },
          leftTextStyle: { color: colors.primary, fontWeight: '700' },
        },
        {
          leftText: 'Trạng thái thanh toán',
          rightText: paymentStatus.text,
          leftTextStyle: {
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderWidth: 1,
            borderRadius: 6,
            borderColor: paymentStatus.color,
            color: paymentStatus.color,
          },
          rightTextStyle: { color: paymentStatus.color },
        },
        {
          leftText: 'Thời gian đặt hàng',
          rightText: TextFormatter.formatDateTime(data?.fulfillmentDateTime),
        },
        {
          leftText: 'Thanh toán',
          rightText:
            data?.paymentMethod === PaymentMethod.COD.value
              ? 'Tiền mặt'

              : 'Chuyển khoản',
          rightTextStyle: { fontWeight: '700', color: colors.primary },
        },
      ].map((item, index) => (
        <DualTextRow key={index} {...item} />
      ))}
      {data?.status !== OrderStatus.CANCELLED.value &&
        data?.status !== OrderStatus.FAILED_DELIVERY.value && (
          <View style={styles.buttonContainer}>
            {handleOrderStatusButtons()}
          </View>
        )}
    </View>
  );
};

const OrderId = ({ data }) => {
  return (
    <Row style={styles.orderIdRow}>
      <NormalText text="Mã đơn hàng" />
      <Pressable style={styles.orderIdPressable} onPress={() => { }}>
        <Text style={styles.orderIdText}>{data}</Text>
        <Icon source="content-copy" color={colors.teal900} size={18} />
      </Pressable>
    </Row>
  );
};

const ShipperInfo = ({ shipper }) => {
  return Object.keys(shipper || {}).length === 0 ? (
    <Row
      style={{
        gap: 16,
        marginVertical: 8,
        marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
      }}>
      <NormalText text="Chưa chọn Shipper" style={{ fontWeight: '500' }} />
    </Row>
  ) : (
    <Row style={{ gap: 16, margin: 16 }}>
      <Image
        style={{ width: 40, height: 40 }}
        source={require('../../assets/images/helmet.png')}
      />
      <Column style={{ flex: 1 }}>
        <NormalText text="Nhân viên giao hàng" style={{ fontWeight: '500' }} />
        <Text
          style={{ fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.orange700 }}>
          {shipper?.firstName ? `${shipper.firstName} ${shipper.lastName} ` : 'Đang chuẩn bị ...'}
        </Text>
      </Column>
    </Row>
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
  modalContent: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
  },
  headerRow: {
    width: '100%',
    backgroundColor: 'white',
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
    alignSelf: 'flex-end',
  },
  titleHeader: {
    fontWeight: '500',
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
  },
  areaContainer: {
    borderTopWidth: 1,
    borderColor: colors.gray200,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_SMALL / 2,
  },
  productContainer: {
    flexDirection: 'row',
    width: width,
    gap: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
  },
  productColumn: {
    flexDirection: 'column',
  },
  productInfo: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  productName: {
    fontWeight: '500',
  },
  productSize: {},
  productQuantity: {},
  productPrice: {},
  boldText: {
    fontWeight: '500',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  flatList: {
    marginTop: 8,
  },
  flatListContent: {
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  greenText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.primary,
    fontWeight: '600',
  },
  paymentDetailsContainer: {
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: 6
  },
  dualTextLeftHeader: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  dualTextStatus: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT * 4,
    borderTopWidth: 1,
    borderColor: colors.gray200,
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
    minWidth: '15%',
    alignSelf: 'flex-start',
  },
  button1: {
    backgroundColor: colors.red900,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
    minWidth: '15%',
  },
  buttonText: {
    color: colors.white,
  },
  buttonTextWhite: {
    color: colors.white,
  },
  orderIdRow: {
    ...commonRowStyle, // sử dụng style row chung nếu cần, hoặc bạn có thể bỏ hoàn toàn nếu không cần
    marginBottom: 6,
  },
  orderIdPressable: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'flex-end',
    flex: 1,
  },
  orderIdText: {
    ...commonNormalText,
    fontWeight: 'bold',
    marginRight: 8,
  },
  normalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  shipperRow: {
    gap: 16,
    borderTopWidth: 2,
    borderColor: colors.gray200,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  shipperImage: {
    width: 40,
    height: 40,
  },
  shipperColumn: {
    flex: 1,
  },
  shipperTitle: {
    fontWeight: '500',
  },
  shipperRatingRow: {
    gap: 8,
  },
  shipperActionRow: {
    gap: 24,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shipperItem: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.green100,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    marginTop: GLOBAL_KEYS.PADDING_DEFAULT,
  },

  status: { fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT, color: colors.green500, fontWeight: '500' },
});

export default React.memo(OrderDetailScreen);
