# Estándares de Manejo de Errores y Validaciones

## 📋 Descripción General

Este documento establece los estándares para implementar un manejo robusto de errores y validaciones en el sistema de administración de usuarios, siguiendo los principios SOLID y Clean Code.

## 🎯 Objetivos

- Proporcionar feedback claro y específico al usuario
- Manejar errores tanto del cliente como del servidor
- Mantener consistencia en la experiencia del usuario
- Facilitar el mantenimiento y escalabilidad del código
- Seguir principios SOLID y Clean Code

## 🏗️ Arquitectura del Sistema de Errores

### 1. **Capas de Validación**

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Layer (Modal)                        │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Local Errors   │  │ Server Errors   │                │
│  │  (Client-side)  │  │ (API Response)  │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                  Hook Layer (useCreateUser)                │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Response        │  │ Error           │                │
│  │ Validation      │  │ Processing      │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (GraphQL)                     │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Success         │  │ Error           │                │
│  │ Response        │  │ Response        │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Flujo de Manejo de Errores**

```
User Input → Local Validation → API Call → Response Processing → Error Display
     ↓              ↓            ↓              ↓                ↓
  Form Data    Client Errors  Server Call  Success/Error    UI Feedback
```

## 🔧 Implementación de Estándares

### 1. **Hook Layer (useCreateUser)**

#### Estructura Requerida
```typescript
export const useCreateUser = () => {
  const [createUserMutation, { loading, error }] = useCreateUserMutation({
    refetchQueries: [GetUsersDocument],
  });

  const create = async (input: CreateUserProfileInput) => {
    try {
      const result = await createUserMutation({
        variables: { input }
      });
      
      const response = result.data?.createUser;
      
      // ✅ VALIDACIÓN OBLIGATORIA: Verificar respuesta del servidor
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }
      
      // ✅ VALIDACIÓN OBLIGATORIA: Verificar success antes de mostrar éxito
      if (!response.success) {
        const errorMessage = response.message || 'Error al crear usuario';
        const errorCode = response.code || 'UNKNOWN_ERROR';
        
        throw new Error(`${errorMessage} (${errorCode})`);
      }
      
      // ✅ SOLO mostrar éxito cuando success = true
      toast.success('Usuario creado exitosamente');
      return response;
    } catch (error) {
      // ✅ Manejar errores con mensajes descriptivos
      const errorMessage = error instanceof Error ? error.message : 'Error al crear usuario';
      toast.error(errorMessage);
      throw error;
    }
  };

  return { create, loading, error };
};
```

#### Reglas Obligatorias
- ✅ **Siempre** validar `response.success` antes de mostrar mensajes de éxito
- ✅ **Siempre** incluir códigos de error en los mensajes de error
- ✅ **Siempre** manejar casos donde `response` es `null` o `undefined`
- ✅ **Siempre** propagar errores para manejo en capas superiores

### 2. **Modal Layer (ImprovedCreateUserModal)**

#### Estados de Error Requeridos
```typescript
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserProfileInput) => Promise<any>;
  isLoading: boolean;
  serverError?: string | undefined; // ✅ OBLIGATORIO para errores del servidor
}

// ✅ Estados separados para errores locales y del servidor
const [errors, setErrors] = useState<Record<string, string>>({});
const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
```

#### Validación Local Obligatoria
```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  // ✅ Validaciones básicas de campos requeridos
  if (!formData.email) {
    newErrors['email'] = 'Email es requerido';
  } else if (!isValidEmail(formData.email)) {
    newErrors['email'] = 'Email no válido';
  }

  // ✅ Validaciones de contraseña
  if (!formData.password) {
    newErrors['password'] = 'Contraseña es requerida';
  } else if (calculatePasswordStrength(formData.password) < 50) {
    newErrors['password'] = 'Contraseña muy débil';
  }

  // ✅ Validaciones de campos personales
  if (!formData.firstName) {
    newErrors['firstName'] = 'Nombre es requerido';
  }

  if (!formData.lastName) {
    newErrors['lastName'] = 'Apellido es requerido';
  }

  // ✅ Validaciones de fecha de nacimiento
  if (formData.dateOfBirth) {
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    
    if (isNaN(birthDate.getTime())) {
      newErrors['dateOfBirth'] = 'Fecha de nacimiento no válida';
    } else if (birthDate > today) {
      newErrors['dateOfBirth'] = 'La fecha de nacimiento no puede ser futura';
    } else if (birthDate < new Date('1900-01-01')) {
      newErrors['dateOfBirth'] = 'Fecha de nacimiento demasiado antigua';
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

#### Procesamiento de Errores del Servidor
```typescript
// ✅ Función obligatoria para mapear errores del servidor a campos
const processServerError = (errorMessage: string): void => {
  const newServerErrors: Record<string, string> = {};
  
  // ✅ Mapeo inteligente de errores del servidor
  if (errorMessage.toLowerCase().includes('birth date') || 
      errorMessage.toLowerCase().includes('fecha de nacimiento')) {
    newServerErrors['dateOfBirth'] = 'Fecha de nacimiento inválida';
  } else if (errorMessage.toLowerCase().includes('email')) {
    newServerErrors['email'] = 'Email inválido o ya existe';
  } else if (errorMessage.toLowerCase().includes('password')) {
    newServerErrors['password'] = 'Contraseña inválida';
  } else if (errorMessage.toLowerCase().includes('first name') || 
             errorMessage.toLowerCase().includes('nombre')) {
    newServerErrors['firstName'] = 'Nombre inválido';
  } else if (errorMessage.toLowerCase().includes('last name') || 
             errorMessage.toLowerCase().includes('apellido')) {
    newServerErrors['lastName'] = 'Apellido inválido';
  } else if (errorMessage.toLowerCase().includes('phone') || 
             errorMessage.toLowerCase().includes('teléfono')) {
    newServerErrors['phone'] = 'Teléfono inválido';
  }
  
  setServerErrors(newServerErrors);
};

// ✅ useEffect obligatorio para procesar errores del servidor
useEffect(() => {
  if (serverError) {
    processServerError(serverError);
  } else {
    setServerErrors({});
  }
}, [serverError]);
```

#### Manejo de Campos de Formulario
```typescript
// ✅ Patrón obligatorio para todos los campos
<Input
  label="Email"
  type="email"
  value={formData.email}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, email: e.target.value }));
    
    // ✅ Limpiar errores cuando el usuario empiece a corregir
    if (errors['email'] || serverErrors['email']) {
      setErrors(prev => ({ ...prev, email: '' }));
      setServerErrors(prev => ({ ...prev, email: '' }));
    }
  }}
  required
  placeholder="ejemplo@correo.com"
  // ✅ Mostrar tanto errores locales como del servidor
  error={errors['email'] || serverErrors['email'] || ''}
/>
```

#### Formateo de Datos para API
```typescript
// ✅ Función obligatoria para formatear fechas
const formatDateForAPI = (dateString: string): string | null => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    // ✅ Asegurar formato ISO para el backend
    return date.toISOString();
  } catch {
    return null;
  }
};

// ✅ Aplicar formateo antes de enviar al servidor
const handleSubmit = async () => {
  if (validateForm()) {
    try {
      setServerErrors({});
      
      const formattedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? 
          formatDateForAPI(formData.dateOfBirth as string) : null
      };
      
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error en el modal:', error);
    }
  }
};
```

### 3. **Page Layer (Users.tsx)**

#### Manejo de Respuesta Obligatorio
```typescript
const handleCreateUser = async (userData: any) => {
  try {
    const result = await createUserMutation.create(userData);
    
    // ✅ Verificar success antes de cerrar modal
    if (result?.success) {
      setShowCreateModal(false);
      // El toast ya se maneja en el hook
    } else {
      // ✅ Manejar caso donde success es false pero no hay excepción
      toast.error(result?.message || 'Error al crear usuario');
    }
  } catch (error) {
    // ✅ El error ya se maneja en el hook
    console.error('Error en handleCreateUser:', error);
  }
};
```

#### Props del Modal Obligatorias
```typescript
<ImprovedCreateUserModal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  onSubmit={handleCreateUser}
  isLoading={createUserMutation.loading}
  // ✅ OBLIGATORIO: Pasar errores del servidor al modal
  serverError={createUserMutation.error?.message}
/>
```

## 🎨 Componentes de UI Requeridos

### 1. **Banner de Error del Servidor**
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

// ✅ Uso obligatorio en el modal
{serverError && (
  <ServerErrorBanner>
    <Shield size={16} />
    {serverError}
  </ServerErrorBanner>
)}
```

### 2. **Indicadores de Estado del Formulario**
```typescript
// ✅ Indicador de pasos que considera errores del servidor
<Step active={true} completed={isFormValid() && Object.keys(serverErrors).length === 0}>
  <StepNumber active={true} completed={isFormValid() && Object.keys(serverErrors).length === 0}>1</StepNumber>
  <StepLabel>Datos Básicos</StepLabel>
</Step>

// ✅ Botón deshabilitado con errores del servidor
<Button
  variant="primary"
  onClick={handleSubmit}
  isLoading={isLoading}
  disabled={!isFormValid() || Object.keys(serverErrors).length > 0}
  size="large"
  icon={<UserPlus size={14} />}
>
  {isLoading ? 'Creando...' : 'Crear Usuario'}
</Button>
```

## 📊 Validación de Formularios

### 1. **Función de Validación Completa**
```typescript
const isFormValid = (): boolean => {
  const hasRequiredFields = !!(
    formData.email &&
    formData.password &&
    formData.firstName &&
    formData.lastName &&
    isValidEmail(formData.email) &&
    calculatePasswordStrength(formData.password) >= 50
  );
  
  // ✅ OBLIGATORIO: Considerar errores del servidor
  const hasNoServerErrors = Object.keys(serverErrors).length === 0;
  
  return hasRequiredFields && hasNoServerErrors;
};
```

### 2. **Validaciones de Fecha**
```typescript
// ✅ Validaciones obligatorias para fechas
const validateDate = (dateString: string): string | null => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const today = new Date();
  
  if (isNaN(date.getTime())) {
    return 'Fecha no válida';
  }
  
  if (date > today) {
    return 'La fecha no puede ser futura';
  }
  
  if (date < new Date('1900-01-01')) {
    return 'Fecha demasiado antigua';
  }
  
  return null;
};
```

## 🔄 Flujo de Limpieza de Errores

### 1. **Limpieza Automática**
```typescript
// ✅ Patrón obligatorio para limpiar errores
onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({ ...prev, email: e.target.value }));
  
  // Limpiar errores cuando el usuario empiece a corregir
  if (errors['email'] || serverErrors['email']) {
    setErrors(prev => ({ ...prev, email: '' }));
    setServerErrors(prev => ({ ...prev, email: '' }));
  }
}}
```

### 2. **Limpieza en Cierre del Modal**
```typescript
const handleClose = () => {
  setFormData({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: null,
    role: UserRole.customer,
    isActive: true
  });
  
  // ✅ OBLIGATORIO: Limpiar todos los estados de error
  setErrors({});
  setServerErrors({});
  onClose();
};
```

## 🧪 Testing y Validación

### 1. **Casos de Prueba Obligatorios**
- ✅ Validación local de campos requeridos
- ✅ Validación de formato de email
- ✅ Validación de fortaleza de contraseña
- ✅ Validación de fechas (pasado, futuro, formato)
- ✅ Manejo de errores del servidor
- ✅ Mapeo de errores a campos específicos
- ✅ Limpieza automática de errores
- ✅ Estados del formulario con errores

### 2. **Validación de Respuestas del Servidor**
```typescript
// ✅ Test obligatorio para respuesta exitosa
test('should handle successful user creation', async () => {
  const mockResponse = {
    success: true,
    message: 'Usuario creado exitosamente',
    data: { id: '1', email: 'test@example.com' }
  };
  
  // ... implementación del test
});

// ✅ Test obligatorio para respuesta con error
test('should handle server validation error', async () => {
  const mockResponse = {
    success: false,
    message: 'Validation failed: Birth date is invalid',
    code: 'INTERNAL_ERROR'
  };
  
  // ... implementación del test
});
```

## 📝 Checklist de Implementación

### Hook Layer
- [ ] Validar `response.success` antes de mostrar éxito
- [ ] Incluir códigos de error en mensajes
- [ ] Manejar casos de respuesta `null`/`undefined`
- [ ] Propagar errores para manejo en capas superiores

### Modal Layer
- [ ] Estados separados para errores locales y del servidor
- [ ] Función de procesamiento de errores del servidor
- [ ] useEffect para manejar cambios en errores del servidor
- [ ] Validación local completa de todos los campos
- [ ] Formateo de datos para API
- [ ] Limpieza automática de errores en cambios de campo
- [ ] Banner visual para errores del servidor

### Page Layer
- [ ] Verificar `success` antes de cerrar modal
- [ ] Pasar `serverError` como prop al modal
- [ ] Manejo de casos edge en respuestas

### UI Components
- [ ] Banner de error del servidor
- [ ] Indicadores de estado del formulario
- [ ] Botones deshabilitados con errores
- [ ] Campos con manejo de errores locales y del servidor

## 🚀 Próximos Pasos

1. **Implementar** estos estándares en todos los modales de creación/edición
2. **Extender** el sistema de errores para otros tipos de entidades
3. **Crear** componentes reutilizables para manejo de errores
4. **Implementar** tests automatizados para todos los casos de uso
5. **Documentar** patrones específicos para otros tipos de validación

## 📚 Referencias

- [Principios SOLID](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code Principles](https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html)
- [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [GraphQL Error Handling](https://graphql.org/learn/validation/)
