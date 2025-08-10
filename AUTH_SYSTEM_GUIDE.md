# Sistema de Autenticación - Happy Baby Style Admin

## Descripción General

Se ha implementado un sistema de autenticación completo siguiendo los principios de Clean Code y manteniendo la consistencia con el diseño del proyecto.

## Características Implementadas

### 🔐 Página de Login
- **Diseño consistente**: Utiliza el tema del proyecto (colores púrpura, coral, turquesa)
- **Validación de formularios**: React Hook Form con validaciones robustas
- **UX mejorada**: 
  - Toggle de visibilidad de contraseña
  - Estados de carga
  - Mensajes de error claros
  - Credenciales de demo pre-llenadas
- **Responsive**: Adaptado para móviles y tablets

### 🛡️ Protección de Rutas
- **ProtectedRoute**: Componente que protege rutas privadas
- **Redirección automática**: Usuarios no autenticados son redirigidos a `/login`
- **Verificación de roles**: Soporte para verificación de permisos por rol
- **Estado de carga**: Muestra spinner mientras verifica autenticación

### 🔑 Hook de Autenticación
- **useAuth**: Hook personalizado para manejo de estado de autenticación
- **Persistencia**: Almacena token y datos de usuario en localStorage
- **Manejo de errores**: Gestión robusta de errores de autenticación
- **Utilidades**: Funciones para verificar roles y permisos

### 👤 Header Mejorado
- **Dropdown de usuario**: Menú desplegable con opciones de usuario
- **Información dinámica**: Muestra nombre y rol del usuario actual
- **Logout integrado**: Función de cerrar sesión con confirmación
- **Iniciales del avatar**: Genera automáticamente las iniciales del usuario

## Estructura de Archivos

```
frontend/src/
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx    # Protección de rutas
│       └── index.ts              # Exportaciones
├── hooks/
│   └── useAuth.ts                # Hook de autenticación
├── pages/
│   ├── Login.tsx                 # Página de login
│   └── Unauthorized.tsx          # Página de acceso denegado
└── App.tsx                       # Rutas protegidas
```

## Uso del Sistema

### 1. Proteger una Ruta

```tsx
import { ProtectedRoute } from '@/components/auth';

// Ruta básica protegida
<ProtectedRoute>
  <MiComponente />
</ProtectedRoute>

// Ruta con roles específicos
<ProtectedRoute requiredRoles={['admin', 'manager']}>
  <MiComponente />
</ProtectedRoute>
```

### 2. Usar el Hook de Autenticación

```tsx
import { useAuth } from '@/hooks/useAuth';

const MiComponente = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    hasRole, 
    isAdmin 
  } = useAuth();

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }

  // Verificar rol específico
  if (!hasRole('admin')) {
    return <div>Sin permisos</div>;
  }

  return (
    <div>
      <h1>Bienvenido, {user?.name}</h1>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};
```

### 3. Login Programático

```tsx
const { login } = useAuth();

const handleLogin = async () => {
  const success = await login({
    email: 'admin@happybabystyle.com',
    password: 'admin123'
  });

  if (success) {
    // Redirigir o mostrar mensaje de éxito
  }
};
```

## Credenciales de Demo

Para pruebas, se han configurado las siguientes credenciales:

- **Email**: `admin@happybabystyle.com`
- **Contraseña**: `admin123`

## Flujo de Autenticación

1. **Usuario no autenticado** → Redirigido a `/login`
2. **Login exitoso** → Token guardado en localStorage
3. **Acceso a ruta protegida** → Verificación automática de token
4. **Token válido** → Acceso permitido
5. **Token inválido/expirado** → Redirigido a `/login`
6. **Logout** → Token eliminado, redirigido a `/login`

## Personalización

### Cambiar Credenciales de Demo

Editar en `frontend/src/hooks/useAuth.ts`:

```typescript
const mockLoginAPI = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Cambiar las credenciales aquí
  if (credentials.email === 'tu-email@ejemplo.com' && credentials.password === 'tu-password') {
    // ...
  }
};
```

### Agregar Nuevos Roles

1. Actualizar el tipo `User` en `useAuth.ts`
2. Agregar funciones de verificación específicas
3. Usar en `ProtectedRoute` con `requiredRoles`

### Integrar con API Real

Reemplazar `mockLoginAPI` en `useAuth.ts` con llamadas reales:

```typescript
const loginAPI = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiService.post('/auth/login', credentials);
  return response.data;
};
```

## Seguridad

### Consideraciones Implementadas

- **Validación de formularios**: Previene envío de datos inválidos
- **Manejo de errores**: Gestión robusta de errores de red
- **Persistencia segura**: Almacenamiento en localStorage con manejo de errores
- **Redirección segura**: Preserva la URL original para redirección post-login
- **Protección de rutas**: Verificación automática en cada navegación

### Mejoras Futuras

- [ ] Implementar refresh tokens
- [ ] Agregar expiración de tokens
- [ ] Implementar logout automático por inactividad
- [ ] Agregar autenticación de dos factores
- [ ] Implementar auditoría de sesiones

## Estilos y Tema

El sistema de autenticación utiliza completamente el tema del proyecto:

- **Colores**: Púrpura (#A285D1), Coral (#FF7B5A), Turquesa (#5CBDB4)
- **Tipografía**: Quicksand (primaria), Montserrat (títulos)
- **Componentes**: Button, Input, Card reutilizados
- **Responsive**: Adaptado para todos los tamaños de pantalla

## Testing

Para probar el sistema:

1. **Sin autenticación**: Visitar cualquier ruta → Redirigido a `/login`
2. **Login exitoso**: Usar credenciales de demo → Acceso al dashboard
3. **Logout**: Usar dropdown de usuario → Redirigido a `/login`
4. **Persistencia**: Recargar página → Mantiene sesión activa
5. **Protección**: Intentar acceder a `/login` autenticado → Redirigido al dashboard

## Conclusión

El sistema de autenticación implementado proporciona una base sólida y extensible para el panel de administración, siguiendo las mejores prácticas de Clean Code y manteniendo la consistencia visual del proyecto. 