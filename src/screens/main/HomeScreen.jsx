import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import {ButtonGroup} from '../../components';
import {colors} from '../../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';



const categories = [
  'Tất cả',
  'Trà trái cây',
  'Trà xanh',
  'Trà sữa',
  'Coffee',
  'Bánh ngọt',
];

const products = [
  {
    id: 1,
    name: 'Trà Đào',
    image: require('../../assets/images/image_category/image_coffee.png'),
    category: 'Trà trái cây',
    sizes: {S: 30000, M: 35000, L: 40000},
  },
  {
    id: 2,
    name: 'Trà Cam Xả',
    image: require('../../assets/images/image_category/image_coffee.png'),
    category: 'Trà trái cây',
    sizes: {S: 32000, M: 38000, L: 42000},
  },
];

const toppings = [
  {name: 'Trân châu', price: 5000},
  {name: 'Thạch dừa', price: 4000},
  {name: 'Kem cheese', price: 7000},
  {name: 'Hạt chia', price: 3000},
];

const sizes = ['S', 'M', 'L'];

const HomeScreen = () => {
  const [isCartEmptyModalVisible, setIsCartEmptyModalVisible] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false); // State kiểm soát chế độ hiển thị
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc sản phẩm theo danh mục và search
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedIndex === 0 || product.category === categories[selectedIndex];
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Tính tổng tiền
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  // Mở modal thêm sản phẩm
  const handleAddProduct = product => {
    setSelectedProduct(product);
    setSelectedToppings([]);
    setSelectedSize('M');
  };

  // Thêm/bỏ topping
  const toggleTopping = topping => {
    setSelectedToppings(prev =>
      prev.some(t => t.name === topping.name)
        ? prev.filter(t => t.name !== topping.name)
        : [...prev, topping],
    );
  };

  // Xác nhận thêm sản phẩm vào giỏ
  const confirmAddToCart = () => {
    const toppingPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    setCart(prevCart => [
      ...prevCart,
      {
        ...selectedProduct,
        selectedSize,
        price: selectedProduct.sizes[selectedSize] + toppingPrice,
        toppings: selectedToppings,
      },
    ]);
    setSelectedProduct(null);
    setSelectedToppings([]);
    setSelectedSize('M');
  };
  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = index => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };


  return (
    <View style={styles.container}>
      {/* Phần danh sách sản phẩm */}
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
            buttons={categories}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </View>
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id.toString()}
          numColumns={5}
          renderItem={({item}) => (
            <View style={styles.productCard}>
              <Image source={item.image} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>Từ {item.sizes.S} VNĐ</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddProduct(item)}>
                  <Text style={styles.addButtonText}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Phần giỏ hàng */}
      <View style={styles.rightSection}>
        <Text style={styles.rightTitle}>
          {isCheckout ? 'Thanh toán' : 'Giỏ hàng'}
        </Text>

        {/* Nếu đang ở giao diện giỏ hàng */}
        {!isCheckout ? (
          <>
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
            <View style={styles.footer}>
              <Text style={styles.totalPrice}>Tổng tiền: {totalPrice} VNĐ</Text>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => {
                  if (cart.length === 0) {
                    setIsCartEmptyModalVisible(true); // Hiển thị modal nếu giỏ hàng trống
                  } else {
                    setIsCheckout(true); // Chuyển sang màn hình thanh toán nếu có sản phẩm
                  }
                }}>
                <Text style={styles.checkoutButtonText}>Thanh toán</Text>
              </TouchableOpacity>
              <Modal
                visible={isCartEmptyModalVisible}
                transparent
                animationType="fade">
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
          </>
        ) : (
          <>
            {/* Nếu đang ở giao diện thanh toán */}
            <View style={styles.paymentContainer}>
              <Text style={styles.paymentText}>Thông tin thanh toán...</Text>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.backButton, {backgroundColor: colors.red900}]}
                onPress={() => setIsCheckout(false)}>
                <Text style={[styles.checkoutButtonText]}>Quay lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setIsCheckout(false)}>
                <Text style={styles.checkoutButtonText}>Hoàn tất</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Modal chọn kích cỡ và topping */}
      <Modal
        visible={selectedProduct !== null}
        transparent
        animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.sizeContainer}>
              {sizes.map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    selectedSize === size && styles.selectedSize,
                  ]}
                  onPress={() => setSelectedSize(size)}>
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.selectedSizeText,
                    ]}>
                    {size} - {selectedProduct?.sizes[size]} VNĐ
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalTitle}>Chọn Topping</Text>
            {toppings.map((topping, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleTopping(topping)}>
                <Text
                  style={[
                    styles.toppingOption,
                    selectedToppings.some(t => t.name === topping.name) &&
                      styles.selectedTopping,
                  ]}>
                  {topping.name} (+{topping.price} VNĐ)
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmAddToCart}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, {backgroundColor: colors.red900}]}
                onPress={() => setSelectedProduct(null)}>
                <Text style={styles.confirmButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection:'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
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
  toppingText: {fontSize: 12, color: '#555'},
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
    padding: 10,
    borderWidth: 1,
    borderColor: '#299345',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedSize: {
    backgroundColor: '#299345',
  },
  sizeText: {
    color: '#299345',
  },
  selectedSizeText: {
    color: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  toppingOption: {fontSize: 16, padding: 10, textAlign: 'center'},
  selectedTopping: {
    fontWeight: 'bold',
    color: '#299345',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#299345',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
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
  deleteButton: {flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'},
});

export default HomeScreen;