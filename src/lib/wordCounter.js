/**
 * Word Counter - Efficient text processing
 * Counts word frequencies in text
 */

/**
 * Normalize text: lowercase and remove punctuation
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u00C0-\u017F]/g, ' ') // Keep letters, numbers, spaces, and accented chars
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Count word frequencies in text
 */
export function countWords(text) {
  const normalized = normalizeText(text);
  const words = normalized.split(' ').filter(word => word.length > 0);
  
  const wordMap = new Map();
  
  for (const word of words) {
    wordMap.set(word, (wordMap.get(word) || 0) + 1);
  }
  
  return {
    totalWords: words.length,
    uniqueWords: wordMap.size,
    wordFrequencies: wordMap
  };
}

/**
 * Get top N most frequent words
 */
export function getTopWords(wordFrequencies, n = 10) {
  const entries = Array.from(wordFrequencies.entries());
  
  entries.sort((a, b) => b[1] - a[1]);
  
  return entries.slice(0, n).map(([word, count]) => ({ word, count }));
}

/**
 * Process text and return statistics
 */
export function processText(text) {
  const lines = text.split('\n');
  const { totalWords, uniqueWords, wordFrequencies } = countWords(text);
  const topWords = getTopWords(wordFrequencies, 10);
  
  return {
    lines: lines.length,
    totalWords,
    uniqueWords,
    topWords
  };
}

/**
 * Generate visualization data for top words
 */
export function generateWordChart(topWords) {
  if (topWords.length === 0) return [];
  
  const maxCount = topWords[0].count;
  
  return topWords.map(({ word, count }) => ({
    word,
    count,
    percentage: (count / maxCount) * 100
  }));
}
