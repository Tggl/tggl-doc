import React, {useEffect, useState} from 'react'
import './Image.css'
import clx from 'classnames'
import {useInView} from 'react-hook-inview'

export const Image = ({alt, img, top, left, right, bottom, center, padding = 'm', density = 2}) => {
  const [ref, inView, entry] = useInView({unobserveOnEnter: true})
  const [src, setSrc] = useState(null)

  const largestImg = img.src.images[img.src.images.length - 1]

  useEffect(() => {
    if (inView) {
      setSrc((img.src.images.find(i => i.width >= entry.boundingClientRect.width * window.devicePixelRatio) ?? largestImg).path)
    }
  }, [inView])

  const content = (
    <div className={clx('image-background', {top, left, right, bottom})}
         style={{
           '--image-padding-x': {s: 30, m: 50, l: 90}[padding],
           '--image-padding-y': {s: 20, m: 35, l: 50}[padding],
         }}>
      <div className="image-container" style={{backgroundImage: `url("${img.preSrc}")`}}>
        <img
          ref={ref}
          src={src}
          width={largestImg.width / density}
          height={largestImg.height / density}
        />
      </div>
    </div>
  )

  if (center) {
    return (
      <div className="image-centered-container">
        {content}
      </div>
    )
  }

  return content
}