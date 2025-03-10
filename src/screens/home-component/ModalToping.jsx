import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors, GLOBAL_KEYS} from '../../constants';
import {AppAsyncStorage, TextFormatter} from '../../utils';

const {width} = Dimensions.get('window').width;

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
  phoneNumber,
  setPhoneNumber,
}) => {
  const [merchant, setMerchant] = useState(null);

  // lấy dữ liệu cửa hàng
  useEffect(() => {
    const loadMerchant = async () => {
      try {
        const merchantData = await AppAsyncStorage.readData('merchant');
        if (merchantData) {
          setMerchant(JSON.parse(merchantData));
        }
      } catch (error) {}
    };

    loadMerchant();
  }, []);

  //Chọn size đầu tiên
  useEffect(() => {
    if (selectedProduct?.variant?.length > 0) {
      setSelectedSize(selectedProduct.variant[0]);
    }
  }, [selectedProduct]);
  //chọn topping
  const toggleTopping = topping => {
    if (selectedToppings.length === 3) return;
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

  // Hàm tạo orderItem
  const addItemOrder = () => {
    // Tính tổng giá topping (nếu không có topping thì mặc định là 0)
    const totalToppingPrice = (selectedToppings || []).reduce(
      (total, topping) => total + (topping.extraPrice || 0),
      0,
    );

    // Tổng giá sản phẩm = giá sản phẩm gốc + tổng giá topping
    const totalProductPrice = selectedSize.sellingPrice + totalToppingPrice;

    return {
      _id: Date.now().toString(),
      variant: selectedSize._id,
      quantity: 1,
      price: selectedSize.sellingPrice,
      toppingItems: (selectedToppings || []).map(item => ({
        topping: item._id,
        quantity: 1,
        price: item.extraPrice,
      })),
      product: selectedProduct,
      size: selectedSize,
      topping: selectedToppings || [],
      totalToppingPrice,
      totalProductPrice,
      totalPrice: totalProductPrice,
    };
  };

  // Hàm tạo giỏ hàng
  const createOrder = () => {
    setCart(prevCart => {
      const newItem = addItemOrder();
      if (!newItem) return prevCart;

      // Nếu giỏ hàng trống, tạo mới giỏ hàng với orderItems chứa newItem
      if (
        !prevCart ||
        !prevCart.orderItems ||
        prevCart.orderItems.length === 0
      ) {
        return {
          _id: Date.now().toString(),
          deliveryMethod: 'pickup',
          fulfillmentDateTime: new Date().toISOString(),
          note: null,
          totalPrice: newItem.totalPrice,
          paymentMethod: 'cod',
          shippingAddress: null,
          store: merchant?.workingStore,
          owner: null,
          voucher: null,
          orderItems: [newItem],
        };
      } else {
        // Kiểm tra xem orderItem mới đã tồn tại trong giỏ hàng chưa (so sánh dựa vào variant và toppingItems)
        const existingItemIndex = prevCart.orderItems.findIndex(
          item =>
            item.variant === newItem.variant &&
            JSON.stringify(item.toppingItems) ===
              JSON.stringify(newItem.toppingItems),
        );

        if (existingItemIndex !== -1) {
          // Nếu đã tồn tại, tăng số lượng và cập nhật lại totalPrice của orderItem đó
          const updatedOrderItems = [...prevCart.orderItems];
          const currentItem = updatedOrderItems[existingItemIndex];
          const newQuantity = currentItem.quantity + 1;
          updatedOrderItems[existingItemIndex] = {
            ...currentItem,
            quantity: newQuantity,
            totalPrice: newQuantity * currentItem.totalProductPrice,
          };

          const updatedTotalPrice = updatedOrderItems.reduce(
            (total, item) => total + item.totalPrice,
            0,
          );

          return {
            ...prevCart,
            orderItems: updatedOrderItems,
            totalPrice: updatedTotalPrice,
          };
        } else {
          // Nếu orderItem chưa tồn tại, thêm vào mảng orderItems và cập nhật tổng giá giỏ hàng
          const updatedTotalPrice =
            prevCart.orderItems.reduce(
              (total, item) => total + item.totalPrice,
              0,
            ) + newItem.totalPrice;

          return {
            ...prevCart,
            orderItems: [...prevCart.orderItems, newItem],
            totalPrice: updatedTotalPrice,
          };
        }
      }
    });
  };

  return (
    <Modal visible={openMenu} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn Size</Text>
          <View style={styles.sizeContainer}>
            {selectedProduct?.variant?.map(item => (
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
            ))}
          </View>

          <Text style={styles.modalTitle}>Chọn Topping</Text>
          <ScrollView style={styles.toppingList}>
            {selectedProduct?.topping?.map(item => {
              const isSelected = selectedToppings.some(t => t._id === item._id);

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
            })}
          </ScrollView>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmAddToCart}>
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, {backgroundColor: 'red'}]}
              onPress={() => {
                setSelectedToppings([]);
                setSelectedSize(null);
                setSelectedProduct(null);
                setOpenMenu(false);
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    flex: 1,
    margin: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
  },
  modalTitle: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE, // thay vì 18
    fontWeight: 'bold',
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: GLOBAL_KEYS.PADDING_SMALL, // thay vì 10
  },
  sizeOption: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT - 4, // giảm 4 đơn vị so với PADDING_DEFAULT
    borderWidth: 1,
    borderColor: colors.gray400, // dùng màu xám từ colors
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_SMALL,
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
  toppingList: {
    flex: 1,
  },
  toppingOption: {
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    paddingHorizontal: '20%',
    borderWidth: 1,
    borderColor: colors.gray400,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.gray200,
    marginVertical: GLOBAL_KEYS.GAP_SMALL / 2,
    alignItems: 'center',
  },
  selectedTopping: {
    backgroundColor: colors.primary,
    borderColor: colors.yellow500,
  },
  toppingText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.primary,
  },
  selectedToppingText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: GLOBAL_KEYS.PADDING_SMALL,
  },
  confirmButton: {
    backgroundColor: '#299345',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
});
export default React.memo(ModalToping);
