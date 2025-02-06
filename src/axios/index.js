import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: ''
});



axiosInstance.interceptors.request.use(
    async (config) => {

        config.headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': contentType
        }
        return config;
    },
    err => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
    res => res.data,
    err => Promise.reject(err)
);


export default axiosInstance;