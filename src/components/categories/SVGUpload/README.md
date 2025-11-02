# 🎨 SVG Upload Module - Categories

## 📋 Descripción

Este módulo implementa la funcionalidad específica para la subida de archivos SVG en el módulo de categorías, siguiendo los estándares de desarrollo establecidos en el proyecto. El módulo está diseñado para ser independiente del módulo de productos, manteniendo la separación de responsabilidades.

## 🎯 Características Implementadas

### **Componente SVGUpload**
- **Drag & Drop**: Interfaz intuitiva para arrastrar y soltar archivos SVG
- **Validación Específica**: Validaciones específicas para archivos SVG
- **Preview**: Vista previa del SVG subido
- **Optimización**: Optimización automática del contenido SVG
- **Manejo de Errores**: Sistema robusto de manejo de errores
- **Progress Tracking**: Seguimiento del progreso de subida

### **Hook useSVGUpload**
- **Validación**: Validación específica para archivos SVG
- **Optimización**: Optimización del contenido SVG
- **Upload Management**: Gestión completa del proceso de subida
- **Error Handling**: Manejo de errores específicos
- **State Management**: Gestión de estados de carga y progreso

## 🏗️ Arquitectura

### **Principios de Diseño**
- **Single Responsibility**: Cada componente tiene una responsabilidad específica
- **Open/Closed**: Extensible sin modificar código existente
- **Dependency Inversion**: Dependencias inyectadas y testables
- **Clean Architecture**: Separación clara de responsabilidades

### **Estructura de Archivos**
```
src/components/categories/SVGUpload/
├── SVGUpload.tsx           # Componente principal
├── SVGUpload.styles.ts     # Estilos específicos
├── SVGUpload.types.ts      # Tipos TypeScript
└── index.ts               # Exportaciones

src/hooks/
└── useSVGUpload.ts        # Hook personalizado
```

## 🎨 Características del Componente

### **Props Interface**
```typescript
interface SVGUploadProps {
  onUploadComplete: (svgUrl: string) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // Default: 500KB
  allowedTypes?: string[]; // Default: ['image/svg+xml']
  entityType: 'category';
  categoryId?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  showPreview?: boolean; // Default: true
}
```

### **Validaciones Específicas**
- **Tipo de archivo**: Solo archivos SVG
- **Tamaño máximo**: 500KB (optimizado para SVG)
- **Tamaño mínimo**: 100 bytes
- **Estructura**: Validación de estructura SVG válida
- **Dimensiones**: Máximo 2000px, mínimo 16px

### **Optimizaciones**
- **Eliminación de comentarios**: Remueve comentarios innecesarios
- **Compresión de espacios**: Optimiza espacios en blanco
- **Eliminación de líneas vacías**: Limpia líneas vacías
- **Trim**: Elimina espacios al inicio y final

## 🚀 Uso y Implementación

### **Uso Básico**
```typescript
import { SVGUpload } from '@/components/categories/SVGUpload';

const MyComponent = () => {
  const handleUploadComplete = (svgUrl: string) => {
    console.log('SVG subido:', svgUrl);
  };

  const handleUploadError = (error: string) => {
    console.error('Error:', error);
  };

  return (
    <SVGUpload
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      entityType="category"
      showPreview={true}
    />
  );
};
```

### **Uso Avanzado**
```typescript
import { SVGUpload } from '@/components/categories/SVGUpload';

const AdvancedComponent = () => {
  const [svgUrl, setSvgUrl] = useState('');
  const [error, setError] = useState('');

  return (
    <SVGUpload
      onUploadComplete={(url) => {
        setSvgUrl(url);
        setError('');
      }}
      onUploadError={(err) => {
        setError(err);
        setSvgUrl('');
      }}
      entityType="category"
      categoryId="category-123"
      maxSize={300000} // 300KB
      disabled={false}
      placeholder="Arrastra tu SVG aquí"
      showPreview={true}
    />
  );
};
```

### **Hook Personalizado**
```typescript
import { useSVGUpload } from '@/hooks/useSVGUpload';

const MyComponent = () => {
  const {
    uploadSVG,
    validateSVG,
    optimizeSVG,
    loading,
    progress,
    error,
    clearError,
    reset,
  } = useSVGUpload();

  const handleFileSelect = async (file: File) => {
    try {
      const result = await uploadSVG(file);
      console.log('Upload result:', result);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div>
      {loading && <div>Subiendo...</div>}
      {progress && <div>Progreso: {progress.percentage}%</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};
```

## 🎨 Estilos y Temas

### **Tema Consistente**
- Utiliza el sistema de temas centralizado (`@/styles/theme`)
- Colores consistentes con la identidad de Happy Baby Style
- Paleta de colores semánticos (success, warning, error, info)

### **Componentes Estilizados**
- **SVGUploadZone**: Zona de drag & drop con estados visuales
- **SVGPreview**: Vista previa del SVG con overlay de acciones
- **SVGProgressBar**: Barra de progreso animada
- **SVGValidationMessage**: Mensajes de validación con colores semánticos

## 🔧 Configuración

### **Constantes de Configuración**
```typescript
export const SVG_UPLOAD_DEFAULTS = {
  maxSize: 500000, // 500KB
  allowedTypes: ['image/svg+xml'],
  entityType: 'category' as const,
  showPreview: true,
} as const;

export const SVG_VALIDATION_RULES = {
  maxSize: 500000, // 500KB
  minSize: 100, // 100 bytes
  allowedTypes: ['image/svg+xml', 'image/svg'],
  maxDimensions: 2000, // Maximum width/height
  minDimensions: 16, // Minimum width/height
} as const;
```

## 📊 Métricas y Performance

### **Indicadores de Calidad**
- **Tiempo de Validación**: < 100ms para archivos SVG
- **Tiempo de Optimización**: < 50ms para contenido SVG
- **Tamaño de Bundle**: Mínimo impacto en el bundle principal
- **Accesibilidad**: WCAG 2.1 AA compliance

### **Optimizaciones Implementadas**
- **Lazy Loading**: Carga bajo demanda del componente
- **Debouncing**: Validación optimizada
- **Memory Management**: Limpieza automática de recursos
- **Error Recovery**: Recuperación automática de errores

## 🧪 Testing

### **Cobertura de Tests**
- **Unit Tests**: Componente SVGUpload
- **Integration Tests**: Hook useSVGUpload
- **E2E Tests**: Flujo completo de subida
- **Visual Tests**: Estados visuales del componente

### **Casos de Prueba**
- ✅ Subida exitosa de archivo SVG válido
- ✅ Validación de archivos no SVG
- ✅ Manejo de archivos demasiado grandes
- ✅ Manejo de archivos corruptos
- ✅ Drag & drop functionality
- ✅ Estados de carga y progreso
- ✅ Manejo de errores de red

## 🔮 Roadmap y Mejoras Futuras

### **Próximas Funcionalidades**
- [ ] Compresión avanzada de SVG
- [ ] Validación de accesibilidad en SVG
- [ ] Soporte para múltiples archivos
- [ ] Integración con CDN
- [ ] Cache inteligente de archivos

### **Mejoras Técnicas**
- [ ] Web Workers para optimización
- [ ] Service Worker para cache offline
- [ ] Métricas de performance avanzadas
- [ ] A/B testing para UX

## 📚 Recursos y Referencias

### **Documentación del Proyecto**
- **Estándares de Desarrollo**: [DEVELOPMENT_STANDARDS.md](../../DEVELOPMENT_STANDARDS.md)
- **Módulo de Categorías**: [README.md](../README.md)
- **Módulo de Productos**: [../products/README.md](../products/README.md)

### **Tecnologías Utilizadas**
- **React 18+**: Biblioteca principal de UI
- **TypeScript**: Tipado estático
- **Styled Components**: CSS-in-JS
- **Apollo Client**: Cliente GraphQL
- **Lucide React**: Iconografía

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0  
**Mantenido por**: Equipo de Desarrollo
