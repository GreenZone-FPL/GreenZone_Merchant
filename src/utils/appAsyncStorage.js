import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

export class AppAsyncStorage {
  static STORAGE_KEYS = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  };

  static async readData(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.log('Error reading data:', error);
      return defaultValue;
    }
  }

  static async storeData(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.log('Error storing data:', error);
    }
  }

  static async removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('Error removing data:', error);
    }
  }

  static async clearAll() {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared');
    } catch (error) {
      console.log('Error clearing all data:', error);
    }
  }

  static async isTokenValid() {
    const accessToken = await AppAsyncStorage.readData(
      AppAsyncStorage.STORAGE_KEYS.accessToken,
    );
    if (!accessToken) {
      return false;
    }

    try {
      const decoded = jwtDecode(accessToken); // Sử dụng jwt_decode thay vì jwtDecode
      console.log('decoded', decoded);
      const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (tính theo giây)

      return decoded.exp > currentTime; // Nếu exp lớn hơn currentTime thì token còn hạn
    } catch (error) {
      console.log('Lỗi khi decode token:', error);
      return false; // Token không hợp lệ
    }
  }
}
