import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import {Image} from '@site/src/components/Image';
import {Api} from '@site/src/components/Api';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Image,
  Api,
};