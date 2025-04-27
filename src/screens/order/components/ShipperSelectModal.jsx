import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {getEmployeesAllAvailable} from '../../../axios/index';
import {GLOBAL_KEYS, colors} from '../../../constants';
import {Column} from '../../../components';

const {width} = Dimensions.get('window');

const ShipperSelectModal = ({visible, onClose, onSelect}) => {
  const [shippers, setShippers] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchShippers();
    }
  }, [visible]);

  const fetchShippers = async () => {
    try {
      const data = await getEmployeesAllAvailable();
      if (Array.isArray(data)) {
        setShippers(data);
      } else {
        console.log('Dữ liệu API không hợp lệ:', data);
        setShippers([]);
      }
    } catch (error) {
      console.log('Lỗi khi lấy danh sách shipper:', error);
      setShippers([]);
    }
  };

  const handleSelectShipper = shipper => {
    onSelect(shipper);
  };

  console.log(shippers);

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Nhân viên hiện có</Text>
          <ScrollView contentContainerStyle={styles.shipperList}>
            {shippers?.length > 0 ? (
              shippers.map(shipper => (
                <Pressable
                  key={shipper._id}
                  onPress={() => handleSelectShipper(shipper)}
                  style={styles.shipperItem}>
                  <Image
                    style={styles.cartItemImage}
                    source={
                      shipper.avatar
                        ? {uri: shipper.avatar}
                        : require('../../../assets/images/helmet.png')
                    }
                  />

                  <Column>
                    <Text style={styles.shipperName}>
                      {`${shipper.firstName} ${shipper.lastName}`}
                    </Text>
                    <Text style={styles.shipperName}>
                      {`${shipper.phoneNumber} `}
                    </Text>
                  </Column>
                </Pressable>
              ))
            ) : (
              <Text style={styles.noShipperText}>Không có nhân viên nào.</Text>
            )}
          </ScrollView>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '45%',
    height: '60%',
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_LARGE,
    padding: 30,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    fontWeight: 'bold',
    marginBottom: GLOBAL_KEYS.GAP_SMALL,
    textAlign: 'center',
    color: colors.primary,
  },
  shipperList: {
    paddingVertical: GLOBAL_KEYS.GAP_SMALL,
  },
  shipperItem: {
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 2,
    borderColor: colors.gray200,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  shipperName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '500',
  },
  noShipperText: {
    textAlign: 'center',
    marginTop: 10,
    color: colors.gray500,
  },
  closeButton: {
    marginTop: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  cartItemImage: {
    width: width / 20 + 20,
    height: width / 20 + 20,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT * 20,
  },
});

export default ShipperSelectModal;
