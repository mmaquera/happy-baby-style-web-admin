# 👥 Componentes de Usuarios - Happy Baby Style Web Admin

## 📋 Descripción General

Esta carpeta contiene todos los componentes relacionados con la gestión de usuarios en el sistema de administración. Los componentes siguen los estándares establecidos para manejo de errores, validaciones y arquitectura del sistema.

## 🏗️ Arquitectura de Componentes

### Estructura de Archivos
```
users/
├── README.md                           # Este archivo
├── ERROR_HANDLING_STANDARDS.md         # Estándares de manejo de errores
├── index.ts                            # Exportaciones principales
├── ImprovedCreateUserModal.tsx         # Modal de creación de usuarios
├── UserCard.tsx                        # Tarjeta de usuario individual
├── UserDetailModal.tsx                 # Modal de detalles de usuario
├── UserActionsMenu.tsx                 # Menú de acciones de usuario
├── PasswordManagementModal.tsx         # Modal de gestión de contraseñas
├── CreateUserModal.tsx                 # Modal de creación (legacy)
├── AuthProviderDashboard.tsx           # Dashboard de proveedores de auth
├── GoogleUserFeatures.tsx              # Funcionalidades específicas de Google
├── PasswordHistoryCard.tsx             # Historial de contraseñas
├── UserAuthAccounts.tsx                # Cuentas de autenticación
├── UserSessionsManager.tsx             # Gestor de sesiones
└── OAUTH_IMPLEMENTATION.md             # Documentación de OAuth
```

## 🎯 Componentes Principales

### 1. **ImprovedCreateUserModal.tsx** ⭐
**Descripción**: Modal mejorado para creación de usuarios con manejo robusto de errores
**Características**:
- ✅ Validación local completa de formularios
- ✅ Manejo de errores del servidor
- ✅ Formateo automático de datos para API
- ✅ Estados visuales claros del formulario
- ✅ Limpieza automática de errores

**Props Requeridas**:
```typescript
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserProfileInput) => Promise<any>;
  isLoading: boolean;
  serverError?: string | undefined; // OBLIGATORIO para errores del servidor
}
```

**Uso**:
```typescript
<ImprovedCreateUserModal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  onSubmit={handleCreateUser}
  isLoading={createUserMutation.loading}
  serverError={createUserMutation.error?.message}
/>
```

### 2. **UserCard.tsx**
**Descripción**: Tarjeta individual de usuario con información básica
**Características**:
- ✅ Información resumida del usuario
- ✅ Acciones rápidas
- ✅ Estados visuales (activo/inactivo)
- ✅ Responsive design

### 3. **UserDetailModal.tsx**
**Descripción**: Modal para ver y editar detalles completos del usuario
**Características**:
- ✅ Vista completa de información del usuario
- ✅ Edición inline de campos
- ✅ Historial de cambios
- ✅ Gestión de permisos

### 4. **UserActionsMenu.tsx**
**Descripción**: Menú contextual con acciones disponibles para el usuario
**Características**:
- ✅ Acciones contextuales
- ✅ Confirmaciones para acciones destructivas
- ✅ Estados de permisos
- ✅ Accesibilidad completa

## 🔧 Estándares Implementados

### 1. **Manejo de Errores**
- **Estados Separados**: Errores locales vs. errores del servidor
- **Mapeo Inteligente**: Errores del servidor se mapean a campos específicos
- **Limpieza Automática**: Errores se limpian cuando el usuario corrige
- **Feedback Visual**: Banner de errores del servidor y errores en campos

### 2. **Validaciones**
- **Validación Local**: Campos requeridos, formatos, rangos
- **Validación del Servidor**: Respuestas de API con códigos de error
- **Validación de Fechas**: Formato ISO, rangos válidos, prevención de fechas futuras
- **Validación de Contraseñas**: Fortaleza, requisitos mínimos

### 3. **Estados del Formulario**
- **Indicadores Visuales**: Pasos del formulario, botones deshabilitados
- **Estados de Carga**: Loading states, disabled states
- **Validación en Tiempo Real**: Feedback inmediato al usuario

## 📊 Patrones de Implementación

### 1. **Hook Pattern**
```typescript
// ✅ Patrón obligatorio para hooks de usuarios
export const useUserAction = () => {
  const [action, { loading, error }] = useUserActionMutation();
  
  const execute = async (input: UserActionInput) => {
    try {
      const result = await action({ variables: { input } });
      
      // ✅ Validar respuesta del servidor
      if (!result.data?.userAction?.success) {
        throw new Error(result.data?.userAction?.message || 'Error en acción');
      }
      
      return result.data.userAction;
    } catch (error) {
      // ✅ Propagar error para manejo en UI
      throw error;
    }
  };
  
  return { execute, loading, error };
};
```

### 2. **Modal Pattern**
```typescript
// ✅ Patrón obligatorio para modales de usuario
export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  serverError
}) => {
  // ✅ Estados separados para errores
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  
  // ✅ Procesar errores del servidor
  useEffect(() => {
    if (serverError) {
      processServerError(serverError);
    } else {
      setServerErrors({});
    }
  }, [serverError]);
  
  // ✅ Validación local
  const validateForm = (): boolean => {
    // implementación de validación
  };
  
  // ✅ Envío con formateo de datos
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setServerErrors({});
        const formattedData = formatDataForAPI(formData);
        await onSubmit(formattedData);
      } catch (error) {
        console.error('Error en modal:', error);
      }
    }
  };
  
  return (
    // JSX del modal
  );
};
```

### 3. **Error Processing Pattern**
```typescript
// ✅ Patrón obligatorio para procesar errores del servidor
const processServerError = (errorMessage: string): void => {
  const newServerErrors: Record<string, string> = {};
  
  // ✅ Mapeo inteligente de errores
  if (errorMessage.toLowerCase().includes('birth date')) {
    newServerErrors['dateOfBirth'] = 'Fecha de nacimiento inválida';
  } else if (errorMessage.toLowerCase().includes('email')) {
    newServerErrors['email'] = 'Email inválido o ya existe';
  }
  // ... más mapeos
  
  setServerErrors(newServerErrors);
};
```

## 🎨 Componentes de UI Requeridos

### 1. **ServerErrorBanner**
```typescript
const ServerErrorBanner = styled.div`
  background: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;
```

### 2. **Indicadores de Estado**
```typescript
// ✅ Indicador de pasos con errores del servidor
<Step active={true} completed={isFormValid() && Object.keys(serverErrors).length === 0}>
  <StepNumber active={true} completed={isFormValid() && Object.keys(serverErrors).length === 0}>1</StepNumber>
  <StepLabel>Datos Básicos</StepLabel>
</Step>

// ✅ Botón deshabilitado con errores
<Button
  variant="primary"
  onClick={handleSubmit}
  isLoading={isLoading}
  disabled={!isFormValid() || Object.keys(serverErrors).length > 0}
>
  {isLoading ? 'Procesando...' : 'Guardar'}
</Button>
```

## 🧪 Testing

### Casos de Prueba Obligatorios
- ✅ Validación local de campos requeridos
- ✅ Validación de formatos (email, fecha, contraseña)
- ✅ Manejo de errores del servidor
- ✅ Mapeo de errores a campos específicos
- ✅ Estados del formulario con errores
- ✅ Limpieza automática de errores
- ✅ Formateo de datos para API

### Ejemplo de Test
```typescript
describe('ImprovedCreateUserModal', () => {
  test('should handle server validation error', async () => {
    const mockServerError = 'Validation failed: Birth date is invalid';
    
    render(
      <ImprovedCreateUserModal
        isOpen={true}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        isLoading={false}
        serverError={mockServerError}
      />
    );
    
    // Verificar que el error se mapea al campo correcto
    expect(screen.getByText('Fecha de nacimiento inválida')).toBeInTheDocument();
    
    // Verificar que el botón está deshabilitado
    expect(screen.getByRole('button', { name: /crear usuario/i })).toBeDisabled();
  });
});
```

## 📝 Checklist de Implementación

### Para Nuevos Componentes de Usuario
- [ ] Seguir patrones establecidos en `ERROR_HANDLING_STANDARDS.md`
- [ ] Implementar estados separados para errores locales y del servidor
- [ ] Agregar validación local completa
- [ ] Implementar procesamiento de errores del servidor
- [ ] Agregar indicadores visuales de estado
- [ ] Implementar limpieza automática de errores
- [ ] Agregar tests unitarios
- [ ] Documentar props y comportamiento

### Para Modificaciones de Componentes Existentes
- [ ] Mantener compatibilidad con patrones establecidos
- [ ] Actualizar manejo de errores si es necesario
- [ ] Agregar tests para nuevas funcionalidades
- [ ] Actualizar documentación
- [ ] Verificar consistencia con otros componentes

## 🚀 Próximos Pasos

1. **Implementar** estándares en componentes legacy (`CreateUserModal.tsx`)
2. **Extender** sistema de errores para otros tipos de validación
3. **Crear** componentes reutilizables para manejo de errores
4. **Implementar** tests automatizados para todos los casos de uso
5. **Documentar** patrones específicos para otros tipos de entidades

## 📚 Referencias

- [Estándares de Manejo de Errores](./ERROR_HANDLING_STANDARDS.md)
- [Estándares de Desarrollo del Proyecto](../../../DEVELOPMENT_STANDARDS.md)
- [Principios SOLID](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code Principles](https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html)

---

**Última actualización**: [Fecha actual]
**Versión**: 1.0.0
**Mantenido por**: Equipo de Desarrollo
**Estándares**: Basado en `ERROR_HANDLING_STANDARDS.md`