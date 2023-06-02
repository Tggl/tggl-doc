---
sidebar_position: 2
description: For React SPAs
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# React

## Guide
### Setup
Add the client to your dependencies:
```mdx-code-block
<Tabs>
  <TabItem value="npn" label="npm" default>
```
```
npm i react-tggl-client
```
```mdx-code-block
  </TabItem>
  <TabItem value="Yarn" label="Yarn">
```
```
yarn add react-tggl-client
```
```mdx-code-block
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
```
```
pnpm install react-tggl-client
```
```mdx-code-block
  </TabItem>
</Tabs>
```

Add the provider to your app:
```tsx
import { TgglClient, TgglProvider } from 'react-tggl-client'

// Instanciate it outside of your component
const client = new TgglClient('YOUR_API_KEY')

const App = () => {
  return (
    <TgglProvider client={client}>
      {/*...*/}
    </TgglProvider>
  )
}
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

Read the [Node.js client](./node#reference) documentation more client specific information.

### Updating the context
You can now change the context anywhere in the app using the `useTggl` hook:
```tsx
import { useTggl } from 'react-tggl-client'

const MyComponent = () => {
  const { user } = useAuth()
  const { updateContext } = useTggl()

  useEffect(() => {
    if (user) {
      updateContext({ userId: user.id, email: user.email })
    } else {
      updateContext({ userId: null, email: null })
    }
  }, [user])

  return <></>
}
```

`updateContext` only updates the keys you specify, it merges the context you pass as argument into the existing context. Alternatively you can use `setContext` to override the context completely.

### Checking flag results
Use the `useFlag` hook to get the state of a flag:
```tsx
import { useFlag } from 'react-tggl-client'

const MyComponent = () => {
  const { active } = useFlag('myFlag')
  
  //...
}
```

You may also get the value of a flag:
```tsx
const MyComponent = () => {
  const { value } = useFlag('myFlag')
  
  //...
}
```

### Typing

Using the Tggl CLI you can run an introspection query to generate the TypeScript types for your flags and context.

```bash
npm i --save-dev tggl-cli
tggl typing -k <SERVER_API_KEY> -o src/tggl.d.ts -p react-tggl-client
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
if (value) {
  // If flag is active, but its value is falsy this block won't be executed
}

if (active) {
  // Even if flag has a falsy value, this block will be executed
}
```

### Tracking flags evaluation events

Tggl works nicely with your already existing analytics tool. You can track all flag evaluation events in one place and forward it to your analytics to compute conversion rates for A/B testing.

:::tip
If you are using [Amplitude](https://amplitude.com/), tracking is automatic, you don't need to do anything. Just make sure you have the [Amplitude SDK](https://www.docs.developers.amplitude.com/data/sdks/sdk-quickstart/#npm) installed. `[Tggl] Flag evaluated` events will be sent to Amplitude with _slug_, _active_, and _value_.
:::

```tsx
const App = () => {
  return (
    <TgglProvider
      client={client}
      onFlagEvaluation={({ slug, active, value }) => {
        trackEvent('Flag evaluated', { slug, active, value })
      }}
    >
      {/*...*/}
    </TgglProvider>
  )
}
```

## Reference
### TgglClient
The client used to query the Tggl API.
```tsx
const client = new TgglClient('YOUR_API_KEY')
```
Read more about the [Node.js client](./node).
### TgglProvider
Place this component at the root of your app. It gives your app access to the client and the state of the client.
```tsx
<TgglProvider 
  client={client} 
  initialContext={{ foo: 'bar' }}
  onFlagEvaluation={trackFlagEvaluation}
>
  {/*...*/}
</TgglProvider>
```
#### client
Pass a `TgglClient` that will be used to evaluate flags.

#### initialContext
Allows you to pass an initial value.
:::caution
Updating the value of `initialContext` will have no effect, use the [`useTggl`](#usetggl) hook instead
:::

#### onFlagEvaluation
This function is called everytime a flag is evaluated. It takes an object as only parameter with the following keys: `slug`, `active`, ans `value`.

### useTggl
You can use this hook anywhere inside the `<TgglProvider />`. 
It is mostly useful for updating the context with `setContext` and `updateContext`.
```tsx
function useTggl(): {
  client: TgglClient
  setContext: (context: Context) => void
  updateContext: (context: Context) => void
}
```

#### client
Returns the client instance passed to `<TgglProvider />`.

#### setContext
Override the context and triggers an API call to evaluate flags.

#### updateContext
Just like `setContext` but keys are merged into the existing context.
This should be used if you wish to only update a few keys, leaving the rest unchanged.

### useFlag 

```tsx
function useFlag<T>(slug: string): {
  active: boolean
  value: T | undefined
  loading: boolean
  error: any
}

function useFlag<T>(
  slug: string,
  defaultValue: T
): {
  active: boolean
  value: T
  loading: boolean
  error: any
}
```
:::tip
Only read the keys that you really need to avoid unnecessary re-renders.
:::

#### active
True when the flag is active, false otherwise.

#### value
The value of the flag or `undefined` if the flag is not active. 
You can pass a default value as second parameter of this hook
to be used when the flag is not active.

Always use `active` instead of `value` if you only want to know if a flag is active or not.
Otherwise, a falsy value (null, '', 0, false) might lead to unexpected behavior.

#### loading
True when an API call is being performed.

#### error
The error thrown by the last API call if any.