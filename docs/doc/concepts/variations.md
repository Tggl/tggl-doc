---
sidebar_position: 3
---

# Variations

## Overview

Variations are a way to create multiple versions of a single feature. Most 
feature only have 2 variations: enabled and disabled for toggling a feature, or 
green and blue for testing the color of a button. However, sometimes you 
may want to have more than 2 variations.

For instance, you may want to test 3 different colors for a button: green, 
blue, and red. Or you may want to limit the number of seats to 3, 5, 10, or 50. You are not 
limited in the number of variations you can create.

For each flag you can choose which variation to display based on conditions. Here we have a _Live_ and an _Off_ variation to choose from:

<Image img={require('./assets/selecting-variation@2x.png')} />

## Managing a feature flag's variations

From the feature flags menu, select a flag and go to the **Variations** tab. From there you can manage this particular flag's variations.
<Image img={require('./assets/variations-tab@2x.png')} bottom />

It is recommended to give each variation a name and description that is meaningful to you and your teammates. This will make it easier to understand what each variation is.

## Who is supposed to set up variations?

It is usually the job of the **engineering** team to set up variations for a given flag. If the developers create three versions of the feature in the code (let's say three different places to display the purchase button) they will have to create those three variations on Tggl as well. By doing this, they delegate the responsibility of deciding which variation to display to which user to the product team.

The only exception would be for [remote config](../use-cases/remote-config), developers do not care which value the flag returns (it could be a color,  a wording, or anything else). In that case it would be the **product** team's role to create the variations. If the product want to test 4 different wordings, they would create 4 variations.

## Active vs Fallback variations

Variations are split in two categories: _Active_ and _Fallback_. The Active variation is what the code will receive when a specific condition returns this variation. You can have as many Active variations as needed depending on your use-case.

The Fallback variation is a bit different. The code will still receive the Fallback variation when it is returned by a specific condition, but also if anything goes wrong during the flags evaluation process. Things that can go wrong include:

- The flag has been deleted or archived
- The flag was de-activated
- The user has network issues
- The Tggl SDK is initialized with the wrong API key

In any of those situation, the code will receive the Fallback variation. It is therefore recommended to choose a variation that you actually want to fall back to in those circumstances.

In practice, if you are rolling out a feature to 5% of your users, the Fallback variation should be "feature is hidden" and the Active variation should be "feature is visible". If anything goes wrong, the feature will be hidden for all users, which is better than having your new feature suddenly available for everyone.

## Variation with values

If you have multiple active variations, you need to add values to each one to be able to differentiate them in the code. Simply select the type of value you wish to use and enter a value for each variation. 

Tggl supports strings, numbers, boolean, and JSON values.

<Image img={require('./assets/variation-values@2x.png')} right center />

## How to use variations in your code?

:::info
You can use any of our [SDK](../../developers/sdks) to get started quickly, in this example we are going to use the Javascript SDK.
:::

The first thing you can do is test if a flag falls into an active variation or not for a given user:

```js
await client.setContext({ userId: 'foo' })

if (client.isActive('my_feature')) {
  // Active variation
} else {
  // Fallback variation
}
```

And if you add values to your variations, you can retreive the value of the variation the user falls into. Let's assume you set up your variations like so for an AB test:
<Image img={require('./assets/variations-ab-test@2x.png')} />

```js
await client.setContext({ userId: 'foo' })

if (client.get('my_feature') == 'A') {
  // Variation A
} else if (client.get('my_feature') == 'B') {
  // Variation B
} else {
  // Fallback variation
}
```