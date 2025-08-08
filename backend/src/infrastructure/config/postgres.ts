import { Pool, PoolConfig } from 'pg';
import { environment } from '../../config/environment';

export class PostgresConfig {
  private static instance: PostgresConfig;
  private pool: Pool;

  private constructor() {
    const dbConfig = environment.getDatabaseConfig();
    
    const config: PoolConfig = {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: dbConfig.ssl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(config);

    // Manejo de errores del pool
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    // Log de configuración
    console.log('📊 PostgreSQL Configuration:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      ssl: !!dbConfig.ssl,
      environment: environment.getConfig().nodeEnv,
    });
  }

  public static getInstance(): PostgresConfig {
    if (!PostgresConfig.instance) {
      PostgresConfig.instance = new PostgresConfig();
    }
    return PostgresConfig.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('PostgreSQL health check failed:', error);
      return false;
    }
  }
}

// Función helper para obtener la conexión
export const getPostgresConnection = () => PostgresConfig.getInstance(); 