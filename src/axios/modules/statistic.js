import axiosInstance from '../axiosInstance';

export const getStatisticByYear = async year => {
  try {
    const response = await axiosInstance.get(
      `/v1/statistic/order-count?year=${year}`, // Thêm dấu ? và query parameter cho year
    );
    return response.data;
  } catch (error) {
    console.log('Lỗi gọi API Statistic by Year', error);
    throw error; // Nếu có lỗi, ném ra để xử lý ở ngoài
  }
};
