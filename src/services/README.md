# Servicios de API con Axios

Esta carpeta contiene la estructura de servicios para realizar peticiones HTTP usando Axios, siguiendo las mejores prácticas.

## 📁 Estructura

```
services/
├── api/
│   ├── axiosConfig.js      # Configuración base de axios
│   ├── interceptors.js     # Interceptores de request/response
│   └── endpoints.js        # Constantes de endpoints
├── utils/
│   └── apiHelpers.js       # Utilidades para servicios
├── authService.js          # Servicio de autenticación
├── projectService.js       # Servicio de proyectos (ejemplo)
├── index.js                # Punto de entrada centralizado
└── README.md               # Esta documentación
```

## 🚀 Uso

### Importar servicios

```javascript
import { authService, projectService } from '@/services';
```

### Ejemplo de uso en componentes

```javascript
import { useState, useEffect } from 'react';
import { projectService } from '@/services';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAll({ page: 1, limit: 10 });
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

### Autenticación

```javascript
import { authService } from '@/services';

// Login
const handleLogin = async (email, password) => {
  try {
    const response = await authService.login({ email, password });
    console.log('Usuario autenticado:', response);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
  }
};

// Verificar si está autenticado
if (authService.isAuthenticated()) {
  console.log('Usuario autenticado');
}

// Logout
await authService.logout();
```

### Color Shifter (Conversión RGB ↔ HSV)

```javascript
import { colorShifterService } from '@/services';

// Convertir múltiples colores RGB a HSV
const hsv = await colorShifterService.rgbToHsv({
  r: [1.0, 0.5, 0.0],
  g: [0.0, 0.5, 1.0],
  b: [0.0, 0.5, 0.0]
});

// Convertir un solo color
const { h, s, v } = await colorShifterService.convertSingleRgbToHsv(1.0, 0.0, 0.0);

// Ajustar saturación (1.5 = +50% más saturado)
const saturated = await colorShifterService.adjustSaturation(rgbData, 1.5);

// Ajustar brillo (1.2 = +20% más brillante)
const brighter = await colorShifterService.adjustBrightness(rgbData, 1.2);

// Rotar tono (crear paleta complementaria)
const complementary = await colorShifterService.rotateHue(rgbData, 180);
```

Ver más ejemplos en [`examples/colorShifterExample.js`](file:///Users/tonderflash/Developer/tagshelf/portfolio-client/src/services/examples/colorShifterExample.js)

## 🔧 Configuración

### Variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
```

### Interceptores

Los interceptores están configurados para:

- ✅ Agregar automáticamente el token de autenticación
- ✅ Logging de peticiones en desarrollo
- ✅ Manejo centralizado de errores
- ✅ Redirección automática en caso de 401 (no autorizado)

## 📝 Crear un nuevo servicio

Para crear un nuevo servicio, sigue este patrón:

```javascript
import axiosInstance from './api/interceptors';
import { ENDPOINTS } from './api/endpoints';
import { handleApiError } from './utils/apiHelpers';

class MiServicio {
  async obtenerDatos() {
    try {
      const response = await axiosInstance.get('/mi-endpoint');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new MiServicio();
```

Luego agrégalo a `index.js`:

```javascript
export { default as miServicio } from './miServicio';
```

## 🎯 Mejores prácticas

1. **Singleton Pattern**: Cada servicio se exporta como una instancia única
2. **Manejo de errores centralizado**: Usa `handleApiError` en todos los servicios
3. **Endpoints centralizados**: Define todos los endpoints en `api/endpoints.js`
4. **Tipado de respuestas**: Documenta los tipos de retorno con JSDoc
5. **Interceptores**: Toda la lógica de autenticación y logging está centralizada
6. **Variables de entorno**: Usa variables de entorno para configuraciones

## 🔐 Seguridad

- Los tokens se almacenan en `localStorage`
- Los interceptores agregan automáticamente el token a cada petición
- En caso de 401, se limpia el token y se redirige al login
- Timeout de 10 segundos para evitar peticiones colgadas

## 📚 Recursos adicionales

- [Documentación de Axios](https://axios-http.com/)
- [Interceptores de Axios](https://axios-http.com/docs/interceptors)
- [Variables de entorno en Vite](https://vitejs.dev/guide/env-and-mode.html)
