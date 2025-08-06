import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class PostgresConfig {
  private static instance: PostgresConfig;
  private pool: Pool;

  private constructor() {
    // Parse DATABASE_URL if available, otherwise use individual env vars
    let config: PoolConfig;
    
    if (process.env.DATABASE_URL) {
      // Use DATABASE_URL (recommended for Supabase)
      config = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };
    } else {
      // Fallback to individual environment variables
      config = {
        host: process.env.SUPABASE_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
        port: parseInt(process.env.SUPABASE_DB_PORT || '6543'),
        database: process.env.SUPABASE_DB_NAME || 'postgres',
        user: process.env.SUPABASE_DB_USER || 'postgres.uumwjhoqkiiyxuperrws',
        password: process.env.SUPABASE_DB_PASSWORD,
        ssl: {
          rejectUnauthorized: false
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };
    }

    this.pool = new Pool(config);

    // Manejo de errores del pool
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
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
}

// Función helper para obtener la conexión
export const getPostgresConnection = () => PostgresConfig.getInstance(); 