import axiosInstance from '../axiosInstance';

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get('/v1/category/all');
    return response.data;
  } catch {
    console.log('Lỗi gọi API Categories', error);
    throw error;
  }
};
