/**
 * Constantes de endpoints de la API
 * Centraliza todas las rutas para facilitar el mantenimiento
 */

export const ENDPOINTS = {
  // Color Shifter API (AWS Lambda)
  COLOR_SHIFTER: {
    BASE_URL: 'https://o7fz7ih2uf.execute-api.us-east-2.amazonaws.com/prod',
    CONVERT: '/color-convert',
  },
  
  // Language Detector API (AWS Lambda)
  LANGUAGE_DETECTOR: {
    BASE_URL: 'https://o7fz7ih2uf.execute-api.us-east-2.amazonaws.com/prod',
    DETECT: '/detect',
  },
  
  // WordFlux API (AWS Lambda)
  WORD_FLUX: {
    BASE_URL: 'https://o7fz7ih2uf.execute-api.us-east-2.amazonaws.com/prod',
    COUNT: '/count',
  },
};

export default ENDPOINTS;
