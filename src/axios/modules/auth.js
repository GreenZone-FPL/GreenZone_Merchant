import axiosInstance from '../axiosInstance';
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/profile');

    return response.data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

export const register = async ({
  firstName,
  lastName,
  email,
  dateOfBirth,
  gender,
  avatar = null,
}) => {
  try {
    const body = {firstName, lastName, email, dateOfBirth, gender, avatar};

    const response = await axiosInstance.post('/auth/otp/register', body);

    const {data} = response;

    const {accessToken, refreshToken} = data.token;

    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.accessToken,
      accessToken.token,
    );
    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.refreshToken,
      refreshToken.token,
    );

    return data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

export const sendOTP = async ({phoneNumber}) => {
  try {
    const body = {phoneNumber};
    const response = await axiosInstance.post('/auth/otp/send', body);

    return response.data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

export const verifyOTP = async ({phoneNumber, code}) => {
  try {
    const body = {phoneNumber, code};
    const response = await axiosInstance.post('/auth/otp/login', body);

    const {data} = response;

    // Lưu token vào AsyncStorage
    const accessToken = data.token.accessToken.token;
    const refreshToken = data.token.refreshToken.token;
    console.log('accesstoken =', accessToken);

    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.accessToken,
      accessToken,
    );
    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.refreshToken,
      refreshToken,
    );

    return response.data;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
};

export const login = async ({phoneNumber, password}) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      phoneNumber,
      password,
    });
    return response.data;
  } catch (error) {
    console.log('Lỗi gọi API Login:', error);
    throw error;
  }
};
