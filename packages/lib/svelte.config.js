import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  compilerOptions: {
    customElement: true
  },
  vitePlugin: {
    compileModule: {
      // infixes: ['.no-file.'],
      // include: /\.wc\.svelte$/,
    }
  }
}
