---
sidebar_position: 4
pagination_prev: null
pagination_next: null
---

# Tggl Proxy

<Image img={require('./assets/proxy-schema.png')} density={1} />

The Tggl proxy sits between the Tggl API and your application on your own infrastructure. It is a simple HTTP server that periodically syncs with the Tggl API and caches the feature flags configuration in memory. This allows your application to query the feature flags without having to make a request to the Tggl API.

The proxy has 3 main benefits:
- **Performance**: The proxy can run close to your end users and handle thousands of requests per second or more depending on your infrastructure.
- **Privacy**: Since the proxy is running on your infrastructure, your data is never leaving your network, and never reaches the Tgl API.
- **Reliability**: Since the proxy does not depend on the Tggl API, it can continue to serve feature flags even if the Tggl API is down. It can even store its configuration to be persistent across restarts.

## Running the proxy

Install the proxy as a dependency of your project:

```bash
npm i tggl-proxy
```

Then simply start the proxy:

```typescript
import { createApp } from "tggl-proxy";

const app = createApp({
  apiKey: "API_KEY",
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
})
```

The `apiKey` option is the only required option, it can also be passed via the `TGGL_API_KEY` environment variable.

## Security

All calls to the proxy must be authenticated via the `X-Tggl-Api-Key` header. It is up to you decide which keys are accepted via the `clientApiKeys` option.

You can also completely disable the `X-Tggl-Api-Key` header check by setting the `rejectUnauthorized` option to `false`.

## API

The proxy exposes a single <Api method="POST" url="/flags" /> endpoint that mirrors exactly the Tggl API. This means that all SDKs can be configured to use the proxy instead of the Tggl API simply by providing the right URL.

The path of the endpoint can be configured using the `path` option. You can also setup custom CORS rules using the `cors` option.

## Storage

By default, the proxy does not store the configuration. This means that if the proxy is restarted, it will have to fetch the configuration from the Tggl API again. This is fine for most use cases, but if you want to have a hot restart, you can configure the proxy to store the configuration.

:::info
While the proxy starts, it will wait for either the storage to be loaded or the configuration to be fetched from the Tggl API. This means that the proxy will not start serving requests until it has a configuration to serve.
:::

You can plug any storage that is capable of storing a string. The storage must implement the following interface:

```typescript
import { Storage, createApp } from "tggl-proxy";

const storage: Storage = {
  getConfig() {
    return redisClient.get("key");
  },
  async setConfig(config: string) {
    await redisClient.set("key", config)
  }
};

const app = createApp({
  apiKey: "API_KEY",
  storage,
});

```

## Configuration reference

The proxy can be configured by passing an option object, all missing options will fallback to the environment variable before falling back to their default value.

| Name                 | Env var                    | Required | Default                        | Description<div style={{ width: 400 }} />                                                                                                                     |
|----------------------|----------------------------|:---------|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `apiKey`             | `TGGL_API_KEY`             | ✓        |                                | Server API key from you Tggl dashboard                                                                                                                        |
| `path`               | `TGGL_PROXY_PATH`          |          | `'/flags'`                     | URL to listen to                                                                                                                                              |
| `cors`               |                            |          | `null`                         | [CORS configuration](https://github.com/expressjs/cors#configuration-options)                                                                                 |
| `url`                | `TGGL_URL`                 |          | `'https://api.tggl.io/config'` | URL of the Tggl API to fetch configuration from                                                                                                               |
| `pollingInterval`    | `TGGL_POLLING_INTERVAL`    |          | `5000`                         | Interval in milliseconds between two configuration updates. Pass `0` to disable polling.                                                                        |
| `rejectUnauthorized` | `TGGL_REJECT_UNAUTHORIZED` |          | `true`                         | When true, any call with an invalid `X-Tggl-Api-Key` header is rejected, see `clientApiKeys`                                                                  |
| `clientApiKeys`      | `TGGL_CLIENT_API_KEYS`     |          | `[]`                           | Use a coma separated string to pass an array of keys via the environment variable. The proxy will accept any of the given key via the `X-Tggl-Api-Key` header |
| `storage`             |                            |          | `null`                          | A Storage object that is able to store and retrieve a string to persist config between restarts                                                               |
