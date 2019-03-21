import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import MenuList from '@material-ui/core/MenuList'

import * as cyRESTApi from '../../../api/cyrest'
import './style.css'
import Sorter from './Sorter'
import MenuItem from '@material-ui/core/MenuItem'
import no_image from '../../../assets/images/no_image.png'

const NETWORK_SIZE_TH = 5000

const styles = theme => ({
  inline: {
    display: 'inline'
  },
  subtitle: {
    marginLeft: '1em',
    marginTop: '0.5em'
  },
  networkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#FAFAFA'
  },
  menuItem: {
    height: '4em',
    '&:focus': {
      backgroundColor: 'rgba(200,205,200,0.5)'
    }
  },
  menuText: {
    '&:focus': {}
  },
  secondary: {
    width: '15em',
    display: 'flex',
    alignItems: 'center',
    padding: '0.2em'
  },
  plot: {
    width: '80%',
    background: 'teal'
  }
})

const checkCytoscapeConnection = props => {
  //console.log(props.uiState.urlParams)
  cyRESTApi
    .status(
      props.uiState.urlParams.has('cyrestport')
        ? props.uiState.urlParams.get('cyrestport')
        : 1234
    )
    .catch(e => {
      throw Error(e)
    })
    .then(res => handleErrors(res))
    .then(running => {
      props.uiStateActions.setCytoscapeStatus(true)
    })
    .catch(error => {
      props.uiStateActions.setCytoscapeStatus(false)
    })
}

const handleErrors = res => {
  //console.log('Calling!!', res)
  if (res !== undefined) {
    return true
  }

  return false
}

const NetworkList = props => {
  const { classes, hits, sourceUUID } = props

  const geneList = props.search.queryList

  const id = 0 //props.search.results.jobId

  const handleFetch = (networkUUID, nodeCount, edgeCount) => {
    props.networkActions.setNetworkSize({
      nodeCount,
      edgeCount
    })

    const networkSize = nodeCount + edgeCount

    // Do not load if size is too big to render!
    if (networkSize > NETWORK_SIZE_TH) {
      return
    }

    checkCytoscapeConnection(props)
    props.ndexUiStateActions.ndexNetworkFetchStarted({
      networkUUID: networkUUID
    })
  }

  const getListItem = (networkEntry, classes) => {
    const {
      name,
      externalId,
      percentOverlap,
      nodeCount,
      edgeCount
    } = networkEntry

    const imageURL =
      'http://v1.storage.cytoscape.io/images/' + externalId + '.png'

    return (
      <MenuItem
        className={classes.menuItem}
        alignItems="flex-start"
        key={externalId}
        onClick={val => handleFetch(externalId, nodeCount, edgeCount)}
      >
        <ListItemAvatar>
          <Avatar
            className={classes.networkAvatar}
            src={imageURL}
            onError={err => {
              if (err.target.src === no_image) {
                err.target.src = no_image
                err.target.onError = null
              } else {
                err.target.src = no_image
                err.target.onError = "this.src=''"
              }
            }}
          />
        </ListItemAvatar>
        <ListItemText
          className={classes.menuText}
          primary={name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                className={classes.inline}
                color="textPrimary"
              >
                {'Nodes: ' + nodeCount + ', Edges: ' + edgeCount}
              </Typography>
              <Typography variant="caption">{'UUID: ' + externalId}</Typography>
            </React.Fragment>
          }
        />

        {percentOverlap && (
          <ListItemSecondaryAction className={classes.secondary}>
            <div
              style={{
                background: 'teal',
                color: 'white',
                height: '2em',
                width: percentOverlap * 3 + 'px'
              }}
            >
              <Typography variant="body2" style={{ color: '#AAAAAA' }}>
                {percentOverlap + '%'}
              </Typography>
            </div>
          </ListItemSecondaryAction>
        )}
      </MenuItem>
    )
  }

  if (!hits) {
    return <div className="network-list-wrapper" />
  }

  return (
    <div className="network-list-wrapper">
      <Sorter />
      <div className="network-list">
        <MenuList>{hits.map(entry => getListItem(entry, classes))}</MenuList>
      </div>
    </div>
  )
}

export default withStyles(styles)(NetworkList)
