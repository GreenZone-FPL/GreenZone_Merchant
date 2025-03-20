import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getAllCategories,
  getAllProducts,
  getProductsById,
  getMerchant,
} from '../../axios/index';
import {Ani_ModalLoading, ButtonGroup, CustomSearchBar} from '../../components';
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
  const flatListRef = useRef(null);

  // Gọi danh sách danh mục từ API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategories();
      const categoriesData = [
        {
          _id: 'cate18-06',
          name: 'Tất cả',
          icon: 'https://greenzone.motcaiweb.io.vn/uploads/1cbc176f-2f59-4828-bcf7-5454044e3f26.png',
        },
        ...response.data.docs,
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

  // Lấy dữ liệu id cửa hàng
  useEffect(() => {
    const loadMerchant = async () => {
      try {
        const storeId = await AppAsyncStorage.readData('storeId');
        if (storeId) {
          const response = await getMerchant(storeId);
          setMerchant(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadMerchant();
  }, []);

  // cuon flatlist
  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  };
  const scrollToStart = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index: 0, animated: true});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={{gap: GLOBAL_KEYS.GAP_SMALL}}>
          <Text style={styles.headerText}>{merchant?.name}</Text>
          <Text
            style={
              styles.titleText
            }>{`${merchant?.specificAddress}, ${merchant?.ward}, ${merchant?.district}, ${merchant?.province}`}</Text>
        </View>
        <CustomSearchBar
          placeholder="Tìm kiếm sản phẩm..."
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          onClearIconPress={() => setSearchTerm('')}
          style={{
            backgroundColor: colors.white,
            borderWidth: 1,
            borderColor: colors.gray200,
          }}
        />
        <View>
          <FlatList
            ref={flatListRef}
            horizontal={true}
            data={categories.length > 0 && categories}
            keyExtractor={item => item._id.toString()}
            renderItem={({item, index}) => (
              <View>
                <Pressable
                  style={[
                    styles.buttonDefault,
                    selectedIndex === index && styles.buttonSelected,
                  ]}
                  onPress={() => {
                    setSelectedIndex(index);
                    if (index > categories.length / 2 && index !== 0) {
                      scrollToEnd();
                    } else {
                      scrollToStart();
                    }
                  }}>
                  <Image
                    style={{width: 24, height: 24}}
                    source={{uri: item.icon}}
                  />
                  <Text
                    style={[
                      styles.textDefault,
                      selectedIndex == index && styles.textSelected,
                    ]}>
                    {item.name}
                  </Text>
                </Pressable>
              </View>
            )}
            contentContainerStyle={{gap: GLOBAL_KEYS.GAP_DEFAULT}}
            style={{width: '100%'}}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <FlatList
          data={searchTerm.length > 0 ? filteredProducts : productsByCate}
          keyExtractor={item => item._id.toString()}
          numColumns={4}
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
                <Text style={styles.productPrice}>
                  {TextFormatter.formatCurrency(item.sellingPrice)}
                </Text>
                <Text numberOfLines={2} style={styles.productName}>
                  {item.name}
                </Text>
                {/* <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddProduct(item._id)}>
                  <Icon
                    source={'plus'}
                    size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                    color={colors.primary}
                  />
                </TouchableOpacity> */}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContainer}
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
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },

  leftSection: {
    flex: 6.5,
    backgroundColor: colors.white,
    paddingTop: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  headerText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  titleText: {
    // fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  buttonDefault: {
    flexDirection: 'row',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    borderWidth: 1,
    borderColor: colors.gray200,
    minWidth: 130,
  },
  buttonSelected: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary
  },
  textDefault: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  textSelected: {
    color: colors.primary,
  },
  flatListContainer: {
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    overflow: 'hidden',
  },

  productCard: {
    flex: 1,
    height: width / 4.5,
    maxWidth:
      ((width / 10) * 7) / 4 -
      GLOBAL_KEYS.PADDING_DEFAULT * 2 -
      GLOBAL_KEYS.GAP_SMALL,
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
    marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    resizeMode: 'cover',
  },
  productDetails: {
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: '100%',
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
  },
  productName: {
    flex: 1,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    color: colors.white,
    alignSelf: 'flex-start',
    textAlignVertical: 'bottom',
    padding: 8,
    marginBottom: '20%',
  },
  productPrice: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_SMALL,
    color: colors.gray700,
    padding: GLOBAL_KEYS.PADDING_SMALL,
    textAlign: 'center',
    backgroundColor: colors.white,
    borderRadius: 6,
    fontWeight: '500',
    color: colors.primary,
    alignSelf: 'flex-end',
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  addButton: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    color: colors.white,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
  },
});
export default HomeScreen;
