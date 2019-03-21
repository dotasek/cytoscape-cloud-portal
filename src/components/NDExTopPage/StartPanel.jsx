import React, { useEffect } from 'react'
import Split from 'react-split'
import './style.css'
import Ndex from './Ndex'
import { Typography } from '@material-ui/core'

const StartPanel = props => {
  useEffect(() => {
    console.log('NDEx StartPanel useEffect')

    if (props.ndexUiState.myNetworks == undefined) {
      console.log('getMyNetworks start')
      props.ndexUiStateActions.getMyNetworksStarted()
    }

    return () => {
      console.log('Page unmounted')
    }
  }, [props.ndexUiState.myNetworks])

  const results = props.ndexUiState.myNetworks
  const sourceUUID = '0'

  return (
    <div className="ndex-container">
      {console.log('NDEx StartPanel render')}
      <Typography>My Networks</Typography>
      <Ndex hits={results} sourceUUID={sourceUUID} {...props} />
    </div>
  )
}

export default StartPanel
