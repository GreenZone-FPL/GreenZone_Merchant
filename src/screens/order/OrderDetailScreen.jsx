import React, {useEffect, useState} from 'react';
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
import {Icon, IconButton} from 'react-native-paper';
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
} from '../../components';
import {
  DeliveryMethod,
  GLOBAL_KEYS,
  OrderStatus,
  PaymentMethod,
  checkPaymentStatus,
  colors,
} from '../../constants';
import {TextFormatter} from '../../utils';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const {width} = Dimensions.get('window');

const OrderDetailScreen = ({
  idOrder,
  setIdOrder,
  setIsModalOrderDetail,
  isModalOrderDetail,
  fetchOrders,
}) => {
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await getOrderDetail(idOrder);
      setOrderDetail(response.data);
      setStatus(response.data.status);
      console.log('>>>>>>', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('Lỗi lấy chi tiết đơn hàng:', error);
    } finally {
      setLoading(false);
    }
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
                size={GLOBAL_KEYS.ICON_SIZE_SMALL}
                iconColor={colors.primary}
                style={styles.closeButton}
                onPress={() => setIsModalOrderDetail(false)}
              />
            </Row>

            <Title
              title={
                OrderStatus[
                  Object.keys(OrderStatus).find(
                    key => OrderStatus[key].value === orderDetail?.status,
                  )
                ]?.label || ''
              }
              titleStyle={[
                styles.titleHeader,
                {
                  color:
                    orderDetail?.status === OrderStatus.CANCELLED.value ||
                    orderDetail?.status === OrderStatus.FAILED_DELIVERY.value
                      ? colors.red900
                      : colors.primary,
                },
              ]}
            />
            <MerchantInfo data={orderDetail?.store} />
            <RecipientInfo data={orderDetail} />
            <ProductsInfo data={orderDetail?.orderItems} />
            <PaymentDetails
              data={orderDetail}
              setIsModalOrderDetail={setIsModalOrderDetail}
              fetchOrders={fetchOrders}
              setIdOrder={setIdOrder}
            />
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => setIsModalOrderDetail(false)}
          style={styles.viewClose}
        />
      </View>

      {/* <Ani_ModalLoading loading={loading} /> */}
    </Modal>
  );
};

const ShipperSelect = ({onSelect}) => {
  const [shippers, setShippers] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);

  useEffect(() => {
    fetchShippers();
  }, []);

  const fetchShippers = async () => {
    try {
      const response = await getEmployeesAllAvailable();
      console.log('Danh sách shipper:', JSON.stringify(response.data, null, 2));
      setShippers(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách shipper:', error);
    }
  };

  const handleSelectShipper = shipper => {
    console.log('Shipper được chọn:', JSON.stringify(shipper, null, 2));
    setSelectedShipper(shipper);
    setExpanded(false);
    onSelect(shipper);
  };

  return (
    <View>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={styles.selectBox}>
        {selectedShipper ? (
          <Title
            title={`${selectedShipper.firstName} ${selectedShipper.lastName}`}
          />
        ) : (
          <Title title="Chọn Shipper" icon="moped-electric" />
        )}
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

const MerchantInfo = ({data}) => {
  return (
    <View style={styles.areaContainer}>
      <Title title={data?.name} titleStyle={{color: colors.black}} />
      <Text style={styles.normalText}>
        {`${data?.specificAddress}, ${data?.ward}, ${data?.district}, ${data?.province}`}
      </Text>
    </View>
  );
};

const RecipientInfo = ({data}) => (
  <View style={styles.areaContainer}>
    <Title title="Người nhận" icon="map-marker" />
    <Title
      title={
        data?.owner && Object.keys(data.owner).length > 0
          ? `${data?.owner.firstName} ${data?.owner.lastName} | ${data?.owner.phoneNumber}`
          : 'Khách vãng lai'
      }
      titleStyle={{color: colors.black}}
    />
    <Title
      title={
        DeliveryMethod[
          Object.keys(DeliveryMethod).find(
            key => DeliveryMethod[key].value === data?.deliveryMethod,
          )
        ]?.label || 'Không xác định'
      }
    />
  </View>
);

const ProductsInfo = ({data}) => {
  return (
    <View style={[styles.areaContainer, styles.areaContainerBorder]}>
      <Title title="Danh sách sản phẩm" icon="sticker-text-outline" />
      <FlatList
        data={data || []}
        keyExtractor={item => item.product._id}
        renderItem={({item}) => (
          <View style={styles.productContainer}>
            <Image
              style={styles.productImage}
              source={{uri: item.product.image}}
            />
            <View style={styles.productColumn}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product.name},</Text>
                <Text style={styles.productSize}>
                  Size: <Text style={styles.boldText}>{item.product.size}</Text>
                  ,
                </Text>
                <Text style={styles.productQuantity}>
                  Số lượng:{' '}
                  <Text style={styles.boldText}>x{item.quantity}</Text>,
                </Text>
                <Text style={styles.productPrice}>
                  Đơn giá:{' '}
                  <Text style={styles.boldText}>
                    {TextFormatter.formatCurrency(item?.price)}
                  </Text>
                </Text>
              </View>
              {item.toppingItems.length > 0 &&
                item.toppingItems.some(
                  topping => Object.keys(topping).length > 0,
                ) && (
                  <Text style={styles.toppingText}>
                    Topping:{' '}
                    {item.toppingItems
                      .filter(topping => Object.keys(topping).length > 0)
                      .map((topping, index) => (
                        <Text key={index}>
                          {topping.name || 'Không'}{' '}
                          <Text style={styles.boldText}>
                            {topping.price
                              ? TextFormatter.formatCurrency(topping.price)
                              : 'Không'}
                          </Text>
                          {index !== item.toppingItems.length - 1 ? ', ' : ''}
                        </Text>
                      ))}
                  </Text>
                )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
        scrollEnabled={false}
      />
    </View>
  );
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

const PaymentDetails = ({
  data,
  setIsModalOrderDetail,
  fetchOrders,
  setIdOrder,
}) => {
  if (!data) return null;

  const {
    orderItems = [],
    voucher,
    shippingFee = 0,
    paymentMethod,
    status,
    fulfillmentDateTime,
    deliveryMethod,
    totalPrice: totalFromData,
    _id,
  } = data;

  const totalPrice = calculateTotalPrice(orderItems);
  const discountAmount = calculateVoucher(totalPrice, voucher);
  const finalTotal = totalPrice - discountAmount + (shippingFee || 0);
  const paymentStatus = checkPaymentStatus(data);
  const [selectedShipper, setSelectedShipper] = useState(null);

  function calculateTotalPrice(items) {
    return items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
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
      const response = await updateOrderStatus(_id, status, deliveryMethod);

      return response.data;
    } catch (error) {
      console.log(`Lỗi khi cập nhật trạng thái đơn hàng:`, error);
      throw error;
    }
  };
  const showAlert = ({notification, message, onPress}) => {
    Alert.alert(notification, message, [
      {text: 'Huỷ', style: 'cancel'},
      {text: 'Xác Nhận', onPress},
    ]);
  };

  const handleStatusUpdate = async newStatus => {
    try {
      await updateStatus(newStatus);

      fetchOrders();
      setIdOrder(null);
    } catch (error) {
      console.error(`Cập nhật trạng thái đơn hàng thất bại:`, error);
    } finally {
      setIsModalOrderDetail(false);
    }
  };

  const handleStatusUpdateWithShipper = async (status, shipperId) => {
    try {
      console.log('Status gửi lên:', status);
      console.log('Shipper ID gửi lên:', shipperId);

      await updateOrderStatus(_id, status, 'delivery', shipperId);
      console.log(`Cập nhật trạng thái thành công:`, status);
      await fetchOrders();
    } catch (error) {
      console.error(`Lỗi cập nhật trạng thái đơn hàng:`, error);
    } finally {
      setIsModalOrderDetail(false);
    }
  };
  return (
    <View style={styles.paymentDetailsContainer}>
      {/* Tiêu đề chi tiết thanh toán */}
      <DualTextRow
        leftText="CHI TIẾT THANH TOÁN"
        leftTextStyle={styles.dualTextLeftHeader}
      />
      {/* Hiển thị ID đơn hàng */}
      <OrderId data={_id} />

      {/* Các thông tin chi tiết thanh toán */}
      {[
        {
          leftText: `Tạm tính (${orderItems.length} sản phẩm)`,
          rightText: TextFormatter.formatCurrency(totalPrice),
        },
        {
          leftText: 'Phí giao hàng',
          rightText: TextFormatter.formatCurrency(
            deliveryMethod === DeliveryMethod.DELIVERY.value ? shippingFee : 0,
          ),
        },
        {
          leftText: 'Giảm giá',
          rightText: `-${TextFormatter.formatCurrency(discountAmount)}`,
          rightTextStyle: {color: colors.primary},
        },
        {
          leftText: paymentStatus,
          rightText: TextFormatter.formatCurrency(totalFromData || 0),
          leftTextStyle: {
            ...styles.dualTextStatus,
            borderColor:
              paymentStatus === 'Chưa thanh toán'
                ? colors.red900
                : colors.primary,
            color:
              paymentStatus === 'Chưa thanh toán'
                ? colors.red900
                : colors.primary,
          },
          rightTextStyle: {fontWeight: '700', color: colors.primary},
        },
        {
          leftText: 'Thời gian đặt hàng',
          rightText: TextFormatter.formatDateTime(fulfillmentDateTime),
        },
        {
          leftText: 'Thanh toán',
          rightText:
            paymentMethod === PaymentMethod.COD.value
              ? 'Tiền mặt'
              : 'Chuyển khoản',
          rightTextStyle: {fontWeight: '700', color: colors.primary},
        },
      ].map((item, index) => (
        <DualTextRow key={index} {...item} />
      ))}

      {/* Kiểm tra trạng thái đơn hàng để hiển thị các nút tương ứng */}
      {status !== OrderStatus.CANCELLED.value &&
        status !== OrderStatus.FAILED_DELIVERY.value && (
          <View style={styles.buttonContainer}>
            {/* Trạng thái đang chờ xác nhận */}
            {status === OrderStatus.PENDING_CONFIRMATION.value && (
              <>
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    showAlert({
                      notification: 'Xác nhận đơn hàng',
                      message: 'Bạn có chắc chắn muốn xác nhận đơn hàng này?',
                      onPress: () =>
                        handleStatusUpdate(OrderStatus.PROCESSING.value), // Cập nhật trạng thái đơn hàng
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
                        handleStatusUpdate(OrderStatus.CANCELLED.value), // Cập nhật trạng thái huỷ đơn hàng
                    })
                  }>
                  <NormalText text="Huỷ" style={styles.buttonTextWhite} />
                </Pressable>
              </>
            )}

            {/* Trạng thái đơn hàng đang xử lý */}
            {status === OrderStatus.PROCESSING.value && (
              <>
                {deliveryMethod === DeliveryMethod.DELIVERY.value ? (
                  <>
                    {/* Chọn shipper nếu phương thức giao hàng là giao tận nơi */}
                    <ShipperSelect onSelect={setSelectedShipper} />

                    <Pressable
                      style={[
                        styles.button,
                        !selectedShipper && styles.buttonDisabled, // Nút disabled nếu chưa chọn shipper
                      ]}
                      onPress={() => {
                        if (!selectedShipper) {
                          Alert.alert(
                            'Thông báo',
                            'Vui lòng chọn Shipper trước khi xác nhận.',
                          );
                          return;
                        }
                        showAlert({
                          notification: 'Xác nhận giao hàng',
                          message:
                            'Chuyển trạng thái đơn hàng sang "Đơn Hàng Đã Giao Cho Shipper"?',
                          onPress: () =>
                            handleStatusUpdateWithShipper(
                              OrderStatus.READY_FOR_PICKUP.value,
                              selectedShipper?._id, // Cập nhật trạng thái và ID shipper
                            ),
                        });
                      }}>
                      <NormalText
                        text="Giao Cho Shipper"
                        style={styles.buttonText}
                      />
                    </Pressable>
                  </>
                ) : (
                  // Nếu phương thức giao hàng không phải giao tận nơi
                  <Pressable
                    style={styles.button}
                    onPress={() =>
                      showAlert({
                        notification: 'Đơn Đã Hoàn Tất Sẵn Sàng Đến Lấy',
                        message: '"Đơn Đã Hoàn Tất Sẵn Sàng Đến Lấy"?',
                        onPress: () =>
                          handleStatusUpdate(
                            OrderStatus.READY_FOR_PICKUP.value, // Cập nhật trạng thái là sẵn sàng để lấy
                          ),
                      })
                    }>
                    <NormalText
                      text="Sẵn Sàng Đến Lấy"
                      style={styles.buttonText}
                    />
                  </Pressable>
                )}
              </>
            )}

            {/* Trạng thái đơn hàng đã sẵn sàng để giao */}
            {status === OrderStatus.READY_FOR_PICKUP.value && (
              <>
                {deliveryMethod === DeliveryMethod.DELIVERY.value ? (
                  <Pressable
                    style={styles.button}
                    onPress={() =>
                      showAlert({
                        notification: 'Đơn Đang Được Giao',
                        message: '"Đơn Đang Được Giao"?',
                        onPress: () =>
                          handleStatusUpdate(
                            OrderStatus.SHIPPING_ORDER.value, // Cập nhật trạng thái đơn hàng đang giao
                          ),
                      })
                    }>
                    <NormalText
                      text="Đang Được Giao"
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
                          handleStatusUpdate(OrderStatus.COMPLETED.value), // Cập nhật trạng thái hoàn thành đơn hàng
                      })
                    }>
                    <NormalText
                      text="Đã Hoàn Thành"
                      style={styles.buttonText}
                    />
                  </Pressable>
                )}
              </>
            )}

            {/* Trạng thái đơn hàng đang giao */}
            {status === OrderStatus.SHIPPING_ORDER.value && (
              <>
                <Pressable
                  style={styles.button}
                  onPress={() =>
                    showAlert({
                      notification: 'Đơn Đã Hoàn Thành',
                      message: 'Đơn hàng đã được giao thành công?',
                      onPress: () =>
                        handleStatusUpdate(OrderStatus.COMPLETED.value), // Cập nhật trạng thái hoàn thành đơn hàng
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
                        handleStatusUpdate(OrderStatus.FAILED_DELIVERY.value), // Cập nhật trạng thái giao thất bại
                    })
                  }>
                  <NormalText
                    text="Giao Thất Bại"
                    style={styles.buttonTextWhite}
                  />
                </Pressable>
              </>
            )}
          </View>
        )}
    </View>
  );
};

const OrderId = ({data}) => {
  return (
    <Row style={styles.orderIdRow}>
      <NormalText text="Mã đơn hàng" />
      <Pressable style={styles.orderIdPressable} onPress={() => {}}>
        <Text style={styles.orderIdText}>{data}</Text>
        <Icon source="content-copy" color={colors.teal900} size={18} />
      </Pressable>
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
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
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
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
  },
  areaContainer: {
    borderTopWidth: 2,
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
    borderTopWidth: 2,
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
    ...this?.row, // nếu cần kế thừa row, có thể dùng spread hoặc sao chép
    marginBottom: 6,
  },
  orderIdPressable: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'flex-end',
    flex: 1,
  },
  orderIdText: {
    ...styles?.normalText,
    fontWeight: 'bold',
    marginRight: 8,
  },
  // Nếu styles.normalText đã được định nghĩa ở nơi khác, có thể import lại
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shipperItem: {
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.green100,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    padding: GLOBAL_KEYS.PADDING_SMALL,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
});

export default React.memo(OrderDetailScreen);
