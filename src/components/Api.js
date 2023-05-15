import React from 'react'
import './Image.css'
import './api.css'

export const Api = ({ method, url }) => {
  return <span className="api-endpoint"><span>{method}</span>{url}</span>
}