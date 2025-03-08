import {StyleSheet, Text, View, Modal} from 'react-native';
import React from 'react';
import {OverlayStatusBar} from '../status-bars/OverlayStatusBar';
import LottieView from 'lottie-react-native';
import {colors} from '../../constants';

export const Ani_ModalLoading = ({loading, message = 'Đang xử lý...'}) => {
  return (
    <Modal transparent={true} visible={loading} animationType="fade">
      <OverlayStatusBar />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LottieView
            source={require('../../assets/animations/ani_loading.json')}
            autoPlay
            loop
            style={{width: 100, height: 100}}
          />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.gray200,
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
    color: colors.black,
  },
});
