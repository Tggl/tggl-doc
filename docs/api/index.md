# API

The REST API is available at `https://api.tggl.io`, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 
is enabled, you may make API calls from the user's browser directly from your app.

## Authentication

You must authenticate all API calls with the `X-Tggl-API-Key` header. You will find your API key in the 
[API keys](http://localhost:3001/projects/default/api-keys) menu.

```bash
curl 'https://api.tggl.io/<endpoint>' \
  -H 'x-tggl-api-key: <api key>'
```

## Endpoints
### Evaluating flags

The `/flags` endpoint allows you to send a context object serialized as JSON and retrieve all active flags for that context.
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

The response includes active flags only. To check if a flag is active or not (for that given context) 
simply check if the key exists. 

Most of the time, checking if a key exists is enough, but if you want to do A/B/C tests or
if you use flags to set values in your app, you might need to read the flag's value.

- `flagA` is **active**, and its value is `null`. 
- `flagB` is **inactive**, deleted, or maybe it just does not exist.
- `flagC` is **active**, and its value is `"foo"`
- `flagD` is **active**, and its value is `false`

:::tip
It might be tempting to think that values of `null` or `false` means that the flag is inactive, but it is not.
Inactive flags are just not in the response, there might be a few reasons for that:
- The flag does not exist, it was never created
- The flag exists but is archived
- The flag exists but it is inactive (the main switch is off on the app)
- The flag exists, it is active, but for that particular context the conditions make it fall into the inactive variation
:::

### Evaluating flags in batches

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
