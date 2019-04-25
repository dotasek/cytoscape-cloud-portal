import React, { useEffect } from 'react'
import './style.css'

import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
})

const RecentNetworkGrid = props => {
  useEffect(() => {
    if (props.profiles.selectedProfile && props.ndexUiState.myNetworks == undefined) {
      props.ndexUiStateActions.getMyNetworksStarted()
    }
    return () => {}
  }, [props.profiles.selectedProfile, props.ndexUiState.myNetworks])

  const { classes, ndexUiState } = props
  const { myNetworks } = ndexUiState
  const tileData = []

  return myNetworks ? (
    <GridList cellHeight={180} className={classes.gridList}>
      <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
        <ListSubheader component="div">Recent Networks</ListSubheader>
      </GridListTile>
      {tileData.map(tile => (
        <GridListTile key={tile.img}>
          <img src={tile.img} alt={tile.title} />
          <GridListTileBar
            title={tile.title}
            subtitle={<span>by: {tile.author}</span>}
            actionIcon={
              <IconButton className={classes.icon}>
                <InfoIcon />
              </IconButton>
            }
          />
        </GridListTile>
      ))}
    </GridList>
  ) : null
}
export default withStyles(styles)(RecentNetworkGrid)
