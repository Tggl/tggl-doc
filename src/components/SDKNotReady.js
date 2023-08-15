import React from 'react'
import { Button } from './Button'

export const SDKNotReady = ({ name }) => {
  return (
    <>
      <p>We appreciate your interest in our {name} SDK, designed to get you started in less than 3 minutes with Tggl.</p>

      <p>At present, we regret to inform you that the {name} SDK is not yet available for integration. However, we are pleased to announce that its development is on our roadmap. The prioritization of the {name} SDK largely depends on the needs of our existing and new customers. We anticipate its readiness within approximately one week from the moment it is assigned priority status.</p>

      <p>We thank you for your patience and look forward to delivering a robust and feature-rich {name} SDK to empower your development endeavors.</p>

      <p><Button to="https://tidycal.com/nicolaskeller/30-minutes-meeting">Request it now</Button> (takes approximately one week)</p>
    </>
  )
}