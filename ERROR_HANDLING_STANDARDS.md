# 📋 Estándares de Manejo de Errores - Happy Baby Style Admin

## 🎯 Descripción General

Este documento establece los estándares para implementar un manejo robusto de errores y validaciones en el sistema de administración de Happy Baby Style, siguiendo los principios SOLID y Clean Code.

## 🏗️ Arquitectura del Sistema de Errores

### 1. **Capas de Validación**

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Layer (Component)                     │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Local Errors   │  │ Server Errors   │                │
│  │  (Client-side)  │  │ (API Response)  │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                  Hook Layer (useAction)                     │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Response        │  │ Error           │                │
│  │ Validation      │  │ Processing      │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                Service Layer (GraphQL)                      │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Mutation        │  │ Error           │                │
│  │ Execution       │  │ Handling        │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Tipos de Errores**

#### **A. Errores Locales (Client-side)**
- Validación de campos requeridos
- Validación de formatos (email, teléfono, etc.)
- Validación de reglas de negocio
- Validación de archivos (tamaño, tipo, etc.)

#### **B. Errores del Servidor (API Response)**
- Errores de validación del servidor
- Errores de autenticación/autorización
- Errores de red/conexión
- Errores internos del servidor

#### **C. Errores de GraphQL**
- Errores de sintaxis
- Errores de red
- Errores de autenticación
- Errores de autorización

## 🎨 Patrones de Implementación

### 1. **Hook Layer (useAction)**

#### **Estructura Requerida**
```typescript
export const useAction = () => {
  const [actionMutation, { loading, error }] = useActionMutation({
    refetchQueries: ['GetData'],
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const execute = async (input: ActionInput) => {
    try {
      // ✅ PASO 1: Limpiar errores previos
      setLocalError(null);

      // ✅ PASO 2: Validación local
      const validationErrors = validateInput(input);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        setLocalError(errorMessage);
        toast.error(errorMessage);
        return false;
      }

      // ✅ PASO 3: Ejecutar mutación
      const result = await actionMutation({
        variables: { input }
      });

      // ✅ PASO 4: Validar respuesta del servidor
      const response = result.data?.action;
      
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }
      
      if (!response.success) {
        const errorMessage = response.message || 'Error al ejecutar acción';
        const errorCode = response.code || 'UNKNOWN_ERROR';
        
        setLocalError(`${errorMessage} (${errorCode})`);
        toast.error(errorMessage);
        return false;
      }

      // ✅ PASO 5: Éxito
      toast.success('Acción ejecutada exitosamente');
      return true;
    } catch (error) {
      // ✅ PASO 6: Manejo de errores
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
      setLocalError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  // ✅ PASO 7: Combinar errores
  const combinedError = localError || (error?.message || null);

  return {
    execute,
    loading,
    error: combinedError,
    clearError: () => {
      setLocalError(null);
    }
  };
};
```

#### **Reglas Obligatorias**
- ✅ **Siempre** validar `response.success` antes de mostrar mensajes de éxito
- ✅ **Siempre** incluir códigos de error en los mensajes de error
- ✅ **Siempre** manejar casos donde `response` es `null` o `undefined`
- ✅ **Siempre** propagar errores para manejo en capas superiores
- ✅ **Siempre** limpiar errores previos antes de ejecutar nueva acción
- ✅ **Siempre** mostrar toast notifications para feedback inmediato

### 2. **Component Layer (Modal/Form)**

#### **Estados de Error Requeridos**
```typescript
interface ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InputData) => Promise<any>;
  isLoading: boolean;
  serverError?: string | undefined; // ✅ OBLIGATORIO para errores del servidor
}

// ✅ Estados separados para errores
const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
```

#### **Procesamiento de Errores del Servidor**
```typescript
// ✅ Función obligatoria para procesar errores del servidor
const processServerError = (errorMessage: string): void => {
  const newServerErrors: Record<string, string> = {};
  
  // ✅ Mapeo inteligente de errores
  if (errorMessage.toLowerCase().includes('email')) {
    newServerErrors['email'] = 'Email inválido o ya existe';
  } else if (errorMessage.toLowerCase().includes('password')) {
    newServerErrors['password'] = 'Contraseña inválida';
  } else if (errorMessage.toLowerCase().includes('name')) {
    newServerErrors['name'] = 'Nombre inválido';
  }
  // ... más mapeos según el contexto
  
  setServerErrors(newServerErrors);
};

// ✅ useEffect para manejar cambios en errores del servidor
useEffect(() => {
  if (serverError) {
    processServerError(serverError);
  } else {
    setServerErrors({});
  }
}, [serverError]);
```

#### **Validación Local**
```typescript
// ✅ Validación local completa
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  // Validaciones específicas del formulario
  if (!formData.name?.trim()) {
    newErrors['name'] = 'El nombre es requerido';
  }

  if (!formData.email?.trim()) {
    newErrors['email'] = 'El email es requerido';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    newErrors['email'] = 'Ingresa un email válido';
  }

  // ... más validaciones

  setLocalErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

#### **Limpieza Automática de Errores**
```typescript
// ✅ Limpieza automática cuando el usuario modifica campos
const handleInputChange = useCallback((field: keyof FormData, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  
  // Limpiar errores locales y del servidor
  if (localErrors[field]) {
    setLocalErrors(prev => ({ ...prev, [field]: '' }));
  }
  if (serverErrors[field]) {
    setServerErrors(prev => ({ ...prev, [field]: '' }));
  }
}, [localErrors, serverErrors]);
```

### 3. **UI Components**

#### **A. Banner de Error del Servidor**
```typescript
const ServerErrorBanner = styled.div`
  background: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// ✅ Uso obligatorio en el componente
{serverError && (
  <ServerErrorBanner>
    <AlertCircle size={16} />
    {serverError}
  </ServerErrorBanner>
)}
```

#### **B. Banner de Error del Servidor**
```typescript
const ServerErrorBanner = styled.div`
  background: ${theme.colors.error}15;
  border: 1px solid ${theme.colors.error}30;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// ✅ Uso obligatorio en el componente
{serverError && (
  <ServerErrorBanner>
    <AlertCircle size={16} />
    {serverError}
  </ServerErrorBanner>
)}
```

#### **C. Botón con Estados Mejorados**
```typescript
<Button
  type="submit"
  variant="primary"
  size="large"
  fullWidth
  isLoading={isLoading}
  disabled={isLoading || !isFormValid() || Object.keys(localErrors).length > 0}
>
  {isLoading ? 'Procesando...' : 'Enviar'}
</Button>
```

## 🔧 Configuración de Notificaciones

### 1. **Toast Notifications (React Hot Toast)**

#### **Configuración Global (App.tsx)**
```typescript
<Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      background: theme.colors.white,
      color: theme.colors.text.primary,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border.light}`,
      fontFamily: theme.fonts.primary,
    },
    success: {
      iconTheme: {
        primary: theme.colors.success,
        secondary: theme.colors.white,
      },
    },
    error: {
      iconTheme: {
        primary: theme.colors.error,
        secondary: theme.colors.white,
      },
    },
  }}
/>
```

#### **Hook Personalizado para Notificaciones**
```typescript
export const useNotifications = () => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: theme.colors.success,
        color: theme.colors.white,
        fontWeight: '500',
      },
    });
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: theme.colors.error,
        color: theme.colors.white,
        fontWeight: '500',
      },
    });
  }, []);

  const showLoading = useCallback((message: string) => {
    return toast.loading(message, {
      duration: Infinity,
      position: 'top-right',
      style: {
        background: theme.colors.info,
        color: theme.colors.white,
        fontWeight: '500',
      },
    });
  }, []);

  return {
    showSuccess,
    showError,
    showLoading,
  };
};
```

## 📝 Casos de Uso Específicos

### 1. **Módulo de Login**

#### **Problema Actual**
- Error no se muestra en UI
- Solo se loguea en consola
- Falta de toast notifications
- Manejo inconsistente con otros módulos

#### **Solución Propuesta**
```typescript
// ✅ Hook mejorado para login
export const useLoginForm = (): UseLoginFormReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError: clearAuthError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    defaultValues,
    mode: 'onBlur',
  });

  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      setLocalError(null);
      clearAuthError();
      
      const success = await login(data);
      
      if (success) {
        // ✅ El contexto ya maneja el toast de éxito
        navigate(redirectPath, { replace: true });
      } else {
        // ✅ El contexto ya maneja el toast de error
        const errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        setLocalError(errorMessage);
      }
    } catch (error) {
      // ✅ El contexto ya maneja el toast de error
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      const processedError = processLoginError(errorMessage);
      setLocalError(processedError);
    }
  }, [login, navigate, redirectPath, clearAuthError, processLoginError]);

  const combinedError = localError || error;

  return {
    form,
    isLoading,
    error: combinedError,
    showPassword,
    onSubmit,
    togglePasswordVisibility,
    clearError: () => {
      form.clearErrors();
      clearAuthError();
      setLocalError(null);
    },
  };
};
```

### 2. **Módulo de Usuarios**

#### **Patrón Establecido (Correcto)**
```typescript
// ✅ Ejemplo de implementación correcta
export const useCreateUser = () => {
  const [createUserMutation, { loading, error }] = useCreateUserMutation({
    refetchQueries: [GetUsersDocument],
  });

  const [customError, setCustomError] = useState<string | null>(null);

  const create = async (input: CreateUserProfileInput): Promise<boolean> => {
    try {
      setCustomError(null);

      const validationErrors = validateRegistrationInput(input);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join(', ');
        setCustomError(errorMessage);
        toast.error(errorMessage);
        return false;
      }

      const result = await createUserMutation({
        variables: { input }
      });

      const response = result.data?.createUser;

      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }

      if (!response.success) {
        const errorMessage = response.message || 'Error al crear usuario';
        const errorCode = response.code || 'UNKNOWN_ERROR';
        
        setCustomError(`${errorMessage} (${errorCode})`);
        toast.error(errorMessage);
        return false;
      }

      toast.success('Usuario creado exitosamente');
      return true;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear usuario';
      setCustomError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const combinedError = customError || (error?.message || null);

  return {
    create,
    loading,
    error: combinedError,
    clearError: () => setCustomError(null),
  };
};
```

### 3. **Módulo de Productos**

#### **Patrón Establecido (Correcto)**
```typescript
// ✅ Ejemplo de implementación correcta
export const useProductActions = (): UseProductActionsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(async (input: CreateProductInput): Promise<Product | null> => {
    setLoading(true);
    setError(null);

    try {
      const validationErrors = validateProductInput(input);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        toast.error('Error de validación: ' + validationErrors.join(', '));
        return null;
      }

      const result = await createProductMutation({ variables: { input } });
      
      if (!result.data?.createProduct?.success) {
        const errorMessage = result.data?.createProduct?.message || 'Error al crear producto';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      }

      toast.success('Producto creado exitosamente');
      return result.data.createProduct;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear producto';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProduct,
    loading,
    error,
    clearError: () => setError(null),
  };
};
```

## 🧪 Testing y Validación

### 1. **Casos de Prueba Obligatorios**

#### **A. Validación Local**
- ✅ Validación de campos requeridos
- ✅ Validación de formatos (email, teléfono, etc.)
- ✅ Validación de reglas de negocio
- ✅ Validación de archivos (tamaño, tipo, etc.)

#### **B. Manejo de Errores del Servidor**
- ✅ Manejo de errores de validación del servidor
- ✅ Manejo de errores de autenticación/autorización
- ✅ Manejo de errores de red/conexión
- ✅ Manejo de errores internos del servidor

#### **C. Estados del Formulario**
- ✅ Estados de carga
- ✅ Estados de error
- ✅ Estados de éxito
- ✅ Limpieza automática de errores

### 2. **Validación de Respuestas del Servidor**

```typescript
// ✅ Test obligatorio para respuesta exitosa
test('should handle successful operation', async () => {
  const mockResponse = {
    success: true,
    message: 'Operación exitosa',
    data: { id: '1', name: 'Test' }
  };
  
  // ... implementación del test
});

// ✅ Test obligatorio para respuesta con error
test('should handle server validation error', async () => {
  const mockResponse = {
    success: false,
    message: 'Validation failed: Invalid data',
    code: 'VALIDATION_ERROR'
  };
  
  // ... implementación del test
});
```

## 📋 Checklist de Implementación

### **Hook Layer**
- [ ] Validar `response.success` antes de mostrar éxito
- [ ] Incluir códigos de error en los mensajes
- [ ] Manejar casos de respuesta `null`/`undefined`
- [ ] Propagar errores para manejo en capas superiores
- [ ] Limpiar errores previos antes de ejecutar nueva acción
- [ ] Mostrar toast notifications para feedback inmediato

### **Component Layer**
- [ ] Estados separados para errores locales y del servidor
- [ ] Función de procesamiento de errores del servidor
- [ ] useEffect para manejar cambios en errores del servidor
- [ ] Validación local completa de todos los campos
- [ ] Formateo de datos para API
- [ ] Limpieza automática de errores en cambios de campo
- [ ] Banner visual para errores del servidor

### **UI Layer**
- [ ] Banner de error del servidor
- [ ] Botones con estados mejorados
- [ ] Animaciones para transiciones de estado
- [ ] Accesibilidad (ARIA labels, roles)
- [ ] Responsive design para móviles

### **Testing**
- [ ] Tests para validación local
- [ ] Tests para manejo de errores del servidor
- [ ] Tests para estados del formulario
- [ ] Tests para limpieza automática de errores
- [ ] Tests para notificaciones toast

## 🚀 Beneficios del Estándar

### **1. Consistencia**
- Mismo patrón de manejo de errores en toda la aplicación
- Experiencia de usuario uniforme
- Código más fácil de mantener

### **2. Usabilidad**
- Usuario recibe feedback claro y específico
- Acciones disponibles para resolver errores
- Interfaz limpia con toasts y banners de error

### **3. Mantenibilidad**
- Código más limpio y organizado
- Patrones reutilizables
- Fácil debugging y testing

### **4. Escalabilidad**
- Patrón reutilizable para futuros módulos
- Fácil integración de nuevas funcionalidades
- Soporte para diferentes tipos de errores

### **5. Accesibilidad**
- Mejor experiencia para usuarios con discapacidades
- ARIA labels y roles apropiados
- Navegación por teclado

## 📚 Referencias

- [React Hook Form Documentation](https://react-hook-form.com/)
- [React Hot Toast Documentation](https://react-hot-toast.com/)
- [Apollo Client Error Handling](https://www.apollographql.com/docs/react/data/error-handling/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code Principles](https://clean-code-developer.com/)

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Mantenido por**: Equipo de Desarrollo Happy Baby Style
