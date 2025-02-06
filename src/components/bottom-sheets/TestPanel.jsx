import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import SlidingPanel from 'react-native-sliding-panels';

const { width, height } = Dimensions.get('window');

const TestPanel = () => {
  const [address, setAddress] = useState('123 Đường ABC, Quận 1, TP.HCM');
  const [note, setNote] = useState('');

  return (
    <View style={styles.container}>
      {/* Nội dung chính */}
      <View style={styles.bodyViewStyle}>
        <Text>Đây là màn hình chính</Text>
      </View>

      {/* Sliding Panel */}
      <SlidingPanel
        panelPosition="bottom"
        headerLayoutHeight={80}
        slidingPanelLayoutHeight={300}
        allowDragging={true}
        allowAnimation={true}
        headerLayout={() => (
          <View style={styles.headerLayoutStyle}>
            <Text style={styles.commonTextStyle}>🚚 Giao đến: {address}</Text>
          </View>
        )}
        slidingPanelLayout={() => (
          <View style={styles.slidingPanelLayoutStyle}>
            <Text style={styles.commonTextStyle}>Chỉnh sửa địa chỉ:</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Nhập địa chỉ mới"
            />
            <Text style={styles.commonTextStyle}>Ghi chú cho tài xế:</Text>
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Nhập ghi chú"
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLayoutStyle: {
    width,
    height: 80,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidingPanelLayoutStyle: {
    width,
    height: 300,
    backgroundColor: '#7E52A0',
    padding: 16,
  },
  commonTextStyle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default TestPanel;
