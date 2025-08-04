const { Pool } = require('pg');
require('dotenv').config();

async function testSimpleConnection() {
  console.log('🔍 Prueba simple de conexión a PostgreSQL...\n');

  const config = {
    host: process.env.SUPABASE_DB_HOST || 'db.uumwjhoqkiiyxuperrws.supabase.co',
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
    database: process.env.SUPABASE_DB_NAME || 'postgres',
    user: process.env.SUPABASE_DB_USER || 'postgres.uumwjhoqkiiyxuperrws',
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000, // 5 segundos de timeout
    query_timeout: 5000
  };

  console.log('📋 Configuración:');
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

  console.log('🔄 Intentando conectar...');
  
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

    client.release();
    console.log('\n🎉 ¡Conexión directa a PostgreSQL funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n🔍 Detalles del error:');
    console.log(`   Código: ${error.code}`);
    console.log(`   Detalle: ${error.detail}`);
    console.log(`   Hint: ${error.hint}`);
    
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verifica que SUPABASE_DB_PASSWORD esté correcto');
    console.log('   2. Asegúrate de que tu IP esté en la whitelist de Supabase');
    console.log('   3. Verifica que el proyecto Supabase esté activo');
    console.log('   4. Prueba con una conexión VPN si estás en una red corporativa');
    console.log('   5. Verifica que el puerto 5432 no esté bloqueado');
  } finally {
    await pool.end();
  }
}

testSimpleConnection(); 