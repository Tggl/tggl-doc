---
sidebar_position: 3
pagination_prev: null
pagination_next: null
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Vue.js

## Guide
### Setup
Add the client to your dependencies:
```mdx-code-block
<Tabs>
  <TabItem value="npn" label="npm" default>
```
```bash
npm i vue-tggl-client
```
```mdx-code-block
  </TabItem>
  <TabItem value="Yarn" label="Yarn">
```
```bash
yarn add vue-tggl-client
```
```mdx-code-block
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
```
```bash
pnpm install vue-tggl-client
```
```mdx-code-block
  </TabItem>
</Tabs>
```

Add the provider to your app:
```jsx
<script setup>
  import { TgglClient, TgglProvider } from 'vue-tggl-client'

  const client = new TgglClient('YOUR_API_KEY')
</script>

<template>
  <TgglProvider :client="client">
    <!-- ... -->
  </TgglProvider>
</template>
```

For server-side-rendering you can pass the list of active flags directly to the client so the user does not have to re-fetch this list via the API.

```ts
const client = new TgglClient('YOUR_API_KEY', { 
  initialActiveFlags: {
    flagA: null,
    flagB: 'foo',
  }, 
})
```

Read the [Node.js client](node.md#reference) documentation more client specific information.

### Updating the context
You can now change the context anywhere in the app using the `useTggl` function:
```tsx
import { useTggl } from 'vue-tggl-client'

const { updateContext } = useTggl()

if (user) {
  updateContext({ userId: user.id, email: user.email })
} else {
  updateContext({ userId: null, email: null })
}
```

`updateContext` only updates the keys you specify, it merges the context you pass as argument into the existing context. Alternatively you can use `setContext` to override the context completely.

### Checking flag results
Use the `useFlag` function to get the state of a flag:
```tsx
<script setup>
import { useFlag } from 'vue-tggl-client'

const flag = useFlag('myFlag')
</script>

<template>
  <div v-if="flag.active">
    This is only visible if the flag is active
  </div>
</template>
```

You may also get the value of a flag:
```tsx
<div v-if="flag.value === 'A'">
  A
</div>
<div v-else-if="flag.value === 'B'">
  B
</div>
<div v-else>
  Fallback
</div>
```

### Typing

Using the Tggl CLI you can run an introspection query to generate the TypeScript types for your flags and context.

```bash
npm i --save-dev tggl-cli
tggl typing -k <SERVER_API_KEY> -o src/tggl.d.ts -p vue-tggl-client
```

Replace `<SERVER_API_KEY>` with your server API key or use the `TGGL_API_KEY` environment variable and omit the `-k` option. You should run this command everytime you need to update the typing. Your IDE will now autocomplete and type-check the context properties and all flag names and values.

<Image img={require('./assets/autocomplete-react@2x.png')} center />

### `active` vs `value`

By design, you have no way of telling apart an inactive flag, a non-existing flag, a deleted flag, or a network error.
This design choice prevents anything from breaking your
app by just deleting a flag, messing up the API key rotation, or any other unforeseen event, it will simply consider any flag to be inactive.

:::tip
Do not use `value` if you simply want to know if a flag is active or not, use `active` instead.
:::

`value` gives you the value of an active flag, and this value may be "falsy" (null, false, 0, or empty string), leading to unexpected behaviors:

```typescript
if (flag.value) {
  // If flag is active, but its value is falsy this block won't be executed
}

if (flag.active) {
  // Even if flag has a falsy value, this block will be executed
}
```
