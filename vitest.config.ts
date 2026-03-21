/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      // Keep app build and tests aligned (Tailwind, React, etc.)
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['src/**/*.{test,spec}.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'react',
            environment: 'jsdom',
            include: ['src/**/*.{test,spec}.tsx'],
            setupFiles: ['./src/setupTests.ts'],
          },
        },
      ],
    },
  }),
);
