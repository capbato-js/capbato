import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/api',
  
  // Configure for Node.js environment  
  define: {
    global: 'globalThis',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@nx-starter/domain': path.resolve(
        __dirname,
        '../../libs/domain/src/index.ts'
      ),
      '@nx-starter/application-shared': path.resolve(
        __dirname,
        '../../libs/application-shared/src/index.ts'
      ),
      '@nx-starter/application-api': path.resolve(
        __dirname,
        '../../libs/application-api/src/index.ts'
      ),
      '@nx-starter/utils-core': path.resolve(
        __dirname,
        '../../libs/utils-core/src/index.ts'
      ),
    },
  },

  // Build configuration for development and production
  build: {
    outDir: '../../dist/apps/api',
    emptyOutDir: true,
    target: 'node18',
    // Configure for Node.js
    lib: {
      entry: './src/main.ts',
      name: 'api',
      formats: ['cjs'],
      fileName: 'main',
    },
    rollupOptions: {
      external: [
        // External Node.js modules that shouldn't be bundled
        'express',
        'cors',
        'dotenv',
        'reflect-metadata',
        'class-transformer',
        'class-validator',
        'routing-controllers',
        'tsyringe',
        'typeorm',
        'better-sqlite3',
        'sqlite3',
        'mysql2',
        'pg',
        'mongoose',
        'bcrypt',
        'jsonwebtoken',
        'uuid',
        /^node:.*/,
      ],
    },
    // Keep external dependencies external
    ssr: true,
  },

  // Enable source maps for better debugging
  esbuild: {
    target: 'node18',
    format: 'cjs',
  },

  // Optimize dependencies
  optimizeDeps: {
    // Don't pre-bundle these Node.js specific packages
    exclude: [
      'express',
      'cors',
      'dotenv',
      'reflect-metadata',
      'class-transformer', 
      'class-validator',
      'routing-controllers',
      'tsyringe',
      'typeorm',
      'better-sqlite3',
      'sqlite3',
      'mysql2',
      'pg',
      'mongoose',
      'bcrypt',
      'jsonwebtoken',
      'uuid',
    ],
  },
});