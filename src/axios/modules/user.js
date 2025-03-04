import axiosInstance from '../axiosInstance';

export const findCustomerByCode = async code => {
  try {
    const response = await axiosInstance.get('/v1/user/find-customer', {
      params: {code: code},
    });
    return response.data;
  } catch (error) {
    console.log('Lỗi khi tìm kiếm khách hàng theo code:', error);
    throw error;
  }
};

export const findCustomerByPhone = async phone => {
  try {
    const response = await axiosInstance.get('/v1/user/find-customer', {
      params: {phoneNumber: phone},
    });
    return response.data;
  } catch (error) {
    console.log('Lỗi khi tìm kiếm khách hàng theo phone:', error);
    throw error;
  }
};
