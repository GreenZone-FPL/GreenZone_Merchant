import React, {useEffect, useState} from 'react';
import {
  Modal,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Pressable,
} from 'react-native';

import {colors, GLOBAL_KEYS} from '../../../constants';
import {AppAsyncStorage, TextFormatter} from '../../../utils';
import {Row, Column, TitleText, OverlayStatusBar} from '../../../components';
import {Icon} from 'react-native-paper';
import {CartManager} from '../../../utils/cartManager';

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
        const merchantData = await AppAsyncStorage.readData(
          AppAsyncStorage.STORAGE_KEYS.storeId,
        );
        if (merchantData) {
          setMerchant(merchantData);
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    loadMerchant();
  }, []);

  //Chọn size đầu tiên
  useEffect(() => {
    if (selectedProduct?.variant?.length > 0) {
      setSelectedSize(selectedProduct.variant[0]);
    }
  }, [selectedProduct]);

  // cập nhập số lượng product
  const updateProductQuantity = number => {
    CartManager.changeProductQuantity(
      selectedProduct,
      number,
      setSelectedProduct,
    );
  };

  // cập nhập số lượng topping
  const updateToppingQuantity = (item, number) => {
    CartManager.changeToppingQuantity(item, number, setSelectedToppings);
  };

  // thêm sản phẩm vào giỏ hàng

  const addToCart = () => {
    if (merchant) {
      CartManager.confirmAddToCart(
        selectedProduct,
        selectedSize,
        selectedToppings,
        setSelectedProduct,
        setSelectedToppings,
        setSelectedSize,
        setOpenMenu,
        setCart,
        merchant,
        cart,
      );
    }
  };

  // useEffect(() => {
  //   console.log('cart', JSON.stringify(cart, null, 2));
  // }, [cart]);

  // useEffect(() => {
  //   console.log('selectedProduct', JSON.stringify(selectedProduct, null, 2));
  // }, [selectedProduct]);
  // useEffect(() => {
  //   console.log('selectedSize', JSON.stringify(selectedSize, null, 2));
  // }, [selectedSize]);

  return (
    <Modal visible={openMenu} transparent animationType="none">
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
                <Column>
                  <TitleText
                    text={selectedProduct?.name}
                    style={{color: colors.black2}}
                  />
                  <Row>
                    <Pressable
                      style={styles.bigQuantityButton}
                      onPress={() => {
                        updateProductQuantity(-1);
                      }}>
                      <Icon source={'minus'} size={20} color={colors.white} />
                    </Pressable>
                    <Text style={styles.bigTextQuantity}>
                      {selectedProduct?.quantity}
                    </Text>
                    <Pressable
                      style={styles.bigQuantityButton}
                      onPress={() => {
                        updateProductQuantity(1);
                      }}>
                      <Icon source={'plus'} size={20} color={colors.white} />
                    </Pressable>
                  </Row>
                </Column>
              </Row>

              <Pressable
                style={{
                  borderRadius: 20,
                  backgroundColor: colors.green100,
                  padding: 10,
                }}
                onPress={() => {
                  setSelectedToppings([]);
                  setSelectedSize(null);
                  setSelectedProduct({quantity: 1});
                  setOpenMenu(false);
                }}>
                <Icon source="close" color={colors.primary} size={24} />
              </Pressable>
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
                      <Pressable
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
                      </Pressable>
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
                      const selectedTopping = selectedToppings.find(
                        t => t?._id === item?._id,
                      );
                      const quantity = selectedTopping
                        ? selectedTopping.quantity
                        : 0;

                      return (
                        <Pressable
                          key={item?._id}
                          style={[
                            styles.toppingOption,
                            isSelected && styles.selectedTopping,
                          ]}
                          onPress={() => {
                            CartManager.toggleTopping(
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
                                  size={20}
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
                                  size={20}
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
                        </Pressable>
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
              <Pressable
                style={[
                  styles.confirmButton,
                  {backgroundColor: colors.primary},
                ]}
                onPress={() => {
                  addToCart();
                }}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </Pressable>
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
  bigQuantityButton: {
    borderRadius: 24,
    padding: 8,
    backgroundColor: colors.primary,
  },
  button: {
    borderRadius: 24,
    backgroundColor: colors.primary,
    padding: 4,
  },
  bigTextQuantity: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    width: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 6,
  },
  textQuantity: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    width: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 6,
  },
});
export default React.memo(ModalToping);
