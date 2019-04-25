import React, { useEffect } from 'react'
import './style.css'

import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import LaunchIcon from '@material-ui/icons/Launch'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: '100%',
    'padding-left': '2em',
    'padding-right': '2em',
    'padding-top': '2em'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
})

const RecentNetworkGrid = props => {
  useEffect(() => {
    if (
      props.profiles.selectedProfile &&
      props.ndexUiState.myNetworks == undefined
    ) {
      props.ndexUiStateActions.getMyNetworksStarted()
    }
    return () => {}
  }, [props.profiles.selectedProfile, props.ndexUiState.myNetworks])

  const { classes, ndexUiState } = props
  const { myNetworks } = ndexUiState

  const handleRecentNetworkClick = networkUUID => {
    props.history.push('/ndexAccount#' + networkUUID)
  }

  return myNetworks ? (
    <GridList
      cellHeight={128}
      cellWidth={154}
      cols={4}
      className={classes.gridList}
    >
      {myNetworks
        .slice(0, myNetworks.length > 8 ? 8 : myNetworks.length)
        .map(network => (
          <GridListTile
            key={network.externalId}
            onClick={val => handleRecentNetworkClick(network.externalId)}
          >
            <img />
            <GridListTileBar
              title={network.name}
              subtitle={<span>Version: {network.version}</span>}
              actionIcon={
                <IconButton className={classes.icon}>
                  <LaunchIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
    </GridList>
  ) : null
}
export default withStyles(styles)(RecentNetworkGrid)
