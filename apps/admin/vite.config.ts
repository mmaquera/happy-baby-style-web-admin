import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
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
    console.warn(
      `⚠️  Missing required environment variables: ${missingVars.join(', ')}`
    );

    if (mode === 'production') {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  }

  // Log environment info
  console.log(`🚀 Building for environment: ${mode}`);
  console.log(`📡 GraphQL URL: ${env.VITE_GRAPHQL_URL}`);
  console.log(
    `🔧 Debug Mode: ${env.VITE_ENABLE_DEBUG_MODE === 'true' ? 'ON' : 'OFF'}`
  );

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@happy-baby/domain-product': path.resolve(
          __dirname,
          '../../libs/domain/product/src/index.ts'
        ),
        '@happy-baby/domain-order': path.resolve(
          __dirname,
          '../../libs/domain/order/src/index.ts'
        ),
        '@happy-baby/domain-user': path.resolve(
          __dirname,
          '../../libs/domain/user/src/index.ts'
        ),
        '@happy-baby/domain-category': path.resolve(
          __dirname,
          '../../libs/domain/category/src/index.ts'
        ),
        '@happy-baby/domain-shared': path.resolve(
          __dirname,
          '../../libs/domain/shared/src/index.ts'
        ),
        '@happy-baby/application-product': path.resolve(
          __dirname,
          '../../libs/application/product/src/index.ts'
        ),
        '@happy-baby/application-order': path.resolve(
          __dirname,
          '../../libs/application/order/src/index.ts'
        ),
        '@happy-baby/application-user': path.resolve(
          __dirname,
          '../../libs/application/user/src/index.ts'
        ),
        '@happy-baby/application-category': path.resolve(
          __dirname,
          '../../libs/application/category/src/index.ts'
        ),
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
      // Never emit source maps for staging/production bundles (avoids shipping
      // readable source to the browser). Switch to 'hidden' once Sentry uploads them.
      sourcemap:
        mode !== 'production' &&
        mode !== 'staging' &&
        env.VITE_ENABLE_SOURCE_MAPS === 'true',
      minify: mode === 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            apollo: ['@apollo/client', 'graphql'],
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
