import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/aurora-card.ts'),
      name: 'AuroraCard',
      fileName: () => 'aurora-card.js',
      formats: ['es']
    },
    rollupOptions: {
      // Ensure nothing is treated as external so everything bundles together
      external: [],
      output: {
        globals: {},
        // Prevents code-splitting into multiple separate files
        inlineDynamicImports: true,
      }
    },
    minify: 'esbuild',
    target: 'es2022',
    sourcemap: true
  }
});