import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { 
  ProductHeader, 
  ProductFilters, 
  ProductGrid,
  ProductListView,
  CreateProductModal
} from '@/components/products';
import { useProducts } from '@/hooks/useProductsGraphQL';
import { 
  Package,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Grid3X3,
  List,
  Printer,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  Settings
} from 'lucide-react';

// Local interface for mock products that matches the actual data structure
interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  category: { id: string; name: string; slug: string };
}

// Mock data for demonstration - in real app this would come from API
const mockCategories = [
  { id: '1', name: 'Ropa para Bebés', slug: 'ropa-bebes' },
  { id: '2', name: 'Juguetes', slug: 'juguetes' },
  { id: '3', name: 'Alimentación', slug: 'alimentacion' },
  { id: '4', name: 'Higiene', slug: 'higiene' },
  { id: '5', name: 'Accesorios', slug: 'accesorios' }
];

const mockAvailableTags = [
  'recién nacido', '0-3 meses', '3-6 meses', '6-12 meses', 
  '12-24 meses', 'orgánico', 'ecológico', 'premium', 'básico'
];

const ProductsContainer = styled.div`
  padding: ${theme.spacing[6]};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[4]};
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.white}80;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${theme.colors.background.accent};
  border-top: 4px solid ${theme.colors.primaryPurple};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: ${theme.spacing[4]};
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

export const Products: React.FC = () => {
  // State for filters
  const [filters, setFilters] = useState<{
    search: string;
    categoryId: string;
    isActive: boolean;
    inStock: boolean;
    minPrice: number | null;
    maxPrice: number | null;
    tags: string[];
  }>({
    search: '',
    categoryId: '',
    isActive: true,
    inStock: true,
    minPrice: null,
    maxPrice: null,
    tags: []
  });

  // State for UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Mock stats - in real app this would come from API
  const [stats] = useState({
    totalProducts: 156,
    activeProducts: 148,
    lowStockProducts: 12,
    outOfStockProducts: 4
  });

  // Mock products data - in real app this would come from GraphQL
  const [products] = useState<MockProduct[]>([
    {
      id: '1',
      name: 'Body Orgánico para Recién Nacido',
      description: 'Body 100% algodón orgánico, suave y transpirable para la piel sensible del bebé',
      price: 25.99,
      salePrice: 19.99,
      images: ['https://via.placeholder.com/300x300/FFB6C1/000000?text=Body+Bebe'],
      stockQuantity: 45,
      isActive: true,
      rating: 4.8,
      reviewCount: 127,
      tags: ['orgánico', 'recién nacido', 'algodón'],
      category: { id: '1', name: 'Ropa para Bebés', slug: 'ropa-bebes' }
    },
    {
      id: '2',
      name: 'Juguete Educativo de Madera',
      description: 'Juguete de construcción de madera natural, perfecto para desarrollar habilidades motoras',
      price: 34.99,
      salePrice: null,
      images: ['https://via.placeholder.com/300x300/98FB98/000000?text=Juguete+Madera'],
      stockQuantity: 8,
      isActive: true,
      rating: 4.6,
      reviewCount: 89,
      tags: ['educativo', 'madera', 'desarrollo'],
      category: { id: '2', name: 'Juguetes', slug: 'juguetes' }
    },
    {
      id: '3',
      name: 'Leche de Fórmula Premium',
      description: 'Fórmula nutricional completa con DHA y prebióticos para el desarrollo cerebral',
      price: 45.99,
      salePrice: 39.99,
      images: ['https://via.placeholder.com/300x300/87CEEB/000000?text=Formula+Bebe'],
      stockQuantity: 0,
      isActive: true,
      rating: 4.9,
      reviewCount: 234,
      tags: ['fórmula', 'premium', 'nutrición'],
      category: { id: '3', name: 'Alimentación', slug: 'alimentacion' }
    },
    {
      id: '4',
      name: 'Pañales Ecológicos Talla 3',
      description: 'Pañales biodegradables, hipoalergénicos y súper absorbentes',
      price: 32.99,
      salePrice: null,
      images: ['https://via.placeholder.com/300x300/F0E68C/000000?text=Pañales+Eco'],
      stockQuantity: 67,
      isActive: true,
      rating: 4.7,
      reviewCount: 156,
      tags: ['ecológico', 'biodegradable', 'hipoalergénico'],
      category: { id: '4', name: 'Higiene', slug: 'higiene' }
    },
    {
      id: '5',
      name: 'Cochecito Plegable Premium',
      description: 'Cochecito ligero y compacto, perfecto para viajes y paseos urbanos',
      price: 299.99,
      salePrice: 249.99,
      images: ['https://via.placeholder.com/300x300/DDA0DD/000000?text=Cochecito'],
      stockQuantity: 3,
      isActive: true,
      rating: 4.5,
      reviewCount: 78,
      tags: ['premium', 'plegable', 'viaje'],
      category: { id: '5', name: 'Accesorios', slug: 'accesorios' }
    },
    {
      id: '6',
      name: 'Mantita de Recepción Suave',
      description: 'Mantita de algodón y poliéster, ideal para envolver al bebé',
      price: 18.99,
      salePrice: null,
      images: ['https://via.placeholder.com/300x300/FFE4B5/000000?text=Mantita'],
      stockQuantity: 23,
      isActive: false,
      rating: 4.3,
      reviewCount: 45,
      tags: ['mantita', 'suave', 'envolver'],
      category: { id: '1', name: 'Ropa para Bebés', slug: 'ropa-bebes' }
    }
  ]);

  // Function to map MockProduct to Product type
  const mapMockToProduct = (mockProduct: MockProduct): any => ({
    ...mockProduct,
    sku: `SKU-${mockProduct.id}`,
    attributes: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentPrice: mockProduct.salePrice || mockProduct.price,
    hasDiscount: !!mockProduct.salePrice,
    discountPercentage: mockProduct.salePrice ? Math.round(((mockProduct.price - mockProduct.salePrice) / mockProduct.price) * 100) : 0,
    totalStock: mockProduct.stockQuantity,
    isInStock: mockProduct.stockQuantity > 0,
    variants: []
  });

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.categoryId && product.category?.id !== filters.categoryId) {
      return false;
    }

    // Active status filter
    if (filters.isActive !== undefined && product.isActive !== filters.isActive) {
      return false;
    }

    // Stock filter
    if (filters.inStock && product.stockQuantity === 0) {
      return false;
    }

    // Price range filter
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0 && !filters.tags.some(tag => product.tags.includes(tag))) {
      return false;
    }

    return true;
  });

  // Event handlers
  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      categoryId: '',
      isActive: true,
      inStock: true,
      minPrice: null,
      maxPrice: null,
      tags: []
    });
  }, []);

  const handleAddProduct = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateProductSuccess = useCallback((product: any) => {
    console.log('Producto creado:', product);
    // TODO: Refresh products list or add to current list
    setIsCreateModalOpen(false);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleBulkActions = useCallback(() => {
    // TODO: Implement bulk actions
    console.log('Bulk actions clicked');
  }, []);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Export clicked');
  }, []);

  const handleImport = useCallback(() => {
    // TODO: Implement import functionality
    console.log('Import clicked');
  }, []);

  const handleEditProduct = useCallback((productId: string) => {
    // TODO: Implement edit product modal/form
    console.log('Edit product:', productId);
  }, []);

  const handleDeleteProduct = useCallback((productId: string) => {
    // TODO: Implement delete confirmation
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      console.log('Delete product:', productId);
    }
  }, []);

  const handleToggleStatus = useCallback((productId: string, isActive: boolean) => {
    // TODO: Implement status toggle
    console.log('Toggle status:', productId, isActive);
  }, []);

  const handleViewDetails = useCallback((productId: string) => {
    // TODO: Implement view details modal/page
    console.log('View details:', productId);
  }, []);

  const handleLoadMore = useCallback(() => {
    // TODO: Implement pagination
    console.log('Load more products');
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    console.log('Cambiando vista a:', mode);
    setViewMode(mode);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <LoadingOverlay>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <LoadingText>Cargando productos...</LoadingText>
        </div>
      </LoadingOverlay>
    );
  }

  console.log('Estado actual viewMode:', viewMode);
  
  return (
    <ProductsContainer>
      <ProductHeader
        title="Productos Happy Baby Style"
        stats={stats}
        viewMode={viewMode}
        onAddProduct={handleAddProduct}
        onBulkActions={handleBulkActions}
        onExport={handleExport}
        onImport={handleImport}
        onViewModeChange={handleViewModeChange}
      />

      <ProductFilters
        filters={(() => {
          const filterObj: any = {
            search: filters.search,
            categoryId: filters.categoryId,
            isActive: filters.isActive,
            inStock: filters.inStock,
            tags: filters.tags
          };
          
          if (filters.minPrice !== null) filterObj.minPrice = filters.minPrice;
          if (filters.maxPrice !== null) filterObj.maxPrice = filters.maxPrice;
          
          return filterObj;
        })()}
        categories={mockCategories}
        availableTags={mockAvailableTags}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {viewMode === 'grid' ? (
      
                  <ProductGrid
          products={filteredProducts.map(mapMockToProduct)}
          loading={isLoading}
          error={error}
          hasMore={false} // TODO: Implement pagination
          onLoadMore={handleLoadMore}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onToggleStatus={handleToggleStatus}
          onViewDetails={handleViewDetails}
          emptyMessage="No se encontraron productos que coincidan con los filtros aplicados."
        />
        
      ) : (
        
                  <ProductListView
          products={filteredProducts.map(mapMockToProduct)}
          loading={isLoading}
          error={error}
          total={filteredProducts.length}
          currentPage={1}
          totalPages={1}
          hasMore={false}
          onPageChange={() => {}} // TODO: Implement pagination
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onToggleStatus={handleToggleStatus}
          onViewDetails={handleViewDetails}
          onSort={() => {}} // TODO: Implement sorting
          onFilter={() => {}} // TODO: Implement filtering
        />
  
      )}

        <CreateProductModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSuccess={handleCreateProductSuccess}
          categories={mockCategories}
          availableTags={mockAvailableTags}
        />
      </ProductsContainer>
    );
  };