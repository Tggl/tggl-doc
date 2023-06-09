import React from 'react'
import './Button.css'
import clx from 'classnames'
import Link from '@docusaurus/Link';

export const Button = ({ children, to }) => {
  return (
    <Link className="button" to={to}>
      {children}
    </Link>
  )
}