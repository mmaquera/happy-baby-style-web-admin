import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix
  const env = loadEnv(mode, process.cwd(), '');

  // Environment validation
  const requiredEnvVars = ['VITE_GRAPHQL_URL', 'VITE_APP_NAME'];
  const missingVars = requiredEnvVars.filter(varName => !env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing required environment variables: ${missingVars.join(', ')}`);
    
    if (mode === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  // Log environment info
  console.log(`🚀 Building for environment: ${mode}`);
  console.log(`📡 GraphQL URL: ${env.VITE_GRAPHQL_URL}`);
  console.log(`🔧 Debug Mode: ${env.VITE_ENABLE_DEBUG_MODE === 'true' ? 'ON' : 'OFF'}`);

  return {
    plugins: [react()],
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    server: {
      port: parseInt(env.VITE_PORT || '3000'),
      host: true,
      proxy: {
        '/graphql': {
          target: env.VITE_GRAPHQL_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: env.VITE_ENABLE_SOURCE_MAPS === 'true',
      minify: mode === 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            apollo: ['@apollo/client', 'graphql'],
            ui: ['styled-components', 'lucide-react'],
            forms: ['react-hook-form'],
          },
        },
      },
      // Optimize bundle size
      chunkSizeWarningLimit: 1000,
    },
    
    preview: {
      port: parseInt(env.VITE_PORT || '3000'),
      host: true,
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@apollo/client',
        'graphql',
        'styled-components',
        'lucide-react',
        'react-hook-form',
        'react-hot-toast',
      ],
    },
    
    // CSS optimization
    css: {
      devSourcemap: env.VITE_ENABLE_SOURCE_MAPS === 'true',
    },
    
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __ENV_MODE__: JSON.stringify(mode),
      __ENV_DEBUG__: JSON.stringify(env.VITE_ENABLE_DEBUG_MODE === 'true'),
    },
  };
});