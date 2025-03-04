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
import {ButtonGroup, Indicator} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import CartOrder from '../home-component/CartOrder';
import ModalToping from '../home-component/ModalToping';
import {TextFormatter} from '../../utils';

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
    } catch (error) {}
  };

  // Gọi danh sách sản phẩm từ API
  const fetchProducts = async id => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {}
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
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
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
            buttons={
              categories ? (
                categories.map(category => category.name)
              ) : (
                <Indicator size={24} color={colors.primary} />
              )
            }
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </View>
        <FlatList
          data={searchTerm.length > 0 ? filteredProducts : productsByCate}
          keyExtractor={item => item._id.toString()}
          numColumns={5}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          renderItem={({item}) => (
            <>
              <View style={styles.productCard}>
                <Image source={{uri: item.image}} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>
                    {item.sellingPrice
                      ? `${TextFormatter.formatCurrency(
                          item.originalPrice,
                        )} - ${TextFormatter.formatCurrency(item.sellingPrice)}`
                      : TextFormatter.formatCurrency(item.originalPrice)}
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddProduct(item._id)}>
                    <Text style={styles.addButtonText}>Thêm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
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

const styles = StyleSheet.create({
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
    color: colors.gray700,
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
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default React.memo(HomeScreen);
