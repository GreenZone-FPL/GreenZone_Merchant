import axios from 'axios';
import {AppAsyncStorage} from '../utils';
import { globalAuthDispatch } from '../context/appContext';
import { AuthActionTypes } from '../reducers/authReducer';
export const baseURL = 'https://greenzone.motcaiweb.io.vn/';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    try {
      const token = await AppAsyncStorage.readData('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log('Lấy token thành công:', token);
      }
    } catch (error) {}
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  res => res.data,
  async err => {
    if (err.response.data.statusCode === 401) {
      console.log('401 log out');

      const token = await AppAsyncStorage.readData(AppAsyncStorage.STORAGE_KEYS.accessToken);
      console.log('token', token)
      if (token) {

        await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.accessToken)
        await AppAsyncStorage.removeData(AppAsyncStorage.STORAGE_KEYS.refreshToken)

        if (globalAuthDispatch) {
          globalAuthDispatch({
            type: AuthActionTypes.LOGIN_SESSION_EXPIRED,
            payload: 'Phiên đăng nhập hết hạn'
          })
        }
      } else { // đã logout và hết hạn token
        if (globalAuthDispatch) {
          globalAuthDispatch({
            type: AuthActionTypes.LOGIN_SESSION_EXPIRED
          });
        }
      }

      return Promise.reject(err.response.data);
    }

    return Promise.reject(err);
  },
);

export default axiosInstance;
