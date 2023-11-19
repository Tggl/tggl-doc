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

<Image img={require('./assets/new-context-property@2x.png')} bottom padding="s" />

From this modal you can create the property you want, here we created a 
version number for our Android app that will allow us to display a 
fullscreen message on deprecated app versions.

<Image img={require('./assets/create-context-property-modal@2x.png')} />

The name and type are used by Tggl to display the list of properties to pick 
from and the corresponding operator on the app. Because we selected the type 
version, we have the _min version_, _max version_, and _exact version_ 
operators that we can choose from. If we had chosen a date type, we would 
have date operators available, and so on.

<Image img={require('./assets/in-app-version@2x.png')} />

The context key is used within the code of your app to pass the right value:
```ts
await client.setContext({
  version: '3.10.2',
  // Other context properties like userId, email...
})
```
## How to edit a context property?

In Tggl, editing a context property allows you to modify its name, key, type, and description. To do so, simply click on the three dots **“(...)”** located at the right side of the context property you want to edit, then **“Edit”.** 

A modal will appear, allowing you to modify the context property. When you’re done, simply click on the "Update" button to save the changes to the context property.

:::caution 
You can only edit the name and description for built-in properties.
:::


## How to delete a context property?

To delete a context property, simply click on the three dots **“(...)”** located at the right side of the context property you want to delete, then **“Delete”.** 

:::caution
You cannot delete built-in context properties.
Moreover, if your context property is used by a flag, you will not be able to delete. You can either update this flag and delete this property then, or hide this property now to simplify setting up new flags.
:::

## How to hide a context property?

To delete a context property, simply click on the three dots **“(...)”** located at the right side of the context property you want to delete, then **“Hide”.** 

Once you hide a context property it won’t appear neither on your context tab nor on your flag conditions.

## How to search for a context property?

To search for a context property, you can either : 

- use the filter visibility (visible / hidden) and usage (used / not used)
- use the search bar searching by name, key, type or description;
- order the columns by clicking on the columns name

## Troubleshooting

- **I can’t find my context in my flag conditions** 
⇒ It means someone made the context unusable by marking it as “hidden”.

- **I can’t find my context in the Context tab** 
⇒ The context is hidden: remove the filter “visibility” to unveil the hidden contexts

- **I removed the filter “visibility” but I still can’t find my context** 
⇒ Are you on the right project ? Contexts are not shared across projects. They need to be re-created separately. Try switching projects or recreating your context in this project if needed.