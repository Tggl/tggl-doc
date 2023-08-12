---
sidebar_position: 4
---

# Webhooks

You can register webhooks on Tggl to call endpoints of your choice when a 
flag is updated. You can customize the URL and headers of the request.

Webhooks are mainly useful for two use-cases:
- Monitor changes on flags and display a vertical indicator on your 
  charts to correlate metric changes with flags updates.
- Maintain a cache of you flags configuration up-to-date to evaluate flags 
  locally without doing any API calls.

In both cases it is up to you to implement the logic on your side.

## When are webhooks called?

All webhooks of your organization are called when a flag is updated in any 
of you projects.

If you want to be notified only when a flag is updated in a specific project,
you have to implement some logic on your side by checking the content of the 
[request's body](#request-body).

## Authentication

You must use a header to authenticate the request. Most of the time you will 
probably want to use an `Authorization` header with a `Bearer`:

<Image img={require('./assets/webhook-auth@2x.png')} />


## Request body

The request is always a `POST` to the endpoint you specified with the following 
body format:

```json
{
  "flagSlug": "my_feature",
  "userEmail": "john.doe@gmail.com",
  "projectSlug": "my_project"
}
```

The `flagSlug` key is the slug of the flag that was updated, you can find it 
on the app:

<Image img={require('./assets/flags-slugs@2x.png')} />

The `projectSlug` key is the slug of the project of the flag and can also be 
found on the app:

<Image img={require('./assets/project-slug@2x.png')} />

## Debugging

You can debug your webhooks by sending a test request to your endpoint and 
displaying the list of calls. For each call you can inspect the request and 
the response.

<Image img={require('./assets/webhook-runs@2x.png')} bottom />
