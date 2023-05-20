---
sidebar_position: 1
description: For backend Node.js or unsupported frontend frameworks
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Node.js
## Guide
### Installation
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

**Stateful** flags evaluation stores result in the client.
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
const falgs = await client.evalContext({
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

### Async / await
A single API call evaluating all flags is performed when calling
`setContext` or `evalContext`,
making all subsequent flag checking methods synchronous and extremely fast.

This means that you do not need to cache results of `isActive` and `get` since
they do not trigger an API call, they simply look up the data in the already fetched response.

### `isActive` vs `get`

By design, you have no way of telling apart an inactive flag, a non-existing flag, a deleted flag, or a network error. 
This design choice prevents anything from breaking your
app by just deleting a flag, messing up the API key rotation, or any other unforeseen event, it will simply consider any flag to be inactive.

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

### Evaluate flags locally

It is possible to evaluate flags locally on the server but not recommended unless you have performance issues evaluating flags at a high frequency, or if you need to split traffic on the edge without doing an API call.
Evaluating flags locally forces you to maintain the copy of flags configuration up to date and might be a source of issues.

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
When evaluating flags locally it is your responsibility to keep the configuration up to date by calling `fetchConfig` when needed. You can use [webhooks](../../api/webhooks) to be notified when the configuration changes.

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
- The flag is inactive due to some conditions
- The flag does not exist
- The flag was deleted
- The API key is not valid
- Some network error

### `get`
> `get<T>(slug: string): T | undefined`<br/>
> `get<T>(slug: string, defaultValue: T): T`

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