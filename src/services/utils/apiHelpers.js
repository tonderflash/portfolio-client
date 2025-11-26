/**
 * Utilidades para servicios de API
 */

/**
 * Maneja errores de API de forma consistente
 * @param {Error} error - Error de axios
 * @returns {Object} Objeto de error formateado
 */
export const handleApiError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || 'Error en la petición',
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'No se pudo conectar con el servidor',
      data: null,
    };
  } else {
    return {
      status: -1,
      message: error.message || 'Error desconocido',
      data: null,
    };
  }
};

/**
 * Construye parámetros de query string
 * @param {Object} params - Objeto con parámetros
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return new URLSearchParams(filteredParams).toString();
};

/**
 * Valida si una respuesta fue exitosa
 * @param {Object} response - Respuesta de axios
 * @returns {boolean}
 */
export const isSuccessResponse = (response) => {
  return response && response.status >= 200 && response.status < 300;
};

/**
 * Extrae datos de la respuesta
 * @param {Object} response - Respuesta de axios
 * @returns {any} Datos de la respuesta
 */
export const extractResponseData = (response) => {
  return response?.data?.data || response?.data || null;
};
