import axiosInstance from '../axiosInstance';

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get('/v1/product/all');
    return response.data;
  } catch (error) {
    console.log('Lỗi gọi API Products', error);
    throw error;
  }
};

export const getProductsById = async productId => {
  try {
    const response = await axiosInstance.get(`/v1/product/${productId}`);
    return response.data;
  } catch (error) {
    console.log('Lỗi gọi API Product By ID', error);
    throw error;
  }
};
