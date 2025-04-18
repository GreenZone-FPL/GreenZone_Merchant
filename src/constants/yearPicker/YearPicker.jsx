import React, {useState} from 'react';
import {View, Text, Modal, FlatList, StyleSheet, Pressable} from 'react-native';
import {OverlayStatusBar} from '../../components';
import {colors} from '../color';

const YearPicker = ({onSelectYear, setModalVisible, modalVisible}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: currentYear - 2019}, (_, i) => 2020 + i); // Tạo mảng năm từ 1900 đến hiện tại

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleSelectYear = year => {
    setSelectedYear(year);
    setModalVisible(false);
    onSelectYear && onSelectYear(year); // Gửi năm đã chọn ra ngoài nếu có props onSelectYear
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <OverlayStatusBar />
      <Pressable
        onPress={() => setModalVisible(false)} // Đóng modal khi nhấn ra ngoài
        style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <FlatList
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            data={years.reverse()}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.toString()}
            renderItem={({item}) => (
              <Pressable
                style={styles.yearItem}
                onPress={() => handleSelectYear(item)}>
                <Text
                  style={[
                    styles.yearText,
                    selectedYear == item && {
                      color: colors.primary,
                      fontWeight: '500',
                    },
                  ]}>
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền của modal
  },
  modalContainer: {
    width: 500,
    maxHeight: 212,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  yearItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  yearText: {
    fontSize: 20,
    fontWeight: '300',
  },
});

export default YearPicker;
