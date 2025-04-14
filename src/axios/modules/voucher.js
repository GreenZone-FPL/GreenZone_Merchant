import axiosInstance from '../axiosInstance';
export const getAllVoucher = async type => {
  try {
    const response = await axiosInstance.get('/v1/voucher/all', {
      params: {
        voucherType: type,
      },
    });
    return response.data;
  } catch (error) {
    console.error('getAllVoucher error:', error);
    throw error;
  }
};
