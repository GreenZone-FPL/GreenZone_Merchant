import './gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigation from './src/layouts/MainNavigation';
import LoginScreen from './src/screens/auth/LoginScreen';
import MerchantSocketService from './src/sevices/merchantSocketService';
import Toast, {BaseToast} from 'react-native-toast-message';
import {Dimensions, Platform} from 'react-native';
import {colors} from './src/constants';
import {AppAsyncStorage} from './src/utils';

// Hàm kiểm tra thiết bị có phải là tablet không
const isTablet = () => {
  const {width, height} = Dimensions.get('window');
  return Math.min(width, height) >= 600;
};

// Khai báo BaseStack để sử dụng trong việc điều hướng giữa các màn hình
const BaseStack = createNativeStackNavigator();

// Cấu hình toast với các tùy chỉnh giao diện
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

// Hàm chính của ứng dụng
function App() {
  const [name, setName] = useState('LoginScreen');

  // Khởi tạo socket khi có storeId
  useEffect(() => {
    async function setupSocket() {
      const storeId = await AppAsyncStorage.readData('storeId');
      if (storeId) {
        MerchantSocketService.initialize();
      } else {
        console.log('Chưa có storeId, không khởi tạo socket!');
      }
    }
    setupSocket();
  }, []);

  // Lắng nghe sự kiện đơn hàng mới từ socket
  useEffect(() => {
    const handleNewOrder = data => {
      Toast.show({
        type: 'success',
        text1: 'Đơn hàng mới!',
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

  // Kiểm tra token khi mở ứng dụng để quyết định điều hướng đến màn hình nào
  useEffect(() => {
    const checkToken = async () => {
      if (await AppAsyncStorage.isTokenValid()) {
        setName('MainNavigation');
      }
    };
    checkToken();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BaseStack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={name}>
          <BaseStack.Screen name={'LoginScreen'} component={LoginScreen} />
          <BaseStack.Screen
            name={'MainNavigation'}
            component={MainNavigation}
          />
        </BaseStack.Navigator>
      </NavigationContainer>
      <Toast config={customToastConfig} />
    </SafeAreaProvider>
  );
}

export default App;
