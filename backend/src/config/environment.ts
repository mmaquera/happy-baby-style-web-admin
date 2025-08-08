import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface EnvironmentConfig {
  // Server Configuration
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  
  // Database Configuration
  databaseUrl: string;
  databaseHost: string;
  databasePort: number;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
  databaseSsl: boolean;
  
  // JWT Configuration
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  
  // OAuth Configuration
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  oauthStateSecret: string;
  sessionSecret: string;
  
  // File Upload Configuration
  maxFileSize: number;
  uploadPath: string;
  
  // Logging Configuration
  logLevel: string;
  logEnableConsole: boolean;
  logEnableFile: boolean;
  logEnableDailyRotate: boolean;
  logDirectory: string;
  logMaxFiles: string;
  logMaxSize: string;
  logFormat: string;
  logIncludeTimestamp: boolean;
  logIncludeTraceId: boolean;
  logIncludeRequestId: boolean;
  logIncludeUserId: boolean;
  logEnableErrorStack: boolean;
  logEnablePerformance: boolean;
  
  // Feature Flags
  enableGraphQLPlayground: boolean;
  enableCors: boolean;
  enableCompression: boolean;
  enableHelmet: boolean;
}

class EnvironmentService {
  private static instance: EnvironmentService;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  public static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  private loadConfiguration(): EnvironmentConfig {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';

    // Database configuration based on environment
    let databaseUrl: string;
    let databaseHost: string;
    let databasePort: number;
    let databaseName: string;
    let databaseUser: string;
    let databasePassword: string;
    let databaseSsl: boolean;

    if (isDevelopment) {
      // Development: Use AWS RDS
      databaseUrl = process.env.DATABASE_URL || 
        'postgresql://postgres:HappyBaby2024!@happy-baby-style-db.cr0ug6u2oje3.us-east-2.rds.amazonaws.com:5432/happy_baby_style_db';
      databaseHost = 'happy-baby-style-db.cr0ug6u2oje3.us-east-2.rds.amazonaws.com';
      databasePort = 5432;
      databaseName = 'happy_baby_style_db';
      databaseUser = 'postgres';
      databasePassword = 'HappyBaby2024!';
      databaseSsl = true;
    } else {
      // Production: Use local PostgreSQL
      databaseUrl = process.env.DATABASE_URL || 
        'postgresql://happybabystyle:happybabystyle123@localhost:5432/happybabystyle?schema=public';
      databaseHost = 'localhost';
      databasePort = 5432;
      databaseName = 'happybabystyle';
      databaseUser = 'happybabystyle';
      databasePassword = 'happybabystyle123';
      databaseSsl = false;
    }

    return {
      // Server Configuration
      port: parseInt(process.env.PORT || '3001'),
      nodeEnv: process.env.NODE_ENV || 'development',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      
      // Database Configuration
      databaseUrl,
      databaseHost,
      databasePort,
      databaseName,
      databaseUser,
      databasePassword,
      databaseSsl,
      
      // JWT Configuration
      jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-production-change-this',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
      jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      
      // OAuth Configuration
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback',
      oauthStateSecret: process.env.OAUTH_STATE_SECRET || 'your-oauth-state-secret-here',
      sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-here',
      
      // File Upload Configuration
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
      uploadPath: process.env.UPLOAD_PATH || './uploads',
      
      // Logging Configuration
      logLevel: process.env.LOG_LEVEL || 'info',
      logEnableConsole: process.env.LOG_ENABLE_CONSOLE !== 'false',
      logEnableFile: process.env.LOG_ENABLE_FILE !== 'false',
      logEnableDailyRotate: process.env.LOG_ENABLE_DAILY_ROTATE !== 'false',
      logDirectory: process.env.LOG_DIRECTORY || './logs',
      logMaxFiles: process.env.LOG_MAX_FILES || '14d',
      logMaxSize: process.env.LOG_MAX_SIZE || '20m',
      logFormat: process.env.LOG_FORMAT || 'json',
      logIncludeTimestamp: process.env.LOG_INCLUDE_TIMESTAMP !== 'false',
      logIncludeTraceId: process.env.LOG_INCLUDE_TRACE_ID !== 'false',
      logIncludeRequestId: process.env.LOG_INCLUDE_REQUEST_ID !== 'false',
      logIncludeUserId: process.env.LOG_INCLUDE_USER_ID !== 'false',
      logEnableErrorStack: process.env.LOG_ENABLE_ERROR_STACK !== 'false',
      logEnablePerformance: process.env.LOG_ENABLE_PERFORMANCE !== 'false',
      
      // Feature Flags
      enableGraphQLPlayground: !isProduction,
      enableCors: true,
      enableCompression: true,
      enableHelmet: true,
    };
  }

  public getConfig(): EnvironmentConfig {
    return this.config;
  }

  public getDatabaseConfig() {
    const { databaseUrl, databaseHost, databasePort, databaseName, databaseUser, databasePassword, databaseSsl } = this.config;
    
    return {
      url: databaseUrl,
      host: databaseHost,
      port: databasePort,
      database: databaseName,
      user: databaseUser,
      password: databasePassword,
      ssl: databaseSsl ? { rejectUnauthorized: false } : false,
    };
  }

  public isDevelopment(): boolean {
    return this.config.nodeEnv === 'development';
  }

  public isProduction(): boolean {
    return this.config.nodeEnv === 'production';
  }

  public isTest(): boolean {
    return this.config.nodeEnv === 'test';
  }

  public getEnvironmentInfo() {
    return {
      environment: this.config.nodeEnv,
      port: this.config.port,
      database: {
        host: this.config.databaseHost,
        port: this.config.databasePort,
        name: this.config.databaseName,
        ssl: this.config.databaseSsl,
      },
      features: {
        graphqlPlayground: this.config.enableGraphQLPlayground,
        cors: this.config.enableCors,
        compression: this.config.enableCompression,
        helmet: this.config.enableHelmet,
      },
    };
  }
}

export const environment = EnvironmentService.getInstance();
export default EnvironmentService; 