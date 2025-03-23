import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {getEmployeesAllAvailable} from '../../../axios/index';
import {GLOBAL_KEYS, colors} from '../../../constants';

const ShipperSelectModal = ({visible, onClose, onSelect}) => {
  const [shippers, setShippers] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchShippers();
    }
  }, [visible]);

  const fetchShippers = async () => {
    try {
      const response = await getEmployeesAllAvailable();
      setShippers(response.data);
    } catch (error) {
      console.log('Lỗi khi lấy danh sách shipper:', error);
    }
  };

  const handleSelectShipper = shipper => {
    onSelect(shipper);
    // onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Chọn Shipper</Text>
          <ScrollView contentContainerStyle={styles.shipperList}>
            {shippers.map(shipper => (
              <Pressable
                key={shipper._id}
                onPress={() => handleSelectShipper(shipper)}
                style={styles.shipperItem}>
                <Text
                  style={
                    styles.shipperName
                  }>{`${shipper.firstName} ${shipper.lastName}`}</Text>
              </Pressable>
            ))}
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
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
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
  },
  shipperName: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '500',
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
});

export default ShipperSelectModal;
