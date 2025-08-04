# Happy Baby Style - Panel de Administración

Un sistema completo de administración para la tienda de ropa infantil "Happy Baby Style" construido con Clean Architecture, TypeScript, React y Supabase.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture** con una separación clara de responsabilidades:

```
src/
├── domain/           # Entidades y reglas de negocio
├── application/      # Casos de uso
├── infrastructure/   # Implementaciones externas (Supabase, APIs)
├── presentation/     # Controladores y rutas
└── shared/          # Utilidades compartidas
```

## 🚀 Características Implementadas

### Backend (Node.js + Express + TypeScript)

#### ✅ Entidades y Dominio
- **Product**: Gestión completa de productos con categorías, tallas, colores
- **Order**: Sistema de pedidos con estados y validaciones
- **Image**: Gestión de imágenes con almacenamiento en Supabase
- **User**: Sistema de usuarios administradores

#### ✅ Casos de Uso
- **Productos**: Crear, obtener, actualizar productos
- **Pedidos**: Crear, gestionar estados, estadísticas
- **Imágenes**: Subir, gestionar imágenes de productos
- **Validaciones**: Reglas de negocio y validaciones robustas

#### ✅ Infraestructura
- **Supabase**: Base de datos PostgreSQL con RLS
- **Storage**: Almacenamiento de imágenes con políticas de seguridad
- **Repositorios**: Implementaciones para todas las entidades

#### ✅ API REST
- **Productos**: `/api/products`
- **Pedidos**: `/api/orders`
- **Imágenes**: `/api/images`
- **Validación**: Middleware de validación de requests
- **Error Handling**: Manejo centralizado de errores

### Frontend (React + TypeScript + Vite)

#### ✅ Páginas Implementadas
- **Dashboard**: Vista general con estadísticas
- **Productos**: CRUD completo con interfaz moderna
- **Pedidos**: Gestión de pedidos con filtros y estados
- **Navegación**: Sidebar responsive con rutas

#### ✅ Componentes UI
- **Card**: Contenedores con diseño consistente
- **Button**: Botones con variantes y estados
- **Input**: Campos de entrada con validación
- **Layout**: Header, Sidebar y estructura principal

#### ✅ Hooks Personalizados
- **useProducts**: Gestión de productos con React Query
- **useOrders**: Gestión de pedidos con mutaciones
- **useImages**: Gestión de imágenes

#### ✅ Características UX
- **Loading States**: Estados de carga con spinners
- **Error Handling**: Manejo de errores con toasts
- **Responsive**: Diseño adaptativo para móviles
- **Theme**: Sistema de diseño consistente

## 🗄️ Base de Datos

### Esquema Principal
```sql
-- Productos
products (id, name, description, price, category, sizes[], colors[], stock, sku)

-- Pedidos
orders (id, customer_email, customer_name, status, total, shipping_address_id)
order_items (id, order_id, product_id, quantity, price, size, color)

-- Imágenes
images (id, file_name, url, entity_type, entity_id)

-- Usuarios
users (id, email, name, role, is_active)
```

### Políticas de Seguridad
- **RLS**: Row Level Security habilitado
- **Storage**: Políticas para bucket de imágenes
- **Autenticación**: Sistema de roles y permisos

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express**
- **TypeScript** para type safety
- **Supabase** como base de datos y storage
- **Clean Architecture** para organización del código
- **Dependency Injection** con container pattern

### Frontend
- **React 18** con hooks
- **TypeScript** para type safety
- **Vite** como bundler
- **React Query** para gestión de estado del servidor
- **Styled Components** para estilos
- **React Router** para navegación

### Base de Datos
- **PostgreSQL** (Supabase)
- **Row Level Security (RLS)**
- **Storage buckets** para archivos

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd happy-baby-style-web-admin
```

### 2. Configurar variables de entorno

#### Backend (.env)
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Instalar dependencias
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configurar base de datos
```bash
# Ejecutar el esquema de base de datos
# Copiar el contenido de supabase/schema.sql en tu proyecto Supabase
```

### 5. Ejecutar el proyecto
```bash
# Backend (puerto 3001)
cd backend
npm run dev

# Frontend (puerto 3000)
cd frontend
npm run dev
```

## 🚀 Uso

### Endpoints Principales

#### Productos
```bash
GET    /api/products          # Obtener productos
POST   /api/products          # Crear producto
PUT    /api/products/:id      # Actualizar producto
DELETE /api/products/:id      # Eliminar producto
```

#### Pedidos
```bash
GET    /api/orders            # Obtener pedidos
POST   /api/orders            # Crear pedido
PUT    /api/orders/:id        # Actualizar pedido
GET    /api/orders/stats      # Estadísticas de pedidos
```

#### Imágenes
```bash
POST   /api/images/upload     # Subir imagen
GET    /api/images/:id        # Obtener imagen
DELETE /api/images/:id        # Eliminar imagen
```

### Funcionalidades del Frontend

#### Gestión de Productos
- ✅ Crear productos con múltiples imágenes
- ✅ Editar información de productos
- ✅ Gestionar stock y variantes
- ✅ Filtros y búsqueda

#### Gestión de Pedidos
- ✅ Ver todos los pedidos
- ✅ Cambiar estados de pedidos
- ✅ Ver detalles completos
- ✅ Filtros por estado y cliente

#### Dashboard
- ✅ Estadísticas generales
- ✅ Resumen de ventas
- ✅ Productos más vendidos

## 🔧 Desarrollo

### Estructura de Carpetas
```
├── backend/
│   ├── src/
│   │   ├── domain/           # Entidades y reglas de negocio
│   │   ├── application/      # Casos de uso
│   │   ├── infrastructure/   # Implementaciones externas
│   │   ├── presentation/     # Controladores y rutas
│   │   └── shared/          # Utilidades compartidas
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios de API
│   │   └── styles/          # Estilos y tema
│   └── package.json
└── supabase/
    ├── schema.sql           # Esquema de base de datos
    └── storage-policies.sql # Políticas de almacenamiento
```

### Comandos de Desarrollo

#### Backend
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar para producción
npm run start        # Ejecutar en producción
npm run type-check   # Verificar tipos TypeScript
```

#### Frontend
```bash
npm run dev          # Desarrollo con Vite
npm run build        # Compilar para producción
npm run preview      # Preview de producción
npm run type-check   # Verificar tipos TypeScript
```

## 🧪 Testing

### Backend
```bash
# TODO: Implementar tests unitarios
npm test
```

### Frontend
```bash
# TODO: Implementar tests de componentes
npm test
```

## 📊 Estado del Proyecto

### ✅ Completado
- [x] Arquitectura base con Clean Architecture
- [x] Base de datos con Supabase
- [x] API REST completa
- [x] Frontend con React + TypeScript
- [x] Gestión de productos
- [x] Gestión de pedidos
- [x] Sistema de imágenes
- [x] UI/UX moderna y responsive
- [x] Validaciones y manejo de errores
- [x] Hooks personalizados
- [x] Documentación

### 🚧 En Desarrollo
- [ ] Sistema de autenticación
- [ ] Gestión de usuarios
- [ ] Reportes y analytics
- [ ] Tests unitarios y de integración
- [ ] Deploy automatizado

### 📋 Pendiente
- [ ] Notificaciones en tiempo real
- [ ] Exportación de datos
- [ ] Integración con pasarelas de pago
- [ ] App móvil
- [ ] Multi-idioma

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseño UX/UI**: [Diseñador]
- **QA**: [Tester]

## 📞 Contacto

- **Email**: [tu-email@ejemplo.com]
- **LinkedIn**: [tu-linkedin]
- **GitHub**: [tu-github]

---

**Happy Baby Style** - Haciendo que la moda infantil sea más feliz y accesible. 👶✨