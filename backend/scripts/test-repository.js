#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

async function testRepository() {
  console.log('🧪 Probando repositorio PostgreSQL directamente...\n');

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

  try {
    // 1. Obtener datos raw de la base de datos
    console.log('📋 1. Obteniendo datos raw de la base de datos...');
    
    const rawQuery = 'SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC LIMIT 3';
    const rawResult = await pool.query(rawQuery);
    
    console.log('✅ Datos raw obtenidos:', rawResult.rows.length, 'productos');
    
    // 2. Probar mapeo de cada producto
    console.log('\n📋 2. Probando mapeo de productos...');
    
    for (let i = 0; i < rawResult.rows.length; i++) {
      const row = rawResult.rows[i];
      console.log(`\n📦 Producto ${i + 1}:`);
      console.log(`   ID: ${row.id}`);
      console.log(`   Nombre: ${row.name}`);
      console.log(`   SKU: ${row.sku}`);
      console.log(`   Precio: ${row.price}`);
      console.log(`   Images: ${row.images ? typeof row.images : 'null'}`);
      console.log(`   Attributes: ${row.attributes ? typeof row.attributes : 'null'}`);
      console.log(`   Tags: ${row.tags ? typeof row.tags : 'null'}`);
      
      // Probar mapeo
      try {
        const mappedProduct = mapToProductEntity(row);
        console.log(`   ✅ Mapeo exitoso: ${mappedProduct.name}`);
      } catch (error) {
        console.log(`   ❌ Error en mapeo: ${error.message}`);
      }
    }

    // 3. Probar consulta con filtros (simulando findAll)
    console.log('\n📋 3. Probando consulta con filtros...');
    
    const filtersQuery = `
      SELECT * FROM products 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    
    const filtersResult = await pool.query(filtersQuery);
    console.log('✅ Consulta con filtros:', filtersResult.rows.length, 'productos');
    
    // 4. Probar mapeo de todos los productos
    console.log('\n📋 4. Probando mapeo de todos los productos...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const row of filtersResult.rows) {
      try {
        const mappedProduct = mapToProductEntity(row);
        successCount++;
      } catch (error) {
        errorCount++;
        console.log(`❌ Error mapeando producto ${row.id}: ${error.message}`);
      }
    }
    
    console.log(`✅ Mapeo completado: ${successCount} exitosos, ${errorCount} errores`);

  } catch (error) {
    console.error('❌ Error en el repositorio:', error.message);
  } finally {
    await pool.end();
  }
}

// Función de mapeo (actualizada del repositorio)
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

testRepository(); 