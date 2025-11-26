# 📡 API - Detector de Idiomas

## Endpoint

```
POST https://o7fz7ih2uf.execute-api.us-east-2.amazonaws.com/prod/detect
```

## Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```typescript
{
  text: string;                    // Requerido - Texto a analizar
  spanglish_threshold?: number;    // Opcional - Default: 40.0
}
```

## Response

**Success (200):**

```typescript
{
  text: string;                    // Texto analizado (truncado a 50 chars)
  dominant_language: "Español" | "Inglés";
  is_spanglish: boolean;
  spanglish_type: null | "ES-dominant" | "EN-dominant" | "balanced";
  confidence: number;              // 0-100
  proportions: {
    español: number;               // 0-100
    inglés: number;                // 0-100
  };
  details: {
    original: { es: number; en: number };
    discriminative: { es: number; en: number };
    matches_disc: { es: number; en: number };
  };
}
```

**Error (400):**

```typescript
{
  error: "El campo 'text' es requerido"
}
```

**Error (500):**

```typescript
{
  error: "Error al detectar idioma",
  message: string
}
```

---

## Ejemplos de Integración

### React / TypeScript

```typescript
// types.ts
export interface DetectRequest {
  text: string;
  spanglish_threshold?: number;
}

export interface DetectResponse {
  text: string;
  dominant_language: "Español" | "Inglés";
  is_spanglish: boolean;
  spanglish_type: null | "ES-dominant" | "EN-dominant" | "balanced";
  confidence: number;
  proportions: {
    español: number;
    inglés: number;
  };
  details: {
    original: { es: number; en: number };
    discriminative: { es: number; en: number };
    matches_disc: { es: number; en: number };
  };
}

// api.ts
const API_URL = 'https://o7fz7ih2uf.execute-api.us-east-2.amazonaws.com/prod/detect';

export async function detectLanguage(
  text: string,
  threshold: number = 40.0
): Promise<DetectResponse> {
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

  return response.json();
}

// Component.tsx
import { useState } from 'react';
import { detectLanguage, DetectResponse } from './api';

function LanguageDetector() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<DetectResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetect = async () => {
    if (!text.trim()) {
      setError('Por favor ingresa un texto');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await detectLanguage(text);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ingresa el texto a analizar"
      />
      <button onClick={handleDetect} disabled={loading}>
        {loading ? 'Analizando...' : 'Detectar Idioma'}
      </button>

      {error && <div className="error">{error}</div>}

      {result && (
        <div>
          <h3>Resultado:</h3>
          <p>Idioma: {result.dominant_language}</p>
          <p>Confianza: {result.confidence.toFixed(1)}%</p>
          {result.is_spanglish && (
            <p>Spanglish: {result.spanglish_type}</p>
          )}
          <p>
            Proporciones: {result.proportions.español.toFixed(1)}% ES | 
            {result.proportions.inglés.toFixed(1)}% EN
          </p>
        </div>
      )}
    </div>
  );
}
```

### Vue 3 / TypeScript

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { DetectResponse } from './types';

const API_URL = 'https://o7fz7ih2uf.execute-api.us-east-2.amazonaws.com/prod/detect';

const text = ref('');
const result = ref<DetectResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function detectLanguage() {
  if (!text.value.trim()) {
    error.value = 'Por favor ingresa un texto';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.value,
        spanglish_threshold: 40.0,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al detectar idioma');
    }

    result.value = await response.json();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <textarea v-model="text" placeholder="Ingresa el texto a analizar" />
    <button @click="detectLanguage" :disabled="loading">
      {{ loading ? 'Analizando...' : 'Detectar Idioma' }}
    </button>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="result">
      <h3>Resultado:</h3>
      <p>Idioma: {{ result.dominant_language }}</p>
      <p>Confianza: {{ result.confidence.toFixed(1) }}%</p>
      <p v-if="result.is_spanglish">
        Spanglish: {{ result.spanglish_type }}
      </p>
      <p>
        Proporciones: {{ result.proportions.español.toFixed(1) }}% ES |
        {{ result.proportions.inglés.toFixed(1) }}% EN
      </p>
    </div>
  </div>
</template>
```

### Vanilla JavaScript

```javascript
const API_URL = 'https://o7fz7ih2uf.execute-api.us-east-2.amazonaws.com/prod/detect';

async function detectLanguage(text, threshold = 40.0) {
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

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Uso
detectLanguage('Hola mundo')
  .then(result => {
    console.log('Idioma:', result.dominant_language);
    console.log('Confianza:', result.confidence);
    console.log('Es Spanglish:', result.is_spanglish);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

---

## Ejemplos de Respuestas

### Español Puro

```json
{
  "text": "Hola mundo",
  "dominant_language": "Español",
  "is_spanglish": false,
  "spanglish_type": null,
  "confidence": 100.0,
  "proportions": {"español": 100.0, "inglés": 0.0}
}
```

### Inglés Puro

```json
{
  "text": "The weather is beautiful today",
  "dominant_language": "Inglés",
  "is_spanglish": false,
  "spanglish_type": null,
  "confidence": 100.0,
  "proportions": {"español": 0.0, "inglés": 100.0}
}
```

### Spanglish

```json
{
  "text": "I am going to the tienda to buy some tortillas",
  "dominant_language": "Español",
  "is_spanglish": true,
  "spanglish_type": "balanced",
  "confidence": 50.4,
  "proportions": {"español": 50.4, "inglés": 49.6}
}
```

---

## Notas Importantes

1. **CORS**: El endpoint tiene CORS habilitado para todos los orígenes (`*`)

2. **Timeout**: El endpoint puede tardar 1-3 segundos en responder

3. **Textos Cortos**: Textos muy cortos (< 10 caracteres) pueden tener menor precisión

4. **Spanglish**: Se detecta cuando la diferencia entre idiomas es ≤15% y ambos superan 35%

5. **Rate Limiting**: No hay límite configurado actualmente, pero se recomienda implementar throttling en el cliente para evitar abusos


