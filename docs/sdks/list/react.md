---
sidebar_position: 2
description: For React SPAs
---

# React

## Guide
### Setup
Add the client to your dependencies:
```
npm i react-tggl-client
```
```
yarn add react-tggl-client
```
```
pnpm install react-tggl-client
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
Read the [Node.js client](./node) documentation for client specific information.

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

## Reference
### TgglClient
The client used to query the Tggl API.
```tsx
const client = new TgglClient('YOUR_API_KEY')
```
Read more about the [Node.js client](./node).
### TgglProvider
Place this component at the root of your app. It gives your app access
to the client and the state of the client.
```tsx
<TgglProvider client={client} initialContext={{ foo: 'bar' }}>
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