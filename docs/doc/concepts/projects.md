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