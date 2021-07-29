# svelte-web-components-template

> A base template for building a shareable web components library with [Svelte](https://svelte.dev).

## How to use this template

You can directly create a new GitHub repo from this template by selecting the **Use this template** button on GitHub.

You can also clone it locally with the following commands:

```bash
npx degit sinedied/svelte-web-components-template#main my-component-lib
cd my-component-lib
npm install # or yarn
```

Your components source code lives in `lib/` folder. Only components with the `.wc.svelte` extension will be exported as web components and available in your library. This means that you can also use regular Svelte components with the `.svelte` extension as child components for your implementation details.

You can add additional components by adding them to the `lib` folder and editing `lib/index.js`.

## Testing your components

You can start a development server with:

```bash
npm run dev
```

Then open your browser to [localhost:5000](http://localhost:5000).

This will build the demo application located in the `demo/` folder, in which you can use and test your components during development.

If you want to add unit tests, you can take a look at [Jest](https://jestjs.io) and [Jest testing library](https://github.com/testing-library/svelte-testing-library). 

## Building the library

The command `npm run build` will create the web components library in the `dist/` folder. It creates both a JavaScript module (`dist/index.mjs`) and a regular UMD script (`dist/index.js`).

The build is automatically called when executing `npm publish` or `npm pack` to distribute your library, thanks to the `prepublishOnly` scripts in `package.json`.

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

The Svelte syntax event for listening to events like `on:myevent` doesnt work with events dispatched from a Svelte web component ([#3119](https://github.com/sveltejs/svelte/issues/3119)).

You need to use a workaround for that, by creating a `CustomEvent` and dispatching it with the `composed: true` option to cross the shadow DOM boundary.

Here's an example:

```html
// MyComponent.wc.svelte
<svelte:options tag="my-component" />
<script>
  import { get_current_component } from "svelte/internal";
  
  const component = get_current_component();
  
  // example function for dispatching events
  const dispatchEvent = (name, detail) => {
    component?.dispatchEvent(new CustomEvent(name, {
      detail,
      composed: true  // propagate across the shadow DOM
    }));
  };
</script>
<button on:click={() => dispatchEvent("test", "Hello!")}>
  Click to dispatch event
</button>
```

## Building each component into its own module

By default this template will build all components into a single module.

If you prefer to build each component into its own module, you can do so by editing `rollup.config.js` and setting the `bundleComponents` option to `false`.

Then you also need to replace the content of `lib/index.js` with:

```js
export default () => {
  import('./MyComponent.wc.svelte');
  // Import each of your component this way
};
```

This will enable code-splitting and will generate an ES module for each component in the `dist/` folder.
