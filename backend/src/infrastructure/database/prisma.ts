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
        // En desarrollo, usar global para evitar múltiples conexiones con hot reload
        if (!global.__prisma) {
          global.__prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
          });
        }
        PrismaService.instance = global.__prisma;
      }

      // Manejo de errores de desconexión
      process.on('beforeExit', async () => {
        await PrismaService.instance.$disconnect();
      });

      process.on('SIGINT', async () => {
        await PrismaService.instance.$disconnect();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await PrismaService.instance.$disconnect();
      });
    }

    return PrismaService.instance;
  }

  public static async connect(): Promise<void> {
    const client = PrismaService.getInstance();
    await client.$connect();
  }

  public static async disconnect(): Promise<void> {
    const client = PrismaService.getInstance();
    await client.$disconnect();
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      const client = PrismaService.getInstance();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Prisma health check failed:', error);
      return false;
    }
  }
}

// Singleton export
export const prisma = PrismaService.getInstance();
export default PrismaService;