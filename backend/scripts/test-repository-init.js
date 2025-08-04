#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

async function testRepositoryInit() {
  console.log('🧪 Probando inicialización del repositorio...\n');

  try {
    // 1. Probar PostgresConfig
    console.log('📋 1. Probando PostgresConfig...');
    
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

    console.log('✅ Configuración:', {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password ? '✅ Configurado' : '❌ No configurado'
    });

    // 2. Probar conexión
    console.log('\n📋 2. Probando conexión...');
    
    const pool = new Pool(config);
    
    try {
      const result = await pool.query('SELECT NOW() as current_time');
      console.log('✅ Conexión exitosa:', result.rows[0].current_time);
    } catch (error) {
      console.error('❌ Error de conexión:', error.message);
      return;
    }

    // 3. Probar consulta simple de productos
    console.log('\n📋 3. Probando consulta simple de productos...');
    
    try {
      const countResult = await pool.query('SELECT COUNT(*) as count FROM products');
      console.log('✅ Conteo de productos:', countResult.rows[0].count);
    } catch (error) {
      console.error('❌ Error en consulta de productos:', error.message);
      return;
    }

    // 4. Probar consulta con filtros (simulando findAll)
    console.log('\n📋 4. Probando consulta con filtros...');
    
    try {
      const filtersQuery = `
        SELECT * FROM products 
        WHERE is_active = true 
        ORDER BY created_at DESC 
        LIMIT 5
      `;
      
      const filtersResult = await pool.query(filtersQuery);
      console.log('✅ Consulta con filtros exitosa:', filtersResult.rows.length, 'productos');
      
      if (filtersResult.rows.length > 0) {
        console.log('📦 Primer producto:', {
          id: filtersResult.rows[0].id,
          name: filtersResult.rows[0].name,
          sku: filtersResult.rows[0].sku
        });
      }
    } catch (error) {
      console.error('❌ Error en consulta con filtros:', error.message);
      return;
    }

    // 5. Probar mapeo de productos
    console.log('\n📋 5. Probando mapeo de productos...');
    
    try {
      const productsQuery = 'SELECT * FROM products WHERE is_active = true LIMIT 3';
      const productsResult = await pool.query(productsQuery);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const row of productsResult.rows) {
        try {
          const mappedProduct = mapToProductEntity(row);
          successCount++;
          console.log(`✅ Producto mapeado: ${mappedProduct.name}`);
        } catch (error) {
          errorCount++;
          console.log(`❌ Error mapeando producto ${row.id}: ${error.message}`);
        }
      }
      
      console.log(`📊 Mapeo completado: ${successCount} exitosos, ${errorCount} errores`);
      
    } catch (error) {
      console.error('❌ Error en mapeo:', error.message);
    }

    await pool.end();
    console.log('\n🎉 ¡Todas las pruebas completadas!');

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

testRepositoryInit(); 