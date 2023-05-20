---
sidebar_position: 4
---

# Remote config

## Overview

Usually, changing a simple configuration value in your application requires changing a config file in the codebase and triggering a new release. Not only does does it have a negative impact the productivity of your team, but it also takes quite a long time to go from "wanting the change to be made" all the way to "seeing hte change in production".

Remote config allows developers and non-technical people alike to modify various aspects of your app without requiring any code change or lengthy deployment process. It provides flexibility and enables real-time configuration changes, allowing you to control the application's behavior, appearance, and other parameters remotely.


Remote config is commonly used in mobile app development, where deployment cycles are extremely slow and expensive, needing to be validated by Apple or Google, and then waiting for your users to update the app which you can never really control. Remote config allows you to change the app's behavior instantly, without requiring users to update their software at all.

## Manage unsupported mobile app versions

Remote config can be used to manage unsupported mobile app versions. For example, if you have a mobile app, and you decide to drop support for old app version by introducing a breaking change in the backend, you can use remote config to display a message to users who are using an older version of the app, asking them to update via the app store.

This can be achieved very easily by making your app pass an app version to the [context](../concepts/context), and creating a flag that uses that version to determine whether the app is supported or not.

<Image img={require('./assets/app-version@2x.png')} />

## Control plan limits

You can leverage remote config to control plan limits. For example, if you have a starter plan that allows users to create up to 5 projects and a pro plan that goes up to 20, you can use remote config to change that limit without requiring any code change. You could even set different limits for different users specifically.

To achieve this, create as many [variations](../concepts/variations) as needed and add conditions based on the plan. In the following example we set a limit of 5 for the starter plan, 20 for the pro plan, and made an exception to 7 for a specific user regardless of its plan.

<Image img={require('./assets/plan-limit@2x.png')} />
