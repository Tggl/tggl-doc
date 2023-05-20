---
sidebar_position: 3
---

# Evaluating flags locally

<Image img={require('./assets/local-flags-evaluation.png')} density={1} />


:::info
You **should not** evaluate flags locally on client side applications to 
prevent 
exposing sensitive information to the client.

On the backend side it is recommended to always evaluate flags 
[via the API](api-flags-evaluation) unless you have performance issues when evaluating 
flags at a high frequency, or if you need to split traffic on the edge 
without doing an API call.

Evaluating flags locally forces you to maintain a copy of flags 
configuration up to date and potentially re-implement the evaluation logic in 
your language, which might be a source of issues.
:::

## Retrieving the configuration

The <Api method="GET" url="/config" /> endpoint allows you to retrieve all 
active flag's configurations at once, making it possible to then evaluate an extremely high number of flags locally without doing any API calls.


```bash
curl 'https://api.tggl.io/config' \
  -H 'x-tggl-api-key: <server api key>'
```

The response is a JSON array containing all active flags:
```json
[
  {
    "slug": "flagA",
    "conditions": [
      {
        "rules": [
          {
            "key": "userId",
            "operator": "STR_EQUAL",
            "negate": false,
            "values": [
              "u1",
              "u2"
            ]
          }
        ],
        "variation": {
          "active": true,
          "value": "foo"
        }
      }
    ],
    "defaultVariation": {
      "active": false,
      "value": null
    }
  },
  {
    "slug": "flagB",
    "conditions": [],
    "defaultVariation": {
      "active": true,
      "value": "bar"
    }
  }
]
```

If you are using Node you can use the [Node.js client](/docs/sdks/list/node) to query the configuration and parse the result.
Otherwise you should refer to the [reference implementation](https://github.com/Tggl/tggl-core) written in Javascript to
parse the result in your own programming language.

## When to retrieve the configuration?

You have only a few solutions to maintain the cache of the configuration up to 
date:
- Manually refresh the cache when you update a flag
- Automatically refresh the cache at a regular interval
- Use a webhook to update the cache when a flag is updated

It is recommended to use a [webhook](./webhooks) as it offers the fastest 
automatic update.

## Important differences with the API

When [evaluating flags via the API](./api-flags-evaluation) a few keys are automatically added to the context. When evaluating flags locally it is your responsibility to pass those keys to the context, otherwise any condition that is based on those keys will fail.

:::danger
If you do not manually pass those keys to the context you might have discrepancies between evaluating flags locally and via the API.
:::

Here is the exhaustive list of keys that are automatically added by Tggl when evaluating flags via the API:

- `timestamp`: the current timestamp
- `acceptLanguage`: the value of the `accept-language` HTTP header
- `ip`: the IP address that made the HTTP request
- `userAgent`: the value of the `user-agent` HTTP header
- `referer`: the value of the `referer` HTTP header