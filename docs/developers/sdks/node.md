---
sidebar_position: 1
pagination_prev: null
pagination_next: null
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Node.js
## Guide
### Installation plop
Add the client to your dependencies:
```mdx-code-block
<Tabs>
  <TabItem value="npn" label="npm" default>
```
```
npm i tggl-client
```
```mdx-code-block
  </TabItem>
  <TabItem value="Yarn" label="Yarn">
```
```
yarn add tggl-client
```
```mdx-code-block
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
```
```
pnpm install tggl-client
```
```mdx-code-block
  </TabItem>
</Tabs>
```

### Quick start

There are two ways to evaluate flags: **stateful** and **stateless**.

**Stateful** flags evaluation stores result in the client itself.
This is commonly used when instantiating a new client per HTTP request or when working on the frontend.
You can use `isActive` and `get` on the client to access results:

```ts
import { TgglClient } from 'tggl-client'

const client = new TgglClient('YOUR_API_KEY')

await client.setContext({
  userId: 'foo',
  email: 'foo@gmail.com',
  country: 'FR',
  // ...
})

if (client.isActive('my-feature')) {
  // ...
}

if (client.get('my-feature') === 'Variation A') {
  // ...
}
```
**Stateless** flags evaluation does not change the client state.
It is commonly used on the backend with a global singleton client.
You can use `isActive` and `get` on the response to access results:

```ts
const flags = await client.evalContext({
  userId: 'foo',
  email: 'foo@gmail.com',
  country: 'FR',
  // ...
})

if (flags.isActive('my-feature')) {
  // ...
}

if (flags.get('my-feature') === 'Variation A') {
  // ...
}
```

### Differences between `isActive` and `get`

By design, you have no way of telling apart those cases:
- The flag is inactive due to some conditions
- The flag does not exist
- The flag was deleted
- The API key is not valid
- Some network error

This design choice prevents unforeseen event from breaking your app, like someone deleting a flag or messing up the API key rotation. Your app will simply consider any flag to be inactive.

:::tip
Do not use `get` if you simply want to know if a flag is active or not, use `isActive` instead.
:::

`get` gives you the value of an active flag, and this value may be "falsy" (null, false, 0, or empty string), leading to unexpected behaviors:

```typescript
if (client.get('my-feature')) {
  // If 'my-feature' is active, but its value is falsy this block won't be executed
}

if (client.isActive('my-feature')) {
  // Even if 'my-feature' has a falsy value, this block will be executed
}
```

### Default values

When using `get`, you can provide a default value that will be returned if the flag is inactive or does not exist:

```typescript
if (client.get('my-feature', 'Variation A') === 'Variation A') {
  // This code will be executed if 'my-feature' is:
  // - active and explicitely equal to 'Variation A'
  // - inactive or deleted 
}
```

### Typing

Using the Tggl CLI you can run an introspection query to generate the TypeScript types for your flags and context.

```bash
# Install the CLI once
npm i --save-dev tggl-cli

# Generate the types every time that it is needed
tggl typing -k <SERVER_API_KEY> -o src/tggl.d.ts

# Drop the -k option if you have the TGGL_API_KEY environment variable set
tggl typing -o src/tggl.d.ts
```

Replace `<SERVER_API_KEY>` with your server API key or use the `TGGL_API_KEY` environment variable and omit the `-k` option. You should run this command everytime you need to update the typing. Your IDE will now autocomplete and type-check the context properties and all flag names and values.

<Image img={require('./assets/autocomplete-client.png')} center />

### Which calls are asynchronous
A single API call evaluating all flags is performed when calling
`setContext` or `evalContext`,
making all subsequent flag checking methods synchronous and extremely fast.

This means that you do not need to cache results of `isActive` and `get` since
they do not trigger an API call, they simply look up the data in the already fetched response.

### Evaluating contexts in batches

If you have multiple contexts to evaluate at once, you can batch your calls in a single HTTP request for a significant performance boost:

```ts
// Responses are returned in the same order
const [ fooFlags, barFlags ] = await client.evalContexts([
  { userId: 'foo' },
  { userId: 'bar' },
])
```

The client uses a [dataloader](https://www.npmjs.com/package/dataloader) under the hood, which means that all calls that are performed within the same event loop are batched together:
```ts
// evalContext is called twice but a single API call is performed
const [ fooFlags, barFlags ] = await Promise.all([
  client.evalContext({ userId: 'foo' }),
  client.evalContext({ userId: 'bar' }),
])
```

### Evaluating flags locally

It is possible to evaluate flags locally on the server but not recommended unless you have performance issues evaluating flags at a high frequency, or if you need to split traffic on the edge without doing an API call.
Evaluating flags locally forces you to maintain the copy of flags configuration up to date and might be a source of issues.

:::danger
Make sure to [add the right keys to your context](../api/server-side-flags-evaluation#important-differences-with-the-api) to be perfectly consistent with the Tggl API.
:::

```ts
import { TgglLocalClient } from 'tggl-client'

const client = new TgglLocalClient('YOUR_SERVER_API_KEY')

// This method performs an API call and updates the flags configuration
await client.fetchConfig()

// Evaluation is performed locally
client.isActive({ userId: 'foo' }, 'my-feature')
client.isActive({ userId: 'bar' }, 'my-feature')

// You can also get the value of a flag, with and without default value
client.get({ userId: 'baz' }, 'my-feature')
client.get({ userId: 'foobar' }, 'my-feature', 42)
```
When evaluating flags locally it is your responsibility to keep the configuration up to date by calling `fetchConfig` when needed. You can use [webhooks](../api/webhooks) to be notified when the configuration changes.

You can cache the configuration and instantiate the client with the cached version, so you don't need to call `fetchConfig`:

```ts
import { TgglLocalClient } from 'tggl-client'

const cachedConfig = [{ slug: 'flagA', /*...*/ }]

const client = new TgglLocalClient('YOUR_SERVER_API_KEY', {
  initialConfig: cachedConfig
})
```

## Reference

The client can be instantiated with or without options:
```ts
import { TgglClient } from 'tggl-client'

const client = new TgglClient('YOUR_API_KEY')

const client = new TgglClient('YOUR_API_KEY', { 
  url: 'https://api.tggl.io/flags',
  // 👇 Initial response from the API
  initialActiveFlags: {
    flagA: null,
    flagB: 'foo',
  }, 
})
```

You will find your API key on the [app](https://app.tggl.io/projects/app/api-keys). 

### `setContext`
> `setContext(context: Context): Promise<void>`

Performs an API call, evaluating all flags for a given context.
Calling `setContext` updates the state of the client, you can read the response using [get](#get) and [isActive](#isactive) on the client directly.

### `isActive`
>`isActive(slug: string): boolen`

Returns true when a flag is active. A value of false could mean:


### `get`
> `get(slug: string): any | undefined`<br/>
> `get(slug: string, defaultValue: any): any`

Returns the value of a flag, or `undefined` if the flag is not active.
You may specify a default value as second parameter to use when the flag is inactive.

### `evalContext`
> `evalContext(context: Context): Promise<TgglResponse>`

Performs an API call, evaluating all flags for a given context.
Calling `evalContext` does not update the state of the client, 
you can read the response using `get` and `isActive` on the response directly.

All simultaneous calls to `evalContext` (within the same event loop tick) 
will automatically be batched in a single API call.

```ts
const [responseA, responseB] = await Promise.all([
  client.evalContext(contextA),
  client.evalContext(contextB),
]) // => only 1 API call
```
### `evalContexts`
> `evalContexts(contexts: Context[]): Promise<TgglResponse[]>`

This is a shorthand to calling `evalContext` multiple times simultaneously.

```ts
const [responseA, responseB] = await client.evalContexts([
  contextA,
  contextB,
])
```