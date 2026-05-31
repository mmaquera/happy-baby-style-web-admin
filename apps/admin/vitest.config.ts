import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// Workspace root is two levels up from apps/admin/
const workspaceRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react()],
  // Root at workspace level so V8 coverage can instrument libs/ files
  root: workspaceRoot,
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
      '@happy-baby/shared-hooks': path.resolve(
        __dirname,
        '../../libs/shared/hooks/src/index.ts'
      ),
      '@happy-baby/feature-products': path.resolve(
        __dirname,
        '../../libs/features/products/src/index.ts'
      ),
      '@happy-baby/feature-categories': path.resolve(
        __dirname,
        '../../libs/features/categories/src/index.ts'
      ),
      '@happy-baby/feature-users': path.resolve(
        __dirname,
        '../../libs/features/users/src/index.ts'
      ),
      '@happy-baby/feature-orders': path.resolve(
        __dirname,
        '../../libs/features/orders/src/index.ts'
      ),
      '@happy-baby/feature-auth': path.resolve(
        __dirname,
        '../../libs/features/auth/src/index.ts'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, './src/setupTests.ts')],
    // Paths are now relative to workspaceRoot
    include: [
      'apps/admin/src/**/__tests__/**/*.{test,spec}.{ts,tsx}',
      'apps/admin/src/**/*.{test,spec}.{ts,tsx}',
      'libs/**/__tests__/**/*.{test,spec}.{ts,tsx}',
      'libs/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['node_modules', 'dist'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json-summary'],
      reportsDirectory: path.resolve(__dirname, 'coverage'),
      include: ['apps/admin/src/**/*.{ts,tsx}', 'libs/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/*.d.ts',
        '**/*.stories.{ts,tsx}',
        '**/index.{ts,tsx}',
        '**/generated/**',
        '**/main.tsx',
        '**/App.tsx',
        '**/node_modules/**',
        '**/*.config.{ts,js}',
        '**/setupTests.ts',
      ],
      thresholds: {
        branches: 76,
        functions: 40,
        lines: 24,
        statements: 24,
      },
    },
  },
});
