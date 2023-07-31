import React, {useEffect, useState} from 'react'
import './Video.css'
import {useInView} from 'react-hook-inview'
import ReactPlayer from 'react-player/file'

export const Video = ({ src }) => {
  const [ref, inView, entry] = useInView()

  console.log(inView)

  return (
    <div className="video-container" ref={ref}>
      <ReactPlayer url={src.default} controls playing={inView} loop />
    </div>
  )
}