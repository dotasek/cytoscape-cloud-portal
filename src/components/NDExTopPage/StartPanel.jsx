import React, { useEffect } from 'react'
import Split from 'react-split'
import './style.css'
import Ndex from './Ndex'
import { Typography } from '@material-ui/core'

const StartPanel = props => {
  useEffect(() => {
    props.ndexUiStateActions.getMyNetworksStarted()

    return () => {
      console.log('Page unmounted')
    }
  }, [])

  const results = props.ndexUiState.myNetworks
  const sourceUUID = '0'

  return (
    <div className="ndex-container">
      <Typography>My Networks</Typography>
      <Ndex hits={results} sourceUUID={sourceUUID} {...props} />
    </div>
  )
}

export default StartPanel
