import React from 'react'
import './Card.css'
import clx from 'classnames'

export const Card = ({ children }) => {
  return (
    <div className="custom-card margin-bottom--md">
      {children}
    </div>
  )
}