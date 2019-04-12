import React, { useEffect } from 'react'

import './style.css'
import MyNetworks from './MyNetworks'
import { Typography } from '@material-ui/core'

const StartPanel = props => {
  useEffect(() => {
    console.log('NDEx StartPanel useEffect')

    if (props.ndexUiState.myNetworks == undefined) {
      console.log('getMyNetworks start')
      props.ndexUiStateActions.getMyNetworksStarted()
    }

    return () => {
      console.log('My Networks unmounted')
      props.networkActions.networkClear()
    }
  }, [props.ndexUiState.myNetworks])

  const results = props.ndexUiState.myNetworks
  const sourceUUID = '0'

  return (
    <div className="ndex-container">
      {console.log('NDEx StartPanel render')}
      <Typography variant="h3" align="left">My Networks</Typography>
      <MyNetworks hits={results} sourceUUID={sourceUUID} {...props} />
    </div>
  )
}

export default StartPanel
