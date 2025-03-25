import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MerchantSocketService from './src/sevices/merchantSocketService';
import Toast, { BaseToast } from 'react-native-toast-message';
import { Dimensions, Platform } from 'react-native';
import { colors } from './src/constants';
import { AppAsyncStorage } from './src/utils';
import { AppContextProvider } from './src/context/appContext';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useAppContext } from './src/context/appContext';

const BaseStack = createNativeStackNavigator();

// Hàm chính của ứng dụng
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
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { orderNew, setOrderNew } = useAppContext();

  // Khởi tạo socket khi có storeId
  useEffect(() => {
    console.log('🛠 Initializing socket...');
    MerchantSocketService.initialize((data) => {
      console.log('📥 Data received in AppNavigator:', data);
      setOrderNew(data);
    });
  }, [setOrderNew]);

  useEffect(() => {
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

  useEffect(() => {
    const checkToken = async () => {
      const tokenIsValid = await AppAsyncStorage.isTokenValid();
      setIsTokenValid(tokenIsValid);
    };
    checkToken();
  }, []);

  return (
    <BaseStack.Navigator
      screenOptions={{ headerShown: false }}
>
          <BaseStack.Screen name="MainNavigation" component={MainNavigation} />
      <BaseStack.Screen name="LoginScreen" component={LoginScreen} />
    
    </BaseStack.Navigator>
  );
};

export default App;
