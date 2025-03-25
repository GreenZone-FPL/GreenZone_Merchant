import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';

import {
  Column,
  FlatInput,
  LightStatusBar,
  PrimaryButton
} from '../../components';

import { login } from '../../axios/index';
import { NormalLoading } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { useAppContext } from '../../context/appContext';
import MerchantSocketService from '../../sevices/merchantSocketService';
import { Toaster } from '../../utils';
import { AuthActionTypes } from '../../reducers/authReducer';
const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const LoginScreen = props => {
  const { navigation } = props;
  const [phoneNumber, setPhoneNumber] = useState('0811111111');
  const [password, setPassword] = useState('123456');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const { orderNew, setOrderNew, authDispatch } = useAppContext()

  const loginHandle = async () => {
    if (phoneNumber.trim().length !== 10 || !/^[0-9]+$/.test(phoneNumber)) {
      setPhoneNumberError(true);
      setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
      return;
    }
    setLoading(true);

    try {
      const response = await login({ phoneNumber, password });

      console.log(' Đăng nhập thành công, khởi tạo socket...');
      await MerchantSocketService.initialize((newOrder) => {
        setOrderNew(newOrder);
      });

      if (response) {
        authDispatch({ type: AuthActionTypes.LOGIN })
      }

      // navigation.navigate('MainNavigation');

    } catch (error) {
      Toaster.show('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoid}>
        <LightStatusBar />
        <Image
          source={require('../../assets/images/logo2.png')}
          style={styles.imgBanner}
        />
        <Column style={styles.formContainer}>
          <Column style={styles.content}>
            <Text style={styles.welcome}>Chào mừng bạn đến với</Text>
            <Text style={styles.title}>GREEN ZONE</Text>

            <FlatInput
              value={phoneNumber}
              label="Số điện thoại"
              placeholder="Nhập số điện thoại của bạn..."
              style={{ width: '100%', marginVertical: GLOBAL_KEYS.PADDING_SMALL }}
              setValue={text => {
                setPhoneNumberError(false);
                setPhoneNumberMessage('');
                setPhoneNumber(text);
              }}
              error={phoneNumberError}
              invalidMessage={phoneNumberMessage}
            />
            <FlatInput
              value={password}
              label="Mật khẩu"
              style={{ width: '100%', marginVertical: GLOBAL_KEYS.PADDING_SMALL }}
              placeholder="Nhập mật khẩu"
              setValue={setPassword}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
              secureTextEntry={!isPasswordVisible}
            />

            <PrimaryButton
              title="Đăng nhập"
              onPress={loginHandle}
              style={{ width: '100%' }}
            />
          </Column>
        </Column>
      </KeyboardAvoidingView>
      <NormalLoading visible={loading} />
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  imgBanner: {
    width: isTablet ? '20%' : '25%',
    height: isTablet ? 240 : 180,
    resizeMode: 'stretch',
    alignSelf: 'center',
    marginVertical: isTablet
      ? GLOBAL_KEYS.PADDING_DEFAULT
      : GLOBAL_KEYS.PADDING_SMALL,
  },
  formContainer: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
    maxWidth: isTablet ? 600 : '100%',
  },
  content: {
    flex: 1,
    padding: isTablet
      ? GLOBAL_KEYS.PADDING_DEFAULT * 2
      : GLOBAL_KEYS.PADDING_DEFAULT,
    gap: isTablet ? GLOBAL_KEYS.GAP_DEFAULT * 1.5 : GLOBAL_KEYS.GAP_DEFAULT,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
  },
  welcome: {
    textAlign: 'center',
    fontSize: isTablet
      ? GLOBAL_KEYS.TEXT_SIZE_DEFAULT * 1.5
      : GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '400',
  },
  title: {
    textAlign: 'center',
    fontSize: isTablet ? 32 : 24,
    fontWeight: '800',
    color: colors.primary,
  },
});
