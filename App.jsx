import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider, useAppContext } from './src/context/appContext';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MerchantSocketService from './src/sevices/merchantSocketService';
import { AppAsyncStorage } from './src/utils';

const BaseStack = createNativeStackNavigator();


function App() {
  return (
    <AppContextProvider>
      <SafeAreaProvider>
        <NavigationContainer>

          <AppNavigator />

        </NavigationContainer>

        <FlashMessage position='top' />
      </SafeAreaProvider>
    </AppContextProvider>

  );
}

const AppNavigator = () => {

  const { orderNew, setOrderNew, authState } = useAppContext()


  useEffect(() => {
    console.log('🛠 Initializing socket...');
    MerchantSocketService.initialize((newOrder) => {
      console.log('📥 Data received in AppNavigator:', newOrder);
      setOrderNew(newOrder);
    });

    return (() => {
      MerchantSocketService.disconnect()
    })
  }, []);


  useEffect(() => {
    console.log('orderNew:', orderNew);
    if (orderNew) {
      showMessage({
        message: 'Đơn hàng mới',
        description: orderNew.message,
        type: 'success',
        icon: 'success',
        duration: 10000,
        titleStyle: { fontSize: 18, fontWeight: 'bold' },
        textStyle: { fontSize: 16, color: 'white' },
      });
    }
  }, [orderNew]);


  return (

    <BaseStack.Navigator
      screenOptions={{ headerShown: false }}
    >
      {
        authState.needAuthen ?
          <BaseStack.Screen name={'LoginScreen'} component={LoginScreen} />

          :
          <>
            <BaseStack.Screen name={'MainNavigation'} component={MainNavigation} />
          </>


      }


    </BaseStack.Navigator>
  )
}

export default App;
