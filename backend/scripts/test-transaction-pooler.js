const { Pool } = require('pg');
require('dotenv').config();

async function testTransactionPooler() {
  console.log('🔍 Probando conexión con Transaction Pooler de Supabase...\n');

  const config = {
    host: process.env.SUPABASE_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
    port: parseInt(process.env.SUPABASE_DB_PORT || '6543'),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER || 'postgres.uumwjhoqkiiyxuperrws',
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000,
    query_timeout: 5000
  };

  console.log('📋 Configuración del Transaction Pooler:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '✅ Configurado' : '❌ No configurado'}`);
  console.log(`   SSL: ${JSON.stringify(config.ssl)}`);
  console.log(`   Timeout: ${config.connectionTimeoutMillis}ms\n`);

  if (!config.password) {
    console.log('❌ Error: SUPABASE_DB_PASSWORD no está configurado');
    return;
  }

  console.log('🔄 Conectando al Transaction Pooler...');
  
  const pool = new Pool(config);

  try {
    console.log('⏳ Conectando...');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa!\n');

    console.log('📊 Probando consulta simple...');
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Consulta exitosa!');
    console.log(`   Hora del servidor: ${result.rows[0].current_time}\n`);

    console.log('📋 Verificando tablas...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('✅ Tablas encontradas:');
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  No se encontraron tablas (puede ser normal si es una BD nueva)');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }

    console.log('\n🔍 Probando transacciones...');
    await client.query('BEGIN');
    const testResult = await client.query('SELECT 1 as test_value');
    await client.query('COMMIT');
    console.log('✅ Transacciones funcionando correctamente!');

    client.release();
    console.log('\n🎉 ¡Transaction Pooler funcionando correctamente!');
    console.log('\n💡 Ventajas del Transaction Pooler:');
    console.log('   - ✅ Compatible con IPv4');
    console.log('   - ✅ Ideal para aplicaciones serverless');
    console.log('   - ✅ Conexiones pre-calentadas');
    console.log('   - ✅ Manejo automático de conexiones');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n🔍 Detalles del error:');
    console.log(`   Código: ${error.code}`);
    console.log(`   Detalle: ${error.detail}`);
    console.log(`   Hint: ${error.hint}`);
    
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verifica que SUPABASE_DB_PASSWORD esté correcto');
    console.log('   2. Asegúrate de que el proyecto Supabase esté activo');
    console.log('   3. Verifica que el Transaction Pooler esté habilitado');
    console.log('   4. Contacta al soporte de Supabase si persiste el problema');
  } finally {
    await pool.end();
  }
}

testTransactionPooler(); 