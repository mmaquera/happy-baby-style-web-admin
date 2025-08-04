const { Pool } = require('pg');
require('dotenv').config();

async function testPostgresConnection() {
  console.log('🔍 Probando conexión directa a PostgreSQL de Supabase...\n');

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

  console.log('📋 Configuración de conexión:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '✅ Configurado' : '❌ No configurado'}\n`);

  if (!config.password) {
    console.log('❌ Error: SUPABASE_DB_PASSWORD no está configurado en el archivo .env');
    console.log('💡 Para obtener la contraseña:');
    console.log('   1. Ve a tu proyecto Supabase');
    console.log('   2. Settings > Database');
    console.log('   3. Copia la "Database Password"');
    console.log('   4. Agrega SUPABASE_DB_PASSWORD=tu_password al archivo .env\n');
    return;
  }

  const pool = new Pool(config);

  try {
    console.log('🔄 Conectando a PostgreSQL...');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa!\n');

    // Probar consulta simple
    console.log('📊 Probando consulta...');
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Consulta exitosa!');
    console.log(`   Hora actual: ${result.rows[0].current_time}`);
    console.log(`   Versión PostgreSQL: ${result.rows[0].postgres_version.split(' ')[0]}\n`);

    // Verificar tablas
    console.log('📋 Verificando tablas...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('✅ Tablas encontradas:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    client.release();
    console.log('\n🎉 ¡Conexión directa a PostgreSQL funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verifica que SUPABASE_DB_PASSWORD esté correcto');
    console.log('   2. Asegúrate de que tu IP esté en la whitelist de Supabase');
    console.log('   3. Verifica que el proyecto Supabase esté activo');
  } finally {
    await pool.end();
  }
}

testPostgresConnection(); 