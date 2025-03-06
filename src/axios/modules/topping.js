import axiosInstance from '../axiosInstance';

export const getAllToppings = async () => {
  try {
    const response = await axiosInstance.get('/v1/topping/all');

    return response.data;
  } catch (error) {
    console.log('Lỗi gọi API Toppings', error);
    throw error;
  }
};
