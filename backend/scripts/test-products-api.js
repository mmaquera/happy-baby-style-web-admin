#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

async function testProductsAPI() {
  console.log('🧪 Probando API de productos específicamente...\n');

  // 1. Probar conexión PostgreSQL directamente
  console.log('📋 1. Probando conexión PostgreSQL...');
  
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
    // Probar consulta simple
    const simpleQuery = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log('✅ Consulta simple:', simpleQuery.rows[0]);

    // Probar consulta con filtros (simulando GetProductsUseCase)
    console.log('\n📋 2. Probando consulta con filtros...');
    
    const filtersQuery = `
      SELECT * FROM products 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    
    const filtersResult = await pool.query(filtersQuery);
    console.log('✅ Consulta con filtros:', {
      count: filtersResult.rows.length,
      firstProduct: filtersResult.rows[0] ? {
        id: filtersResult.rows[0].id,
        name: filtersResult.rows[0].name,
        sku: filtersResult.rows[0].sku
      } : null
    });

    // Probar consulta con búsqueda
    console.log('\n📋 3. Probando consulta con búsqueda...');
    
    const searchQuery = `
      SELECT * FROM products 
      WHERE (name ILIKE $1 OR description ILIKE $1 OR sku ILIKE $1)
      AND is_active = true 
      ORDER BY created_at DESC
    `;
    
    const searchResult = await pool.query(searchQuery, ['%bodysuit%']);
    console.log('✅ Consulta con búsqueda:', {
      count: searchResult.rows.length,
      searchTerm: 'bodysuit'
    });

    // Probar consulta con paginación
    console.log('\n📋 4. Probando consulta con paginación...');
    
    const paginationQuery = `
      SELECT * FROM products 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const paginationResult = await pool.query(paginationQuery, [10, 0]);
    console.log('✅ Consulta con paginación:', {
      count: paginationResult.rows.length,
      limit: 10,
      offset: 0
    });

    console.log('\n🎉 ¡Todas las consultas PostgreSQL funcionan correctamente!');
    console.log('\n💡 El problema debe estar en el código del repositorio o en la inicialización del servidor.');

  } catch (error) {
    console.error('❌ Error en consultas PostgreSQL:', error.message);
    console.log('\n🔍 Detalles del error:');
    console.log(`   Código: ${error.code}`);
    console.log(`   Detalle: ${error.detail}`);
    console.log(`   Hint: ${error.hint}`);
  } finally {
    await pool.end();
  }
}

testProductsAPI(); 