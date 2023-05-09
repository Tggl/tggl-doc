---
sidebar_position: 1
---

# Authentication

The Tggl API is organized around REST. 
Our API has predictable resource-oriented URLs, accepts JSON-encoded bodies, returns JSON-encoded responses, 
and uses standard HTTP response codes, authentication, and verbs.

You can query the API from the user's browser ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
is enabled), mobile device, or from your servers.

```plaintext title="Base URL"
https://api.tggl.io
```

All API calls must be authenticated with your API key in the `X-Tggl-API-Key` header. You will find your API key in the 
[Tggl dashboard](http://localhost:3001/projects/default/api-keys)  .

```bash
curl 'https://api.tggl.io/<endpoint>' \
  -H 'x-tggl-api-key: <api key>'
```

## Client vs. Server key

Each project has its own set of client and server key which allows you do perform different actions:

|                                                     | Client key | Server key |
|-----------------------------------------------------|------------|-----------|
| Evaluate flags via API                              | ✅          | ✅         |
| Fetch flags configuration and evaluate flags locally | ❌          | ✅         |

It is recommended to always evaluate flags via the API unless you have performance issues when evaluating flags at a high frequency, or if you need to split traffic on the edge without doing an API call.
Evaluating flags locally forces you to maintain the copy of flags configuration up to date which might be a source of issues.

:::info
**Never** publish the server key to your client apps or you risk exposing sensitive information. 
Client applications do not need to evaluate flags locally since Tggl is already optimised to perform a single API call when the app starts. 
:::