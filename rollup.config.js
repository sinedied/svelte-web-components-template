import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import summary from "rollup-plugin-summary";
import pkg from "./package.json";

const bundleComponents = true;
const production = !process.env.ROLLUP_WATCH;

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
  input: "lib/index.js",
  output: bundleComponents
    ? [
        { file: pkg.module, format: "es" },
        { file: pkg.main, format: "umd", name },
      ]
    : [
        {
          dir: "dist/",
          format: "es",
          chunkFileNames: "[name].js",
          manualChunks: { svelte: ["svelte"] },
        },
      ],
  plugins: [
    del({ targets: "dist" }),
    svelte({
      // compile only *.wc.svelte files as web components
      include: /\.wc\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: true,
      },
    }),
    svelte({
      exclude: /\.wc\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    resolve(),
    terser(),
    summary(),
  ],
};
