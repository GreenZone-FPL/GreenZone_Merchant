import axiosInstance from '../axiosInstance';

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get('/v1/product/all');
    return response.data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

export const getProductsById = async productId => {
  try {
    const response = await axiosInstance.get(`/v1/product/${productId}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching products', error);
    throw error;
  }
};
