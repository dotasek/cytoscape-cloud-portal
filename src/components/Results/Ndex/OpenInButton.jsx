import React from 'react'
import './style.css'

import Button from '@material-ui/core/Button'
import logo from '../../../assets/images/cytoscape-logo.svg'
import { withStyles } from '@material-ui/core'

const styles = theme => ({
  buttonIcon: {
    height: '2.5em',
    paddingLeft: '0.5em'
  }
})

const OpenInButton = (props) => {
  const { classes, uiState, network } = props

  console.log(props)

  const handleImportNetwork = () => {
    props.cyrestActions.importNetworkStarted(network.uuid)
  }

  return (
    <Button
      variant="contained"
      color="default"
      disabled={!uiState.isCytoscapeRunning}
      onClick={handleImportNetwork}
    >
      Open in
      <img src={logo} className={classes.buttonIcon} />
    </Button>
  )
}

export default withStyles(styles)(OpenInButton)
