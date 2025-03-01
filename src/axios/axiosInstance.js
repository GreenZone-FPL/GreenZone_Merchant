import axios from 'axios';

export const baseURL = 'https://greenzone.motcaiweb.io.vn/';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlVG9rZW4iOiJhY2Nlc3NUb2tlbiIsInBob25lTnVtYmVyIjoiMDkxMjM0NTY3OCIsImlhdCI6MTc0MDgwOTg4OCwiZXhwIjoxNzQxNjczODg4fQ.HTmd-qS1Cmk5EZsDu0SbKh9v7f8K9tRYMSTIZuzFWc8',
  },
});

export default axiosInstance;
