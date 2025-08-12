# 🍼 Módulo de Productos - Happy Baby Style Web Admin

## 📋 Descripción

Este módulo implementa la interfaz de usuario completa para la gestión de productos en la aplicación Happy Baby Style Web Admin, siguiendo los estándares de desarrollo establecidos en el proyecto.

## 🎯 Características

### **ProductCard**
- Tarjeta visual atractiva para cada producto
- Muestra imagen, nombre, precio, descripción y estado
- Badges para estado activo/inactivo y nivel de stock
- Botones de acción (editar, eliminar, cambiar estado)
- Diseño responsivo con hover effects
- Soporte para productos con descuento

### **ProductFilters**
- Filtros avanzados de búsqueda
- Búsqueda por texto (nombre, descripción, SKU)
- Filtro por categoría
- Filtros de estado (activo, en stock)
- Rango de precios
- Filtros por etiquetas
- Visualización de filtros activos
- Botón para limpiar todos los filtros

### **ProductGrid**
- Grid responsivo de productos
- Estados de carga, error y vacío
- Paginación con botón "Cargar Más"
- Estadísticas del grid
- Toggle entre vista grid y lista
- Manejo de estados de carga y error

### **ProductHeader**
- Encabezado principal con título y subtítulo
- Estadísticas visuales del catálogo
- Botones de acción principales
- Acciones rápidas
- Diseño adaptable y responsivo

## 🏗️ Arquitectura

### **Principios de Diseño**
- **Clean Architecture**: Separación clara de responsabilidades
- **Component Composition**: Componentes reutilizables y modulares
- **Styled Components**: CSS-in-JS con tema consistente
- **TypeScript**: Tipado estático completo
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla

### **Estructura de Componentes**
```
src/components/products/
├── ProductCard.tsx      # Tarjeta individual de producto
├── ProductFilters.tsx   # Sistema de filtros
├── ProductGrid.tsx      # Grid responsivo de productos
├── ProductHeader.tsx    # Encabezado con estadísticas
├── index.ts            # Exportaciones del módulo
└── README.md           # Esta documentación
```

## 🎨 Sistema de Diseño

### **Tema y Colores**
- Utiliza el sistema de temas centralizado (`@/styles/theme`)
- Colores consistentes con la identidad de Happy Baby Style
- Paleta de colores semánticos (success, warning, error, info)

### **Tipografía**
- **Heading**: Montserrat (títulos principales)
- **Body**: Quicksand (texto del cuerpo)
- Jerarquía clara de tamaños y pesos

### **Espaciado y Layout**
- Sistema de espaciado consistente (4px, 8px, 12px, 16px, etc.)
- Grid responsivo con breakpoints definidos
- Márgenes y padding uniformes

### **Componentes UI Base**
- **Button**: Variantes primary, secondary, outline, ghost, danger
- **Card**: Contenedores con sombras y hover effects
- **Input**: Campos de entrada con validación visual

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 768px (1 columna)
- **Tablet**: 768px - 1024px (2-3 columnas)
- **Desktop**: > 1024px (4+ columnas)

### **Adaptaciones**
- Grid adaptativo con `minmax()` y `auto-fill`
- Botones y controles adaptables
- Navegación optimizada para móvil

## 🔧 Uso

### **Importación Básica**
```typescript
import { 
  ProductCard, 
  ProductFilters, 
  ProductGrid, 
  ProductHeader 
} from '@/components/products';
```

### **Ejemplo de Implementación**
```typescript
import React from 'react';
import { ProductHeader, ProductFilters, ProductGrid } from '@/components/products';

const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);

  return (
    <div>
      <ProductHeader 
        stats={{
          totalProducts: 150,
          activeProducts: 142,
          lowStockProducts: 8,
          outOfStockProducts: 3
        }}
        onAddProduct={() => {/* lógica */}}
      />
      
      <ProductFilters 
        filters={filters}
        onFilterChange={setFilters}
        categories={[]}
        availableTags={[]}
      />
      
      <ProductGrid 
        products={products}
        onEdit={(id) => {/* lógica */}}
        onDelete={(id) => {/* lógica */}}
      />
    </div>
  );
};
```

## 🎯 Estados y Props

### **ProductCard Props**
- `product`: Objeto con datos del producto
- `onEdit`: Callback para editar
- `onDelete`: Callback para eliminar
- `onToggleStatus`: Callback para cambiar estado
- `onViewDetails`: Callback para ver detalles

### **ProductFilters Props**
- `filters`: Estado actual de los filtros
- `categories`: Lista de categorías disponibles
- `availableTags`: Lista de etiquetas disponibles
- `onFilterChange`: Callback para cambios de filtros
- `onClearFilters`: Callback para limpiar filtros

### **ProductGrid Props**
- `products`: Array de productos
- `loading`: Estado de carga
- `error`: Mensaje de error
- `hasMore`: Si hay más productos para cargar
- `onLoadMore`: Callback para cargar más

## 🚀 Mejoras Futuras

### **Funcionalidades Planificadas**
- [ ] Vista de lista alternativa
- [ ] Drag & drop para reordenar
- [ ] Filtros guardados
- [ ] Exportación avanzada
- [ ] Importación masiva
- [ ] Vista previa rápida

### **Optimizaciones Técnicas**
- [ ] Virtualización para listas grandes
- [ ] Lazy loading de imágenes
- [ ] Cache de filtros
- [ ] Debounce en búsquedas

## 🧪 Testing

### **Cobertura Requerida**
- **Unit Tests**: Mínimo 80%
- **Integration Tests**: Flujos críticos
- **Visual Regression**: Componentes UI

### **Casos de Prueba**
- Renderizado de componentes
- Interacciones de usuario
- Estados de carga y error
- Responsive behavior
- Accesibilidad

## 📚 Referencias

### **Estándares del Proyecto**
- [DEVELOPMENT_STANDARDS.md](../../DEVELOPMENT_STANDARDS.md)
- [Tema y Estilos](../../styles/theme.ts)
- [Componentes UI Base](../ui/)

### **Tecnologías**
- React 18+
- TypeScript
- Styled Components
- GraphQL (para datos)

---

**Última actualización**: [Fecha actual]
**Versión**: 1.0.0
**Mantenido por**: Equipo de Desarrollo
