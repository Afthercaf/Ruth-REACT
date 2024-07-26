import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // Ajusta según tu configuración
});


export default axiosInstance;


