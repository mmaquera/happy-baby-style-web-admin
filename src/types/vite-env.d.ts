/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Core Configuration
  readonly VITE_MODE: string
  readonly VITE_GRAPHQL_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_PORT: string
  
  // Feature Flags
  readonly VITE_GRAPHQL_PLAYGROUND_ENABLED: string
  readonly VITE_ENABLE_DEBUG_MODE: string
  readonly VITE_ENABLE_SOURCE_MAPS: string
  readonly VITE_ENABLE_HOT_RELOAD: string
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string
  
  // Logging and Monitoring
  readonly VITE_LOG_LEVEL: string
  
  // Authentication Configuration
  readonly VITE_AUTH_TOKEN_EXPIRY: string
  readonly VITE_REFRESH_TOKEN_EXPIRY: string
  
  // Legacy Support (deprecated)
  readonly VITE_NODE_ENV: string
  
  // Supabase Configuration (optional)
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
