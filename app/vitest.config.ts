import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tests': resolve(__dirname, 'tests'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup/setup.ts'],
    css: false,
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    isolate: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/types.ts',
        'src/**/index.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/**/route.ts',
        'src/app/**/layout.tsx',
        'src/app/**/loading.tsx',
        'src/app/**/error.tsx',
        'src/app/**/not-found.tsx',
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 75,
        functions: 80,
      },
      skipFull: false,
    },
    reporters: ['default', ['html', { open: false }], ['junit', { outputFile: './coverage/junit.xml' }]],
    outputFile: {
      junit: './coverage/junit.xml',
      html: './coverage/html',
    },
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.json',
    },
    sequence: {
      hooks: 'list',
      setupFiles: 'list',
    },
  },
});
