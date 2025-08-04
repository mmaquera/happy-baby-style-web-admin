require('dotenv').config();

console.log('🔍 Información de Conexión a Supabase\n');

console.log('📋 Configuración Actual:');
console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL || 'No configurado'}`);
console.log(`   SUPABASE_DB_HOST: ${process.env.SUPABASE_DB_HOST || 'No configurado'}`);
console.log(`   SUPABASE_DB_PORT: ${process.env.SUPABASE_DB_PORT || 'No configurado'}`);
console.log(`   SUPABASE_DB_NAME: ${process.env.SUPABASE_DB_NAME || 'No configurado'}`);
console.log(`   SUPABASE_DB_USER: ${process.env.SUPABASE_DB_USER || 'No configurado'}`);
console.log(`   SUPABASE_DB_PASSWORD: ${process.env.SUPABASE_DB_PASSWORD ? '✅ Configurado' : '❌ No configurado'}\n`);

console.log('💡 Para obtener la información correcta de conexión:');
console.log('   1. Ve a: https://supabase.com/dashboard');
console.log('   2. Selecciona tu proyecto');
console.log('   3. Ve a Settings > Database');
console.log('   4. En la sección "Connection info" encontrarás:');
console.log('      - Host');
console.log('      - Database name');
console.log('      - Port');
console.log('      - User');
console.log('      - Password\n');

console.log('🔧 Configuración recomendada para .env:');
console.log('   # Supabase Configuration');
console.log('   SUPABASE_URL=https://uumwjhoqkiiyxuperrws.supabase.co');
console.log('   SUPABASE_ANON_KEY=tu_anon_key_aqui');
console.log('   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui');
console.log('');
console.log('   # PostgreSQL Direct Connection');
console.log('   SUPABASE_DB_HOST=db.uumwjhoqkiiyxuperrws.supabase.co');
console.log('   SUPABASE_DB_PORT=5432');
console.log('   SUPABASE_DB_NAME=postgres');
console.log('   SUPABASE_DB_USER=postgres.uumwjhoqkiiyxuperrws');
console.log('   SUPABASE_DB_PASSWORD=tu_password_aqui\n');

console.log('⚠️  Nota: El host de la base de datos puede ser diferente.');
console.log('   Verifica en el dashboard de Supabase la configuración exacta.'); 