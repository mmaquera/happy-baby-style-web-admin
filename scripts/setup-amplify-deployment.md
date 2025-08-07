# 🚀 GUÍA DE DESPLIEGUE EN AWS AMPLIFY

## 📋 Prerrequisitos
- Cuenta de AWS con acceso a Amplify
- Repositorio en GitHub con el código
- Backend ya desplegado en EC2

## 🎯 Pasos para el Despliegue

### 1️⃣ Conectar Repositorio
1. Ir a [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click en "New app" → "Host web app"
3. Seleccionar "GitHub" como proveedor
4. Autorizar AWS Amplify en GitHub
5. Seleccionar tu repositorio: `mmaquera/happy-baby-style-web-admin`
6. Seleccionar la rama: `main`

### 2️⃣ Configurar Build Settings
Amplify detectará automáticamente la configuración desde `amplify.yml`

**Configuración automática:**
- **Build commands:** `npm ci && npm run codegen && npm run build`
- **Output directory:** `frontend/dist`
- **Base directory:** `/` (raíz del repositorio)

### 3️⃣ Variables de Entorno
Agregar en la configuración de Amplify:

```
NODE_ENV=production
VITE_GRAPHQL_URL=http://3.144.1.119/graphql
VITE_API_URL=http://3.144.1.119
```

### 4️⃣ Configurar Dominio Personalizado (Opcional)
1. En Amplify Console → "Domain management"
2. Agregar dominio personalizado
3. Configurar DNS según las instrucciones

## 🔧 Configuración del Frontend

### Modificar GraphQL URL para producción:
```typescript
// frontend/src/services/graphql.ts
const httpLink = createHttpLink({
  uri: process.env.VITE_GRAPHQL_URL || 'http://3.144.1.119/graphql',
});
```

### Configurar CORS en el backend:
```javascript
// backend/src/index.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-amplify-domain.amplifyapp.com',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

## 📊 Monitoreo y Logs
- **Build logs:** Disponibles en Amplify Console
- **Runtime logs:** CloudWatch Logs
- **Performance:** Amplify Analytics (opcional)

## 🔄 Deploy Automático
- Cada push a `main` activará un nuevo deploy
- Rollback automático si falla el build
- Preview deployments para pull requests

## 💰 Costos (Plan Gratuito)
- ✅ **1,000 minutos de build/mes** (suficiente para ~50 deploys)
- ✅ **15 GB de almacenamiento** (más que suficiente)
- ✅ **1,000 GB de transferencia** (suficiente para ~10,000 visitas/mes)
- ✅ **HTTPS y CDN incluidos**

## 🎉 URLs Finales
- **Amplify URL:** `https://main.xxxxx.amplifyapp.com`
- **Custom Domain:** `https://your-domain.com` (opcional)
- **Backend API:** `http://3.144.1.119/graphql`

## 🚨 Consideraciones
1. **CORS:** Configurar el backend para permitir el dominio de Amplify
2. **Environment Variables:** Usar variables de entorno para URLs
3. **Build Time:** El primer build puede tomar 5-10 minutos
4. **Cache:** Amplify cachea dependencias para builds más rápidos 