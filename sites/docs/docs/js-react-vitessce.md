---
id: js-react-vitessce
title: React component
---

The `vitessce` package exports the `Vitessce` React component. The component props are described below.

```jsx
import React from 'react';
import { Vitessce } from 'vitessce';
import myViewConfig from './my-view-config';

export default function MyApp() {
    return (
        <Vitessce
            config={myViewConfig}
            height={800}
            theme="light"
        />
    );
}
```

## Required props

### `config`
- Type: `object`

This parameter takes a Vitessce view config as a JSON object. Please visit our [view config](/docs/view-config-json) documentation pages for more details.

### `height`
- Type: `number`

The height in pixels that the Vitessce grid will fill on the page.

## Optional props

### `theme`
- Type: `string`

The theme, used for styling the components. By default, `dark`.

|Value| Notes|
|-----|------|
| `light` | The light theme |
| `dark` | The dark theme |

### `onConfigChange`
- Type: `function`

A callback for view config updates.

:::caution
Note that the updated config(s) passed to this callback function will always have been upgraded to conform to the latest config schema.
:::

### `validateOnConfigChange`
- Type: `boolean`

Whether to validate
against the view config schema when publishing changes. Use for debugging
purposes only, as this has a performance impact.

### `isBounded`
- Type: `boolean`

If set to `true` then users cannot resize or move components beyond the initial borders of the grid. By default, `false`.

### `uid`
- Type: `null|string`

A unique ID string which can be used to ensure that dynamically-generated CSS class names are unique for a given `<Vitessce/>` component. By default, `null`.

### `pluginViewTypes`
- Type: `PluginViewType[]`

Define additional view types. See [plugin development](/docs/dev-plugins) for more information.

### `pluginFileTypes`
- Type: `PluginFileType[]`

Define additional file types. See [plugin development](/docs/dev-plugins) for more information.


### `pluginCoordinationTypes`
- Type: `PluginCoordinationType[]`

Define additional coordination types. See [plugin development](/docs/dev-plugins) for more information.


### `pluginJointFileTypes`
- Type: `PluginJointFileType[]`

Define additional [joint file type](docs/data-types-file-types/#joint-file-types) expansion functions. See [plugin development](/docs/dev-plugins) for more information.


## Lazy loading

We are aware that the main JavaScript bundle for Vitessce is large.
If you would like to use the `<Vitessce/>` component in certain parts of your app without increasing the bundle size, one option is lazy loading.

### Bundle splitting approach

`React.lazy` only works with [default exports](https://reactjs.org/docs/code-splitting.html#named-exports) (rather than named exports), but we can work around this by adding a new file to wrap the `Vitessce` named export as a default export.
```js title="/src/components/VitessceWrapper.js"
export { Vitessce as default } from 'vitessce';
```

Then in our app, we can dynamically import from this file in a call to `React.lazy` and use the lazy-loaded component within `<Suspense/>`.

```jsx title="/src/components/MyApp.js"
import React, { Suspense } from 'react';
const Vitessce = React.lazy(() => import('./VitessceWrapper'));

export default function MyApp(props) {
  const { config } = props;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Vitessce config={config} theme="dark" height={600} />
    </Suspense>
  );
}
```
