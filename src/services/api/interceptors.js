import axiosInstance from './axiosConfig';

/**
 * Interceptor de Request
 * Se ejecuta antes de cada petición
 */
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response
 * Se ejecuta después de cada respuesta
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Log de respuestas exitosas en desarrollo
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.status, response.config.url);
    }

    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error('🔒 No autorizado - Redirigiendo al login');
          // Limpiar token y redirigir al login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;

        case 403:
          console.error('🚫 Acceso prohibido');
          break;

        case 404:
          console.error('🔍 Recurso no encontrado');
          break;

        case 500:
          console.error('💥 Error del servidor');
          break;

        default:
          console.error(`❌ Error ${status}:`, data?.message || 'Error desconocido');
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('📡 No se recibió respuesta del servidor');
    } else {
      // Algo pasó al configurar la petición
      console.error('⚙️ Error al configurar la petición:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
