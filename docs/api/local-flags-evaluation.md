---
sidebar_position: 3
---

# Evaluating flags locally

The `GET /config` endpoint allows you to retrieve all active flag's configurations at once, making it possible to then evaluate an extremely high number of flags locally without doing any API calls.

:::info
It is recommended to always evaluate flags [via the API](api-flags-evaluation) unless 
you have performance issues and are evaluating flags at a high frequency, 
or if you need to split traffic on the edge without doing an API call. 

Evaluating flags locally forces you to maintain the copy of flags configuration up to date and might be a source of issues.
:::

```bash
curl 'https://api.tggl.io/config' \
  -H 'x-tggl-api-key: <server api key>'
```

The response is a JSON array:
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