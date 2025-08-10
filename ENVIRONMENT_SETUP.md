# 🌍 Configuración de Entornos - Happy Baby Style Admin

## 📋 Descripción

Este proyecto utiliza **Vite** con una configuración avanzada de archivos de entorno que sigue las mejores prácticas de desarrollo y despliegue.

## 🗂️ Estructura de Archivos de Entorno

```
frontend/
├── env.development      # Variables para desarrollo
├── env.production       # Variables para producción
├── env.staging          # Variables para staging
├── env.example          # Template público (git tracked)
├── env.template         # Template original
└── .env.local           # Variables locales (gitignored)
```

## 🚀 Comandos Disponibles

### **Desarrollo**
```bash
# Desarrollo estándar
npm run dev

# Desarrollo con variables locales
npm run dev:local

# Desarrollo en modo staging
npm run dev:staging
```

### **Build**
```bash
# Build de producción
npm run build

# Build de staging
npm run build:staging

# Build de desarrollo
npm run build:dev
```

### **Preview**
```bash
# Preview estándar
npm run preview

# Preview de producción
npm run preview:prod

# Preview de staging
npm run preview:staging
```

## ⚙️ Variables de Entorno Disponibles

### **Configuración Core**
- `VITE_MODE`: Modo del entorno (development/production/staging)
- `VITE_GRAPHQL_URL`: URL del endpoint GraphQL
- `VITE_API_URL`: URL del API backend
- `VITE_APP_NAME`: Nombre de la aplicación
- `VITE_PORT`: Puerto del servidor de desarrollo

### **Feature Flags**
- `VITE_GRAPHQL_PLAYGROUND_ENABLED`: Habilitar GraphQL Playground
- `VITE_ENABLE_DEBUG_MODE`: Habilitar modo debug
- `VITE_ENABLE_SOURCE_MAPS`: Habilitar source maps
- `VITE_ENABLE_HOT_RELOAD`: Habilitar hot reload
- `VITE_ENABLE_PERFORMANCE_MONITORING`: Habilitar monitoreo de performance

### **Logging y Monitoreo**
- `VITE_LOG_LEVEL`: Nivel de logging (debug/info/warn/error)

### **Autenticación**
- `VITE_AUTH_TOKEN_EXPIRY`: Tiempo de expiración del token (ms)
- `VITE_REFRESH_TOKEN_EXPIRY`: Tiempo de expiración del refresh token (ms)

### **Supabase (Opcional)**
- `VITE_SUPABASE_URL`: URL del proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase

## 🔧 Configuración por Entorno

### **Development (`env.development`)**
- GraphQL Playground habilitado
- Debug mode activado
- Source maps habilitados
- Hot reload activado
- Logging en nivel debug

### **Production (`env.production`)**
- GraphQL Playground deshabilitado
- Debug mode deshabilitado
- Source maps deshabilitados
- Hot reload deshabilitado
- Logging en nivel error
- Tokens de autenticación más cortos

### **Staging (`env.staging`)**
- Configuración intermedia
- GraphQL Playground habilitado
- Debug mode habilitado
- Source maps habilitados
- Hot reload deshabilitado
- Logging en nivel warn

## 📝 Uso en el Código

### **Importar Configuración**
```typescript
import { environment } from '@/config/environment';

// Usar variables de entorno
const graphqlUrl = environment.graphqlUrl;
const isDebugEnabled = environment.enableDebugMode;
```

### **Verificar Entorno**
```typescript
import { isDevelopment, isProduction, isStaging } from '@/config/environment';

if (isDevelopment()) {
  console.log('Running in development mode');
}
```

### **Acceso Directo a Variables**
```typescript
// Acceso directo a variables de Vite
const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

## 🚨 Validación de Entorno

El sistema valida automáticamente las variables requeridas:

- **Development/Staging**: Muestra warnings en consola
- **Production**: Falla el build si faltan variables requeridas

### **Variables Requeridas**
- `VITE_GRAPHQL_URL`
- `VITE_APP_NAME`

## 🔒 Seguridad

- Los archivos `.env.local` están en `.gitignore`
- Solo los templates están trackeados en git
- Las variables sensibles no se exponen públicamente

## 🛠️ Personalización

### **Agregar Nueva Variable**
1. Agregar en `env.development`, `env.production`, `env.staging`
2. Actualizar `src/types/vite-env.d.ts`
3. Actualizar `src/config/environment.ts` si es necesario

### **Crear Nuevo Entorno**
1. Crear `env.[nombre]`
2. Agregar caso en `EnvironmentFactory.createConfig()`
3. Agregar función helper `is[Nombre]()`

## 📚 Referencias

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vite Configuration](https://vitejs.dev/config/)
- [Environment Variables Best Practices](https://12factor.net/config)
