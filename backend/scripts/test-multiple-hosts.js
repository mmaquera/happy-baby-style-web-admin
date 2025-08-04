const { Pool } = require('pg');
require('dotenv').config();

async function testConnection(config, name) {
  console.log(`\n🔍 Probando: ${name}`);
  console.log(`   Host: ${config.host}`);
  console.log(`   User: ${config.user}`);
  
  const pool = new Pool({
    ...config,
    connectionTimeoutMillis: 3000,
    query_timeout: 3000
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`✅ ${name} - Conexión exitosa!`);
    console.log(`   Hora: ${result.rows[0].current_time}`);
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    await pool.end();
    return false;
  }
}

async function testMultipleHosts() {
  console.log('🔍 Probando diferentes configuraciones de conexión...\n');

  const baseConfig = {
    port: 5432,
    database: 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  };

  const configs = [
    {
      ...baseConfig,
      host: 'db.uumwjhoqkiiyxuperrws.supabase.co',
      user: 'postgres.uumwjhoqkiiyxuperrws'
    },
    {
      ...baseConfig,
      host: 'uumwjhoqkiiyxuperrws.supabase.co',
      user: 'postgres.uumwjhoqkiiyxuperrws'
    },
    {
      ...baseConfig,
      host: 'db.supabase.co',
      user: 'postgres.uumwjhoqkiiyxuperrws'
    },
    {
      ...baseConfig,
      host: '2600:1f18:2e13:9d16:68e2:6e69:8b69:1e73',
      user: 'postgres'
    }
  ];

  const names = [
    'Host con db. prefix',
    'Host sin db. prefix', 
    'Host genérico db.supabase.co',
    'IP directa IPv6'
  ];

  let success = false;
  
  for (let i = 0; i < configs.length; i++) {
    const result = await testConnection(configs[i], names[i]);
    if (result) {
      success = true;
      console.log(`\n🎉 ¡Configuración exitosa encontrada: ${names[i]}!`);
      console.log('📋 Configuración que funciona:');
      console.log(`   Host: ${configs[i].host}`);
      console.log(`   User: ${configs[i].user}`);
      console.log(`   Port: ${configs[i].port}`);
      console.log(`   Database: ${configs[i].database}`);
      break;
    }
  }

  if (!success) {
    console.log('\n❌ Ninguna configuración funcionó.');
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verifica la contraseña en el dashboard de Supabase');
    console.log('   2. Asegúrate de que tu IP esté en la whitelist');
    console.log('   3. Verifica que el proyecto esté activo');
    console.log('   4. Contacta al soporte de Supabase');
  }
}

testMultipleHosts(); 