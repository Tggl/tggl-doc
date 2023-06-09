---
sidebar_position: 2
pagination_prev: null
---

# Evaluating flags via API

<Image img={require('./assets/api-flags-evaluation.png')} density={1} />

For client-side applications, the recommended way to evaluate flags is to 
use the API. This way you do not expose any sensitive information to the 
client, and you have a consistent evaluation strategy without 
re-implementing the logic in every language.

You only need to perform a single API call when the context changes, 
typically when you load the app or when the user logs in. From that single 
call you receive all flags at once and can simply look up the list of flags 
to see if a particular feature should be active or not.

The API can also be used on the backend to evaluate flags for a large number 
of contexts at once. Once again this is recommended to avoid re-implementing 
evaluation logic and to avoid maintaining a cache of the configuration.

## Evaluating a single context

The <Api method="POST" url="/flags" /> endpoint allows you to send a context 
object 
serialized as 
JSON and retrieve all active flags at once for that context.

```bash
curl 'https://api.tggl.io/flags' \
  -H 'Content-Type: application/json' \
  -H 'x-tggl-api-key: <api key>' \
  --data-raw '{"userId":"foo","email":"foo@gmail.com"}'
```

The response is a JSON object:
```json
{
  "flagA": null,
  "flagC": "foo",
  "flagD": false
}
```

The response includes **active flags only**. To check if a flag is active or not (for that given context) 
simply check if the key exists. 

Most of the time, checking if a key exists is enough, but if you want to do A/B/C tests or
if you use flags to set values in your app, you might need to read the flag's value.

The above response can be interpreted as follows:
- `flagA` is **active**, and its value is `null`. 
- `flagB` is **inactive**, deleted, or maybe it just does not exist. (It is simply not part of the response)
- `flagC` is **active**, and its value is `"foo"`
- `flagD` is **active**, and its value is `false`

:::tip
It might be tempting to think that values of `null` or `false` means that the flag is inactive, **but it is not**.
Inactive flags are just not in the response, there might be a few reasons for that:
- The flag does not exist, it was never created
- The flag exists but is archived
- The flag exists but it is inactive (the main switch is off on the app)
- The flag exists, it is active, but for that particular context the conditions make it fall into the inactive variation
:::

## Evaluating flags in batches

On the backend you might need to evaluate a lot of contexts at once. Doing multiple HTTP requests will kill performance,
you can instead pass an array of contexts in a single API call and get back an array of responses.

```bash
curl 'https://api.tggl.io/flags' \
  -H 'Content-Type: application/json' \
  -H 'x-tggl-api-key: <api key>' \
  --data-raw '[{"userId":"foo"},{"userId":"bar"},{"userId":"baz"}]'
```

Contexts objects do not have to share the same keys. The response is an array of the same length:
```json
[
    {
      "flagA": null,
      "flagC": "foo",
      "flagD": false
    },
    {
      "flagC": "foo"
    },
    {
      "flagA": null,
      "flagD": true
    }
]
```
