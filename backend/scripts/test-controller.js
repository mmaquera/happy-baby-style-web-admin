#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

async function testController() {
  console.log('🧪 Probando controlador de productos...\n');

  try {
    // 1. Simular GetProductsUseCase
    console.log('📋 1. Simulando GetProductsUseCase...');
    
    const config = {
      host: process.env.SUPABASE_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
      port: parseInt(process.env.SUPABASE_DB_PORT || '6543'),
      database: process.env.SUPABASE_DB_NAME || 'postgres',
      user: process.env.SUPABASE_DB_USER || 'postgres.uumwjhoqkiiyxuperrws',
      password: process.env.SUPABASE_DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      }
    };

    const pool = new Pool(config);

    // Simular findAll del repositorio
    async function findAll(filters = {}) {
      let query = 'SELECT * FROM products';
      const values = [];
      let whereConditions = [];
      let paramIndex = 1;

      if (filters.isActive !== undefined) {
        whereConditions.push(`is_active = $${paramIndex}`);
        values.push(filters.isActive);
        paramIndex++;
      }

      if (filters.search) {
        whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
        values.push(`%${filters.search}%`);
        paramIndex++;
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      query += ` ORDER BY created_at DESC`;

      if (filters.limit) {
        query += ` LIMIT $${paramIndex}`;
        values.push(filters.limit);
        paramIndex++;
      }

      if (filters.offset) {
        query += ` OFFSET $${paramIndex}`;
        values.push(filters.offset);
      }

      console.log('🔍 Query ejecutada:', query);
      console.log('🔍 Valores:', values);

      const result = await pool.query(query, values);
      return result.rows.map(row => mapToProductEntity(row));
    }

    // 2. Simular GetProductsUseCase.execute
    console.log('\n📋 2. Simulando GetProductsUseCase.execute...');
    
    const filters = {
      isActive: true,
      limit: 50,
      offset: 0
    };

    try {
      const products = await findAll(filters);
      console.log('✅ GetProductsUseCase.execute exitoso:', products.length, 'productos');
      
      if (products.length > 0) {
        console.log('📦 Primer producto:', {
          id: products[0].id,
          name: products[0].name,
          sku: products[0].sku
        });
      }
    } catch (error) {
      console.error('❌ Error en GetProductsUseCase.execute:', error.message);
      return;
    }

    // 3. Simular ProductController.getAll
    console.log('\n📋 3. Simulando ProductController.getAll...');
    
    try {
      // Simular request y response
      const mockReq = {
        query: {
          isActive: 'true',
          limit: '50',
          offset: '0'
        }
      };

      const mockRes = {
        json: function(data) {
          console.log('✅ ProductController.getAll exitoso');
          console.log('📊 Respuesta:', {
            success: data.success,
            count: data.count,
            message: data.message
          });
          return this;
        },
        status: function(code) {
          console.log('📊 Status code:', code);
          return this;
        }
      };

      // Simular la lógica del controlador
      const controllerFilters = {
        category: mockReq.query.category,
        isActive: mockReq.query.isActive ? mockReq.query.isActive === 'true' : undefined,
        minPrice: mockReq.query.minPrice ? parseFloat(mockReq.query.minPrice) : undefined,
        maxPrice: mockReq.query.maxPrice ? parseFloat(mockReq.query.maxPrice) : undefined,
        inStock: mockReq.query.inStock ? mockReq.query.inStock === 'true' : undefined,
        search: mockReq.query.search,
        limit: mockReq.query.limit ? parseInt(mockReq.query.limit) : undefined,
        offset: mockReq.query.offset ? parseInt(mockReq.query.offset) : undefined
      };

      console.log('🔍 Filtros del controlador:', controllerFilters);

      const products = await findAll(controllerFilters);
      
      mockRes.json({
        success: true,
        data: products,
        count: products.length,
        message: 'Products retrieved successfully'
      });

    } catch (error) {
      console.error('❌ Error en ProductController.getAll:', error.message);
      return;
    }

    await pool.end();
    console.log('\n🎉 ¡Todas las pruebas del controlador completadas!');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Función de mapeo (copiada del repositorio)
function mapToProductEntity(row) {
  // Función helper para parsear images (URLs separadas por comas)
  const parseImages = (images) => {
    if (!images) return [];
    if (typeof images === 'string') {
      // Si es una cadena con URLs separadas por comas
      if (images.includes('http')) {
        return images.split(',').map(url => url.trim());
      }
      // Si es JSON válido
      try {
        return JSON.parse(images);
      } catch {
        return [];
      }
    }
    return [];
  };

  // Función helper para parsear attributes
  const parseAttributes = (attributes) => {
    if (!attributes) return {};
    if (typeof attributes === 'string') {
      // Si es "[object Object]", devolver objeto vacío
      if (attributes === '[object Object]') {
        return {};
      }
      // Si es JSON válido
      try {
        return JSON.parse(attributes);
      } catch {
        return {};
      }
    }
    return attributes;
  };

  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    salePrice: row.sale_price ? parseFloat(row.sale_price) : undefined,
    sku: row.sku,
    images: parseImages(row.images),
    attributes: parseAttributes(row.attributes),
    isActive: row.is_active,
    stockQuantity: row.stock_quantity,
    tags: row.tags || undefined,
    rating: row.rating || 0,
    reviewCount: row.review_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

testController(); 