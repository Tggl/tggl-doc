---
sidebar_position: 3
description: For PHP backend
---

# PHP
## Installation
Install the `tggl/client` package:
```
composer require tggl/client
```

## Quick start

Instantiate a client with your API key and call `evalContext` to evaluate a context. A single API call evaluating all flags is performed, making all subsequent flag checking methods extremely fast.

This means that you do not need to cache results of isActive and get since they do not trigger an API call, they simply look up the data in the already fetched response.

```php
use Tggl\Client\TgglClient;

// Some class to represent your context
class Context {
  $userId;
  $email;
}

$client = new TgglClient('YOUR_API_KEY');

// An API to Tggl is performed here
$flags = $client->evalContext(new Context());

if ($flags->isActive('my-feature')) {
  // ...
}

if ($flags->get('my-feature') === 'Variation A') {
  // ...
}
```

## Evaluating contexts in batches

If you have multiple contexts to evaluate at once, you can batch your calls in a single HTTP request which is much more performant:

```php
$result = await $client->evalContexts([
  new Context('foo')
  new Context('bar')
]);

// Responses are returned in the same order
$fooFlags = $result[0];
$barFlags = $result[1];
```

## `isActive` vs `get`

By design, you have no way of telling apart an inactive flag, a non-existing flag, a deleted flag, or a network error.
This design choice prevents anything from breaking your
app by just deleting a flag, messing up the API key rotation, or any other unforeseen event, it will simply consider any flag to be inactive.

:::tip
Do not use `get` if you simply want to know if a flag is active or not, use `isActive` instead.
:::

`get` gives you the value of an active flag, and this value may be "falsy" (null, false, 0, or empty string), leading to unexpected behaviors:

```php
if ($flags.get('my-feature')) {
  // If 'my-feature' is active, but its value is falsy this block won't be executed
}

if ($flags.isActive('my-feature')) {
  // Even if 'my-feature' has a falsy value, this block will be executed
}
```

## Evaluate flags locally

It is possible to evaluate flags locally on the server but not recommended unless you have performance issues evaluating flags at a high frequency. Evaluating flags locally forces you to maintain the copy of flags configuration up to date and might be a source of issues.

:::danger
Make sure to [add the right keys to your context](../../api/local-flags-evaluation#important-differences-with-the-api) to be perfectly consistent with the Tggl API.
:::

```php
use Tggl\Client\TgglLocalClient;

$client = new TgglLocalClient('YOUR_SERVER_API_KEY');

// This method performs an API call and updates the flags configuration
$client->fetchConfig();

// Evaluation is performed locally
$client->isActive(new Context(), 'my-feature')

// You can also get the value of a flag, with and without default value
$client->get(new Context(), 'my-feature')
$client->get(new Context(), 'my-feature', 42)
```

When evaluating flags locally it is your responsibility to keep the configuration up to date by calling `fetchConfig` when needed. You can use [webhooks](../../api/webhooks) to be notified when the configuration changes.

You can cache the configuration and instantiate the client with the cached version, so you don't need to call fetchConfig:

```php
$cachedConfig = $client->fetchConfig();

// Create another client with the cached config
$client = new TgglLocalClient('YOUR_SERVER_API_KEY', [
  'config' => $cachedConfig
]);
```