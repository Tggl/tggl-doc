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
ending in `@acme.com`, the application must add the user's email to the 
context.

## Default properties

By default, new projects on Tggl come with a
few properties:
- `userId`: The ID of the user in your database
- `email`: The email of the user
- `environment`: The environment the user is in (staging, production, etc.)

Some properties are also automatically added to the context based on HTTP 
headers of the request (eg. `userAgent`, `ip`, `referer`, etc.). You can see 
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
- **Plan**: If your service offers different tiers of plans, you can use this 
  to enable features for specific plans only.
- **Organization ID**: If your service is used by organizations, you can use 
  this to enable features for specific organizations, this way all users of 
  that organization will have the same set of features enabled.

You are not limited in the number of properties you can add to the context, 
it is only a matter of business decisions. 