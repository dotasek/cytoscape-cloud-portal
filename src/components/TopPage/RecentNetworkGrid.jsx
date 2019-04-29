import React, { useEffect } from 'react'
import './style.css'

import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton'
import LaunchIcon from '@material-ui/icons/Launch'

import no_image from '../../assets/images/ndex-logo.svg'

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
    'margin-top': '2em',
    'padding-bottom': '76px'
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
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
      cellheight={128}
      cellwidth={154}
      cols={4}
      className={classes.gridList}
    >
      <GridListTile key="Subheader" cols={4} style={{ height: 'auto' }}>
        <ListSubheader component="div" align="center">Recent Networks</ListSubheader>
      </GridListTile>
      {myNetworks
        .slice(0, myNetworks.length > 8 ? 8 : myNetworks.length)
        .map(network => (
          <GridListTile
            key={network.externalId}
            onClick={val => handleRecentNetworkClick(network.externalId)}
          >
            <Tooltip title="Click to view in 'My Networks'" placement="bottom">
              <GridListTileBar
                actionIcon={
                  <IconButton className={classes.icon}>
                    <LaunchIcon />
                  </IconButton>
                }
                title=""
                titlePosition="bottom"
                className={classes.titleBar}
              />
            </Tooltip>
            <Typography variant="subtitle1">{network.name}</Typography>
            {network.description && (
              <Typography variant="caption">{network.description}</Typography>
            )}
            <Typography variant="caption" color="inherit">
              Nodes: {network.nodeCount} <br />
              Edges: {network.edgeCount} <br />
              Last Modified: {new Date(network.modificationTime).toDateString()} <br />
              Version: {network.version}
            </Typography>
          </GridListTile>
        ))}
    </GridList>
  ) : null
}
export default withStyles(styles)(RecentNetworkGrid)
