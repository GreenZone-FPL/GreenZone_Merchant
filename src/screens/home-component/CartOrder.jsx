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
import {Icon, IconButton} from 'react-native-paper';
import {TextFormatter} from '../../utils';
import {CustomFlatInput} from '../../components';

const CartOrder = ({cart, setCart, phoneNumber, setPhoneNumber}) => {
  const [isCartEmptyModalVisible, setIsCartEmptyModalVisible] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [voucherCode, setVoucherCode] = useState('');
  const [message, setMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

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

  // Xóa sản phẩm khỏi giỏ hàng neu không có orderItem nào thì nó sẽ xoá cart
  const removeFromCart = id => {
    setCart(prevCart => {
      const updatedCart = {
        ...prevCart,
        orderItems: prevCart.orderItems.filter(item => item._id !== id),
      };
      return updatedCart.orderItems.length === 0 ? null : updatedCart;
    });
  };

  // Tính tổng tiền
  const calculateTotalPrice = cart => {
    if (!cart || !cart.orderItems) return 0;
    return cart.orderItems.reduce((total, item) => total + item.price, 0);
  };

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
        <View style={{flexDirection: 'column', flex: 1}}>
          <Text style={styles.customerInfoTitle}>Thông tin khách hàng</Text>
          <Text style={styles.customerInfoText}>
            SĐT: {phoneNumber || 'Chưa quét mã'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setIsScanning(true)}>
          <Icon source="barcode-scan" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: '50%',
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
                  <TouchableOpacity>
                    <Text style={styles.buttonQuantity}>-</Text>
                  </TouchableOpacity>
                  <Text style={{}}>{item.quantity}</Text>
                  <TouchableOpacity>
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
                    {TextFormatter.formatCurrency(item.price)}
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
          {/* <Text
            style={{fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER, fontWeight: '500'}}>
            Mã giảm giá:
          </Text> */}
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
            {TextFormatter.formatCurrency(calculateTotalPrice(cart))}
          </Text>
        </Text>
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
      </View>
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
