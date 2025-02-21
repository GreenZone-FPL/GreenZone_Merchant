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

export const getProductsByCate = async idCate => {
  try {
    const response = await axiosInstance.get(`/v1/category/${idCate}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};
