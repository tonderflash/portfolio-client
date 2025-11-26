/**
 * API Service for Language Detection
 * Consumes the AWS Lambda endpoint for language detection
 */

const API_URL = 'https://o7fz7ih2uf.execute-api.us-east-2.amazonaws.com/prod/detect';

/**
 * Detect language from text using the API
 * @param {string} text - Text to analyze
 * @param {number} threshold - Spanglish threshold (default: 40.0)
 * @returns {Promise<Object>} Detection result
 */
export async function detectLanguage(text, threshold = 40.0) {
  if (!text || text.trim().length < 10) {
    return {
      language: 'unknown',
      languageName: 'Unknown',
      confidence: 0,
      scores: {},
      is_spanglish: false,
      spanglish_type: null
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        spanglish_threshold: threshold,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al detectar idioma');
    }

    const data = await response.json();

    // Transform API response to component format
    const languageCode = data.dominant_language === 'Español' ? 'es' : 'en';
    const languageName = data.dominant_language;

    // Build scores object from proportions
    const scores = {
      es: {
        name: 'Español',
        score: data.proportions.español,
        percentage: Math.round(data.proportions.español)
      },
      en: {
        name: 'Inglés',
        score: data.proportions.inglés,
        percentage: Math.round(data.proportions.inglés)
      }
    };

    return {
      language: languageCode,
      languageName,
      confidence: Math.round(data.confidence),
      scores,
      is_spanglish: data.is_spanglish,
      spanglish_type: data.spanglish_type,
      proportions: data.proportions,
      details: data.details
    };
  } catch (error) {
    console.error('Error detecting language:', error);
    throw error;
  }
}

