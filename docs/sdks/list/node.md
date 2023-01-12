---
sidebar_position: 1
description: For backend Node.js or unsupported frontend frameworks
---

# Node.js
## Installation
Add the client to your dependencies:
```
npm i tggl-client
```

## Instantiating client
Import and instantiate the client:
```typescript
import { TgglClient } from 'tggl-client'

const client = new TgglClient('YOUR_API_KEY')
```

You may pass options as a second parameter:
```typescript
const client = new TgglClient('YOUR_API_KEY', { url: 'https://custom-domain.com' })
```

The only available options is `url`, it allows you to override the default API URL (`https://api.tggl.io/flags`).

## Evaluating flags

Set the context on which flags evaluation should be performed:
```typescript
await client.setContext({
  userId: 'foo',
  email: 'foo@gmail.com',
  country: 'FR',
  // ...
})
```

:::tip
Make sure to `await` this method. An API call evaluating all flags is performed here, 
making all subsequent flag checking methods synchronous.
:::

You can specify any key you want, just make sure they match the conditions you specify during flags setup.

`setContext` should be called anytime the context changes: 
- app starts, 
- user logs in, 
- user changes email
- ...

:::caution
Make sure to call `setContext` at least once, even with an empty context, otherwise no API call is made and all flags will seam to be inactive.
:::

## Checking flag results

You can test if a flag is active or not:
```typescript
if (client.isActive('my-feature')) {
  // ...
}
```

Because flags evaluation is done when you call `setContext`, checking if a flag is active is
synchronous and extremely fast.

An inactive flag and a non-existing flag will both return false. This is by design and prevents anyone from breaking your
app by just deleting a flag, it will simply be considered inactive.

You can get the value of a flag:
```typescript
if (client.get('my-feature') === 'Variation A') {
  // ...
}
```

If a flag is inactive, it will always return `undefined`, otherwise it will return the value of the variation the context falls in (which might be `null`).

You can specify a default value for innactive flags:

```typescript
if (client.get('my-feature', 'Variation A') === 'Variation A') {
  // ...
}
```

## `isActive` vs `get`

If you just want to know if a flag is active use `isActive` instead of `get`. 

```typescript
if (client.get('my-feature')) {
  // If 'my-feature' is active, but its value is falsy ('', 0, null, false) this block won't be executed
}

if (client.isActive('my-feature')) {
  // Even if 'my-feature' has a falsy value this block will be executed if 'my-feature' is active
}
```

## Stateless flags evaluation

The client is stateful, which is perfectly suited for frontend applications or for creating a new client for each http request.
Sometimes, especially in the backend, you might want to evaluate a context without persisting any kind of state in the client:

```ts
const response = await client.evalContext({ foo: 'bar' })

if (response.isActive('my-feature')) {
  // ...
}

if (response.get('my-feature') === 'Variation A') {
  // ...
}
```

You can also evaluate multiple context at once:
```ts
const [responseA, responseB] = await client.evalContexts([contextA, contextB]) // Only 1 API call
```

This has the advantage performing a single API call, which is great for performance.
Note that multiple calls to `evalContext` within the same event loop tick will automatically be batched in a single API call:

```ts
const [responseA, responseB] = await Promise.all([
  client.evalContext(contextA),
  client.evalContext(contextB),
]) // Only 1 API call
```