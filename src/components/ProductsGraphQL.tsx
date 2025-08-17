import React, { useState } from 'react';
import { useProducts, useCreateProduct, useDeleteProduct, useProductSearch } from '../hooks/useProductsGraphQL';
import { CreateProductInput, ProductFilterInput, Product } from '../generated/graphql';

const ProductsGraphQL: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilterInput>({
    isActive: true,
    inStock: true
  });

  // Use GraphQL hooks
  const { products, loading, error, hasMore, loadMore } = useProducts({ filter: filters });
  const { create: createProduct, loading: creating } = useCreateProduct();
  const { remove: deleteProduct, loading: deleting } = useDeleteProduct();
  const { searchQuery, searchResults, search } = useProductSearch();

  const handleCreateProduct = async () => {
    const newProduct: CreateProductInput = {
      name: 'Cochecito para Bebé Premium',
      description: 'Cochecito seguro y cómodo para paseos con tu bebé',
      price: 299.99,
      salePrice: 249.99,
      sku: `COCHE-${Date.now()}`,
      images: [],
      attributes: {
        peso: '8kg',
        material: 'Aluminio',
        edad: '0-3 años'
      },
      isActive: true,
      stockQuantity: 10,
      tags: ['cochecito', 'bebé', 'paseo', 'seguro']
    };

    try {
      await createProduct(newProduct);
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleFilterChange = (newFilters: Partial<ProductFilterInput>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando productos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          🍼 Productos Happy Baby Style
        </h1>
        <button
          onClick={handleCreateProduct}
          disabled={creating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {creating ? 'Creando...' : '+ Nuevo Producto'}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos para bebés..."
          value={searchQuery}
          onChange={(e) => search(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchResults && (
          <div className="mt-2 text-sm text-gray-600">
            Se encontraron {searchResults.length} productos
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isActive || false}
            onChange={(e) => handleFilterChange({ isActive: e.target.checked })}
            className="mr-2"
          />
          Solo productos activos
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
            className="mr-2"
          />
          Solo en stock
        </label>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                disabled={deleting}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                🗑️
              </button>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">SKU:</span>
                <span className="text-sm font-mono">{product.sku}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Precio:</span>
                <div className="text-right">
                  {product.hasDiscount ? (
                    <>
                      <span className="text-sm line-through text-gray-400">
                        ${product.price}
                      </span>
                      <span className="text-lg font-bold text-green-600 ml-2">
                        ${product.currentPrice}
                      </span>
                      <span className="text-xs text-green-600 block">
                        -{product.discountPercentage}%
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      ${product.currentPrice}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Stock:</span>
                <span className={`text-sm font-medium ${
                  product.isInStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.stockQuantity} unidades
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Rating:</span>
                <span className="text-sm">
                  ⭐ {product.rating} ({product.reviewCount} reseñas)
                </span>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            {product.category && (
              <div className="mt-4 text-sm text-gray-500">
                Categoría: <span className="font-medium">{product.category.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
          >
            Cargar más productos
          </button>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🍼</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay productos disponibles
          </h3>
          <p className="text-gray-500">
            Crea tu primer producto para Happy Baby Style
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsGraphQL;