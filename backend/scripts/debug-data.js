#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

async function debugData() {
  console.log('🔍 Debuggeando datos de la base de datos...\n');

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
    const query = 'SELECT id, name, images, attributes, tags FROM products LIMIT 3';
    const result = await pool.query(query);
    
    console.log('📋 Datos de productos:');
    
    result.rows.forEach((row, index) => {
      console.log(`\n📦 Producto ${index + 1}: ${row.name}`);
      console.log(`   ID: ${row.id}`);
      console.log(`   Images: "${row.images}"`);
      console.log(`   Attributes: "${row.attributes}"`);
      console.log(`   Tags: "${row.tags}"`);
      
      // Intentar parsear
      console.log('\n   🔍 Intentando parsear:');
      
      try {
        if (row.images) {
          const parsedImages = JSON.parse(row.images);
          console.log(`   ✅ Images parseado:`, parsedImages);
        } else {
          console.log(`   ⚠️  Images es null`);
        }
      } catch (error) {
        console.log(`   ❌ Error parseando images: ${error.message}`);
      }
      
      try {
        if (row.attributes) {
          const parsedAttributes = JSON.parse(row.attributes);
          console.log(`   ✅ Attributes parseado:`, parsedAttributes);
        } else {
          console.log(`   ⚠️  Attributes es null`);
        }
      } catch (error) {
        console.log(`   ❌ Error parseando attributes: ${error.message}`);
      }
      
      try {
        if (row.tags) {
          console.log(`   ✅ Tags (array):`, row.tags);
        } else {
          console.log(`   ⚠️  Tags es null`);
        }
      } catch (error) {
        console.log(`   ❌ Error con tags: ${error.message}`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

debugData(); 