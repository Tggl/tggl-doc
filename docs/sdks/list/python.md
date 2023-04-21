---
sidebar_position: 3
description: For Python code
---

# Python
## Installation
Install the `tggl` package:
```
pip install tggl
```

## Quick start

Start by creating a client using your API key and use it to evaluate contexts:

```python
from tggl import TgglClient

client = TgglClient('<Your API key>')

flags = client.eval_context({
    'user_id': 123,
    'email': 'foo@gmail.com',
    'plan': 'PRO'
})
```

You can then check flag results:
```python
# On/Off flags
if (flags.is_active('feature_1')):
    print('Feature 1 is active')

# A/B tests
if (flags.get('feature_2') == 'Variation A'):
    print('Should display variation A to user')

# A/B test with default value
if (flags.get('feature_2', 'Variation A') == 'Variation B'):
    print('Should display variation B to user')
```

A single API call evaluating all flags is performed when calling
`eval_context`,
making all subsequent flag checking methods extremely fast.

This means that you do not need to cache results of `is_active` and `get` since
they do not trigger an API call, they simply look up the data in the already fetched response.

### `is_active` vs `get`

By design, you have no way of telling apart an inactive flag, a non-existing flag, a deleted flag, or a network error. 
This design choice prevents anything from breaking your
app by just deleting a flag, messing up the API key rotation, or any other unforeseen event, it will simply consider any flag to be inactive.

:::tip
Do not use `get` if you simply want to know if a flag is active or not, use `is_active` instead.
:::

`get` gives you the value of an active flag, and this value may be "falsy" (None, False, 0, or empty string), leading to unexpected behaviors:

```python
if (flags.get('my_feature')):
    # If 'my-feature' is active, but its value is falsy this block won't be executed

if (flags.isActive('my_feature')):
    # Even if 'my-feature' has a falsy value, this block will be executed
```
