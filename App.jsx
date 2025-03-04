/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthGraph, MainGraph, OrderGraph} from './src/layouts/graphs';
import LoginScreen from './src/screens/auth/LoginScreen';
import MainNavigation from './src/layouts/MainNavigation';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from './src/axios/index';
const BaseStack = createNativeStackNavigator();

function App() {
  const feathLogin = async () => {
    const phoneNumber = '0922222222';
    const password = '9re05645';

    try {
      const response = await login({phoneNumber, password});
      const accessToken = response.data.token.accessToken.token;
      const refreshToken = response.data.token.refreshToken.token;
      const merchant = response.data.user;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('merchant', JSON.stringify(merchant));
      // console.log(
      //   'AccessToken lưu vào AsyncStorage:',
      //   accessToken,
      //   // JSON.stringify(merchantUser, null, 2),
      // );
      return response;
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
    }
  };

  useEffect(() => {
    feathLogin();
  }, []);
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <NavigationContainer>
          <BaseStack.Navigator screenOptions={{headerShown: false}}>
            <BaseStack.Screen
              name={MainGraph.graphName}
              component={MainNavigation}
            />
            <BaseStack.Screen
              name={AuthGraph.LoginScreen}
              component={LoginScreen}
            />
            <BaseStack.Screen
              name={OrderGraph.OrderDetailScreen}
              component={OrderDetailScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'transparentModal',
                headerShown: false,
              }}
            />
          </BaseStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
