---
sidebar_position: 1
---

# Authentication

The REST API is available at `https://api.tggl.io`. You can query the API from the user's browser ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
is enabled) or from your servers.

You must authenticate all API calls with the `X-Tggl-API-Key` header. You will find your API key in the 
[API keys](http://localhost:3001/projects/default/api-keys) menu.

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

It is recommended to always evaluate flags via the API unless you have performance issues evaluating flags at a high frequency, or if you need to split traffic on the edge without doing an API call.
Evaluating flags locally forces you to maintain the copy of flags configuration up to date and might be a source of issues.

:::info
Never publish the server key to your client apps or you risk exposing sensitive information. 
Client applications do not need to evaluate flags locally since Tggl is already optimised to perform a single API call when the app starts. 
:::