---
sidebar_position: 1
---

# Projects

## Overview

Projects are a way for your team to organize and group features. It is 
recommended to have one project per application or service since each 
project has its own set of environments, features, and properties.

If your company has a web application, an iOS application, and an Android 
application, you probably want three different projects: 
- On the mobile apps you have access to OS specific data (eg. device ID) that 
  are not available on the web application. And on the web 
  application you probably have access to other data that is specific to 
  your web app. 
- You probably have a completely different set of features you want to 
  control on each application.
- The environments are probably different too (staging, production, etc.).
- Different teammates are working on different projects

## When *not* to create a new project

:::tip
You should not create a new project just to have another [environment](../use-cases/environments) (production, staging, locale...), domain name, app version... you can simply [add a property to the context](./context) instead.
:::

Doing so will allow you to write your flags only once and reuse them across all your environments / domains. You will be able to conditionally enable each flag for a specific domain, environment or app version.