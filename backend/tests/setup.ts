// Configuración global de Jest

// Configurar variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.SUPABASE_DB_HOST = 'test-host';
process.env.SUPABASE_DB_PORT = '5432';
process.env.SUPABASE_DB_NAME = 'test-db';
process.env.SUPABASE_DB_USER = 'test-user';
process.env.SUPABASE_DB_PASSWORD = 'test-password';

// Configurar timeouts
if (typeof jest !== 'undefined') {
  jest.setTimeout(10000);
} 