// Environment Configuration - Following SOLID principles and Clean Architecture
// Single Responsibility: Manages environment configuration only
// Open/Closed: Extensible for new environment variables
// Liskov Substitution: Consistent configuration behavior
// Interface Segregation: Specific interfaces for different config concerns
// Dependency Inversion: Depends on environment abstractions

// Environment interface following Interface Segregation Principle
export interface IEnvironmentConfig {
  // GraphQL Configuration
  graphqlUrl: string;
  graphqlPlaygroundEnabled: boolean;
  
  // Application Configuration
  appName: string;
  mode: string;
  
  // Feature Flags
  enableDebugMode: boolean;
  enablePerformanceMonitoring: boolean;
  enableSourceMaps: boolean;
  enableHotReload: boolean;
  
  // Authentication Configuration
  authTokenExpiry: number;
  refreshTokenExpiry: number;
  
  // Logging Configuration
  logLevel: string;
}

// Development environment configuration
class DevelopmentConfig implements IEnvironmentConfig {
  get graphqlUrl(): string {
    return import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3001/graphql';
  }

  get graphqlPlaygroundEnabled(): boolean {
    return import.meta.env.VITE_GRAPHQL_PLAYGROUND_ENABLED === 'true';
  }

  get appName(): string {
    return import.meta.env.VITE_APP_NAME || 'Happy Baby Style Admin';
  }

  get mode(): string {
    return import.meta.env.VITE_MODE || 'development';
  }

  get enableDebugMode(): boolean {
    return import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';
  }

  get enablePerformanceMonitoring(): boolean {
    return import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
  }

  get enableSourceMaps(): boolean {
    return import.meta.env.VITE_ENABLE_SOURCE_MAPS === 'true';
  }

  get enableHotReload(): boolean {
    return import.meta.env.VITE_ENABLE_HOT_RELOAD === 'true';
  }

  get authTokenExpiry(): number {
    return parseInt(import.meta.env.VITE_AUTH_TOKEN_EXPIRY || '3600000');
  }

  get refreshTokenExpiry(): number {
    return parseInt(import.meta.env.VITE_REFRESH_TOKEN_EXPIRY || '604800000');
  }

  get logLevel(): string {
    return import.meta.env.VITE_LOG_LEVEL || 'debug';
  }
}

// Production environment configuration
class ProductionConfig implements IEnvironmentConfig {
  get graphqlUrl(): string {
    return import.meta.env.VITE_GRAPHQL_URL || 'https://api.happybabystyle.com/graphql';
  }

  get graphqlPlaygroundEnabled(): boolean {
    return import.meta.env.VITE_GRAPHQL_PLAYGROUND_ENABLED === 'true';
  }

  get appName(): string {
    return import.meta.env.VITE_APP_NAME || 'Happy Baby Style Admin';
  }

  get mode(): string {
    return import.meta.env.VITE_MODE || 'production';
  }

  get enableDebugMode(): boolean {
    return import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';
  }

  get enablePerformanceMonitoring(): boolean {
    return import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
  }

  get enableSourceMaps(): boolean {
    return import.meta.env.VITE_ENABLE_SOURCE_MAPS === 'true';
  }

  get enableHotReload(): boolean {
    return import.meta.env.VITE_ENABLE_HOT_RELOAD === 'true';
  }

  get authTokenExpiry(): number {
    return parseInt(import.meta.env.VITE_AUTH_TOKEN_EXPIRY || '1800000');
  }

  get refreshTokenExpiry(): number {
    return parseInt(import.meta.env.VITE_REFRESH_TOKEN_EXPIRY || '2592000000');
  }

  get logLevel(): string {
    return import.meta.env.VITE_LOG_LEVEL || 'error';
  }
}

// Staging environment configuration
class StagingConfig implements IEnvironmentConfig {
  get graphqlUrl(): string {
    return import.meta.env.VITE_GRAPHQL_URL || 'https://staging-api.happybabystyle.com/graphql';
  }

  get graphqlPlaygroundEnabled(): boolean {
    return import.meta.env.VITE_GRAPHQL_PLAYGROUND_ENABLED === 'true';
  }

  get appName(): string {
    return import.meta.env.VITE_APP_NAME || 'Happy Baby Style Admin (Staging)';
  }

  get mode(): string {
    return import.meta.env.VITE_MODE || 'staging';
  }

  get enableDebugMode(): boolean {
    return import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';
  }

  get enablePerformanceMonitoring(): boolean {
    return import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
  }

  get enableSourceMaps(): boolean {
    return import.meta.env.VITE_ENABLE_SOURCE_MAPS === 'true';
  }

  get enableHotReload(): boolean {
    return import.meta.env.VITE_ENABLE_HOT_RELOAD === 'true';
  }

  get authTokenExpiry(): number {
    return parseInt(import.meta.env.VITE_AUTH_TOKEN_EXPIRY || '3600000');
  }

  get refreshTokenExpiry(): number {
    return parseInt(import.meta.env.VITE_REFRESH_TOKEN_EXPIRY || '604800000');
  }

  get logLevel(): string {
    return import.meta.env.VITE_LOG_LEVEL || 'warn';
  }
}

// Test environment configuration
class TestConfig implements IEnvironmentConfig {
  get graphqlUrl(): string {
    return 'http://localhost:3001/graphql';
  }

  get graphqlPlaygroundEnabled(): boolean {
    return false;
  }

  get appName(): string {
    return 'Happy Baby Style Admin (Test)';
  }

  get mode(): string {
    return 'test';
  }

  get enableDebugMode(): boolean {
    return false;
  }

  get enablePerformanceMonitoring(): boolean {
    return false;
  }

  get enableSourceMaps(): boolean {
    return false;
  }

  get enableHotReload(): boolean {
    return false;
  }

  get authTokenExpiry(): number {
    return 300000; // 5 minutes for tests
  }

  get refreshTokenExpiry(): number {
    return 600000; // 10 minutes for tests
  }

  get logLevel(): string {
    return 'error';
  }
}

// Environment factory following Factory Pattern
export class EnvironmentFactory {
  static createConfig(): IEnvironmentConfig {
    const mode = import.meta.env.VITE_MODE || 'development';
    
    switch (mode) {
      case 'production':
        return new ProductionConfig();
      case 'staging':
        return new StagingConfig();
      case 'test':
        return new TestConfig();
      case 'development':
      default:
        return new DevelopmentConfig();
    }
  }
}

// Default export for convenience
export const environment = EnvironmentFactory.createConfig();

// Utility functions for common environment checks
export const isDevelopment = (): boolean => environment.mode === 'development';
export const isProduction = (): boolean => environment.mode === 'production';
export const isStaging = (): boolean => environment.mode === 'staging';
export const isTest = (): boolean => environment.mode === 'test';

// Validation function to ensure required environment variables are set
export const validateEnvironment = (): void => {
  const requiredVars = [
    'VITE_GRAPHQL_URL',
    'VITE_APP_NAME',
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.warn('⚠️  Missing environment variables:', missingVars);
    
    if (isProduction()) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
};

// Initialize environment validation
if (typeof window !== 'undefined') {
  validateEnvironment();
}
