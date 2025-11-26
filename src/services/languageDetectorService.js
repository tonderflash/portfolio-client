import axios from 'axios';
import { ENDPOINTS } from './api/endpoints';

/**
 * Servicio para detección de idiomas usando AWS Lambda
 * Detecta si el texto es Español, Inglés o Spanglish
 */

/**
 * Detecta el idioma de un texto
 * @param {string} text - Texto a analizar
 * @param {number} [spanglishThreshold=40.0] - Umbral para detectar Spanglish (0-100)
 * @returns {Promise<Object>} Resultado de la detección
 * @throws {Error} Si hay un error en la petición
 */
export const detectLanguage = async (text, spanglishThreshold = 40.0) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('El texto es requerido y debe ser una cadena no vacía');
  }

  try {
    const response = await axios.post(
      `${ENDPOINTS.LANGUAGE_DETECTOR.BASE_URL}${ENDPOINTS.LANGUAGE_DETECTOR.DETECT}`,
      {
        text: text.trim(),
        spanglish_threshold: spanglishThreshold,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 segundos de timeout
      }
    );

    return response.data;
  } catch (error) {
    // Manejo de errores específicos
    if (error.response) {
      // El servidor respondió con un código de error
      const errorMessage = error.response.data?.error || 'Error al detectar idioma';
      throw new Error(errorMessage);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      throw new Error('No se pudo conectar con el servicio de detección de idiomas');
    } else {
      // Error en la configuración de la petición
      throw new Error(error.message || 'Error desconocido al detectar idioma');
    }
  }
};

/**
 * Servicio de detección de idiomas
 * Exporta todas las funciones relacionadas con la detección de idiomas
 */
const languageDetectorService = {
  detectLanguage,
  /**
   * Adaptador para mantener compatibilidad con el componente demo
   * @param {Object} params
   * @param {string} params.text
   * @param {number} [params.threshold]
   */
  detect: ({ text, threshold }) => detectLanguage(text, threshold),
};

export default languageDetectorService;
