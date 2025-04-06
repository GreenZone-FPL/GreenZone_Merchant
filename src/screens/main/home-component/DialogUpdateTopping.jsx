import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';

import {colors, GLOBAL_KEYS} from '../../../constants';
import {TextFormatter} from '../../../utils';
import {Row, Column, TitleText, OverlayStatusBar} from '../../../components';
import {Icon} from 'react-native-paper';
import {cartManager, updateTotalPrice} from '../../../utils/cartManager';

const {width} = Dimensions.get('window').width;

const DialogUpdateTopping = ({
  openMenu,
  setOpenMenu,
  cart,
  setCart,
  orderItem,
}) => {
  const [selectedProduct, setSelectedProduct] = useState();

  const [selectedToppings, setSelectedToppings] = useState();
  const [selectedSize, setSelectedSize] = useState();

  useEffect(() => {
    setSelectedProduct(orderItem?.selectedProduct);
    setSelectedToppings(orderItem?.selectedToppings);
    setSelectedSize(orderItem?.selectedSize);
  }, [cart.orderItem]);

  // cập nhập số lượng product
  const updateProductQuantity = number => {
    cartManager().changeProductQuantity(
      selectedProduct,
      number,
      setSelectedProduct,
    );
  };

  // cập nhập số lượng topping
  const updateToppingQuantity = (item, number) => {
    cartManager().changeToppingQuantity(item, number, setSelectedToppings);
  };

  // thêm sản phẩm vào giỏ hàng
  const updateProduct = () => {
    // Tính tổng giá topping, nhân với số lượng topping
    const totalToppingPrice = (selectedToppings || []).reduce(
      (total, topping) =>
        total + (topping.extraPrice || 0) * (topping.quantity || 1),
      0,
    );

    // Tổng giá sản phẩm = giá sản phẩm + tổng giá topping
    const totalProductPrice = selectedSize.sellingPrice + totalToppingPrice;

    const orderItemUpdate = {
      _id: orderItem._id,
      variant: selectedSize._id,
      quantity: selectedProduct.quantity,
      price: totalProductPrice || 0,
      toppingItems: selectedToppings || [],
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      variantName: selectedSize.size,
      image: selectedProduct.image,
      isVariantDefault: false,
      selectedProduct: selectedProduct,
      selectedSize: selectedSize,
      selectedToppings: selectedToppings,
    };

    cartManager().updateProduct(orderItemUpdate, setCart);
    updateTotalPrice(setCart);
    setOpenMenu(false);
  };

  // useEffect(() => {
  //   console.log('cart', JSON.stringify(cart, null, 2));
  // }, [cart]);

  // useEffect(() => {
  //   console.log('orderItem', JSON.stringify(orderItem, null, 2));
  // }, [orderItem]);
  // useEffect(() => {
  //   console.log('selectedSize', JSON.stringify(selectedSize, null, 2));
  // }, [selectedSize]);

  // useEffect(() => {
  //   console.log('selectedProduct', JSON.stringify(selectedProduct, null, 2));
  // }, [selectedProduct]);
  // useEffect(() => {
  //   console.log('selectedToppings', JSON.stringify(selectedToppings, null, 2));
  // }, [selectedToppings]);

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
                  source={{uri: orderItem?.selectedProduct.image}}
                />
                <Column
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TitleText
                    text={orderItem?.selectedProduct.name}
                    style={{color: colors.black2}}
                  />
                  {/* <Row>
                    <Pressable
                      style={styles.button}
                      onPress={() => {
                        updateProductQuantity(-1);
                      }}>
                      <Icon source={'minus'} size={24} color={colors.white} />
                    </Pressable>
                    <Text style={styles.textQuantity}>
                      {selectedProduct?.quantity}
                    </Text>
                    <Pressable
                      style={styles.button}
                      onPress={() => {
                        updateProductQuantity(1);
                      }}>
                      <Icon source={'plus'} size={24} color={colors.white} />
                    </Pressable>
                  </Row> */}
                </Column>
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
                  {orderItem?.selectedProduct?.variant
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
                          {item?.size} -{' '}
                          {TextFormatter.formatCurrency(item?.sellingPrice)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </Column>
              </Column>

              {orderItem?.selectedProduct?.topping?.length > 0 && (
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
                    data={orderItem?.selectedProduct?.topping.filter(
                      item => item != null,
                    )}
                    keyExtractor={item => item?._id}
                    renderItem={({item}) => {
                      const isSelected = selectedToppings?.some(
                        t => t?._id === item?._id,
                      );
                      const selectedTopping = selectedToppings?.find(
                        t => t?._id === item?._id,
                      );
                      const quantity = selectedTopping
                        ? selectedTopping.quantity
                        : 0;

                      return (
                        <TouchableOpacity
                          key={item?._id}
                          style={[
                            styles.toppingOption,
                            isSelected && styles.selectedTopping,
                          ]}
                          onPress={() => {
                            cartManager().toggleTopping(
                              item,
                              setSelectedToppings,
                            );
                          }}>
                          {isSelected && (
                            <Row style={{position: 'absolute', start: 20}}>
                              <Pressable
                                style={styles.button}
                                onPress={() => {
                                  updateToppingQuantity(item, -1);
                                }}>
                                <Icon
                                  source={'minus'}
                                  size={24}
                                  color={colors.white}
                                />
                              </Pressable>
                              <Text style={styles.textQuantity}>
                                {quantity}
                              </Text>
                              <Pressable
                                style={styles.button}
                                onPress={() => {
                                  updateToppingQuantity(item, 1);
                                }}>
                                <Icon
                                  source={'plus'}
                                  size={24}
                                  color={colors.white}
                                />
                              </Pressable>
                            </Row>
                          )}

                          <Text
                            style={[
                              styles.sizeText,
                              isSelected && styles.selectedToppingText,
                            ]}>
                            {item?.name} (+
                            {TextFormatter.formatCurrency(item?.extraPrice)})
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
                onPress={() => {
                  updateProduct();
                }}>
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
    flexDirection: 'row',
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    gap: 16,
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
  button: {
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  textQuantity: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    width: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
export default React.memo(DialogUpdateTopping);
