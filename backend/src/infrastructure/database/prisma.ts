import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

class PrismaService {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      if (process.env.NODE_ENV === 'production') {
        PrismaService.instance = new PrismaClient({
          log: ['error', 'warn'],
        });
      } else {
        // In development, use a global instance to prevent multiple connections
        if (!global.__prisma) {
          global.__prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
          });
        }
        PrismaService.instance = global.__prisma;
      }

      // Handle graceful shutdown
      process.on('beforeExit', async () => {
        await PrismaService.instance.$disconnect();
      });

      process.on('SIGINT', async () => {
        await PrismaService.instance.$disconnect();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await PrismaService.instance.$disconnect();
        process.exit(0);
      });
    }

    return PrismaService.instance;
  }

  public static async connect(): Promise<void> {
    const client = PrismaService.getInstance();
    await client.$connect();
    console.log('✅ Database connected successfully');
  }

  public static async disconnect(): Promise<void> {
    const client = PrismaService.getInstance();
    await client.$disconnect();
    console.log('✅ Database disconnected successfully');
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const client = PrismaService.getInstance();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }
}

export const prisma = PrismaService.getInstance();
export default PrismaService; 