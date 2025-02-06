import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';
import { Column, FlatInput, LightStatusBar, PrimaryButton, Row } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { Switch } from 'react-native-paper';


const LoginScreen = props => {
  const [maNv, setMaNv] = useState();
  const [password, setPassword] = useState();
  const [checked, setChecked] = useState();
  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView>
        <LightStatusBar />
        <Image
          source={require('../../assets/images/logo2.png')}
          style={styles.imgBanner}
        />
        <Column style={styles.body}>
          <Column style={styles.content}>
            <Text style={styles.welcome}>Chào mừng bạn đến với</Text>
            <Text style={styles.title}>GREEN ZONE</Text>
            <FlatInput
              value={maNv}
              label="Mã nhân viên"
              style={{ width: '100%' }}
              placeholder="Nhập số điện thoại của bạn..."
              setValue={setMaNv}
            />
            <FlatInput
              value={password}
              label="Mật khẩu"
              style={{ width: '100%' }}
              placeholder="Nhập số điện thoại của bạn..."
              setValue={setPassword}
              keyboardType=""
              secureTextEntry={true}
            />

            <Row style={{ justifyContent: 'space-between', width: '100%' }}>
              <Row>
                <Switch
                  value={checked}
                  color={colors.primary}
                  onValueChange={(value) => setChecked(value)}
                />
                <Text>Ghi nhớ tôi</Text>
              </Row>

              <Text style={{ color: colors.primary, fontWeight: '600' }}>Quên mật khẩu?</Text>
            </Row>
            <PrimaryButton
              title="Đăng nhập"
              onPress={() => console.log('đăng nhập')}
              style={{ width: '100%' }}
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
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  imgBanner: {
    width: '80%',
    height: 280,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  body: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
  },
  welcome: {
    textAlign: 'center',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '400',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary,
  },
  other: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.gray700,
    fontWeight: '500',
  },
  fbLoginBtn: {
    backgroundColor: colors.blue600,
    flexDirection: 'row',
    width: '100%',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'center',
  },
  textFb: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: '500',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
  googleLoginBtn: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    width: '100%',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    alignContent: 'center',
    alignItems: 'center',
    gap: GLOBAL_KEYS.GAP_SMALL,
    justifyContent: 'center',
    borderColor: colors.gray200,
    borderWidth: 1,
  },
  textGoogle: {
    textAlign: 'center',
    color: colors.black,
    fontWeight: '500',
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
  },
});
