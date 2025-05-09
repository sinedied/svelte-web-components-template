import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),
  vitePlugin: {
    compileModule: {
      // infixes: ['.nono.'],
      // exclude: /\.wc\.svelte$/,
    }
  }
}
