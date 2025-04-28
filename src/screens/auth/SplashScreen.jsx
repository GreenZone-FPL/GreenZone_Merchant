import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const SplashScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});
