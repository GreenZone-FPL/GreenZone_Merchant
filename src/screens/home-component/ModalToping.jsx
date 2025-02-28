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
import {TextFormatter} from '../../utils';

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
          <Text style={styles.title}>Chọn Size</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    margin: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: GLOBAL_KEYS.PADDING_DEFAULT,
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
  toppingList: {
    flex: 1,
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
});
export default ModalToping;
