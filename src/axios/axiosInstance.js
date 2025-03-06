import axios from 'axios';
import {AppAsyncStorage} from '../utils';
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

export default axiosInstance;
