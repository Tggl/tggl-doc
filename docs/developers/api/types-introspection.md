---
sidebar_position: 5
---

# Types introspection

Types introspection allows you to retrieve the list of all flags and their variations, as well as the list of all context properties. This endpoint is used by the Tggl CLI to generate the TypeScript types but can be used for other purposes you might have.

The <Api method="GET" url="/typing" /> endpoint returns a JSON object containing the following properties:

```json
{
  "flags": {
    "flag_a": [
      "A",
      "B"
    ],
    "flag_b": [
      null
    ]
  },
  "context": {
    "timestamp": {
      "type": "DATE",
      "hidden": false
    },
    "userId": {
      "type": "STRING",
      "hidden": true
    },
    "environment": {
      "type": "SELECT",
      "hidden": false,
      "options": [
        {
          "value": "development"
        },
        {
          "value": "staging"
        },
        {
          "value": "production"
        }
      ]
    }
  }
}
```

## Flags and variations
In the example above, flag `flag_a` can  have either values A or B when active, and flag `flag_b` has a value of null when active ([Read more](api-flags-evaluation#evaluating-a-single-context) about flag values).

The value of each flag is an array of all active [variation](../../doc/concepts/variations.md) values the flag has, they can be any JSON value including arrays and objects.

## Context properties

Context [properties](../../doc/concepts/context) are listed with their type. Each type is represented by a JSON value in the context, for instance the `VERSION` type is represented by a string, the `DATE` type is represented by a number or a string, etc. Some types have additional options like the `SELECT` type which has a list of possible values.

In addition to the type, each property has a `hidden` boolean property which indicates whether the property has been hidden or not from the dashboard.

|Type|Represented by|Options|
|-|-|-|
|`STRING`|`string`||
|`VERSION`|`string`||
|`PHONE`|`string`||
|`USER_AGENT`|`string`||
|`IP`|`string`||
|`LANGUAGE`|`string`||
|`COUNTRY`|`string`||
|`CURRENCY`|`string`||
|`NUMBER`|`number`||
|`STRING_ARRAY`|`string[]`||
|`DATE`|<code>string &#124; number</code>||
|`BOOLEAN`|`boolean`||
|`SELECT`|`string`|`{ options : { value: string }[] }`|

## Command line interface

You can use the Tggl CLI to generate the TypeScript types for your flags and context.

```bash
# Install the CLI once
npm i --save-dev tggl-cli

# Generate the types every time that it is needed
tggl typing -k <SERVER_API_KEY> -o src/tggl.d.ts

# Drop the -k option if you have the TGGL_API_KEY environment variable set
tggl typing -o src/tggl.d.ts
```

Specifying an output file using the `-o` option that ends with `*.d.ts` will generate a TypeScript declaration file for the [Node.js SDK](../sdks/node).

If you decide not to use the SDK you can specify a simple `*.ts` file to only generate the interfaces.