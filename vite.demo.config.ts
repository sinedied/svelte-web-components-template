import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  root: './packages/demo/',
  resolve: {
    dedupe: ['svelte']
  },
  build: {
    outDir: '../../dist/demo',
    emptyOutDir: true
  },
  plugins: [
    svelte({
      include: /\.wc\.svelte$/ as any,
      compilerOptions: {
        customElement: true
      }
    }),
    svelte({
      exclude: /\.wc\.svelte$/ as any
    })
  ]
});
