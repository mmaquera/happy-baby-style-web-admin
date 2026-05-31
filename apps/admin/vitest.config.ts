import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, '.'),
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
      '@happy-baby/infrastructure-graphql': path.resolve(
        __dirname,
        '../../libs/infrastructure/graphql/src/index.ts'
      ),
      '@happy-baby/infrastructure-storage': path.resolve(
        __dirname,
        '../../libs/infrastructure/storage/src/index.ts'
      ),
      '@happy-baby/infrastructure-monitoring': path.resolve(
        __dirname,
        '../../libs/infrastructure/monitoring/src/index.ts'
      ),
      '@happy-baby/shared-utils': path.resolve(
        __dirname,
        '../../libs/shared/utils/src/index.ts'
      ),
      '@happy-baby/shared-ui': path.resolve(
        __dirname,
        '../../libs/shared/ui/src/index.ts'
      ),
      '@happy-baby/shared-stores': path.resolve(
        __dirname,
        '../../libs/shared/stores/src/index.ts'
      ),
      '@happy-baby/feature-products': path.resolve(
        __dirname,
        '../../libs/features/products/src/index.ts'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, './src/setupTests.ts')],
    include: [
      'src/**/__tests__/**/*.{test,spec}.{ts,tsx}',
      'src/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['node_modules', 'dist'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/__mocks__/**',
        'src/**/index.{ts,tsx}',
        'src/main.tsx',
        'src/App.tsx',
      ],
      thresholds: {
        branches: 68,
        functions: 43,
        lines: 14,
        statements: 14,
      },
    },
  },
});
