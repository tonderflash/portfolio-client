# Guía de Despliegue en AWS Amplify

Esta guía te llevará paso a paso para desplegar tu portfolio en AWS Amplify.

## 📋 Prerrequisitos

- Cuenta de AWS ([crear cuenta gratuita](https://aws.amazon.com/free/))
- Repositorio Git (GitHub, GitLab, o Bitbucket)
- Código del proyecto subido al repositorio

## 🚀 Paso 1: Preparar el Repositorio

### 1.1 Inicializar Git (si no lo has hecho)

```bash
cd portfolio-client
git init
git add .
git commit -m "Initial commit: Portfolio con 4 proyectos"
```

### 1.2 Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. Nombra el repositorio (ej: `portfolio-projects`)
3. No inicialices con README (ya tienes uno)

### 1.3 Subir el Código

```bash
git remote add origin https://github.com/TU_USUARIO/portfolio-projects.git
git branch -M main
git push -u origin main
```

## ☁️ Paso 2: Configurar AWS Amplify

### 2.1 Acceder a AWS Amplify

1. Inicia sesión en [AWS Console](https://console.aws.amazon.com/)
2. Busca "Amplify" en la barra de búsqueda
3. Haz clic en "AWS Amplify"

### 2.2 Crear Nueva Aplicación

1. Haz clic en **"New app"** → **"Host web app"**
2. Selecciona tu proveedor de Git (GitHub, GitLab, etc.)
3. Autoriza a AWS Amplify para acceder a tu cuenta

### 2.3 Seleccionar Repositorio

1. Selecciona el repositorio `portfolio-projects`
2. Selecciona la rama `main`
3. Haz clic en **"Next"**

### 2.4 Configurar Build Settings

AWS Amplify detectará automáticamente el archivo `amplify.yml`. Verifica que la configuración sea:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Importante:** Si estás en el directorio raíz del monorepo (tagshelf), necesitas actualizar el `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd portfolio-client
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: portfolio-client/dist
    files:
      - '**/*'
  cache:
    paths:
      - portfolio-client/node_modules/**/*
```

### 2.5 Configuración Avanzada (Opcional)

- **App name:** Portfolio de Proyectos
- **Environment name:** production
- **Service role:** Crear nuevo rol (Amplify lo hará automáticamente)

Haz clic en **"Next"**

### 2.6 Revisar y Desplegar

1. Revisa toda la configuración
2. Haz clic en **"Save and deploy"**
3. Espera a que el build se complete (5-10 minutos)

## 🎉 Paso 3: Verificar el Despliegue

### 3.1 Ver el Progreso

Amplify mostrará 4 fases:
1. ✅ **Provision** - Preparando el entorno
2. ✅ **Build** - Ejecutando npm ci y npm run build
3. ✅ **Deploy** - Desplegando los archivos
4. ✅ **Verify** - Verificando el despliegue

### 3.2 Acceder a tu Aplicación

Una vez completado, verás una URL como:
```
https://main.d1234567890abc.amplifyapp.com
```

¡Haz clic en la URL para ver tu portfolio en vivo! 🚀

## 🔧 Paso 4: Configuración Post-Despliegue

### 4.1 Configurar Dominio Personalizado (Opcional)

1. En la consola de Amplify, ve a **"Domain management"**
2. Haz clic en **"Add domain"**
3. Sigue las instrucciones para configurar tu dominio

### 4.2 Habilitar HTTPS

AWS Amplify habilita HTTPS automáticamente con certificados SSL gratuitos.

### 4.3 Configurar Redirects (Opcional)

Para una SPA (Single Page Application), agrega esta regla de redirect:

1. Ve a **"Rewrites and redirects"**
2. Agrega esta regla:
   - **Source:** `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
   - **Target:** `/index.html`
   - **Type:** `200 (Rewrite)`

## 🔄 Paso 5: Despliegues Automáticos

### 5.1 Configuración Automática

Amplify está configurado para desplegar automáticamente cuando:
- Haces push a la rama `main`
- Creas un pull request (preview deployment)

### 5.2 Hacer Cambios

```bash
# Hacer cambios en el código
git add .
git commit -m "Actualización: mejoras en ColorShifter demo"
git push origin main
```

Amplify detectará el push y desplegará automáticamente.

## 📊 Paso 6: Monitoreo

### 6.1 Ver Logs

En la consola de Amplify:
1. Selecciona tu aplicación
2. Ve a la pestaña de un build específico
3. Haz clic en cualquier fase para ver los logs

### 6.2 Métricas

Amplify proporciona métricas de:
- Número de visitantes
- Ancho de banda usado
- Tiempo de respuesta

## 🛠️ Troubleshooting

### Problema: Build Falla

**Solución:**
1. Verifica que `package.json` tenga todos los scripts necesarios
2. Revisa los logs del build en Amplify
3. Asegúrate de que `amplify.yml` apunte al directorio correcto

### Problema: Página en Blanco

**Solución:**
1. Verifica que `baseDirectory` en `amplify.yml` sea `dist` (o `portfolio-client/dist`)
2. Asegúrate de que el build local funcione: `npm run build && npm run preview`

### Problema: Rutas 404

**Solución:**
1. Configura las reglas de redirect como se explicó en el Paso 4.3

## 💰 Costos

AWS Amplify incluye:
- **Tier Gratuito:** 
  - 1000 minutos de build por mes
  - 15 GB de almacenamiento
  - 15 GB de transferencia de datos

Para un portfolio personal, probablemente te mantendrás en el tier gratuito.

## 📚 Recursos Adicionales

- [Documentación de AWS Amplify](https://docs.aws.amazon.com/amplify/)
- [Precios de AWS Amplify](https://aws.amazon.com/amplify/pricing/)
- [Guía de Troubleshooting](https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting.html)

## ✅ Checklist Final

- [ ] Código subido a GitHub/GitLab/Bitbucket
- [ ] Aplicación creada en AWS Amplify
- [ ] Build completado exitosamente
- [ ] URL pública funcionando
- [ ] Todas las demos interactivas funcionan
- [ ] Diseño responsive verificado en móvil
- [ ] (Opcional) Dominio personalizado configurado

¡Felicidades! Tu portfolio está en vivo 🎉
