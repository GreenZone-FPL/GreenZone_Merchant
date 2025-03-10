import './gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LoginScreen from './src/screens/auth/LoginScreen';
import MainNavigation from './src/layouts/MainNavigation';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
import MerchantSocketService from './src/sevices/merchantSocketService';
import Toast, {BaseToast} from 'react-native-toast-message';
import {Dimensions, Platform} from 'react-native';
import { colors } from './src/constants';


// Kiểm tra thiết bị có phải là tablet không
const isTablet = () => {
  const {width, height} = Dimensions.get('window');
  return Math.min(width, height) >= 600; // Nếu chiều nhỏ nhất >= 600px => Tablet
};

const BaseStack = createNativeStackNavigator();

const customToastConfig = {
  success: ({text1, text2, props}) => (
    <BaseToast
      style={{
        borderLeftColor: colors.primary,
        borderLeftWidth: 8,
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 10,
        width: '80%',
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: isTablet() ? 22 : 18,
        fontWeight: 'bold',
        color: colors.primary,
      }}
      text2Style={{
        fontSize: isTablet() ? 18 : 16,
        color: colors.gray700,
      }}
      text1={text1}
      text2={text2}
      {...props}
    />
  ),
};

function App() {
  useEffect(() => {
    async function setupSocket() {
      const storeId = await AppAsyncStorage.readData('storeId');
      if (storeId) {
        MerchantSocketService.initialize();
      } else {
        console.log('❌ Chưa có storeId, không khởi tạo socket!');
      }
    }
    setupSocket();
  }, []);

  useEffect(() => {
    const handleNewOrder = data => {
      console.log('📦 Đơn hàng mới:', data);
      Toast.show({
        type: 'success',
        text1: '📢 Đơn hàng mới!',
        text2: `Mã đơn: ${data.orderId}`,
        position: 'top',
        visibilityTime: 4000,
        text1Style: {
          fontSize: isTablet() ? 22 : 16,
          fontWeight: 'bold',
        },
        text2Style: {
          fontSize: isTablet() ? 18 : 14,
        },
        style: {
          width: '100%',
          paddingVertical: isTablet() ? 20 : 10,
          borderRadius: isTablet() ? 20 : 10,
        },

      });
    };

    MerchantSocketService.on('order.new', handleNewOrder);

    return () => {
      MerchantSocketService.off('order.new', handleNewOrder);
    };
  }, []);

  return (

    <SafeAreaProvider>
      <NavigationContainer>
        <BaseStack.Navigator screenOptions={{headerShown: false}}>
          <BaseStack.Screen name={'LoginScreen'} component={LoginScreen} />
          <BaseStack.Screen
            name={'MainNavigation'}
            component={MainNavigation}
          />
          <BaseStack.Screen
            name={'OrderDetailScreen'}
            component={OrderDetailScreen}
          />
        </BaseStack.Navigator>
      </NavigationContainer>
  <Toast config={customToastConfig} />
    </SafeAreaProvider>

  );
}

export default App;
