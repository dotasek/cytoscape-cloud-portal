import React, { useEffect } from 'react'
import './style.css'

import { withStyles } from '@material-ui/core/styles'

import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'

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
  gridListDiv: {
    width: '90%',
    'padding-left': '16px',
    'margin-bottom': '72px',
    'padding-right': '16px',
    alignItems: 'center'
  },
  gridListTile: {
    overflow: 'hidden',
    height: '156px'
  },
  gridListTileDiv: {
    'background-color': 'rgba(0,0,0,0.05)',
    padding: '8px'
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0) 100%)'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
})

const RecentNetworkGrid = props => {
  const selectNetwork = networkUUID => {
    props.ndexUiStateActions.setCurrentNetwork({
      currentNetworkUUID: networkUUID
    })
  }

  useEffect(() => {
    if (
      props.profiles.selectedProfile &&
      props.ndexUiState.myNetworks == undefined
    ) {
      props.ndexUiStateActions.getMyNetworksStarted()
    }
    return () => {}
  }, [
    props.profiles.selectedProfile,
    props.ndexUiState.myNetworks,
    props.ndexUiState.network
  ])

  const { classes, ndexUiState } = props
  const { myNetworks } = ndexUiState

  return myNetworks ? (
    <div className={classes.gridListDiv}>
      <GridList
        cellheight="auto"
        cols={4}
        className={classes.gridList}
        spacing={16}
      >
        <GridListTile key="Subheader" cols={4} style={{ height: 'auto' }}>
          <ListSubheader component="div" align="center">
            Recent Networks
          </ListSubheader>
        </GridListTile>
        {myNetworks
          .slice(0, myNetworks.length > 8 ? 8 : myNetworks.length)
          .map(network => (
            <Link
              component={RouterLink}
              to={'/ndexAccount'}
              key={network.externalId}
              underline="none"
              onClick={() => selectNetwork(network.externalId)}
            >
              <GridListTile
                key={network.externalId}
                className={classes.gridListTile}
              >
                <div className={classes.gridListTileDiv}>
                  <Typography variant="subtitle1">{network.name}</Typography>
                  {network.description && (
                    <Tooltip title={network.description} placement="bottom">
                      <Typography variant="caption" noWrap={true}>
                        {network.description}
                      </Typography>
                    </Tooltip>
                  )}
                  <Typography variant="caption" color="inherit">
                    Nodes: {network.nodeCount} <br />
                    Edges: {network.edgeCount} <br />
                    Last Modified:{' '}
                    {new Date(network.modificationTime).toDateString()} <br />
                    {network.version && 'Version:' + network.version}
                  </Typography>
                </div>
                <Tooltip
                  title="Click to view in 'My Networks'"
                  placement="bottom"
                >
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
              </GridListTile>
            </Link>
          ))}
      </GridList>
    </div>
  ) : null
}
export default withStyles(styles)(RecentNetworkGrid)
