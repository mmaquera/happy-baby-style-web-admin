import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class PostgresConfig {
  private static instance: PostgresConfig;
  private pool: Pool;

  private constructor() {
    const config: PoolConfig = {
      // Transaction Pooler Configuration (IPv4 compatible)
      host: process.env.SUPABASE_DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
      port: parseInt(process.env.SUPABASE_DB_PORT || '6543'),
      database: process.env.SUPABASE_DB_NAME || 'postgres',
      user: process.env.SUPABASE_DB_USER || 'postgres.uumwjhoqkiiyxuperrws',
      password: process.env.SUPABASE_DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20, // máximo número de conexiones en el pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

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