import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';

import {colors, GLOBAL_KEYS} from '../../../constants';
import {AppAsyncStorage, TextFormatter} from '../../../utils';
import {Row, Column, TitleText, OverlayStatusBar} from '../../../components';
import {Icon} from 'react-native-paper';

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
}) => {
  const [merchant, setMerchant] = useState(null);

  // lấy dữ liệu cửa hàng
  useEffect(() => {
    const loadMerchant = async () => {
      try {
        const merchantData = await AppAsyncStorage.readData('merchant');
        if (merchantData) {
          setMerchant(merchantData);
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
    // if (selectedToppings.length === 3) return;
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
        topping: item?._id,
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
          consigneeName: null,
          consigneePhone: null,
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
      <OverlayStatusBar />
      <Pressable
        onPress={() => setOpenMenu(false)}
        style={styles.modalContainer}>
        <Pressable onPress={() => {}} style={{flex: 1}}>
          <Column style={styles.modalContent}>
            <Row style={styles.headerContainer}>
              <Row style={{gap: 16}}>
                <Image
                  style={{width: 100, height: 100, borderRadius: 80}}
                  source={{uri: selectedProduct?.image}}
                />
                <TitleText
                  text={selectedProduct?.name}
                  style={{color: colors.black2}}
                />
              </Row>

              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  backgroundColor: colors.green100,
                  padding: 10,
                }}
                onPress={() => {
                  setSelectedToppings([]);
                  setSelectedSize(null);
                  setSelectedProduct(null);
                  setOpenMenu(false);
                }}>
                <Icon source="close" color={colors.primary} size={24} />
              </TouchableOpacity>
            </Row>

            <Row style={{gap: 30, flex: 1}}>
              <Column
                style={{
                  backgroundColor: colors.white,
                  height: '100%',
                  paddingHorizontal: 24,
                  paddingVertical: 16,
                  borderRadius: 6,
                  width: '30%',
                }}>
                <TitleText text="Size" style={{color: colors.orange700}} />

                <Column style={{gap: 16}}>
                  {selectedProduct?.variant
                    ?.filter(item => item != null)
                    .map(item => (
                      <TouchableOpacity
                        key={item?._id}
                        style={[
                          styles.sizeOption,
                          selectedSize?._id === item._id && styles.selectedSize,
                        ]}
                        onPress={() => setSelectedSize(item)}>
                        <Text
                          style={[
                            styles.sizeText,
                            selectedSize?._id === item?._id &&
                              styles.selectedSizeText,
                          ]}>
                          {item?.size} - {item?.sellingPrice} VNĐ
                        </Text>
                      </TouchableOpacity>
                    ))}
                </Column>
              </Column>

              {selectedProduct?.topping?.length > 0 && (
                <Column
                  style={{
                    flex: 1,
                    backgroundColor: colors.white,
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    borderRadius: 6,
                  }}>
                  <TitleText text="Topping" style={{color: colors.orange700}} />

                  <FlatList
                    data={selectedProduct?.topping.filter(item => item != null)}
                    keyExtractor={item => item?._id}
                    renderItem={({item}) => {
                      const isSelected = selectedToppings.some(
                        t => t?._id === item?._id,
                      );
                      return (
                        <TouchableOpacity
                          key={item?._id}
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
                            {item?.name} (+ {item?.extraPrice})
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                    contentContainerStyle={{
                      flexGrow: 1,
                      gap: GLOBAL_KEYS.GAP_DEFAULT,
                    }}
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}
                  />
                </Column>
              )}
            </Row>

            <Row
              style={{
                backgroundColor: colors.white,
                width: '100%',
                justifyContent: 'flex-end',
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 6,
              }}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {backgroundColor: colors.primary},
                ]}
                onPress={confirmAddToCart}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </Row>
          </Column>
        </Pressable>
      </Pressable>
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
    flex: 1,
    width: '70%',
    backgroundColor: colors.fbBg,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    margin: 50,
  },
  headerContainer: {
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'flex-start',
  },
  sizeOption: {
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  selectedSize: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sizeText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
  },
  selectedSizeText: {
    color: colors.black2,
  },
  toppingOption: {
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  selectedTopping: {
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  selectedToppingText: {
    color: colors.black,
  },

  confirmButton: {
    backgroundColor: colors.gray400,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    marginHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
    minWidth: '10%',
  },
  confirmButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
});
export default React.memo(ModalToping);
