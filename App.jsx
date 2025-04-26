import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppContextProvider, useAppContext} from './src/context/appContext';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MerchantSocketService from './src/sevices/merchantSocketService';
import {AppAsyncStorage} from './src/utils';
import SplashScreen from './src/screens/auth/SplashScreen';
import {OrderStatus} from './src/constants';

const BaseStack = createNativeStackNavigator();

function App() {
  return (
    <AppContextProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <FlashMessage position="top" />
      </SafeAreaProvider>
    </AppContextProvider>
  );
}

const AppNavigator = () => {
  const {orderNew, setOrderNew, authState} = useAppContext();
  const [isTokenValid, setIsTokenValid] = useState(null); // Start with null to show SplashScreen
  const [isLoading, setIsLoading] = useState(true); // Loading state for SplashScreen

  // Initialize the socket
  useEffect(() => {
    console.log('Initializing socket...');
    MerchantSocketService.initialize(newOrder => {
      // console.log('Data received in AppNavigator:', newOrder);
      setOrderNew(newOrder);
    });

    return () => {
      MerchantSocketService.disconnect();
    };
  }, [setOrderNew]);

  // Check token validity
  useEffect(() => {
    const checkToken = async () => {
      const tokenIsValid = await AppAsyncStorage.isTokenValid();
      setIsTokenValid(tokenIsValid); // Update token validity state
      setIsLoading(false); // Once token check is done, set loading to false
    };
    checkToken();
  }, []);

  useEffect(() => {
    console.log('orderNew:', orderNew);
    if (orderNew) {
      showMessage({
        message: 'Đơn hàng mới',
        description: orderNew.message,
        type: 'success',
        icon: 'success',
        duration: 2000,
        titleStyle: {fontSize: 18, fontWeight: 'bold'},
        textStyle: {fontSize: 16, color: 'white'},
      });
    }
  }, [orderNew]);

  // Show splash screen while loading or checking token
  if (isLoading) {
    return <SplashScreen />;
  }

  // After the token check, show the appropriate screen
  return authState.needAuthen ? <LoginScreen /> : <MainNavigation />;
};

export default App;
