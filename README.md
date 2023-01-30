# 🌐 svelte-web-components-template

> A base template for building a shareable web components library using [Vite](https://vitejs.dev), [Svelte](https://svelte.dev) and [TypeScript](https://www.typescriptlang.org).

This templates generates vanilla [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) than can be used with [plain HTML](https://www.webcomponents.org/introduction#how-do-i-use-a-web-component-) or within any major frameworks, such as React, Angular, Vue or Svelte (see [compatibility](https://custom-elements-everywhere.com/)).

## How to use this template

You can directly create a new GitHub repo from this template by selecting the **Use this template** button on GitHub.

You can also clone it locally with the following commands:

```bash
npx degit sinedied/svelte-web-components-template#main my-component-lib
cd my-component-lib
npm install
```

Your components source code lives in `lib/` folder. Only components with the `.wc.svelte` extension will be exported as web components and available in your library. This means that you can also use regular Svelte components with the `.svelte` extension as child components for your implementation details.

You can add additional components by adding them to the `lib` folder and editing `lib/index.js`.

## Testing your components

You can start a development server with:

```bash
npm start
```

Then open your browser to [localhost:5173](http://localhost:5173).

This will build the demo application located in the `demo/` folder, in which you can use and test your web components during development.

If you need unit tests, you can take a look at [Jest](https://jestjs.io) and [Jest testing library](https://github.com/testing-library/svelte-testing-library).

### Using the built web components with the demo app

The demo application is provided for development and testing of your components, that's why it imports the `.svelte` files from the `lib/` folder directly by default.

If you prefer, you can import the built web components from the `dist/` folder instead, by editing `demo/src/App.svelte` and replacing the `import '../../lib';` statement with `import '../../../dist/lib';` if you have the `bundleComponents` option enabled, or individually import your components with `import import '../../dist/MyComponent.wc.js';` otherwise.

You'll also have to make sure to run the `npm run build` script to generate the `dist/lib/` folder first.

## Building the library

The command `npm run build` will create the web components library in the `dist/lib/` folder. It creates both an ES module (`dist/lib/<your-lib>.js`) suitable for bundler (non-minified), a minified ES module (`dist/lib/<your-lib>.min.js`) and a regular UMD script (`dist/lib/<your-lib>.umd.js`).

The build is automatically called when executing `npm publish` to distribute your library, thanks to the `prepublishOnly` script entry in `package.json`.

## Notes and limitations

This template does not provide any web components polyfills for older browsers support. It's usually best to leave that task to the host application, hence why they're left out.

### Props

Any props accepted by your web component are automatically transformed to element attributes. Since camelCase or PascalCase does not work in HTML, you have to make sure to name your props in lowercase.

```html
<script>
  export let myvalue = "Default";
</script>
```

### Events

The Svelte syntax event for listening to events like `on:myevent` doesn't work with events dispatched from a Svelte web component ([#3119](https://github.com/sveltejs/svelte/issues/3119)).

You need to use a workaround for that, by creating a `CustomEvent` and dispatching it.

Here's an example:

```html
// MyComponent.wc.svelte
<svelte:options tag="my-component" />
<script>
  import { get_current_component } from "svelte/internal";
  const component = get_current_component();
  
  // example function for dispatching events
  const dispatchEvent = (name, detail) =>
    component.dispatchEvent(new CustomEvent(name, { detail }));
</script>
<button on:click={() => dispatchEvent("test", "Hello!")}>
  Click to dispatch event
</button>
```

## Building each component into its own module

By default this template will build all components into a single module.

If you prefer to build each component into its own module, you can do so by setting the environment variable `BUNDLE_COMPONENTS` to `false`, or editing `vite.config.js` and setting the `bundleComponents` option to `false`.

Then you also need to replace the content of `packages/lib/index.ts` with:

```js
export default () => {
  import('./MyComponent.wc.svelte');
  // Import each of your component this way
};
```

This will enable code-splitting and will generate an ES module for each component in the `dist/lib/` folder.

As you changed the way components are exported, you also need to replace the `import '../../lib';` statement in `demo/src/App.svelte` to `import '../../lib/MyComponent.wc.svelte';`.

## Why enable `allowJs` in the TS template?

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.


## Why is HMR not preserving my local component state?

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/sveltejs/svelte-hmr/tree/master/packages/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
