import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    exclude: [
      'node_modules',
      '.next',
      'e2e',
      'playwright-report',
      'lib/generated',
      'prisma',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'vitest.config.ts',
        'vitest.setup.ts',
        'playwright.config.ts',
        'e2e/',
        'lib/generated/',
        'prisma/',
      ],
    },
  },
});
