import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {GLOBAL_KEYS, colors} from '../../../constants';

const CancelOrderModal = ({visible, onClose, onSelect}) => {
  const [cancelReasons, setCancelReasons] = useState([
    {id: 1, text: 'Khách hàng yêu cầu huỷ đơn hàng'},
    {id: 2, text: 'Sản phẩm hiện không có sẵn tại cửa hàng'},
    {id: 5, text: 'Lý do khác'},
  ]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [customReason, setCustomReason] = useState('');

  const handleConfirm = reason => {
    let finalText = reason.text;
    if (reason.id === 5) {
      if (!customReason.trim()) {
        Alert.alert('Vui lòng nhập lý do cụ thể');
        return;
      }
      finalText = customReason.trim();
    }

    Alert.alert(
      'Xác nhận huỷ đơn',
      `Bạn có chắc muốn huỷ đơn với lý do: "${finalText}"?`,
      [
        {
          text: 'Huỷ bỏ',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            onSelect({id: reason.id, text: finalText});
            onClose();
            setCustomReason('');
            setSelectedReason(null);
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Chọn lý do huỷ đơn</Text>
          <ScrollView contentContainerStyle={styles.reasonList}>
            {cancelReasons.map(reason => (
              <Pressable
                key={reason.id}
                onPress={() => {
                  setSelectedReason(reason);
                  if (reason.id !== 5) {
                    handleConfirm(reason);
                  }
                }}
                style={[
                  styles.reasonItem,
                  selectedReason?.id === reason.id && styles.reasonItemSelected,
                ]}>
                <Text style={styles.reasonText}>{reason.text}</Text>
              </Pressable>
            ))}
            {selectedReason?.id === 5 && (
              <TextInput
                placeholder="Nhập lý do cụ thể..."
                style={styles.input}
                multiline
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}
          </ScrollView>

          {selectedReason?.id === 5 && (
            <Pressable
              onPress={() => handleConfirm(selectedReason)}
              style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Xác nhận huỷ</Text>
            </Pressable>
          )}

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
    width: '60%',
    maxHeight: '80%',
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
  reasonList: {
    paddingVertical: GLOBAL_KEYS.GAP_SMALL,
  },
  reasonItem: {
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  reasonItemSelected: {
    backgroundColor: colors.gray100,
  },
  reasonText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '500',
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 6,
    padding: 10,
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    minHeight: 60,
  },
  confirmButton: {
    marginTop: GLOBAL_KEYS.GAP_DEFAULT,
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    paddingVertical: GLOBAL_KEYS.PADDING_DEFAULT,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: GLOBAL_KEYS.GAP_SMALL,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default CancelOrderModal;
