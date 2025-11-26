import axios from 'axios';
import { ENDPOINTS } from './api/endpoints';

/**
 * Servicio para análisis de texto usando AWS Lambda (WordFlux)
 * Procesa texto o archivos para contar palabras y generar estadísticas
 */

/**
 * Analiza texto o archivos para contar palabras
 * @param {Object} options - Opciones de análisis
 * @param {string[]} [options.files] - Array de rutas de archivos en el servidor
 * @param {string[]} [options.texts] - Array de textos a procesar
 * @param {number} [options.topN=10] - Número de palabras más frecuentes a retornar
 * @returns {Promise<Object>} Resultado del análisis con estadísticas
 * @throws {Error} Si hay un error en la petición
 */
export const analyzeText = async ({ files, texts, topN = 10 }) => {
  // Validación: debe haber files o texts, pero no ambos
  if (!files && !texts) {
    throw new Error('Debes proporcionar "files" o "texts" para analizar');
  }

  if (files && texts) {
    throw new Error('Solo puedes proporcionar "files" o "texts", no ambos');
  }

  // Validar que los arrays no estén vacíos
  if (files && (!Array.isArray(files) || files.length === 0)) {
    throw new Error('El parámetro "files" debe ser un array no vacío');
  }

  if (texts && (!Array.isArray(texts) || texts.length === 0)) {
    throw new Error('El parámetro "texts" debe ser un array no vacío');
  }

  try {
    const payload = { topN };

    if (files) {
      payload.files = files;
    } else {
      payload.texts = texts;
    }

    const response = await axios.post(
      `${ENDPOINTS.WORD_FLUX.BASE_URL}${ENDPOINTS.WORD_FLUX.COUNT}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos de timeout (procesamiento puede tardar)
      }
    );

    return response.data;
  } catch (error) {
    // Manejo de errores específicos
    if (error.response) {
      // El servidor respondió con un código de error
      const errorMessage = error.response.data?.error || 'Error al analizar el texto';
      throw new Error(errorMessage);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      throw new Error('No se pudo conectar con el servicio de análisis de texto');
    } else {
      // Error en la configuración de la petición
      throw new Error(error.message || 'Error desconocido al analizar el texto');
    }
  }
};

/**
 * Analiza archivos pre-cargados en el servidor
 * @param {string[]} filePaths - Array de rutas de archivos
 * @param {number} [topN=10] - Número de palabras más frecuentes
 * @returns {Promise<Object>} Resultado del análisis
 */
export const analyzeFiles = async (filePaths, topN = 10) => {
  return analyzeText({ files: filePaths, topN });
};

/**
 * Analiza textos directamente
 * @param {string[]} textArray - Array de textos a analizar
 * @param {number} [topN=10] - Número de palabras más frecuentes
 * @returns {Promise<Object>} Resultado del análisis
 */
export const analyzeRawTexts = async (textArray, topN = 10) => {
  return analyzeText({ texts: textArray, topN });
};

/**
 * Servicio de análisis de texto WordFlux
 * Exporta todas las funciones relacionadas con el análisis de palabras
 */
const wordFluxService = {
  analyze: analyzeText, // Alias principal
  analyzeText,
  analyzeFiles,
  analyzeRawTexts,
};

export default wordFluxService;
