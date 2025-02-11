import React, {useState} from 'react';
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
  TitleText,
} from '../../components';
import {colors, GLOBAL_KEYS} from '../../constants';
import {AppGraph} from '../../layouts/graphs';

// Xác định kích thước màn hình, coi là tablet nếu chiều rộng >= 768
const {width} = Dimensions.get('window');
const isTablet = width >= 768;

const LoginScreen = props => {
  const navigation = props.navigation;
  const [maNv, setMaNv] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoid}>
        <LightStatusBar />
        <Image
          source={require('../../assets/images/logo2.png')}
          style={styles.imgBanner}
        />
        {/* Container trung tâm cho form đăng nhập */}
        <Column style={styles.formContainer}>
          <Column style={styles.content}>
            <Text style={styles.welcome}>Chào mừng bạn đến với</Text>
            <Text style={styles.title}>GREEN ZONE</Text>
            <FlatInput
              value={maNv}
              label="Mã nhân viên"
              style={{width: '100%', marginVertical: GLOBAL_KEYS.PADDING_SMALL}}
              placeholder="Nhập mã nhân viên của bạn"
              setValue={setMaNv}
            />
            <FlatInput
              value={password}
              label="Mật khẩu"
              style={{width: '100%', marginVertical: GLOBAL_KEYS.PADDING_SMALL}}
              placeholder="Nhập mật khẩu của bạn"
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
                  onValueChange={value => setChecked(value)}
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
              onPress={() => navigation.navigate(AppGraph.MAIN)}
              style={{width: '100%'}}
            />
          </Column>
        </Column>
      </KeyboardAvoidingView>
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
  // Container để giữ form đăng nhập, căn giữa và giới hạn chiều rộng cho tablet
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
