import React, { useEffect } from 'react'
import './style.css'

import { Typography } from '@material-ui/core'

const StartPanel = props => {
  useEffect(() => {
    
    
    return () => {
      console.log('Page unmounted')
    }
  }, [])

  return (
    <div className="ndex-container">
      <Typography variant="h5">Hello there.</Typography>
    </div>
  )
}

export default StartPanel
