# Portfolio de Proyectos

Portfolio web moderno que muestra 4 proyectos de alto rendimiento con demos interactivas.

## 🚀 Proyectos Incluidos

### 🔮 MatrixOracle
Algoritmo Morton Z-Order para consultas espaciales eficientes en matrices 2D.
- **Tecnología:** Python
- **Demo:** Visualización interactiva del recorrido Z-order con animación

### 📚 WordFlux
Procesador de archivos de texto grandes usando streams y worker threads.
- **Tecnología:** Node.js
- **Demo:** Contador de palabras en tiempo real con análisis de frecuencias

### 🎨 ColorShifter
Conversión RGB ↔ HSV de alto rendimiento con SIMD.
- **Tecnología:** Rust (portado a JavaScript)
- **Demo:** Selector de color interactivo con conversión en tiempo real

### 🌍 N-Gram Language Detector
Detección de idiomas usando modelos discriminativos con n-gramas.
- **Tecnología:** Python (portado a JavaScript)
- **Demo:** Detector de idiomas en tiempo real (5 idiomas soportados)
- **API:** Ver [API_DOCS.md](./API_DOCS.md) para documentación de la API REST

## 🛠️ Tecnologías

- **Frontend:** React 18 + Vite
- **Styling:** Vanilla CSS con design system moderno
- **Deployment:** AWS Amplify
- **Fonts:** Inter + JetBrains Mono (Google Fonts)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## 🎨 Características de Diseño

- ✨ Dark mode con gradientes vibrantes
- 🎭 Animaciones fluidas y micro-interacciones
- 📱 Diseño responsive (móvil, tablet, desktop)
- 🚀 Optimizado para rendimiento
- ♿ Accesible y semántico

## 📁 Estructura del Proyecto

```
portfolio-client/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Home.jsx
│   │   └── ProjectCard.jsx
│   ├── demos/               # Demos interactivas
│   │   ├── MatrixOracleDemo.jsx
│   │   ├── WordFluxDemo.jsx
│   │   ├── ColorShifterDemo.jsx
│   │   └── LangDetectorDemo.jsx
│   ├── lib/                 # Lógica de negocio
│   │   ├── mortonZOrder.js
│   │   ├── wordCounter.js
│   │   ├── colorConverter.js
│   │   └── langDetector.js
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Design system
├── public/                  # Archivos estáticos
├── index.html               # HTML principal
├── amplify.yml              # Configuración de AWS Amplify
└── package.json
```

## 📚 Documentación Adicional

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Instrucciones de despliegue en AWS Amplify
- [API_DOCS.md](./API_DOCS.md) - Documentación de la API de Detección de Idiomas

## 🚀 Despliegue en AWS Amplify

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas.

### Resumen rápido:

1. Conectar repositorio a AWS Amplify
2. Amplify detectará automáticamente `amplify.yml`
3. El build se ejecutará automáticamente
4. La aplicación estará disponible en una URL pública

## 📝 Licencia

MIT
