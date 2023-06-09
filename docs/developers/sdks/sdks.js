import React from 'react';
import {Card} from '@site/src/components/Card'
import './sdks.css'
import Link from '@docusaurus/Link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export const SDKs = () => {
  return (
    <Card>
      <div className="sdk-list">
        <Link to="node">
          <FontAwesomeIcon icon="fa-brands fa-node-js" size="2xl" />
          Node.js
        </Link>
        <Link to="react">
          <FontAwesomeIcon icon="fa-brands fa-react" size="2xl" />
          React
        </Link>
        <Link to="php">
          <FontAwesomeIcon icon="fa-brands fa-php" size="2xl" />
          PHP
        </Link>
        <Link to="python">
          <FontAwesomeIcon icon="fa-brands fa-python" size="2xl" />
          Python
        </Link>
      </div>
    </Card>
  )
}