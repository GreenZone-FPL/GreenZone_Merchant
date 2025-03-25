import axiosInstance from '../axiosInstance';
import { AppAsyncStorage } from '../../utils';


export const login = async ({ phoneNumber, password }) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      phoneNumber,
      password,
    });
    const { data } = response

    const merchant = data?.user;

    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.accessToken, data?.token?.accessToken?.token);
    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.refreshToken, data?.token?.refreshToken?.token);
    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.merchant, JSON.stringify(merchant));
    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.storeId,
      merchant?.workingStore,
    );
    return data;
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
};
