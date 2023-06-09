import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import {Image} from '@site/src/components/Image';
import {Api} from '@site/src/components/Api';
import {Card} from '@site/src/components/Card';
import {Button} from '@site/src/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component.
import { library } from '@fortawesome/fontawesome-svg-core'; // Import the library component.
import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brands icons.
library.add(fab);

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Image,
  Api,
  Card,
  Button,
  icon: FontAwesomeIcon
};