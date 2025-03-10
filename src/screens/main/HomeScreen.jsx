import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getAllCategories,
  getAllProducts,
  getProductsById,
} from '../../axios/index';
import {
  Ani_ModalLoading,
  ButtonGroup,
  CustomSearchBar,
  Indicator,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import CartOrder from '../home-component/CartOrder';
import ModalToping from '../home-component/ModalToping';
import {AppAsyncStorage, TextFormatter} from '../../utils';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // state lưu dữ liệu
  const [categories, setCategories] = useState([]);
  const [productsByCate, setProductsByCate] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [merchant, setMerchant] = useState(null);

  // Gọi danh sách danh mục từ API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategories();
      const categoriesData = [
        {_id: 'cate18-06', name: 'Tất cả', icon: ''},
        ...response.data,
      ];
      setCategories(categoriesData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi danh sách sản phẩm từ API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi sản phẩm theo danh mục theo index
  const getProductsByCategory = index => {
    if (!products || products.length === 0) return [];
    if (index === 0) {
      return products.flatMap(category => category?.products || []);
    }
    return products[index - 1]?.products || [];
  };

  // Gọi danh mục & sản phẩm từ API
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

  // Gọi API để lấy sản phẩm theo id khi thêm sản phẩm
  const handleAddProduct = async id => {
    try {
      const response = await getProductsById(id);
      setSelectedProduct(response.data);
      setOpenMenu(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Lấy dữ liệu cửa hàng
  useEffect(() => {
    const loadMerchant = async () => {
      try {
        const merchantData = await AppAsyncStorage.readData('merchant');
        if (merchantData) {
          setMerchant(JSON.parse(merchantData));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadMerchant();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.title2}>
            {merchant?.firstName + ' ' + merchant?.lastName}
          </Text>
          <CustomSearchBar
            placeholder="Tìm kiếm đơn hàng..."
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            onClearIconPress={() => setSearchTerm('')}
          />
        </View>
        <View style={styles.optionContainer}>
          {/* <Text style={styles.title}>Chọn danh mục:</Text> */}
          <ButtonGroup
            buttons={
              categories ? categories.map(category => category.name) : []
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
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => handleAddProduct(item._id)}>
              <Image source={{uri: item.image}} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text numberOfLines={2} style={styles.productName}>
                  {item.name}
                </Text>
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
            </TouchableOpacity>
          )}
          // contentContainerStyle={{gap: GLOBAL_KEYS.GAP_DEFAULT / 2}}
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
      <Ani_ModalLoading loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white,
  },

  optionContainer: {
    alignItems: 'flex-start',
    gap: GLOBAL_KEYS.GAP_SMALL,
  },
  leftSection: {
    flex: 7,
    backgroundColor: colors.white,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  productCard: {
    width: '19%',
    margin: '0.5%',
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: width / 10,
    height: width / 10,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    resizeMode: 'cover',
  },
  productDetails: {
    alignItems: 'center',
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
    height: width / 11,
  },
  productName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  productPrice: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL / 2,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
  },
  addButtonText: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
});
export default HomeScreen;
