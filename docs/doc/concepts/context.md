---
sidebar_position: 2
---

# Context

## Overview

The context is a simple JSON object, it is the data that each application 
uses to identify the current 
user. This data can then be used to target specific users or groups of users 
from the Tggl app. 

For instance, if you want to enable a feature for all users with an email 
ending in `@acme.com`, the application must pass the user's email to the 
context. And if you want the feature to be only available to user with the 
pro plan, your must app pass the plan of the user as a property of the context.

## Default properties

By default, new projects on Tggl come with a
few properties:
- `userId`: The ID of the user in your database
- `email`: The email of the user
- `environment`: The environment the user is in (staging, production, etc.)

Some properties are also automatically added to the context based on HTTP 
headers of the request (eg. `userAgent`, `ip`, `referer`, etc...). You can see 
the full list of properties in you 
[dashboard](https://app.tggl.io/projects/default/context).

Additionally, you can add any custom property you want to the context right 
from your dashboard. 

## What properties should I add to the context?

You want to add any data that is relevant to your application and that you 
want to use to segment users. Good candidates are:
- **Country**: You can use this to enable features for specific countries, or 
  rollout a new feature country by country.
- **Device ID**: Very useful on mobile apps to uniquely identify users that may 
  not be logged into your app and don't have a user ID.
- **Session ID cookie**: If you have a session ID cookie, you can use it to 
  identify users that are not logged in.
- **App version**: Extremely useful to target specific version of your mobile 
  app, or to display updates-related messages to users that still have an 
  old version of your app.
- **Plan**: If your service offers different tiers of plans, you can use this 
  to enable features for specific plans only.
- **Organization ID**: If your service is used by organizations, you can use 
  this to enable features for specific organizations, this way all users of 
  that organization will have the same set of features enabled.

You are not limited in the number of properties you can add to the context, 
it is only a matter of business decisions. 

## How to add a property to the context?

Start by adding it to the Tggl app. Since context are [project](./projects) 
specific, first select the project you want to add the property to, then 
from the context menu hit _New_:

<Image img={require('./assets/new-context-property@2x.png')} bottom 
padding="s" />

From this modal you can create the property you want, here we created a 
version number for our Android app that will allow us to display a 
fullscreen message on deprecated app versions.

<Image img={require('./assets/create-context-property-modal@2x.png')}
padding="l" />

The name an type are used by Tggl to display the list of properties to pick 
from and the corresponding operator on the app. Because we selected the type 
version, we have the _min version_, _max version_, and _exact version_ 
operators that we can choose from. If we had chosen a date type, we would 
have date operators available, and so on.

<Image img={require('./assets/in-app-version@2x.png')} padding="l" />

The context key is used within the code of your app to pass the right value:
```ts
await client.setContext({
  version: '3.10.2',
  // Other context properties like userId, email...
})
```