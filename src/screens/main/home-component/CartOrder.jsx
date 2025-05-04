import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from 'react-native';

import {colors, GLOBAL_KEYS} from '../../../constants';
import {
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
  Camera,
} from 'react-native-vision-camera';
import {Icon, IconButton} from 'react-native-paper';
import {TextFormatter, Toaster} from '../../../utils';
import {Column, CustomFlatInput, Row} from '../../../components';
import ModalCheckout from './ModalCheckout';
import ModalSelectedPaymentMethod from './DialogPaymentMethod';
import ModalPayment from '../../order/ModalPayment';
import {
  findCustomerByCode,
  findCustomerByPhone,
  findVoucherByCode,
} from '../../../axios/index';
import ModalToppingUpdateProduct from './DialogUpdateTopping';
import {updateTotalPrice} from '../../../utils/cartManager';
import DialogSelectVouchers from '../../order/DialogSelectVouchers';

const {width} = Dimensions.get('window');

const CartOrder = ({cart, setCart}) => {
  const [scannedCode, setScannedCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [isCheckout, setIsCheckout] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customer, setCustomer] = useState(null);
  const [label, setLabel] = useState('Nhập SDT hoặc quét mã KH');
  const [isSelectedPaymentMethod, setIsSelectedPaymentMethod] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const [showSelectdTopping, setShowSelectdTopping] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [isVoucher, setIsVoucher] = useState(false);

  // useStable ModalCheckout
  const [orderItem, setOrderItem] = useState(null);

  // Lấy quyền camera
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice(cameraPosition); // Chọn camera trước hoặc sau

  // Kiểm tra quyền truy cập camera
  useEffect(() => {
    console.log('Has Camera Permission:', hasPermission);
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  // Xử lý quét mã QR
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'upc-a', 'code-128', 'code-39'],
    onCodeScanned: codes => {
      try {
        if (isVoucher === true) {
          if (codes.length > 0) {
            const scannedText = codes[0].value;
            addVoucher(scannedText);
            setIsScanning(false);
            setIsVoucher(false);
          }
        } else if (codes.length > 0) {
          const scannedText = codes[0].value;
          setScannedCode(scannedText);
          setPhoneNumber('');
          setIsScanning(false);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  // tìm kiếm khách hàng
  const fetchCustomerByCode = async code => {
    try {
      const response = await findCustomerByCode(code);
      if (response) {
        clearCustomer();
        setCustomer(response.customer);
      } else {
        setCustomer(null);
        setPhoneNumber('');
        setScannedCode('');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const fetchCustomerByPhone = async phoneNumber => {
    try {
      const response = await findCustomerByPhone(phoneNumber);
      if (response.customer) {
        clearCustomer();
        setCustomer(response.customer);
      } else {
        setCustomer(null);
        setPhoneNumber('');
        setScannedCode('');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // gọi api lấy thông tin user qua code hoặc phone
  useEffect(() => {
    if (phoneNumber !== '' && /^(03|05|07|08|09)[0-9]{8}$/.test(phoneNumber)) {
      const fetchData = async () => {
        try {
          await fetchCustomerByPhone(phoneNumber);
        } catch (error) {
          console.log('error', error);
        }
      };

      fetchData();
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (scannedCode === '') return;
    fetchCustomerByCode(scannedCode);
  }, [scannedCode]);
  // cập nhập thông tin khách hàng

  useEffect(() => {
    if (customer?._id) {
      updateCustomer(customer);
    }
  }, [customer]);

  const updateCustomer = customer => {
    setCart(prevOrder => {
      if (customer) {
        return {
          ...prevOrder,
          owner: customer._id,
          consigneeName: `${customer.firstName} ${customer.lastName}`,
          consigneePhone: customer.phoneNumber,
        };
      } else {
        setPhoneNumber('');
        setCustomer('');
        setScannedCode('');
        return {
          ...prevOrder,
          owner: null,
          consigneeName: null,
          consigneePhone: null,
        };
      }
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng neu không có orderItem nào thì nó sẽ xoá cart
  const removeFromCart = id => {
    setCart(prevCart => {
      const updatedOrderItems = prevCart.orderItems.filter(
        item => item._id !== id,
      );

      // Nếu không còn sản phẩm nào, xóa luôn giỏ hàng
      return updatedOrderItems.length > 0
        ? {...prevCart, orderItems: updatedOrderItems}
        : {}; // Hoặc {} nếu muốn giữ trạng thái object
    });
    updateTotalPrice(setCart);
  };
  // cập nhập số lượng
  const updateItemQuantity = (itemId, newQuantity) => {
    setCart(prevCart => {
      const updatedOrderItems = prevCart.orderItems.map(item => {
        if (item._id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
          };
        }
        return item;
      });

      // Tính lại tổng giá của giỏ hàng từ các orderItem
      const updatedTotalPrice = updatedOrderItems.reduce(
        (total, item) => total + item.price,
        0,
      );

      return {
        ...prevCart,
        orderItems: updatedOrderItems,
        totalPrice: updatedTotalPrice,
      };
    });
    updateTotalPrice(setCart);
  };
  // Lọc lại cart để gửi oder
  const filterCart = cart => {
    if (cart === null) return;
    const orderItems = cart?.orderItems?.map(item => ({
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      toppingItems: item.toppingItems.map(t => ({
        topping: t._id,
        quantity: t.quantity,
        price: t.extraPrice,
      })),
    }));

    return {
      deliveryMethod: cart.deliveryMethod,
      fulfillmentDateTime: new Date().toISOString(),
      note: cart.note,
      totalPrice: Math.round(cart.totalPrice),
      paymentMethod: cart.paymentMethod,
      shippingAddress: cart.shippingAddress,
      store: cart.store,
      owner: cart.owner,
      voucher: cart.voucher,
      orderItems: orderItems,
      consigneeName: cart.consigneeName,
      consigneePhone: cart.consigneePhone,
    };
  };

  useEffect(() => {
    console.log('Cart', JSON.stringify(cart, null, 2));
  }, [cart]);

  const clearCustomer = () => {
    updateCustomer(null);
    setCart(prev => ({
      ...prev,
      voucherDiscount: 0,
      voucherDiscountAmount: 0,
      voucher: null,
      voucherInfor: null,
    }));
    updateTotalPrice(setCart);
  };

  const addVoucher = async code => {
    try {
      const response = await findVoucherByCode(code, cart.consigneePhone);

      if (response.user === cart.owner) {
        await setCart(prev => {
          const updated = {
            ...prev,
            voucher: response.voucher._id,
            voucherInfor: response.voucher,
          };
          return updated;
        });
        updateTotalPrice(setCart);
      }
    } catch (error) {
      Toaster.show('Voucher không khả dụng với khách hàng này!');
      console.log('error', error);
    }
  };
  const clearVoucher = () => {
    setCart(prev => ({
      ...prev,
      voucher: null,
      voucherInfor: null,
    }));
    updateTotalPrice(setCart);
  };

  return (
    <View style={styles.rightSection}>
      {isScanning ? (
        device ? (
          <View>
            <Camera
              style={styles.camera}
              device={device}
              isActive={isScanning}
              codeScanner={codeScanner}
            />

            <View style={styles.cameraControls}>
              <Pressable
                style={styles.switchCameraButton}
                onPress={() =>
                  setCameraPosition(prev =>
                    prev === 'back' ? 'front' : 'back',
                  )
                }>
                <Icon source="camera-flip" size={32} color={colors.primary} />
              </Pressable>
              <Pressable
                style={styles.closeCameraButton}
                onPress={() => setIsScanning(false)}>
                <Icon source="close-circle" size={32} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        ) : (
          <Text>Không tìm thấy camera</Text>
        )
      ) : null}

      <View style={styles.customerInfo}>
        <View style={styles.customerContainer}>
          <Text style={styles.customerInfoTitle}>Thông tin khách hàng</Text>
          <View>
            <CustomFlatInput
              label={label}
              placeholder="Số điện thoại"
              value={phoneNumber}
              setValue={text => {
                const formatted = text.replace(/[^0-9]/g, '');
                if (formatted.length <= 10) {
                  setPhoneNumber(formatted);
                }
              }}
            />
            <Pressable
              style={styles.cameraIcon}
              onPress={() => setIsScanning(true)}>
              <Icon source="barcode-scan" size={24} color={colors.primary} />
            </Pressable>
          </View>
          <View>
            <Text style={styles.customerDetails}>
              Khách hàng: {cart?.owner ? cart?.consigneeName : ' Vãng lai'}
            </Text>
            <Text style={styles.customerDetails}>
              Số điện thoại: {cart?.owner ? cart?.consigneePhone : ''}
            </Text>
            {(cart?.owner || customer?.phoneNumber) && (
              <View style={styles.closeButtonContainer}>
                <IconButton
                  icon="close"
                  size={24}
                  iconColor={colors.gray700}
                  onPress={() => {
                    clearCustomer();
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.cartContainer}>
        {cart && cart.orderItems?.length > 0 ? (
          <FlatList
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            data={cart.orderItems}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  setOrderItem(item);
                  setShowSelectdTopping(true);
                }}
                style={styles.cartItem}>
                <Image
                  style={styles.cartItemImage}
                  source={{uri: item.image}}
                />
                <View style={styles.cartItemDetails}>
                  <Text style={styles.cartItemName}>{item.productName}</Text>
                  <View style={styles.cartItemTopping}>
                    {item?.selectedProduct?.variant?.length > 1 && (
                      <Text style={styles.cartItemVariant}>
                        Size: {item.variantName}
                      </Text>
                    )}
                    <View style={styles.cartItemToppingText}>
                      {item.toppingItems &&
                        item.toppingItems.length > 0 &&
                        item.toppingItems.map((topping, index) => (
                          <Row key={index} style={styles.toppingText}>
                            <Text style={styles.toppingQuantity}>
                              x{topping.quantity}
                            </Text>
                            <Text>{topping.name}</Text>
                          </Row>
                        ))}
                    </View>
                  </View>
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.cartItemPrice}>
                    {TextFormatter.formatCurrency(item.price * item.quantity)}
                  </Text>
                  <View style={styles.itemQuantityContainer}>
                    <View style={styles.itemQuantity}>
                      <Pressable
                        style={styles.buttonQuantity}
                        onPress={() => {
                          if (item.quantity > 1) {
                            updateItemQuantity(item._id, item.quantity - 1);
                          }
                        }}>
                        <Icon source={'minus'} color={colors.white} size={20} />
                      </Pressable>
                      <Text style={styles.itemQuantityText}>
                        {item.quantity}
                      </Text>
                      <Pressable
                        style={styles.buttonQuantity}
                        onPress={() => {
                          if (item.quantity < 99) {
                            updateItemQuantity(item._id, item.quantity + 1);
                          }
                        }}>
                        <Icon source={'plus'} color={colors.white} size={20} />
                      </Pressable>
                    </View>
                    {/* <Pressable
                      style={styles.removeButton}
                      onPress={() => removeFromCart(item._id)}>
                      <Text style={styles.removeText}>Xoá</Text>
                    </Pressable> */}

                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeFromCart(item._id)}>
                      <Icon
                        source={'delete-outline'}
                        size={28}
                        color={colors.pink500}
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            )}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <View style={styles.emptyCartContainer}>
            <Image
              style={styles.emptyCartImage}
              source={require('../../../assets/images/empty_box.png')}
            />
            <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
          </View>
        )}
      </View>

      {cart && cart.orderItems?.length > 0 && (
        <Column>
          {cart?.owner && (
            <View style={styles.voucherContainer}>
              <Pressable
                style={styles.voucherPressable}
                onPress={() => {
                  setIsVoucher(true);
                  setIsScanning(true);
                }}>
                <Icon source="qrcode-scan" size={24} color={colors.blue600} />
                <Text style={styles.voucherText}>Voucher QR</Text>
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text style={styles.voucherName}>
                  {cart?.voucherInfor?.name}
                </Text>
                {cart?.voucher && (
                  <IconButton
                    icon="close"
                    size={24}
                    iconColor={colors.gray700}
                    onPress={clearVoucher}
                  />
                )}
              </View>
            </View>
          )}
          <View style={styles.totalPriceContainer}>
            {cart?.voucherInfor && (
              <View style={styles.voucherDiscount}>
                <Text style={styles.totalText}>Giảm giá:</Text>
                <Text style={styles.totalAmountVoucher}>
                  -{TextFormatter.formatCurrency(cart?.voucherDiscountAmount)}
                </Text>
              </View>
            )}
            <View style={styles.totalPrice}>
              <Text style={styles.totalText}>Tổng tiền:</Text>
              <Text style={styles.totalAmount}>
                {TextFormatter.formatCurrency(cart?.totalPrice || 0)}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                updateCustomer(customer);
                if (cart == null) return;
                setIsSelectedPaymentMethod(true);
              }}>
              <Text style={styles.paymentButton}>Thanh toán</Text>
            </Pressable>
          </View>
        </Column>
      )}

      {isCheckout && (
        <ModalCheckout
          data={filterCart(cart)}
          setIsCheckout={setIsCheckout}
          isCheckout={isCheckout}
          setCart={setCart}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          customer={customer}
          setScannedCode={setScannedCode}
          setIsSelectedPaymentMethod={setIsSelectedPaymentMethod}
          setIsPayment={setIsPayment}
          setOrderResponse={setOrderResponse}
          setCustomer={setCustomer}
        />
      )}

      {isSelectedPaymentMethod && (
        <ModalSelectedPaymentMethod
          cart={cart}
          setCart={setCart}
          isSelectedPaymentMethod={isSelectedPaymentMethod}
          setIsSelectedPaymentMethod={setIsSelectedPaymentMethod}
          setIsCheckout={setIsCheckout}
        />
      )}

      {isPayment && (
        <ModalPayment
          isPayment={isPayment}
          setIsPayment={setIsPayment}
          setOrderResponse={setOrderResponse}
          orderResponse={orderResponse}
          setCart={setCart}
          setPhoneNumber={setPhoneNumber}
          setScannedCode={setScannedCode}
          setCustomer={setCustomer}
        />
      )}

      {showSelectdTopping && (
        <ModalToppingUpdateProduct
          cart={cart}
          setCart={setCart}
          openMenu={showSelectdTopping}
          setOpenMenu={setShowSelectdTopping}
          orderItem={orderItem}
          setOrderItem={setOrderItem}
        />
      )}

      {showVoucherModal && (
        <DialogSelectVouchers
          cart={cart}
          setCart={setCart}
          showVoucherModal={showVoucherModal}
          setShowVoucherModal={setShowVoucherModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rightSection: {
    flex: 3.5,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginLeft: 20,
    backgroundColor: colors.fbBg,
  },
  camera: {
    width: '95%',
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
  },
  cameraControls: {
    position: 'absolute',
    right: GLOBAL_KEYS.PADDING_DEFAULT,
    flexDirection: 'row',
  },
  switchCameraButton: {
    marginRight: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_,
  },
  closeCameraButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: GLOBAL_KEYS.PADDING_SMALL,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  customerInfo: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerContainer: {
    flexDirection: 'column',
    flex: 1,
    gap: GLOBAL_KEYS.GAP_SMALL,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  customerInfoTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray850,
    fontWeight: 'bold',
  },
  cameraIcon: {
    position: 'absolute',
    end: 10,
    top: '30%',
  },
  customerDetails: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  closeButtonContainer: {
    position: 'absolute',
    end: 0,
  },
  cartContainer: {
    flex: 1,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    overflow: 'hidden',
    backgroundColor: colors.fbBg,
    marginVertical: GLOBAL_KEYS.GAP_SMALL,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    borderBottomColor: colors.gray200,
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  cartItemImage: {
    width: width / 20 + 20,
    height: width / 20 + 20,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 20,
  },
  cartItemDetails: {
    flexDirection: 'column',
    flex: 1,
  },
  cartItemName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  cartItemTopping: {
    flexDirection: 'column',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    fontWeight: '500',
    color: colors.gray700,
  },
  cartItemVariant: {
    color: colors.pink500,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT - 2,
    fontWeight: '500',
    marginBottom: 10,
  },
  cartItemToppingText: {
    color: colors.gray850,
  },
  toppingText: {
    marginBottom: 4,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    gap: 8,
    alignItems: 'flex-end',
  },
  toppingQuantity: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
  },
  itemContent: {
    flexDirection: 'column',
    padding: GLOBAL_KEYS.PADDING_SMALL,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    position: 'absolute',
    end: 0,
    bottom: 0,
    flex: 1,
  },
  cartItemPrice: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.black,
    textAlign: 'right',
  },
  itemQuantityContainer: {
    flexDirection: 'row',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    alignItems: 'center',
  },
  itemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonQuantity: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
    width: 24,
    height: 24,
  },
  itemQuantityText: {
    width: 26,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.pink500,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  flatListContent: {
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  emptyCartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  emptyCartImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  emptyCartText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    textAlign: 'center',
  },
  voucherContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingLeft: 16,
  },
  voucherPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  voucherText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
    color: colors.blue600,
  },
  voucherName: {
    color: colors.yellow700,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    flex: 1,
    textAlign: 'right',
  },
  voucherDiscount: {
    flexDirection: 'column',
    flex: 1,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    backgroundColor: colors.white,
  },
  totalPrice: {
    flexDirection: 'column',
    flex: 1,
  },
  totalText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE - 4,
    fontWeight: '500',
    color: colors.black,
  },
  totalAmount: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
    color: colors.pink500,
    width: '100%',
  },
  totalAmountVoucher: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
    color: colors.primary,
    width: '100%',
  },
  paymentButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    color: colors.white,
    backgroundColor: colors.primary,
    fontWeight: 'bold',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

export default CartOrder;
