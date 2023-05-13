import React from 'react'
import './Image.css'
import clx from 'classnames'
import IdealImage from '@theme/IdealImage'

export const Image = ({alt, img, top, left, right, bottom, center, padding = 'm', ...rest}) => {
  const content = (
    <div className={clx('image-background', {top, left, right, bottom})}
         style={{
           '--image-padding-x': {s: 30, m: 50, l: 90}[padding],
           '--image-padding-y': {s: 20, m: 35, l: 50}[padding]
         }}>
      <IdealImage alt={alt} img={img} {...rest} />
    </div>
  )

  console.log(img)

  if (center) {
    return (
      <div className="image-centered-container">
        {content}
      </div>
    )
  }

  return content
}