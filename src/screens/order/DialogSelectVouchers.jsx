import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getAllVoucher} from '../../axios';
import {Column, OverlayStatusBar} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {IconButton} from 'react-native-paper';
import {updateTotalPrice} from '../../utils/cartManager';

const DialogSelectVouchers = ({
  cart,
  setCart,
  showVoucherModal,
  setShowVoucherModal,
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [voucher, setVoucher] = useState(null);

  useEffect(() => {
    const getVouchers = async () => {
      const type = 'global';
      try {
        const response = await getAllVoucher(type);
        if (response) {
          setVouchers(response);
          // console.log('response', JSON.stringify(response, null, 2));
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    getVouchers();
  }, []);

  const cancelModal = () => {
    setShowVoucherModal(false);
    setVoucher(null);
  };

  const confirmModal = async () => {
    await setCart(prev => {
      const updated = {...prev, voucher: voucher?._id, voucherInfor: voucher};
      return updated;
    });
    await updateTotalPrice(setCart);
    await cancelModal();
  };

  useEffect(() => {
    console.log('Cart', JSON.stringify(cart, null, 2));
  }, [cart]);

  return (
    <Modal visible={showVoucherModal} animationType="slide" transparent={true}>
      <Pressable style={styles.body} onPress={() => cancelModal()}>
        <OverlayStatusBar />
        <Pressable style={styles.content} onPress={() => {}}>
          <Text style={styles.textHeader}>Phiếu giảm giá</Text>

          <View style={styles.closeButton}>
            <IconButton
              icon="close"
              size={24}
              color={colors.primary}
              onPress={() => {
                cancelModal();
              }}
            />
          </View>

          <FlatList
            data={vouchers}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <Pressable
                onPress={() => item && setVoucher(item)}
                style={[
                  styles.containerItem,
                  item?._id === voucher?._id && styles.selectVocher,
                ]}>
                <Image style={styles.image} source={{uri: item?.image}} />
                <Column>
                  <Text style={styles.textName}>{item?.name}</Text>
                  <Text>{item.description}</Text>
                  <Text style={styles.textEndDay}>
                    Hết hạn: {new Date(item?.endDate).toLocaleString('vi-VN')}
                  </Text>
                </Column>
              </Pressable>
            )}
            contentContainerStyle={styles.flatListContent}
          />

          <Pressable
            style={styles.confirmButtonWrapper}
            onPress={() => {
              confirmModal();
            }}>
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '60%',
    marginVertical: 64,
    backgroundColor: colors.white,
    padding: 32,
    borderRadius: 16,
    gap: 16,
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    end: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green100,
    borderRadius: 99,
    margin: 16,
    width: 34,
    height: 34,
  },
  containerItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 16,
  },
  selectVocher: {
    borderColor: colors.primary,
  },
  textHeader: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '500',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  textName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
  textEndDay: {
    color: colors.yellow600,
  },
  flatListContent: {
    gap: 16,
  },
  confirmButtonWrapper: {
    alignSelf: 'flex-end',
  },
  confirmButtonText: {
    padding: 16,
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 8,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: '500',
  },
});

export default DialogSelectVouchers;
