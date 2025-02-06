import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';
import { Switch } from 'react-native-paper';
import { Column, FlatInput, LightStatusBar, PrimaryButton, Row, NormalText } from '../../components';
import { colors, GLOBAL_KEYS } from '../../constants';
import { AppGraph } from '../../layouts/graphs';


const LoginScreen = props => {
  const navigation = props.navigation
  const [maNv, setMaNv] = useState();
  const [password, setPassword] = useState();
  const [checked, setChecked] = useState();
  const [isPasswordVisible, setIsPasswordVisible] = useState();

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
              placeholder="Nhập mã nhân viên của bạn"
              setValue={setMaNv}
            />
            <FlatInput
              value={password}
              label="Mật khẩu"
              style={{ width: '100%' }}
              placeholder="Nhập mật khẩu của bạn"
              setValue={setPassword}
              keyboardType=""
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
              secureTextEntry={true}
            />

            <Row style={{ justifyContent: 'space-between', width: '100%' }}>
              <Row>
                <Switch
                  value={checked}
                  color={colors.primary}
                  onValueChange={(value) => setChecked(value)}
                />
                <NormalText text='Ghi nhớ tôi' />

              </Row>

              <Pressable >
                <NormalText text='Quên mật khẩu?' style={{ color: colors.primary, fontWeight: '500' }} />
              </Pressable>
            </Row>
            <PrimaryButton
              title="Đăng nhập"
              onPress={() => navigation.navigate(AppGraph.MAIN)}
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


});
