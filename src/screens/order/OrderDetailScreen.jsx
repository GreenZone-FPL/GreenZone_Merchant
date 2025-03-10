import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import {Icon, IconButton} from 'react-native-paper';
import {
  Column,
  DualTextRow,
  NormalText,
  OverlayStatusBar,
  Row,
  TitleText,
  Ani_ModalLoading,
} from '../../components';
import {
  GLOBAL_KEYS,
  colors,
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
  checkPaymentStatus,
} from '../../constants';
import {getOrderDetail, updateOrderStatus} from '../../axios/index';
import {TextFormatter} from '../../utils';

const {width} = Dimensions.get('window');

const OrderDetailScreen = ({
  idOrder,
  setIsModalOrderDetail,
  isModalOrderDetail,
}) => {
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState(null);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await getOrderDetail(idOrder);
      setOrderDetail(response.data);
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

  return (
    <Modal visible={isModalOrderDetail} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <OverlayStatusBar />
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

          {orderDetail?.deliveryMethod === DeliveryMethod.DELIVERY.value && (
            <ShipperInfo />
          )}
          <MerchantInfo data={orderDetail?.store} />
          <RecipientInfo data={orderDetail} />
          <ProductsInfo data={orderDetail?.orderItems} />
          <PaymentDetails
            data={orderDetail}
            setIsModalOrderDetail={setIsModalOrderDetail}
          />
        </ScrollView>
      </View>
      {/* <Ani_ModalLoading loading={loading} /> */}
    </Modal>
  );
};

const ShipperInfo = ({messageClick}) => {
  return (
    <Row style={styles.shipperRow}>
      <Image
        style={styles.shipperImage}
        source={require('../../assets/images/helmet.png')}
      />
      <Column style={styles.shipperColumn}>
        <NormalText text="Shipper" style={styles.shipperTitle} />
        <Row style={styles.shipperRatingRow}>
          <Icon source="star" color={colors.yellow700} size={20} />
          <NormalText text="5.0" />
          <NormalText text="60B7-40035" style={{color: colors.yellow700}} />
        </Row>
      </Column>
      <Row style={styles.shipperActionRow}>
        <Icon source="phone-outline" color={colors.black} size={20} />
        <Pressable onPress={messageClick}>
          <Icon source="message-outline" color={colors.black} size={20} />
        </Pressable>
      </Row>
    </Row>
  );
};

const MerchantInfo = ({data}) => {
  return (
    <View style={styles.areaContainer}>
      <Title title="Cửa hàng" icon="store" />
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

const PaymentDetails = ({data, setIsModalOrderDetail}) => {
  if (!data) return null;
  // console.log('>>>>>>.', JSON.stringify(data, null, 2));

  let orderItems = data?.orderItems || [];
  const totalPrice = calculateTotalPrice(data);
  const discountAmount = calculateVoucher(totalPrice);
  const finalTotal = totalPrice - discountAmount + (data?.shippingFee || 0);
  const paymentStatus = checkPaymentStatus(data);

  function calculateTotalPrice(data) {
    if (!data || !data.orderItems) return 0;
    return data.orderItems.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      let toppingTotal = 0;
      if (Array.isArray(item.toppingItems)) {
        toppingTotal = item.toppingItems.reduce(
          (sum, topping) =>
            sum + (topping.price || 0) * (topping.quantity || 1),
          0,
        );
      }
      return total + itemTotal + toppingTotal;
    }, 0);
  }

  function calculateVoucher(totalPrice) {
    if (!data?.voucher) return 0;
    if (data.voucher.discountType === 'percentage') {
      return (data.voucher.discountValue * totalPrice) / 100;
    }
    if (data.voucher.discountType === 'fixedAmount') {
      return data.voucher.discountValue;
    }
    return 0;
  }

  const updateStatus = async status => {
    try {
      const response = await updateOrderStatus(data._id, status);
      return response;
    } catch (error) {
      console.log('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      throw error;
    }
  };

  const showAlert = ({notification, message, onPress}) => {
    Alert.alert(notification, message, [
      {text: 'Huỷ', style: 'cancel'},
      {text: 'Xác Nhận', onPress: onPress},
    ]);
  };

  const goProcessing = () => {
    showAlert({
      notification: 'Xác nhận đơn hàng',
      message: 'Chuyển trạng thái đơn hàng Chờ thanh toán sang Đang xử lý',
      onPress: async () => {
        try {
          await updateStatus(OrderStatus.PROCESSING.value);
          setIsModalOrderDetail(false);
        } catch (error) {
          console.log(
            'Chuyển trạng thái đơn hàng Chờ thanh toán sang Đang xử lý thất bại:',
            error,
          );
        }
      },
    });
  };

  const goReadyForPickup = () => {
    showAlert({
      notification: 'Xác nhận đơn hàng',
      message: 'Chuyển trạng thái đơn hàng "Đang xử lý" sang "Chờ lấy hàng"',
      onPress: async () => {
        try {
          await updateStatus(OrderStatus.READY_FOR_PICKUP.value);
          setIsModalOrderDetail(false);
        } catch (error) {
          console.log(
            'Chuyển trạng thái đơn hàng "Đang xử lý" sang "Chờ lấy hàng"',
            error,
          );
        }
      },
    });
  };

  const goCancelled = () => {
    showAlert({
      notification: 'Xác nhận huỷ đơn hàng',
      message: 'Bạn có chắc chắn muốn huỷ đơn hàng này?',
      onPress: async () => {
        try {
          await updateStatus(OrderStatus.CANCELLED.value);
          setIsModalOrderDetail(false);
        } catch (error) {
          console.log('Cập nhật trạng thái sang Huỷ thất bại:', error);
        }
      },
    });
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
          leftText: `Tạm tính (${orderItems.length} sản phẩm)`,
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
          rightTextStyle: {color: colors.primary},
        },
        {
          leftText: paymentStatus,
          rightText: TextFormatter.formatCurrency(data.totalPrice || 0),
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
          rightText: TextFormatter.formatDateTime(data?.fulfillmentDateTime),
        },
        {
          leftText: 'Thanh toán',
          rightText:
            data?.paymentMethod === PaymentMethod.COD.value
              ? 'Tiền mặt'
              : 'Chuyển khoản',
          rightTextStyle: {fontWeight: '700', color: colors.primary},
        },
      ].map((item, index) => (
        <DualTextRow key={index} {...item} />
      ))}
      {data?.status !== OrderStatus.CANCELLED.value &&
        data?.status !== OrderStatus.FAILED_DELIVERY.value && (
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => {
                if (data?.status === OrderStatus.PENDING_CONFIRMATION.value) {
                  return goProcessing();
                }
                if (data?.status === OrderStatus.PROCESSING.value) {
                  return goReadyForPickup();
                }
              }}>
              <NormalText text="Xác nhận" style={styles.buttonText} />
            </Pressable>
            {data?.status !== OrderStatus.READY_FOR_PICKUP.value && (
              <Pressable style={styles.button1} onPress={goCancelled}>
                <NormalText text="Huỷ" style={styles.buttonTextWhite} />
              </Pressable>
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
  modalContainer: {
    backgroundColor: colors.overlay,
    flex: 1,
    overflow: 'hidden',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  modalContent: {
    width: '70%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    flexDirection: 'column',
    gap: GLOBAL_KEYS.GAP_SMALL,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
  },
  headerRow: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
    marginBottom: 30,
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
    paddingTop: 20,
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT * 2,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
  },
  button1: {
    backgroundColor: colors.red900,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 2,
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
});

export default React.memo(OrderDetailScreen);
