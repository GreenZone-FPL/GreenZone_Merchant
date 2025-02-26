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
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState([]);
  const [toppings, setToppings] = useState([]);

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
      setProduct(response.data);
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
      <CartOrder />
      <ModalToping
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        cart={cart}
        setCart={setCart}
        product={product}
      />
    </View>
  );
};

const CartOrder = () => {
  const [isCartEmptyModalVisible, setIsCartEmptyModalVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [scannedCode, setScannedCode] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cameraPosition, setCameraPosition] = useState('back'); // 'back' hoặc 'front'

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
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

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
      <ScrollView style={styles.cartList}>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <View style={styles.cartItemInfo}>
                <View style={styles.deleteButton}>
                  <Text style={styles.cartItemText}>
                    {item.name} ({item.selectedSize}) - {item.price} VNĐ
                  </Text>
                  <TouchableOpacity onPress={() => removeFromCart(index)}>
                    <Icon name="close" size={22} color="red" />
                  </TouchableOpacity>
                </View>
                {item.toppings?.length > 0 && (
                  <Text style={styles.toppingText}>
                    Topping:{' '}
                    {item.toppings
                      .map(t => t.name + ' (+' + t.price + ' VNĐ)')
                      .join(', ')}
                  </Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCart}>Chưa có sản phẩm</Text>
        )}
      </ScrollView>

      {/* Tổng tiền và nút Thanh toán */}
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>Tổng tiền: {totalPrice} VNĐ</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            if (cart.length === 0) {
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

const ModalToping = ({openMenu, setOpenMenu, cart, setCart, product}) => {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);

  //Chọn size đầu tiên
  useEffect(() => {
    if (product?.variant?.length > 0) {
      setSelectedSize(product.variant[0]);
    }
  }, [product]);
  //chọn topping
  const toggleTopping = topping => {
    setSelectedToppings(prev =>
      prev.some(t => t._id === topping._id)
        ? prev.filter(t => t._id !== topping._id)
        : [...prev, topping],
    );
  };

  const confirmAddToCart = () => {
    if (!selectedSize) return;
    // thêm vào giỏ hàng ở đây
    /// cart add product   selectedToppings  selectedSize
    //
    setSelectedToppings([]);
    setSelectedSize([]);
    setOpenMenu(false);
  };

  useEffect(() => {
    console.log('Sản phẩm đã chọn:', product);
    console.log('Size đã chọn:', selectedSize);
    console.log('Topping đã chọn:', selectedToppings);
  }, [product, selectedSize, selectedToppings]);

  return (
    <Modal visible={openMenu} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Chọn Size */}
          <Text style={styles.title}>Chọn Size</Text>

          <View style={styles.sizeContainer}>
            {product?.variant?.length > 0 ? (
              product.variant.map(item => (
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
            {product?.productTopping?.length > 0 ? (
              product.productTopping.map(item => {
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
                      {item.topping.name} ( +{' '}
                      {TextFormatter.formatCurrency(item.topping.extraPrice)} )
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: colors.gray300,
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
