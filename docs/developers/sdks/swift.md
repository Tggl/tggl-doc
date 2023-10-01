---
sidebar_position: 6
pagination_prev: null
pagination_next: null
---

# Swift

## Installation
To install the Tggl SDK:


1. In your Xcode project go to File -> Swift Packages -> Add Package Dependency
2. Paste the GitHub link: `https://github.com/Tggl/swift-tggl-client`
3. Select "Branch" and enter `main`


Xcode will find and install the Tggl SDK and add it to your dependencies in the file explorer of your project.

## Quick start

Instantiate a new client with your api key, you can find your API key in the Tggl dashboard.

```swift
import TgglClient

let client = TgglClient.TgglClient(apiKey: "YOUR_API_KEY")

func ready() {
    // Flags are ready
}

client.setContext(context: [
    "userId": "123",
    "email": "foo@gmail.com",
    "plan": "PRO"
], completionHandler: ready)
```

`setContext` should be called everytime the context changes, for example when a user logs in or changes plan. This will trigger an API call to Tggl and fetch the latest flags for the user, you can pass an optional callback to be notified when flags are ready.

You can then check flag results:

```swift
if client.isActive(slug: "feature_1") {
    // Do something
}
```

This check is synchronous and will not trigger an API call, it will simply look up the data in the already fetched response.

Additionally, you can get the value of a flag:

```swift
if client.get(slug: "feature_1") == "Variation A" {
    // Do something
}
```

:::info
Do not use `get` if you simply want to know if a flag is active or not, use `isActive` instead. `get` might return `nil` if the flag is inactive or if the flag is active but has no value.
:::