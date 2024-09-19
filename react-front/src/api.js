import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = axios.create({
  baseURL: '${process.env.DATABASE_URL}/', // Cambia esta URL a la de tu backend
  withCredentials: true
});

API_URL.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { API_URL };
