import React, {useEffect, useState, useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import {CustomFlatInput} from '../../components';
import ModalCheckout from './ModalCheckout';
import {findCustomerByCode, findCustomerByPhone} from '../../axios/index';

const CartOrder = ({cart, setCart}) => {
  const [isCartEmptyModalVisible, setIsCartEmptyModalVisible] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [voucherCode, setVoucherCode] = useState('');
  const [message, setMessage] = useState('');
  const [isCheckout, setIsCheckout] = useState(false);
  const [order, setOrder] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customer, setCustomer] = useState(null);

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
    try {
      const response = await findCustomerByCode(code);
      if (response.data != []) {
        setCustomer(response.data);
        console.log(response);
      } else {
        setCustomer(null);
        setPhoneNumber('');
        setScannedCode('');
      }
    } catch (error) {}
  };

  const fetchCustomerByPhone = async phoneNumber => {
    try {
      const response = await findCustomerByPhone(phoneNumber);
      if (response.data != []) {
        setCustomer(response.data);
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
        } catch (error) {}
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

      <Text style={styles.rightTitle}>Giỏ hàng</Text>
      <View style={styles.customerInfo}>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            gap: GLOBAL_KEYS.GAP_SMALL,
          }}>
          <Text style={styles.customerInfoTitle}>Thông tin khách hàng</Text>
          <CustomFlatInput
            label={'Nhập số điện thoại hoặc quét mã để lấy thông tin'}
            placeholder="Số điện thoại"
            value={phoneNumber}
            setValue={setPhoneNumber}
            rightIcon="barcode-scan"
            onRightPress={() => {
              setIsScanning(true);
            }}
            style={{}}
          />
          {message && <Text style={styles.errorText}>{message}</Text>}
          <View>
            <Text>
              Khách hàng:{' '}
              {cart === null
                ? 'Vui lòng chọn sản phẩm trước'
                : customer?.customer
                ? `${customer.customer.firstName} ${customer.customer.lastName}`
                : 'Vãng lai'}
            </Text>
            <Text>
              Số điện thoại:{' '}
              {cart === null
                ? 'Vui lòng chọn sản phẩm trước'
                : customer?.customer
                ? customer?.customer?.phoneNumber
                : 'Không'}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          height: '43%',
          borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
          overflow: 'hidden',
        }}>
        {cart && cart.orderItems.length > 0 ? (
          <FlatList
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            data={cart.orderItems}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={styles.cartItem}>
                <View style={styles.itemQuantity}>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.quantity > 1) {
                        updateItemQuantity(item._id, item.quantity - 1);
                      }
                    }}>
                    <Text style={styles.buttonQuantity}>-</Text>
                  </TouchableOpacity>
                  <Text style={{}}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      updateItemQuantity(item._id, item.quantity + 1);
                    }}>
                    <Text style={styles.buttonQuantity}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    style={styles.cartItemImage}
                    source={{uri: item.product.image}}
                  />
                </View>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <Text style={styles.cartItemName}>
                    {item.product.name} -{' '}
                    <Text style={{color: colors.yellow700}}>
                      Size: {item.size.size}
                    </Text>
                  </Text>
                  <Text style={styles.cartItemTopping}>
                    <Text>
                      {item.topping && item.topping.length > 0 ? (
                        <Text>
                          {item.topping
                            .map(topping => `${topping.name} x1`)
                            .join('\n')}
                        </Text>
                      ) : (
                        <Text>Không có topping</Text>
                      )}
                    </Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    gap: GLOBAL_KEYS.GAP_DEFAULT,
                  }}>
                  <Text style={styles.cartItemPrice}>
                    {TextFormatter.formatCurrency(item.totalPrice)}
                  </Text>
                  <TouchableOpacity onPress={() => removeFromCart(item._id)}>
                    <Text style={styles.buttonDelete}>Xoá</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={{gap: GLOBAL_KEYS.GAP_SMALL}}
          />
        ) : (
          <Text style={styles.emptyCart}>Giỏ hàng trống</Text>
        )}
      </View>

      <View>
        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
          <CustomFlatInput
            label={'Nhập mã voucher hoặc quét QR'}
            placeholder="Mã giảm giá"
            value={voucherCode}
            setValue={setVoucherCode}
            rightIcon="barcode-scan"
            onRightPress={() => {}}
            style={{flex: 1}}
          />
          {message && <Text style={styles.errorText}>{message}</Text>}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER + 3,
            fontWeight: 'bold',
            color: colors.primary,
          }}>
          Tổng tiền:{' '}
          <Text
            style={{
              fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
              fontWeight: 'bold',
              color: colors.black,
            }}>
            {TextFormatter.formatCurrency(
              cart?.totalPrice ? cart.totalPrice : 0,
            )}
          </Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (cart == null) return;
            setIsCheckout(true);
          }}>
          <Text
            style={{
              padding: 10,
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
              fontWeight: 'bold',
            }}>
            Thanh Toán
          </Text>
        </TouchableOpacity>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  rightSection: {
    flex: 3,
    backgroundColor: colors.gray200,
    padding: 10,
    gap: 20,
  },
  cameraControls: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
  },
  switchCameraButton: {
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 5,
  },
  closeCameraButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 5,
  },
  rightTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  customerInfo: {
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  customerInfoTitle: {
    fontSize: 16,
    color: colors.gray850,
    fontWeight: 'bold',
  },
  customerInfoText: {
    fontSize: 14,
    color: colors.gray850,
  },
  cartItem: {
    flexDirection: 'row',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    elevation: 2,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  itemQuantity: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    fontWeight: '500',
    end: '30%',
    bottom: '30%',
    position: 'absolute',
  },
  buttonQuantity: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    backgroundColor: colors.fbBg,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
    fontWeight: '500',
    elevation: 2,
    fontSize: 16,
  },
  cartItemName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  cartItemTopping: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    fontWeight: '500',
    color: colors.gray700,
  },
  cartItemPrice: {
    fontWeight: '500',
  },
  buttonDelete: {
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: GLOBAL_KEYS.PADDING_SMALL,
    backgroundColor: colors.gray200,
    color: colors.red900,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  emptyCart: {fontSize: 14, color: '#777', textAlign: 'center'},
});

export default React.memo(CartOrder);
