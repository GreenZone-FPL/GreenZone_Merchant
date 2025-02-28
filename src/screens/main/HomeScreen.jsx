import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getAllCategories,
  getAllProducts,
  getAllToppings,
  getProductsById,
} from '../../axios/index';
import {ButtonGroup} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {TextFormatter} from '../../utils';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {Icon} from 'react-native-paper';

const {width} = Dimensions.get('window').width;

const HomeScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [cart, setCart] = useState(null);

  // state lưu dữ liệu
  const [categories, setCategories] = useState([]);
  const [productsByCate, setProductsByCate] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Gọi danh sách danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      const categoriesData = [
        {_id: 'cate18-06', name: 'Tất cả', icon: ''},
        ...response.data,
      ];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Lỗi khi gọi API Categories:', error);
    }
  };

  // Gọi danh sách sản phẩm từ API
  const fetchProducts = async id => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Lỗi khi gọi API Products:', error);
    }
  };

  // gọi sản phẩm theo index cate
  const getProductsByCategory = index => {
    if (!products || products.length === 0) return [];
    if (index === 0) {
      return products.flatMap(category => category?.products || []);
    }
    return products[index - 1]?.products || [];
  };

  // Gọi danh mục & sản phẩm  và topping từ API
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Cập nhật danh sách sản phẩm theo danh mục đã chọn
  useEffect(() => {
    const updatedProducts = getProductsByCategory(selectedIndex);
    setProductsByCate(updatedProducts);
  }, [selectedIndex, categories, products]);

  // Cập nhật sản phẩm hiển thị khi tìm kiếm thay đổi
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(productsByCate);
    } else {
      setFilteredProducts(
        productsByCate.filter(product =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
  }, [searchTerm, productsByCate]);

  // Mở modal thêm sản phẩm
  // Gọi API để lấy sản phẩm
  const handleAddProduct = async id => {
    try {
      const response = await getProductsById(id);
      setSelectedProduct(response.data);
      setOpenMenu(true);
    } catch (error) {
      console.log('Lỗi khi lấy sản phẩm:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* Thanh Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
          />
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.title}>Chọn danh mục:</Text>
          <ButtonGroup
            buttons={categories.map(category => category.name)}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </View>
        <FlatList
          data={searchTerm.length > 0 ? filteredProducts : productsByCate}
          keyExtractor={item => item._id.toString()}
          numColumns={5}
          maxToRenderPerBatch={10}
          windowSize={5}
          nestedScrollEnabled
          initialNumToRender={10}
          removeClippedSubviews={true}
          renderItem={({item}) => (
            <View style={styles.productCard}>
              <Image source={{uri: item.image}} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  Từ {TextFormatter.formatCurrency(item.originalPrice)}
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddProduct(item._id)}>
                  <Text style={styles.addButtonText}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <CartOrder cart={cart} setCart={setCart} />
      <ModalToping
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        cart={cart}
        setCart={setCart}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedToppings={selectedToppings}
        setSelectedToppings={setSelectedToppings}
      />
    </View>
  );
};

const CartOrder = ({cart, setCart}) => {
  const [isCartEmptyModalVisible, setIsCartEmptyModalVisible] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cameraPosition, setCameraPosition] = useState('back'); // 'back' hoặc 'front'
  const [toppings, setToppings] = useState([]);

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

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = index => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  // Tính tổng tiền
  // const totalPrice = cart?.reduce((sum, item) => sum + item.price, 0);

  const feathAllToppings = async () => {
    try {
      const response = await getAllToppings();
      setToppings(response.data);
    } catch (error) {
      console.log('Lỗi gọi API Toppings', error);
    }
  };

  useEffect(() => {
    feathAllToppings();
  }, []);

  // console.log('toppings', toppings);
  return (
    <View style={styles.rightSection}>
      {/* Camera quét mã QR */}
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
                <Icon source="camera-flip" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeCameraButton}
                onPress={() => setIsScanning(false)}>
                <Icon source="close-circle" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text>Không tìm thấy camera</Text>
        )
      ) : (
        <TouchableOpacity onPress={() => setIsScanning(true)}>
          <Icon source="barcode-scan" size={32} color="black" />
        </TouchableOpacity>
      )}

      {/* Hiển thị thông tin khách hàng */}
      <Text style={styles.rightTitle}>Giỏ hàng</Text>
      <View
        style={{
          margin: GLOBAL_KEYS.PADDING_SMALL,
          backgroundColor: colors.white,
          padding: 10,
          borderRadius: 10,
        }}>
        <Text style={{fontSize: 16, color: colors.gray850, fontWeight: 'bold'}}>
          Thông tin khách hàng
        </Text>
        <Text style={{fontSize: 14, color: colors.gray850}}>
          Tên: Khách vãng lai
        </Text>
        <Text style={{fontSize: 14, color: colors.gray850}}>
          SĐT: {phoneNumber || 'Chưa quét mã'}
        </Text>
      </View>

      {/* Danh sách sản phẩm trong giỏ hàng */}
      {cart?.orderItems?.length > 0 ? (
        <FlatList
          contentContainerStyle={{gap: GLOBAL_KEYS.GAP_SMALL}}
          data={cart.orderItems}
          keyExtractor={item => item._id}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  padding: GLOBAL_KEYS.PADDING_DEFAULT,
                  gap: GLOBAL_KEYS.GAP_DEFAULT,
                  borderColor: colors.primary,
                  borderWidth: 1,
                  borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
                  justifyContent: 'space-between',
                  backgroundColor: colors.white,
                }}>
                <View>
                  <Image
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
                    }}
                    source={{uri: item.product.image}}
                  />
                  <Text
                    style={{
                      position: 'absolute',
                      backgroundColor: colors.green200,
                      width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
                      height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
                      borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 2,
                      textAlign: 'center',
                      fontWeight: '500',
                      start: -10,
                      top: -10,
                      textAlignVertical: 'center',
                    }}>
                    {item.quantity}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
                      fontWeight: '500',
                    }}>
                    {item.product.name}
                  </Text>
                  <Text
                    style={{
                      color: colors.yellow700,
                      fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
                    }}>
                    Size: {item.size.size}
                  </Text>
                  <Text
                    style={{
                      color: colors.gray700,
                      fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
                    }}>
                    {item?.topping.map(topping => topping.name).join('\n')}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: GLOBAL_KEYS.GAP_DEFAULT,
                  }}>
                  <Text style={{fontWeight: '500'}}>
                    {TextFormatter.formatCurrency(item.price)}
                  </Text>
                  <Text
                    style={{
                      color: colors.red900,
                      padding: GLOBAL_KEYS.PADDING_SMALL,
                      backgroundColor: colors.gray200,
                      textAlign: 'center',
                      borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
                    }}>
                    Xoá
                  </Text>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.emptyCart}>Chưa có sản phẩm</Text>
      )}
      {/* Tổng tiền và nút Thanh toán */}
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>Tổng tiền: VNĐ</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            if (cart?.length === 0) {
              setIsCartEmptyModalVisible(true);
            } else {
              console.log('Tiến hành thanh toán...');
            }
          }}>
          <Text style={styles.checkoutButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>

      {/* Modal thông báo khi giỏ hàng trống */}
      <Modal visible={isCartEmptyModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thông báo</Text>
            <Text style={styles.modalMessage}>
              Giỏ hàng của bạn đang trống!
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setIsCartEmptyModalVisible(false)}>
              <Text style={styles.confirmButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ModalToping = ({
  openMenu,
  setOpenMenu,
  cart,
  setCart,
  selectedProduct,
  setSelectedProduct,
  selectedSize,
  setSelectedSize,
  selectedToppings,
  setSelectedToppings,
}) => {
  //Chọn size đầu tiên
  useEffect(() => {
    if (selectedProduct?.variant?.length > 0) {
      setSelectedSize(selectedProduct.variant[0]);
    }
  }, [selectedProduct]);
  //chọn topping
  const toggleTopping = topping => {
    setSelectedToppings(prev =>
      prev.some(t => t._id === topping._id)
        ? prev.filter(t => t._id !== topping._id)
        : [...prev, topping],
    );
  };

  // them san pham vao gio hang
  const confirmAddToCart = () => {
    const newItem = addItemOrder();
    if (!newItem) return;

    createOrder();

    // Reset lại dữ liệu sau khi thêm vào giỏ hàng
    setTimeout(() => {
      setSelectedToppings([]);
      setSelectedSize(null);
      setSelectedProduct(null);
      setOpenMenu(false);
    }, 300);
  };

  //tao card
  const createOrder = () => {
    setCart(prevCart => {
      const newItem = addItemOrder();
      if (!newItem) return prevCart; // Nếu không có sản phẩm hợp lệ, giữ nguyên giỏ hàng

      if (
        !prevCart ||
        !prevCart.orderItems ||
        prevCart.orderItems.length === 0
      ) {
        return {
          _id: Date.now().toString(),
          deliveryMethod: 'Tại cửa hàng',
          fulfillmentDateTime: new Date().toISOString(),
          note: '',
          paymentMethod: 'Chưa xác định',
          shippingAddress: null,
          store: 'Chưa xác định',
          owner: 'Khách hàng chưa xác định',
          voucher: null,
          orderItems: [newItem],
        };
      } else {
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingItemIndex = prevCart.orderItems.findIndex(
          item =>
            item.variant === newItem.variant &&
            JSON.stringify(item.toppingItems) ===
              JSON.stringify(newItem.toppingItems),
        );

        if (existingItemIndex !== -1) {
          // Nếu sản phẩm đã có trong giỏ hàng, cập nhật quantity và price
          const updatedOrderItems = [...prevCart.orderItems];
          updatedOrderItems[existingItemIndex] = {
            ...updatedOrderItems[existingItemIndex],
            quantity: updatedOrderItems[existingItemIndex].quantity + 1,
            price: updatedOrderItems[existingItemIndex].price + newItem.price, // Cộng dồn giá
          };

          return {
            ...prevCart,
            orderItems: updatedOrderItems,
          };
        } else {
          // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
          return {
            ...prevCart,
            orderItems: [...prevCart.orderItems, newItem],
          };
        }
      }
    });
  };
  const addItemOrder = () => {
    return {
      _id: Date.now().toString(),
      variant: selectedSize ? selectedSize._id : '',
      quantity: 1,
      price: selectedSize
        ? selectedSize.sellingPrice +
          selectedToppings.reduce((total, item) => total + item.extraPrice, 0)
        : 0,

      toppingItems: selectedToppings.map(item => ({
        topping: item._id,
        quantity: 1,
        price: item.extraPrice,
      })),
      product: selectedProduct,
      size: selectedSize,
      topping: selectedToppings,
    };
  };
  useEffect(() => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log('Sản phẩm đã chọn:', JSON.stringify(selectedProduct, null, 2));
    console.log('Size đã chọn:', selectedSize);
    console.log('Topping đã chọn:', selectedToppings);
    console.log('Cart:', JSON.stringify(cart, null, 2));
  }, [selectedProduct, , selectedToppings, selectedSize, cart]);

  return (
    <Modal visible={openMenu} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Chọn Size */}
          <Text style={styles.title}>Chọn Size</Text>

          <View style={styles.sizeContainer}>
            {selectedProduct?.variant?.length > 0 ? (
              selectedProduct.variant.map(item => (
                <TouchableOpacity
                  key={item._id}
                  style={[
                    styles.sizeOption,
                    selectedSize?._id === item._id && styles.selectedSize,
                  ]}
                  onPress={() => setSelectedSize(item)}>
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize?._id === item._id && styles.selectedSizeText,
                    ]}>
                    {item.size} - {item.sellingPrice.toLocaleString()} VNĐ
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Không có size</Text>
            )}
          </View>

          {/* Chọn Topping */}
          <Text style={styles.modalTitle}>Chọn Topping</Text>
          <ScrollView style={styles.toppingList}>
            {selectedProduct?.topping?.length > 0 ? (
              selectedProduct.topping.map(item => {
                const isSelected = selectedToppings.some(
                  t => t._id === item._id,
                );

                return (
                  <TouchableOpacity
                    key={item._id}
                    style={[
                      styles.toppingOption,
                      isSelected && styles.selectedTopping,
                    ]}
                    onPress={() => toggleTopping(item)}>
                    <Text
                      style={[
                        styles.sizeText,
                        isSelected && styles.selectedToppingText,
                      ]}>
                      {item.name} ( +{' '}
                      {TextFormatter.formatCurrency(item.extraPrice)} )
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text>Không có topping</Text>
            )}
          </ScrollView>

          {/* Nút xác nhận & Hủy */}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmAddToCart}>
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, {backgroundColor: 'red'}]}
              onPress={() => {
                setOpenMenu(false);
                setSelectedToppings([]);
                setSelectedSize([]);
                setSelectedProduct([]);
              }}>
              <Text style={styles.confirmButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  checkoutButton: {
    backgroundColor: '#299345',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

  container: {flex: 1, flexDirection: 'row'},
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  optionContainer: {alignItems: 'flex-start', marginBottom: 10},
  leftSection: {flex: 7, backgroundColor: colors.white, padding: 10},
  rightSection: {flex: 3, backgroundColor: colors.gray200, padding: 10},
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  productCard: {
    width: '19%',
    margin: '0.5%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {width: 80, height: 80, borderRadius: 8},
  productDetails: {alignItems: 'center', marginTop: 5},
  productName: {fontSize: 14, fontWeight: 'bold', textAlign: 'center'},
  productPrice: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#299345',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  addButtonText: {color: '#fff', fontSize: 14, fontWeight: 'bold'},
  rightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cartItem: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: colors.gray300,
    flexDirection: 'row',
  },
  cartItemInfo: {
    paddingHorizontal: 4,
  },
  emptyCart: {fontSize: 14, color: '#777', textAlign: 'center'},
  toppingText: {fontSize: 12, color: colors.black},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sizeOption: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT - 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: colors.gray200,
  },
  selectedSize: {
    backgroundColor: colors.primary,
    borderColor: colors.yellow500,
  },
  sizeText: {
    color: colors.primary,
  },
  selectedSizeText: {
    color: colors.white,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
  },

  toppingOption: {
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingHorizontal: '20%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: colors.gray200,
    marginVertical: GLOBAL_KEYS.GAP_SMALL / 2,
    alignItems: 'center',
  },
  selectedTopping: {
    backgroundColor: colors.primary,
    borderColor: colors.yellow500,
  },
  toppingText: {
    fontSize: 16,
    color: colors.primary,
  },
  selectedToppingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#299345',
    padding: 20,
    borderRadius: 5,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rightTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  cartList: {flex: 1},
  cartItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    marginTop: 8,
  },
  cartItemText: {fontSize: 16, fontWeight: 'bold'},
  toppingText: {fontSize: 14, color: colors.gray700},
  emptyCart: {textAlign: 'center', fontSize: 16, color: 'gray'},

  totalPrice: {fontSize: 18, fontWeight: 'bold'},
  backButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paymentContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  paymentText: {fontSize: 18, fontWeight: 'bold'},
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cameraControls: {
    position: 'absolute',
    top: 10,
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
});

export default HomeScreen;
