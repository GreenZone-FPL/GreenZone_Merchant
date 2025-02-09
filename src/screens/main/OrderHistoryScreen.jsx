import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ButtonGroup } from '../../components';
import { colors } from '../../constants';

const OrderHistoryScreen = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(null); // Không chọn mặc định
  const buttons = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn một tùy chọn:</Text>
      <ButtonGroup
        buttons={buttons}
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)} // Cập nhật khi chọn
      />
      {selectedIndex !== null && (
        <Text style={styles.result}>Bạn đã chọn: {buttons[selectedIndex]}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});
export default OrderHistoryScreen