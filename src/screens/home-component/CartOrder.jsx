import React, {useEffect, useState, useMemo} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

import {colors, GLOBAL_KEYS} from '../../constants';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {Icon} from 'react-native-paper';
import {TextFormatter} from '../../utils';
import {CustomFlatInput, Ani_ModalLoading} from '../../components';
import ModalCheckout from './ModalCheckout';
import {findCustomerByCode, findCustomerByPhone} from '../../axios/index';

const {width} = Dimensions.get('window');

const CartOrder = ({cart, setCart}) => {
  const [scannedCode, setScannedCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [voucherCode, setVoucherCode] = useState('');
  const [message, setMessage] = useState('');
  const [isCheckout, setIsCheckout] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

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
      if (codes.length > 0) {
        const scannedText = codes[0].value;
        setScannedCode(scannedText);
        setPhoneNumber(scannedText); // Cập nhật số điện thoại từ mã quét
        setIsScanning(false); // Đóng camera sau khi quét
        console.log(`Scanned Code: ${scannedText}, Type: ${codes[0].type}`);
      }
    },
  });

  // tìm kiếm khách hàng
  const fetchCustomerByCode = async code => {
    setLoading(true);
    try {
      const response = await findCustomerByCode(code);
      if (response.data != []) {
        setLoading(false);
        setCustomer(response.data);
      } else {
        setCustomer(null);
        setPhoneNumber('');
        setScannedCode('');
      }
    } catch (error) {}
  };

  const fetchCustomerByPhone = async phoneNumber => {
    setLoading(true);

    try {
      const response = await findCustomerByPhone(phoneNumber);
      if (response.data != []) {
        setCustomer(response.data);
        setLoading(false);
      } else {
        setCustomer(null);
        setPhoneNumber('');
        setScannedCode('');
      }
    } catch (error) {}
  };

  // gọi api lấy thông tin user qua code hoặc phone
  useEffect(() => {
    if (phoneNumber !== '' && /^(03|05|07|08|09)[0-9]{8}$/.test(phoneNumber)) {
      const fetchData = async () => {
        try {
          await fetchCustomerByPhone(phoneNumber);
        } catch (error) {
          console.log(error);
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
    if (customer?.customer?._id) {
      updateCustomer(customer.customer._id);
    }
  }, [customer]);

  const updateCustomer = newOwner => {
    setCart(prevOrder => {
      if (!prevOrder) {
        return null;
      }

      return {
        ...prevOrder,
        owner: newOwner,
      };
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
        : null; // Hoặc {} nếu muốn giữ trạng thái object
    });
  };
  // cập nhập số lượng
  const updateItemQuantity = (itemId, newQuantity) => {
    setCart(prevCart => {
      const updatedOrderItems = prevCart.orderItems.map(item => {
        if (item._id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.totalProductPrice,
          };
        }
        return item;
      });

      // Tính lại tổng giá của giỏ hàng từ các orderItem
      const updatedTotalPrice = updatedOrderItems.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      return {
        ...prevCart,
        orderItems: updatedOrderItems,
        totalPrice: updatedTotalPrice,
      };
    });
  };
  // Lọc lại cart để gửi oder
  const filterCart = cart => {
    if (cart === null) return;
    const orderItems = cart.orderItems.map(item => ({
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      toppingItems: item.toppingItems.map(toppingItem => ({
        topping: toppingItem.topping,
        quantity: toppingItem.quantity,
        price: toppingItem.price,
      })),
    }));

    return {
      deliveryMethod: cart.deliveryMethod,
      fulfillmentDateTime: new Date().toISOString(),
      note: cart.note,
      totalPrice: cart.totalPrice,
      paymentMethod: cart.paymentMethod,
      shippingAddress: cart.shippingAddress,
      store: cart.store,
      owner: cart.owner,
      voucher: cart.voucher,
      orderItems: orderItems,
    };
  };

  // update
  useEffect(() => {
    if (cart === null) {
      setPhoneNumber('');
      setCustomer(null);
    }
  }, [cart]);

  return (
    <View style={styles.rightSection}>
      {isScanning ? (
        device ? (
          <View>
            <Camera
              style={{width: '100%', height: 200, borderRadius: 10}}
              device={device}
              isActive={isScanning}
              codeScanner={codeScanner}
            />
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.switchCameraButton}
                onPress={() =>
                  setCameraPosition(prev =>
                    prev === 'back' ? 'front' : 'back',
                  )
                }>
                <Icon source="camera-flip" size={32} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeCameraButton}
                onPress={() => setIsScanning(false)}>
                <Icon source="close-circle" size={32} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text>Không tìm thấy camera</Text>
        )
      ) : null}

      {/* <Text style={styles.rightTitle}>Giỏ hàng</Text> */}
      <View style={styles.customerInfo}>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            gap: GLOBAL_KEYS.GAP_SMALL,
            padding: GLOBAL_KEYS.PADDING_DEFAULT,
          }}>
          <Text style={styles.customerInfoTitle}>Thông tin khách hàng</Text>
          <View>
            <CustomFlatInput
              label={'Nhập số điện thoại'}
              placeholder="Số điện thoại"
              value={phoneNumber}
              setValue={setPhoneNumber}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                end: 10,
                top: '30%',
              }}
              onPress={() => setIsScanning(true)}>
              <Icon source="barcode-scan" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View>
            <Text>
              Khách hàng:{''}
              {cart === null
                ? 'Vui lòng chọn sản phẩm trước'
                : customer?.customer
                ? `${customer.customer.firstName} ${customer.customer.lastName}`
                : ' Vãng lai'}
            </Text>
            <Text>
              Số điện thoại:{' '}
              {cart === null
                ? 'Vui lòng chọn sản phẩm trước'
                : customer?.customer
                ? customer?.customer?.phoneNumber
                : ''}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
          overflow: 'hidden',
          backgroundColor: colors.fbBg,
          marginVertical: GLOBAL_KEYS.PADDING_DEFAULT,
        }}>
        {cart && cart.orderItems.length > 0 ? (
          <FlatList
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            data={cart.orderItems}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.cartItem}>
                <Image
                  style={styles.cartItemImage}
                  source={{uri: item.product.image}}
                />
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                  }}>
                  <Text style={styles.cartItemName}>{item.product.name} </Text>
                  <View style={styles.cartItemTopping}>
                    <Text
                      style={{
                        color: colors.pink500,
                        fontSize: 10,
                        fontWeight: '500',
                      }}>
                      {item.size.size}
                    </Text>
                    <Text style={{color: colors.gray850}}>
                      {item.topping &&
                        item.topping.length > 0 &&
                        item.topping.map((topping, index) => (
                          <Text
                            key={index}
                            style={{
                              marginBottom: 4,
                              fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL - 2,
                            }}>
                            <Text style={{fontSize: 8}}>x1 </Text>
                            {topping.name}
                            {'\n'}
                          </Text>
                        ))}
                    </Text>
                  </View>
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.cartItemPrice}>
                    {TextFormatter.formatCurrency(item.totalPrice)}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: GLOBAL_KEYS.GAP_DEFAULT,
                    }}>
                    <View style={styles.itemQuantity}>
                      <TouchableOpacity
                        style={styles.buttonQuantity}
                        onPress={() => {
                          if (item.quantity > 1) {
                            updateItemQuantity(item._id, item.quantity - 1);
                          }
                        }}>
                        <Icon source={'minus'} color={colors.white} size={20} />
                      </TouchableOpacity>
                      <Text
                        style={{
                          width: 26,
                          textAlign: 'center',
                          fontWeight: '400',
                          fontSize: 12,
                        }}>
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        style={styles.buttonQuantity}
                        onPress={() => {
                          updateItemQuantity(item._id, item.quantity + 1);
                        }}>
                        <Icon source={'plus'} color={colors.white} size={20} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={{alignItems: 'center'}}
                      onPress={() => removeFromCart(item._id)}>
                      {/* <Icon
                        source={'delete'}
                        color={colors.gray700}
                        size={24}
                      /> */}
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.pink500,
                          textAlignVertical: 'center',
                          textAlign: 'center',
                        }}>
                        Xoá
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={{
              gap: GLOBAL_KEYS.GAP_SMALL,
            }}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              gap: GLOBAL_KEYS.GAP_DEFAULT,
            }}>
            <Image
              style={{
                width: '80%',
                height: '80%',
                resizeMode: 'contain',
              }}
              source={require('../../assets/images/empty_box.png')}
            />
            <Text style={styles.emptyCart}>Giỏ hàng trống</Text>
          </View>
        )}
      </View>
      {cart && cart.orderItems.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: GLOBAL_KEYS.PADDING_DEFAULT,
            backgroundColor: colors.white,
          }}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <Text
              style={{
                fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE - 4,
                fontWeight: '500',
                color: colors.black,
              }}>
              Tổng tiền:
            </Text>
            <Text
              style={{
                fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
                fontWeight: 'bold',
                color: colors.pink500,
                width: '100%',
              }}>
              {TextFormatter.formatCurrency(
                cart?.totalPrice ? cart.totalPrice : 0,
              )}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (cart == null) return;
              setIsCheckout(true);
            }}>
            <Text
              style={{
                padding: 8,
                color: colors.pink500,
                backgroundColor: colors.white,
                fontWeight: 'bold',
                fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
                borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
                borderWidth: 1,
                borderColor: colors.pink500,
              }}>
              Thanh Toán
            </Text>
          </TouchableOpacity>
        </View>
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
        />
      )}
      {/* <Ani_ModalLoading loading={loading} /> */}
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
  rightTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  customerInfo: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerInfoTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray850,
    fontWeight: 'bold',
  },
  cartItem: {
    height: width / 15,
    flexDirection: 'row',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    borderBottomColor: colors.gray200,
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  cartItemImage: {
    width: width / 20,
    height: width / 20,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 20,
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
  itemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonQuantity: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  cartItemName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    fontWeight: '500',
  },
  cartItemTopping: {
    flexDirection: 'column',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL - 2,
    fontWeight: '500',
    color: colors.gray700,
  },
  cartItemPrice: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    fontWeight: '500',
    color: colors.black,
    textAlign: 'right',
    // marginRight: 5,
  },
  buttonDelete: {
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.white,
    color: colors.red900,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  emptyCart: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    textAlign: 'center',
  },
});

export default React.memo(CartOrder);
