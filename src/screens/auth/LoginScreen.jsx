import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import {Switch} from 'react-native-paper';
import {
  Column,
  FlatInput,
  LightStatusBar,
  PrimaryButton,
  Row,
  NormalText,
} from '../../components';

import {Ani_ModalLoading} from '../../components/animations/Ani_ModalLoading';
import {colors, GLOBAL_KEYS} from '../../constants';
import {AppGraph} from '../../layouts/graphs';
import {AppAsyncStorage, Toaster} from '../../utils';
import {login} from '../../axios/index';

const {width} = Dimensions.get('window');
const isTablet = width >= 768;

const LoginScreen = props => {
  const navigation = props.navigation;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');

  // 0922222222   9re05645
  // Tải dữ liệu đã lưu khi mở app
  useEffect(() => {
    const loadAccountInfo = async () => {
      const account = await AppAsyncStorage.readData('userAccount');
      if (account) {
        setPhoneNumber(account.phoneNumber);
        setPassword(account.password);
        setChecked(account.checked);
      }
      setIsLoaded(true);
    };

    loadAccountInfo();
  }, []);

  //  Lưu hoặc xóa tài khoản khi checked thay đổi
  useEffect(() => {
    if (!isLoaded) return;

    const syncAccountInfo = async () => {
      if (checked && phoneNumber && password) {
        await AppAsyncStorage.storeData('userAccount', {
          phoneNumber,
          password,
          checked,
        });
        
      } else if (!checked) {
        await AppAsyncStorage.removeData('userAccount');
      }
    };
    syncAccountInfo();
  }, [checked, phoneNumber, password, isLoaded]);

  // login
  const loginHandel = async () => {
    if (phoneNumber.trim().length !== 10 || !/^[0-9]+$/.test(phoneNumber)) {
      setPhoneNumberError(true);
      setPhoneNumberMessage('Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');
      return;
    }
    setLoading(true);

    try {
      const response = await login({phoneNumber, password});
      console.log('>>>>>>>>>>>>>>>>',JSON.stringify(response,null,2))
      // Kiểm tra dữ liệu trả về có hợp lệ không
      const accessToken = response.data?.token?.accessToken?.token;
      const refreshToken = response.data?.token?.refreshToken?.token;
      const merchant = response.data?.user;
      // Lưu token và thông tin người dùng vào AsyncStorage
      await AppAsyncStorage.storeData('accessToken', accessToken);
      await AppAsyncStorage.storeData('refreshToken', refreshToken);
      await AppAsyncStorage.storeData('merchant', JSON.stringify(merchant));
      await AppAsyncStorage.storeData('storeId',response.data?.user?._id);
     
      // console.log(merchant);
      navigation.navigate(AppGraph.MAIN);

      return response;
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
              style={{width: '100%', marginVertical: GLOBAL_KEYS.PADDING_SMALL}}
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
              style={{width: '100%', marginVertical: GLOBAL_KEYS.PADDING_SMALL}}
              placeholder="Nhập mật khẩu"
              setValue={setPassword}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
              secureTextEntry={!isPasswordVisible}
            />
            <Row style={{justifyContent: 'space-between', width: '100%'}}>
              <Row>
                <Switch
                  value={checked}
                  color={colors.primary}
                  onValueChange={() => setChecked(value => !value)}
                />
                <NormalText text="Ghi nhớ tôi" />
              </Row>
              <Pressable>
                <NormalText
                  text="Quên mật khẩu?"
                  style={{color: colors.primary, fontWeight: '500'}}
                />
              </Pressable>
            </Row>
            <PrimaryButton
              title="Đăng nhập"
              onPress={() => loginHandel()}
              style={{width: '100%'}}
            />
          </Column>
        </Column>
      </KeyboardAvoidingView>
      <Ani_ModalLoading loading={loading} />
    </ScrollView>
  );
};

export default React.memo(LoginScreen);

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
