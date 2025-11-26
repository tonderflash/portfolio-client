import axios from 'axios';

/**
 * Configuración base de axios
 * Aquí se define la URL base y configuraciones globales
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
